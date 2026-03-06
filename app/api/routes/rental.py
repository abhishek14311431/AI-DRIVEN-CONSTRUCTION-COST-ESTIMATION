from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.rental_schema import RentalCreate, RentalResponse
from app.engines.rental_engine import RentalEngine
from app.services.project_service import ProjectService
from app.database.session import get_db

router = APIRouter()

@router.post("/estimate", response_model=RentalResponse)
def estimate_rental(data: RentalCreate, db: Session = Depends(get_db)):
    """
    Estimate rental home construction costs.
    
    Required fields:
    - site_type: "Half Site", "Full Site", or "Double Site"
    - dimensions: Specific to each site type (e.g., "20x40", "30x50", etc.)
    - floors: "G+1", "G+2", "G+3", or custom like "G+4", "G+5", etc.
    - plan: "Base", "Classic", or "Premium"
    - zone: "A", "B", or "C" (optional, defaults to "B")
    
    Returns:
    - Structured rental estimation with auto-assigned unit type
    - Detailed 11-component cost breakdown
    - Semi-interior and external staircase flags
    """
    try:
        result = RentalEngine.estimate_cost(data.dict())
        return RentalResponse(**result)
    except ValueError as e:
        return {"error": str(e)}

@router.post("/save")
def save_rental(data: RentalCreate, db: Session = Depends(get_db)):
    """
    Save a rental home estimation project and store in database.
    """
    try:
        result = RentalEngine.estimate_cost(data.dict())
        project = ProjectService.save_project(
            db=db,
            project_type="rental",
            input_json=data.dict(),
            total_cost=result['total_cost'],
            breakdown_json={
                "breakdown": result['breakdown'],
                "project_details": {
                    "site_type": result['site_type'],
                    "dimensions": result['dimensions'],
                    "floors": result['floors'],
                    "unit_type": result['unit_type'],
                    "plan": result['plan']
                }
            }
        )
        return {
            "message": "Rental project saved successfully",
            "project_id": project.id,
            "total_cost": result['total_cost']
        }
    except ValueError as e:
        return {"error": str(e)}
