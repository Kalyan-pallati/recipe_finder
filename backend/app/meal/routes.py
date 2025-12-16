from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.database import db
from app.auth.utils import get_current_user
from pydantic import BaseModel, Field
from typing import Optional, List
import time
from bson import ObjectId

class MealPlanIn(BaseModel):
    source_id: str
    source_type: str = Field(..., pattern="^(spoonacular|community)$")
    date: str = Field(..., description="Date of the meal (format YYYY-MM-DD)")
    meal_type: str = Field(..., description="Time slot: breakfast, lunch, dinner, snack, etc.")
    title: str
    image: Optional[str] = None

class MealPlanOut(MealPlanIn):
    id: str = Field(..., alias="_id")

class MealPlanUpdate(BaseModel):
    date: Optional[str] = None
    meal_type: Optional[str] = None

router = APIRouter()

@router.post("/", response_model=MealPlanOut, status_code=status.HTTP_201_CREATED)
async def create_meal_plan(
    payload: MealPlanIn,
    user: dict = Depends(get_current_user)
):
    user_id = str(user["_id"])

    meal_doc = payload.model_dump()
    meal_doc["user_id"] = user_id
    meal_doc["created_at"] = int(time.time())

    if db.meal_plans.find_one({
        "user_id": user_id,
        "date": payload.date,
        "meal_type": payload.meal_type
    }):
        raise HTTPException(status_code=400,detail="Meal slot Already booked for this date and time")
    
    result = db.meal_plans.insert_one(meal_doc)

    created_meal = db.meal_plans.find_one({"_id": result.inserted_id})

    if not created_meal:
        raise HTTPException(status_code=500, detail="Failed to retrieve created meal")
    
    created_meal["_id"] = str(created_meal["_id"])
    
    return created_meal

@router.get("/", response_model=List[MealPlanOut])
async def get_meal_plan(
    start_date: str = Query(..., description="Start Date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End Date (YYYY-MM-DD)"),
    user: dict = Depends(get_current_user)
):
    user_id = str(user["_id"])

    query = {
        "user_id": user_id,
        "date" : {
            "$gte": start_date,
            "$lte": end_date
        }
    }
    meal_plans = db.meal_plans.find(query).sort("date", 1)
    meal_plan = list(meal_plans)

    for meal in meal_plan:
        if meal.get("_id"):
            meal["_id"] = str(meal["_id"])

    return meal_plan

@router.delete("/{meal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_meal_plan(
    meal_id: str,
    user: dict = Depends(get_current_user)
    ):
    user_id = str(user["_id"])

    if not ObjectId.is_valid(meal_id):
        raise HTTPException(status_code=400, detail="Invalid meal Format ID")
    
    result = db.meal_plans.delete_one({
        "_id": ObjectId(meal_id),
        "user_id": user_id
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404,detail="Meal plan entry not found")
    
    return

@router.patch("/{meal_id}", response_model=MealPlanOut)
async def update_meal_plan(
    meal_id: str,
    payload: MealPlanUpdate,
    user: dict = Depends(get_current_user)
):
    user_id = str(user["_id"])

    if not ObjectId.is_valid(meal_id):
        raise HTTPException(status_code=400, detail="Invalid meal ID Format")
    
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided")
    
    result = db.meal_plans.update_one(
        {
            "_id": ObjectId(meal_id),
            "user_id": user_id
        },
        {"$set": update_data}
    )
    if result.modified_count == 0:
        if db.meal_plans.find_one({"_id": ObjectId(meal_id)}):
            raise HTTPException(status_code=400, detail="Meal entry found but no new data provided")
        else:
            raise HTTPException(status_code=404, detail="Meal plan entry not found")
        
    updated_meal = db.meal_plans.find_one({"_id": ObjectId(meal_id)})
    return updated_meal
