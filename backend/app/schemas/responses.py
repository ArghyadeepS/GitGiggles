from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class ProfileSchema(BaseModel):
    avatar: Optional[str]
    username: str
    display_name: Optional[str]
    bio: Optional[str]
    followers: int
    following: int
    company: Optional[str]
    location: Optional[str]
    website: Optional[str]
    twitter: Optional[str]
    email: Optional[str]
    hireable: Optional[bool]
    created_at: Optional[str]
    updated_at: Optional[str]
    public_repositories: int

class RepositorySchema(BaseModel):
    name: str
    description: Optional[str]
    language: Optional[str]
    topics: List[str]
    stars: int
    forks: int
    watchers: int
    open_issues: int
    default_branch: Optional[str]
    size: int
    archived: bool
    forked: bool
    license: Optional[str]
    created_date: Optional[str]
    updated_date: Optional[str]

class CommitCountSchema(BaseModel):
    repo_name: str
    commits: int

class ContributionsSchema(BaseModel):
    total_contributions: int
    contribution_calendar: Dict[str, Any]

class StatisticsSchema(BaseModel):
    total_repositories: int
    total_stars: int
    total_forks: int
    average_stars: float
    average_forks: float
    largest_repository: Optional[str]
    most_starred_repository: Optional[str]
    newest_repository: Optional[str]
    oldest_repository: Optional[str]

class ScoredItemSchema(BaseModel):
    name: str
    score: float

class AnalysisResponse(BaseModel):
    profile: ProfileSchema
    repositories: List[RepositorySchema]
    languages: List[ScoredItemSchema]
    topics: List[ScoredItemSchema]
    personas: List[str]
    statistics: StatisticsSchema
    commits: List[CommitCountSchema]
    contributions: ContributionsSchema

class RoastResponse(BaseModel):
    brutal: str
    friendly: str
    recruiter: str
    hacker: str
    username: str
