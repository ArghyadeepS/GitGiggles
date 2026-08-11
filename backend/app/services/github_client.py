import httpx
from typing import Dict, Any, Optional
from app.core.config import settings

class GitHubAPIError(Exception):
    def __init__(self, message: str, status_code: int = None):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class GitHubClient:
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.graphql_url = f"{self.base_url}/graphql"
        
        headers = {
            "Accept": "application/vnd.github.v3+json",
        }
        if settings.github_token:
            headers["Authorization"] = f"Bearer {settings.github_token}"
            
        self.client = httpx.AsyncClient(headers=headers, timeout=30.0)

    async def get_rest(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Any:
        """Helper to make REST GET requests"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = await self.client.get(url, params=params)
        
        if response.status_code == 404:
            raise GitHubAPIError("Not found", 404)
        if response.status_code != 200:
            raise GitHubAPIError(f"GitHub REST API error: {response.text}", response.status_code)
            
        return response.json()

    async def post_graphql(self, query: str, variables: Optional[Dict[str, Any]] = None) -> Any:
        """Helper to make GraphQL POST requests"""
        payload = {"query": query}
        if variables:
            payload["variables"] = variables
            
        response = await self.client.post(self.graphql_url, json=payload)
        
        if response.status_code != 200:
            raise GitHubAPIError(f"GitHub GraphQL API error: {response.text}", response.status_code)
            
        data = response.json()
        if "errors" in data:
            raise GitHubAPIError(f"GraphQL Errors: {data['errors']}", 400)
            
        return data["data"]
        
    async def close(self):
        await self.client.aclose()
