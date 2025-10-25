# inference.py
import torch
from torchvision import transforms
from PIL import Image

def predict(model, device, image_path):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.5], [0.5])
    ])

    image = Image.open(image_path).convert("RGB")
    image = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        logits = model(image)
        prob = torch.sigmoid(logits).item()

    label = "Tumor Detected" if prob > 0.5 else "No Tumor Detected"

    return {
        "prediction": label,
        "confidence": prob if label == "Tumor Detected" else (1 - prob)
    }
