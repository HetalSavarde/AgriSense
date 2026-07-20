// Central config for API endpoints. Swap BASE_URL for your Flask backend later.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export const API_ENDPOINTS = {
  analyzeLeaf: `${API_BASE_URL}/predict`,
  chat: `${API_BASE_URL}/chat`,
  transcribe: `${API_BASE_URL}/transcribe`,
  speak: `${API_BASE_URL}/speak`,
  riskPrediction: `${API_BASE_URL}/risk`,
  recoveryPlan: `${API_BASE_URL}/recovery-plan`,
} as const;

export const APP_NAME = "LeafDoc AI";
export const APP_TAGLINE = "AI-powered plant disease detection & recovery";
