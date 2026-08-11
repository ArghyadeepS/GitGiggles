import { motion } from "framer-motion";
import {
  Archive,
  GitCommitHorizontal,
  Moon,
  Rocket,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { RoastData } from "@/lib/roast";

const EVENT_ICONS: Record<string, LucideIcon> = {
  archive: Archive,
  rocket: Rocket,
  moon: Moon,
  warning: TriangleAlert,
  git: GitCommitHorizontal,
};

export function RoastTimeline({ data }: { data: RoastData }) {
  const maxCommits = Math.max(...data.weeklyCommits, 1);

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.55 }}
        className="border-2 border-white/15 bg-card p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-mono text-xs font-bold tracking-[0.25em] text-foreground uppercase">
            Commit activity — last 12 weeks
          </h3>
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            momentum: fading
          </span>
        </div>

        <div className="mt-8 flex h-44 items-end gap-1.5 sm:gap-2">
          {data.weeklyCommits.map((count, index) => {
            const height = Math.max(4, (count / maxCommits) * 100);
            return (
              <div
                key={index}
                className="group relative flex h-full flex-1 flex-col justify-end"
              >
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={
                    index >= 8
                      ? "w-full bg-gradient-to-t from-[#e63946]/40 to-[#e63946]/70"
                      : "w-full bg-gradient-to-t from-primary/50 to-primary"
                  }
                />
                <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 border border-white/15 bg-[#0b0b0f] px-1.5 py-0.5 font-mono text-[9px] whitespace-nowrap text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  {count} commits
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
          <span>12 weeks ago</span>
          <span>today</span>
        </div>

        <div className="mt-8 space-y-4 border-t-2 border-white/10 pt-6">
          {data.timeline.map((event, index) => {
            const Icon = EVENT_ICONS[event.icon] ?? GitCommitHorizontal;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="grid size-9 shrink-0 place-items-center border-2 border-foreground bg-muted text-primary">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-bold tracking-tight">
                    {event.label}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {event.detail}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
