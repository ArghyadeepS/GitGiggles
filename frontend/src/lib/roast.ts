/* ─────────────────────────────────────────────────────────────
   Roast engine data model.
   Mirrors the future backend pipeline:
   GitHub API → Raw data → Feature extraction → Developer patterns
   → Roast engine → AI evidence-based roasts → React experience
   ───────────────────────────────────────────────────────────── */

export type RoastMode = "brutal" | "friendly" | "recruiter" | "hacker";

export interface RoastModeInfo {
  id: RoastMode;
  label: string;
  tagline: string;
  description: string;
}

export const ROAST_MODES: RoastModeInfo[] = [
  {
    id: "brutal",
    label: "Brutal",
    tagline: "No mercy.",
    description: "The evidence speaks. It does not whisper.",
  },
  {
    id: "friendly",
    label: "Friendly",
    tagline: "I'll roast you, but we'll giggle about it after.",
    description: "Same evidence. Gently applied.",
  },
  {
    id: "recruiter",
    label: "Recruiter",
    tagline: "How would a recruiter read this GitHub?",
    description: "Constructive feedback, served with a smile.",
  },
  {
    id: "hacker",
    label: "Hacker",
    tagline: "Full terminal energy.",
    description: "We found everything. Every commit. Every 'final2'.",
  },
];

export interface Crime {
  id: number;
  category: string;
  evidence: string;
  roast: string;
  severity: number;
}

export interface TechnologyDNA {
  name: string;
  value: number;
  color: string;
}

export interface DeveloperStyle {
  name: string;
  value: number;
}

export interface RoastStats {
  projectsStarted: number;
  projectsFinished: number;
  abandoned: number;
  techStackChaos: number;
  documentation: number;
  commitObsession: number;
  completion: number;
}

export interface GitHubStats {
  repos: number;
  active: number;
  stars: number;
  forks: number;
  commits: number;
  contributions: number;
  followers: number;
  following: number;
}

export interface TimelineEvent {
  icon: "archive" | "rocket" | "moon" | "warning" | "git";
  label: string;
  detail: string;
}

export interface RoastData {
  username: string;
  mode: RoastMode;
  roastScore: number;
  roastLevelLabel: string;
  subtitle: string;
  personality: {
    title: string;
    description: string;
  };
  profile: {
    avatar: string | null;
    displayName: string | null;
    bio: string | null;
    followers: number;
    following: number;
  };
  stats: RoastStats;
  githubStats: GitHubStats;
  crimes: Crime[];
  technologies: TechnologyDNA[];
  developerStyle: DeveloperStyle[];
  summary: string;
  verdict: {
    developerClass: string;
    status: string;
    threatLevel: string;
  };
  finalRoast: string;
  weeklyCommits: number[];
  timeline: TimelineEvent[];
  shareText: string;
}

/* ── Deterministic PRNG so each username always gets a stable roast ── */

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
const jitter = (rand: () => number, base: number, amount: number) =>
  Math.round(base + (rand() - 0.5) * amount);

/* ── Crime evidence pool (10 categories, only some shown per roast) ── */

interface CrimeTemplate {
  category: string;
  evidence: string;
  roasts: Record<RoastMode, string>;
  severity: number;
}

const CRIME_POOL: CrimeTemplate[] = [
  {
    category: "Project Graveyard",
    evidence: "34 inactive repositories",
    roasts: {
      brutal: "You don't have unfinished projects. You have a museum.",
      friendly: "Your repos aren't abandoned. They're 'resting'. Permanently.",
      recruiter: "Shows strong exploration appetite. Delivery pipeline TBD.",
      hacker: "34 repos, 34 obituaries, 0 funerals. You monster.",
    },
    severity: 91,
  },
  {
    category: "Documentation Crimes",
    evidence: "23% README coverage",
    roasts: {
      brutal: "Your README has entered witness protection.",
      friendly: "Your code knows what it does. Nobody else does.",
      recruiter: "Documentation is a growth opportunity we'd love to see you seize.",
      hacker: "Your READMEs are 404 pages for your own projects.",
    },
    severity: 82,
  },
  {
    category: "Framework Commitment Issues",
    evidence: "5 frontend frameworks",
    roasts: {
      brutal: "You've used 5 frontend frameworks and still haven't chosen a personality.",
      friendly: "You're not switching frameworks. You're 'exploring options'.",
      recruiter: "Demonstrates impressive framework versatility.",
      hacker: "React, Vue, Svelte, Angular, and one you built yourself. Pick one. Please.",
    },
    severity: 88,
  },
  {
    category: "Tech Stack Chaos",
    evidence: "11 languages detected",
    roasts: {
      brutal: "You don't have a tech stack. You have commitment issues.",
      friendly: "Eleven languages is ambitious. Your codebase agrees to disagree.",
      recruiter: "Full-stack generalist with unusual breadth.",
      hacker: "Your package.json looks like a refugee camp of dependencies.",
    },
    severity: 84,
  },
  {
    category: "Commit Crimes",
    evidence: "204 commits titled 'fix stuff'",
    roasts: {
      brutal: "Your commit history reads like a ransom note.",
      friendly: "Your commit messages are… let's call them 'poetic'.",
      recruiter: "Commit message hygiene is an area for coaching.",
      hacker: "204 'fix stuff' commits. The stuff is still broken.",
    },
    severity: 76,
  },
  {
    category: "Naming Crimes",
    evidence: "9 repos named final, final2, project-final-final",
    roasts: {
      brutal: "Your version control strategy is adding 'final' to filenames.",
      friendly: "Naming is hard. Naming nine times is a lifestyle.",
      recruiter: "Repo naming shows opportunity for professional polish.",
      hacker: "final_final2_FINAL(3).zip energy. Unforgivable.",
    },
    severity: 79,
  },
  {
    category: "Night Owl Behavior",
    evidence: "73 late-night commits",
    roasts: {
      brutal: "Your most productive coworker appears to be insomnia.",
      friendly: "The 3am commits are either brilliance or a cry for help.",
      recruiter: "Exhibits strong after-hours drive. (Please get sleep.)",
      hacker: "You commit at 3am because that's when the excuses sleep.",
    },
    severity: 71,
  },
  {
    category: "Tutorial Addiction",
    evidence: "31 tutorial re-implementations",
    roasts: {
      brutal: "You've completed more tutorials than production launches.",
      friendly: "Learning never stops. Neither does 'Hello World'.",
      recruiter: "Dedicated self-learner. Very coachable.",
      hacker: "31 times you rebuilt the same to-do app. The to-do app you never finished.",
    },
    severity: 67,
  },
  {
    category: "README Delusion",
    evidence: "A 400-line README for a 12-line script",
    roasts: {
      brutal: "Your README promises a platform. Your code delivers a script.",
      friendly: "The ambition in that README deserves its own repository.",
      recruiter: "Excellent narrative skills. Strong vision.",
      hacker: "That README has more features than your app. Congrats.",
    },
    severity: 63,
  },
  {
    category: "Overengineering",
    evidence: "Kubernetes config for a to-do app",
    roasts: {
      brutal: "You deployed a form with a service mesh. The form is fine.",
      friendly: "The scale of your ambition exceeds the scale of your app.",
      recruiter: "Demonstrates infrastructure curiosity.",
      hacker: "You need 47 containers to render a checkbox.",
    },
    severity: 74,
  },
];

const PERSONALITIES: Record<
  RoastMode,
  { title: string; description: string }
> = {
  brutal: {
    title: "The Serial Starter",
    description:
      "You have the enthusiasm of a startup founder and the project completion rate of a group assignment.",
  },
  friendly: {
    title: "The Eager Starter",
    description:
      "You begin things beautifully. Finishing them is simply not your love language.",
  },
  recruiter: {
    title: "The Ambitious Generalist",
    description:
      "An energetic builder with a portfolio of bold beginnings and exciting potential.",
  },
  hacker: {
    title: "The Chaos Engineer",
    description:
      "You don't write code. You release dependencies into the wild and call it architecture.",
  },
};

const VERDICTS: Record<RoastMode, RoastData["verdict"]> = {
  brutal: {
    developerClass: "The Chaotic Builder",
    status: "Potential detected. Discipline questionable.",
    threatLevel: "HIGH",
  },
  friendly: {
    developerClass: "The Enthusiastic Builder",
    status: "Potential detected. Finishing things is next.",
    threatLevel: "MODERATE",
  },
  recruiter: {
    developerClass: "The Emerging Builder",
    status: "Strong potential. Excellent follow-through on follow-ups.",
    threatLevel: "RISING",
  },
  hacker: {
    developerClass: "The Uncontained Builder",
    status: "Potential detected. Containment failed.",
    threatLevel: "CRITICAL",
  },
};

const FINAL_ROASTS: Record<RoastMode, string> = {
  brutal:
    "You're not a bad developer. You're just aggressively unfinished.",
  friendly:
    "You're not a bad developer — you just ship ideas faster than endings.",
  recruiter:
    "You're not a bad developer. Your GitHub just hasn't met its full potential yet.",
  hacker:
    "Your repository count is a crime scene and you are the only suspect.",
};

const SUBTITLES: Record<RoastMode, string> = {
  brutal: "You should probably sit down.",
  friendly: "It's okay. We all start somewhere.",
  recruiter: "Let's workshop your GitHub presence.",
  hacker: "We found everything. Everything.",
};

const MODE_LABELS: Record<RoastMode, string> = {
  brutal: "Brutal",
  friendly: "Friendly",
  recruiter: "Recruiter",
  hacker: "Hacker",
};

const DEFAULT_PROFILE = {
  repos: 42,
  active: 8,
  stars: 128,
  forks: 17,
  commits: 1204,
  contributions: 312,
  lateNight: 73,
  languages: 11,
  frameworks: 5,
  readmeCoverage: 23,
  finalRepos: 9,
  badCommits: 204,
  tutorials: 31,
  overengineered: true,
};

function buildWeeklyCommits(rand: () => number): number[] {
  return Array.from({ length: 12 }, (_, i) => {
    const trend = i >= 8 ? 0.55 : 1; // recent months slow down (classic)
    return Math.max(0, Math.round((jitter(rand, 28, 30) * trend)));
  });
}

function buildTimeline(rand: () => number): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      icon: "rocket",
      label: "Peak hype period",
      detail: "Started 12 projects in 9 days",
    },
    {
      icon: "archive",
      label: "Abandoned project-final-final",
      detail: "Last commit: 2 years, 4 months ago",
    },
    {
      icon: "moon",
      label: "Insomnia detected",
      detail: `${DEFAULT_PROFILE.lateNight} commits between 1am and 5am`,
    },
  ];
  if (rand() > 0.4) {
    events.push({
      icon: "warning",
      label: "README last updated",
      detail: "14 months ago. It still says 'coming soon'.",
    });
  }
  return events;
}

export function generateRoast(
  username: string,
  mode: RoastMode,
): RoastData {
  const seed = hashSeed(`${username.toLowerCase()}:${mode}`);
  const rand = mulberry32(seed);

  const scoreBases: Record<RoastMode, number> = {
    brutal: 87,
    friendly: 63,
    recruiter: 74,
    hacker: 95,
  };
  const roastScore = clamp(jitter(rand, scoreBases[mode], 6), 1, 100);

  // Select a stable subset of crimes for this user (evidence exists for each).
  const shuffled = [...CRIME_POOL].sort((a, b) => {
    // deterministic shuffle via seeded keys
    const keyA = hashSeed(`${username}:${a.category}`);
    const keyB = hashSeed(`${username}:${b.category}`);
    return keyA - keyB;
  });
  const crimeCount = 6 + Math.floor(rand() * 2); // 6-7 crimes shown
  const crimes: Crime[] = shuffled.slice(0, crimeCount).map((t, index) => ({
    id: index + 1,
    category: t.category,
    evidence: t.evidence,
    roast: t.roasts[mode],
    severity: clamp(jitter(rand, t.severity, 10), 30, 99),
  }));
  crimes.sort((a, b) => b.severity - a.severity);
  crimes.forEach((c, i) => (c.id = i + 1));

  const technologies: TechnologyDNA[] = [
    { name: "Python", value: jitter(rand, 91, 6), color: "#ff7a00" },
    { name: "JavaScript", value: jitter(rand, 82, 6), color: "#ffc300" },
    { name: "TypeScript", value: jitter(rand, 71, 8), color: "#ff4d00" },
    { name: "HTML/CSS", value: jitter(rand, 84, 6), color: "#e63946" },
  ];

  const developerStyle: DeveloperStyle[] = [
    { name: "Builder", value: jitter(rand, 92, 5) },
    { name: "Experimenter", value: jitter(rand, 88, 6) },
    { name: "Open Source", value: jitter(rand, 64, 10) },
    { name: "Documentation", value: jitter(rand, 31, 8) },
    { name: "Consistency", value: jitter(rand, 57, 8) },
  ];

  const summary =
    "You're an experimental builder who loves starting ambitious projects, " +
    "but your completion rate suggests your ideas move faster than your execution.";

  const shareText =
    `🔥 GitGiggles — @${username} scored ${roastScore}/100 (${MODE_LABELS[mode]} mode). ` +
    `Personality: ${PERSONALITIES[mode].title}. ` +
    `${crimes[0]?.evidence ?? "Evidence found"}. ` +
    `"${crimes[0]?.roast ?? "We have evidence."}" — can you handle the giggles?`;

  return {
    username,
    mode,
    roastScore,
    roastLevelLabel:
      roastScore >= 90 ? "Certified Menace" : roastScore >= 80 ? "Repeat Offender" : roastScore >= 65 ? "Suspect" : "Minor Offense",
    subtitle: SUBTITLES[mode],
    personality: PERSONALITIES[mode],
    profile: {
      avatar: null,
      displayName: null,
      bio: null,
      followers: 420,
      following: 69,
    },
    stats: {
      projectsStarted: DEFAULT_PROFILE.repos,
      projectsFinished: DEFAULT_PROFILE.active,
      abandoned: DEFAULT_PROFILE.repos - DEFAULT_PROFILE.active,
      techStackChaos: 91,
      documentation: DEFAULT_PROFILE.readmeCoverage,
      commitObsession: 84,
      completion: Math.round(
        (DEFAULT_PROFILE.active / DEFAULT_PROFILE.repos) * 100,
      ),
    },
    githubStats: {
      repos: DEFAULT_PROFILE.repos,
      active: DEFAULT_PROFILE.active,
      stars: DEFAULT_PROFILE.stars,
      forks: DEFAULT_PROFILE.forks,
      commits: DEFAULT_PROFILE.commits,
      contributions: DEFAULT_PROFILE.contributions,
      followers: 420,
      following: 69,
    },
    crimes,
    technologies,
    developerStyle,
    summary,
    verdict: VERDICTS[mode],
    finalRoast: FINAL_ROASTS[mode],
    weeklyCommits: buildWeeklyCommits(rand),
    timeline: buildTimeline(rand),
    shareText,
  };
}

/* ── Persistence (survives page refreshes on /roast) ── */

const STORAGE_KEY = "gitgiggles:roast:v1";

export interface SavedRoast {
  data: RoastData;
  demo: boolean;
}

export function saveRoast(roast: SavedRoast): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(roast));
  } catch {
    // sessionStorage unavailable — the in-memory state still works.
  }
}

export function loadRoast(): SavedRoast | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedRoast) : null;
  } catch {
    return null;
  }
}

/* ── Backend API → RoastData Adapter ─────────────────────────
   Maps the real backend AnalysisResponse + RoastResponse into
   the RoastData shape that all UI components already consume.
   ───────────────────────────────────────────────────────────── */

import type { AnalysisResponse, RoastResponse } from "@/lib/api";

/**
 * Build a full RoastData object from real backend API responses.
 * The UI components (RoastScore, PersonalityCard, CrimeCard, etc.)
 * are never changed — this adapter is the single translation point.
 */
export function buildRoastDataFromAPI(
  analysis: AnalysisResponse,
  roast: RoastResponse,
  mode: RoastMode,
): RoastData {
  const profile = analysis.profile;
  const stats = analysis.statistics;
  const repos = analysis.repositories;
  const commits = analysis.commits;
  const contributions = analysis.contributions;

  const username = profile.username;
  const totalRepos = profile.public_repositories;
  const forkedCount = repos.filter((r) => r.forked).length;
  const ownRepos = repos.filter((r) => !r.forked);
  const archivedCount = repos.filter((r) => r.archived).length;
  const activeCount = Math.max(1, totalRepos - archivedCount - forkedCount);
  const totalCommits = commits.reduce((sum, c) => sum + c.commits, 0);

  // ── Roast score: heuristic based on real stats ──
  const seed = hashSeed(`${username.toLowerCase()}:${mode}`);
  const rand = mulberry32(seed);

  const abandonRatio = totalRepos > 0 ? (totalRepos - activeCount) / totalRepos : 0;
  const starsPerRepo = totalRepos > 0 ? stats.total_stars / totalRepos : 0;
  const commitsPerRepo = ownRepos.length > 0 ? totalCommits / ownRepos.length : 0;

  // Higher score = more "roastable" (chaotic profile)
  let rawScore = 50;
  rawScore += abandonRatio * 30;                    // many abandoned → high score
  rawScore -= Math.min(starsPerRepo, 10) * 1.5;    // many stars → lower score
  rawScore -= Math.min(commitsPerRepo / 10, 15);   // high commit depth → lower
  rawScore += Math.min(totalRepos / 5, 10);         // lots of repos → slightly higher

  const modeBias: Record<RoastMode, number> = { brutal: 8, hacker: 12, friendly: -8, recruiter: -2 };
  rawScore += modeBias[mode] + (rand() - 0.5) * 6;
  const roastScore = clamp(Math.round(rawScore), 15, 99);

  // ── GitHub stats ──
  const githubStats: GitHubStats = {
    repos: totalRepos,
    active: activeCount,
    stars: stats.total_stars,
    forks: stats.total_forks,
    commits: totalCommits,
    contributions: contributions.total_contributions,
    followers: profile.followers,
    following: profile.following,
  };

  // ── Technologies from backend languages ──
  const LANG_COLORS: Record<string, string> = {
    Python: "#3572A5", JavaScript: "#f1e05a", TypeScript: "#3178c6",
    "HTML/CSS": "#e34c26", Go: "#00ADD8", Rust: "#dea584",
    Java: "#b07219", "C++": "#f34b7d", C: "#555555", Ruby: "#701516",
    PHP: "#4F5D95", Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB",
    Shell: "#89e051", "Jupyter Notebook": "#DA5B0B",
  };
  const NEO_COLORS = ["#ff4d00", "#ffc300", "#e63946", "#ff7a00", "#a855f7"];
  const technologies: TechnologyDNA[] = analysis.languages.slice(0, 6).map((lang, i) => ({
    name: lang.name,
    value: clamp(Math.round((lang.score / (analysis.languages[0]?.score || 1)) * 95), 10, 99),
    color: LANG_COLORS[lang.name] || NEO_COLORS[i % NEO_COLORS.length],
  }));

  // ── Developer style from real data ──
  const noDescCount = repos.filter((r) => !r.description).length;
  const descPct = repos.length > 0 ? Math.round(((repos.length - noDescCount) / repos.length) * 100) : 50;
  const commitConsistency = commitsPerRepo > 20 ? 85 : commitsPerRepo > 5 ? 60 : 30;

  const developerStyle: DeveloperStyle[] = [
    { name: "Builder", value: clamp(Math.round(40 + (totalRepos / 2) + (totalCommits / 100)), 20, 99) },
    { name: "Experimenter", value: clamp(Math.round(30 + analysis.languages.length * 8), 20, 99) },
    { name: "Open Source", value: clamp(Math.round(20 + stats.total_stars * 2 + stats.total_forks * 3), 15, 99) },
    { name: "Documentation", value: clamp(descPct, 10, 99) },
    { name: "Consistency", value: clamp(commitConsistency, 10, 99) },
  ];

  // ── Personality from personas ──
  const personaLabels = analysis.personas;
  let personalityTitle = "The Generalist";
  if (personaLabels.includes("Frontend")) personalityTitle = "The UI Artisan";
  else if (personaLabels.includes("Backend")) personalityTitle = "The Backend Architect";
  else if (personaLabels.includes("Machine Learning / AI")) personalityTitle = "The AI Alchemist";
  else if (personaLabels.includes("DevOps / Cloud")) personalityTitle = "The Cloud Wrangler";
  else if (personaLabels.includes("Mobile")) personalityTitle = "The Mobile Craftsperson";
  else if (personaLabels.includes("Data Science / Data Engineering")) personalityTitle = "The Data Whisperer";

  if (abandonRatio > 0.6) personalityTitle = "The Serial Starter";
  if (totalRepos > 50 && commitsPerRepo < 5) personalityTitle = "The Idea Hoarder";

  const personality = {
    title: personalityTitle,
    description: roast[mode], // use the AI roast text as the personality description
  };

  // ── Crimes: derived from real repo analysis patterns ──
  const crimes: Crime[] = [];
  let crimeId = 1;

  if (totalRepos - activeCount > 3) {
    crimes.push({
      id: crimeId++,
      category: "Project Graveyard",
      evidence: `${totalRepos - activeCount} inactive repositories`,
      roast: CRIME_POOL.find((c) => c.category === "Project Graveyard")?.roasts[mode] ||
        "You start more projects than you finish.",
      severity: clamp(Math.round(60 + abandonRatio * 35), 40, 99),
    });
  }

  if (noDescCount > 3) {
    crimes.push({
      id: crimeId++,
      category: "Documentation Crimes",
      evidence: `${100 - descPct}% repos without descriptions`,
      roast: CRIME_POOL.find((c) => c.category === "Documentation Crimes")?.roasts[mode] ||
        "Your code speaks for itself. Unfortunately, nobody understands it.",
      severity: clamp(Math.round(50 + (100 - descPct) * 0.4), 35, 95),
    });
  }

  if (analysis.languages.length > 5) {
    crimes.push({
      id: crimeId++,
      category: "Tech Stack Chaos",
      evidence: `${analysis.languages.length} languages detected`,
      roast: CRIME_POOL.find((c) => c.category === "Tech Stack Chaos")?.roasts[mode] ||
        "You don't have a tech stack. You have commitment issues.",
      severity: clamp(Math.round(55 + analysis.languages.length * 2.5), 40, 95),
    });
  }

  const tempKeywords = ["test", "demo", "sample", "temp", "final", "draft", "hello", "practice", "copy"];
  const tempRepos = repos.filter((r) => tempKeywords.some((kw) => r.name.toLowerCase().includes(kw)));
  if (tempRepos.length > 1) {
    crimes.push({
      id: crimeId++,
      category: "Naming Crimes",
      evidence: `${tempRepos.length} repos named ${tempRepos.slice(0, 2).map((r) => r.name).join(", ")}`,
      roast: CRIME_POOL.find((c) => c.category === "Naming Crimes")?.roasts[mode] ||
        "Your version control strategy is adding 'final' to filenames.",
      severity: clamp(Math.round(50 + tempRepos.length * 8), 35, 90),
    });
  }

  if (forkedCount > 5) {
    crimes.push({
      id: crimeId++,
      category: "Fork Addiction",
      evidence: `${forkedCount} forked repositories`,
      roast: mode === "brutal"
        ? "You've forked more repos than you've committed to your own."
        : mode === "friendly"
          ? "You love exploring other people's code! Learning is wonderful."
          : mode === "recruiter"
            ? "Shows strong community engagement and code review habits."
            : "We traced your forks. You clone repos, star them, and leave.",
      severity: clamp(Math.round(40 + forkedCount * 3), 30, 85),
    });
  }

  if (totalCommits > 500) {
    crimes.push({
      id: crimeId++,
      category: "Commit Obsession",
      evidence: `${totalCommits} total commits`,
      roast: CRIME_POOL.find((c) => c.category === "Commit Crimes")?.roasts[mode] ||
        "Your commit history is a novel.",
      severity: clamp(Math.round(30 + Math.min(totalCommits / 50, 40)), 30, 80),
    });
  }

  // Always ensure at least 3 crimes for the UI
  if (crimes.length < 3) {
    const fallbackCrimes = CRIME_POOL.filter((c) => !crimes.some((ec) => ec.category === c.category));
    for (const fc of fallbackCrimes.slice(0, 3 - crimes.length)) {
      crimes.push({
        id: crimeId++,
        category: fc.category,
        evidence: fc.evidence,
        roast: fc.roasts[mode],
        severity: clamp(jitter(rand, fc.severity, 10), 30, 99),
      });
    }
  }

  crimes.sort((a, b) => b.severity - a.severity);
  crimes.forEach((c, i) => (c.id = i + 1));

  // ── Stats ──
  const roastStats: RoastStats = {
    projectsStarted: totalRepos,
    projectsFinished: activeCount,
    abandoned: totalRepos - activeCount,
    techStackChaos: clamp(Math.round(analysis.languages.length * 8 + 10), 10, 99),
    documentation: clamp(descPct, 5, 99),
    commitObsession: clamp(Math.round(Math.min(totalCommits / 20, 95)), 10, 99),
    completion: totalRepos > 0 ? clamp(Math.round((activeCount / totalRepos) * 100), 5, 99) : 50,
  };

  // ── Weekly commits from contribution calendar ──
  const calendar = contributions.contribution_calendar;
  const weeklyCommits: number[] = [];
  if (calendar && typeof calendar === "object" && "weeks" in calendar) {
    const weeks = (calendar as { weeks: Array<{ contributionDays: Array<{ contributionCount: number }> }> }).weeks;
    const recentWeeks = weeks.slice(-12);
    for (const week of recentWeeks) {
      const total = week.contributionDays.reduce((s, d) => s + d.contributionCount, 0);
      weeklyCommits.push(total);
    }
  }
  // Pad to 12 weeks if needed
  while (weeklyCommits.length < 12) {
    weeklyCommits.unshift(Math.round(rand() * 10));
  }

  // ── Timeline from real data ──
  const timeline: TimelineEvent[] = [];
  if (stats.newest_repository) {
    timeline.push({ icon: "rocket", label: "Latest project", detail: stats.newest_repository });
  }
  if (stats.most_starred_repository) {
    timeline.push({ icon: "git", label: "Most starred", detail: `${stats.most_starred_repository} (${stats.total_stars} ⭐)` });
  }
  if (totalRepos - activeCount > 3) {
    timeline.push({ icon: "archive", label: "Project graveyard", detail: `${totalRepos - activeCount} repos gathering dust` });
  }
  if (contributions.total_contributions > 100) {
    timeline.push({ icon: "rocket", label: "Contribution streak", detail: `${contributions.total_contributions} contributions this year` });
  }
  if (timeline.length < 2) {
    timeline.push({ icon: "warning", label: "Evidence collected", detail: `${totalRepos} repos analyzed` });
  }

  // ── Verdict ──
  const verdict = VERDICTS[mode];

  // ── Final roast ──
  const finalRoast = roast[mode];

  // ── Share text ──
  const shareText =
    `🔥 GitGiggles — @${username} scored ${roastScore}/100 (${MODE_LABELS[mode]} mode). ` +
    `Personality: ${personality.title}. ` +
    `${crimes[0]?.evidence ?? "Evidence found"}. ` +
    `"${crimes[0]?.roast ?? "We have evidence."}" — can you handle the giggles?`;

  return {
    username,
    mode,
    roastScore,
    roastLevelLabel:
      roastScore >= 90 ? "Certified Menace" : roastScore >= 80 ? "Repeat Offender" : roastScore >= 65 ? "Suspect" : "Minor Offense",
    subtitle: SUBTITLES[mode],
    personality,
    profile: {
      avatar: profile.avatar,
      displayName: profile.display_name,
      bio: profile.bio,
      followers: profile.followers,
      following: profile.following,
    },
    stats: roastStats,
    githubStats,
    crimes,
    technologies,
    developerStyle,
    summary:
      `Analysis complete for @${username}: ${totalRepos} repositories, ` +
      `${stats.total_stars} stars, ${totalCommits} commits across ${analysis.languages.length} languages.`,
    verdict,
    finalRoast,
    weeklyCommits,
    timeline,
    shareText,
  };
}
