# frozen_string_literal: true

require 'net/http'
require 'json'
require 'uri'
require 'securerandom'

module Zymeup
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
      @base_url = 'https://api.zymeup.com'
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

    def request(path, method: :get, body: nil, file: nil)
      uri = URI.join(@config.base_url, path)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = uri.scheme == 'https'
      http.read_timeout = @config.timeout_seconds

      if file
        boundary = "----RubySDKBoundary#{SecureRandom.uuid}"
        request = Net::HTTP::Post.new(uri)
        request['Authorization'] = auth_header if @config.token
        request['Content-Type'] = "multipart/form-data; boundary=#{boundary}"
        form_data = [
          "Content-Disposition: form-data; name=\"file\"; filename=\"#{File.basename(file_path)}\"",
          "Content-Type: application/octet-stream",
          "",
          File.binread(file)
        ].join("\r\n")
        request.body = form_data
      else
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
      end

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

    def capture_proof(id, data)
      request("/api/v1/shipment/epod/#{id}/capture-proof", method: :post, body: data)
    end

    def upload_photo(id, file_path)
      uri = URI.join(@config.base_url, "/api/v1/shipment/epod/#{id}/upload-photo")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = uri.scheme == 'https'
      http.read_timeout = @config.timeout_seconds
      boundary = "----RubySDKBoundary#{SecureRandom.uuid}"
      request = Net::HTTP::Post.new(uri)
      request['Authorization'] = auth_header if @config.token
      request['Content-Type'] = "multipart/form-data; boundary=#{boundary}"
      file_content = File.binread(file_path)
      form_body = [
        "--#{boundary}",
        "Content-Disposition: form-data; name=\"file\"; filename=\"#{File.basename(file_path)}\"",
        "Content-Type: application/octet-stream",
        "",
        file_content,
        "--#{boundary}--"
      ].join("\r\n")
      request.body = form_body
      response = http.request(request)
      JSON.parse(response.body)
    rescue JSON::ParserError
      {}
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

  class ActivationClient < HttpClient
    def list_providers(capability: nil)
      q = build_query({ capability: capability })
      request("/api/v1/marketplace/providers#{q}")
    end

    def get_provider(slug)
      request("/api/v1/marketplace/providers/#{slug}")
    end

    def list(page: 1, page_size: 25)
      q = build_query({ page: page, page_size: page_size })
      request("/api/v1/marketplace/activations#{q}")
    end

    def get(id)
      request("/api/v1/marketplace/activations/#{id}")
    end

    def activate(data)
      request('/api/v1/marketplace/activations', method: :post, body: data)
    end

    def pause(id)
      request("/api/v1/marketplace/activations/#{id}/pause", method: :post)
    end

    def resume(id)
      request("/api/v1/marketplace/activations/#{id}/resume", method: :post)
    end

    def revoke(id, reason: nil)
      request("/api/v1/marketplace/activations/#{id}/revoke", method: :post, body: { reason: reason }.compact)
    end
  end

  class AgeVerificationClient < HttpClient
    def create(data)
      request('/api/v1/age-verifications', method: :post, body: data)
    end

    def list_by_parcel(parcel_id)
      q = build_query({ parcel_id: parcel_id })
      request("/api/v1/age-verifications#{q}")
    end

    def list_by_order(order_id)
      q = build_query({ order_id: order_id })
      request("/api/v1/age-verifications#{q}")
    end
  end

  class PickupPointClient < HttpClient
    def list(active_only: nil)
      q = build_query({ active_only: active_only })
      request("/api/v1/admin/pickup-points#{q}")
    end

    def get(id)
      request("/api/v1/admin/pickup-points/#{id}")
    end

    def create(data)
      request('/api/v1/admin/pickup-points', method: :post, body: data)
    end

    def update(id, data)
      request("/api/v1/admin/pickup-points/#{id}", method: :put, body: data)
    end

    def deactivate(id)
      request("/api/v1/admin/pickup-points/#{id}/deactivate", method: :post)
    end
  end

  class ProductClient < HttpClient
    def list(status: nil, category: nil, search: nil, active_only: nil)
      q = build_query({ status: status, category: category, search: search, active_only: active_only })
      request("/api/v1/products#{q}")
    end

    def get(id)
      request("/api/v1/products/#{id}")
    end

    def create(data)
      request('/api/v1/products', method: :post, body: data)
    end

    def update(id, data)
      request("/api/v1/products/#{id}", method: :put, body: data)
    end

    def retire(id)
      request("/api/v1/products/#{id}/retire", method: :post)
    end
  end

  class FinanceClient < HttpClient
    def invoices
      request('/api/finance/invoices')
    end

    def list_subscriptions
      request('/api/finance/subscriptions')
    end

    def cancel_subscription(id)
      request("/api/finance/subscriptions/#{id}/cancel", method: :post)
    end

    def restore_subscription(id)
      request("/api/finance/subscriptions/#{id}/restore", method: :post)
    end

    def download_invoice(id)
      request("/api/v1/merchant/invoices/#{id}/download")
    end
  end

  class NotificationClient < HttpClient
    DELIVERY_MODES = %w[carrier self-delivery self-pickup].freeze
    NOTIFICATION_CHANNELS = %w[email copy_url sms whatsapp].freeze

    def self.validate_channel_requirements(channel, data)
      case channel
      when 'email'
        data[:recipient_email] && !data[:recipient_email].empty?
      when 'sms'
        data[:recipient_phone] && !data[:recipient_phone].empty?
      when 'whatsapp'
        data[:recipient_phone] && !data[:recipient_phone].empty?
      when 'copy_url'
        true
      else
        false
      end
    end
  end

  class SupportTicketClient < HttpClient
    def create(data)
      request('/shipment/support/tickets', method: :post, body: data)
    end

    def list(status: nil)
      q = build_query({ status: status })
      request("/shipment/support/tickets#{q}")
    end

    def get(id)
      request("/shipment/support/tickets/#{id}")
    end

    def add_message(id, content)
      request("/shipment/support/tickets/#{id}/messages", method: :post, body: { content: content })
    end

    def admin_list(status: nil, priority: nil)
      q = build_query({ status: status, priority: priority })
      request("/api/v1/admin/support/tickets#{q}")
    end

    def admin_update(id, data)
      request("/api/v1/admin/support/tickets/#{id}", method: :patch, body: data)
    end

    def admin_reply(id, content)
      request("/api/v1/admin/support/tickets/#{id}/messages", method: :post, body: { content: content })
    end

    def admin_stats
      request('/api/v1/admin/support/stats')
    end
  end

  class ValidationClient < HttpClient
    def verify_phone(country_code, phone)
      request('/api/v1/validation/phone', method: :post, body: { country_code: country_code, phone: phone })
    end

    def format_phone(country_code, phone)
      request('/api/v1/validation/phone/format', method: :post, body: { country_code: country_code, phone: phone })
    end

    def validate_postal_code(country_code, code)
      request('/api/v1/validation/postal-code', method: :post, body: { country_code: country_code, code: code })
    end

    def validate_email(email)
      request('/api/v1/validation/email', method: :post, body: { email: email })
    end

    def validate_tax_id(country_code, tax_id)
      request('/api/v1/validation/tax-id', method: :post, body: { country_code: country_code, tax_id: tax_id })
    end
  end

  class TrackingClient < HttpClient
    def detail(tracking_no)
      request("/api/v1/tracking/#{URI.encode_www_form_component(tracking_no)}")
    end

    def list(page: 1, page_size: 25, status: nil, tracking_no: nil)
      q = build_query({ page: page, page_size: page_size, status: status, tracking_no: tracking_no }.compact)
      base_path = @config.carrier? ? '/api/v1/carrier/tracking/list' : '/api/v1/merchant/tracking/list'
      request("#{base_path}#{q}")
    end
  end

  class UploadClient < HttpClient
    def upload_file(endpoint, file_path)
      request(endpoint, method: :post, file: file_path)
    end

    def branding_upload_logo(file_path)
      upload_file('/api/v1/merchant/branding/logo', file_path)
    end
  end

  class PublicEpodClient
    def initialize(base_url = 'https://api.zymeup.com')
      @base_url = base_url.chomp('/')
    end

    def sign_detail(sign_token)
      resp = Net::HTTP.get(URI("#{@base_url}/api/v1/open/epod/sign/#{sign_token}"))
      JSON.parse(resp)
    end

    def consent(sign_token, consent_types, policy_version_hash)
      uri = URI("#{@base_url}/api/v1/open/epod/sign/#{sign_token}/consent")
      req = Net::HTTP::Post.new(uri)
      req['Content-Type'] = 'application/json'
      req.body = JSON.generate({ consent_types: consent_types, policy_version_hash: policy_version_hash })
      resp = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') { |http| http.request(req) }
      JSON.parse(resp.body)
    end

    def capture(sign_token, consent_id, signature_data, proof_type: 'signature')
      uri = URI("#{@base_url}/api/v1/open/epod/sign/#{sign_token}/capture")
      req = Net::HTTP::Post.new(uri)
      req['Content-Type'] = 'application/json'
      req.body = JSON.generate({ consent_id: consent_id, signature_data: signature_data, proof_type: proof_type })
      resp = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') { |http| http.request(req) }
      JSON.parse(resp.body)
    end
  end

  class CarrierClient < HttpClient
    def list(page: 1, page_size: 25, state: nil)
      q = build_query({ page: page, page_size: page_size, state: state }.compact)
      request("/api/v1/carrier/list#{q}")
    end

    def get(id)
      request("/api/v1/carrier/#{URI.encode_www_form_component(id)}")
    end

    def create(data)
      request('/api/v1/carrier', method: :post, body: data)
    end

    def update(id, data)
      request("/api/v1/carrier/#{URI.encode_www_form_component(id)}", method: :put, body: data)
    end

    def delete(id)
      request("/api/v1/carrier/#{URI.encode_www_form_component(id)}", method: :delete)
    end
  end

  class PlatformConfigClient < HttpClient
    def list
      request('/api/v1/admin/platform-configs')
    end

    def update(id, data)
      request("/api/v1/admin/platform-configs/#{URI.encode_www_form_component(id)}", method: :put, body: data)
    end
  end

  class ComplianceClient < HttpClient
    def check(data)
      request('/api/v1/compliance/check', method: :post, body: data)
    end

    def country_requirements(country_code)
      request("/api/v1/compliance/requirements/#{URI.encode_www_form_component(country_code)}")
    end

    def customs_create(data)
      request('/api/v1/compliance/customs', method: :post, body: data)
    end

    def customs_get(id)
      request("/api/v1/compliance/customs/#{URI.encode_www_form_component(id)}")
    end

    def hscode_validate(hs_code)
      request("/api/v1/compliance/hscode/#{URI.encode_www_form_component(hs_code)}/validate")
    end

    def prohibited_items
      request('/api/v1/compliance/prohibited')
    end
  end

  class CpscClient < HttpClient
    def settings
      request('/api/v1/cpsc/collections')
    end

    def import_data(data)
      request('/api/v1/cpsc/import', method: :post, body: data)
    end

    def import_status(import_id)
      request("/api/v1/cpsc/import/#{URI.encode_www_form_component(import_id)}/status")
    end

    def export_data(filter = {})
      q = build_query(filter)
      request("/api/v1/cpsc/export#{q}")
    end

    def export_async(filter = {})
      q = build_query(filter)
      request("/api/v1/cpsc/export-async#{q}")
    end

    def export_async_status(export_id)
      request("/api/v1/cpsc/export-async/#{URI.encode_www_form_component(export_id)}/status")
    end

    def export_async_data(export_id)
      request("/api/v1/cpsc/export-async/#{URI.encode_www_form_component(export_id)}/data")
    end

    def certificates(data)
      request('/api/v1/cpsc/certificates', method: :post, body: data)
    end

    def trade_parties(party_type: nil)
      q = party_type ? "?tradePartyType=#{URI.encode_www_form_component(party_type)}" : ""
      request("/api/v1/cpsc/trade-parties#{q}")
    end

    def token_expiration
      request('/api/v1/cpsc/token-expiration')
    end
  end

  class ZymeupClient
    attr_reader :epod, :order, :ecmr, :address, :carrier_epod, :carrier_address,
                :activation, :age_verification, :pickup_point, :product,
                :finance, :notification, :support_ticket, :validation, :role,
                :tracking, :upload, :public_epod, :carrier, :platform_config,
                :compliance, :cpsc

    def initialize(config = Config.new)
      @role = config.role
      @epod = EpodClient.new(config)
      @order = OrderClient.new(config)
      @ecmr = EcmrClient.new(config)
      @address = AddressClient.new(config)
      @carrier_epod = CarrierEpodClient.new(config)
      @carrier_address = CarrierAddressClient.new(config)
      @activation = ActivationClient.new(config)
      @age_verification = AgeVerificationClient.new(config)
      @pickup_point = PickupPointClient.new(config)
      @product = ProductClient.new(config)
      @finance = FinanceClient.new(config)
      @notification = NotificationClient.new(config)
      @support_ticket = SupportTicketClient.new(config)
      @validation = ValidationClient.new(config)
      @tracking = TrackingClient.new(config)
      @upload = UploadClient.new(config)
      @public_epod = PublicEpodClient.new(config.base_url)
      @carrier = CarrierClient.new(config)
      @platform_config = PlatformConfigClient.new(config)
      @compliance = ComplianceClient.new(config)
      @cpsc = CpscClient.new(config)
    end

    def update_token(token)
      @epod.set_token(token)
      @order.set_token(token)
      @ecmr.set_token(token)
      @address.set_token(token)
      @carrier_epod.set_token(token)
      @carrier_address.set_token(token)
      @activation.set_token(token)
      @age_verification.set_token(token)
      @pickup_point.set_token(token)
      @product.set_token(token)
      @finance.set_token(token)
      @notification.set_token(token)
      @support_ticket.set_token(token)
      @validation.set_token(token)
      @tracking.set_token(token)
      @upload.set_token(token)
      @carrier.set_token(token)
      @platform_config.set_token(token)
      @compliance.set_token(token)
      @cpsc.set_token(token)
    end

    def merchant?
      @role == :merchant
    end

    def carrier?
      @role == :carrier
    end
  end

  VERSION = '2.0.2'
end
