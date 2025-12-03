import httpx
from app.database import db_instance
from app.models.show import ShowModel
from app.config import settings

class ShowService:
    def __init__(self):
        pass

    @property
    def collection(self):
        return db_instance.get_db()["shows"]

    async def fetch_omdb_data(self, title: str):
        if not settings.OMDB_API_KEY:
            return {"rating": "N/A", "reviews": []}
        
        url = f"http://www.omdbapi.com/?t={title}&apikey={settings.OMDB_API_KEY}"
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url)
                data = resp.json()
                if data.get("Response") == "True":
                    return {
                        "imdb_rating": data.get("imdbRating", "N/A"),
                        "reviews": [{"source": r["Source"], "value": r["Value"]} for r in data.get("Ratings", [])]
                    }
            except:
                pass
        return {"imdb_rating": "N/A", "reviews": []}

    async def get_paginated_shows(self, page, limit, type_filter, search_query, user_age):
        query = {}

        # Age Restriction Logic
        if user_age < 18:
            query["rating"] = {"$nin": ["R", "NC-17", "TV-MA"]}

        # Filters
        if type_filter:
            query["type"] = type_filter

        # Search
        if search_query:
            regex = {"$regex": search_query, "$options": "i"}
            query["$or"] = [{"title": regex}, {"cast": regex}]

        skip = (page - 1) * limit
        total_count = await self.collection.count_documents(query)
        cursor = self.collection.find(query).skip(skip).limit(limit)
        shows = await cursor.to_list(length=limit)
        return total_count//limit + 1, [ShowModel(**s) for s in shows]

    async def get_show_details(self, show_id: str, user_age: int):
        show = await self.collection.find_one({"show_id": show_id})
        if not show:
            return None
        
        show_model = ShowModel(**show)
        
        # Recommendations Logic
        recommendations = []
        if show_model.listed_in:
            genres = [g.strip() for g in show_model.listed_in.split(",")]
            rec_query = {
                "listed_in": {"$regex": "|".join(genres), "$options": "i"},
                "show_id": {"$ne": show_model.show_id}
            }
            if user_age < 18:
                rec_query["rating"] = {"$nin": ["R", "NC-17", "TV-MA"]} # type: ignore
                
            rec_cursor = self.collection.find(rec_query).limit(5)
            rec_data = await rec_cursor.to_list(length=5)
            recommendations = [ShowModel(**s) for s in rec_data]

        return show_model, recommendations