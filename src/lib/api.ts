// Thin API layer. Replace mock returns with real fetch calls to Flask backend.
import { API_ENDPOINTS } from "@/config/constants";
import { mockAnalysis, mockRisk, mockRecovery } from "@/data/mockData";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function analyzeLeaf(_file: File) {
  // TODO: replace with real fetch
  // const fd = new FormData(); fd.append("image", _file);
  // const res = await fetch(API_ENDPOINTS.analyzeLeaf, { method: "POST", body: fd });
  // return res.json();
  await delay(2600);
  return mockAnalysis;
}

export async function fetchRisk() {
  await delay(400);
  return mockRisk;
}

export async function fetchRecovery() {
  await delay(400);
  return mockRecovery;
}

export async function sendChatMessage(message: string, context?: { disease?: string }) {
  // const res = await fetch(API_ENDPOINTS.chat, { method: "POST", body: JSON.stringify({ message, context }) });
  await delay(900);
  const canned = [
    `For "${context?.disease ?? "your plant"}", the best next step is to isolate and treat with a copper-based fungicide.`,
    `Great question. Regarding "${message}" — consistency is key. Keep humidity below 65% and inspect daily.`,
    `Yes — prune the affected leaves, sanitize your shears, and reapply treatment every 7 days.`,
  ];
  return { reply: canned[Math.floor(Math.random() * canned.length)] };
}

export { API_ENDPOINTS };
