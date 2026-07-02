# Skin Cancer Screening and Diagnostic System

A Hybrid Deep Learning and Image Processing Framework with Web Interface

This repository contains the complete implementation of an automated skin cancer screening and decision-support system. Developed as a graduation project for the Department of Computer Engineering at Karabuk University (2026), this system leverages machine learning architectures and digital image processing to assist in the early evaluation of pigmented skin lesions.

## Project Overview

Early detection of melanoma and other skin malignancies significantly improves patient outcomes. However, clinical evaluation using dermoscopic imaging can be subjective and resource-intensive. 

This project introduces a dual-pipeline classifier that extracts localized morphological features using a Convolutional Neural Network (CNN) and global context representations using a Vision Transformer (ViT). These deep features are combined with gradient-boosted decision trees (XGBoost) for the final classification. Additionally, the backend incorporates classical computer vision algorithms to evaluate the clinical ABCD rules of dermatology (Asymmetry, Border irregularity, and Color variation) directly from uploaded images.

## Repository Structure

The project is organized into two primary components:

*   **app/frontend-react/**: The client-side web application built with React, Vite, and Tailwind CSS. It handles image uploads, displays diagnostic metrics, and provides an interactive visualization interface.
*   **backend/**: The Python-based API served via FastAPI. It runs the model inference pipeline and executes image segmentation and feature analysis using PyTorch and OpenCV.

Other contents include the graduation project report text (extracted_report.txt) and helper scripts for network configuration (tunnel_watchdog.py).

## Technical Features

### Multi-Architecture Classification Pipelines
*   **CNN Branch**: Uses a MobileNetV2 backbone to extract localized textures, boundary coordinates, and structural details.
*   **ViT Branch**: Employs self-attention mechanisms to map global patch relationships across the lesion surface, optimizing texture analysis.
*   **Ensemble Fusion**: Both branches integrate an XGBoost classification layer, combining deep features with rule-based metrics to generate final risk probabilities.

### Computer Vision Module (ABCD Analysis)
*   **Asymmetry (A)**: Segments the lesion boundary and calculates the geometric discrepancy between the original mask and its horizontal and vertical reflections.
*   **Border Irregularity (B)**: Evaluates boundary complexity by measuring the contour circularity and compactness ratio.
*   **Color Variegation (C)**: Measures the standard deviation of RGB color channels strictly within the segmented lesion boundary.

### Interactive User Interface
*   **Workspace**: Drag-and-drop file upload with a detailed step-by-step diagnostic progress indicator.
*   **Comparative View**: A split-screen slider comparing the original lesion image alongside the attention heatmap representation.
*   **Risk Metric Visualization**: A circular gauge showing the probability of malignancy alongside ratings based on clinical ABCDE criteria.

## Installation and Setup

### 1. Backend API Configuration
The backend server runs on Python 3 and requires Uvicorn to serve the API.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   python main.py
   ```
The API will run on http://localhost:8000.

### 2. Frontend Configuration
The frontend application requires Node.js to install dependencies and run the development server.

1. Navigate to the frontend directory:
   ```bash
   cd app/frontend-react
   ```
2. Install the package dependencies:
   ```bash
   npm install
   ```
3. Start the local Vite server:
   ```bash
   npm run dev
   ```
Open the printed local address (typically http://localhost:5173) in your browser to access the interface.

## Disclaimer
This application is an engineering prototype designed for educational and decision-support purposes. It is not an approved medical device and should not be used as a substitute for professional clinical diagnosis.
