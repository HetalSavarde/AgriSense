"""
Feature owner: LeafDoc AI

TODO: replace get_reply() with a real AI call. Pass `disease` as context
so the model knows what condition it's discussing, and pass `history`
so it has conversation memory. Keep the return type a plain string.
"""

from app.schemas.chat import ChatMessage


def get_reply(disease: str, message: str, history: list[ChatMessage]) -> str:
    disease_readable = disease.replace("_", " ")
    return (
        f"(mock reply) Regarding your {disease_readable} question — "
        f"\"{message}\" — this is a placeholder. Wire up the real AI call here."
    )
