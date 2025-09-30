from pydantic import BaseModel

class PredictionResponse(BaseModel):
    tumor_type: str
    confidence: float