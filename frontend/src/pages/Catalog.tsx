import { motion } from "framer-motion";
import { ArrowRight, Flame, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { getCatalog, scoreColor, type CatalogEntry } from "@/lib/catalog";
import { ROAST_MODES, saveRoast } from "@/lib/roast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HalftoneTrail } from "@/components/ui/halftone-trail";

type SortKey = "score-desc" | "score-asc" | "name";

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "score-desc", label: "Most roasted" },
  { id: "score-asc", label: "Least roasted" },
  { id: "name", label: "A to Z" },
];

export default function Catalog() {
  const catalog = useMemo(getCatalog, []);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("score-desc");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = catalog.filter((entry) => {
      if (!q) return true;

      const { data } = entry;

      const haystack = [
        entry.username,
        data.personality.title,
        data.verdict.developerClass,
        ...data.crimes.map(
          (crime) => `${crime.category} ${crime.evidence} ${crime.roast}`,
        ),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });

    list.sort((a, b) => {
      if (sort === "name") {
        return a.username.localeCompare(b.username);
      }

      if (sort === "score-asc") {
        return a.data.roastScore - b.data.roastScore;
      }

      return b.data.roastScore - a.data.roastScore;
    });

    return list;
  }, [catalog, query, sort]);

  const openRoast = (entry: CatalogEntry) => {
    saveRoast({ data: entry.data, demo: false });
    navigate("/roast", { state: { data: entry.data } });
  };

  return (
    <div className="relative min-h-screen text-foreground">
      {/* Catalog halftone background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <HalftoneTrail
          cellSize={11}
          decay={0.968}
          brushSize={0.043}
          hoverBrushSize={0.012}
          opacity={0.9}
          hoverOpacity={0.22}
          speedScale={37}
          color="var(--foreground)"
        />
      </div>

      <Navbar />

      <main className="relative z-10 overflow-hidden pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-grid absolute inset-0 opacity-40" />

          <div className="absolute -top-28 left-1/2 h-[420px] w-[780px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        </div>

        <div className="mx-auto max-w-6xl px-6">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="inline-flex items-center gap-2 border-2 border-white/15 bg-card px-3 py-1.5 font-mono text-[11px] font-bold tracking-widest text-primary uppercase">
              <Flame className="size-3.5 fill-primary" />
              For the curious
            </p>

            <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
              The Roast <span className="text-fire">Vault.</span>
            </h1>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Every profile in the vault has been roasted, ranked and filed.
              Search the evidence, find a friend, and see who's built the more
              interesting museum.
            </p>
          </motion.header>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-12 flex max-w-3xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the vault — a username, a personality, a crime..."
                className="w-full border-2 border-white/15 bg-card py-3 pr-10 pl-10 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as SortKey)
              }
              aria-label="Sort the vault"
              className="cursor-pointer border-2 border-white/15 bg-card px-3 py-3 font-mono text-xs font-bold tracking-widest text-foreground uppercase outline-none focus:border-foreground"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </motion.div>

          <p className="mt-4 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            {filtered.length} of {catalog.length} profiles filed
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((entry, index) => {
                const { data } = entry;

                const modeInfo =
                  ROAST_MODES.find((m) => m.id === data.mode) ??
                  ROAST_MODES[0];

                return (
                  <motion.button
                    key={entry.username}
                    type="button"
                    onClick={() => openRoast(entry)}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(index * 0.05, 0.4),
                    }}
                    whileHover={{
                      y: -5,
                      rotate: index % 2 === 0 ? -0.5 : 0.5,
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex flex-col border-2 border-white/15 bg-card p-5 text-left transition-colors duration-300 hover:border-foreground"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                        #{String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="font-mono text-3xl leading-none font-bold tabular-nums">
                        <span style={{ color: scoreColor(data.roastScore) }}>
                          {data.roastScore}
                        </span>

                        <span className="text-sm text-muted-foreground">
                          /100
                        </span>
                      </span>
                    </div>

                    <p className="mt-4 font-mono text-xs text-muted-foreground">
                      @<span className="text-foreground">{entry.username}</span>
                    </p>

                    <h2 className="mt-1 text-xl leading-tight font-bold tracking-tight">
                      {data.personality.title}
                    </h2>

                    <div className="mt-4 flex-1 space-y-2">
                      {data.crimes.slice(0, 2).map((crime) => (
                        <p
                          key={crime.id}
                          className="flex flex-wrap items-baseline gap-x-2 border border-white/10 bg-muted px-2.5 py-1.5 font-mono text-[11px]"
                        >
                          <span className="text-foreground">
                            {crime.category}
                          </span>

                          <span className="text-muted-foreground">
                            {crime.evidence}
                          </span>
                        </p>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t-2 border-white/10 pt-3.5">
                      <span className="border border-white/15 bg-muted px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest text-accent uppercase">
                        {modeInfo.label}
                      </span>

                      <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors group-hover:text-primary">
                        View roast
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-10 max-w-xl border-2 border-white/15 bg-card p-10 text-center"
            >
              <p className="text-xl font-bold tracking-tight">
                Nothing in the vault matches that.
              </p>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Try another alias or a different crime — or better, add your
                own evidence to the collection.
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="border-2 border-white/20 bg-transparent px-4 py-2.5 font-mono text-[11px] font-bold tracking-widest text-foreground uppercase transition-all hover:border-foreground hover:bg-card"
                >
                  Clear search
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/analyze")}
                  className="flex items-center gap-2 border-2 border-foreground bg-primary px-4 py-2.5 font-mono text-[11px] font-bold tracking-widest text-primary-foreground uppercase transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none neo-shadow-sm"
                >
                  <Flame className="size-3.5" />
                  Roast yourself
                </button>
              </div>
            </motion.div>
          )}

          {/* Add yours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-16 flex max-w-2xl flex-col items-center gap-5 border-2 border-white/15 bg-card p-8 text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Think you can beat the leaderboard?
            </h2>

            <p className="max-w-lg text-sm leading-6 text-muted-foreground">
              The vault is only as interesting as the evidence it holds. Add
              your profile and find out exactly where you belong.
            </p>

            <button
              type="button"
              onClick={() => navigate("/analyze")}
              className="group flex items-center gap-2 border-2 border-foreground bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none neo-shadow"
            >
              <Flame className="size-4 fill-primary-foreground transition-transform group-hover:scale-125" />
              Get Roasted
            </button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}