import httpx
import asyncio

async def main():
    async with httpx.AsyncClient(timeout=30.0) as client:
        print("Calling /api/analyze...")
        resp_analyze = await client.post("http://localhost:8000/api/analyze", json={"github_url": "octocat"})
        print("Analyze status:", resp_analyze.status_code)
        if resp_analyze.status_code == 200:
            print("Analyze success! Keys:", list(resp_analyze.json().keys()))
        else:
            print("Analyze error:", resp_analyze.text)

        print("Calling /api/roast...")
        resp_roast = await client.post("http://localhost:8000/api/roast", json={"github_url": "octocat"})
        print("Roast status:", resp_roast.status_code)
        if resp_roast.status_code == 200:
            print("Roast success! Keys:", list(resp_roast.json().keys()))
        else:
            print("Roast error:", resp_roast.text)

if __name__ == "__main__":
    asyncio.run(main())
