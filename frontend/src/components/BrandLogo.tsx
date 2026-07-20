import { Leaf } from "lucide-react";
import { motion } from "framer-motion";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <motion.div
      layout
      className="flex items-center gap-2"
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
    >
      <motion.div
        layout
        className="grid place-items-center h-10 w-10 rounded-2xl gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
      >
        <Leaf className="h-5 w-5" />
      </motion.div>
      {!compact && (
        <motion.div layout className="leading-tight">
          <div className="font-display text-lg font-semibold">LeafDoc AI</div>
          <div className="text-xs text-muted-foreground -mt-0.5">AgriSense</div>
        </motion.div>
      )}
    </motion.div>
  );
}
