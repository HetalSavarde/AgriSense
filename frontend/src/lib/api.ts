import { API_ENDPOINTS } from "@/config/constants";
import { mockRisk, mockRecovery } from "@/data/mockData";

export async function analyzeLeaf(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(API_ENDPOINTS.analyzeLeaf, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to analyze image");
  }

  const data = await response.json();

  // Convert backend response to the format expected by the existing UI
  return {
    diseaseName: data.predicted_class.replace(/___/g, " "),
    confidence: Number((data.confidence * 100).toFixed(1)),
    severity: data.report.severity,
    recoveryTime: `${data.report.estimated_recovery_days} days`,
    symptoms: data.report.symptoms,
    causes: data.report.causes,
    treatment: data.report.treatment,
    prevention: data.report.prevention,
    top3: data.top3,
    nextSteps: data.report.next_steps,
  };
}

export async function fetchRisk() {
  // Keep mock data until Risk Team API is ready
  return mockRisk;
}

export async function fetchRecovery() {
  // Keep mock data until Recovery Team API is ready
  return mockRecovery;
}

export async function sendChatMessage(
  message: string,
  context?: { disease?: string }
) {
  // Keep mock chat until Chat Team API is ready
  const canned = [
    `For "${context?.disease ?? "your plant"}", the best next step is to isolate and treat with a copper-based fungicide.`,
    `Regarding "${message}" — keep humidity controlled and inspect your plant regularly.`,
    `Prune affected leaves, sanitize tools, and continue treatment as recommended.`,
  ];

  return {
    reply: canned[Math.floor(Math.random() * canned.length)],
  };
}

export { API_ENDPOINTS };