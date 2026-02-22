from pydantic import BaseModel
from typing import Dict, List, Any

class OwnHouseCreate(BaseModel):
    floor: str # "G+1", "G+2", "G+3"
    bedrooms: int
    structural_style: str # "Base", "Classic", "Premium", "Elite"
    dimensions: str # "30x40", "40x60", etc.
    zone: str = "B" # "A", "B", "C"
    lift_required: bool = False
    interior_package: str = "none" # "none", "base", "semi", "full_furnished"
    include_compound_wall: bool = False
    include_rainwater_harvesting: bool = False
    include_car_parking: bool = False

class OwnHouseResponse(BaseModel):
    project_summary: Dict[str, Any]
    total_cost: float
    breakdown: List[Dict[str, Any]]


class FacilityItem(BaseModel):
    category: str
    specification: str
    materials: str
    recommended_brands: List[str] = []


class GradeFacilityDetail(BaseModel):
    overview: str
    facilities: List[FacilityItem]


class GradeFacilitiesResponse(BaseModel):
    grade_facilities: Dict[str, GradeFacilityDetail]
