from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError
from app.auth.utils import decode_token
from app.database import db
from app.users.models import UserOut
from fastapi.security import HTTPBearer

router = APIRouter()

auth_scheme = HTTPBearer()

def get_current_user(token_data = Depends(auth_scheme)):

    token = token_data.credentials

    try:
        payload = decode_token(token)
        email = payload.get("sub")
    except:
        raise HTTPException(
            status_code = 401,
            detail = "Invalid or expired token")
    
    users = db.users
    user = users.find_one({"email" : email})

    if not user:
        raise HTTPException(
            status_code = 404,
            detail = "User not found")
    return {"email" : user["email"]}

@router.get("/me", response_model=UserOut)
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user 