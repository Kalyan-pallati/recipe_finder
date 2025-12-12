from fastapi import APIRouter, Depends, HTTPException
from fastapi import File, UploadFile, Form
from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId
from app.database import db
from app.auth.utils import get_current_user
from app.utils.cloudinary import upload_image
import json

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
    return {
        "id": str(doc["_id"]),
        "title": doc["title"],
        "readyInMinutes": doc.get("readyInMinutes"),
        "servings": doc.get("servings"),
        "calories": doc.get("calories"),
        "ingredients": doc.get("ingredients", []),
        "steps": doc.get("steps", []),
        "image": doc.get("image"),
    }


@router.post("/", response_model=MyRecipeOut)
async def create_recipe(
    user: dict = Depends(get_current_user),
    title: str = Form(...),
    readyInMinutes: Optional[int] = Form(None),
    servings: Optional[int] = Form(None),
    calories: Optional[float] = Form(None),
    ingredients: str = Form(...),
    steps: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    user_id = str(user["_id"])

    # Parse ingredient + step JSON
    try:
        ingredients_data = json.loads(ingredients)
        steps_data = json.loads(steps)
    except:
        raise HTTPException(400, "Invalid JSON for ingredients or steps")

    # Upload image to Cloudinary
    image_url = None
    if image:
        contents = await image.read()
        image_url = upload_image(contents)

    # Build recipe object
    recipe = {
        "user_id": user_id,
        "title": title,
        "readyInMinutes": readyInMinutes,
        "servings": servings,
        "calories": calories,
        "ingredients": ingredients_data,
        "steps": steps_data,
        "image": image_url,
    }

    result = db.my_recipes.insert_one(recipe)
    recipe["_id"] = result.inserted_id

    return serialize_recipe(recipe)


@router.get("/community")
async def get_all_recipes(
    page: int = 1,
    per_page: int = 12,
    user: dict = Depends(get_current_user)
):
    collection = db.my_recipes

    total = collection.count_documents({})
    skip = (page - 1) * per_page

    docs = list(collection.find().skip(skip).limit(per_page))
    serialized = [serialize_recipe(d) for d in docs]
    return {
        "results": serialized,
        "toal_results": total,
        "page": page,
        "per_page": per_page
    }


@router.get("/", response_model=List[MyRecipeOut])
async def get_my_recipes(user: dict = Depends(get_current_user)):
    user_id = str(user["_id"])
    docs = list(db.my_recipes.find({"user_id": user_id}))
    return [serialize_recipe(d) for d in docs]


@router.get("/{recipe_id}", response_model=MyRecipeOut)
async def get_one_recipe(recipe_id: str, user: dict = Depends(get_current_user)):
    doc = db.my_recipes.find_one({"_id": ObjectId(recipe_id)})

    if not doc:
        raise HTTPException(404, "Recipe not Found")

    # Community recipes allow viewing by anyone who is logged in
    # If you only want owners to view their recipes, uncomment this:
    # if str(doc["user_id"]) != str(user["_id"]):
    #     raise HTTPException(403, "Not Authorized")

    return serialize_recipe(doc)

@router.delete("/{recipe_id}")
async def delete_recipe(recipe_id: str, user: dict = Depends(get_current_user)):
    doc = db.my_recipes.find_one({"_id": ObjectId(recipe_id)})

    if not doc:
        raise HTTPException(404, "Recipe Not Found")

    if str(doc["user_id"]) != str(user["_id"]):
        raise HTTPException(403, "Not Authorized")

    db.my_recipes.delete_one({"_id": ObjectId(recipe_id)})

    return {"message": "Recipe Deleted"}
