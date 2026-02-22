from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.interior_schema import InteriorCreate, InteriorResponse
from app.engines.interior_engine import InteriorEngine
from app.services.project_service import ProjectService
from app.database.session import get_db

router = APIRouter()

@router.post("/estimate", response_model=InteriorResponse)
def estimate_interior(data: InteriorCreate, db: Session = Depends(get_db)):
    result = InteriorEngine.estimate_cost(data.dict())
    return result

@router.post("/save")
def save_interior(data: InteriorCreate, db: Session = Depends(get_db)):
    result = InteriorEngine.estimate_cost(data.dict())
    project = ProjectService.save_project(
        db=db,
        project_type="interior",
        input_json=data.dict(),
        total_cost=result['total_cost'],
        breakdown_json=result['breakdown']
    )
    return {"message": "Project saved", "project_id": project.id}
