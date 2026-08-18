import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import type { RoastData } from "@/lib/roast";
import { AnimatedNumber } from "@/components/AnimatedNumber";

export function RoastScore({ data }: { data: RoastData }) {
  return (
    <section className="relative overflow-hidden border-2 border-black/15 bg-card p-8 sm:p-12">
      <div
        aria-hidden="true"
        className="glow-fire pointer-events-none absolute -top-24 left-1/2 h-[260px] w-[480px] -translate-x-1/2 rounded-full bg-primary/15 blur-[90px]"
      />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative text-center">
        <p className="flex items-center justify-center gap-2 font-mono text-[11px] font-bold tracking-[0.25em] text-primary uppercase">
          <Flame className="size-3.5 fill-primary" /> Your Roast Level
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 flex items-end justify-center gap-3"
        >
          <AnimatedNumber
            value={data.roastScore}
            duration={2}
            className="text-fire text-8xl leading-none font-bold tabular-nums sm:text-9xl"
          />
          <span className="mb-2 text-3xl font-bold text-muted-foreground">
            / 100
          </span>
        </motion.div>

        <div className="mx-auto mt-8 h-5 w-full max-w-xl border-2 border-foreground/50 bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.roastScore}%` }}
            transition={{ duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-[#e63946] via-primary to-accent"
          />
        </div>

        <p className="mt-6 font-mono text-xs font-bold tracking-[0.25em] text-muted-foreground uppercase">
          {data.roastLevelLabel}
        </p>
        <p className="mt-2 text-xl font-bold tracking-tight">{data.subtitle}</p>
      </div>
    </section>
  );
}
