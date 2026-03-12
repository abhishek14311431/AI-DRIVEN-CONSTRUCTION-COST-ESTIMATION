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
    
    # Additional Details Fields
    staircase_type: Optional[Literal["external", "internal"]] = None
    parking_requirement: Optional[Literal["none", "two_wheeler", "car", "both"]] = None
    water_source: Optional[Literal["borewell", "municipal", "both"]] = None
    water_storage: Optional[Literal["overhead_tank", "underground_sump", "both"]] = None
    terrace_usage: Optional[Literal["open_terrace", "utility_terrace", "solar_panel"]] = None
    laundry_area: Optional[bool] = None
    power_backup: Optional[Literal["none", "inverter", "generator"]] = None
    security_system: Optional[Literal["basic_gate", "cctv", "both"]] = None
    lift_required: Optional[bool] = None

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
