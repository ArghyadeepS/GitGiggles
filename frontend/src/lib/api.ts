/* ─────────────────────────────────────────────────────────────
   GitGiggles API Service
   Connects the frontend to the FastAPI backend.
   Uses VITE_API_URL env var — never hardcodes localhost.
   ───────────────────────────────────────────────────────────── */

import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120_000, // 2 minutes — backend may take time for GitHub + LLM calls
  headers: { "Content-Type": "application/json" },
});

/* ── Backend Response Types ─────────────────────────────────── */

export interface ApiProfile {
  avatar: string | null;
  username: string;
  display_name: string | null;
  bio: string | null;
  followers: number;
  following: number;
  company: string | null;
  location: string | null;
  website: string | null;
  twitter: string | null;
  email: string | null;
  hireable: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  public_repositories: number;
}

export interface ApiRepository {
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  watchers: number;
  open_issues: number;
  default_branch: string | null;
  size: number;
  archived: boolean;
  forked: boolean;
  license: string | null;
  created_date: string | null;
  updated_date: string | null;
}

export interface ApiScoredItem {
  name: string;
  score: number;
}

export interface ApiCommitCount {
  repo_name: string;
  commits: number;
}

export interface ApiContributions {
  total_contributions: number;
  contribution_calendar: Record<string, unknown>;
}

export interface ApiStatistics {
  total_repositories: number;
  total_stars: number;
  total_forks: number;
  average_stars: number;
  average_forks: number;
  largest_repository: string | null;
  most_starred_repository: string | null;
  newest_repository: string | null;
  oldest_repository: string | null;
}

export interface AnalysisResponse {
  profile: ApiProfile;
  repositories: ApiRepository[];
  languages: ApiScoredItem[];
  topics: ApiScoredItem[];
  personas: string[];
  statistics: ApiStatistics;
  commits: ApiCommitCount[];
  contributions: ApiContributions;
}

export interface RoastResponse {
  brutal: string;
  friendly: string;
  recruiter: string;
  hacker: string;
  username: string;
}

/* ── Error Handling ─────────────────────────────────────────── */

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(message: string, status: number, detail: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

function handleAxiosError(error: unknown): never {
  if (error instanceof AxiosError) {
    if (error.response) {
      // Backend returned an error response
      const status = error.response.status;
      const detail =
        error.response.data?.detail ||
        error.response.statusText ||
        "Unknown backend error";

      if (status === 400) {
        throw new ApiError("Invalid GitHub username or URL.", status, detail);
      }
      if (status === 404) {
        throw new ApiError(
          "GitHub user not found. Check the username and try again.",
          status,
          detail,
        );
      }
      if (status === 429) {
        throw new ApiError(
          "Rate limited. The GitHub API needs a breather. Try again in a minute.",
          status,
          detail,
        );
      }
      if (status >= 500) {
        throw new ApiError(
          "The backend ran into an issue. Check that the server is running and API keys are configured.",
          status,
          detail,
        );
      }
      throw new ApiError(detail, status, detail);
    }

    if (error.code === "ECONNABORTED") {
      throw new ApiError(
        "Request timed out. The backend might be processing a large profile. Try again.",
        0,
        "timeout",
      );
    }

    if (error.code === "ERR_NETWORK") {
      throw new ApiError(
        "Cannot reach the backend. Make sure the FastAPI server is running on " +
          API_BASE_URL,
        0,
        "network",
      );
    }

    throw new ApiError(
      "Network error: " + (error.message || "Unable to connect to backend."),
      0,
      error.message || "unknown",
    );
  }

  throw new ApiError(
    "An unexpected error occurred.",
    0,
    String(error),
  );
}

/* ── API Functions ─────────────────────────────────────────── */

/**
 * Analyze a GitHub profile. Accepts a username or full GitHub URL.
 * The backend parser handles both formats.
 */
export async function analyzeProfile(
  githubUrl: string,
): Promise<AnalysisResponse> {
  try {
    const response = await apiClient.post<AnalysisResponse>("/api/analyze", {
      github_url: githubUrl,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

/**
 * Generate AI-powered roasts for a GitHub profile.
 * Returns roast text for all 4 modes (brutal, friendly, recruiter, hacker).
 */
export async function roastProfile(
  githubUrl: string,
): Promise<RoastResponse> {
  try {
    const response = await apiClient.post<RoastResponse>("/api/roast", {
      github_url: githubUrl,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

/**
 * Fetch both analysis AND roast in parallel for maximum speed.
 * Returns both responses or throws the first error encountered.
 */
export async function analyzeAndRoast(
  githubUrl: string,
): Promise<{ analysis: AnalysisResponse; roast: RoastResponse }> {
  const [analysis, roast] = await Promise.all([
    analyzeProfile(githubUrl),
    roastProfile(githubUrl),
  ]);
  return { analysis, roast };
}
