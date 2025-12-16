import time
from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional
import os
import httpx
from dotenv import load_dotenv

from app.database import db
from app.auth.utils import get_current_user
from pydantic import BaseModel, Field

load_dotenv()

router = APIRouter()

API_KEY = os.getenv("SPOONACULAR_API_KEY") or os.getenv("SPOONACULAR_KEY")
BASE_URL = "https://api.spoonacular.com"

# -----------------------------
# MODELS
# -----------------------------

class SaveRecipeIn(BaseModel):
    recipe_id: str
    title: str
    image: Optional[str] = None
    readyInMinutes: Optional[int] = None
    calories: Optional[float] = None
    source_type: str = Field(..., pattern="^(spoonacular|community)$")


# -----------------------------
# PUBLIC ROUTES
# -----------------------------

@router.get("/search")
async def search_recipes(
    q: str = Query(..., min_length=1),
    page: int = 1,
    per_page: int = 12,
    cuisine: Optional[str] = None,
    diet: Optional[str] = None,
    intolerances: Optional[str] = None,
    maxReadyTime: Optional[int] = None,
    includeIngredients: Optional[str] = None,
    excludeIngredients: Optional[str] = None,
    sort: Optional[str] = None,
    sortDirection: Optional[str] = None,
    minCalories: Optional[int] = None,
    maxCalories: Optional[int] = None,
):
    if not API_KEY:
        raise HTTPException(500, "Missing Spoonacular API Key")

    offset = (page - 1) * per_page

    params = {
        "query": q,
        "number": per_page,
        "offset": offset,
        "apiKey": API_KEY,
        "addRecipeInformation": True,
        "addRecipeNutrition": True,
    }

    if cuisine: params["cuisine"] = cuisine
    if diet: params["diet"] = diet
    if intolerances: params["intolerances"] = intolerances
    if maxReadyTime: params["maxReadyTime"] = maxReadyTime
    if includeIngredients: params["includeIngredients"] = includeIngredients
    if excludeIngredients: params["excludeIngredients"] = excludeIngredients
    if sort: params["sort"] = sort
    if sortDirection: params["sortDirection"] = sortDirection

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(f"{BASE_URL}/recipes/complexSearch", params=params)

    if resp.status_code != 200:
        raise HTTPException(502, resp.json())

    data = resp.json()
    results = []

    for item in data.get("results", []):
        calories = None
        for n in item.get("nutrition", {}).get("nutrients", []):
            if n.get("name", "").lower() == "calories":
                calories = n.get("amount")
                break

        results.append({
            "id": item.get("id"),
            "title": item.get("title"),
            "image": item.get("image"),
            "sourceUrl": item.get("sourceUrl"),
            "readyInMinutes": item.get("readyInMinutes"),
            "calories": calories,
        })

    # manual calorie filtering
    if minCalories is not None or maxCalories is not None:
        filtered = []
        for r in results:
            c = r.get("calories")
            if c is None: 
                continue
            if minCalories is not None and c < minCalories:
                continue
            if maxCalories is not None and c > maxCalories:
                continue
            filtered.append(r)
        results = filtered

    return {
        "query": q,
        "page": page,
        "per_page": per_page,
        "total_results": data.get("totalResults", 0),
        "results": results
    }


# -----------------------------
# USER SAVED RECIPES ROUTES
# -----------------------------

@router.get("/saved")
async def get_saved_recipes(
    page: int = 1,
    per_page: int = 12,
    user: dict = Depends(get_current_user)
    ):
    user_id = str(user["_id"])
    collection = db.saved_recipes

    total = collection.count_documents({"user_id": user_id})
    
    skip = (page - 1) * per_page

    saved_items = list(db.saved_recipes.find(
        {"user_id": user_id},
        {"_id": 0}
        )
        .skip(skip)
        .limit(per_page)
        )
    return {
        "page": page,
        "per_page": per_page,
        "total_results": total,
        "results": saved_items
    }

@router.get("/saved_recipes")
async def saved_recipes(user: dict = Depends(get_current_user)):
    user_id = str(user["_id"])
    collection = db.saved_recipes

    saved_ids_cursor = collection.find(
        {"user_id": user_id}, 
        {"_id": 0, "recipe_id": 1})

    saved_ids = [item["recipe_id"] for item in saved_ids_cursor]

    return {"saved_ids": saved_ids}


@router.get("/is-saved/{recipe_id}")
async def is_recipe_saved(
    recipe_id: int,
    user: dict = Depends(get_current_user)
):
    user_id = str(user["_id"])
    exists = db.saved_recipes.find_one({
        "user_id": user_id,
        "recipe_id": recipe_id
    })
    return {"saved": bool(exists)}


@router.post("/save")
async def save_recipe(
    payload: SaveRecipeIn,
    user: dict = Depends(get_current_user)
):
    user_id = str(user["_id"])
    saved_collection = db.saved_recipes

    if saved_collection.find_one({"user_id": user_id, "recipe_id": payload.recipe_id,"source_type":payload.source_type}):
        return {"message": "Recipe already saved"}

    saved_collection.insert_one({
        "user_id": user_id,
        "timestamp": int(time.time()),
        **payload.model_dump()
    })

    return {"message": "Recipe saved successfully"}


@router.delete("/unsave/{recipe_id}")
async def unsave_recipe(
    recipe_id: str,
    source_type: str = Query(..., pattern="^(spoonacular|community)$"),
    user: dict = Depends(get_current_user)
):
    user_id = str(user["_id"])
    saved_collection = db.saved_recipes

    result = saved_collection.delete_one({
        "user_id": user_id,
        "recipe_id": recipe_id,
        "source_type": source_type
    })

    if result.deleted_count == 0:
        return {"message": "Recipe was not saved"}

    return {"message": "Recipe removed from saved"}


# -----------------------------
# PUBLIC RECIPE DETAILS ROUTE
# MUST ALWAYS BE LAST
# -----------------------------

@router.get("/{recipe_id}")
async def get_recipe_details(recipe_id: int):
    if not API_KEY:
        raise HTTPException(500, "Missing Spoonacular API Key")

    url = f"{BASE_URL}/recipes/{recipe_id}/information"
    params = {"apiKey": API_KEY, "includeNutrition": True}

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url, params=params)

    if resp.status_code != 200:
        raise HTTPException(resp.status_code, "Recipe not found")

    data = resp.json()
    recipe = {
        "id": data.get("id"),
        "title": data.get("title"),
        "image": data.get("image"),
        "summary": data.get("summary"),
        "sourceUrl": data.get("sourceUrl"),
        "readyInMinutes": data.get("readyInMinutes"),
        "servings": data.get("servings"),
        "ingredients": [
            {
                "id": ing.get("id"),
                "name": ing.get("name"),
                "amount": ing.get("amount"),
                "unit": ing.get("unit"),
            }
            for ing in data.get("extendedIngredients", [])
        ],
        "instructions": data.get("instructions"),
        "nutrition": data.get("nutrition", {}).get("nutrients", []),
    }

    return recipe
