from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.routes import router as auth_router
from app.users.routes import router as users_router
from app.recipes.routes import router as recipes_router
from app.my_recipes.routes import router as my_recipes_router

app = FastAPI(title="Recipe Finder - Backend API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])

app.include_router(users_router, prefix="/api/users", tags=["users"])

app.include_router(recipes_router, prefix="/api/recipes", tags=["recipes"])

app.include_router(my_recipes_router, prefix="/api/my-recipes", tags=["my-recipes"])

@app.get("/")
def read_root():
    return {"status": "ok", "msg" : "Recipe Finder Backend API is running."}