/*global $*/
function Range(name, start, end) {
    this.name = name;
    this.start = parseInt(start, 10);
    this.end = parseInt(end, 10);
    this.padding = start[0] === "0" ? start.length : 0;
    this.range = undefined;
}

Range.prototype.pad = function(value, length) {
    return (value.toString().length < length) ? this.pad("0"+value, length):value.toString();
};

Range.prototype.list = function(cb) {
  this.appendToList(cb, {});
};

Range.prototype.appendToList = function(cb, obj) {
  for(var i = this.start; i <= this.end; i++) {
      obj[this.name] = this.pad(i, this.padding);
      this.range ? this.range.appendToList(cb, obj) : cb(obj);
  }
};

function createRanges(string) {
  var count = 0;
  var firstRange;
  var currentRange;

  var rangesRegex = /\[(@([a-z]+):)?(\d+)-(\d+)\]/g;
  // "[@set:1-2]", "@set:", "set", "1", "2"
  
  // keeps track of already used range names. if a range name is encountered twice,
  // only the first one will be created, the second will be ignored and later be filled
  // with the values of hr first range
  var rangeNames = {};
  
  // keeps track of the order ranges are used in
  var ranges = [];
  var r;
  while(r = rangesRegex.exec(string)) {
    var name = r[2] || "_range_" + count;
    ranges.push(name);
    if(!rangeNames[name]) {
      rangeNames[name] = true;
      var newRange = new Range(name, r[3], r[4]);
      if(!firstRange) {
        currentRange = firstRange = newRange;
      } else {
        currentRange = currentRange.range = newRange;
      }
      count++;
    }
  }
  
  var parts = string.split(rangesRegex);
  var staticParts = [];
  for(var i=0; i < parts.length; i++) {
      if(i % 5 === 0){ staticParts.push(parts[i]); }
  }
  
  return {range: firstRange, staticParts: staticParts, ranges: ranges};
}

function generateStrings(string) {
  var rangeInfo = createRanges(string);
  var results = [];
  rangeInfo.range.list(function(values) {
    var result = "";
    for (var i=0; i < rangeInfo.staticParts.length; i++) {
      var insert;
      if(rangeInfo.ranges.length > i) {
        insert = values[rangeInfo.ranges[i]];
      } else {
        insert = "";
      }
      result += rangeInfo.staticParts[i] + insert;
    }
    results.push(result);
  });
  return results;
}

function fusk() {
		var foundCount = 0;

		var countDisplay = $("#count");
		countDisplay.text("-");
	
		var linkList = $("#linkList");
		linkList.val("");

		var container = $("#image-container");
		var width = parseInt($("#width").val(), 10);
		var resizeUrl = "http://scripts.roflzomfg.de/resize.php?width=" + width + "&url=";
		container.empty();
	
		generateStrings($("#url").val()).forEach(function(url, i) {
			var smallImgUrl = resizeUrl + encodeURIComponent(url);
			var a = $("<a>").attr("href", url).attr("target", "blank");
			var img = $("<img>").attr("src", smallImgUrl).css({width: width + "px"});
			img.error(function() {
				$(this).remove();
			});
			img.load(function() {
				foundCount++;
				countDisplay.text(foundCount);
				linkList.val(linkList.val() + url + "\n");
			});
			console.log(container);
			container.append(a.append(img));
		});
	}

$(function() {
	$("#fusk").click(fusk);
	$("#url").keypress(function(e) {
		if(e.which === 13) {
			fusk();
		}
	});
});



// http://i.cdn.turner.com/si/pr/subs/swimsuit/images/13/13_cintia-dicker_[01-40].jpg
//console.log(generateStrings("http://ssdfsf.sdfsdf.com/sdfsdf/[@set:1-2]/images/[001-003].jpg"));