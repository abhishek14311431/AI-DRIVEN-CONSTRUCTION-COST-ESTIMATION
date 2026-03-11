from typing import List
from pydantic import BaseModel


class ExteriorBreakdownItem(BaseModel):
    component: str
    category: str
    amount: float
    percentage: float

class ExteriorCreate(BaseModel):
    total_sqft: float = 1200
    style: str = "modern"
    include_compound_wall: bool = True
    include_waterproofing: bool = True
    include_gate: bool = True
    include_elevation: bool = True
    include_landscaping: bool = False

class ExteriorResponse(BaseModel):
    total_cost: float
    breakdown: List[ExteriorBreakdownItem]
