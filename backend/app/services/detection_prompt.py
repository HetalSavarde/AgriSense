"""
Shared prompt used by all three providers in the detection fallback chain.
Keeping this in one place means Claude, Gemini, and Grok all get asked the
exact same thing, so their outputs are directly comparable/interchangeable
and the contract shape only needs to be defined once.
"""

import json
import re

DETECTION_PROMPT = """You are an expert plant pathologist analyzing a leaf image.

Look at the uploaded leaf image and respond with ONLY a raw JSON object
(no markdown formatting, no code fences, no extra text before or after)
in exactly this shape:

{
  "predicted_class": "Plant___Disease_Name",
  "confidence": 0.90,
  "top3": [
    {"class": "Plant___Disease_Name", "confidence": 0.90},
    {"class": "Plant___Other_Possibility", "confidence": 0.07},
    {"class": "Plant___Third_Possibility", "confidence": 0.03}
  ],
  "report": {
    "severity": "Low",
    "symptoms": ["...", "..."],
    "causes": ["...", "..."],
    "treatment": ["...", "..."],
    "prevention": ["...", "..."],
    "estimated_recovery_days": 10,
    "next_steps": ["...", "..."]
  }
}

Rules:
- "predicted_class" format is "Plant___Disease" with underscores, e.g.
  "Tomato___Early_blight" or "Tomato___healthy" if no disease is visible.
- "confidence" values are floats between 0 and 1, top3 sorted highest first.
- "severity" is exactly one of: "Low", "Moderate", "High".
- If the leaf looks healthy, still fill every report field with
  reassuring, accurate content — do not omit fields.
- Output ONLY the JSON object. No commentary.
"""


def parse_json_response(raw_text: str) -> dict:
    """
    Providers sometimes wrap JSON in markdown code fences despite
    instructions not to. Strip that defensively before parsing, and let
    json.JSONDecodeError propagate — the caller (ai_providers.py) treats
    a parse failure as this provider failing, and moves to the next one.
    """
    cleaned = raw_text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    return json.loads(cleaned)


REQUIRED_TOP_LEVEL_FIELDS = ["predicted_class", "confidence", "top3", "report"]
REQUIRED_REPORT_FIELDS = [
    "severity", "symptoms", "causes", "treatment",
    "prevention", "estimated_recovery_days", "next_steps",
]


def validate_shape(data: dict) -> bool:
    """Quick sanity check before trusting a provider's output. Returns
    False (rather than raising) so the caller can cleanly fall back."""
    if not all(field in data for field in REQUIRED_TOP_LEVEL_FIELDS):
        return False
    report = data.get("report", {})
    if not all(field in report for field in REQUIRED_REPORT_FIELDS):
        return False
    return True
