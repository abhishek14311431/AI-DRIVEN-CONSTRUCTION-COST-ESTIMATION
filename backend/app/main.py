from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _breakdown_item(component: str, category: str, amount: float) -> Dict[str, Any]:
    return {
        "component": component,
        "category": category,
        "amount": round(amount),
        "percentage": 0,
    }

# Flexible model that accepts any fields
class EstimationRequest(BaseModel):
    plot_size: Optional[str] = None
    dimensions: Optional[str] = None
    floor: Optional[str] = None
    floors: Optional[str] = None
    structural_style: Optional[str] = None
    plan: Optional[str] = None
    bedrooms: Optional[int] = None
    family_count: Optional[int] = None
    grandparents_living: Optional[bool] = None
    children_count: Optional[int] = None
    lift_required: Optional[bool] = None
    pooja_room: Optional[bool] = None
    vastu_direction: Optional[str] = None
    zone_details: Optional[str] = None
    terrace_guest_bedroom: Optional[bool] = None
    interior_package: Optional[str] = None
    include_compound_wall: Optional[bool] = None
    include_rainwater_harvesting: Optional[bool] = None
    include_car_parking: Optional[bool] = None
    target_unit_count: Optional[int] = None
    external_staircase_only: Optional[bool] = None
    separate_meter_per_unit: Optional[bool] = None
    style: Optional[str] = None
    finish_level: Optional[str] = None
    total_sqft: Optional[int] = None
    include_false_ceiling: Optional[bool] = None
    include_modular_kitchen: Optional[bool] = None
    include_wardrobes: Optional[bool] = None
    include_waterproofing: Optional[bool] = None
    include_gate: Optional[bool] = None
    include_elevation: Optional[bool] = None
    include_landscaping: Optional[bool] = None
    upgrades: List[str] = []

# Cost calculation logic
def calculate_cost(data: EstimationRequest) -> Dict[str, Any]:
    # Base costs by project type
    base_cost = 1500  # per sqft base

    # Get dimensions for sqft calculation
    dimensions = data.dimensions or "30x40"
    try:
        if 'x' in dimensions:
            parts = dimensions.split('x')
            width = int(parts[0])
            length = int(parts[1])
            sqft = width * length
        else:
            sqft = int(dimensions)
    except:
        sqft = 1200  # default

    # Floor multiplier
    floor_multiplier = 1.0
    if data.floor:
        floor_map = {'G+1': 1.0, 'G+2': 1.8, 'G+3': 2.5}
        floor_multiplier = floor_map.get(data.floor, 1.0)
    elif data.floors:
        floor_map = {'G+1': 1.0, 'G+2': 1.8, 'G+3': 2.5}
        floor_multiplier = floor_map.get(data.floors, 1.0)

    # Grade/plan multiplier
    grade_multiplier = 1.0
    if data.structural_style:
        grade_map = {'Base': 1.0, 'Classic': 1.15, 'Premium': 1.35, 'Elite': 1.6}
        grade_multiplier = grade_map.get(data.structural_style, 1.0)
    elif data.plan:
        grade_map = {'Base': 1.0, 'Classic': 1.14, 'Premium': 1.28}
        grade_multiplier = grade_map.get(data.plan, 1.0)

    # Interior package multiplier
    interior_multiplier = 1.0
    if data.interior_package:
        interior_map = {'none': 1.0, 'base': 1.08, 'semi': 1.15, 'full_furnished': 1.35}
        interior_multiplier = interior_map.get(data.interior_package, 1.0)

    breakdown_items = []

    base_construction = sqft * base_cost
    floor_uplift = base_construction * max(floor_multiplier - 1.0, 0)
    grade_uplift = base_construction * floor_multiplier * max(grade_multiplier - 1.0, 0)
    interior_uplift = base_construction * floor_multiplier * grade_multiplier * max(interior_multiplier - 1.0, 0)

    breakdown_items.append(_breakdown_item('Base Civil Works', 'CONSTRUCTION', base_construction))

    if floor_uplift > 0:
        floor_label = data.floor or data.floors or 'G+1'
        breakdown_items.append(_breakdown_item(f'Height / Floor Uplift ({floor_label})', 'CONSTRUCTION', floor_uplift))

    if grade_uplift > 0:
        grade_label = data.structural_style or data.plan or 'Base'
        breakdown_items.append(_breakdown_item(f'Grade Premium ({grade_label})', 'CONSTRUCTION', grade_uplift))

    if interior_uplift > 0:
        package_label = data.interior_package.replace('_', ' ').title() if data.interior_package else 'Interior'
        breakdown_items.append(_breakdown_item(f'Interior Package ({package_label})', 'INTERIORS', interior_uplift))

    construction_cost = base_construction + floor_uplift + grade_uplift + interior_uplift

    # Additional costs
    addons_cost = 0
    if data.include_compound_wall:
        breakdown_items.append(_breakdown_item('Compound Wall', 'ADDONS', 300000))
        addons_cost += 300000
    if data.include_rainwater_harvesting:
        breakdown_items.append(_breakdown_item('Rainwater Harvesting', 'ADDONS', 60000))
        addons_cost += 60000
    if data.include_car_parking:
        breakdown_items.append(_breakdown_item('Car Parking Covering', 'ADDONS', 55000))
        addons_cost += 55000
    if data.lift_required:
        breakdown_items.append(_breakdown_item('Lift / Elevator', 'ADDONS', 500000))
        addons_cost += 500000
    if data.pooja_room:
        breakdown_items.append(_breakdown_item('Pooja Room', 'ADDONS', 75000))
        addons_cost += 75000
    if data.terrace_guest_bedroom:
        breakdown_items.append(_breakdown_item('Terrace Guest Bedroom', 'ADDONS', 200000))
        addons_cost += 200000

    upgrade_cost = 5000 * len(data.upgrades) if data.upgrades else 0
    if data.upgrades:
        for upgrade in data.upgrades:
            breakdown_items.append(_breakdown_item(f'Smart Upgrade: {upgrade}', 'UPGRADES', 5000))

    subtotal_before_inflation = construction_cost + addons_cost + upgrade_cost
    inflation_amount = round(subtotal_before_inflation * 0.0102)
    if inflation_amount > 0:
        breakdown_items.append(_breakdown_item('2026 Inflation Margin', 'INFLATION', inflation_amount))

    total_cost = subtotal_before_inflation + inflation_amount

    for item in breakdown_items:
        item['percentage'] = round((item['amount'] / max(total_cost, 1)) * 100)

    return {
        "sqft": sqft,
        "dimensions": dimensions,
        "floor": data.floor or data.floors or "G+1",
        "grade": data.structural_style or data.plan or "Classic",
        "base_cost": round(construction_cost),
        "addons_cost": addons_cost,
        "upgrade_cost": upgrade_cost,
        "inflation_amount": inflation_amount,
        "total_cost": round(total_cost),
        "breakdown": breakdown_items
    }

@app.post("/api/v1/own-house/estimate")
async def estimate_own_house(data: EstimationRequest):
    result = calculate_cost(data)
    return result

@app.post("/api/v1/rental/estimate")
async def estimate_rental(data: EstimationRequest):
    result = calculate_cost(data)
    return result

@app.post("/api/v1/villa/estimate")
async def estimate_villa(data: EstimationRequest):
    result = calculate_cost(data)
    return result

@app.post("/api/v1/commercial/estimate")
async def estimate_commercial(data: EstimationRequest):
    result = calculate_cost(data)
    return result

@app.post("/api/v1/interior/estimate")
async def estimate_interior(data: EstimationRequest):
    result = calculate_cost(data)
    return result

@app.post("/api/v1/exterior/estimate")
async def estimate_exterior(data: EstimationRequest):
    result = calculate_cost(data)
    return result

# Save project endpoint
@app.post("/api/v1/own-house/save")
async def save_own_house(data: EstimationRequest):
    return {"project_id": "OWN-" + str(hash(str(data)))[:8], "status": "saved"}

@app.post("/api/v1/rental/save")
async def save_rental(data: EstimationRequest):
    return {"project_id": "RNT-" + str(hash(str(data)))[:8], "status": "saved"}

@app.post("/api/v1/villa/save")
async def save_villa(data: EstimationRequest):
    return {"project_id": "VIL-" + str(hash(str(data)))[:8], "status": "saved"}

@app.post("/api/v1/commercial/save")
async def save_commercial(data: EstimationRequest):
    return {"project_id": "COM-" + str(hash(str(data)))[:8], "status": "saved"}

@app.post("/api/v1/interior/save")
async def save_interior(data: EstimationRequest):
    return {"project_id": "INT-" + str(hash(str(data)))[:8], "status": "saved"}

@app.post("/api/v1/exterior/save")
async def save_exterior(data: EstimationRequest):
    return {"project_id": "EXT-" + str(hash(str(data)))[:8], "status": "saved"}

# Projects list endpoint
projects_db = []

@app.get("/api/v1/projects/")
async def get_projects():
    return projects_db

@app.get("/")
async def root():
    return {"message": "AI-Driven Construction Cost Estimation API is running."}
