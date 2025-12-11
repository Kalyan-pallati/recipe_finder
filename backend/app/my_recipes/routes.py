from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId
from app.database import db
from app.auth.utils import get_current_user

router = APIRouter()


class Ingredient(BaseModel):
    name: str
    amount: Optional[str] = None

class Step(BaseModel):
    step: str

class MyRecipeIn(BaseModel):
    title: str
    readyInMinutes: Optional[int] = None
    servings: Optional[int] = None
    calories: Optional[float] = None
    ingredients: List[Ingredient]
    steps: List[Step]
    image: Optional[str] = None
    description: Optional[str] = ""

class MyRecipeOut(MyRecipeIn):
    id: str

def serialize_recipe(doc):
    return{
        "id": str(doc["_id"]),
        "title": doc["title"],
        "readyInMinutes": doc.get("readyInMinutes"),
        "servings": doc.get("servings"),
        "calories":doc.get("calories"),
        "ingredients": doc.get("ingredients", []),
        "steps": doc.get("steps", []),
        "image": doc.get("image"),
        # "description": doc.get("description", ""),
    }

@router.get("/", response_model=List[MyRecipeOut])
async def get_my_recipes(user: dict = Depends(get_current_user)):
    user_id = str(user["_id"])

    docs = list(db.my_recipes.find({"user_id": user_id}))
    return [serialize_recipe(d) for d in docs]

@router.post("/", response_model=MyRecipeOut)
async def create_recipe(payload: MyRecipeIn, user: dict = Depends(get_current_user)):
    user_id = str(user["_id"])

    recipe = {
        "user_id": user_id,
        "title": payload.title,
        "readyInMinutes": payload.readyInMinutes,
        "servings": payload.servings,
        "calories": payload.calories,
        "ingredients": [i.model_dump() for i in payload.ingredients],
        "steps": [s.model_dump() for s in payload.steps],
        "image": payload.image,
        # "description": payload.description,
    }

    result = db.my_recipes.insert_one(recipe)

    recipe["_id"] = result.inserted_id
    return serialize_recipe(recipe)

@router.get("/{recipe_id}", response_model=MyRecipeOut)
async def get_one_recipe(recipe_id: str, user : dict = Depends(get_current_user)):
    doc = db.my_recipes.find_one({"_id": ObjectId(recipe_id)})

    if not doc:
        raise HTTPException(404, "Recipe not Found")
    
    if str(doc["user_id"]) != str(user["_id"]):
        raise HTTPException(403, "Not Authorized")
    
    return serialize_recipe(doc)

@router.delete("/{recipe_id}")
async def delete_recipe(recipe_id: str, user: dict = Depends(get_current_user)):
    doc = db.my_recipes.find_one({"_id" : ObjectId(recipe_id)})

    if not doc:
        raise HTTPException(404, "Recipe Not Found")
    
    if str(doc["user_id"]) != str(user["_id"]):
        raise HTTPException(403, "Not Authorized")
    
    db.my_recipes.delete_one({"_id" : ObjectId(recipe_id)})

    return {"message": "Recipe Deleted"}

