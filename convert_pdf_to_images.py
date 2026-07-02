import fitz # PyMuPDF
import os

def convert_pdf_to_images(pdf_path, output_dir):
    doc = fitz.open(pdf_path)
    os.makedirs(output_dir, exist_ok=True)
    image_paths = []
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        pix = page.get_pixmap(dpi=150) # render page to an image
        image_path = os.path.join(output_dir, f"project_notes_page_{page_num + 1}.png")
        pix.save(image_path)
        image_paths.append(image_path)
        print(f"Saved page {page_num + 1} to {image_path}")
    return image_paths

if __name__ == "__main__":
    convert_pdf_to_images(
        "/Users/nujuom/Downloads/SkinCancerDetection-main/Skin_Cancer_Detection_Project_Notes.pdf",
        "/Users/nujuom/.gemini/antigravity/brain/cc4c0e6e-cb56-4e99-90a7-1a98982398a9"
    )
