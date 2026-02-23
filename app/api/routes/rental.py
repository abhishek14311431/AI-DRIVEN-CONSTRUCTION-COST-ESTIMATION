from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.rental_schema import RentalCreate, RentalResponse
from app.engines.rental_engine import RentalEngine
from app.services.project_service import ProjectService
from app.database.session import get_db

router = APIRouter()

@router.post("/estimate", response_model=RentalResponse)
def estimate_rental(data: RentalCreate):
    try:
        result = RentalEngine.estimate_cost(data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save")
def save_rental(data: RentalCreate, db: Session = Depends(get_db)):
    result = RentalEngine.estimate_cost(data.dict())
    project = ProjectService.save_project(
        db=db,
        project_type="rental",
        input_json=data.dict(),
        total_cost=result['total_cost'],
        breakdown_json=result['breakdown']
    )
    return {"message": "Project saved", "project_id": project.id}
