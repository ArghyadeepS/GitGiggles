import { motion } from "framer-motion";
import { Dna } from "lucide-react";
import type { RoastData } from "@/lib/roast";
import { StatBar } from "@/components/StatBar";

export function LanguageDNA({ data }: { data: RoastData }) {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.55 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="flex items-center justify-center gap-2 font-mono text-[11px] font-bold tracking-[0.25em] text-primary uppercase">
          <Dna className="size-4" /> The real signal
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Okay, but what does your GitHub actually say about you?
        </h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Underneath the comedy, there's actual signal. Here's yours.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55 }}
          className="border-2 border-white/15 bg-card p-6 sm:p-8"
        >
          <h3 className="font-mono text-xs font-bold tracking-[0.25em] text-foreground uppercase">
            Technology DNA
          </h3>
          <div className="mt-6 space-y-5">
            {data.technologies.map((tech, index) => (
              <StatBar
                key={tech.name}
                label={tech.name}
                value={tech.value}
                color={tech.color}
                delay={0.1 + index * 0.1}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55 }}
          className="border-2 border-white/15 bg-card p-6 sm:p-8"
        >
          <h3 className="font-mono text-xs font-bold tracking-[0.25em] text-foreground uppercase">
            Developer style
          </h3>
          <div className="mt-6 space-y-5">
            {data.developerStyle.map((style, index) => (
              <StatBar
                key={style.name}
                label={style.name}
                value={style.value}
                color={index % 2 === 0 ? "var(--neo)" : "var(--neo-purple)"}
                delay={0.1 + index * 0.1}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-6 border-2 border-primary/50 bg-muted p-6 sm:p-8"
      >
        <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-primary uppercase">
          Generated assessment
        </p>
        <p className="mt-3 text-lg leading-8 text-foreground/95">
          {data.summary}
        </p>
      </motion.div>
    </section>
  );
}
