"""
GitGiggle AI — Failover & Fallback Service
Orchestrates key rotation and retries across multiple Groq API keys.
Generates highly customized dynamic fallback roasts if LLM APIs are completely unavailable.
"""

import logging
from typing import Dict, Any
from app.schemas.responses import AnalysisResponse
from app.services.llm_service import BaseLLMProvider, GroqProvider, LLMProviderError, clean_and_parse_json
from app.core.config import settings

logger = logging.getLogger(__name__)

def generate_fallback_roasts(analysis: AnalysisResponse) -> Dict[str, str]:
    """
    Generates dynamic, high-quality, language-specific fallback roasts
    based on the user's actual profile statistics and primary language.
    Does not make external network requests.
    """
    profile = analysis.profile
    stats = analysis.statistics
    username = profile.username or "developer"
    display_name = profile.display_name or username
    repos_count = profile.public_repositories
    total_stars = stats.total_stars
    total_commits = sum(c.commits for c in analysis.commits) if analysis.commits else 0
    
    # Identify primary language
    primary_lang = "general"
    if analysis.languages:
        primary_lang = analysis.languages[0].name.lower()

    roasts = {}

    # Define language-specific fallbacks
    if "python" in primary_lang:
        roasts["brutal"] = f"Your repositories are a graveyard of Jupyter notebooks and virtual environments that haven't been activated since your last pip install broke. {repos_count} repos, and not a single one has ever seen production."
        roasts["friendly"] = f"A true Pythonista! Your code is incredibly clean and values readability. Just remember that it's okay to delete those 15 different 'scratchpad.py' files someday!"
        roasts["recruiter"] = f"Demonstrates solid experience in Python development across {repos_count} repositories. However, packaging your scripts into structured, installable modules would show stronger production-level engineering."
        roasts["hacker"] = f"We intercepted your runtime logs. You pushed {total_commits} commits, mostly late at night editing requirements.txt files. We know exactly when your local scripts crash."
        
    elif "javascript" in primary_lang or "typescript" in primary_lang:
        roasts["brutal"] = f"You've installed more node_modules than there are stars in the observable universe. Your hard drive is screaming for mercy under the weight of nested dependencies in your {repos_count} web projects."
        roasts["friendly"] = f"Your typescript interface files are so welcoming they would accept any type. Keep building those responsive user interfaces and shiny frontend apps!"
        roasts["recruiter"] = f"Solid front-end and JS stack foundation. To stand out to top technical recruiters, I suggest adding comprehensive README files and testing suites to your {repos_count} repositories."
        roasts["hacker"] = f"We checked your DOM. Pushing {total_commits} commits directly to main because npm build failed again. We know you write 'console.log' statements to debug in production."
        
    elif "go" in primary_lang or "golang" in primary_lang:
        roasts["brutal"] = f"You chose Go because you wanted systems speed but couldn't handle manual pointer arithmetic in C. Enjoy writing 'if err != nil' on every second line of your life."
        roasts["friendly"] = f"You appreciate efficiency and clean, concurrent code! Your Go backend projects show you write software that is built to scale from day one."
        roasts["recruiter"] = f"Impressive backend systems exposure using Go. To improve recruiter outreach, consider adding API documentation and benchmark tests to your main repositories."
        roasts["hacker"] = f"We compiled your binary. We detected {repos_count} repositories running lightweight microservices, but none of them are fully tested. We are watching your goroutines run in circles."
        
    elif "rust" in primary_lang:
        roasts["brutal"] = f"We get it, you write Rust. But spending 4 hours fighting the borrow checker to compile a program that prints 'Hello' isn't the flex you think it is."
        roasts["friendly"] = f"Safety and memory correctness are clearly your priorities! Your Rust repositories are beautifully structured and show a real love for robust systems engineering."
        roasts["recruiter"] = f"Rust expertise is highly sought after. To attract major engineering firms, ensure your key Rust libraries feature architecture diagrams and clear setup instructions."
        roasts["hacker"] = f"We intercepted your compiler logs. You run cargo build and wait for hours. We know your memory is safe, but your API keys are still sitting in plain text."
        
    else:  # General/fallback
        roasts["brutal"] = f"Your GitHub has more abandoned side projects than Google's entire product history. The only thing consistent here is the complete lack of README documentation."
        roasts["friendly"] = f"You've got a wonderful collection of {repos_count} repositories! It's clear you love experimenting, learning new technologies, and keeping your coding curiosity alive."
        roasts["recruiter"] = f"You have a diverse profile with {repos_count} public repositories. To maximize recruiter engagement, pin your most complete projects and write clear, impact-driven descriptions."
        roasts["hacker"] = f"We analyzed your public footprint. {total_commits} commits across {repos_count} repositories. We know exactly when your motivation runs out and you abandon another repository."

    return roasts

class FailoverLLMService:
    """
    Coordinates roast generation by trying GROQ_API_KEY_1, falling back to
    GROQ_API_KEY_2 on error, and finally falling back to handcrafted roasts.
    """
    
    def __init__(self, model_name: str = "llama-3.3-70b-versatile"):
        self.model_name = model_name

    async def generate_roast_modes(self, system_prompt: str, user_prompt: str, analysis: AnalysisResponse) -> Dict[str, str]:
        """
        Executes roast generation with a full failover pipeline.
        
        Workflow:
        1. Try API Key 1.
        2. If rate limited (429), quota exceeded, timeout, API unavailable, or 5xx, retry with API Key 2.
        3. If both fail, return handcrafted fallbacks.
        """
        # Collect configured keys
        key_1 = settings.groq_api_key_1 or settings.groq_api_key
        key_2 = settings.groq_api_key_2

        # Step 1: Try Key 1
        if key_1:
            try:
                logger.info("Attempting roast generation with Groq API Key 1.")
                provider = GroqProvider(api_key=key_1, model_name=self.model_name)
                raw_response = await provider.generate_completion(system_prompt, user_prompt)
                parsed_roasts = clean_and_parse_json(raw_response)
                logger.info("Successfully generated roasts using Key 1.")
                return parsed_roasts
            except (LLMProviderError, ValueError, Exception) as e:
                # Determine if retryable
                status_code = getattr(e, "status_code", 500)
                logger.warning(
                    f"Groq API Key 1 failed (Status: {status_code}). Error: {str(e)}. "
                    "Initiating failover to Key 2..."
                )
        else:
            logger.warning("Groq API Key 1 not found. Attempting Key 2...")

        # Step 2: Try Key 2
        if key_2:
            try:
                logger.info("Attempting roast generation with Groq API Key 2.")
                provider = GroqProvider(api_key=key_2, model_name=self.model_name)
                raw_response = await provider.generate_completion(system_prompt, user_prompt)
                parsed_roasts = clean_and_parse_json(raw_response)
                logger.info("Successfully generated roasts using Key 2.")
                return parsed_roasts
            except (LLMProviderError, ValueError, Exception) as e:
                status_code = getattr(e, "status_code", 500)
                logger.error(
                    f"Groq API Key 2 also failed (Status: {status_code}). Error: {str(e)}. "
                    "Initiating fallback to handcrafted roasts."
                )
        else:
            logger.warning("Groq API Key 2 not configured. Initiating fallback to handcrafted roasts.")

        # Step 3: Fallback to handcrafted roasts
        logger.info("Generating handcrafted fallback roasts.")
        return generate_fallback_roasts(analysis)
