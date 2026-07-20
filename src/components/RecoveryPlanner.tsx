import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, CheckCircle2, Circle, ShieldAlert } from "lucide-react";
import type { mockRecovery } from "@/data/mockData";

type Recovery = typeof mockRecovery;

export function RecoveryPlanner({ data }: { data: Recovery }) {
  const [steps, setSteps] = useState(data.milestones);
  const done = steps.filter((s) => s.done).length;
  const progress = Math.round((done / steps.length) * 100);

  const toggle = (i: number) =>
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, done: !s.done } : s)));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-elevated p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center text-primary-foreground">
          <CalendarCheck className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-xl font-semibold">Smart Recovery Planner</h3>
          <p className="text-sm text-muted-foreground">Day-by-day treatment roadmap.</p>
        </div>
        <div className="text-right">
          <div className="font-display text-xl font-semibold">{progress}%</div>
          <div className="text-xs text-muted-foreground">Recovery</div>
        </div>
      </div>

      <div className="h-2 rounded-full bg-secondary overflow-hidden mb-6">
        <motion.div
          className="h-full gradient-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      <ol className="relative border-l-2 border-dashed border-primary/30 ml-4 space-y-4">
        {steps.map((s, i) => (
          <li key={s.day} className="pl-6 relative">
            <button
              onClick={() => toggle(i)}
              className={`absolute -left-[13px] top-1 h-6 w-6 rounded-full grid place-items-center transition-all ${
                s.done ? "gradient-primary text-primary-foreground shadow-md shadow-primary/30" : "bg-card border border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {s.done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
            </button>
            <div className={`rounded-xl p-3 border ${s.done ? "bg-leaf-soft/50 border-primary/20" : "bg-card border-border"}`}>
              <div className="flex justify-between items-center">
                <div className="font-medium">{s.title}</div>
                <span className="chip">Day {s.day}</span>
              </div>
              <p className={`text-sm mt-1 ${s.done ? "text-foreground/60 line-through" : "text-muted-foreground"}`}>{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-2xl p-4 bg-warn/10 border border-warn/30">
        <div className="flex items-center gap-2 font-medium text-sm mb-2 text-warn">
          <ShieldAlert className="h-4 w-4" /> Important Precautions
        </div>
        <ul className="grid md:grid-cols-3 gap-2 text-sm text-foreground/80">
          {data.precautions.map((p) => (
            <li key={p} className="rounded-xl p-2.5 bg-card border border-border">{p}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
