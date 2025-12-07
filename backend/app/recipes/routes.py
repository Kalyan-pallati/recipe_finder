# app/recipes/routes.py
from fastapi import APIRouter, Query, HTTPException
import os
import httpx
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()
API_KEY = os.getenv("SPOONACULAR_API_KEY") or os.getenv("SPOONACULAR_KEY")

BASE_URL = "https://api.spoonacular.com"


@router.get("/search")
async def search_recipes(q: str = Query(..., min_length=1), page: int = 1, per_page: int = 12):
    """
    Search recipes using Spoonacular complexSearch.
    Query params:
      - q (required) : search query
      - page (optional): page number (1-based)
      - per_page (optional): number of items per page
    """
    if not API_KEY:
        raise HTTPException(status_code=500, detail="Spoonacular API key not configured on server")

    offset = (page - 1) * per_page
    params = {
        "query": q,
        "number": per_page,
        "offset": offset,
        "apiKey": API_KEY,
        "nutrition": True,
        "addRecipeInformation": True,
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(f"{BASE_URL}/recipes/complexSearch", params=params)

    if resp.status_code != 200:
        # try to return Spoonacular's error if available
        try:
            body = resp.json()
        except Exception:
            body = {"detail": "Spoonacular returned status " + str(resp.status_code)}
        raise HTTPException(status_code=502, detail=body)

    data = resp.json()
    results = []
    for item in data.get("results", []):
        results.append({
            "id": item.get("id"),
            "title": item.get("title"),
            "image": item.get("image", ""),
            "sourceUrl": item.get("sourceUrl", ""),
            "readyInMinutes": item.get("readyInMinutes"),
            "calories": item.get("nutrition", {}).get("nutrients", [{}])[0].get("amount", None),
        })

    return {
        "query": q,
        "page": page,
        "per_page": per_page,
        "total_results": data.get("totalResults", 0),
        "results": results
    }
