import io
import os
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from classifier import SkinLesionClassifier

# Initialize FastAPI app
app = FastAPI(
    title="DermaAI - Skin Cancer Screening API",
    description="Backend model serving API for graduation project, running hybrid CNN/ViT + XGBoost classifiers.",
    version="1.0.0"
)

# Enable CORS (Cross-Origin Resource Sharing)
# This is crucial so that the local React app (running on localhost:5173 or Vercel) can make API calls.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Instantiate the hybrid classifier model
try:
    classifier = SkinLesionClassifier()
except Exception as e:
    print(f"[DermaAI] Failed to initialize classifier: {e}")
    classifier = None

@app.get("/health")
def health_check():
    """Endpoint for localtunnel watchdog health check."""
    return {"status": "healthy"}

@app.post("/predict")
async def predict_lesion(
    image: UploadFile = File(...),
    model_type: str = Form("cnn")
):
    """
    Diagnoses skin lesion images.
    Expects form-data parameters:
    - image: binary image file (JPEG, PNG)
    - model_type: "cnn" or "vit"
    """
    if classifier is None:
        raise HTTPException(
            status_code=503,
            detail="Model classifier is not initialized on the server."
        )

    # 1. Read and validate the image file
    try:
        image_bytes = await image.read()
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image file. Could not parse bytes: {e}"
        )

    # 2. Validate model type
    model_type = model_type.strip().lower()
    if model_type not in ["cnn", "vit"]:
        model_type = "cnn"  # default fallback

    # 3. Execute prediction
    try:
        result = classifier.predict(pil_image, model_type=model_type)
        
        # Format response matching React frontend expectations
        return {
            "prediction": result["prediction"],
            "confidence": result["confidence"],
            "model_used": model_type,
            "cnn_score": result["cnn_score"],
            "xgb_score": result["xgb_score"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction analysis pipeline failed: {e}"
        )

if __name__ == "__main__":
    import uvicorn
    # Run server locally on port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
