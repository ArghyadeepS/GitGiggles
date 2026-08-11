# GitHub Profile Analyzer (Phase 1)

A production-ready FastAPI application capable of deeply analyzing any public GitHub profile using the GitHub GraphQL and REST APIs.

## Features

- **Profile Overview**: Extract avatar, bio, follower count, and other primary metadata.
- **Repositories**: Fetches all public repositories and essential metrics (stars, forks, open issues).
- **Languages Breakdown**: Aggregates languages used across all repositories.
- **Topics**: Ranks the top topics/tags used across repositories.
- **Statistics**: Calculates metrics like total stars, total forks, average stars, etc.
- **Commits**: Fetches the total number of commits authored by the user per repository.
- **Contributions**: Retrieves the total contribution count over the last year.

## Architecture

- **Backend**: FastAPI (Python 3.12+), `httpx` for async HTTP requests, `pydantic` for schema validation.
- **Frontend**: Plain HTML, Vanilla JS, CSS (Testing UI).
- **GitHub API Strategy**: Heavily utilizes the **GraphQL API** to prevent N+1 request issues and minimize rate-limiting when fetching repository languages and commits.

## Setup Instructions

### Prerequisites
- Python 3.12+
- A GitHub Personal Access Token (classic or fine-grained)

### 1. Clone & Navigate
```bash
git clone <repository_url>
cd github-profile-analyzer
```

### 2. Environment Variables
Copy the `.env.example` to `.env` inside the `backend` directory and add your GitHub token.
```bash
cd backend
cp .env.example .env
```
Ensure your `.env` file looks like this:
```env
GITHUB_TOKEN=ghp_your_actual_token_here
```

### 3. Install Dependencies
It's recommended to use a virtual environment:
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Run the Application
Start the FastAPI server using `uvicorn`:
```bash
uvicorn app.main:app --reload
```
By default, this will run on `http://127.0.0.1:8000`.

### 5. Access the Frontend
Open your browser and navigate to:
```
http://127.0.0.1:8000/
```
You should see the "GitHub Profile Analyzer" interface. Paste a GitHub URL (e.g., `https://github.com/torvalds`) and hit Analyze!

## API Documentation
Once running, you can explore the interactive API documentation at:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`
