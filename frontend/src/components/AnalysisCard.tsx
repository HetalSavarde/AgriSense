import { motion } from "framer-motion";
import { AlertTriangle, Activity, Shield, Clock, Sparkles, Stethoscope, Bug, Pill } from "lucide-react";
import type { mockAnalysis } from "@/data/mockData";

type Analysis = typeof mockAnalysis;

function Section({
  icon: Icon,
  title,
  items,
  tone = "leaf",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
  tone?: "leaf" | "warn";
}) {
  return (
    <div className="rounded-2xl p-4 bg-secondary/50 border border-border">
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`h-8 w-8 rounded-xl grid place-items-center ${
            tone === "warn" ? "bg-warn/20 text-warn" : "bg-primary/15 text-primary"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="font-medium">{title}</div>
      </div>
      <ul className="space-y-1.5 text-sm text-foreground/80">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AnalysisCard({ data, image }: { data: Analysis; image: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="relative shrink-0">
          <img src={image} className="h-40 w-40 object-cover rounded-2xl ring-4 ring-primary/15" alt="leaf" />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 chip">
            <Sparkles className="h-3 w-3 text-primary" /> AI-verified
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Diagnosis</div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mt-1">{data.diseaseName}</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="chip"><Activity className="h-3 w-3" /> {data.confidence.toFixed(1)}% confidence</span>
              <span className="chip"><AlertTriangle className="h-3 w-3 text-warn" /> Severity: {data.severity}</span>
              <span className="chip"><Clock className="h-3 w-3" /> {data.recoveryTime}</span>
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${data.confidence}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3 mt-6">
        <Section icon={Bug} title="Causes" items={data.causes} tone="warn" />
        <Section icon={Stethoscope} title="Symptoms" items={data.symptoms} />
        <Section icon={Pill} title="Recommended Treatment" items={data.treatment} />
        <Section icon={Shield} title="Prevention Tips" items={data.prevention} />
      </div>
    </motion.div>
  );
}
