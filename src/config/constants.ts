export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const API_ENDPOINTS = {
  analyzeLeaf: `${API_BASE_URL}/predict`,
  chat: `${API_BASE_URL}/api/chat`,
  transcribe: `${API_BASE_URL}/api/transcribe`,
  speak: `${API_BASE_URL}/api/speak`,
  riskPrediction: `${API_BASE_URL}/api/risk`,
  recoveryPlan: `${API_BASE_URL}/api/recovery`,
} as const;