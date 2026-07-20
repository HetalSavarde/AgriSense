import os
from dotenv import load_dotenv

load_dotenv()

# See .env.example note re: provider mismatch — confirm this key name
# matches whichever AI provider the services actually call.
# AI_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")

# if not AI_API_KEY:
#     print(
#         "[config] WARNING: ANTHROPIC_API_KEY is not set. "
#         "/predict, /chat, and /recovery-plan will only return mock data."
#     )
