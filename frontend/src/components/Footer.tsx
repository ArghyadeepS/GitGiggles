import { Link } from "react-router";
import { Logo } from "@/components/Logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Roast Me", to: "/analyze" },
      { label: "The Roast Vault", to: "/catalog" },
      { label: "How It Works", to: "/#how-it-works" },
      { label: "What We Roast", to: "/#what-we-roast" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", to: "https://github.com", external: true },
      { label: "Compare Friends", to: "/#compare" },
      { label: "Examples", to: "/#examples" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/#privacy" },
      { label: "Evidence Policy", to: "/#privacy" },
      { label: "Terms of Roasting", to: "/#privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer id="privacy" className="relative border-t-2 border-white/10 bg-card">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo className="size-9" />
            <span className="text-base font-bold tracking-tight">
              GitGiggles
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
            Your GitHub. Your crimes. Our giggles. Evidence collected,
            verdicts delivered, feelings occasionally tickled.
          </p>
          <p className="mt-4 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            gitgiggles.dev
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="font-mono text-[11px] font-bold tracking-widest text-foreground uppercase">
              {column.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative border-t-2 border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 font-mono text-[11px] tracking-widest text-muted-foreground uppercase sm:flex-row">
          <span>© 2026 Roast My GitHub</span>
          <span className="text-center">
            No developers were permanently damaged.
          </span>
          <span>Built for the internet's most opinionated developers</span>
        </div>
      </div>
    </footer>
  );
}
