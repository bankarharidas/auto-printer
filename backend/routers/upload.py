import os
import shutil
import uuid
import aiofiles
import magic
from fastapi import APIRouter, UploadFile, File, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from datetime import datetime
from typing import List
from models import Document, DocumentCreate, PrintStatus, PrintOptions, ColorMode
from database import get_database
from slowapi import Limiter
from slowapi.util import get_remote_address
from services.converter import converter_service

router = APIRouter()

UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_MIME_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", # .docx
    "image/jpeg",
    "image/jpg",
    "image/png"
]

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=Document)
@Limiter(key_func=get_remote_address).limit("5/minute")
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    copies: int = 1,
    color_mode: ColorMode = ColorMode.BW,
    page_range: str = None,
    machine_id: str = None,
    db = Depends(get_database)
):
    # 1. Validate File Size
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large (max 10MB)")

    # 2. Validate File Type (Magic Number)
    # Read first 2KB for magic number check
    header = file.file.read(2048)
    file.file.seek(0)
    mime_type = magic.from_buffer(header, mime=True)
    
    if mime_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid file type: {mime_type}. Only PDF, DOCX, JPG allowed.")

    # 3. Secure Filename & Save
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    async with aiofiles.open(file_path, 'wb') as out_file:
        while content := await file.read(1024 * 1024):  # Read in chunks
            await out_file.write(content)

    # 4. Create DB Record
    doc_data = DocumentCreate(
        filename=unique_filename,
        original_filename=file.filename,
        file_size=file_size,
        file_type=mime_type,
        file_path=file_path,
        print_options=PrintOptions(
            copies=copies,
            color_mode=color_mode,
            page_range=page_range
        ),
        machine_id=machine_id
    )
    
    new_doc = await db["documents"].insert_one(doc_data.dict(by_alias=True))
    created_doc = await db["documents"].find_one({"_id": new_doc.inserted_id})
    
    # Convert ObjectId to string for serialization
    created_doc["_id"] = str(created_doc["_id"])
    
    return Document(**created_doc)

@router.post("/merge-and-upload", response_model=Document)
async def merge_and_upload(
    files: List[UploadFile] = File(...),
    copies: int = 1,
    color_mode: ColorMode = ColorMode.BW,
    machine_id: str = None,
    db = Depends(get_database)
):
    """
    Merge multiple files (PDF, DOCX, JPG) into one PDF and upload
    """
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least 2 files required for merging")
    
    converted_pdfs = []
    temp_files = []
    
    try:
        # Step 1: Upload and convert each file to PDF
        for file in files:
            # Validate file size
            file.file.seek(0, 2)
            file_size = file.file.tell()
            file.file.seek(0)
            
            if file_size > MAX_FILE_SIZE:
                raise HTTPException(status_code=413, detail=f"File {file.filename} too large (max 10MB)")
            
            # Save temporary file
            file_ext = os.path.splitext(file.filename)[1]
            temp_filename = f"{uuid.uuid4()}{file_ext}"
            temp_path = os.path.join(UPLOAD_DIR, temp_filename)
            
            async with aiofiles.open(temp_path, 'wb') as out_file:
                while content := await file.read(1024 * 1024):
                    await out_file.write(content)
            
            temp_files.append(temp_path)
            
            # Convert to PDF
            pdf_path = await converter_service.convert_to_pdf(temp_path)
            converted_pdfs.append(pdf_path)
        
        # Step 2: Merge all PDFs
        merged_filename = f"{uuid.uuid4()}_merged.pdf"
        merged_path = os.path.join(UPLOAD_DIR, merged_filename)
        
        await converter_service.merge_pdfs(converted_pdfs, merged_path)
        
        # Step 3: Get merged file size
        merged_size = os.path.getsize(merged_path)
        
        # Step 4: Create DB record
        doc_data = DocumentCreate(
            filename=merged_filename,
            original_filename=f"merged_{len(files)}_files.pdf",
            file_size=merged_size,
            file_type="application/pdf",
            file_path=merged_path,
            print_options=PrintOptions(
                copies=copies,
                color_mode=color_mode
            ),
            machine_id=machine_id
        )
        
        new_doc = await db["documents"].insert_one(doc_data.dict(by_alias=True))
        created_doc = await db["documents"].find_one({"_id": new_doc.inserted_id})
        
        # Convert ObjectId to string
        created_doc["_id"] = str(created_doc["_id"])
        
        return Document(**created_doc)
        
    except Exception as e:
        # Clean up on error
        for temp_file in temp_files:
            if os.path.exists(temp_file):
                os.remove(temp_file)
        raise HTTPException(status_code=500, detail=f"Merge failed: {str(e)}")
    
    finally:
        # Clean up temporary converted PDFs (keep only merged file)
        for pdf_path in converted_pdfs:
            if pdf_path != merged_path and os.path.exists(pdf_path):
                try:
                    os.remove(pdf_path)
                except:
                    pass
    
    return Document(**created_doc)
