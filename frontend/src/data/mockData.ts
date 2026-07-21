// Mock JSON data — replace with real API responses when backend is ready.
export const mockAnalysis = {
  diseaseName: "Early Blight (Alternaria solani)",
  confidence: 92.4,
  severity: "Moderate",
  causes: [
    "Fungal infection thriving in warm, humid conditions",
    "Poor air circulation between plants",
    "Water splash spreading spores from soil to leaves",
  ],
  symptoms: [
    "Concentric brown rings on lower leaves",
    "Yellowing tissue surrounding lesions",
    "Premature leaf drop as infection spreads",
  ],
  treatment: [
    "Apply copper-based fungicide every 7–10 days",
    "Remove and destroy infected leaves immediately",
    "Improve air circulation by pruning lower branches",
  ],
  prevention: [
    "Rotate crops every 2–3 seasons",
    "Mulch around the base to prevent soil splash",
    "Water at the root, not overhead",
  ],
  recoveryTime: "14–21 days with consistent treatment",
};

export const mockRisk = {
  healthScore: 68,
  riskPercent: 42,
  riskLevel: "Moderate" as const,
  actions: [
    "Reduce watering frequency by 20%",
    "Apply preventive neem oil spray this week",
    "Isolate plant from healthy neighbors for 5 days",
  ],
  explanation:
    "Micro-lesion patterns and slight chlorosis on the leaf margins suggest early-stage stress. Environmental humidity above 70% raises the fungal progression probability.",
};

export const mockRecovery = {
  progress: 35,
  precautions: [
    "Avoid overhead watering",
    "Do not fertilize during active infection",
    "Wear gloves when handling infected foliage",
  ],
  milestones: [
    { day: 1, title: "Initial Treatment", desc: "Remove infected leaves & apply fungicide", done: true },
    { day: 3, title: "First Assessment", desc: "Check for new lesions & humidity levels", done: true },
    { day: 7, title: "Second Spray", desc: "Reapply copper-based fungicide", done: false },
    { day: 10, title: "Recovery Check", desc: "New growth should appear healthy", done: false },
    { day: 14, title: "Full Recovery", desc: "Discontinue treatment if no new symptoms", done: false },
    { day: 21, title: "Prevention Phase", desc: "Switch to weekly preventive care", done: false },
  ],
};


export const initialChat = [
  {
    role: "assistant" as const,
    text: "Hi! I've reviewed your leaf. It looks like Early Blight. Ask me anything about treatment, prevention, or recovery.",
  },
];
