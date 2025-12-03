from fastapi import APIRouter, Depends, Query, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from jose import jwt
from app.config import settings
from app.database import db_instance
from app.models.show import ShowResponse
from app.services.show_service import ShowService

router = APIRouter(prefix="/shows", tags=["Shows"])
service = ShowService()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Dependency to get current user
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        # We only strictly need the age for logic, but verify user exists
        email = payload.get("sub")
        user = await db_instance.get_db()["users"].find_one({"email": email})
        if not user:
             raise HTTPException(status_code=401, detail="User not found")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/", response_model=dict)
async def get_shows_list(
    page: int = 1,
    limit: int = 15,
    type_filter: Optional[str] = None,
    search_query: Optional[str] = None,
    user: dict = Depends(get_current_user)
):
    total, shows = await service.get_paginated_shows(page, limit, type_filter, search_query, user["age"])
    return {"page": page, "total_pages": total, "data": shows}

@router.get("/{show_id}", response_model=ShowResponse)
async def get_show_detail(show_id: str, user: dict = Depends(get_current_user)):
    result = await service.get_show_details(show_id, user["age"])
    if not result:
        raise HTTPException(status_code=404, detail="Show not found")
    
    show_model, recommendations = result
    external_data = await service.fetch_omdb_data(show_model.title)
    
    return ShowResponse(
        **show_model.model_dump(),
        imdb_rating=external_data["imdb_rating"],
        reviews=external_data["reviews"],
        recommendations=recommendations
    )