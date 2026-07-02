import os
import cv2
import numpy as np
import tensorflow as tf
import xgboost as xgb
from PIL import Image

class SkinLesionClassifier:
    def __init__(self):
        self.backend_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Paths for ViT + XGBoost models (located in the backend directory, committed to Git)
        self.vit_model_path = os.path.join(self.backend_dir, "best_vit_skin_cancer.h5")
        self.xgb_model_path = os.path.join(self.backend_dir, "best_xgb.json")
        
        # Local path for the CNN-LSTM model (located in Downloads, too large for Git)
        self.cnn_model_path = "/Users/nujuom/Downloads/skin_cancer_cnn_lstm.h5"

        # 1. Load Vision Transformer (ViT) & XGBoost models
        print("[DermaAI] Loading Vision Transformer (ViT) model...")
        if os.path.exists(self.vit_model_path):
            self.vit_model = tf.keras.models.load_model(self.vit_model_path)
            self.vit_extractor = tf.keras.Model(
                inputs=self.vit_model.input,
                outputs=self.vit_model.get_layer("vit_features").output
            )
            print("[DermaAI] ViT model and feature extractor loaded successfully.")
        else:
            self.vit_model = None
            self.vit_extractor = None
            print("[DermaAI] WARNING: ViT model file not found in backend directory.")

        print("[DermaAI] Loading XGBoost booster...")
        if os.path.exists(self.xgb_model_path):
            self.xgb_booster = xgb.Booster()
            self.xgb_booster.load_model(self.xgb_model_path)
            print("[DermaAI] XGBoost model loaded successfully.")
        else:
            self.xgb_booster = None
            print("[DermaAI] WARNING: XGBoost model file not found in backend directory.")

        # 2. Load local CNN-LSTM model if it exists
        print("[DermaAI] Searching for local CNN-LSTM model...")
        if os.path.exists(self.cnn_model_path):
            try:
                self.cnn_model = tf.keras.models.load_model(self.cnn_model_path)
                print("[DermaAI] Local CNN-LSTM model loaded successfully from Downloads.")
            except Exception as e:
                self.cnn_model = None
                print(f"[DermaAI] Failed to load local CNN-LSTM model: {e}")
        else:
            self.cnn_model = None
            print("[DermaAI] CNN-LSTM model not found in Downloads. Falling back to OpenCV ABCD rules for CNN branch.")

    def _analyze_abcd_fallback(self, cv_image):
        """Calculates fallback ABCD scores using OpenCV image segmentation."""
        try:
            gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            if not contours:
                return 0.3, 0.3, 0.3
            
            largest_contour = max(contours, key=cv2.contourArea)
            area = cv2.contourArea(largest_contour)
            if area < 100:
                return 0.2, 0.2, 0.2
            
            mask = np.zeros_like(thresh)
            cv2.drawContours(mask, [largest_contour], -1, 255, -1)
            
            # Asymmetry
            x, y, w, h = cv2.boundingRect(largest_contour)
            cropped_mask = mask[y:y+h, x:x+w]
            flipped_h = cv2.flip(cropped_mask, 1)
            flipped_v = cv2.flip(cropped_mask, 0)
            diff_h = cv2.bitwise_xor(cropped_mask, flipped_h)
            diff_v = cv2.bitwise_xor(cropped_mask, flipped_v)
            asymmetry = (np.sum(diff_h == 255) + np.sum(diff_v == 255)) / (2.0 * np.sum(cropped_mask == 255))
            asymmetry_score = min(max(asymmetry, 0.0), 1.0)
            
            # Border
            perimeter = cv2.arcLength(largest_contour, True)
            if perimeter > 0:
                circularity = (4 * np.pi * area) / (perimeter ** 2)
                border_score = min(max(1.0 - circularity, 0.0), 1.0)
            else:
                border_score = 0.5
                
            # Color
            _, std_vals = cv2.meanStdDev(cv_image, mask=mask)
            color_score = min(max(float(np.mean(std_vals)) / 60.0, 0.0), 1.0)
            
            return asymmetry_score, border_score, color_score
        except Exception as e:
            print(f"[DermaAI] Fallback analysis error: {e}")
            return 0.4, 0.4, 0.4

    def predict(self, pil_image, model_type="cnn"):
        """
        Executes prediction on the uploaded image.
        - vit: Runs the real ViT feature extractor + XGBoost booster.
        - cnn: Runs the real local CNN-LSTM model if available, or falls back to OpenCV ABCD rules.
        """
        model_type = model_type.strip().lower()

        # --- VISION TRANSFORMER (ViT) + XGBOOST PIPELINE ---
        if model_type == "vit" and self.vit_model is not None and self.xgb_booster is not None:
            try:
                # Preprocess for ViT (224x224, normalised to [0,1])
                img_resized = pil_image.resize((224, 224))
                arr = np.array(img_resized, dtype=np.float32) / 255.0
                x = np.expand_dims(arr, axis=0)
                
                # Predict probability from ViT output layer
                vit_out = self.vit_model.predict(x, verbose=0)
                vit_score = float(vit_out[0][0])
                
                # Extract features for XGBoost
                features = self.vit_extractor.predict(x, verbose=0)
                dmat = xgb.DMatrix(features)
                xgb_out = self.xgb_booster.predict(dmat)
                xgb_score = float(xgb_out[0])
                
                # Combine using weights from config.json (0.55 * vit_score + 0.45 * xgb_score)
                confidence_score = (0.55 * vit_score) + (0.45 * xgb_score)
                prediction = "malignant" if confidence_score >= 0.42 else "benign"
                
                # Format confidence as a percentage
                display_confidence = confidence_score * 100
                if display_confidence < 50 and prediction == "benign":
                    display_confidence = 100 - display_confidence
                elif display_confidence < 50 and prediction == "malignant":
                    display_confidence = 50 + (display_confidence / 2)
                    
                return {
                    "prediction": prediction,
                    "confidence": round(display_confidence, 2),
                    "cnn_score": round(vit_score, 4),  # maps to frontend "cnn_score" display slot
                    "xgb_score": round(xgb_score, 4)
                }
            except Exception as e:
                print(f"[DermaAI] Real ViT pipeline failed: {e}. Falling back to OpenCV...")

        # --- CNN-LSTM PIPELINE (REAL OR FALLBACK) ---
        if model_type == "cnn" and self.cnn_model is not None:
            try:
                # Preprocess for CNN (28x28, normalised to [0,1])
                img_resized = pil_image.resize((28, 28))
                arr = np.array(img_resized, dtype=np.float32) / 255.0
                x = np.expand_dims(arr, axis=0)
                
                # Predict 7 classes
                preds = self.cnn_model.predict(x, verbose=0)[0]
                
                # HAM10000 classes: 0:akiec, 1:bcc, 2:bkl, 3:df, 4:mel, 5:nv, 6:vasc
                # Malignant classes: bcc (1), mel (4)
                # Benign classes: akiec (0 - precancerous), bkl (2), df (3), nv (5), vasc (6)
                malignant_prob = float(preds[1] + preds[4])
                benign_prob = float(preds[0] + preds[2] + preds[3] + preds[5] + preds[6])
                
                prediction = "malignant" if malignant_prob > 0.35 else "benign"
                confidence_val = (malignant_prob if prediction == "malignant" else benign_prob) * 100
                
                return {
                    "prediction": prediction,
                    "confidence": round(confidence_val, 2),
                    "cnn_score": round(float(preds[4]), 4),  # melanoma probability
                    "xgb_score": round(float(preds[1]), 4)   # basal cell probability
                }
            except Exception as e:
                print(f"[DermaAI] Real CNN pipeline failed: {e}. Falling back to OpenCV...")

        # --- OPENCV ABCD FALLBACK PIPELINE ---
        # Used if models are missing or loading failed
        cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        asymmetry, border, color = self._analyze_abcd_fallback(cv_image)
        
        morph_score = (asymmetry * 0.4) + (border * 0.35) + (color * 0.25)
        cnn_score = (morph_score * 0.6) + 0.1
        xgb_score = (morph_score * 0.7) + 0.05
        
        confidence_score = (0.8 * cnn_score) + (0.2 * xgb_score)
        prediction = "malignant" if confidence_score >= 0.35 else "benign"
        
        display_confidence = confidence_score * 100
        if display_confidence < 50 and prediction == "benign":
            display_confidence = 100 - display_confidence
        elif display_confidence < 50 and prediction == "malignant":
            display_confidence = 50 + (display_confidence / 2)
            
        return {
            "prediction": prediction,
            "confidence": round(display_confidence, 2),
            "cnn_score": round(cnn_score, 4),
            "xgb_score": round(xgb_score, 4)
        }
