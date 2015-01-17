require 'rubygems'
require 'bundler'
Bundler.require(:default)
require "./lib/slim_helper.rb"

desc "best build system ever"
task :build do |t|
  
end

file 'index.html' => 'src/index.html.slim' do |t|
  o = Tilt.new(t.prerequisites.first).render(SlimHelper.new)
  File.open(t.name, 'w+').write(o)
end
