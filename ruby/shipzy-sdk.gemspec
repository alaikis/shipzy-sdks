# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = 'shipzy-sdk'
  spec.version       = '0.1.0.alpha.1'
  spec.authors       = ['Shipzy']
  spec.email         = ['support@shipzy.me']
  spec.summary       = 'Official Shipzy logistics platform SDK for Ruby'
  spec.description   = 'Ruby SDK for Shipzy logistics platform - EPOD management, tracking, and more'
  spec.homepage      = 'https://github.com/alaikis/shipzy-sdks'
  spec.license       = 'MIT'
  spec.required_ruby_version = '>= 3.0'

  spec.files         = Dir['lib/**/*', 'README.md', 'LICENSE']
  spec.require_paths = ['lib']

  spec.metadata['source_code_uri'] = spec.homepage
  spec.metadata['rubygems_mfa_required'] = 'false'
end
