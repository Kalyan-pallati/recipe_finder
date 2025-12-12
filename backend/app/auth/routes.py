from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.database import db
from app.auth.utils import hash_password, verify_password, create_access_token

router = APIRouter()

#Input Model for Registration and Login
class AuthIn(BaseModel):
    email : EmailStr
    password : str
class AuthRegister(BaseModel):
    email : EmailStr
    username: str
    password : str
    confirm_password : str

#Response Model for Token
class TokenOut(BaseModel):
    access_token : str
    token_type : str = "bearer"

#Router for Registration
@router.post("/register", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
def register(payload: AuthRegister):
    users = db.users

    if users.find_one({"email": payload.email}):
        raise HTTPException(status_code= 400, detail="Email already resgitered")
    
    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    hashed = hash_password(payload.password)

    new_user = {
        "email": payload.email,
        "username": payload.username,
        "hashed_password":hashed
    }
    result = users.insert_one(new_user)

    token = create_access_token(
        data={
            "id": str(result.inserted_id),
            "email":payload.email,
            "username":payload.username    
        }
    )
    return {"access_token" : token, "token_type" : "bearer"}

#Router for Login
@router.post("/login", response_model=TokenOut)
def login(payload: AuthIn):
    users = db.users
    user = users.find_one({"email": payload.email})

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
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