# """
# Feature owner: LeafDoc AI

# TODO: replace get_reply() with a real AI call. Pass `disease` as context
# so the model knows what condition it's discussing, and pass `history`
# so it has conversation memory. Keep the return type a plain string.
# """

# from app.schemas.chat import ChatMessage


# def get_reply(disease: str, message: str, history: list[ChatMessage]) -> str:
#     disease_readable = disease.replace("_", " ")
#     return (
#         f"(mock reply) Regarding your {disease_readable} question — "
#         f"\"{message}\" — this is a placeholder. Wire up the real AI call here."
#     )


# """
# Feature owner: LeafDoc AI

# Two responsibilities live here:
# 1. get_reply() — chat replies with a Groq -> Gemini -> Anthropic fallback chain,
#    so one provider's quota/rate limits don't take the whole assistant down
#    during a shared hackathon demo.
# 2. transcribe_audio() / synthesize_speech() — Sarvam AI for Hindi/English/Marathi
#    speech-to-text and text-to-speech.

# Token-usage rules followed here (per spec):
# - Only the last MAX_HISTORY_TURNS messages are sent, trimmed server-side.
# - System prompt carries ONLY the disease name, never the full report.
# - max_tokens is capped so replies stay short and cheap.
# """

# import base64
# import io
# import logging

# from app.config import GEMINI_API_KEY, GROQ_API_KEY, SARVAM_API_KEY

# # config.py stores the Anthropic key as AI_API_KEY (shared with /predict and
# # /recovery-plan) — reuse it under this name rather than adding a new one.
# from app.config import AI_API_KEY as ANTHROPIC_API_KEY
# from app.schemas.chat import ChatMessage

# logger = logging.getLogger(__name__)

# MAX_HISTORY_TURNS = 6
# MAX_REPLY_TOKENS = 300

# # Any Bulbul v3 voice name works here — see docs.sarvam.ai/api-reference-docs/api-guides-tutorials/text-to-speech/voices
# SARVAM_TTS_SPEAKER = "shubh"

# FALLBACK_REPLY = (
#     "Sorry, LeafDoc AI is a little busy right now. Please try again in a moment, "
#     "or check the disease report tab for treatment info in the meantime."
# )


# def _system_prompt(disease: str) -> str:
#     disease_readable = disease.replace("_", " ")
#     return (
#         f"You are LeafDoc, a friendly AI assistant helping Indian farmers understand and treat "
#         f"plant diseases. The detected disease is: {disease_readable}. "
#         "Always reply in the SAME language the farmer used (Hindi, Marathi, or English) — "
#         "match their script, do not transliterate or switch languages. "
#         "Keep answers short, practical, and easy for a non-technical farmer to follow. "
#         "Avoid jargon. Prefer simple numbered steps over long paragraphs."
#     )


# def _trim_history(history: list[ChatMessage]) -> list[ChatMessage]:
#     """Server-side trim — never trust the frontend to only send 6 turns."""
#     return history[-MAX_HISTORY_TURNS:]


# def _build_messages(
#     disease: str, message: str, history: list[ChatMessage]
# ) -> list[dict]:
#     messages = [{"role": "system", "content": _system_prompt(disease)}]
#     for turn in _trim_history(history):
#         messages.append({"role": turn.role, "content": turn.content})
#     messages.append({"role": "user", "content": message})
#     return messages


# # --------------------------------------------------------------------------
# # Chat: Groq (primary) -> Gemini (fallback) -> Anthropic (optional fallback)
# # --------------------------------------------------------------------------


# def get_reply(
#     disease: str, message: str, history: list[ChatMessage], language: str = "en-IN"
# ) -> str:
#     messages = _build_messages(disease, message, history)

#     for provider_fn in (_try_groq, _try_gemini, _try_anthropic):
#         reply = provider_fn(messages)
#         if reply:
#             return reply

#     return FALLBACK_REPLY


# def _try_groq(messages: list[dict]) -> str | None:
#     if not GROQ_API_KEY:
#         return None
#     try:
#         from groq import APIError, AuthenticationError, Groq, RateLimitError

#         client = Groq(api_key=GROQ_API_KEY)
#         completion = client.chat.completions.create(
#             model="llama-3.3-70b-versatile",
#             messages=messages,
#             max_tokens=MAX_REPLY_TOKENS,
#             temperature=0.4,
#         )
#         return completion.choices[0].message.content
#     except AuthenticationError:
#         logger.error("Groq: invalid API key — check GROQ_API_KEY in .env")
#         return None
#     except RateLimitError:
#         logger.warning("Groq: rate limit / daily quota hit, falling back to Gemini")
#         return None
#     except APIError as e:
#         logger.error("Groq: API error - %s", e)
#         return None
#     except Exception as e:
#         logger.error("Groq: unexpected error - %s", e)
#         return None


# def _try_gemini(messages: list[dict]) -> str | None:
#     if not GEMINI_API_KEY:
#         return None
#     try:
#         from google import genai
#         from google.genai import types

#         client = genai.Client(api_key=GEMINI_API_KEY)
#         system_msg = messages[0]["content"]
#         convo_text = "\n".join(f'{m["role"]}: {m["content"]}' for m in messages[1:])

#         response = client.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=convo_text,
#             config=types.GenerateContentConfig(
#                 system_instruction=system_msg,
#                 max_output_tokens=MAX_REPLY_TOKENS,
#                 temperature=0.4,
#             ),
#         )
#         return response.text
#     except Exception as e:
#         logger.error("Gemini fallback failed - %s", e)
#         return None


# def _try_anthropic(messages: list[dict]) -> str | None:
#     if not ANTHROPIC_API_KEY:
#         return None
#     try:
#         import anthropic

#         client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
#         system_msg = messages[0]["content"]
#         convo = [{"role": m["role"], "content": m["content"]} for m in messages[1:]]

#         response = client.messages.create(
#             model="claude-sonnet-5",
#             max_tokens=MAX_REPLY_TOKENS,
#             system=system_msg,
#             messages=convo,
#         )
#         return response.content[0].text
#     except Exception as e:
#         logger.error("Anthropic fallback failed - %s", e)
#         return None


# # --------------------------------------------------------------------------
# # Voice: Sarvam AI (Saaras v3 for STT, Bulbul v3 for TTS)
# # --------------------------------------------------------------------------


# def transcribe_audio(audio_bytes: bytes, filename: str) -> tuple[str, str]:
#     """Returns (transcript, detected_language_code)."""
#     from sarvamai import SarvamAI

#     client = SarvamAI(api_subscription_key=SARVAM_API_KEY)
#     buf = io.BytesIO(audio_bytes)
#     buf.name = filename  # SDK expects a file-like object with a name

#     response = client.speech_to_text.transcribe(
#         file=buf,
#         model="saaras:v3",
#         mode="transcribe",
#     )
#     language = response.language_code or "en-IN"
#     return response.transcript, language


# def synthesize_speech(text: str, language: str) -> bytes:
#     """Returns raw WAV bytes."""
#     from sarvamai import SarvamAI

#     client = SarvamAI(api_subscription_key=SARVAM_API_KEY)
#     response = client.text_to_speech.convert(
#         text=text[:2500],  # Bulbul v3 hard limit per request
#         target_language_code=language,
#         model="bulbul:v3",
#         speaker=SARVAM_TTS_SPEAKER,
#     )
#     audio_base64 = "".join(response.audios)
#     return base64.b64decode(audio_base64)


"""
Feature owner: LeafDoc AI

Two responsibilities live here:
1. get_reply() — chat replies with a Groq -> Gemini fallback chain, so one
   provider's quota/rate limits don't take the whole assistant down during
   a shared hackathon demo.
2. transcribe_audio() / synthesize_speech() — Sarvam AI text-to-speech
   (speech-to-text now happens client-side via the browser, see
   ChatAssistant.tsx, but synthesize_speech is still used for "listen").

Token-usage rules followed here (per spec):
- Only the last MAX_HISTORY_TURNS messages are sent, trimmed server-side.
- System prompt carries ONLY the disease name, never the full report.
- max_tokens is capped so replies stay short and cheap.
"""

import base64
import io
import logging

from app.config import GEMINI_API_KEY, GROQ_API_KEY, SARVAM_API_KEY
from app.schemas.chat import ChatMessage

logger = logging.getLogger(__name__)

MAX_HISTORY_TURNS = 6
MAX_REPLY_TOKENS = 300

# Any Bulbul v3 voice name works here — see docs.sarvam.ai/api-reference-docs/api-guides-tutorials/text-to-speech/voices
SARVAM_TTS_SPEAKER = "shubh"

FALLBACK_REPLY = (
    "Sorry, LeafDoc AI is a little busy right now. Please try again in a moment, "
    "or check the disease report tab for treatment info in the meantime."
)

LANGUAGE_NAMES = {
    "en-IN": "English",
    "hi-IN": "Hindi",
    "mr-IN": "Marathi",
}


def _system_prompt(disease: str, language: str) -> str:
    disease_readable = disease.replace("_", " ")
    language_name = LANGUAGE_NAMES.get(language, "English")
    return (
        f"You are LeafDoc, a friendly AI assistant helping Indian farmers understand and treat "
        f"plant diseases. The detected disease is: {disease_readable}. "
        f"The farmer selected {language_name} as their language — you MUST reply entirely in "
        f"{language_name}, using its native script (Devanagari for Hindi and Marathi, do not "
        f"transliterate to Roman letters), regardless of what script their message used. "
        "Keep answers short, practical, and easy for a non-technical farmer to follow. "
        "Avoid jargon. Prefer simple numbered steps over long paragraphs."
    )


def _trim_history(history: list[ChatMessage]) -> list[ChatMessage]:
    """Server-side trim — never trust the frontend to only send 6 turns."""
    return history[-MAX_HISTORY_TURNS:]


def _build_messages(
    disease: str, message: str, history: list[ChatMessage], language: str
) -> list[dict]:
    messages = [{"role": "system", "content": _system_prompt(disease, language)}]
    for turn in _trim_history(history):
        messages.append({"role": turn.role, "content": turn.content})
    messages.append({"role": "user", "content": message})
    return messages


# --------------------------------------------------------------------------
# Chat: Groq (primary) -> Gemini (fallback)
# --------------------------------------------------------------------------


def get_reply(
    disease: str, message: str, history: list[ChatMessage], language: str = "en-IN"
) -> str:
    messages = _build_messages(disease, message, history, language)

    for provider_fn in (_try_groq, _try_gemini):
        reply = provider_fn(messages)
        if reply:
            return reply

    return FALLBACK_REPLY


def _try_groq(messages: list[dict]) -> str | None:
    if not GROQ_API_KEY:
        logger.warning("Groq: GROQ_API_KEY not set in .env, skipping")
        return None
    try:
        from groq import APIError, AuthenticationError, Groq, RateLimitError

        client = Groq(api_key=GROQ_API_KEY)
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=MAX_REPLY_TOKENS,
            temperature=0.4,
        )
        return completion.choices[0].message.content
    except AuthenticationError:
        logger.error("Groq: invalid API key — check GROQ_API_KEY in .env")
        return None
    except RateLimitError:
        logger.warning("Groq: rate limit / daily quota hit, falling back to Gemini")
        return None
    except APIError as e:
        logger.error("Groq: API error - %s", e)
        return None
    except Exception as e:
        logger.error("Groq: unexpected error - %s", e)
        return None


def _try_gemini(messages: list[dict]) -> str | None:
    if not GEMINI_API_KEY:
        logger.warning("Gemini: GEMINI_API_KEY not set in .env, skipping")
        return None
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=GEMINI_API_KEY)
        system_msg = messages[0]["content"]
        convo_text = "\n".join(f'{m["role"]}: {m["content"]}' for m in messages[1:])

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=convo_text,
            config=types.GenerateContentConfig(
                system_instruction=system_msg,
                max_output_tokens=MAX_REPLY_TOKENS,
                temperature=0.4,
            ),
        )
        return response.text
    except Exception as e:
        logger.error("Gemini fallback failed - %s", e)
        return None


# --------------------------------------------------------------------------
# Voice: Sarvam AI (Saaras v3 for STT, Bulbul v3 for TTS)
# --------------------------------------------------------------------------


def transcribe_audio(audio_bytes: bytes, filename: str) -> tuple[str, str]:
    """Returns (transcript, detected_language_code)."""
    from sarvamai import SarvamAI

    client = SarvamAI(api_subscription_key=SARVAM_API_KEY)
    buf = io.BytesIO(audio_bytes)
    buf.name = filename  # SDK expects a file-like object with a name

    response = client.speech_to_text.transcribe(
        file=buf,
        model="saaras:v3",
        mode="transcribe",
    )
    language = response.language_code or "en-IN"
    return response.transcript, language


def synthesize_speech(text: str, language: str) -> bytes:
    """Returns raw WAV bytes."""
    from sarvamai import SarvamAI

    client = SarvamAI(api_subscription_key=SARVAM_API_KEY)
    response = client.text_to_speech.convert(
        text=text[:2500],  # Bulbul v3 hard limit per request
        target_language_code=language,
        model="bulbul:v3",
        speaker=SARVAM_TTS_SPEAKER,
    )
    audio_base64 = "".join(response.audios)
    return base64.b64decode(audio_base64)
