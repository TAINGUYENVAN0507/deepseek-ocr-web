from pathlib import Path
from pdf2image import convert_from_path
import uuid


def pdf_to_images(pdf_path: str) -> list[str]:
    output_dir = Path("outputs") / f"pdf_{uuid.uuid4()}"
    output_dir.mkdir(parents=True, exist_ok=True)

    pages = convert_from_path(pdf_path, dpi=200)

    image_paths = []

    for i, page in enumerate(pages, start=1):
        image_path = output_dir / f"page_{i}.jpg"
        page.save(image_path, "JPEG")
        image_paths.append(str(image_path))

    return image_paths