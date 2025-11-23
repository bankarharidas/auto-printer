from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from database import get_database
from models import PrintStatus
from services.printer import printer_service
from bson import ObjectId
from datetime import datetime

router = APIRouter()

class PrintRequest(BaseModel):
    document_id: str

@router.post("/print")
async def trigger_print(request: PrintRequest, db = Depends(get_database)):
    # 1. Get Document
    try:
        doc = await db["documents"].find_one({"_id": ObjectId(request.document_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid Document ID")
        
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # 2. Update Status to QUEUED
    await db["documents"].update_one(
        {"_id": doc["_id"]},
        {"$set": {"status": PrintStatus.QUEUED}}
    )

    # 3. Trigger Print (Async)
    # In a real app, we might use BackgroundTasks or a Celery queue.
    # For this demo, we await it (blocking the request slightly) or just fire and forget?
    # Let's await it to report immediate errors, but ideally it should be background.
    
    try:
        await db["documents"].update_one(
            {"_id": doc["_id"]},
            {"$set": {"status": PrintStatus.PRINTING}}
        )
        
        # Use options from document
        copies = doc["print_options"]["copies"]
        
        await printer_service.print_file(doc["file_path"], copies=copies)
        
        # 4. Update Status to COMPLETED
        await db["documents"].update_one(
            {"_id": doc["_id"]},
            {"$set": {"status": PrintStatus.COMPLETED}}
        )
        
        return {"message": "Print job completed successfully", "status": "completed"}
        
    except Exception as e:
        await db["documents"].update_one(
            {"_id": doc["_id"]},
            {"$set": {"status": PrintStatus.FAILED, "error_message": str(e)}}
        )
        raise HTTPException(status_code=500, detail=f"Printing failed: {str(e)}")
