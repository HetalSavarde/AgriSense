"""
Feature owner: Disease Detection
Endpoint: POST /predict

TODO for owner:
- Wire up the real image classifier in services/detection_service.py
- Wire up real report generation (AI call) in the same service
- This router should stay thin — no business logic here, just request
  handling and calling the service.
"""

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.detection import DetectionResponse
from app.services import detection_service

router = APIRouter()


@router.post("/predict", response_model=DetectionResponse)
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ("image/jpeg", "image/png", "image/jpg"):
        raise HTTPException(status_code=400, detail="Please upload an image file")

    image_bytes = await file.read()
    result = detection_service.analyze_leaf(image_bytes)
    return result
