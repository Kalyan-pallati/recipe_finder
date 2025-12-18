from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel, EmailStr
import secrets, time
from app.database import db
from app.auth.utils import hash_password, verify_password, create_access_token, send_verification_email, generate_otp

router = APIRouter()

class AuthIn(BaseModel):
    email : EmailStr
    password : str
class AuthRegister(BaseModel):
    email : EmailStr
    username: str
    password : str
    confirm_password : str

class TokenOut(BaseModel):
    access_token : str
    token_type : str = "bearer"

class MessageOut(BaseModel):
    message: str

class OTPVerifyIn(BaseModel):
    email: EmailStr
    otp: str

@router.post("/register", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
async def register(payload: AuthRegister):
    users = db.users
    # pending = db.pending_users

    if users.find_one({"email": payload.email}):
        raise HTTPException(status_code= 400, detail="Email already resgitered")
    
    # if pending.find_one({"email": payload.email}):
    #     raise HTTPException(status_code=400, detail="Verification already Sent")
    
    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    # otp = generate_otp()

    # pending.insert_one({
    #     "email": payload.email,
    #     "username": payload.username,
    #     "hashed_password": hash_password(payload.password),
    #     "otp": otp,
    #     "expires_at": int(time.time()) + 600
    # })
    
    # send_verification_email(payload.email, otp)

    result = users.insert_one({
        "email": payload.email,
        "username": payload.username,
        "hashed_password": hash_password(payload.password),
        "created_at": int(time.time())
    })

    return {
        "message": "Signup Sucessful"
    }

# @router.post("/verify")
# async def verify_email(payload : OTPVerifyIn):
#     users = db.users
#     pending = db.pending_users

#     record = pending.find_one({"email": payload.email, "otp": payload.otp})

#     if not record:
#         raise HTTPException(400, "Invalid or expired verification Link")
    
#     if record["expires_at"] < int(time.time()):
#         pending.delete_one({"_id": record["_id"]})
#         raise HTTPException(400, "Verification Link Expired")
    
#     result = users.insert_one({
#         "email": record["email"],
#         "username": record["username"],
#         "hashed_password": record["hashed_password"],
#         "created_at": int(time.time())
#     })

#     pending.delete_one({"_id": record["_id"]})
#     return {
#         "message": "Email successfully verified. Please Log in"
#     }

@router.post("/login", response_model=TokenOut)
async def login(payload: AuthIn):
    users = db.users
    user = users.find_one({"email": payload.email})

    if not user:
        raise HTTPException(status_code=400, detail="invalid credentials")
    
    if not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="invalid Credentials")
    
    token = create_access_token(
        data={
            "id": str(user["_id"]),
            "email": user["email"],
            "username":user["username"],
        }
    )
    return {"access_token" : token, "token_type" : "bearer"}