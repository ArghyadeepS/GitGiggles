import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-background text-foreground"
    >
      <Navbar />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-grid absolute inset-0 opacity-50" />
          <div className="absolute top-1/3 left-1/2 h-[300px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />
        </div>
        <div className="text-center">
          <p className="font-mono text-[11px] font-bold tracking-[0.3em] text-primary uppercase">
            error 404
          </p>
          <h1 className="mt-3 text-6xl font-bold tracking-tight">Not found.</h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted-foreground">
            This page has been abandoned — like 81% of your repositories. Unlike
            them, we'll actually tell you where it went.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 border-2 border-foreground bg-primary px-6 py-3 font-mono text-xs font-bold tracking-widest text-primary-foreground uppercase transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none neo-shadow-sm"
          >
            <ArrowLeft className="size-4" /> Back to safety
          </Link>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}
