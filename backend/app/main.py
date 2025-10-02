from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from app.models import predict
from app.schemas import PredictionResponse
import io

app = FastAPI(title="BRAINet Backend")

# allow React frontend to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze", response_model=PredictionResponse)
async def analyze_scan(file: UploadFile = File(...)):
    # read uploaded image
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    # run prediction
    result = predict(image)
    
    return result
