import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { AnimatedNumber } from "@/components/AnimatedNumber";

function TerminalPreview({ onViewFull }: { onViewFull: () => void }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ rotate: -1.2, scale: 1.015 }}
      className="relative mx-auto w-full max-w-md"
    >
      {/* Glow */}
      <div className="glow-fire absolute -inset-6 -z-10 bg-primary/20" aria-hidden="true" />

      <div className="border-2 border-white/25 bg-[#0b0b0f] shadow-[10px_10px_0_0_rgba(255,77,0,0.35)]">
        {/* Terminal chrome */}
        <div className="flex items-center justify-between border-b-2 border-white/10 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 border border-white/40 bg-muted" />
            <span className="size-2.5 border border-white/40 bg-muted" />
            <span className="size-2.5 border border-white/40 bg-destructive" />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            roast-report.tsx
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest text-primary uppercase">
              <Flame className="size-3.5 fill-primary" /> Roast Report
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              @<span className="text-foreground">alexdev</span>
            </p>
          </div>

          <div className="mt-6">
            <p className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Roast level
            </p>
            <div className="mt-2 h-4 w-full border-2 border-foreground/50 bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "87%" }}
                transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-[#e63946] via-primary to-accent"
              />
            </div>
            <p className="mt-1.5 font-mono text-lg font-bold tabular-nums">
              <AnimatedNumber value={87} duration={2} />/100
            </p>
          </div>

          <h3 className="mt-6 text-2xl font-bold tracking-tight">
            The Serial Starter
          </h3>

          <dl className="mt-4 grid grid-cols-3 gap-2 font-mono text-[11px]">
            {[
              { label: "repos", value: 42 },
              { label: "active", value: 8 },
              { label: "abandoned", value: 34 },
            ].map((stat) => (
              <div key={stat.label} className="border-2 border-white/10 bg-muted p-2 text-center">
                <dt className="tracking-widest text-muted-foreground uppercase">
                  {stat.label}
                </dt>
                <dd className="mt-0.5 text-base font-bold tabular-nums text-foreground">
                  <AnimatedNumber value={stat.value} duration={1.8} />
                </dd>
              </div>
            ))}
          </dl>

          <blockquote className="mt-5 border-l-4 border-primary bg-muted px-4 py-3 text-sm leading-6 text-foreground/90 italic">
            “Bro is collecting repositories like Pokémon.”
          </blockquote>

          <button
            type="button"
            onClick={onViewFull}
            className="mt-5 flex w-full items-center justify-center gap-2 border-2 border-foreground bg-primary px-4 py-3 font-mono text-xs font-bold tracking-widest text-primary-foreground uppercase transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none neo-shadow-sm"
          >
            View full roast <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function Hero({ onRoast }: { onRoast: () => void }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePrimary = () => {
    if (isAuthenticated) {
      navigate("/analyze");
    } else {
      onRoast();
    }
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background: fire glow + grid + noise */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full bg-[#e63946]/10 blur-[120px]" />
        <div className="bg-grid absolute inset-0 opacity-70" />
        <div className="bg-noise absolute inset-0" />
      </div>

      {/* Faint terminal texture */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute top-28 left-6 hidden font-mono text-[11px] leading-6 text-white/[0.05] select-none lg:block"
      >
        $ git commit -m "one more time, i swear"
        <br />$ git push --force origin main
        <br />$ npm install 4-more-frameworks
        <br />$ // 42 repos. 8 active. 34 feelings.
        <br />$ rm -rf self_esteem && cd ..
      </p>

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border-2 border-white/15 bg-card px-3 py-1.5 font-mono text-[11px] font-bold tracking-widest text-muted-foreground uppercase"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping bg-primary opacity-60" />
              <span className="relative inline-flex size-2 bg-primary" />
            </span>
            The GitGiggles Roast Engine
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-5xl leading-[0.95] font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Your GitHub.
            <br />
            <span className="text-fire">Our judgment.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg"
          >
            We analyze your repositories, coding habits, abandoned projects,
            tech stack and questionable decisions — then turn the evidence into
            a brutally personalized roast.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <button
              type="button"
              onClick={handlePrimary}
              className="group flex items-center justify-center gap-2 border-2 border-foreground bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none neo-shadow"
            >
              <Flame className="size-4 fill-primary-foreground transition-transform group-hover:scale-125" />
              Get Roasted
            </button>
            <button
              type="button"
              onClick={() => navigate("/roast", { state: { demo: true } })}
              className="flex items-center justify-center gap-2 border-2 border-white/20 bg-transparent px-6 py-3.5 text-sm font-bold text-foreground transition-all hover:border-foreground hover:bg-card"
            >
              See an Example
              <ArrowRight className="size-4" />
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-6 font-mono text-[11px] tracking-widest text-muted-foreground uppercase"
          >
            GitHub OAuth <span className="mx-2 text-primary">•</span> AI-powered
            <span className="mx-2 text-primary">•</span> Evidence-based
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          <TerminalPreview
            onViewFull={() => navigate("/roast", { state: { demo: true } })}
          />
        </motion.div>
      </div>
    </section>
  );
}
