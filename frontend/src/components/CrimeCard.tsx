import { motion } from "framer-motion";
import {
  Archive,
  Boxes,
  FileText,
  FileWarning,
  GitCommitHorizontal,
  GraduationCap,
  Layers,
  Moon,
  Shuffle,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Crime } from "@/lib/roast";
import { StatBar } from "@/components/StatBar";

const CRIME_ICONS: Record<string, LucideIcon> = {
  "Project Graveyard": Archive,
  "Documentation Crimes": FileWarning,
  "Framework Commitment Issues": Shuffle,
  "Tech Stack Chaos": Layers,
  "Commit Crimes": GitCommitHorizontal,
  "Naming Crimes": Tag,
  "Night Owl Behavior": Moon,
  "Tutorial Addiction": GraduationCap,
  "README Delusion": FileText,
  Overengineering: Boxes,
};

interface CrimeCardProps {
  crime: Crime;
  index?: number;
  className?: string;
}

export function CrimeCard({ crime, index = 0, className }: CrimeCardProps) {
  const Icon = CRIME_ICONS[crime.category] ?? FileWarning;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, rotate: index % 2 === 0 ? -0.6 : 0.6 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.08, 0.4), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, rotate: index % 2 === 0 ? -0.4 : 0.4 }}
      className={cn(
        "group flex flex-col border-2 border-white/15 bg-card transition-shadow duration-300 hover:border-foreground hover:shadow-none neo-shadow-sm",
        className,
      )}
    >
      <header className="flex items-center justify-between border-b-2 border-white/10 px-5 py-3">
        <span className="font-mono text-[11px] font-bold tracking-widest text-destructive uppercase">
          🚨 Crime #{String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          evidence log
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center border-2 border-foreground bg-primary text-primary-foreground">
            <Icon className="size-5" />
          </span>
          <h3 className="text-lg leading-tight font-bold tracking-tight">
            {crime.category}
          </h3>
        </div>

        <div>
          <p className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            Evidence
          </p>
          <p className="mt-1 font-mono text-sm text-foreground">
            {crime.evidence}
          </p>
        </div>

        <blockquote className="border-l-4 border-primary bg-muted px-4 py-3 text-sm leading-6 italic text-foreground/90">
          “{crime.roast}”
        </blockquote>

        <div className="mt-auto">
          <StatBar
            label="Severity"
            value={crime.severity}
            color="var(--destructive)"
            delay={0.2}
          />
        </div>
      </div>
    </motion.article>
  );
}
