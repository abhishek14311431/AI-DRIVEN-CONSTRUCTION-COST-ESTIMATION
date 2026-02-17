from typing import ClassVar, Dict, Set, Any, Optional, Union

from pydantic import BaseModel, validator


class EstimateRequest(BaseModel):
	"""Request schema for /estimate endpoint.

	Validates high-level project inputs before orchestration in the API.
	"""


	project_type: str
	plot_size: str
	floors: Union[int, str]
	selected_tier: str
	site_type: str = "full"
	
	@validator("site_type")
	def validate_site_type(cls, v: str) -> str:
		mapping = {
			"full-site": "full",
			"half-site": "half",
			"double-site": "double"
		}
		return mapping.get(v.lower(), v.lower())
	family_details: Dict[str, Any]  
	lift_required: bool = False
	generate_pdf: bool = False
	upgrades: Optional[Dict[str, str]] = None
	interior: Optional[str] = None
	dimensions: Optional[str] = None
	compound_wall: bool = False
	rain_water_harvesting: bool = False
	additional_notes: Optional[str] = None

	@validator("floors")
	def validate_floors(cls, v: Union[int, str]) -> Union[int, str]:
		return v

	class Config:
		extra = "ignore" 
