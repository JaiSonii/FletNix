from fastapi import APIRouter, Depends
from app.models.auth import UserRegister, UserLogin, Token
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])
auth_service = AuthService()

@router.post("/register", response_model=Token)
async def register(user: UserRegister):
    token = await auth_service.register_user(user)
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    token = await auth_service.authenticate_user(user)
    return {"access_token": token, "token_type": "bearer"}