import { motion } from "framer-motion";
import { Activity, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
type Risk = {
  healthScore: number;
  riskPercent: number;
  riskLevel: string;
  actions: string[];
  explanation: string;
};

function Ring({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} strokeWidth="10" className="stroke-secondary" fill="none" />
        <motion.circle
          cx="50" cy="50" r={r} strokeWidth="10" fill="none"
          strokeLinecap="round" stroke={color}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (value / 100) * c }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-2xl font-semibold">{value}%</div>
          <div className="text-[10px] uppercase text-muted-foreground tracking-wider">{label}</div>
        </div>
      </div>
    </div>
  );
}

export function RiskPrediction({ data }: { data: Risk }) {
  const riskColor =
    data.riskLevel === "High" ? "oklch(0.6 0.22 27)" :
    data.riskLevel === "Moderate" ? "oklch(0.72 0.17 70)" :
    "oklch(0.6 0.16 148)";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-elevated p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center text-primary-foreground">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">Early Risk Prediction</h3>
          <p className="text-sm text-muted-foreground">Predictive health report — before symptoms escalate.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[auto_1fr] gap-6 items-center">
        <div className="flex gap-4 justify-center">
          <Ring value={data.healthScore} label="Health" color="oklch(0.6 0.16 148)" />
          <Ring value={data.riskPercent} label="Risk" color={riskColor} />
        </div>
        <div>
          <span className="chip mb-3"><ShieldAlert className="h-3 w-3" /> Risk level: {data.riskLevel}</span>
          <div className="rounded-2xl bg-secondary/50 p-4 border border-border">
            <div className="flex items-center gap-2 font-medium text-sm mb-2">
              <Sparkles className="h-4 w-4 text-primary" /> Why this prediction?
            </div>
            <p className="text-sm text-foreground/80">{data.explanation}</p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-2 font-medium text-sm mb-2">
          <Activity className="h-4 w-4 text-primary" /> Preventive Actions
        </div>
        <ul className="grid md:grid-cols-3 gap-2">
          {data.actions.map((a) => (
            <li key={a} className="text-sm rounded-xl p-3 bg-leaf-soft/60 border border-primary/15">
              {a}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
