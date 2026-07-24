# frozen_string_literal: true

require 'net/http'
require 'json'
require 'uri'

module Shipzy
  class Error < StandardError; end
  class AuthError < Error; end
  class ApiError < Error
    attr_reader :status_code
    def initialize(message, status_code)
      super(message)
      @status_code = status_code
    end
  end

  class Config
    attr_accessor :base_url, :token, :timeout_seconds

    def initialize
      @base_url = 'https://api.shipzy.me'
      @token = nil
      @timeout_seconds = 30
    end
  end

  class EpodClient
    def initialize(config = Config.new)
      @config = config
    end

    def set_token(token)
      @config.token = token
    end

    private

    def request(path, method: :get, body: nil)
      uri = URI.join(@config.base_url, path)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = uri.scheme == 'https'
      http.read_timeout = @config.timeout_seconds

      request_class = method == :post ? Net::HTTP::Post : Net::HTTP::Get
      request = request_class.new(uri.request_uri)
      request['Authorization'] = "Bearer #{@config.token}" if @config.token
      request['Content-Type'] = 'application/json'
      request.body = body.to_json if body

      response = http.request(request)

      case response.code.to_i
      when 401
        raise AuthError, 'Unauthorized'
      when 400..599
        raise ApiError.new("HTTP #{response.code}: #{response.body}", response.code.to_i)
      end

      JSON.parse(response.body)
    rescue JSON::ParserError
      {}
    end

    public

    def list(page: 1, page_size: 25, status: nil, tracking_no: nil)
      query = "page=#{page}&page_size=#{page_size}"
      query += "&status=#{URI.encode_www_form_component(status)}" if status
      query += "&tracking_no=#{URI.encode_www_form_component(tracking_no)}" if tracking_no
      request("/api/v1/shipment/epod/list?#{query}")
    end

    def get(epod_id)
      request("/api/v1/shipment/epod/#{epod_id}")
    end

    def generate_sign_url(epod_id)
      request("/api/v1/shipment/epod/#{epod_id}/sign", method: :post)
    end
  end
end
