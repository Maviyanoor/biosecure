from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import detection, chat, stats

app = FastAPI(title="BioSecure API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detection.router, prefix="/api/detection", tags=["detection"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(stats.router, prefix="/api/stats", tags=["stats"])

@app.get("/health")
async def health():
    return {"status": "ok", "service": "BioSecure API"}
