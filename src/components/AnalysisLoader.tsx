import { motion } from "framer-motion";
import { Sprout } from "lucide-react";

export function AnalysisLoader({ preview }: { preview: string }) {
  return (
    <div className="min-h-screen grid place-items-center gradient-hero px-6">
      <div className="max-w-md w-full text-center">
        <div className="relative mx-auto h-56 w-56">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-3 rounded-full border-2 border-dashed border-primary/50"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-6 rounded-full overflow-hidden shadow-xl shadow-primary/30 ring-4 ring-primary/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img src={preview} alt="analysis" className="h-full w-full object-cover" />
            <motion.div
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-glow to-transparent shadow-[0_0_20px_var(--primary-glow)]"
              initial={{ top: 0 }}
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
          <motion.div
            className="absolute -top-2 -right-2 h-10 w-10 rounded-full gradient-primary grid place-items-center text-primary-foreground shadow-lg"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sprout className="h-5 w-5" />
          </motion.div>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 font-display text-2xl font-semibold"
        >
          Analyzing your leaf…
        </motion.h2>
        <p className="mt-2 text-muted-foreground text-sm">
          Detecting patterns, colors, and micro-lesions with computer vision.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
