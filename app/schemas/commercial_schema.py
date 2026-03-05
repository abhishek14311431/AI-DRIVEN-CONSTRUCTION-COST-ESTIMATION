from pydantic import BaseModel

class CommercialCreate(BaseModel):
    total_sqft: float
    floors: int
    zone: str # "A", "B", "C"
    lift_required: bool = False

class CommercialResponse(BaseModel):
    total_cost: float
    breakdown: dict
