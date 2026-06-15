import torch
from transformers import AutoModel, AutoTokenizer

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

model = model.eval().cuda().half()

print("MODEL LOADED")
