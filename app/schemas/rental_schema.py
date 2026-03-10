from pydantic import BaseModel, model_validator
from typing import List, Literal, Optional


class RentalBreakdownItem(BaseModel):
    component: str
    category: str
    amount: float
    percentage: float

class RentalCreate(BaseModel):
    site_type: Literal["half", "full", "double"]
    dimensions: str
    floors: Literal["G+1", "G+2", "G+3", "custom"]
    plan: Literal["Base", "Classic", "Premium"]
    custom_floors: Optional[int] = None

    @model_validator(mode="after")
    def custom_floors_required_when_custom(self):
        if self.floors == "custom" and self.custom_floors is None:
            raise ValueError("custom_floors is required when floors is 'custom'")
        return self

class RentalResponse(BaseModel):
    project_type: str
    site_type: str
    dimensions: str
    floors: str
    unit_type: str
    plan: str
    total_cost: float
    breakdown: List[RentalBreakdownItem]
