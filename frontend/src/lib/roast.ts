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
