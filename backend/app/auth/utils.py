from passlib.context import CryptContext
from jose import jwt
import time
import os
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from app.database import db
from bson import ObjectId
from email.message import EmailMessage
import smtplib
import random
import string

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587

SMTP_EMAIL = "pallatikalyansai@gmail.com"
SMTP_PASSWORD = "cwcr ybqq vpco llwt"

SECRET = os.getenv("SECRET_KEY", "default_secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 3600  # 1 hour

pwd_ctx = CryptContext(schemes=["argon2"], deprecated="auto")

auth_scheme = HTTPBearer()

def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_ctx.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    now = int(time.time())
    payload = {
        **data,
        "iat": now,
        "exp": now + ACCESS_TOKEN_EXPIRE_SECONDS
    }
    token = jwt.encode(payload, SECRET, algorithm=ALGORITHM)
    return token

def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET, algorithms=[ALGORITHM])

def generate_otp() -> str:
    return "".join(random.choices(string.digits, k=6))

def get_current_user(credentials = Depends(auth_scheme)):
    token = credentials.credentials

    try:
        payload = decode_token(token)
        user_id = payload.get("id")
        email = payload.get("email")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    if not user_id or not email:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

def send_verification_email(to_email: str, otp: str):

    msg = EmailMessage()
    msg["Subject"] = "Verification Code"
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email

    msg.set_content(f"""
Hi,
                    
Thanks for signing up!
                    
You can find your verification otp below:
                
{otp}

This link will expire in 10 minutes,

If you didn't create this account, ignore this email
                    """)
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.send_message(msg)
