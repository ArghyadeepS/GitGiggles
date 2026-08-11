import re

def extract_github_username(url: str) -> str | None:
    """
    Extracts the GitHub username from a given URL or string.
    
    Supports formats like:
    - https://github.com/torvalds
    - github.com/torvalds
    - https://github.com/torvalds/
    - https://github.com/torvalds?tab=repositories
    - torvalds (if just username is provided)
    """
    # Remove query parameters and fragments
    url = url.split("?")[0].split("#")[0]
    
    # Strip trailing slashes
    url = url.strip().rstrip("/")
    
    # Regex to match github.com/username
    match = re.search(r"(?:https?://)?(?:www\.)?github\.com/([^/]+)", url, re.IGNORECASE)
    
    if match:
        username = match.group(1)
    else:
        # If it's a single word (no slashes, spaces), treat it as a raw username
        if "/" not in url and " " not in url and url:
            username = url
        else:
            return None
            
    # GitHub usernames may only contain alphanumeric characters or single hyphens, 
    # and cannot begin or end with a hyphen. Max length is 39.
    if not re.match(r"^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$", username, re.IGNORECASE):
        return None
        
    return username
