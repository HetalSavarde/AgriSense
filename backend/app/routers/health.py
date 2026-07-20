from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def health_check():
    return {"status": "ok", "message": "AgriSense API is running"}
