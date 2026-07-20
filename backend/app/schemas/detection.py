from pydantic import BaseModel


class DetectionReport(BaseModel):
    severity: str  # "Low" | "Moderate" | "High"
    symptoms: list[str]
    causes: list[str]
    treatment: list[str]
    prevention: list[str]
    estimated_recovery_days: int
    next_steps: list[str]


class DetectionResponse(BaseModel):
    predicted_class: str
    confidence: float
    top3: list[dict]  # [{ "class": str, "confidence": float }, ...]
    report: DetectionReport
