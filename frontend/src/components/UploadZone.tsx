import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onFile: (file: File, previewUrl: string) => void;
  compact?: boolean;
};

export function UploadZone({ onFile, compact }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = useCallback(
    (file?: File | null) => {
      if (!file) return;
      const url = URL.createObjectURL(file);
      onFile(file, url);
    },
    [onFile],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handle(e.dataTransfer.files?.[0]);
      }}
      className={`card-elevated relative overflow-hidden ${compact ? "p-6" : "p-10"} text-center`}
    >
      <div
        className={`rounded-xl border-2 border-dashed transition-colors ${
          dragOver ? "border-primary bg-leaf-soft/60" : "border-border"
        } ${compact ? "p-6" : "p-10"}`}
      >
        <div className="mx-auto h-14 w-14 rounded-2xl gradient-primary text-primary-foreground grid place-items-center shadow-lg shadow-primary/25">
          <UploadCloud className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold">
          Drop your leaf photo here
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          PNG or JPG · Clear, well-lit close-up works best
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Button
            onClick={() => inputRef.current?.click()}
            className="gradient-primary text-primary-foreground rounded-full px-6 shadow-md shadow-primary/25 hover:opacity-95"
          >
            <ImageIcon className="h-4 w-4 mr-2" /> Browse image
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handle(e.target.files?.[0])}
        />
      </div>
    </motion.div>
  );
}
