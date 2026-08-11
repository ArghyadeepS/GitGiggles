from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.utils.parsers import extract_github_username
from app.services.github_client import GitHubClient, GitHubAPIError
from app.services.github_service import GitHubService
from app.services.roast_service import RoastService
from app.schemas.responses import AnalysisResponse, RoastResponse

router = APIRouter()

class AnalyzeRequest(BaseModel):
    github_url: str

async def get_github_service():
    client = GitHubClient()
    try:
        yield GitHubService(client)
    finally:
        await client.close()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_profile(
    request: AnalyzeRequest, 
    service: GitHubService = Depends(get_github_service)
):
    username = extract_github_username(request.github_url)
    if not username:
        raise HTTPException(status_code=400, detail="Invalid GitHub URL provided.")
        
    from app.core.config import settings
    if not settings.github_token:
        raise HTTPException(status_code=500, detail="GITHUB_TOKEN is missing in the backend/.env file. Please add your GitHub personal access token.")
        
    try:
        response = await service.analyze_profile(username)
        return response
    except GitHubAPIError as e:
        raise HTTPException(status_code=e.status_code or 500, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred during analysis.")


@router.post("/roast", response_model=RoastResponse)
async def roast_profile(
    request: AnalyzeRequest,
    service: GitHubService = Depends(get_github_service)
):
    """
    Analyzes a GitHub profile and generates a personalized roast
    using the GitGiggle AI engine powered by Groq.
    """
    username = extract_github_username(request.github_url)
    if not username:
        raise HTTPException(status_code=400, detail="Invalid GitHub URL provided.")

    from app.core.config import settings
    if not settings.github_token:
        raise HTTPException(
            status_code=500,
            detail="GITHUB_TOKEN is missing in the backend/.env file."
        )
    try:
        # Step 1: Analyze the profile (reuses existing pipeline)
        analysis = await service.analyze_profile(username)

        # Step 2: Generate roast from profile data
        roast_service = RoastService()
        roasts = await roast_service.generate_roast(analysis)

        return RoastResponse(
            brutal=roasts.get("brutal", ""),
            friendly=roasts.get("friendly", ""),
            recruiter=roasts.get("recruiter", ""),
            hacker=roasts.get("hacker", ""),
            username=username
        )
    except GitHubAPIError as e:
        raise HTTPException(status_code=e.status_code or 500, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Roast generation failed: {str(e)}")
