from pydantic import BaseModel

class InteriorCreate(BaseModel):
    total_sqft: float
    style: str # "Base", "Semi", "Full", "Luxury"

class InteriorResponse(BaseModel):
    total_cost: float
    breakdown: dict
