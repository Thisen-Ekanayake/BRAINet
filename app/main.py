# uvicorn app.main:app --reload

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.model_loader import load_model
from app.inference import predict
import os
from datetime import datetime

app = FastAPI(title="Brain Tumor Detection API (ResNet18 Binary Classifier)")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "https://brainet-xi.vercel.app"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model, device = load_model()

@app.post("/predict")
async def predict_tumor(file: UploadFile = File(...)):
    os.makedirs("temp", exist_ok=True)
    file_path = f"temp/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    result = predict(model, device, file_path)

    os.remove(file_path)

    # format response to match frontend expectations
    detection_value = "Tumor Present" if result["prediction"] == "Tumor Detected" else "No Tumor Detected"
    confidence_percent = int(result["confidence"] * 100)
    timestamp = datetime.now().isoformat()
    
    return {
        "success": True,
        "results": {
            "detection": {
                "value": detection_value,
                "confidence": confidence_percent,
                "timestamp": timestamp
            },
            "classification": {
                "value": "No Tumor" if detection_value == "No Tumor Detected" else "Tumor Detected",
                "confidence": confidence_percent if detection_value == "Tumor Detected" else (100 - confidence_percent),
                "timestamp": timestamp
            }
        },
        "processingTime": "N/A",
        "modelVersion": "ResNet18 Binary Classifier"
    }
