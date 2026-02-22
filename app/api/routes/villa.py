from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.villa_schema import VillaCreate, VillaResponse
from app.engines.villa_engine import VillaEngine
from app.services.project_service import ProjectService
from app.database.session import get_db

router = APIRouter()

@router.post("/estimate", response_model=VillaResponse)
def estimate_villa(data: VillaCreate, db: Session = Depends(get_db)):
    result = VillaEngine.estimate_cost(data.dict())
    return result

@router.post("/save")
def save_villa(data: VillaCreate, db: Session = Depends(get_db)):
    result = VillaEngine.estimate_cost(data.dict())
    project = ProjectService.save_project(
        db=db,
        project_type="villa",
        input_json=data.dict(),
        total_cost=result['total_cost'],
        breakdown_json=result['breakdown']
    )
    return {"message": "Project saved", "project_id": project.id}
