class SlimHelper
  
  def inline_css(file_name)
    content = File.read(file_name)
    "<link rel='stylesheet'>" + content + "</link>"
  end
  
  def inline_js(file_name)
    content = File.read(file_name)
    "<script>" + content + "</script>"
  end
  
end