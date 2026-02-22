from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.commercial_schema import CommercialCreate, CommercialResponse
from app.engines.commercial_engine import CommercialEngine
from app.services.project_service import ProjectService
from app.database.session import get_db

router = APIRouter()

@router.post("/estimate", response_model=CommercialResponse)
def estimate_commercial(data: CommercialCreate, db: Session = Depends(get_db)):
    result = CommercialEngine.estimate_cost(data.dict())
    return result

@router.post("/save")
def save_commercial(data: CommercialCreate, db: Session = Depends(get_db)):
    result = CommercialEngine.estimate_cost(data.dict())
    project = ProjectService.save_project(
        db=db,
        project_type="commercial",
        input_json=data.dict(),
        total_cost=result['total_cost'],
        breakdown_json=result['breakdown']
    )
    return {"message": "Project saved", "project_id": project.id}
