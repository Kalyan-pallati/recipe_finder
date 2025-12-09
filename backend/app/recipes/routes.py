# app/recipes/routes.py

from fastapi import APIRouter, Query, HTTPException
import os
import httpx
from dotenv import load_dotenv
from typing import Optional

load_dotenv()
router = APIRouter()
API_KEY = os.getenv("SPOONACULAR_API_KEY") or os.getenv("SPOONACULAR_KEY")

BASE_URL = "https://api.spoonacular.com"


@router.get("/search")
async def search_recipes(
    q: str = Query(..., min_length=1),
    page: int = 1,
    per_page: int = 12,

    # FILTERS
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
        raise HTTPException(
            status_code=500,
            detail="Spoonacular API key not configured on server"
        )

    offset = (page - 1) * per_page

    # Base params sent to Spoonacular
    params = {
        "query": q,
        "number": per_page,
        "offset": offset,
        "apiKey": API_KEY,
        "addRecipeInformation": True,
        "nutrition": True,
    }

    # Add filters
    if cuisine:
        params["cuisine"] = cuisine

    if diet:
        params["diet"] = diet

    if intolerances:
        params["intolerances"] = intolerances

    if maxReadyTime:
        params["maxReadyTime"] = maxReadyTime

    if includeIngredients:
        params["includeIngredients"] = includeIngredients

    if excludeIngredients:
        params["excludeIngredients"] = excludeIngredients

    if sort:
        params["sort"] = sort

    if sortDirection:
        params["sortDirection"] = sortDirection

    # Call Spoonacular API
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(f"{BASE_URL}/recipes/complexSearch", params=params)

    if resp.status_code != 200:
        try:
            detail = resp.json()
        except:
            detail = {"error": f"Spoonacular returned {resp.status_code}"}

        raise HTTPException(status_code=502, detail=detail)

    data = resp.json()

    # Extract formatted results
    results = []
    for item in data.get("results", []):
        calories = None
        nutrients = item.get("nutrition", {}).get("nutrients", [])
        if nutrients:
            for n in nutrients:
                if n.get("name", "").lower() == "calories":
                    calories = n.get("amount")
                    break

        results.append({
            "id": item.get("id"),
            "title": item.get("title"),
            "image": item.get("image", ""),
            "sourceUrl": item.get("sourceUrl", ""),
            "readyInMinutes": item.get("readyInMinutes"),
            "calories": calories,
        })

    # Manual calorie filtering
    if minCalories is not None or maxCalories is not None:
        filtered = []
        for recipe in results:
            cal = recipe.get("calories")
            if cal is None:
                continue

            if minCalories is not None and cal < minCalories:
                continue

            if maxCalories is not None and cal > maxCalories:
                continue

            filtered.append(recipe)

        results = filtered

    return {
        "query": q,
        "page": page,
        "per_page": per_page,
        "total_results": data.get("totalResults", 0),
        "results": results
    }
