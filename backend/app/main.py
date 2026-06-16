from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.ocr import router as ocr_router

app = FastAPI(
    title="DeepSeek OCR API",
    version="1.0.0",
    description="Backend OCR service using DeepSeek-OCR-2"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ocr_router)


@app.get("/")
def root():
    return {
        "message": "DeepSeek OCR API Running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": "deepseek-ai/DeepSeek-OCR-2",
        "backend": "FastAPI",
        "gpu": "RTX 2080 Ti"
    }
