import { motion } from "framer-motion";
import {
  Archive,
  ArrowRight,
  FileWarning,
  Flame,
  Layers,
  Moon,
  ScanLine,
  Shuffle,
  Swords,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { generateRoast } from "@/lib/roast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { GithubLoginModal } from "@/components/GithubLoginModal";
import { GithubIcon } from "@/components/GithubIcon";
import { CrimeCard } from "@/components/CrimeCard";

/* ── What We Roast ─────────────────────────────────────────── */

interface RoastTarget {
  icon: LucideIcon;
  title: string;
  description: string;
  example: string;
  roast: string;
}

const ROAST_TARGETS: RoastTarget[] = [
  {
    icon: Archive,
    title: "Project Graveyard",
    description:
      "Find abandoned repositories and unfinished projects, lovingly preserved in your profile.",
    example: "34 abandoned repos",
    roast: "You don't have unfinished projects. You have a museum.",
  },
  {
    icon: Shuffle,
    title: "Framework Commitment Issues",
    description:
      "Analyze how many frameworks and technologies you've jumped between.",
    example: "5 frontend frameworks",
    roast: "You've used 5 frontend frameworks and still haven't chosen a personality.",
  },
  {
    icon: FileWarning,
    title: "Documentation Crimes",
    description: "Analyze README coverage and documentation quality.",
    example: "23% README coverage",
    roast: "Your code knows what it does. Nobody else does.",
  },
  {
    icon: Tag,
    title: "Project Naming Crimes",
    description:
      "Detect names like 'final', 'final2', 'new', 'test' and 'project-final-final'.",
    example: "9 'final' repos",
    roast: "Your version control strategy is apparently adding 'final' to filenames.",
  },
  {
    icon: Layers,
    title: "Tech Stack Chaos",
    description:
      "Measure how many languages and stacks your repositories speak at once.",
    example: "11 languages",
    roast: "You don't have a tech stack. You have commitment issues.",
  },
  {
    icon: Moon,
    title: "Night Owl Activity",
    description: "Analyze commit timestamps for hours that concern a professional.",
    example: "73 late-night commits",
    roast: "Your most productive coworker appears to be insomnia.",
  },
];

/* ── How It Works ──────────────────────────────────────────── */

const STEPS = [
  {
    number: "01",
    title: "Connect",
    copy: "Sign in with GitHub. Read-only access. We don't clone your repos — we judge them from afar.",
    icon: (props: { className?: string }) => <GithubIcon {...props} />,
  },
  {
    number: "02",
    title: "Analyze",
    copy: "We inspect your developer habits, projects, technologies and questionable decisions.",
    icon: (props: { className?: string }) => <ScanLine {...props} />,
  },
  {
    number: "03",
    title: "Get Roasted",
    copy: "Our AI turns the evidence into a personalized roast. Verdict delivered. Feelings optional.",
    icon: (props: { className?: string }) => <Flame {...props} />,
  },
];

function SectionHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className="mx-auto max-w-2xl text-center"
    >
      <p className="font-mono text-[11px] font-bold tracking-[0.25em] text-primary uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h2>
      {sub && (
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {sub}
        </p>
      )}
    </motion.div>
  );
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const openModal = () => setModalOpen(true);

  const handlePrimary = () => {
    if (isAuthenticated) {
      navigate("/analyze");
    } else {
      openModal();
    }
  };

  const demo = generateRoast("octocat", "brutal");
  const compareRows = [
    { label: "Abandoned projects", you: 34, friend: 12 },
    { label: "Frameworks tried", you: 5, friend: 2 },
    { label: "README coverage", you: "23%", friend: "91%" },
    { label: "Late-night commits", you: 73, friend: 9 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onRoast={openModal} />

      <main>
        <Hero onRoast={openModal} />

        {/* ── What We Roast ── */}
        <section
          id="what-we-roast"
          className="relative scroll-mt-28 py-24 sm:py-28"
        >
          <div className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading
              eyebrow="What we roast"
              title="We collect the evidence."
              sub="Your GitHub has secrets. We find them."
            />

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ROAST_TARGETS.map((target, index) => {
                const Icon = target.icon;
                return (
                  <motion.article
                    key={target.title}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="flex flex-col border-2 border-white/15 bg-card p-6 transition-colors duration-300 hover:border-foreground"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid size-11 place-items-center border-2 border-foreground bg-primary text-primary-foreground">
                        <Icon className="size-5" />
                      </span>
                      <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                        {String(index + 1).padStart(2, "0")} / 06
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg leading-snug font-bold tracking-tight">
                      {target.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {target.description}
                    </p>
                    <p className="mt-4 inline-flex w-fit border border-white/15 bg-muted px-2 py-1 font-mono text-[11px] text-foreground">
                      {target.example}
                    </p>
                    <blockquote className="mt-4 border-l-4 border-primary pl-3 text-sm leading-6 text-foreground/85 italic">
                      “{target.roast}”
                    </blockquote>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="scroll-mt-28 py-24 sm:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading
              eyebrow="How it works"
              title="Three steps to a roast."
              sub="A professional pipeline for a personal problem. This is it."
            />

            <div className="relative mt-16">
              {/* Progress line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-8 right-[16%] left-[16%] hidden h-1 origin-left border border-white/10 bg-muted lg:block"
              >
                <div className="h-full w-full origin-left bg-gradient-to-r from-[#e63946] via-primary to-accent" />
              </motion.div>

              <div className="grid gap-10 lg:grid-cols-3 lg:gap-6">
                {STEPS.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, delay: index * 0.15 }}
                      className="relative"
                    >
                      <div className="flex items-center justify-center lg:block">
                        <span className="relative z-10 grid size-16 place-items-center border-2 border-foreground bg-card">
                          <StepIcon className="size-6 text-primary" />
                          <span className="absolute -top-2 -left-2 border-2 border-foreground bg-accent px-1.5 font-mono text-[10px] font-bold text-accent-foreground">
                            {step.number}
                          </span>
                        </span>
                      </div>
                      <div className="mt-6 border-2 border-white/15 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground hover:shadow-none neo-shadow-sm">
                        <h3 className="text-xl font-bold tracking-tight">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {step.copy}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Examples ── */}
        <section id="examples" className="relative scroll-mt-28 py-24 sm:py-28">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgb(255_77_0/0.07),transparent_55%)]" />
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading
              eyebrow="Examples"
              title="Exhibit A, B and C."
              sub="Real evidence. Real verdicts. No real developers were harmed in this demonstration."
            />

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {demo.crimes.slice(0, 3).map((crime, index) => (
                <CrimeCard key={crime.id} crime={crime} index={index} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="mt-10 flex flex-col items-center gap-5 border-2 border-white/15 bg-[#0b0b0f] p-8 text-center"
            >
              <p className="max-w-xl text-lg leading-8 text-foreground/90 italic">
                “{demo.finalRoast}”
              </p>
              <button
                type="button"
                onClick={() => navigate("/roast", { state: { demo: true } })}
                className="flex items-center gap-2 border-2 border-foreground bg-primary px-5 py-3 font-mono text-xs font-bold tracking-widest text-primary-foreground uppercase transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none neo-shadow-sm"
              >
                See the full demo roast <ArrowRight className="size-4" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* ── Compare (future feature) ── */}
        <section id="compare" className="scroll-mt-28 py-24 sm:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading
              eyebrow="Coming soon"
              title={
                <>
                  Roast My Friend <span className="text-fire">→</span>
                </>
              }
              sub="Two GitHub profiles. One arena. Someone walks out less cooked."
            />

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55 }}
              className="mx-auto mt-12 max-w-3xl overflow-hidden border-2 border-white/20 bg-[#0b0b0f]"
            >
              <div className="grid grid-cols-[1fr_auto_1fr] border-b-2 border-white/10 font-mono text-xs font-bold tracking-widest uppercase">
                <p className="px-5 py-4 text-center text-primary">You</p>
                <p className="grid place-items-center border-x-2 border-white/10 px-4 text-muted-foreground">
                  <Swords className="size-4" />
                </p>
                <p className="px-5 py-4 text-center text-muted-foreground">
                  Friend
                </p>
              </div>
              {compareRows.map((row, index) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[1fr_auto_1fr] border-b-2 border-white/5 text-sm last:border-b-0"
                >
                  <p className="px-5 py-3.5 text-center font-mono font-bold text-foreground">
                    {row.you}
                  </p>
                  <p className="border-x-2 border-white/5 px-4 py-3.5 text-center text-[11px] tracking-widest text-muted-foreground uppercase">
                    {row.label}
                  </p>
                  <p className="px-5 py-3.5 text-center font-mono text-foreground">
                    {row.friend}
                  </p>
                </div>
              ))}
              <div className="flex flex-col items-center gap-3 border-t-2 border-white/10 bg-muted px-5 py-6 text-center">
                <p className="text-2xl font-bold tracking-tight">
                  Who's laughing last?
                </p>
                <button
                  type="button"
                  disabled
                  className="flex cursor-not-allowed items-center gap-2 border-2 border-white/20 px-4 py-2.5 font-mono text-[11px] font-bold tracking-widest text-muted-foreground uppercase"
                >
                  Declare a winner <span className="text-accent">· soon</span>
                </button>
                <p className="text-xs text-muted-foreground">
                  Connect a second GitHub profile when we ship the arena.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA band ── */}
        <section className="relative overflow-hidden py-28">
          <div className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-60" />
          <div className="glow-fire pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[100px]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl px-6 text-center"
          >
            <h2 className="text-5xl font-bold tracking-tight sm:text-6xl">
              We have <span className="text-fire">evidence.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Your README has entered witness protection. Your abandoned repos
              want a word. Your commit history is a confession.
            </p>
            <button
              type="button"
              onClick={handlePrimary}
              className="group mt-8 inline-flex items-center gap-2 border-2 border-foreground bg-primary px-7 py-4 text-base font-bold text-primary-foreground transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none neo-shadow"
            >
              <Flame className="size-5 fill-primary-foreground transition-transform group-hover:scale-125" />
              Get Roasted
            </button>
            <Link
              to="/catalog"
              className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
            >
              or browse the vault <ArrowRight className="size-3.5" />
            </Link>
            <p className="mt-5 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
              It's free. It's personal. It's probably warranted.
            </p>
          </motion.div>
        </section>
      </main>

      <Footer />

      <GithubLoginModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
