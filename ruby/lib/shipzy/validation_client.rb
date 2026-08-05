# frozen_string_literal: true

require_relative '../shipzy'

module Shipzy
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
end
