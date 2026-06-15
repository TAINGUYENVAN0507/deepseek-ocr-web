from pathlib import Path

from fastapi import (
    APIRouter,
    UploadFile,
    File
)

from app.services.deepseek_service import (
    DeepSeekOCRService
)

from app.services.pdf_service import (
    pdf_to_images
)


router = APIRouter(
    prefix="/ocr",
    tags=["OCR"]
)

UPLOAD_DIR = "uploads"

Path(UPLOAD_DIR).mkdir(
    parents=True,
    exist_ok=True
)

ocr_service = DeepSeekOCRService()


@router.post("/image")
async def ocr_image(
    file: UploadFile = File(...)
):
    file_path = f"{UPLOAD_DIR}/{file.filename}"

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    text = ocr_service.ocr_image(file_path)

    return {
        "success": True,
        "filename": file.filename,
        "text": str(text)
    }


@router.post("/pdf")
async def ocr_pdf(
    file: UploadFile = File(...)
):
    file_path = f"{UPLOAD_DIR}/{file.filename}"

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    image_paths = pdf_to_images(file_path)

    results = []

    for idx, image_path in enumerate(image_paths, start=1):
        text = ocr_service.ocr_image(image_path)

        results.append({
            "page": idx,
            "text": str(text)
        })

    full_text = "\n\n".join(
        f"--- Page {item['page']} ---\n{item['text']}"
        for item in results
    )

    return {
        "success": True,
        "filename": file.filename,
        "pages": len(results),
        "text": full_text,
        "results": results
    }