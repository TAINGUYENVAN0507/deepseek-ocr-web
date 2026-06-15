from fastapi import FastAPI

from app.api.ocr import router as ocr_router

app = FastAPI(
    title="DeepSeek OCR API",
    version="1.0.0",
    description="Backend OCR service using DeepSeek-OCR-2"
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