import os
from dotenv import load_dotenv

load_dotenv()

# See .env.example note re: provider mismatch — confirm this key name
# matches whichever AI provider the services actually call.

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
XAI_API_KEY = os.getenv("XAI_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")

# Order matters — first provider in this list is tried first.
DETECTION_PROVIDER_ORDER = ["gemini", "grok"]

_missing = [
    name
    for name, key in [
        ("XAI_API_KEY", XAI_API_KEY),
        ("GEMINI_API_KEY", GEMINI_API_KEY),
    ]
    if not key
]
if _missing:
    print(
        f"[config] WARNING: missing {', '.join(_missing)}. "
        f"Detection fallback chain will skip these providers. If ALL "
        f"three are missing/fail, /predict returns a 503 error."
    )
