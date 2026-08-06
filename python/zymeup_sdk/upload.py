"""Zymeup Python SDK - Upload Client"""
from typing import Dict, Any, Optional


class UploadClient:
    """File upload client"""

    def __init__(self, client):
        self._client = client

    def upload(self, file, filename: Optional[str] = None, category: Optional[str] = None) -> Dict[str, Any]:
        """Upload a file"""
        files = {"file": (filename or file.name, file)}
        data: Dict[str, Any] = {}
        if category:
            data["category"] = category
        return self._client.request("POST", "/api/v1/upload", files=files, data=data)
