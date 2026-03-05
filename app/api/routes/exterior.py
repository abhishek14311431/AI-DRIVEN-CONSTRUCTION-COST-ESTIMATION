from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.exterior_schema import ExteriorCreate, ExteriorResponse
from app.engines.exterior_engine import ExteriorEngine
from app.services.project_service import ProjectService
from app.database.session import get_db

router = APIRouter()

@router.post("/estimate", response_model=ExteriorResponse)
def estimate_exterior(data: ExteriorCreate):
    try:
        result = ExteriorEngine.estimate_cost(data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save")
def save_exterior(data: ExteriorCreate, db: Session = Depends(get_db)):
    result = ExteriorEngine.estimate_cost(data.dict())
    project = ProjectService.save_project(
        db=db,
        project_type="exterior",
        input_json=data.dict(),
        total_cost=result['total_cost'],
        breakdown_json=result['breakdown']
    )
    return {"message": "Project saved", "project_id": project.id}
