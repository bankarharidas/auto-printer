from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class PrintStatus(str, Enum):
    UPLOADED = "uploaded"
    DOWNLOADING = "downloading"
    QUEUED = "queued"
    PRINTING = "printing"
    COMPLETED = "completed"
    FAILED = "failed"

class ColorMode(str, Enum):
    COLOR = "color"
    BW = "bw"

class PrintOptions(BaseModel):
    copies: int = Field(1, ge=1, le=100)
    color_mode: ColorMode = ColorMode.BW
    page_range: Optional[str] = None  # e.g., "1-5, 8"

class DocumentBase(BaseModel):
    filename: str
    original_filename: str
    file_size: int
    file_type: str
    upload_time: datetime = Field(default_factory=datetime.utcnow)
    status: PrintStatus = PrintStatus.UPLOADED
    print_options: PrintOptions

class DocumentCreate(DocumentBase):
    file_path: str

class Document(DocumentBase):
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "filename": "doc_123.pdf",
                "original_filename": "report.pdf",
                "file_size": 102400,
                "file_type": "application/pdf",
                "status": "uploaded",
                "print_options": {
                    "copies": 1,
                    "color_mode": "bw"
                }
            }
        }

class PrintJob(BaseModel):
    id: str = Field(..., alias="_id")
    document_id: str
    status: PrintStatus
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    message: Optional[str] = None

class AdminUser(BaseModel):
    username: str
    password_hash: str
