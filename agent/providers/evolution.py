import httpx
import os
import json

class EvolutionProvider:
    def __init__(self):
        self.base_url = os.getenv("EVOLUTION_URL", "http://localhost:8080")
        self.api_key = os.getenv("EVOLUTION_API_KEY", "architect_admin_key")

    async def create_instance(self, instance_name: str):
        url = f"{self.base_url}/instance/create"
        headers = {"apikey": self.api_key}
        data = {
            "instanceName": instance_name,
            "token": "",
            "qrcode": True
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, headers=headers)
            return response.json()

    async def get_qr(self, instance_name: str):
        url = f"{self.base_url}/instance/connect/{instance_name}"
        headers = {"apikey": self.api_key}
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            return response.json()

    async def get_instances(self):
        url = f"{self.base_url}/instance/fetchInstances"
        headers = {"apikey": self.api_key}
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            return response.json()

    async def send_message(self, instance_name: str, number: str, text: str):
        url = f"{self.base_url}/message/sendText/{instance_name}"
        headers = {"apikey": self.api_key}
        data = {
            "number": number,
            "options": {"delay": 1200, "presence": "composing", "linkPreview": False},
            "textMessage": {"text": text}
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, headers=headers)
            return response.json()
