from transformers import AutoModel, AutoTokenizer
import torch

MODEL_ID = "deepseek-ai/DeepSeek-OCR-2"

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

image_file = "test.jpg"

prompt = "<image>\nFree OCR."

res = model.infer(
    tokenizer,
    prompt=prompt,
    image_file=image_file,
    output_path="./outputs",
    save_results=True
)

print(res)
