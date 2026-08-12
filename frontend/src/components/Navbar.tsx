import { ArrowRight, Github } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";

interface NavbarProps {
  /** Opens the auth modal instead of navigating (used on the landing page). */
  onRoast?: () => void;
}

const NAV_LINKS = [
  { label: "How It Works", hash: "#how-it-works" },
  { label: "What We Roast", hash: "#what-we-roast" },
  { label: "Examples", hash: "#examples" },
  { label: "Catalog", to: "/catalog" },
];

export function Navbar({ onRoast }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleRoast = () => {
    console.log("[Navbar] 'Roast My GitHub' clicked. isAuthenticated:", isAuthenticated, "onRoast prop present:", Boolean(onRoast));
    if (isAuthenticated) {
      console.log("[Navbar] User authenticated -> Navigating to /analyze");
      navigate("/analyze");
    } else if (onRoast) {
      console.log("[Navbar] User not authenticated -> Calling onRoast()");
      onRoast();
    } else {
      console.log("[Navbar] User not authenticated & no onRoast -> Navigating to /login");
      navigate("/login");
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4">
      <nav
        className={cn(
          "mx-auto mt-3 flex max-w-6xl items-center justify-between gap-3 border-2 px-3 py-2.5 transition-all duration-300 sm:px-4",
          scrolled
            ? "border-white/15 bg-[#0b0b0f]/95 shadow-[0_8px_30px_rgb(0_0_0/0.45)] backdrop-blur-xl"
            : "border-white/10 bg-[#0b0b0f]/60 backdrop-blur-md",
        )}
      >
        <Link
          to="/"
          className="group flex items-center gap-2.5"
          aria-label="Roast My GitHub — home"
        >
          <Logo className="size-8 transition-transform duration-300 group-hover:-rotate-6" />
          <span className="hidden text-sm font-bold tracking-tight sm:block">
            GitGiggles
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => {
            if (link.to) {
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className="font-mono text-[11px] font-medium tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              );
            }
            const href = pathname === "/" ? link.hash : `/${link.hash}`;
            return (
              <a
                key={link.label}
                href={href}
                className="font-mono text-[11px] font-medium tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="grid size-9 place-items-center border-2 border-transparent text-muted-foreground transition-all hover:border-white/15 hover:text-foreground"
          >
            <Github className="size-4" />
          </a>
          <button
            type="button"
            onClick={handleRoast}
            className="flex items-center gap-1.5 border-2 border-foreground bg-primary px-3 py-2 font-mono text-[11px] font-bold tracking-widest text-primary-foreground uppercase transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none neo-shadow-sm sm:px-4"
          >
            Roast My GitHub
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </nav>
    </header>
  );
}
