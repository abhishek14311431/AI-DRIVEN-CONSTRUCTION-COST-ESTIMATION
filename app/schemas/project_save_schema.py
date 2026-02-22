from pydantic import BaseModel
from typing import Optional, Dict, Any

class ProjectSaveRequest(BaseModel):
    project_type: str
    input_json: Dict[str, Any]
    total_cost: float
    breakdown_json: Dict[str, Any]
    user_id: Optional[str] = None
