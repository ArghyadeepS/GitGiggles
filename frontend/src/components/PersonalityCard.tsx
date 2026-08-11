import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { RoastData } from "@/lib/roast";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { StatBar } from "@/components/StatBar";

export function PersonalityCard({ data }: { data: RoastData }) {
  const { stats, personality } = data;
  const numberTiles = [
    { label: "Projects Started", value: stats.projectsStarted },
    { label: "Projects Finished", value: stats.projectsFinished },
    { label: "Abandoned", value: stats.abandoned },
  ];
  const bars = [
    { label: "Tech Stack Chaos", value: stats.techStackChaos, color: "var(--neo)" },
    { label: "Documentation", value: stats.documentation, color: "var(--neo-yellow)" },
    { label: "Commit Obsession", value: stats.commitObsession, color: "var(--neo-fire)" },
    { label: "Project Completion", value: stats.completion, color: "var(--neo-purple)" },
  ];

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.55 }}
        className="overflow-hidden border-2 border-white/20 bg-card shadow-[8px_8px_0_0_rgba(255,77,0,0.3)]"
      >
        {/* RPG class header */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-foreground bg-primary px-6 py-5 text-primary-foreground">
          <div>
            <p className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-[0.25em] uppercase opacity-70">
              <Sparkles className="size-3.5" /> Developer Personality
            </p>
            <h3 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              {personality.title}
            </h3>
          </div>
          <span className="border-2 border-primary-foreground/60 px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest uppercase">
            class locked in
          </span>
        </header>

        <div className="grid gap-8 p-6 lg:grid-cols-2 lg:p-8">
          <div>
            <blockquote className="border-l-4 border-primary bg-muted px-5 py-4 text-base leading-7 text-foreground/90 italic">
              “{personality.description}”
            </blockquote>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {numberTiles.map((tile, index) => (
                <motion.div
                  key={tile.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
                  className="border-2 border-white/12 bg-muted p-3 text-center"
                >
                  <AnimatedNumber
                    value={tile.value}
                    className="text-2xl font-bold tabular-nums"
                  />
                  <p className="mt-1 font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
                    {tile.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-5">
            {bars.map((bar, index) => (
              <StatBar
                key={bar.label}
                label={bar.label}
                value={bar.value}
                suffix=""
                color={bar.color}
                delay={0.1 + index * 0.1}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
