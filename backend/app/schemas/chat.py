# from pydantic import BaseModel


# class ChatMessage(BaseModel):
#     role: str  # "user" | "assistant"
#     content: str


# class ChatRequest(BaseModel):
#     disease: str
#     message: str
#     history: list[ChatMessage] = []


# class ChatResponse(BaseModel):
#     reply: str


"""
Feature owner: LeafDoc AI
Pydantic models for /chat, /transcribe, /speak.
"""

from typing import Literal

from pydantic import BaseModel

# BCP-47 codes, matching what Sarvam AI's STT/TTS APIs expect directly.
LanguageCode = Literal["en-IN", "hi-IN", "mr-IN"]


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    disease: str
    message: str
    history: list[ChatMessage] = []
    # Language the farmer's message is in. Frontend sets this from the
    # /transcribe response when the mic was used; defaults to English for
    # typed input (see ChatAssistant.tsx notes on this tradeoff).
    language: LanguageCode = "en-IN"


class ChatResponse(BaseModel):
    reply: str
    # Echoes back the request language so the frontend knows which voice
    # to use if the farmer taps "listen" on this reply.
    language: LanguageCode = "en-IN"


class TranscribeResponse(BaseModel):
    text: str
    language: LanguageCode


class SpeakRequest(BaseModel):
    text: str
    language: LanguageCode = "en-IN"
