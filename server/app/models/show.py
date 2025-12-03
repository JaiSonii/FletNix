from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, List, Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

class ShowModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    show_id: str
    type: str
    title: str
    director: Optional[str] = ""
    cast: Optional[str] = ""
    country: Optional[str] = ""
    date_added: Optional[str] = ""
    release_year: int
    rating: Optional[str] = ""
    duration: Optional[str] = ""
    listed_in: str
    description: str

class ShowResponse(ShowModel):
    imdb_rating: Optional[str] = "N/A"
    reviews: List[dict] = []
    recommendations: List[ShowModel] = []