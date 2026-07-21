from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.detection import DetectionResponse
from app.services import detection_service
from app.services.detection_service import DetectionUnavailableError

router = APIRouter()


@router.post("/predict", response_model=DetectionResponse)
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ("image/jpeg", "image/png", "image/jpg"):
        raise HTTPException(status_code=400, detail="Please upload an image file")

    image_bytes = await file.read()
    try:
        result = detection_service.analyze_leaf(image_bytes)
    except DetectionUnavailableError:
        raise HTTPException(
            status_code=503,
            detail="Detection is temporarily unavailable. Please try again in a moment.",
        )
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to analyze image")
    return result