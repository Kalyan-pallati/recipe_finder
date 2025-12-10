from passlib.context import CryptContext
from jose import jwt
import time
import os
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from app.database import db

SECRET = os.getenv("SECRET_KEY", "default_secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 3600  # 1 hour

pwd_ctx = CryptContext(schemes=["argon2"], deprecated="auto")

auth_scheme = HTTPBearer()

def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_ctx.verify(plain_password, hashed_password)

def create_access_token(email: str) -> str:
    now = int(time.time())
    payload = {
        "sub" : email,
        "iat" : now,
        "exp" : now + ACCESS_TOKEN_EXPIRE_SECONDS
    }
    token = jwt.encode(payload, SECRET, algorithm=ALGORITHM)
    return token

def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET, algorithms=[ALGORITHM])

def get_current_user(credentials = Depends(auth_scheme)):
    token = credentials.credentials

    try:
        payload = decode_token(token)
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid Token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or Expired Token")
    
    users = db.users
    user = users.find_one({"email" : email})

    if not user:
        raise HTTPException(status_code=404, detail="User Not Found")
    
    return user