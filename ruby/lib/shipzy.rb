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
    attr_accessor :base_url, :token, :timeout_seconds, :role, :carrier_code

    def initialize
      @base_url = 'https://api.shipzy.me'
      @token = nil
      @timeout_seconds = 30
      @role = :merchant
      @carrier_code = nil
    end

    def merchant?
      @role == :merchant
    end

    def carrier?
      @role == :carrier
    end
  end

  class HttpClient
    def initialize(config = Config.new)
      @config = config
    end

    def set_token(token)
      @config.token = token
    end

    protected

    def auth_header
      if @config.carrier? && @config.carrier_code && @config.token
        "Bearer #{@config.carrier_code}:#{@config.token}"
      else
        "Bearer #{@config.token}"
      end
    end

    def request(path, method: :get, body: nil)
      uri = URI.join(@config.base_url, path)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = uri.scheme == 'https'
      http.read_timeout = @config.timeout_seconds

      request_class = case method
                      when :post then Net::HTTP::Post
                      when :put then Net::HTTP::Put
                      when :delete then Net::HTTP::Delete
                      else Net::HTTP::Get
                      end

      request = request_class.new(uri.request_uri)
      request['Authorization'] = auth_header if @config.token
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

    def build_query(params)
      parts = []
      params.each { |k, v| parts << "#{URI.encode_www_form_component(k.to_s)}=#{URI.encode_www_form_component(v.to_s)}" if v }
      parts.empty? ? '' : '?' + parts.join('&')
    end
  end

  class EpodClient < HttpClient
    def list(page: 1, page_size: 25, status: nil, tracking_no: nil)
      q = build_query({ page: page, page_size: page_size, status: status, tracking_no: tracking_no })
      request("/api/v1/shipment/epod/list#{q}")
    end

    def get(id)
      request("/api/v1/shipment/epod/#{id}")
    end

    def create(data)
      request('/api/v1/shipment/epod/create', method: :post, body: data)
    end

    def generate_from_order(order_id, options = {})
      request('/api/v1/shipment/epod/generate-from-order', method: :post, body: { order_id: order_id }.merge(options))
    end

    def update(id, data)
      request("/api/v1/shipment/epod/#{id}/update", method: :put, body: data)
    end

    def deliver(id, data = {})
      request("/api/v1/shipment/epod/#{id}/delivery", method: :post, body: data)
    end

    def fail(id, remark)
      request("/api/v1/shipment/epod/#{id}/fail", method: :post, body: { remark: remark })
    end

    def generate_sign_url(id)
      request("/api/v1/shipment/epod/#{id}/sign", method: :post)
    end

    def generate_pdf(id)
      request("/api/v1/shipment/epod/#{id}/pdf", method: :post)
    end

    def verify(id)
      request("/api/v1/shipment/epod/#{id}/verify", method: :post)
    end
  end

  class OrderClient < HttpClient
    def list(page: 1, page_size: 25, status: nil)
      q = build_query({ page: page, page_size: page_size, status: status })
      request("/api/v1/order/list#{q}")
    end

    def get(id)
      request("/api/v1/order/#{id}")
    end

    def create(data)
      request('/api/v1/order/create', method: :post, body: data)
    end

    def create_with_documents(data)
      request('/api/v1/order/create-with-documents', method: :post, body: data)
    end

    def update(id, data)
      request("/api/v1/order/#{id}/update", method: :post, body: data)
    end

    def cancel(id)
      request("/api/v1/order/#{id}/cancel", method: :post)
    end
  end

  class EcmrClient < HttpClient
    def list(page: 1, page_size: 25)
      q = build_query({ page: page, page_size: page_size })
      request("/api/v1/shipment/ecmr/list#{q}")
    end

    def get(id)
      request("/api/v1/shipment/ecmr/#{id}")
    end

    def create(data)
      request('/api/v1/shipment/ecmr/create', method: :post, body: data)
    end

    def generate_from_order(order_id)
      request('/api/v1/shipment/ecmr/generate-from-order', method: :post, body: { order_id: order_id })
    end

    def sign(id)
      request("/api/v1/shipment/ecmr/#{id}/sign", method: :post)
    end

    def pdf(id)
      request("/api/v1/shipment/ecmr/#{id}/pdf", method: :post)
    end
  end

  class AddressClient < HttpClient
    def list(params = {})
      request('/api/v1/merchant/addresses/list', method: :post, body: params)
    end

    def create(data)
      request('/api/v1/merchant/addresses/create', method: :post, body: data)
    end

    def update(id, data)
      request("/api/v1/merchant/addresses/#{id}/update", method: :post, body: data)
    end

    def delete(id)
      request("/api/v1/merchant/addresses/#{id}/delete", method: :post)
    end

    def set_default(id)
      request("/api/v1/merchant/addresses/#{id}/set-default", method: :post)
    end
  end

  class CarrierEpodClient < HttpClient
    def list(page: 1, page_size: 25, status: nil)
      q = build_query({ page: page, page_size: page_size, status: status })
      request("/api/v1/carrier/epod/list#{q}")
    end

    def get(id)
      request("/api/v1/carrier/epod/#{id}")
    end

    def deliver(id, data = {})
      request("/api/v1/carrier/epod/#{id}/delivery", method: :post, body: data)
    end

    def fail(id, remark)
      request("/api/v1/carrier/epod/#{id}/fail", method: :post, body: { remark: remark })
    end

    def upload_photo(id, photo_url)
      request("/api/v1/carrier/epod/#{id}/photo", method: :post, body: { photo_url: photo_url })
    end

    def capture_proof(id, data)
      request("/api/v1/carrier/epod/#{id}/capture-proof", method: :post, body: data)
    end
  end

  class CarrierAddressClient < HttpClient
    def list(params = {})
      request('/api/v1/carrier/sdk/addresses/list', method: :post, body: params)
    end

    def create(data)
      request('/api/v1/carrier/sdk/addresses/create', method: :post, body: data)
    end

    def update(id, data)
      request("/api/v1/carrier/sdk/addresses/#{id}/update", method: :post, body: data)
    end

    def delete(id)
      request("/api/v1/carrier/sdk/addresses/#{id}/delete", method: :post)
    end

    def set_default(id)
      request("/api/v1/carrier/sdk/addresses/#{id}/set-default", method: :post)
    end
  end

  class ShipzyClient
    attr_reader :epod, :order, :ecmr, :address, :carrier_epod, :carrier_address, :role

    def initialize(config = Config.new)
      @role = config.role
      @epod = EpodClient.new(config)
      @order = OrderClient.new(config)
      @ecmr = EcmrClient.new(config)
      @address = AddressClient.new(config)
      @carrier_epod = CarrierEpodClient.new(config)
      @carrier_address = CarrierAddressClient.new(config)
    end

    def update_token(token)
      @epod.set_token(token)
      @order.set_token(token)
      @ecmr.set_token(token)
      @address.set_token(token)
      @carrier_epod.set_token(token)
      @carrier_address.set_token(token)
    end

    def merchant?
      @role == :merchant
    end

    def carrier?
      @role == :carrier
    end
  end

  VERSION = '1.0.0'
end
