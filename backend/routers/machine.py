from fastapi import APIRouter, HTTPException, status
from typing import List
from models import Machine
from database import db

router = APIRouter(
    prefix="/machine",
    tags=["machine"]
)

@router.post("/", response_model=Machine, status_code=status.HTTP_201_CREATED)
async def create_machine(machine: Machine):
    # In a real app, check if ID exists
    # await db.machines.insert_one(machine.dict(by_alias=True))
    # For now, we'll just mock it or assume it's stored
    return machine

@router.get("/{machine_id}/qr-url")
async def get_qr_url(machine_id: str):
    # In a real app, verify machine_id exists
    # machine = await db.machines.find_one({"_id": machine_id})
    # if not machine:
    #     raise HTTPException(status_code=404, detail="Machine not found")
    
    # Construct the URL for the frontend upload page
    # Assuming the frontend is served at the same origin or configured
    # For local dev, it might be http://localhost:5173/upload?machine_id=...
    # We'll return a relative URL or a constructed one based on configuration
    return {"url": f"/upload?machine_id={machine_id}"}
