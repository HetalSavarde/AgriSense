from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health, detection, chat, recovery

app = FastAPI(title="AgriSense API")

# Wide open for the hackathon build — see API contract doc.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(detection.router)
app.include_router(chat.router)
app.include_router(recovery.router)
