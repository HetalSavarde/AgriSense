"""
Feature owner: LeafDoc AI
Endpoint: POST /chat

TODO for owner:
- Wire up the real AI call in services/chat_service.py
- Voice input/output is frontend-only (Web Speech API) — nothing to do here.
"""

from fastapi import APIRouter, HTTPException

from app.schemas.chat import ChatRequest, ChatResponse
from app.services import chat_service

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    try:
        reply = chat_service.get_reply(
            disease=payload.disease,
            message=payload.message,
            history=payload.history,
        )
        return ChatResponse(reply=reply)
    except Exception:
        raise HTTPException(status_code=500, detail="LeafDoc AI failed to respond")
