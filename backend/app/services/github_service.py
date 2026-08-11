from typing import List, Dict, Any, Tuple
from app.services.github_client import GitHubClient, GitHubAPIError
from app.schemas.responses import (
    AnalysisResponse, ProfileSchema, RepositorySchema, 
    CommitCountSchema, ContributionsSchema, StatisticsSchema,
    ScoredItemSchema
)
import datetime

USER_ID_QUERY = """
query($login: String!) {
  user(login: $login) {
    id
  }
}
"""

PROFILE_REPOS_QUERY = """
query($login: String!, $cursor: String, $userId: ID!) {
  user(login: $login) {
    name
    login
    avatarUrl
    bio
    followers { totalCount }
    following { totalCount }
    company
    location
    websiteUrl
    twitterUsername
    email
    isHireable
    createdAt
    updatedAt
    repositories(first: 100, after: $cursor, ownerAffiliations: [OWNER], privacy: PUBLIC, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        name
        description
        primaryLanguage { name }
        languages(first: 10) {
          edges {
            size
            node { name }
          }
        }
        repositoryTopics(first: 10) {
          nodes {
            topic { name }
          }
        }
        stargazerCount
        forkCount
        watchers { totalCount }
        issues(states: OPEN) { totalCount }
        defaultBranchRef {
          name
          target {
            ... on Commit {
              history(author: {id: $userId}) {
                totalCount
              }
            }
          }
        }
        diskUsage
        isArchived
        isFork
        licenseInfo { name }
        createdAt
        updatedAt
      }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
"""

class GitHubService:
    def __init__(self, client: GitHubClient):
        self.client = client

    async def analyze_profile(self, username: str) -> AnalysisResponse:
        try:
            # 1. Get User Node ID
            id_data = await self.client.post_graphql(USER_ID_QUERY, {"login": username})
            if not id_data.get("user"):
                raise GitHubAPIError(f"User {username} not found", 404)
            user_id = id_data["user"]["id"]
            
            # 2. Fetch Profile, Contributions and Repositories (with pagination)
            repos_data = []
            has_next_page = True
            cursor = None
            user_data = None
            
            while has_next_page:
                variables = {"login": username, "cursor": cursor, "userId": user_id}
                page_data = await self.client.post_graphql(PROFILE_REPOS_QUERY, variables)
                
                if not user_data:
                    user_data = page_data["user"]
                
                repos = page_data["user"]["repositories"]
                if repos["nodes"]:
                    repos_data.extend(repos["nodes"])
                
                has_next_page = repos["pageInfo"]["hasNextPage"]
                cursor = repos["pageInfo"]["endCursor"]
                
            return self._build_analysis_response(user_data, repos_data)
        except Exception as e:
            if isinstance(e, GitHubAPIError):
                raise
            raise GitHubAPIError(f"Failed to analyze profile: {str(e)}", 500)
            
    def _build_analysis_response(self, user_data: Dict[str, Any], repos_data: List[Dict[str, Any]]) -> AnalysisResponse:
        # Build Profile Schema
        profile = ProfileSchema(
            avatar=user_data.get("avatarUrl"),
            username=user_data.get("login"),
            display_name=user_data.get("name"),
            bio=user_data.get("bio"),
            followers=user_data["followers"]["totalCount"],
            following=user_data["following"]["totalCount"],
            company=user_data.get("company"),
            location=user_data.get("location"),
            website=user_data.get("websiteUrl"),
            twitter=user_data.get("twitterUsername"),
            email=user_data.get("email"),
            hireable=user_data.get("isHireable"),
            created_at=user_data.get("createdAt"),
            updated_at=user_data.get("updatedAt"),
            public_repositories=user_data["repositories"]["totalCount"]
        )

        repositories = []
        commits = []
        language_scores = {}
        topic_scores = {}
        
        total_stars = 0
        total_forks = 0
        largest_repo = None
        max_size = -1
        most_starred = None
        max_stars = -1
        newest_repo = None
        newest_date = None
        oldest_repo = None
        oldest_date = None

        for repo in repos_data:
            if not repo:
                continue
                
            # Parse metrics
            stars = repo.get("stargazerCount", 0)
            forks = repo.get("forkCount", 0)
            size = repo.get("diskUsage", 0)
            created_at = repo.get("createdAt")
            
            # Default branch / Commits
            branch_ref = repo.get("defaultBranchRef")
            default_branch = branch_ref["name"] if branch_ref else None
            commit_count = 0
            if branch_ref and branch_ref.get("target") and "history" in branch_ref["target"]:
                commit_count = branch_ref["target"]["history"]["totalCount"]
            
            commits.append(CommitCountSchema(repo_name=repo["name"], commits=commit_count))
            
            # Languages parsing
            repo_lang = repo.get("primaryLanguage")
            primary_lang = repo_lang["name"] if repo_lang else None
            
            repo_languages = repo.get("languages", {}).get("edges", [])
            
            # Topics parsing
            repo_topics_nodes = repo.get("repositoryTopics", {}).get("nodes", [])
            repo_topics = [n["topic"]["name"] for n in repo_topics_nodes]
            
            # Calculate Repository Significance Score (RSS)
            rss = 10.0 + (stars * 2.0) + (forks * 1.0) + (commit_count * 0.5)
            
            # Distribute RSS
            if primary_lang:
                language_scores[primary_lang] = language_scores.get(primary_lang, 0.0) + rss
                
            for edge in repo_languages:
                lang_name = edge["node"]["name"]
                if lang_name != primary_lang:
                    language_scores[lang_name] = language_scores.get(lang_name, 0.0) + (rss * 0.2)
                    
            for t in repo_topics:
                topic_scores[t] = topic_scores.get(t, 0.0) + (rss * 0.5)
            
            # Stats aggregations
            total_stars += stars
            total_forks += forks
            
            if size > max_size:
                max_size = size
                largest_repo = repo["name"]
                
            if stars > max_stars:
                max_stars = stars
                most_starred = repo["name"]
                
            if created_at:
                dt = datetime.datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                if not newest_date or dt > newest_date:
                    newest_date = dt
                    newest_repo = repo["name"]
                if not oldest_date or dt < oldest_date:
                    oldest_date = dt
                    oldest_repo = repo["name"]

            # Construct RepositorySchema
            repositories.append(RepositorySchema(
                name=repo["name"],
                description=repo.get("description"),
                language=primary_lang,
                topics=repo_topics,
                stars=stars,
                forks=forks,
                watchers=repo.get("watchers", {}).get("totalCount", 0),
                open_issues=repo.get("issues", {}).get("totalCount", 0),
                default_branch=default_branch,
                size=size,
                archived=repo.get("isArchived", False),
                forked=repo.get("isFork", False),
                license=repo.get("licenseInfo", {}).get("name") if repo.get("licenseInfo") else None,
                created_date=repo.get("createdAt"),
                updated_date=repo.get("updatedAt")
            ))

        # Format Languages and Topics Output
        sorted_langs = sorted(language_scores.items(), key=lambda x: x[1], reverse=True)
        formatted_languages = [ScoredItemSchema(name=lang, score=round(score, 1)) for lang, score in sorted_langs[:15]]
        
        sorted_topics = sorted(topic_scores.items(), key=lambda x: x[1], reverse=True)
        formatted_topics = [ScoredItemSchema(name=topic, score=round(score, 1)) for topic, score in sorted_topics[:20]]
        
        # Persona Inference
        PERSONA_RULES = {
            "Machine Learning / AI": ["python", "jupyter notebook", "machine-learning", "deep-learning", "tensorflow", "pytorch", "ai", "keras", "scikit-learn"],
            "Data Science / Data Engineering": ["r", "python", "julia", "data-analysis", "pandas", "spark", "airflow", "data-science", "sql"],
            "Frontend": ["javascript", "typescript", "css", "html", "react", "vue", "angular", "ui", "frontend", "svelte", "nextjs"],
            "Backend": ["go", "rust", "java", "c#", "python", "ruby", "php", "backend", "api", "microservices", "database", "fastapi", "django", "spring", "nodejs", "c++"],
            "Mobile": ["swift", "kotlin", "dart", "objective-c", "ios", "android", "flutter", "react-native"],
            "DevOps / Cloud": ["shell", "go", "hcl", "docker", "kubernetes", "aws", "terraform", "ci-cd", "devops", "azure", "gcp"]
        }
        
        persona_scores = {p: 0.0 for p in PERSONA_RULES}
        for item in formatted_languages + formatted_topics:
            name_lower = item.name.lower()
            for persona, keywords in PERSONA_RULES.items():
                if name_lower in keywords:
                    persona_scores[persona] += item.score
                    
        # Identify top personas (e.g. above 10% of max score or top 2)
        total_persona_score = sum(persona_scores.values())
        detected_personas = []
        if total_persona_score > 0:
            sorted_personas = sorted(persona_scores.items(), key=lambda x: x[1], reverse=True)
            max_persona_score = sorted_personas[0][1]
            for persona, score in sorted_personas:
                # Add persona if it has a meaningful score relative to the top persona
                if score > 0 and score >= (max_persona_score * 0.3):
                    detected_personas.append(persona)
        
        # Statistics
        total_repos = len(repositories)
        statistics = StatisticsSchema(
            total_repositories=total_repos,
            total_stars=total_stars,
            total_forks=total_forks,
            average_stars=round(total_stars / total_repos, 2) if total_repos > 0 else 0,
            average_forks=round(total_forks / total_repos, 2) if total_repos > 0 else 0,
            largest_repository=largest_repo,
            most_starred_repository=most_starred,
            newest_repository=newest_repo,
            oldest_repository=oldest_repo
        )
        
        # Contributions
        contrib_calendar = user_data.get("contributionsCollection", {}).get("contributionCalendar", {})
        contributions = ContributionsSchema(
            total_contributions=contrib_calendar.get("totalContributions", 0),
            contribution_calendar=contrib_calendar
        )

        return AnalysisResponse(
            profile=profile,
            repositories=repositories,
            languages=formatted_languages,
            topics=formatted_topics,
            personas=detected_personas,
            statistics=statistics,
            commits=commits,
            contributions=contributions
        )
