from fastapi import FastAPI, UploadFile, File
from app.model_loader import load_model
from app.inference import predict
import os

app = FastAPI(title="Brain Tumor Detection API (ResNet18 Binary Classifier)")

model, device = load_model()

@app.post("/predict")
async def predict_tumor(file: UploadFile = File(...)):
    os.makedirs("temp", exist_ok=True)
    file_path = f"temp/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    result = predict(model, device, file_path)

    os.remove(file_path)

    return result
