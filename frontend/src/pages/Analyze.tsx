import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Check, Flame, SkipForward } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  buildRoastDataFromAPI,
  generateRoast,
  ROAST_MODES,
  saveRoast,
  type RoastMode,
} from "@/lib/roast";
import { analyzeAndRoast, ApiError } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RoastLoading } from "@/components/RoastLoading";

const MODE_KEY = "gitgiggles:mode";

type Phase = "setup" | "running" | "done" | "error";

export default function Analyze() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("setup");
  const [mode, setMode] = useState<RoastMode>(() => {
    const saved = localStorage.getItem(MODE_KEY);
    return (saved as RoastMode) || "brutal";
  });

  // GitHub username input — defaults to auth username, but user can change it
  const [usernameInput, setUsernameInput] = useState(
    () => user?.username ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  // Track API call state separately from animation state
  const [apiDone, setApiDone] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const apiResultRef = useRef<Awaited<
    ReturnType<typeof analyzeAndRoast>
  > | null>(null);

  // Update username input when user auth resolves
  useEffect(() => {
    if (user?.username && !usernameInput) {
      setUsernameInput(user.username);
    }
  }, [user?.username]);

  const username = usernameInput.trim() || user?.username || "developer";

  const startInvestigation = () => {
    if (!usernameInput.trim()) {
      setError("Enter a GitHub username to roast.");
      return;
    }
    setError(null);
    localStorage.setItem(MODE_KEY, mode);
    setPhase("running");
    setApiDone(false);
    setAnimDone(false);
    apiResultRef.current = null;

    // Fire API calls immediately when the investigation starts
    analyzeAndRoast(usernameInput.trim())
      .then((result) => {
        apiResultRef.current = result;
        setApiDone(true);
      })
      .catch((err) => {
        console.error("API call failed:", err);
        const message =
          err instanceof ApiError
            ? err.message
            : "Something went wrong. Check the backend is running.";
        setError(message);
        setPhase("error");
      });
  };

  const handleReveal = useCallback(() => {
    const result = apiResultRef.current;
    if (result) {
      // Use REAL backend data
      const data = buildRoastDataFromAPI(result.analysis, result.roast, mode);
      saveRoast({ data, demo: false });
      navigate("/roast", { state: { data } });
    } else {
      // Fallback to mock data if somehow API result is missing
      const data = generateRoast(username, mode);
      saveRoast({ data, demo: false });
      navigate("/roast", { state: { data } });
    }
  }, [username, mode, navigate]);

  const handleAnimComplete = useCallback(() => {
    setAnimDone(true);
  }, []);

  // When BOTH API and animation are done, automatically transition to "done" phase
  useEffect(() => {
    if (apiDone && animDone && phase === "running") {
      setPhase("done");
    }
  }, [apiDone, animDone, phase]);

  const handleRetry = () => {
    setError(null);
    setPhase("setup");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="relative flex-1 overflow-hidden pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-grid absolute inset-0 opacity-50" />
          <div className="absolute -top-24 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-primary/12 blur-[130px]" />
        </div>

        <div className="mx-auto max-w-4xl px-6">
          {phase === "setup" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="font-mono text-[11px] font-bold tracking-[0.25em] text-primary uppercase">
                Step 1 — pick your target & mode
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Choose your roast.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                Every mode runs on the same evidence. Only the mercy level
                changes.
              </p>

              {/* GitHub Username Input */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mx-auto mt-8 max-w-md"
              >
                <label
                  htmlFor="github-username"
                  className="mb-2 block font-mono text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase"
                >
                  GitHub username or URL
                </label>
                <input
                  id="github-username"
                  type="text"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && usernameInput.trim()) {
                      startInvestigation();
                    }
                  }}
                  placeholder="e.g. torvalds or https://github.com/torvalds"
                  className="w-full border-2 border-white/15 bg-card px-4 py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground transition-colors"
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center gap-2 border-2 border-destructive/40 bg-destructive/10 px-3 py-2 text-left font-mono text-xs text-destructive"
                  >
                    <AlertCircle className="size-3.5 shrink-0" />
                    {error}
                  </motion.p>
                )}
              </motion.div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {ROAST_MODES.map((option, index) => {
                  const selected = mode === option.id;
                  return (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() => setMode(option.id)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.07 }}
                      className={cn(
                        "relative border-2 p-5 text-left transition-all duration-200",
                        selected
                          ? "border-foreground bg-primary text-primary-foreground shadow-none neo-shadow-sm"
                          : "border-white/15 bg-card hover:border-foreground/60",
                      )}
                    >
                      {selected && (
                        <span className="absolute -top-2.5 -right-2.5 grid size-6 place-items-center border-2 border-foreground bg-accent text-accent-foreground">
                          <Check className="size-3.5" strokeWidth={3} />
                        </span>
                      )}
                      <p className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-70">
                        {option.tagline}
                      </p>
                      <h2 className="mt-1.5 text-xl font-bold tracking-tight">
                        {option.label}
                      </h2>
                      <p className="mt-1.5 text-sm leading-6 opacity-80">
                        {option.description}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-10 flex flex-col items-center gap-3"
              >
                <button
                  type="button"
                  onClick={startInvestigation}
                  className="group flex items-center gap-2 border-2 border-foreground bg-primary px-7 py-4 text-base font-bold text-primary-foreground transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none neo-shadow"
                >
                  <Flame className="size-5 fill-primary-foreground transition-transform group-hover:scale-125" />
                  Start the roast
                </button>
                <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                  Brutal is the default. The other modes are for the faint of
                  heart.
                </p>
              </motion.div>
            </motion.div>
          )}

          {phase === "running" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <p className="font-mono text-[11px] font-bold tracking-[0.25em] text-primary uppercase">
                  Step 2 — gathering evidence
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                  Investigating @{username}...
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                  We're analyzing the real GitHub profile. This may take a
                  moment.
                </p>
              </div>

              <div className="mt-10">
                <RoastLoading
                  username={username}
                  mode={mode}
                  onComplete={handleAnimComplete}
                />
              </div>

              {/* Show extra waiting message if animation is done but API isn't */}
              {animDone && !apiDone && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 text-center font-mono text-xs tracking-widest text-muted-foreground uppercase"
                >
                  Still waiting for the backend... analyzing repos and
                  generating AI roasts.
                </motion.p>
              )}

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={handleAnimComplete}
                  className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
                >
                  <SkipForward className="size-3.5" /> Skip the theatrics
                </button>
              </div>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <p className="font-mono text-[11px] font-bold tracking-[0.25em] text-primary uppercase">
                  Step 3 — the verdict
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                  The evidence is <span className="text-fire">overwhelming.</span>
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                  We analyzed @{username}'s real GitHub profile. The results are
                  in.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-10"
              >
                <button
                  type="button"
                  onClick={handleReveal}
                  className="group inline-flex items-center gap-2.5 border-2 border-foreground bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none neo-shadow"
                >
                  Show me my roast
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </button>
                <p className="mt-4 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                  No refunds. No take-backs.
                </p>
              </motion.div>
            </motion.div>
          )}

          {phase === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mx-auto inline-flex size-16 items-center justify-center border-2 border-destructive/50 bg-destructive/10">
                <AlertCircle className="size-8 text-destructive" />
              </div>
              <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Investigation <span className="text-destructive">failed.</span>
              </h1>
              {error && (
                <p className="mx-auto mt-4 max-w-lg border-2 border-destructive/30 bg-destructive/5 px-5 py-3 font-mono text-sm leading-6 text-foreground/90">
                  {error}
                </p>
              )}
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="group flex items-center gap-2 border-2 border-foreground bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none neo-shadow-sm"
                >
                  <Flame className="size-4" /> Try again
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 border-2 border-white/20 bg-transparent px-6 py-3.5 text-sm font-bold text-foreground transition-all hover:border-foreground hover:bg-card"
                >
                  Back to home
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
