# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = 'zymeup-sdk'
  spec.version       = '2.0.2'
  spec.authors       = ['Zymeup']
  spec.email         = ['support@zymeup.com']
  spec.summary       = 'Official Zymeup logistics platform SDK for Ruby'
  spec.description   = 'Ruby SDK for Zymeup logistics platform - EPOD management, tracking, and more'
  spec.homepage      = 'https://github.com/alaikis/shipzy-sdks'
  spec.license       = 'MIT'
  spec.required_ruby_version = '>= 3.0'

  spec.files         = Dir['lib/**/*', 'README.md', 'LICENSE']
  spec.require_paths = ['lib']

  spec.metadata['source_code_uri'] = spec.homepage
  spec.metadata['rubygems_mfa_required'] = 'false'
end
