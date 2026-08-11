import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/AnimatedNumber";

type Step =
  | { type: "cmd"; text: string }
  | { type: "ok"; text: string }
  | { type: "bar"; label: string; value: number }
  | { type: "blank" };

interface RoastLoadingProps {
  username: string;
  mode: string;
  onComplete: () => void;
}

function buildSteps(username: string): Step[] {
  return [
    { type: "cmd", text: "> Connecting to GitHub..." },
    { type: "ok", text: `✓ Identity found: @${username}` },
    { type: "cmd", text: "> Scanning repositories..." },
    { type: "ok", text: "✓ 42 repositories discovered" },
    { type: "cmd", text: "> Looking for abandoned projects..." },
    { type: "ok", text: "✓ 34 suspects identified" },
    { type: "cmd", text: "> Analyzing technology choices..." },
    { type: "ok", text: "✓ 11 languages detected" },
    { type: "cmd", text: "> Checking README files..." },
    { type: "ok", text: "✓ Documentation crimes detected" },
    { type: "cmd", text: "> Inspecting commit patterns..." },
    { type: "ok", text: "✓ 73 suspicious late-night commits" },
    { type: "cmd", text: "> Finding evidence..." },
    { type: "bar", label: "Finding evidence", value: 82 },
    { type: "cmd", text: "> Preparing your sentence..." },
    { type: "blank" },
  ];
}

export function RoastLoading({ username, mode, onComplete }: RoastLoadingProps) {
  const steps = useMemo(() => buildSteps(username), [username]);
  const [stepIndex, setStepIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [barValue, setBarValue] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (stepIndex >= steps.length) {
      const timer = setTimeout(() => onCompleteRef.current(), 400);
      return () => clearTimeout(timer);
    }
    const step = steps[stepIndex];

    if (step.type === "cmd") {
      if (charCount < step.text.length) {
        const timer = setTimeout(() => setCharCount((c) => c + 1), 26);
        return () => clearTimeout(timer);
      }
      const timer = setTimeout(() => {
        setStepIndex((i) => i + 1);
        setCharCount(0);
      }, 320);
      return () => clearTimeout(timer);
    }

    if (step.type === "ok") {
      const timer = setTimeout(() => {
        setStepIndex((i) => i + 1);
        setCharCount(0);
      }, 420);
      return () => clearTimeout(timer);
    }

    if (step.type === "bar") {
      if (barValue < step.value) {
        const timer = setTimeout(
          () => setBarValue((v) => Math.min(step.value, v + Math.max(1, Math.ceil((step.value - v) / 10)))),
          90,
        );
        return () => clearTimeout(timer);
      }
      const timer = setTimeout(() => {
        setStepIndex((i) => i + 1);
        setCharCount(0);
      }, 550);
      return () => clearTimeout(timer);
    }

    if (step.type === "blank") {
      const timer = setTimeout(() => {
        setStepIndex((i) => i + 1);
        setCharCount(0);
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, charCount, barValue, steps]);

  return (
    <div className="relative overflow-hidden border-2 border-white/20 bg-[#050505] shadow-[10px_10px_0_0_rgba(255,77,0,0.3)]">
      {/* Terminal chrome */}
      <div className="flex items-center justify-between border-b-2 border-white/10 bg-[#0b0b0f] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 border border-white/40 bg-muted" />
          <span className="size-2.5 border border-white/40 bg-muted" />
          <span className="size-2.5 border border-white/40 bg-destructive" />
        </div>
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          rmg --investigate @{username} --mode {mode}
        </span>
      </div>

      {/* Scanning line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px z-10"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,77,0,0.9), transparent)",
          animation: "rmg-scan 2.6s linear infinite",
        }}
      />

      <div className="min-h-[340px] p-5 font-mono text-[13px] leading-6 sm:p-6">
        {steps.slice(0, stepIndex).map((step, index) => {
          if (step.type === "blank") return <br key={index} />;
          if (step.type === "bar") {
            return (
              <div key={index} className="py-1">
                <span className="text-muted-foreground">
                  {step.label}...
                </span>
                <div className="mt-1.5 flex items-center gap-3">
                  <div className="h-3.5 w-full max-w-[260px] border border-foreground/50 bg-muted">
                    <div
                      className="h-full bg-gradient-to-r from-[#e63946] via-primary to-accent"
                      style={{ width: `${barValue}%` }}
                    />
                  </div>
                  <span className="font-bold tabular-nums text-accent">
                    {barValue}%
                  </span>
                </div>
              </div>
            );
          }
          return (
            <p
              key={index}
              className={cn(
                "whitespace-pre-wrap",
                step.type === "ok"
                  ? "text-[#6ee7a0]"
                  : "text-muted-foreground",
              )}
            >
              {step.text}
            </p>
          );
        })}

        {stepIndex < steps.length && (
          <p className="whitespace-pre-wrap text-muted-foreground">
            {steps[stepIndex].type === "cmd"
              ? steps[stepIndex].text.slice(0, charCount)
              : steps[stepIndex].type === "ok"
                ? steps[stepIndex].text
                : steps[stepIndex].type === "bar"
                  ? `${steps[stepIndex].label}...`
                  : ""}
            <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-primary" />
          </p>
        )}

        {stepIndex >= steps.length && (
          <p className="text-muted-foreground">
            <span className="text-[#6ee7a0]">✓</span> Sentence prepared.
            <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-primary" />
          </p>
        )}

        <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-3 text-[10px] tracking-widest text-muted-foreground uppercase">
          <AnimatedNumber value={82} className="text-accent" />
          <span>evidence collected</span>
        </div>
      </div>

      <style>{`@keyframes rmg-scan { 0% { top: 0; opacity: 0; } 8% { opacity: 1; } 92% { opacity: 1; } 100% { top: 100%; opacity: 0; } }`}</style>
    </div>
  );
}
