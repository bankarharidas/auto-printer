from fastapi import APIRouter, HTTPException, Depends
from database import get_database
from bson import ObjectId
from models import Document

router = APIRouter()

@router.get("/status/{document_id}", response_model=Document)
async def get_status(document_id: str, db = Depends(get_database)):
    try:
        doc = await db["documents"].find_one({"_id": ObjectId(document_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid Document ID")
        
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Convert ObjectId to string for serialization
    doc["_id"] = str(doc["_id"])
        
    return Document(**doc)
