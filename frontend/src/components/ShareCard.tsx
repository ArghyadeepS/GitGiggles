import { motion } from "framer-motion";
import { Check, Copy, Flame, RefreshCw, Share2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { RoastData } from "@/lib/roast";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { Avatar } from "@/components/UserAvatar";

export function ShareCard({ data }: { data: RoastData }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.shareText);
      setCopied(true);
      toast.success("Roast copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy. The evidence resisted.");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Roast My GitHub — @${data.username}`,
      text: data.shareText,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User dismissed the share sheet — not an error.
      }
    } else {
      await handleCopy();
    }
  };

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.55 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="font-mono text-[11px] font-bold tracking-[0.25em] text-primary uppercase">
          Share the giggles
        </p>
        <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Good roasts deserve an audience.
        </h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          The best roasts are shared. The bravest developers share their own.
        </p>
      </motion.div>

      {/* Social card */}
      <motion.div
        initial={{ opacity: 0, y: 28, rotate: -1 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        whileHover={{ rotate: 0.6 }}
        className="mx-auto mt-12 max-w-md"
      >
        <div className="border-2 border-white/25 bg-[#0b0b0f] p-7 shadow-[10px_10px_0_0_rgba(255,77,0,0.35)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo className="size-8" />
              <span className="font-mono text-[11px] font-bold tracking-widest text-primary uppercase">
                GitGiggles
              </span>
            </div>
            <Avatar username={data.username} className="size-9" />
          </div>

          <p className="mt-7 font-mono text-xs text-muted-foreground">
            @<span className="text-foreground">{data.username}</span>
          </p>

          <p className="mt-5 font-mono text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase">
            Roast level
          </p>
          <p className="text-fire mt-1 text-6xl font-bold tabular-nums">
            {data.roastScore}
            <span className="ml-1 text-2xl text-muted-foreground">/100</span>
          </p>

          <p className="mt-5 text-2xl font-bold tracking-tight">
            {data.personality.title}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2 font-mono text-[10px]">
            {[
              { label: "abandoned", value: data.stats.abandoned },
              { label: "frameworks", value: 5 },
              { label: "README", value: `${data.stats.documentation}%` },
            ].map((stat) => (
              <div key={stat.label} className="border border-white/10 bg-muted p-2 text-center">
                <p className="text-sm font-bold text-foreground">{stat.value}</p>
                <p className="mt-0.5 tracking-widest text-muted-foreground uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <blockquote className="mt-5 border-l-4 border-primary pl-3 text-sm leading-6 text-foreground/90 italic">
            “{data.crimes[0]?.roast ?? "We have evidence."}”
          </blockquote>

          <p className="mt-6 flex items-center justify-center gap-1.5 border-t-2 border-white/10 pt-4 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            <Flame className="size-3.5 text-primary" /> gitgiggles.dev
          </p>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 border-2 border-foreground px-5 py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none neo-shadow-sm",
            copied ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground",
          )}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy Roast"}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-1 items-center justify-center gap-2 border-2 border-foreground bg-foreground px-5 py-3 font-mono text-xs font-bold tracking-widest text-background uppercase transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-white hover:shadow-none neo-shadow-sm"
        >
          <Share2 className="size-4" /> Share
        </button>
        <button
          type="button"
          onClick={() => navigate("/analyze")}
          className="flex flex-1 items-center justify-center gap-2 border-2 border-white/20 bg-transparent px-5 py-3 font-mono text-xs font-bold tracking-widest text-foreground uppercase transition-all hover:border-foreground hover:bg-card"
        >
          <RefreshCw className="size-4" /> Roast Again
        </button>
      </div>
    </section>
  );
}
