import asyncio
from app.services.github_client import GitHubClient
from app.services.github_service import GitHubService
from app.services.roast_service import RoastService
from dotenv import load_dotenv

load_dotenv()

async def main():
    try:
        client = GitHubClient()
        service = GitHubService(client)
        print("Analyzing octocat...")
        analysis = await service.analyze_profile("octocat")
        print("Analysis successful. Profile name:", analysis.profile.display_name)
        
        print("Generating roast...")
        roast_service = RoastService()
        roasts = await roast_service.generate_roast(analysis)
        print("Roasts generated:", roasts)
    except Exception as e:
        print("Error:", e)
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(main())
