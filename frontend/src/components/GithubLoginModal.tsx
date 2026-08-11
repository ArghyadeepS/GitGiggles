import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { GithubIcon } from "@/components/GithubIcon";
import { Logo } from "@/components/Logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function GithubLoginCard({ onSignedIn }: { onSignedIn?: () => void }) {
  const { signIn, signOut, user, isMock, isLoading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await signIn();
      if (onSignedIn) {
        onSignedIn();
      } else {
        navigate("/analyze");
      }
    } catch (err) {
      console.error("GitHub sign-in failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while connecting to GitHub.",
      );
      setBusy(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid min-h-[320px] place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user && !busy) {
    return (
      <div className="flex flex-col items-center gap-5 py-4 text-center">
        <Logo className="size-12" />
        <div>
          <p className="text-2xl font-bold tracking-tight">
            You're already cooked.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as{" "}
            <span className="font-mono text-foreground">@{user.username}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (onSignedIn) {
              onSignedIn();
            } else {
              navigate("/analyze");
            }
          }}
          className="w-full border-2 border-foreground bg-primary px-4 py-3 font-mono text-xs font-bold tracking-widest text-primary-foreground uppercase transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none neo-shadow-sm"
        >
          Continue the roast →
        </button>
        <button
          type="button"
          onClick={async () => {
            await signOut();
          }}
          className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Sign out and switch accounts
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 py-2 text-center">
      <Logo className="size-12" />

      <DialogHeader className="gap-2">
        <DialogTitle className="text-2xl font-bold tracking-tight">
          Ready to get roasted?
        </DialogTitle>
        <DialogDescription className="text-sm leading-6 text-muted-foreground">
          Sign up or sign in with GitHub — we need your profile to collect the
          evidence. One click. No passwords.
        </DialogDescription>
      </DialogHeader>

      <button
        type="button"
        onClick={handleSignIn}
        disabled={busy}
        className={cn(
          "flex w-full items-center justify-center gap-2.5 border-2 border-foreground bg-foreground px-4 py-3.5 text-sm font-bold text-background transition-all",
          "hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-white hover:shadow-none",
          "disabled:pointer-events-none disabled:opacity-60",
          "neo-shadow-sm",
        )}
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <GithubIcon className="size-4" />
        )}
        {busy ? "Connecting to GitHub..." : "Continue with GitHub"}
      </button>

      {error && (
        <p className="w-full border-2 border-destructive/40 bg-destructive/10 px-3 py-2 text-left font-mono text-xs text-destructive">
          {error}
        </p>
      )}

      {isMock && (
        <p className="w-full border-2 border-white/10 bg-muted px-3 py-2.5 text-left text-xs leading-5 text-muted-foreground">
          <span className="font-mono font-bold tracking-widest text-accent uppercase">
            Demo mode
          </span>
          <br />
          Firebase isn't configured yet, so you'll be signed in with a sample
          GitHub profile. Add the{" "}
          <span className="font-mono text-foreground">VITE_FIREBASE_*</span>{" "}
          keys to enable real GitHub sign-in.
        </p>
      )}

      <div className="flex flex-col items-center gap-2 border-t-2 border-white/10 pt-4 text-muted-foreground">
        <p className="flex items-center gap-2 text-xs">
          <Lock className="size-3.5" />
          We only use your GitHub data to generate your roast.
        </p>
        <p className="flex items-center gap-1.5 text-[11px] font-mono tracking-widest uppercase">
          <ShieldCheck className="size-3" /> Privacy
        </p>
      </div>
    </div>
  );
}

export function GithubLoginModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-2 border-white/20 bg-[#0b0b0f] p-8 shadow-none neo-shadow-fire">
        <GithubLoginCard />
      </DialogContent>
    </Dialog>
  );
}

export { GithubLoginCard };
