import { API_ENDPOINTS } from "@/config/constants";
import { mockRisk, mockRecovery } from "@/data/mockData";

export type ChatLanguage = "en-IN" | "hi-IN" | "mr-IN";

export type ChatHistoryTurn = {
  role: "user" | "assistant";
  content: string;
};

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

  return {
    diseaseName: data.predicted_class
      .replace(/___/g, " - ")
      .replace(/_/g, " "),
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
  return mockRisk;
}

export async function fetchRecovery() {
  return mockRecovery;
}

export async function sendChatMessage(
  message: string,
  context?: { disease?: string },
  history: ChatHistoryTurn[] = [],
  language: ChatLanguage = "en-IN"
) {
  const response = await fetch(API_ENDPOINTS.chat, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      disease: context?.disease ?? "unknown",
      message,
      history,
      language,
    }),
  });

  if (!response.ok) {
    throw new Error("LeafDoc AI failed to respond");
  }

  return response.json() as Promise<{
    reply: string;
    language: ChatLanguage;
  }>;
}

export async function transcribeAudio(blob: Blob) {
  const formData = new FormData();
  formData.append("audio", blob, "recording.webm");

  const response = await fetch(API_ENDPOINTS.transcribe, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Could not transcribe audio");
  }

  return response.json() as Promise<{
    text: string;
    language: ChatLanguage;
  }>;
}

export async function speakText(
  text: string,
  language: ChatLanguage = "en-IN"
) {
  const response = await fetch(API_ENDPOINTS.speak, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      language,
    }),
  });

  if (!response.ok) {
    throw new Error("Could not generate audio");
  }

  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
}

export { API_ENDPOINTS };