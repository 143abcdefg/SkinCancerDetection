import os
from fpdf import FPDF

class ProjectPDF(FPDF):
    def header(self):
        # Background decoration
        self.set_fill_color(248, 250, 252) # Slate 50 background
        self.rect(0, 0, 210, 297, 'F')
        
        # Header banner
        self.set_fill_color(15, 118, 110) # Teal 700 banner background
        self.rect(0, 0, 210, 25, 'F')
        
        # Header text
        self.set_y(5)
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(255, 255, 255) # White text
        self.cell(0, 8, 'SKIN CANCER DETECTION SYSTEM', align='C', new_x="LMARGIN", new_y="NEXT")
        
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(204, 251, 241) # Light teal text
        self.cell(0, 5, 'GRADUATION PROJECT DOCUMENTATION (A TO Z)', align='C', new_x="LMARGIN", new_y="NEXT")
        
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(148, 163, 184) # Light slate
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}} | Prepared by Eng. Najma Mohamed | Karabük University 2026', align='C')

def create_project_pdf(output_path):
    pdf = ProjectPDF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()
    
    # Left margin 15mm, right margin 15mm
    pdf.set_left_margin(15)
    pdf.set_right_margin(15)
    
    def add_section(title):
        pdf.ln(5)
        pdf.set_font('Helvetica', 'B', 12)
        pdf.set_text_color(15, 118, 110) # Teal 700
        pdf.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
        
        # Draw section separator line
        pdf.set_draw_color(45, 212, 191) # Teal 400
        pdf.set_line_width(0.3)
        pdf.line(pdf.get_x(), pdf.get_y(), 195, pdf.get_y())
        pdf.ln(3)

    def add_paragraph(text):
        pdf.set_font('Helvetica', '', 9.5)
        pdf.set_text_color(30, 41, 59) # Slate 800
        pdf.multi_cell(0, 5, text)
        pdf.ln(2)

    def add_bullet(bold_part, regular_part):
        pdf.set_font('Helvetica', 'B', 9.5)
        pdf.set_text_color(15, 118, 110) # Teal 700
        pdf.write(5, "  -  ")
        pdf.write(5, bold_part)
        pdf.set_font('Helvetica', '', 9.5)
        pdf.set_text_color(30, 41, 59) # Slate 800
        pdf.write(5, regular_part + "\n")
        pdf.ln(1)

    # 1. Project Overview
    add_section("1. PROJECT OVERVIEW")
    add_paragraph("Skin cancer, specifically melanoma, represents a significant global health risk. Early screening is essential to improve survival rates. However, traditional clinical evaluation using dermoscopic imaging is highly subjective and depends on specialized expert resources.")
    add_paragraph("This graduation project designs and implements an automated, high-precision clinical decision-support system. It utilizes a hybrid deep learning architecture that fuses neural feature representation with gradient-boosted decision trees, and deploys it as a real-time web application dashboard.")
    
    # 2. Dataset & Preprocessing
    add_section("2. DATASET & PREPROCESSING")
    add_bullet("Dataset Source: ", "The benchmark HAM10000 Dataset ('Human Against Machine') containing 10,015 high-quality dermoscopic images of common pigmented skin lesions.")
    add_bullet("Resizing: ", "All input images are resized to 224 x 224 pixels to match the input requirements of the deep learning architectures.")
    add_bullet("Normalization: ", "Pixel color values are scaled to the range [0, 1] using Min-Max scaling to stabilize gradient updates.")
    add_bullet("Data Augmentation: ", "Applied random rotations, zoom, horizontal, and vertical flips during model training to improve generalization on unseen clinical cases.")
    
    # 3. Machine Learning Models
    add_section("3. HYBRID MACHINE LEARNING MODELS")
    add_paragraph("Instead of relying on single neural networks, this project introduces a hybrid classifier strategy. Deep neural layers extract high-dimensional visual representation vectors, which are then classified using both neural classifiers and XGBoost.")
    
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(13, 148, 136) # Teal 600
    pdf.cell(0, 6, "Pipeline 1: CNN (MobileNetV2) + XGBoost", new_x="LMARGIN", new_y="NEXT")
    add_paragraph("MobileNetV2 acts as a local feature extractor, converting the skin lesion image into a 1280-dimensional feature vector capturing localized textures, color variegations, and border irregular structures. The feature vector is classified parallelly by a deep neural network dense layer and an XGBoost model. The outputs are fused using the ensemble probability formula:")
    
    # Mathematical Formula Box
    pdf.set_fill_color(241, 245, 249) # Slate 100
    pdf.set_draw_color(226, 232, 240) # Slate 200
    pdf.cell(0, 10, "  P_final = 0.8 * P_cnn + 0.2 * P_xgb   (Malignant Classification Threshold: t = 0.25)", border=1, fill=True, align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)

    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(13, 148, 136) # Teal 600
    pdf.cell(0, 6, "Pipeline 2: Vision Transformer (ViT) + XGBoost", new_x="LMARGIN", new_y="NEXT")
    add_paragraph("The Vision Transformer (ViT) divides the image into 49 local patches (7x7 grid) and uses multi-head self-attention mechanisms to map global contextual dependencies across the lesion surface. This feature representation is passed to a ViT head and an XGBoost classifier, fused using the formula:")
    
    # Mathematical Formula Box 2
    pdf.cell(0, 10, "  P_final = 0.55 * P_vit + 0.45 * P_xgb   (Malignant Classification Threshold: t = 0.42)", border=1, fill=True, align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)

    # 4. Key Differences Table
    add_section("4. ARCHITECTURAL COMPARISON & PERFORMANCE")
    pdf.set_font('Helvetica', 'B', 8.5)
    pdf.set_fill_color(224, 242, 254) # Light sky blue header
    pdf.set_text_color(15, 23, 42) # Slate 900
    
    # Write Table Headers
    pdf.cell(45, 8, ' Feature Comparison', border=1, fill=True, align='L')
    pdf.cell(70, 8, ' CNN (MobileNetV2) + XGBoost', border=1, fill=True, align='L')
    pdf.cell(65, 8, ' Vision Transformer (ViT) + XGBoost', border=1, fill=True, align='L', new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font('Helvetica', '', 8.5)
    pdf.set_text_color(51, 65, 85) # Slate 700
    
    # Table rows
    table_data = [
        (" Processing Unit", "Sliding convolutional filters (kernels)", "Image patches + Self-Attention layers"),
        (" Receptive Field", "Local: Small neighborhoods (borders, dots)", "Global: Relates distant patches instantly"),
        (" Inductive Bias", "High (assumes pixel neighborhood relevance)", "None (learns all spatial structures from scratch)"),
        (" Key Metric Advantage", "Highest Accuracy (84.76%), F1-Score (65.25%)", "Highest Diagnostic Recall / Sensitivity (75.40%)"),
        (" Clinical Use Case", "General screening with lower false alerts", "Safety-critical screening (catches malignancies)")
    ]
    
    for feat, col1, col2 in table_data:
        # Save positions to draw variable height cells if text wraps
        x_start = pdf.get_x()
        y_start = pdf.get_y()
        
        pdf.cell(45, 8, feat, border=1, align='L')
        pdf.cell(70, 8, col1, border=1, align='L')
        pdf.cell(65, 8, col2, border=1, align='L', new_x="LMARGIN", new_y="NEXT")

    pdf.ln(4)

    # 5. Web Application Architecture
    add_section("5. WEB APPLICATION ARCHITECTURE")
    add_paragraph("To make the ML models useful in practice, a high-tech diagnostic HUD (Heads-Up Display) application was developed. The architecture uses a decoupled layout:")
    add_bullet("Frontend Stack: ", "Built with React and Vite. Tailwind CSS was used to style the sleek, dark, glassmorphic layout. State management is handled globally using React Context (PredictionContext).")
    add_bullet("Backend API: ", "A fast Python ASGI server using FastAPI running locally on port 8000. It runs model inference on incoming images and sends back classification scores in real-time.")
    add_bullet("Network Tunneling: ", "A secure LocalTunnel connection (https://skin-cancer-hud-api.loca.lt) bridges the online frontend with the local backend, allowing clinicians to take a photo of a lesion on their phones and run it immediately.")

    # 6. Core Pages and Features
    add_section("6. CORE APP PAGES & DIAGNOSTIC WORKFLOW")
    add_bullet("Home Hub: ", "Simulates live calibration telemetry (exposure, sharpness), features a rotating radar scanner, a 3D wrist wireframe, and a selection modal for the diagnostic pipeline.")
    add_bullet("Detect Workspace: ", "A drag-and-drop area supporting files up to 10MB, a dynamic loader reflecting neural network stages, and API submission.")
    add_bullet("Result Report: ", "Features a custom visual Split-Slider Viewer comparing the raw lesion side-by-side with a CSS-burn attention heatmap, a semi-circular Risk Gauge, and morphological insights based on the ABCDE clinical rules.")
    add_bullet("Poster Page: ", "A built-in printable A2-size academic poster presenting the research background, workflow, and model evaluations.")

    # 7. Environments A to Z
    add_section("7. SYSTEMS & ENVIRONMENTS (A TO Z)")
    add_bullet("Training: ", "Google Colab & Anaconda Jupyter environments (PyTorch, PyTorch Image Models, XGBoost).")
    add_bullet("IDE: ", "Visual Studio Code (VS Code) for system editing.")
    add_bullet("Frontend Local/Hosting: ", "Node.js (local) and Vercel (production cloud deployment).")
    add_bullet("Backend Local Server: ", "Anaconda Virtual Environment, served using Uvicorn ASGI on localhost:8000.")
    add_bullet("Tunneling: ", "LocalTunnel CLI package running in background terminal.")

    # Save PDF
    pdf.output(output_path)
    print(f"PDF Successfully saved to {output_path}")

if __name__ == "__main__":
    create_project_pdf("/Users/nujuom/Downloads/SkinCancerDetection-main/Skin_Cancer_Detection_Project_Notes.pdf")
