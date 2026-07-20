from pydantic import BaseModel


class RecoveryRequest(BaseModel):
    disease: str


class RecoveryDay(BaseModel):
    day: int
    title: str
    tasks: list[str]


class RecoveryResponse(BaseModel):
    plan: list[RecoveryDay]
    estimated_recovery_days: int
