import { Leaf, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/60 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-display font-semibold">
            <Leaf className="h-4 w-4 text-primary" /> LeafDoc AI
          </div>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            AI-powered plant care that helps farmers and gardeners detect, prevent, and recover from disease.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-2">Platform</div>
          <ul className="space-y-1 text-muted-foreground">
            <li>Disease Detection</li>
            <li>AI Agronomist</li>
            <li>Risk Prediction</li>
            <li>Recovery Planner</li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-2">Connect</div>
          <div className="flex gap-3 text-muted-foreground">
            <Github className="h-4 w-4" />
            <Twitter className="h-4 w-4" />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">© {new Date().getFullYear()} AgriSense. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
