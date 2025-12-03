# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import db_instance
from app.routers import auth, shows
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    db_instance.connect()
    yield
    db_instance.close()

def create_app() -> FastAPI:
    """
    Application Factory: Creates and configures the FastAPI application.
    """
    application = FastAPI(
        title="FletNix API", 
        version="2.0", 
        lifespan=lifespan,
    )

    origins = [
        "http://localhost:3000",
        "http://localhost:5173",
        settings.FRONTEND_URL

    ]

    application.add_middleware(
        CORSMiddleware,
        allow_origins=origins, # Allows specific origins
        allow_credentials=True, # Allows cookies/auth headers
        allow_methods=["*"],    # Allows all methods (POST, GET, PUT, DELETE)
        allow_headers=["*"],    # Allows all headers
    )

    # Register Routers
    application.include_router(auth.router)
    application.include_router(shows.router)

    # Root endpoint
    @application.get("/")
    def root():
        return {"message": "Welcome to FletNix API. Visit /docs for Swagger UI"}

    return application