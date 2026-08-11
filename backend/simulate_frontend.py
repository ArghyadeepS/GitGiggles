import asyncio
import httpx
import json

async def run():
    async with httpx.AsyncClient() as client:
        print("Fetching analysis...")
        res = await client.post("http://localhost:8000/api/analyze", json={"github_url": "octocat"})
        analysis = res.json()
        print("Analysis keys:", list(analysis.keys()))
        
        print("Fetching roast...")
        res = await client.post("http://localhost:8000/api/roast", json={"github_url": "octocat"})
        roast = res.json()
        print("Roast keys:", list(roast.keys()))
        print("Roast brutal:", roast.get("brutal")[:50] + "...")

if __name__ == "__main__":
    asyncio.run(run())
