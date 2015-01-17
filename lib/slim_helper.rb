class SlimHelper
  
  def inline_css(file_name)
    content = File.read(file_name)
    "<style>" + content + "</style>"
  end
  
  def inline_js(file_name)
    content = File.read(file_name)
    "<script>" + content + "</script>"
  end
  
end
