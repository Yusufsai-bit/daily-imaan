require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

# Internal Expo native module — not published to npm. The author/license
# attributes below are hardcoded because CocoaPods requires them, and
# `package.json` doesn't provide them (it's a private workspace module).
Pod::Spec.new do |s|
  s.name           = 'DailyImaanWidget'
  s.version        = package['version']
  s.summary        = package['description']
  s.license        = { :type => 'MIT' }
  s.authors        = { 'Daily Imaan' => 'support@dailyimaan.com' }
  s.homepage       = 'https://dailyimaan.com'
  s.platform       = :ios, '16.0'
  s.source         = { git: 'https://dailyimaan.com', tag: "#{s.version}" }
  s.source_files   = "ios/**/*.{swift,m,mm}"
  s.dependency 'ExpoModulesCore'
end
