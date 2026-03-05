from pydantic import BaseModel

class ExteriorCreate(BaseModel):
    include_compound_wall: bool = True
    include_waterproofing: bool = True
    include_gate: bool = True
    include_elevation: bool = True

class ExteriorResponse(BaseModel):
    total_cost: float
    breakdown: dict
