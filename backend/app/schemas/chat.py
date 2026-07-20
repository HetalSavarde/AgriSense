from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    disease: str
    message: str
    history: list[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str
