import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatBarProps {
  label: ReactNode;
  value: number;
  suffix?: string;
  color?: string;
  delay?: number;
  className?: string;
  trackClassName?: string;
}

export function StatBar({
  label,
  value,
  suffix = "",
  color = "var(--neo)",
  delay = 0,
  className,
  trackClassName,
}: StatBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="font-mono text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
          {label}
        </span>
        <span className="font-mono text-xs font-bold tabular-nums text-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <div
        className={cn(
          "h-3 w-full border-2 border-foreground/60 bg-muted",
          trackClassName,
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{
            duration: 1.1,
            delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
