# frozen_string_literal: true

require 'rspec'
require_relative '../lib/shipzy'

RSpec.describe Shipzy::EpodClient do
  let(:config) { Shipzy::Config.new }
  subject { described_class.new(config) }

  describe '#initialize' do
    it 'creates a client with default config' do
      expect(subject).to be_a(described_class)
    end

    it 'creates a client with custom config' do
      config.base_url = 'http://localhost:1417'
      config.token = 'test-token'
      config.timeout_seconds = 60
      client = described_class.new(config)
      expect(client).to be_a(described_class)
    end
  end

  describe '#set_token' do
    it 'updates the token' do
      expect { subject.set_token('new-token') }.not_to raise_error
    end
  end
end

RSpec.describe Shipzy::Config do
  subject { described_class.new }

  it 'has correct default values' do
    expect(subject.base_url).to eq('https://api.shipzy.me')
    expect(subject.token).to be_nil
    expect(subject.timeout_seconds).to eq(30)
  end

  it 'allows overriding values' do
    subject.base_url = 'http://localhost:1417'
    subject.token = 'my-token'
    subject.timeout_seconds = 60
    expect(subject.base_url).to eq('http://localhost:1417')
    expect(subject.token).to eq('my-token')
    expect(subject.timeout_seconds).to eq(60)
  end
end

RSpec.describe Shipzy do
  it 'has a version' do
    expect(Shipzy::VERSION).not_to be_nil
  end
end
