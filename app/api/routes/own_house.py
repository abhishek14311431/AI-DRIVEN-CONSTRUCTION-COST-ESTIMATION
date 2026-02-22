from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.own_house_schema import OwnHouseCreate, OwnHouseResponse, GradeFacilitiesResponse
from app.engines.own_house_engine import OwnHouseEngine
from app.services.project_service import ProjectService
from app.database.session import get_db
from app.core.constants import OWN_HOUSE_GRADE_FACILITIES

router = APIRouter()

@router.get("/grade-facilities", response_model=GradeFacilitiesResponse)
def get_grade_facilities():
    return {"grade_facilities": OWN_HOUSE_GRADE_FACILITIES}

@router.post("/estimate", response_model=OwnHouseResponse)
def estimate_own_house(data: OwnHouseCreate):
    result = OwnHouseEngine.estimate_cost(data.dict())
    return result

@router.post("/save")
def save_own_house(data: OwnHouseCreate, db: Session = Depends(get_db)):
    result = OwnHouseEngine.estimate_cost(data.dict())
    project = ProjectService.save_project(
        db=db,
        project_type="own_house",
        input_json=data.dict(),
        total_cost=result['total_cost'],
        breakdown_json=result['breakdown']
    )
    return {"message": "Project saved", "project_id": project.id}
