from pydantic import BaseModel
from typing import List, Optional

class BreakdownItem(BaseModel):
    component: str
    amount: float
    percentage: float
    category: str

class RentalCreate(BaseModel):
    site_type: str  # "Half Site", "Full Site", "Double Site"
    dimensions: str  # e.g., "20x40", "30x50", etc.
    floors: str  # "G+1", "G+2", "G+3", or custom floor count as string "G+4", "G+5", etc.
    plan: str  # "Base", "Classic", "Premium"
    zone: Optional[str] = "B"  # "A", "B", "C" - optional, defaults to B

class RentalResponse(BaseModel):
    project_type: str = "Rental Homes"
    site_type: str
    dimensions: str
    floors: str
    unit_type: str
    bedrooms: int
    bathrooms: int
    plan: str
    semi_interior: bool = True
    external_staircase: bool = True
    total_cost: float
    breakdown: List[BreakdownItem]
