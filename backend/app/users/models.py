from pydantic import BaseModel, EmailStr

class UserOut(BaseModel):
    email : EmailStr
    