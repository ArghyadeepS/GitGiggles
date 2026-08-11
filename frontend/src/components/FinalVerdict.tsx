import { motion } from "framer-motion";
import { Gavel } from "lucide-react";
import type { RoastData } from "@/lib/roast";

const THREAT_COLORS: Record<string, string> = {
  HIGH: "var(--destructive)",
  CRITICAL: "var(--destructive)",
  MODERATE: "var(--neo-yellow)",
  RISING: "var(--neo)",
};

export function FinalVerdict({ data }: { data: RoastData }) {
  const { verdict } = data;
  const threatColor = THREAT_COLORS[verdict.threatLevel] ?? "var(--neo)";

  return (
    <section className="relative">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.55 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="flex items-center justify-center gap-2 font-mono text-[11px] font-bold tracking-[0.25em] text-primary uppercase">
          <Gavel className="size-4" /> The Final Verdict
        </p>
        <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          The court has <span className="text-fire">spoken.</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative mx-auto mt-12 max-w-2xl"
      >
        <div
          aria-hidden="true"
          className="glow-fire pointer-events-none absolute -inset-8 -z-10 rounded-full bg-primary/10 blur-[80px]"
        />
        <div className="border-2 border-white/25 bg-[#050505] p-8 font-mono sm:p-10">
          <div className="flex items-center justify-between border-b-2 border-white/10 pb-4">
            <span className="text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
              verdict.txt
            </span>
            <span className="flex gap-1.5">
              <span className="size-2 border border-white/40 bg-muted" />
              <span className="size-2 border border-white/40 bg-muted" />
              <span className="size-2 border border-white/40 bg-destructive" />
            </span>
          </div>

          <dl className="mt-6 space-y-6">
            <div>
              <dt className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                Developer Class
              </dt>
              <dd className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {verdict.developerClass}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                Status
              </dt>
              <dd className="mt-1.5 border-l-4 border-primary pl-3 text-sm leading-6 text-foreground/90">
                “{verdict.status}”
              </dd>
            </div>
            <div className="flex items-center justify-between border-t-2 border-white/10 pt-5">
              <dt className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                Threat Level
              </dt>
              <dd
                className="text-lg font-bold tracking-widest"
                style={{ color: threatColor }}
              >
                {verdict.threatLevel}
              </dd>
            </div>
          </dl>
          <span className="mt-4 inline-block h-4 w-2.5 animate-pulse bg-primary" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, delay: 0.2 }}
        className="mx-auto mt-14 max-w-3xl text-center"
      >
        <p className="text-2xl leading-snug font-bold tracking-tight text-foreground italic sm:text-3xl">
          “{data.finalRoast}”
        </p>
        <p className="mt-4 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
          — the roast engine, reluctantly impressed
        </p>
      </motion.div>
    </section>
  );
}
