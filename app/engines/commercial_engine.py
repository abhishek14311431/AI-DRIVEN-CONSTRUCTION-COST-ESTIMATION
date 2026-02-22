from app.core.constants import (
    COMMERCIAL_BASE_SQFT_RATE,
    COMMERCIAL_FIRE_SAFETY_RATE,
    COMMERCIAL_ELECTRICAL_HEAVY_LOAD,
    COMMERCIAL_LIFT_FIXED,
    ZONE_MULTIPLIER
)
from app.engines.breakdown_engine import BreakdownEngine

class CommercialEngine:
    @staticmethod
    def estimate_cost(data: dict) -> dict:
        total_sqft = data['total_sqft']
        floors = data['floors']
        
        # Base construction cost
        base_cost = total_sqft * COMMERCIAL_BASE_SQFT_RATE
        
        # Add safety and electrical (per sqft)
        fire_safety = total_sqft * COMMERCIAL_FIRE_SAFETY_RATE
        electrical = total_sqft * COMMERCIAL_ELECTRICAL_HEAVY_LOAD
        
        cost = base_cost + fire_safety + electrical
        
        # Zone adjustment (on base construction ideally, but let's apply to total for simplicity unless specified)
        cost *= ZONE_MULTIPLIER.get(data['zone'], 1.0)
        
        # Lift is mandatory > 2 floors
        lift_required = data.get('lift_required') or floors > 2
        if lift_required:
            cost += COMMERCIAL_LIFT_FIXED
            
        breakdown = BreakdownEngine.calculate_breakdown(cost)
        
        return {
            "total_cost": cost,
            "breakdown": breakdown
        }
