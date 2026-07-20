# """
# Feature owner: LeafDoc AI
# Endpoint: POST /chat

# TODO for owner:
# - Wire up the real AI call in services/chat_service.py
# - Voice input/output is frontend-only (Web Speech API) — nothing to do here.
# """

# from fastapi import APIRouter, HTTPException

# from app.schemas.chat import ChatRequest, ChatResponse
# from app.services import chat_service

# router = APIRouter()


# @router.post("/chat", response_model=ChatResponse)
# async def chat(payload: ChatRequest):
#     try:
#         reply = chat_service.get_reply(
#             disease=payload.disease,
#             message=payload.message,
#             history=payload.history,
#         )
#         return ChatResponse(reply=reply)
#     except Exception:
#         raise HTTPException(status_code=500, detail="LeafDoc AI failed to respond")

"""
Feature owner: LeafDoc AI
Endpoints: POST /chat, POST /transcribe, POST /speak

/transcribe and /speak were added on top of the original /chat scaffold to
support the mic-input + multilingual "listen" feature (Hindi/English/Marathi).
Voice processing happens here, not in the frontend, so the Sarvam API key
never has to touch the browser.
"""

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import Response

from app.schemas.chat import ChatRequest, ChatResponse, SpeakRequest, TranscribeResponse
from app.services import chat_service

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    try:
        reply = chat_service.get_reply(
            disease=payload.disease,
            message=payload.message,
            history=payload.history,
            language=payload.language,
        )
        return ChatResponse(reply=reply, language=payload.language)
    except Exception:
        raise HTTPException(
            status_code=500, detail="LeafDoc AI failed to respond. Please try again."
        )


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(audio: UploadFile = File(...)):
    """Accepts a recorded audio blob from the frontend mic, returns transcribed text + detected language."""
    try:
        audio_bytes = await audio.read()
        if not audio_bytes:
            raise HTTPException(status_code=422, detail="Empty audio file received.")
        text, language = chat_service.transcribe_audio(
            audio_bytes, audio.filename or "recording.wav"
        )
        return TranscribeResponse(text=text, language=language)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Couldn't understand that. Please try speaking again.",
        )


@router.post("/speak")
async def speak(payload: SpeakRequest):
    """Returns raw WAV audio bytes for the frontend to play directly (no base64 round trip needed)."""
    try:
        audio_bytes = chat_service.synthesize_speech(payload.text, payload.language)
        return Response(content=audio_bytes, media_type="audio/wav")
    except Exception:
        raise HTTPException(
            status_code=500, detail="Couldn't generate audio right now."
        )
