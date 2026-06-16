from transformers import AutoModel, AutoTokenizer
import torch
import os

MODEL_ID = "deepseek-ai/DeepSeek-OCR-2"

IMAGE_FILES = ["test1.jpg", "test3.jpg"]

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_ID,
    trust_remote_code=True
)

model = AutoModel.from_pretrained(
    MODEL_ID,
    trust_remote_code=True,
    use_safetensors=True
)

model = model.eval().cuda().to(torch.bfloat16)

prompt = "<image>\nFree OCR."

for image_file in IMAGE_FILES:
    if not os.path.exists(image_file):
        print(f"File not found: {image_file}")
        continue

    output_dir = f"./outputs_{os.path.splitext(image_file)[0]}"
    os.makedirs(output_dir, exist_ok=True)

    print(f"\nRunning OCR for: {image_file}")

    with torch.inference_mode():
        res = model.infer(
            tokenizer,
            prompt=prompt,
            image_file=image_file,
            output_path=output_dir,
            base_size=1024,
            image_size=768,
            crop_mode=True,
            save_results=True
        )

    print("Result:", res)
    print("Saved to:", output_dir)

    torch.cuda.empty_cache()

print("Done")
