# Skin Cancer Detection System with CNN + ViT and Web Application

This repository contains the complete implementation of a **Skin Cancer Detection and Screening System**, developed as a Computer Engineering Graduation Project at **Karabük University (2026)** by **Najma Mohamed**.

The project features a hybrid machine learning classification pipeline combined with an interactive, high-tech React web application.

---

## 📁 Project Structure

*   **[`app/frontend-react/`](file:///Users/nujuom/Downloads/SkinCancerDetection-main/app/frontend-react/) (The Web Part)**: The frontend user interface built with React, Vite, and Tailwind CSS.
*   **[`backend/`](file:///Users/nujuom/Downloads/SkinCancerDetection-main/backend/)**: The Python FastAPI backend serving the AI classification model, performing live image processing using OpenCV and PyTorch.
*   **`extracted_report.txt`**: The official final graduation project report document.
*   **`Skin_Cancer_Detection_Project_Notes.pdf`**: Project notes and presentation slides.
*   **`tunnel_watchdog.py`**: Watchdog script for localtunnel forwarding.

---

## 🌟 Key Features

*   **Dual Deep Learning Pipelines**:
    *   **CNN (MobileNetV2) + XGBoost**: Extracts local morphological textures and boundary structures.
    *   **ViT (Vision Transformer) + XGBoost**: Extracts global patch-dependencies across the lesion surface.
*   **Real-time Image Analysis (OpenCV)**:
    *   **Asymmetry (A)**: Calculates the difference between the lesion mask and its flipped coordinates.
    *   **Border Irregularity (B)**: Evaluates contour perimeter-to-area complexity.
    *   **Color Variegation (C)**: Computes RGB standard deviations within the segmented lesion mask.
*   **Interactive Web Dashboard (The "Web Part")**:
    *   **Detect Page**: Drag-and-drop file upload with animated neural analysis progression.
    *   **Split-Slider Viewer**: Compares the raw lesion image side-by-side with the attention heatmap.
    *   **Risk Gauge**: Visualizes the malignant probability with a circular gauge interface.
    *   **Clinical Insights**: Displays morphological ratings matching the ABCDE rules of dermatology.

---

## 🚀 How to Run the Project Locally

### 1. Start the Python Backend
Navigate to the backend directory, install dependencies, and run the FastAPI server:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```
*The backend will run on `http://localhost:8000`.*

### 2. Start the React Frontend
Open a new terminal window, navigate to the frontend directory, install npm packages, and start the development server:
```bash
cd app/frontend-react
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`. Open this URL in your web browser!*

---

## ⚖️ Disclaimer
This application is designed as an educational prototype for clinical decision-support. It is not a replacement for professional medical diagnosis or consulting.
