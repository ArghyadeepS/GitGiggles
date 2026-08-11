import { motion } from "framer-motion";
import type { GitHubStats as GitHubStatsData } from "@/lib/roast";
import { AnimatedNumber } from "@/components/AnimatedNumber";

const LABELS: { key: keyof GitHubStatsData; label: string }[] = [
  { key: "repos", label: "Repositories" },
  { key: "stars", label: "Stars" },
  { key: "commits", label: "Commits" },
  { key: "followers", label: "Followers" },
  { key: "following", label: "Following" },
  { key: "contributions", label: "Contributions" },
];

export function GitHubStats({ stats }: { stats: GitHubStatsData }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {LABELS.map(({ key, label }, index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="border-2 border-white/12 bg-card p-4 text-center transition-colors duration-300 hover:border-foreground"
        >
          <AnimatedNumber
            value={stats[key]}
            className="text-2xl font-bold tabular-nums"
          />
          <p className="mt-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            {label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
