from pydantic import BaseModel

class RentalCreate(BaseModel):
    floor: str # "G+1", "G+2", "G+3"
    upgrade_level: str # "Base", "Classic", "Premium"
    zone: str # "A", "B", "C"
    include_interior: bool = False

class RentalResponse(BaseModel):
    total_cost: float
    breakdown: dict
