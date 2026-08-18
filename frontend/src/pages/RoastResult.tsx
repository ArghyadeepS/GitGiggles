import { motion } from "framer-motion";
import { ArrowRight, Flame, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  generateRoast,
  loadRoast,
  ROAST_MODES,
  saveRoast,
  type RoastData,
} from "@/lib/roast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Avatar } from "@/components/UserAvatar";
import { RoastScore } from "@/components/RoastScore";
import { GitHubStats } from "@/components/GitHubStats";
import { PersonalityCard } from "@/components/PersonalityCard";
import { CrimeCard } from "@/components/CrimeCard";
import { LanguageDNA } from "@/components/LanguageDNA";
import { RoastTimeline } from "@/components/RoastTimeline";
import { FinalVerdict } from "@/components/FinalVerdict";
import { ShareCard } from "@/components/ShareCard";

interface RoastLocationState {
  data?: RoastData;
  demo?: boolean;
}

export default function RoastResult() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as RoastLocationState | null;
  const isDemoRequest = Boolean(state?.demo);

  const [data, setData] = useState<RoastData | null>(() => {
    if (state?.demo) {
      const demo = generateRoast("octocat", "brutal");
      saveRoast({ data: demo, demo: true });
      return demo;
    }
    if (state?.data) {
      saveRoast({ data: state.data, demo: false });
      return state.data;
    }
    const saved = loadRoast();
    if (saved) {
      return saved.data;
    }
    return null;
  });

  const [isDemo, setIsDemo] = useState<boolean>(() => {
    if (state?.demo) return true;
    if (state?.data) return false;
    const saved = loadRoast();
    if (saved) return saved.demo;
    return isDemoRequest;
  });

  useEffect(() => {
    // State is already initialized correctly on mount, but if location.state changes later:
    if (state?.demo) {
      const demo = generateRoast("octocat", "brutal");
      setData(demo);
      setIsDemo(true);
      saveRoast({ data: demo, demo: true });
      return;
    }
    if (state?.data) {
      setData(state.data);
      setIsDemo(false);
      saveRoast({ data: state.data, demo: false });
      return;
    }
    const saved = loadRoast();
    if (saved) {
      setData(saved.data);
      setIsDemo(saved.demo);
    }
  }, [state]);

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    if (isDemoRequest) {
      return (
        <div className="grid min-h-screen place-items-center bg-background">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      );
    }
    return <Navigate to="/analyze" replace />;
  }

  // A real (non-demo) roast requires a signed-in developer. Demo roasts are
  // public so the landing page can showcase the experience.
  if (!isDemo && !isAuthenticated) {
    return <Navigate to="/login?returnTo=%2Froast" replace />;
  }

  const modeInfo = ROAST_MODES.find((m) => m.id === data.mode) ?? ROAST_MODES[0];
  const showRealAvatar =
    !isDemo && user?.username === data.username ? user.avatarUrl : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="relative overflow-hidden pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-grid absolute inset-0 opacity-40" />
          <div className="absolute -top-32 left-1/2 h-[440px] w-[840px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        </div>

        <div className="mx-auto max-w-5xl px-6">
          {/* Report header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="inline-flex items-center gap-2 border-2 border-white px-4 py-2 font-mono text-[11px] font-bold tracking-[0.25em] text-primary uppercase">
              <Flame className="size-4 fill-primary" /> Roast Report
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Avatar
                username={data.username}
                avatarUrl={data.profile.avatar || showRealAvatar}
                className="size-14"
              />
              <div className="text-left">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {data.profile.displayName || `@${data.username}`}
                </h1>
                <p className="mt-1 flex items-center gap-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                  Mode:{" "}
                  <span className="border border-border bg-muted px-2 py-0.5 font-bold text-accent">
                    {modeInfo.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate("/analyze")}
                    className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    change
                  </button>
                </p>
                {data.profile.bio && (
                  <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    {data.profile.bio}
                  </p>
                )}
              </div>
            </div>

            {isDemo && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mx-auto mt-8 flex max-w-2xl flex-col items-center justify-between gap-4 border-2 border-accent/50 bg-accent/10 p-4 sm:flex-row"
              >
                <p className="text-sm leading-6 text-foreground/90">
                  <span className="font-mono font-bold tracking-widest text-accent uppercase">
                    Demo roast
                  </span>{" "}
                  — this used a sample profile so you can preview the goods.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/analyze")}
                  className="flex shrink-0 items-center gap-2 border-2 border-foreground bg-primary px-4 py-2.5 font-mono text-[11px] font-bold tracking-widest text-primary-foreground uppercase transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none neo-shadow-sm"
                >
                  Run your own roast <ArrowRight className="size-3.5" />
                </button>
              </motion.div>
            )}
          </motion.header>

          <div className="mt-14 space-y-20">
            <RoastScore data={data} />

            <section>
              <GitHubStats stats={data.githubStats} />
            </section>

            <PersonalityCard data={data} />

            {/* Crimes */}
            <section>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="font-mono text-[11px] font-bold tracking-[0.25em] text-primary uppercase">
                  The evidence
                </p>
                <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                  The Case <span className="text-fire">Files</span>
                </h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Each charge is backed by evidence from your profile.
                  Objections are welcome. Appeals are not.
                </p>
              </motion.div>

              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.crimes.map((crime, index) => (
                  <CrimeCard key={crime.id} crime={crime} index={index} />
                ))}
              </div>
            </section>

            <LanguageDNA data={data} />
            <RoastTimeline data={data} />
            <FinalVerdict data={data} />
            <ShareCard data={data} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
