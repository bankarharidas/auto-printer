from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/status")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive or listen for client messages (if any)
            data = await websocket.receive_text()
            # Echo or process if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Helper to be used by other modules to push updates
async def push_status_update(document_id: str, status: str):
    import json
    message = json.dumps({"document_id": document_id, "status": status})
    await manager.broadcast(message)
