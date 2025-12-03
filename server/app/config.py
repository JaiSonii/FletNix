from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URI: str
    DB_NAME: str = "fletnix"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    OMDB_API_KEY: str = ""
    FRONTEND_URL: str = ""

    class Config:
        env_file = ".env"

settings = Settings() #type:ignore