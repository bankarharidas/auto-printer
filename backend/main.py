from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

app = FastAPI(
    title="Automatic Document Printing Machine API",
    description="Backend for Smart Print Kiosk",
    version="1.0.0"
)

# Rate Limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
origins = [
    "http://localhost:5173",  # Vite default
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Automatic Document Printing Machine API is running"}

from routers import upload, print as print_router, status, websocket, admin, user, machine

app.include_router(upload.router)
app.include_router(print_router.router)
app.include_router(status.router)
app.include_router(websocket.router)
app.include_router(admin.router)
app.include_router(user.router)
app.include_router(machine.router)

from database import db

@app.on_event("startup")
async def startup_db_client():
    await db.connect()

@app.on_event("shutdown")
async def shutdown_db_client():
    await db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
