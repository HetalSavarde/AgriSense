import os
from dotenv import load_dotenv

load_dotenv()

# Detection uses a 3-provider fallback chain (see services/ai_providers.py):
# Claude -> Gemini -> Grok, tried in that order. Chat and recovery still use
# ANTHROPIC_API_KEY only, unmodified from the original build.
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
XAI_API_KEY = os.getenv("XAI_API_KEY", "")

# Order matters — first provider in this list is tried first.
DETECTION_PROVIDER_ORDER = ["grok", "gemini"]

_missing = [
    name for name, key in [
        ("XAI_API_KEY", XAI_API_KEY),
        ("GOOGLE_API_KEY", GOOGLE_API_KEY),
    ] if not key
]
if _missing:
    print(f"[config] WARNING: missing {', '.join(_missing)}. "
          f"Detection fallback chain will skip these providers. If ALL "
          f"three are missing/fail, /predict returns a 503 error.")
