import os
from pathlib import Path
from typing import List
import logging

logger = logging.getLogger(__name__)

class DocumentConverter:
    """Convert various document formats to PDF"""
    
    def __init__(self):
        self.supported_formats = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png']
    
    async def convert_to_pdf(self, file_path: str) -> str:
        """
        Convert document to PDF format.
        Returns the path to the PDF file.
        """
        file_ext = Path(file_path).suffix.lower()
        
        if file_ext == '.pdf':
            # Already PDF, no conversion needed
            return file_path
        
        elif file_ext in ['.docx', '.doc']:
            return await self._convert_docx_to_pdf(file_path)
        
        elif file_ext in ['.jpg', '.jpeg', '.png']:
            return await self._convert_image_to_pdf(file_path)
        
        else:
            raise ValueError(f"Unsupported file format: {file_ext}")
    
    async def _convert_docx_to_pdf(self, docx_path: str) -> str:
        """Convert DOCX to PDF using docx2pdf library"""
        try:
            # Try using docx2pdf (Windows only)
            from docx2pdf import convert
            pdf_path = docx_path.rsplit('.', 1)[0] + '.pdf'
            convert(docx_path, pdf_path)
            logger.info(f"Converted DOCX to PDF: {pdf_path}")
            return pdf_path
        except ImportError:
            logger.warning("docx2pdf not available, trying alternative method")
            # Alternative: Use python-docx to extract text and create simple PDF
            return await self._convert_docx_simple(docx_path)
    
    async def _convert_docx_simple(self, docx_path: str) -> str:
        """Simple DOCX to PDF conversion using reportlab"""
        try:
            from docx import Document
            from reportlab.lib.pagesizes import letter
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
            from reportlab.lib.styles import getSampleStyleSheet
            
            # Read DOCX
            doc = Document(docx_path)
            
            # Create PDF
            pdf_path = docx_path.rsplit('.', 1)[0] + '.pdf'
            pdf_doc = SimpleDocTemplate(pdf_path, pagesize=letter)
            
            styles = getSampleStyleSheet()
            story = []
            
            for para in doc.paragraphs:
                if para.text.strip():
                    p = Paragraph(para.text, styles['Normal'])
                    story.append(p)
                    story.append(Spacer(1, 12))
            
            pdf_doc.build(story)
            logger.info(f"Converted DOCX to PDF (simple): {pdf_path}")
            return pdf_path
        except Exception as e:
            logger.error(f"Failed to convert DOCX: {e}")
            # If all else fails, return original (printer might handle it)
            return docx_path
    
    async def _convert_image_to_pdf(self, image_path: str) -> str:
        """Convert image (JPG/PNG) to PDF"""
        try:
            from PIL import Image
            
            # Open image
            img = Image.open(image_path)
            
            # Convert RGBA to RGB if necessary
            if img.mode == 'RGBA':
                bg = Image.new('RGB', img.size, (255, 255, 255))
                bg.paste(img, mask=img.split()[3])
                img = bg
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Save as PDF
            pdf_path = image_path.rsplit('.', 1)[0] + '.pdf'
            img.save(pdf_path, 'PDF', resolution=100.0)
            
            logger.info(f"Converted image to PDF: {pdf_path}")
            return pdf_path
        except Exception as e:
            logger.error(f"Failed to convert image: {e}")
            return image_path
    
    async def merge_pdfs(self, pdf_paths: List[str], output_path: str) -> str:
        """Merge multiple PDF files into one"""
        try:
            from PyPDF2 import PdfMerger
            
            merger = PdfMerger()
            
            for pdf_path in pdf_paths:
                merger.append(pdf_path)
            
            merger.write(output_path)
            merger.close()
            
            logger.info(f"Merged {len(pdf_paths)} PDFs into: {output_path}")
            return output_path
        except ImportError:
            logger.error("PyPDF2 not installed. Cannot merge PDFs.")
            # Return first file if merge fails
            return pdf_paths[0] if pdf_paths else ""
        except Exception as e:
            logger.error(f"Failed to merge PDFs: {e}")
            return pdf_paths[0] if pdf_paths else ""

converter_service = DocumentConverter()
