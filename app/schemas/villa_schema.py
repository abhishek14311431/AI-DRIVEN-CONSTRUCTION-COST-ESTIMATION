from pydantic import BaseModel

class VillaCreate(BaseModel):
    floor: str # "G+1", "G+2"
    upgrade_level: str # "Classic", "Premium", "Luxury"
    zone: str # "A", "B", "C"

class VillaResponse(BaseModel):
    total_cost: float
    breakdown: dict
