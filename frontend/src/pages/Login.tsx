import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GithubLoginCard } from "@/components/GithubLoginModal";

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    const target =
      returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")
        ? returnTo
        : "/analyze";
    navigate(target, { replace: true });
  }, [isLoading, isAuthenticated, navigate, returnTo]);

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-grid absolute inset-0 opacity-50" />
          <div className="absolute top-1/4 left-1/2 h-[360px] w-[640px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Back to the landing
          </Link>

          <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/90 p-8 md:p-10 shadow-[0_0_50px_-12px_rgba(255,77,0,0.2)] hover:shadow-[0_0_60px_-6px_rgba(255,77,0,0.3)] hover:border-white/15 transition-all duration-500 backdrop-blur-md">
            <GithubLoginCard
              onSignedIn={() => {
                const target =
                  returnTo &&
                  returnTo.startsWith("/") &&
                  !returnTo.startsWith("//")
                    ? returnTo
                    : "/analyze";
                navigate(target, { replace: true });
              }}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
