from transformers import AutoProcessor

MODEL_ID = "deepseek-ai/DeepSeek-OCR-2"

print("Loading processor...")

processor = AutoProcessor.from_pretrained(
    MODEL_ID,
    trust_remote_code=True
)

print("PROCESSOR OK")
