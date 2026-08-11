"""
GitGiggle AI — LLM Service
Defines base interfaces and concrete providers for interacting with LLM APIs.
Provides clean extension points for OpenAI, Gemini, Anthropic, etc.
"""

import abc
import json
import re
from typing import Dict, Any, Optional
from groq import AsyncGroq

class LLMProviderError(Exception):
    """Base exception for LLM provider issues."""
    def __init__(self, message: str, status_code: Optional[int] = None):
        super().__init__(message)
        self.status_code = status_code
        self.message = message

class BaseLLMProvider(abc.ABC):
    """
    Abstract interface for LLM Providers.
    Allows easy plugging of future LLM clients (OpenAI, Gemini, Anthropic, etc.)
    """
    
    @abc.abstractmethod
    async def generate_completion(self, system_prompt: str, user_prompt: str) -> str:
        """
        Sends prompts to the LLM and returns the raw text response.
        """
        pass

class GroqProvider(BaseLLMProvider):
    """
    Concrete implementation of BaseLLMProvider utilizing the Groq API.
    """
    
    def __init__(self, api_key: str, model_name: str = "llama-3.3-70b-versatile"):
        self.api_key = api_key
        self.model_name = model_name
        self.client = AsyncGroq(api_key=self.api_key)

    async def generate_completion(self, system_prompt: str, user_prompt: str) -> str:
        """
        Calls the Groq chat completion API asynchronously.
        """
        if not self.api_key:
            raise LLMProviderError("Groq API key is empty or not provided.", 401)
            
        try:
            chat_completion = await self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model=self.model_name,
                temperature=0.75,
                max_tokens=1024,
                response_format={"type": "json_object"}
            )
            return chat_completion.choices[0].message.content or ""
        except Exception as e:
            status_code = getattr(e, "status_code", 500)
            message = getattr(e, "message", str(e))
            raise LLMProviderError(f"Groq API error: {message}", status_code) from e

def clean_and_parse_json(raw_response: str) -> Dict[str, str]:
    """
    Cleans raw LLM response text by removing potential markdown fences,
    extracts the raw JSON block, and parses it into a dictionary.
    
    Raises:
        ValueError if the JSON is malformed or missing required keys.
    """
    cleaned = raw_response.strip()
    
    # Remove markdown code fences if present (e.g. ```json ... ```)
    if cleaned.startswith("```"):
        # Match anything between triple backticks
        match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", cleaned, re.DOTALL)
        if match:
            cleaned = match.group(1).strip()
        else:
            # Fallback regex to clean fences manually
            cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
            cleaned = re.sub(r"\s*```$", "", cleaned).strip()
            
    # Locate first curly brace and last curly brace if there's surrounding text
    if not (cleaned.startswith("{") and cleaned.endswith("}")):
        start_idx = cleaned.find("{")
        end_idx = cleaned.rfind("}")
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            cleaned = cleaned[start_idx:end_idx + 1]
            
    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to decode roast JSON response: {str(e)}\nRaw Response: {raw_response}") from e
        
    # Ensure all four required modes are present
    required_keys = ["brutal", "friendly", "recruiter", "hacker"]
    for key in required_keys:
        if key not in parsed:
            raise ValueError(f"LLM response JSON is missing required key: {key}")
            
    return parsed
