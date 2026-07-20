// Central config for API endpoints. Swap BASE_URL for your Flask backend later.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export const API_ENDPOINTS = {
  analyzeLeaf: `${API_BASE_URL}/api/analyze`,
  chat: `${API_BASE_URL}/api/chat`,
  transcribe: `${API_BASE_URL}/api/transcribe`,
  speak: `${API_BASE_URL}/api/speak`,
  riskPrediction: `${API_BASE_URL}/api/risk`,
  recoveryPlan: `${API_BASE_URL}/api/recovery`,
} as const;

export const APP_NAME = "LeafDoc AI";
export const APP_TAGLINE = "AI-powered plant disease detection & recovery";
