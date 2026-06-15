from transformers import AutoModel, AutoTokenizer
import torch
from pathlib import Path
import uuid


MODEL_ID = "deepseek-ai/DeepSeek-OCR-2"


class DeepSeekOCRService:
    def __init__(self):
        print("Loading DeepSeek OCR...")

        self.tokenizer = AutoTokenizer.from_pretrained(
            MODEL_ID,
            trust_remote_code=True
        )

        self.model = AutoModel.from_pretrained(
            MODEL_ID,
            trust_remote_code=True,
            use_safetensors=True
        )

        self.model = self.model.eval().cuda().to(torch.bfloat16)

        print("DeepSeek OCR Ready")

    def ocr_image(self, image_path: str):
        output_dir = Path("outputs") / str(uuid.uuid4())
        output_dir.mkdir(parents=True, exist_ok=True)

        self.model.infer(
            self.tokenizer,
            prompt="<image>\nFree OCR.",
            image_file=image_path,
            output_path=str(output_dir),
            save_results=True
        )

        result_file = output_dir / "result.mmd"

        if result_file.exists():
            return result_file.read_text(encoding="utf-8")

        return ""