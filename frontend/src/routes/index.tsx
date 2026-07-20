import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import { Landing } from "@/components/Landing";
import { AnalysisLoader } from "@/components/AnalysisLoader";
import { AnalysisCard } from "@/components/AnalysisCard";
import { ChatAssistant } from "@/components/ChatAssistant";
import { RiskPrediction } from "@/components/RiskPrediction";
import { RecoveryPlanner } from "@/components/RecoveryPlanner";
import { Footer } from "@/components/Footer";
import { analyzeLeaf, fetchRisk, fetchRecovery } from "@/lib/api";
import { mockAnalysis, mockRisk, mockRecovery } from "@/data/mockData";
import { UploadZone } from "@/components/UploadZone";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

type Stage = "landing" | "analyzing" | "results";

function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const [preview, setPreview] = useState<string>("");
  const [analysis, setAnalysis] = useState<typeof mockAnalysis | null>(null);
  const [risk, setRisk] = useState<typeof mockRisk | null>(null);
  const [recovery, setRecovery] = useState<typeof mockRecovery | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File, url: string) => {
    setPreview(url);
    setStage("analyzing");
    setError(null);
    try {
      const [a, r, rec] = await Promise.all([analyzeLeaf(file), fetchRisk(), fetchRecovery()]);
      setAnalysis(a);
      setRisk(r);
      setRecovery(rec);
      setStage("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      setStage("landing");
    }
  };

  const reset = () => {
    setStage("landing");
    setAnalysis(null);
    setPreview("");
  };

  useEffect(() => {
    if (stage === "results") window.scrollTo({ top: 0 });
  }, [stage]);

  return (
    <AnimatePresence mode="wait">
      {stage === "landing" && (
        <motion.div key="landing" exit={{ opacity: 0 }}>
          <Landing onUpload={handleUpload} />
          {error && <p className="text-center text-destructive pb-6">{error}</p>}
          <Footer />
        </motion.div>
      )}

      {stage === "analyzing" && (
        <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <AnalysisLoader preview={preview} />
        </motion.div>
      )}

      {stage === "results" && analysis && risk && recovery && (
        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ResultsLayout
            image={preview}
            analysis={analysis}
            risk={risk}
            recovery={recovery}
            onReset={reset}
            onNewUpload={handleUpload}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ResultsLayout({
  image, analysis, risk, recovery, onReset, onNewUpload,
}: {
  image: string;
  analysis: typeof mockAnalysis;
  risk: typeof mockRisk;
  recovery: typeof mockRecovery;
  onReset: () => void;
  onNewUpload: (f: File, url: string) => void;
}) {
  return (
    <div className="min-h-screen gradient-hero">
      <motion.header
        layout
        className="sticky top-0 z-30 backdrop-blur bg-background/70 border-b border-border/60"
      >
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <BrandLogo compact={false} />
          <div className="flex items-center gap-2">
            <span className="chip hidden md:inline-flex">Session · {analysis.diseaseName}</span>
            <Button onClick={onReset} variant="outline" className="rounded-full h-9">
              <RefreshCw className="h-4 w-4 mr-1" /> New scan
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left: Chat Assistant */}
        <aside className="lg:sticky lg:top-[74px] lg:self-start">
          <ChatAssistant disease={analysis.diseaseName} />
        </aside>

        {/* Right: Analysis + Risk + Recovery */}
        <section className="space-y-6 min-w-0">
          <AnalysisCard data={analysis} image={image} />
          <RiskPrediction data={risk} />
          <RecoveryPlanner data={recovery} />

          <div className="card-elevated p-6">
            <h4 className="font-display text-lg font-semibold mb-3">Scan another leaf</h4>
            <UploadZone compact onFile={onNewUpload} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
