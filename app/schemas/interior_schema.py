from typing import List, Literal
from pydantic import BaseModel


class InteriorBreakdownItem(BaseModel):
    component: str
    category: str
    amount: float
    percentage: float

class InteriorCreate(BaseModel):
    total_sqft: float
    style: str
    finish_level: Literal["budget", "standard", "premium"] = "standard"
    include_false_ceiling: bool = True
    include_modular_kitchen: bool = True
    include_wardrobes: bool = True

class InteriorResponse(BaseModel):
    total_cost: float
    breakdown: List[InteriorBreakdownItem]
