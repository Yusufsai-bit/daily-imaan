require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'DailyImaanWidget'
  s.version        = package['version']
  s.summary        = package['description']
  s.license        = package['license']
  s.authors        = package['author']
  s.homepage       = 'https://github.com/dailyimaan'
  s.platform       = :ios, '16.0'
  s.source         = { git: '' }
  s.source_files   = "ios/**/*.{swift,m,mm}"
  s.dependency 'ExpoModulesCore'
end
