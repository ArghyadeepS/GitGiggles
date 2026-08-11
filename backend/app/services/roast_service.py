"""
GitGiggle AI — Roast Service
Orchestrates the prompt building, LLM completion calls, failover, and fallback
generation to produce a set of personalized developer roasts across four modes.
"""

from typing import Dict
from app.schemas.responses import AnalysisResponse
from app.services.prompt_builder import analyze_profile_aspects, build_system_prompt, build_user_prompt
from app.services.failover import FailoverLLMService

class RoastService:
    """
    Orchestrates the generation of personalized developer roasts across four modes
    (Brutal, Friendly, Recruiter, Hacker) using the prompt builder and failover pipeline.
    """

    def __init__(self, model_name: str = "llama-3.3-70b-versatile"):
        self.model_name = model_name
        self.failover_service = FailoverLLMService(model_name=self.model_name)

    async def generate_roast(self, analysis: AnalysisResponse) -> Dict[str, str]:
        """
        Takes a fully populated AnalysisResponse and returns a dictionary
        containing the four distinct roast modes (brutal, friendly, recruiter, hacker).
        """
        # Step 1: Extract deep behavioral aspects from the profile
        aspects = analyze_profile_aspects(analysis)
        
        # Step 2: Build the high-context prompt
        system_prompt = build_system_prompt()
        user_prompt = build_user_prompt(analysis, aspects)
        
        # Step 3: Run completion through failover LLM pipeline (includes Key 1 -> Key 2 -> fallbacks)
        roasts = await self.failover_service.generate_roast_modes(system_prompt, user_prompt, analysis)
        
        return roasts
