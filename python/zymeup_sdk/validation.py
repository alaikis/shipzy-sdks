"""Zymeup Python SDK - Validation Client"""
from typing import Dict, Any


class ValidationClient:
    """Validation client for phone, postal code, email, and tax ID"""

    def __init__(self, client):
        self._client = client

    def verify_phone(self, country_code: str, phone: str) -> Dict[str, Any]:
        """Verify phone number validity and get formatted version"""
        return self._client.request("POST", "/api/v1/validation/phone", json={
            "country_code": country_code,
            "phone": phone,
        })

    def format_phone(self, country_code: str, phone: str) -> Dict[str, Any]:
        """Format phone number to E.164 standard"""
        return self._client.request("POST", "/api/v1/validation/phone/format", json={
            "country_code": country_code,
            "phone": phone,
        })

    def validate_postal_code(self, country_code: str, code: str) -> Dict[str, Any]:
        """Validate postal code for a country"""
        return self._client.request("POST", "/api/v1/validation/postal-code", json={
            "country_code": country_code,
            "code": code,
        })

    def validate_email(self, email: str) -> Dict[str, Any]:
        """Validate email address"""
        return self._client.request("POST", "/api/v1/validation/email", json={
            "email": email,
        })

    def validate_tax_id(self, country_code: str, tax_id: str) -> Dict[str, Any]:
        """Validate tax ID / VAT number"""
        return self._client.request("POST", "/api/v1/validation/tax-id", json={
            "country_code": country_code,
            "tax_id": tax_id,
        })
