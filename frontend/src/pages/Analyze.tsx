import { motion } from "framer-motion";
import { ArrowRight, Check, Flame, SkipForward } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  generateRoast,
  ROAST_MODES,
  saveRoast,
  type RoastMode,
} from "@/lib/roast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RoastLoading } from "@/components/RoastLoading";

const MODE_KEY = "gitgiggles:mode";

type Phase = "setup" | "running" | "done";

export default function Analyze() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("setup");
  const [mode, setMode] = useState<RoastMode>(() => {
    const saved = localStorage.getItem(MODE_KEY);
    return (saved as RoastMode) || "brutal";
  });

  const username = user?.username ?? "developer";

  const startInvestigation = () => {
    localStorage.setItem(MODE_KEY, mode);
    setPhase("running");
  };

  const handleReveal = useCallback(() => {
    const data = generateRoast(username, mode);
    saveRoast({ data, demo: false });
    navigate("/roast", { state: { data } });
  }, [username, mode, navigate]);

  const handleComplete = useCallback(() => {
    setPhase("done");
  }, []);

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
                Step 1 — pick your mode
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Choose your roast.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                Every mode runs on the same evidence. Only the mercy level
                changes.
              </p>

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
                  Investigating your GitHub...
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                  This is taking a while because we're being thorough. Or
                  dramatic. Same thing.
                </p>
              </div>

              <div className="mt-10">
                <RoastLoading
                  username={username}
                  mode={mode}
                  onComplete={handleComplete}
                />
              </div>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={handleComplete}
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
                  We have receipts. We have timestamps. We have your "final2"
                  repository.
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
