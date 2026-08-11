import { Code2, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-grid size-9 shrink-0 place-items-center border-2 border-foreground bg-primary text-primary-foreground",
        className,
      )}
      aria-hidden="true"
    >
      <Code2 className={cn("size-5", iconClassName)} strokeWidth={2.75} />
      <Flame className="absolute -top-2 -right-2 size-4 fill-accent text-accent" strokeWidth={2.5} />
    </span>
  );
}
