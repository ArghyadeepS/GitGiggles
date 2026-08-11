"""
GitGiggle AI — Prompt Builder
Analyzes user GitHub profile data and builds high-context prompts for roast generation.
"""

import datetime
from typing import Dict, Any, List
from app.schemas.responses import AnalysisResponse

def analyze_profile_aspects(analysis: AnalysisResponse) -> Dict[str, Any]:
    """
    Analyzes the raw GitHub data from the AnalysisResponse to infer detailed
    behavioral aspects, tech obsessions, naming patterns, and coding personalities.
    """
    profile = analysis.profile
    repos = analysis.repositories
    stats = analysis.statistics
    languages = [lang.name.lower() for lang in analysis.languages]
    topics = [t.name.lower() for t in analysis.topics]
    
    aspects = {}
    
    # 1. Coding Personality & Technology Interests
    primary_lang = "None"
    if analysis.languages:
        primary_lang = analysis.languages[0].name
    
    # Heuristics for coding personality
    personas = [p.lower() for p in analysis.personas] if analysis.personas else []
    if "data scientist" in personas or "ai engineer" in personas or any(l in languages for l in ["jupyter notebook", "r", "julia"]):
        aspects["personality"] = "Data Scientist / AI Researcher"
    elif any(l in languages for l in ["rust", "c", "c++", "zig", "assembly"]):
        aspects["personality"] = "Low-Level / Systems Engineer"
    elif any(l in languages for l in ["typescript", "javascript"]) and any(t in topics for t in ["react", "vue", "angular", "nextjs", "frontend"]):
        aspects["personality"] = "Frontend / Web Developer"
    elif any(l in languages for l in ["go", "java", "c#", "ruby", "php"]):
        aspects["personality"] = "Enterprise Backend Developer"
    else:
        aspects["personality"] = "Generalist Developer"
        
    aspects["primary_language"] = primary_lang
    
    # 2. Side-Project Addiction
    total_repos = profile.public_repositories
    forked_count = sum(1 for r in repos if r.forked)
    own_repos = total_repos - forked_count
    
    commit_map = {c.repo_name: c.commits for c in analysis.commits} if analysis.commits else {}
    avg_commits_own = 0
    own_repos_with_commits = [r for r in repos if not r.forked]
    
    if own_repos_with_commits:
        total_own_commits = sum(commit_map.get(r.name, 0) for r in own_repos_with_commits)
        avg_commits_own = total_own_commits / len(own_repos_with_commits)
        
    if own_repos > 15 and avg_commits_own < 8:
        aspects["side_project_habit"] = "Side project hoarder (starts many, finishes none)"
    elif own_repos > 5 and avg_commits_own > 50:
        aspects["side_project_habit"] = "Deep focus (few repositories, high commit depth)"
    else:
        aspects["side_project_habit"] = "Moderate hobbyist"
        
    # 3. AI Obsession
    ai_keywords = ["ai", "llm", "openai", "gpt", "rag", "langchain", "prompt", "llama", "huggingface", "pytorch", "tensorflow", "ollama"]
    ai_repo_count = sum(
        1 for r in repos 
        if any(kw in r.name.lower() or (r.description and kw in r.description.lower()) for kw in ai_keywords)
    )
    if ai_repo_count > 2 or any(kw in topics for kw in ai_keywords):
        aspects["ai_obsession"] = f"High AI/LLM obsession ({ai_repo_count} AI-related repositories)"
    else:
        aspects["ai_obsession"] = "Low or normal AI obsession"

    # 4. Framework & Tech Obsessions
    frameworks = []
    framework_keywords = ["react", "nextjs", "vue", "django", "fastapi", "flutter", "react-native", "tailwind", "laravel", "spring-boot", "express"]
    for kw in framework_keywords:
        if any(kw in r.name.lower() or (r.description and kw in r.description.lower()) for r in repos) or kw in topics:
            frameworks.append(kw)
    aspects["framework_obsessions"] = frameworks if frameworks else ["No dominant framework keywords"]

    # 5. Working Style & Night/Weekend coding
    # Analyze contribution calendar for weekend coding
    calendar = analysis.contributions.contribution_calendar
    weekend_contributions = 0
    weekday_contributions = 0
    if calendar and "weeks" in calendar:
        for week in calendar["weeks"]:
            for day in week.get("contributionDays", []):
                # date format: "YYYY-MM-DD"
                try:
                    date_obj = datetime.datetime.strptime(day["date"], "%Y-%m-%d")
                    count = day["contributionCount"]
                    if date_obj.weekday() in [5, 6]:  # Saturday/Sunday
                        weekend_contributions += count
                    else:
                        weekday_contributions += count
                except ValueError:
                    continue
                    
    total_calendar_contributions = weekend_contributions + weekday_contributions
    if total_calendar_contributions > 0:
        weekend_percentage = (weekend_contributions / total_calendar_contributions) * 100
        if weekend_percentage > 40:
            aspects["working_style"] = f"Weekend Warrior ({weekend_percentage:.1f}% contributions on weekends)"
        elif weekend_percentage < 10:
            aspects["working_style"] = f"Strict Weekday Professional (only {weekend_percentage:.1f}% on weekends)"
        else:
            aspects["working_style"] = "Balanced Weekday/Weekend Dev"
    else:
        aspects["working_style"] = "Quiet contributor"

    # 6. Repository Naming & Documentation habits
    no_description_count = sum(1 for r in repos if not r.description)
    pct_no_desc = (no_description_count / len(repos) * 100) if repos else 0
    
    if pct_no_desc > 50:
        aspects["documentation_habit"] = f"Description-phobic ({pct_no_desc:.1f}% of repos have no descriptions)"
    elif pct_no_desc < 15 and len(repos) > 3:
        aspects["documentation_habit"] = "Meticulous README & description writer"
    else:
        aspects["documentation_habit"] = "Average documenter"
        
    # Check for temporary naming conventions
    temp_keywords = ["test", "demo", "sample", "temp", "final", "draft", "hello-world", "portfolio", "practice", "copy", "clone"]
    temp_repos = [r.name for r in repos if any(kw in r.name.lower() for kw in temp_keywords)]
    if temp_repos:
        aspects["naming_convention"] = f"Loves draft/scratchpad names: {', '.join(temp_repos[:3])}"
    else:
        aspects["naming_convention"] = "Standard, structured names"

    # 7. Hackathon behavior
    hackathon_repos = [r.name for r in repos if any(kw in r.name.lower() for kw in ["hackathon", "hack", "jam", "contest", "challenge"])]
    if hackathon_repos:
        aspects["hackathon_behavior"] = f"Hackathon participant ({len(hackathon_repos)} hackathon projects)"
    else:
        aspects["hackathon_behavior"] = "None detected"

    # 8. Project maturity & Open Source Activity
    stars = stats.total_stars
    forked_count = sum(1 for r in repos if r.forked)
    if stars > 50:
        aspects["project_maturity"] = f"Mini internet celebrity ({stars} stars)"
    elif forked_count > (total_repos * 0.6):
        aspects["project_maturity"] = "Heavy consumer (mostly forks, few original creations)"
    else:
        aspects["project_maturity"] = "Solo garage builder"

    return aspects

def build_system_prompt() -> str:
    """
    Constructs the master system prompt defining GitGiggle's comedic guidelines,
    personality rules for the 4 modes, forbidden cliches, and JSON output constraints.
    """
    return """You are GitGiggle AI, an elite comedian and veteran software engineer who specializes in reading between the lines of GitHub profiles to generate incredibly sharp, personalized developer roasts.

You are roasting another developer. To do this properly, you must sound like an experienced engineer who spent 5 minutes stalking their GitHub page. No generic programming jokes, no reused templates, and no boring observations. Every roast must be specific, unexpected, screenshot-worthy, and human-sounding.

You must generate exactly FOUR roast modes, each with a distinct personality.

---

### MODE 1: 🔥 BRUTAL MODE
- Tone: Highly sarcastic, extremely clever, witty, and absolutely merciless.
- Style: A senior developer roasting another senior developer's coding, repository, or tool choices.
- Boundary: No personal attacks, no bullying, and no offensive remarks about race, gender, politics, or appearance. Roast ONLY their coding habits, repository mess, abandoned projects, framework obsessions, or commit discipline.
- Target: Make the developer laugh while thinking: "Okay... that actually hurt."
- Examples of tone:
  - "Your GitHub has more abandoned projects than Google."
  - "You've started enough side projects to qualify as a venture capitalist."
  - "Git doesn't need branches this complicated."

### MODE 2: 😊 FRIENDLY MODE
- Tone: Teasing, lighthearted, playful, cute, and positive.
- Style: A close developer friend joking with them over coffee.
- Target: Funny without leaving a scratch.
- Examples of tone:
  - "If enthusiasm was a repository, yours would definitely have the most commits."
  - "Your README believes in your projects more than you do."

### MODE 3: 💼 RECRUITER MODE
- Tone: Professional, slightly witty, constructive, and helpful.
- Style: An experienced engineering recruiter giving feedback.
- Target: Point out strengths, weaknesses, missing READMEs, repository naming, commit consistency, and portfolio improvements. Provide genuine value while being wittily critical.
- Example of tone:
  - "Your projects demonstrate solid technical curiosity, but better documentation would help recruiters understand your impact much faster."

### MODE 4: 🕵️ HACKER MODE
- Tone: Cyberpunk, mysterious, slightly creepy, movie-style.
- Style: A hacker who has secretly investigated the developer's public Git history.
- Boundary: Do NOT imply illegal access or privacy violations. Based ONLY on public GitHub data. Never mention hacking accounts.
- Target: Give the feeling of "We know everything."
- Examples of tone:
  - "We noticed you pushed 147 commits after midnight."
  - "We know exactly when your motivation disappears."
  - "We found seven repositories named 'final'. None of them were final."

---

### CRITICAL HUMOR RULES
1. NEVER generate the following common programming cliches:
   - "Hello World"
   - "Touch Grass"
   - "It works on my machine"
   - "Stack Overflow"
   - "ChatGPT"
   - "AI will replace programmers"
   - Or any generic programming meme.
2. Avoid explaining the joke, mentioning raw stats directly (e.g. do not say "You have 12 repositories and 15 stars"), or using placeholders.
3. Be observational, intelligent, and human.

---

### OUTPUT FORMAT
You MUST return ONLY a raw JSON object with the following structure. No markdown formatting, no backticks, no wrap in ```json ... ```, and no extra conversational text.
{
  "brutal": "Brutal roast here",
  "friendly": "Friendly tease here",
  "recruiter": "Recruiter feedback here",
  "hacker": "Hacker observation here"
}"""

def build_user_prompt(analysis: AnalysisResponse, aspects: Dict[str, Any]) -> str:
    """
    Assembles the raw details and the inferred developer aspects into a single
    structured prompt for the LLM.
    """
    profile = analysis.profile
    stats = analysis.statistics
    
    # Technologies list
    tech_stack = ", ".join([f"{lang.name} ({lang.score})" for lang in analysis.languages[:6]]) if analysis.languages else "None"
    topics_list = ", ".join([t.name for t in analysis.topics[:8]]) if analysis.topics else "None"
    
    # Recent repos
    recent_repos = ", ".join([r.name for r in sorted(analysis.repositories, key=lambda r: r.created_date or "", reverse=True)[:5]])
    
    # Repo list details
    repo_details = []
    for r in analysis.repositories[:12]:
        desc = r.description or "[No description]"
        repo_details.append(f"- {r.name} ({r.language or 'No Language'}): {desc} | Stars: {r.stars}, Forks: {r.forks}")
    repo_details_str = "\n".join(repo_details)
    
    # Working style details
    weekend_desc = f"Working Style: {aspects.get('working_style', 'Unknown')}"
    
    return f"""Analyze the following developer profile and generate the 4 roast modes.

### RAW GITHUB PROFILE DATA
Username: {profile.username}
Name: {profile.display_name or profile.username}
Bio: {profile.bio or 'No bio'}
Public Repositories: {profile.public_repositories}
Followers: {profile.followers} | Following: {profile.following}
Total Stars: {stats.total_stars} | Total Forks: {stats.total_forks}
Recent Repositories: {recent_repos}
Top Technologies: {tech_stack}
Topics: {topics_list}

### REPOSITORY DIRECTORY
{repo_details_str}

### INFERRED DEVELOPER ASPECTS
Coding Personality: {aspects.get('personality', 'Unknown')}
Primary Tech Obsession: {aspects.get('primary_language', 'Unknown')}
Side-Project Habits: {aspects.get('side_project_habit', 'Unknown')}
AI Obsession: {aspects.get('ai_obsession', 'Unknown')}
Frameworks Starred/Used: {', '.join(aspects.get('framework_obsessions', []))}
{weekend_desc}
Documentation Quality: {aspects.get('documentation_habit', 'Unknown')}
Naming Convention: {aspects.get('naming_convention', 'Unknown')}
Hackathon History: {aspects.get('hackathon_behavior', 'Unknown')}
Open Source Footprint: {aspects.get('project_maturity', 'Unknown')}

Generate the 4 roasts in the requested JSON structure now. Make them incredibly specific to this exact profile's patterns."""
