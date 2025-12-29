from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from app.auth.utils import get_current_user
from database import db
from bson import ObjectId
import time

class ReviewCreate(BaseModel):
    recipe_id: str
    source_type: str = Field(..., pattern="^(community|spoonacular)$")
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = Field(None, max_length=100)

class ReviewOut(BaseModel):
    id: str
    user_id: str
    recipe_id: str
    source_type: str
    rating: Optional[str]
    created_at: int

router = APIRouter()

@router.post("/", status_code=201)
async def create_review(
    payload: ReviewCreate,
    user: dict = Depends(get_current_user)
):
    user_id = str(user["_id"])

    if(payload.source_type == "community"):
        if not db.my_recipes.find_one({"_id": ObjectId(payload.recipe_id)}):
            raise HTTPException(404, "Recipe Not Found")
    
    review = {
        "recipe_id": payload.recipe_id,
        "source_type": payload.source_type,
        "user_id": user_id,
        "rating": payload.rating,
        "comment": payload.comment,
        "created_at": int(time.time()),
        "updated_at": int(time.time()),
    }
    try:
        result = db.recipe_reviews.insert_one(review)
    except:
        raise HTTPException(400, "You have already reviewed this recipe")
    
    review["_id"] = str(result.inserted_id)
    return review

@router.get("/")
async def get_reviews(
    recipe_id: str,
    source_type: str,
    page: int = 1,
    per_page: int = 10,
):
    skip = (page - 1) * per_page

    cursor = db.recipe_reviews.find({
        "recipe_id": recipe_id, "source_type": source_type
    }).sort("created_at", -1).skip(skip).limit(per_page)

    reviews = []
    for r in cursor:
        r["_id"] = str(r["_id"])
        reviews.append(r)
    
    total = db.recipe_reviews.count_documents(
        {"recipe_id": recipe_id, "source_type": source_type}
    )
    return {
        "results": reviews,
        "total": total,
        "page": page,
        "per_page": per_page
    }