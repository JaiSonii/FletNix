from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from app.config import settings
from app.database import db_instance

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    def __init__(self):
        pass

    @property
    def collection(self):
        return db_instance.get_db()["users"]
    
    def verify_password(self, plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        return pwd_context.hash(password)

    def create_token(self, data: dict):
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    async def register_user(self, user_data):
        existing_user = await self.collection.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user_dict = user_data.model_dump()
        user_dict["password"] = self.get_password_hash(user_data.password)
        await self.collection.insert_one(user_dict)
        return self.create_token({"sub": user_dict["email"], "age": user_dict["age"]})

    async def authenticate_user(self, login_data):
        user = await self.collection.find_one({"email": login_data.email})
        if not user or not self.verify_password(login_data.password, user["password"]):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        return self.create_token({"sub": user["email"], "age": user["age"]})