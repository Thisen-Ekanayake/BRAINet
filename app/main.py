# uvicorn app.main:app --reload
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.model_loader import load_model
from app.inference import predict
import os
from datetime import datetime
import traceback
from gradcam_pp import run_gradcam

app = FastAPI(title="Brain Tumor Detection API (ResNet18 Multi-Class Classifier)")

default_allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://brainet-xi.vercel.app",
    "https://brainet.thisenekanayake.me"
]

allowed_origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv("ALLOWED_ORIGINS", ",".join(default_allowed_origins)).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model, device, target_layer = load_model()

@app.post("/predict")
async def predict_tumor(file: UploadFile = File(...)):
    file_path = None
    try:
        # validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # validate file size (max 50mb)
        file_content = await file.read()
        if len(file_content) > 50 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size too large. Maximum size is 50MB.")
        
        # save file temporarily
        os.makedirs("temp", exist_ok=True)
        file_path = f"temp/{file.filename}"
        
        with open(file_path, "wb") as f:
            f.write(file_content)

        # run prediction
        result = predict(model, device, file_path, target_layer)
        
        # determine detection result
        prediction = result["prediction"]
        is_tumor = prediction != "notumor"
        detection_value = "Tumor Present" if is_tumor else "No Tumor Detected"
        detection_confidence = int(result["confidence"] * 100) if is_tumor else int((1 - result["confidence"]) * 100)
        
        timestamp = datetime.now().isoformat()

        return {
            "success": True,
            "results": {
                "detection": {
                    "value": detection_value,
                    "confidence": detection_confidence,
                    "timestamp": timestamp
                },
                "classification": {
                    "value": prediction,
                    "confidence": int(result["confidence"] * 100),
                    "timestamp": timestamp
                },
                "all_probabilities": result["all_probabilities"],
                "visualizations": result["visualizations"]
            },
            "processingTime": "N/A",
            "modelVersion": "ResNet18 Multi-Class Classifier"
        }
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        print(f"Error during prediction: {error_msg}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {error_msg}"
        )
    finally:
        # clean up temporary file
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Error removing temp file: {e}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}
