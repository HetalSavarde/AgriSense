// // Thin API layer. Replace mock returns with real fetch calls to Flask backend.
// import { API_ENDPOINTS } from "@/config/constants";
// import { mockAnalysis, mockRisk, mockRecovery } from "@/data/mockData";

// const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// export async function analyzeLeaf(_file: File) {
//   // TODO: replace with real fetch
//   // const fd = new FormData(); fd.append("image", _file);
//   // const res = await fetch(API_ENDPOINTS.analyzeLeaf, { method: "POST", body: fd });
//   // return res.json();
//   await delay(2600);
//   return mockAnalysis;
// }

// export async function fetchRisk() {
//   await delay(400);
//   return mockRisk;
// }

// export async function fetchRecovery() {
//   await delay(400);
//   return mockRecovery;
// }

// export async function sendChatMessage(message: string, context?: { disease?: string }) {
//   // const res = await fetch(API_ENDPOINTS.chat, { method: "POST", body: JSON.stringify({ message, context }) });
//   await delay(900);
//   const canned = [
//     `For "${context?.disease ?? "your plant"}", the best next step is to isolate and treat with a copper-based fungicide.`,
//     `Great question. Regarding "${message}" — consistency is key. Keep humidity below 65% and inspect daily.`,
//     `Yes — prune the affected leaves, sanitize your shears, and reapply treatment every 7 days.`,
//   ];
//   return { reply: canned[Math.floor(Math.random() * canned.length)] };
// }

// export { API_ENDPOINTS };


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

// --- LeafDoc AI chat ---------------------------------------------------

export type ChatLanguage = "en-IN" | "hi-IN" | "mr-IN";

export type ChatHistoryTurn = { role: "user" | "assistant"; content: string };

/**
 * NOTE on API_ENDPOINTS: this file assumes `chat`, `transcribe`, and `speak`
 * keys exist on API_ENDPOINTS. `chat` was already there. Add these two to
 * src/config/constants.ts (same base URL, adjust path):
 *
 *   transcribe: `${API_BASE}/transcribe`,
 *   speak: `${API_BASE}/speak`,
 */

export async function sendChatMessage(
  message: string,
  context?: { disease?: string },
  history: ChatHistoryTurn[] = [],
  language: ChatLanguage = "en-IN"
) {
  const res = await fetch(API_ENDPOINTS.chat, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      disease: context?.disease ?? "unknown",
      message,
      history,
      language,
    }),
  });

  if (!res.ok) {
    throw new Error("LeafDoc AI failed to respond");
  }

  return res.json() as Promise<{ reply: string; language: ChatLanguage }>;
}

/** Sends a recorded audio blob to the backend, gets back transcribed text + detected language. */
export async function transcribeAudio(blob: Blob) {
  const formData = new FormData();
  formData.append("audio", blob, "recording.webm");

  const res = await fetch(API_ENDPOINTS.transcribe, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Could not transcribe audio");
  }

  return res.json() as Promise<{ text: string; language: ChatLanguage }>;
}

/** Fetches TTS audio for a piece of text and returns a playable object URL. Caller should revoke it when done. */
export async function speakText(text: string, language: ChatLanguage = "en-IN") {
  const res = await fetch(API_ENDPOINTS.speak, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });

  if (!res.ok) {
    throw new Error("Could not generate audio");
  }

  const audioBlob = await res.blob();
  return URL.createObjectURL(audioBlob);
}

export { API_ENDPOINTS };