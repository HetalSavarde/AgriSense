"""
Feature owner: Smart Recovery Planner
Endpoint: POST /recovery-plan

TODO for owner:
- Wire up the real AI call in services/recovery_service.py
"""

from fastapi import APIRouter, HTTPException

from app.schemas.recovery import RecoveryRequest, RecoveryResponse
from app.services import recovery_service

router = APIRouter()


@router.post("/recovery-plan", response_model=RecoveryResponse)
async def recovery_plan(payload: RecoveryRequest):
    try:
        result = recovery_service.build_plan(disease=payload.disease)
        return result
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to generate recovery plan")
