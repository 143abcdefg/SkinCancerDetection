# Skin Cancer Detection (Hybrid Inference)

Inference project for skin lesion prediction using hybrid CNN + XGBoost and ViT + XGBoost pipelines.

## Stack

*   FastAPI backend for model serving and image processing
*   React + Vite frontend for the web application user interface
*   TensorFlow/Keras Vision Transformer (ViT) + PyTorch MobileNetV2 + XGBoost models for predictions
*   OpenCV + Pillow + NumPy for lesion segmentation and boundary analysis

## Clean project structure

```text
README.md
extracted_report.txt
Skin_Cancer_Detection_Project_Notes.pdf
tunnel_watchdog.py
app/
  frontend-react/
    src/
    package.json
    vite.config.js
backend/
  main.py
  classifier.py
  requirements.txt
  best_vit_skin_cancer.h5
  best_xgb.json
  config.json
```

## Setup

Navigate to the backend directory, initialize the environment, and install dependencies:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Run backend

To start the FastAPI backend server:
```bash
python main.py
```
*   Health check: http://127.0.0.1:8000/health
*   Prediction endpoint: http://127.0.0.1:8000/predict

## Run frontend

To start the React development server:
```bash
cd app/frontend-react
npm install
npm run dev
```
The frontend application runs at http://127.0.0.1:5173.

## Prediction endpoint

POST `/predict` (multipart form-data):

*   **Field name**: `image` (JPEG/PNG image file)
*   **Field name**: `model_type` (string, either `cnn` or `vit`)

**Output format**:
```json
{
  "prediction": "benign" or "malignant",
  "confidence": 0.0 to 100.0,
  "model_used": "cnn" or "vit",
  "cnn_score": 0.0 to 1.0,
  "xgb_score": 0.0 to 1.0
}
```

## Notes

### Required Model Files (ViT Branch)
*   `backend/best_vit_skin_cancer.h5`
*   `backend/best_xgb.json`
*   `backend/config.json`

### Ensemble Rules

*   **ViT + XGBoost Branch**:
    *   Combined Score = (ViT Probability * 0.55) + (XGBoost Probability * 0.45)
    *   Combined Score >= 0.42 => malignant, else benign
*   **CNN + XGBoost Branch (Local)**:
    *   Loads local `skin_cancer_cnn_lstm.h5` model (uses class probabilities)
    *   Combined Score = (CNN Probability * 0.80) + (XGBoost Probability * 0.20)
    *   Combined Score >= 0.35 => malignant, else benign
    *   *If the CNN file is missing locally, the system runs an OpenCV-based boundary, asymmetry, and color extraction fallback.*

This application is for educational purposes and is not a medical diagnosis tool.

## Author

**Najma Mohamed**

*   CNN + XGBoost and ViT + XGBoost model development and training
*   Backend API development using FastAPI and OpenCV
*   Frontend development using React and Tailwind CSS
*   Ensemble model integration and threshold tuning
*   Application deployment configurations
