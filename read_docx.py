import zipfile
import xml.etree.ElementTree as ET

def read_docx(file_path):
    try:
        with zipfile.ZipFile(file_path) as z:
            doc_xml = z.read('word/document.xml')
            root = ET.fromstring(doc_xml)
            paragraphs = []
            for paragraph in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                texts = [node.text for node in paragraph.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
                paragraphs.append(''.join(texts))
            return '\n'.join(paragraphs)
    except Exception as e:
        return f"Error: {e}"

text = read_docx('/Users/nujuom/Downloads/graduation_project_template_with_ml_samples.docx')
with open('/Users/nujuom/Downloads/SkinCancerDetection-main/extracted_report.txt', 'w', encoding='utf-8') as f:
    f.write(text)
print("Extracted text successfully written to extracted_report.txt")
