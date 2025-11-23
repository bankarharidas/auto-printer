from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt
from database import get_database
from models import AdminUser, PrintStatus
import os

router = APIRouter(prefix="/admin", tags=["admin"])

# Security Config
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="admin/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Mock Admin User (In real app, store in DB)
# Username: admin, Password: password
MOCK_ADMIN_DB = {
    "admin": "$2b$12$MvfGV7cPUzU.tAx1laNN1u.8v5sGT3qzip1mPPKvwhpKVUPpaA56m" 
}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    if username not in MOCK_ADMIN_DB:
        raise credentials_exception
    return username

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_password_hash = MOCK_ADMIN_DB.get(form_data.username)
    if not user_password_hash or not verify_password(form_data.password, user_password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/stats")
async def get_stats(current_user: str = Depends(get_current_user), db = Depends(get_database)):
    total_docs = await db["documents"].count_documents({})
    completed_docs = await db["documents"].count_documents({"status": PrintStatus.COMPLETED})
    failed_docs = await db["documents"].count_documents({"status": PrintStatus.FAILED})
    
    # Get recent documents
    cursor = db["documents"].find().sort("upload_time", -1).limit(10)
    recent_docs = await cursor.to_list(length=10)
    
    # Convert ObjectId to str for JSON response
    for doc in recent_docs:
        doc["_id"] = str(doc["_id"])

    return {
        "total_documents": total_docs,
        "completed_prints": completed_docs,
        "failed_prints": failed_docs,
        "recent_documents": recent_docs
    }
