import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Leaf, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { UploadZone } from "@/components/UploadZone";

export function Landing({ onUpload }: { onUpload: (file: File, url: string) => void }) {
  return (
    <div className="min-h-screen gradient-hero">
      <header className="max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between">
        <BrandLogo />
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a className="hover:text-foreground">Features</a>
          <a className="hover:text-foreground">How it works</a>
          <a className="hover:text-foreground">About</a>
        </nav>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="chip"
          >
            <Sparkles className="h-3 w-3 text-primary" /> AI-powered plant care
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="mt-4 font-display text-5xl md:text-6xl font-semibold tracking-tight"
          >
            LeafDoc <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">AI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="mt-4 text-lg text-muted-foreground max-w-xl"
          >
            Snap a leaf. Get an instant, expert-grade diagnosis, early-risk forecast, and a personalized recovery plan — all in one place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="mt-8 flex gap-3 flex-wrap"
          >
            <Button
              onClick={() => document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" })}
              className="gradient-primary text-primary-foreground rounded-full px-6 h-12 shadow-lg shadow-primary/30 hover:opacity-95"
            >
              Upload Leaf <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <Button variant="outline" className="rounded-full h-12 px-6">
              See how it works
            </Button>
          </motion.div>

          <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
            {[
              { icon: Leaf, label: "20k+ leaves trained" },
              { icon: ShieldCheck, label: "92% accuracy" },
              { icon: Zap, label: "3s diagnosis" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-3 bg-card/70 backdrop-blur border border-border text-center">
                <s.icon className="h-4 w-4 text-primary mx-auto mb-1" />
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[3rem] gradient-primary opacity-20 blur-3xl" />
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 border border-primary/20 aspect-square bg-leaf-soft">
            <img
              src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80"
              alt="Healthy leaves"
              className="h-full w-full object-cover"
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute bottom-6 left-6 right-6 rounded-2xl bg-card/90 backdrop-blur p-4 border border-border shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center text-primary-foreground">
                  <Leaf className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Latest scan</div>
                  <div className="font-medium">Healthy · 96% confidence</div>
                </div>
                <span className="chip">Live</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section id="upload" className="max-w-2xl mx-auto px-6 pb-24">
        <UploadZone onFile={onUpload} />
      </section>
    </div>
  );
}

export function StageTransitions({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      {children}
    </AnimatePresence>
  );
}
