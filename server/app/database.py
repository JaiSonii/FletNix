from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from typing import Optional

class Database:
    client: Optional[AsyncIOMotorClient] = None
    
    def connect(self):
        if self.client is None:
            self.client = AsyncIOMotorClient(settings.MONGO_URI)
            print("Connected to MongoDB")

    def close(self):
        if self.client:
            self.client.close()
            print("Closed MongoDB connection")

    def get_db(self):
        if self.client is None:
            self.connect()
        return self.client[settings.DB_NAME] #type:ignore

db_instance = Database()