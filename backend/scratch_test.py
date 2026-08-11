import asyncio
import sys
from pydantic import BaseModel
from app.schemas.responses import (
    AnalysisResponse, ProfileSchema, RepositorySchema,
    ContributionsSchema, StatisticsSchema, CommitCountSchema, ScoredItemSchema
)
from app.services.roast_service import RoastService

# Create mock data
mock_profile = ProfileSchema(
    avatar="https://avatars.githubusercontent.com/u/5832347?v=4",
    username="octocat",
    display_name="The Octocat",
    bio="Testing GitGiggle backend logic",
    followers=150,
    following=9,
    company="GitHub",
    location="San Francisco",
    website="https://github.blog",
    twitter="octocat",
    email="octocat@github.com",
    hireable=True,
    created_at="2011-01-25T18:44:36Z",
    updated_at="2024-02-20T18:44:36Z",
    public_repositories=12
)

mock_repos = [
    RepositorySchema(
        name="hello-world",
        description="My first repository",
        language="JavaScript",
        topics=["hello-world", "tutorial"],
        stars=120,
        forks=40,
        watchers=120,
        open_issues=2,
        default_branch="main",
        size=1024,
        archived=False,
        forked=False,
        license="MIT",
        created_date="2011-01-26T18:44:36Z",
        updated_date="2024-01-26T18:44:36Z"
    ),
    RepositorySchema(
        name="test-repo",
        description="",
        language="Python",
        topics=[],
        stars=2,
        forks=0,
        watchers=2,
        open_issues=0,
        default_branch="master",
        size=512,
        archived=False,
        forked=False,
        license=None,
        created_date="2023-01-26T18:44:36Z",
        updated_date="2023-01-26T18:44:36Z"
    )
]

mock_languages = [
    ScoredItemSchema(name="JavaScript", score=15000),
    ScoredItemSchema(name="Python", score=5000)
]

mock_topics = [
    ScoredItemSchema(name="web", score=10),
    ScoredItemSchema(name="tutorial", score=5)
]

mock_personas = ["Frontend Developer", "Web Enthusiast"]

mock_statistics = StatisticsSchema(
    total_repositories=2,
    total_stars=122,
    total_forks=40,
    average_stars=61.0,
    average_forks=20.0,
    largest_repository="hello-world",
    most_starred_repository="hello-world",
    newest_repository="test-repo",
    oldest_repository="hello-world"
)

mock_commits = [
    CommitCountSchema(repo_name="hello-world", commits=15),
    CommitCountSchema(repo_name="test-repo", commits=3)
]

mock_contributions = ContributionsSchema(
    total_contributions=250,
    contribution_calendar={
        "totalContributions": 250,
        "weeks": [
            {
                "contributionDays": [
                    {"contributionCount": 5, "date": "2024-01-01"},
                    {"contributionCount": 0, "date": "2024-01-02"},
                    {"contributionCount": 8, "date": "2024-01-06"}, # Saturday
                    {"contributionCount": 12, "date": "2024-01-07"} # Sunday
                ]
            }
        ]
    }
)

mock_analysis = AnalysisResponse(
    profile=mock_profile,
    repositories=mock_repos,
    languages=mock_languages,
    topics=mock_topics,
    personas=mock_personas,
    statistics=mock_statistics,
    commits=mock_commits,
    contributions=mock_contributions
)

async def main():
    print("Initializing RoastService...")
    roast_service = RoastService()
    
    print("Generating roast modes...")
    try:
        roasts = await roast_service.generate_roast(mock_analysis)
        print("\n=== GENERATED ROASTS ===")
        for mode, text in roasts.items():
            print(f"\n[{mode.upper()}]:")
            print(text)
        print("\n=========================")
    except Exception as e:
        print(f"Error during roast generation: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
