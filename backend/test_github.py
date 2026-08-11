import asyncio
from app.services.github_client import GitHubClient
from app.services.github_service import GitHubService

async def test():
    client = GitHubClient()
    svc = GitHubService(client)
    try:
        res = await svc.analyze_profile('torvalds')
        print('Success! Repos:', len(res.repositories))
    except Exception as e:
        print('Error:', e)
    finally:
        await client.close()

asyncio.run(test())
