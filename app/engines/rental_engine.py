from app.core.constants import (
    RENTAL_BASE_COST,
    RENTAL_FLOOR_MULTIPLIER,
    RENTAL_UPGRADE_MULTIPLIER,
    ZONE_MULTIPLIER,
    RENTAL_INTERIOR_BASE
)
from app.engines.breakdown_engine import BreakdownEngine

class RentalEngine:
    @staticmethod
    def estimate_cost(data: dict) -> dict:
        cost = RENTAL_BASE_COST
        
        floor_multiplier = RENTAL_FLOOR_MULTIPLIER.get(data['floor'], 1.0)
        cost *= floor_multiplier
        cost *= RENTAL_UPGRADE_MULTIPLIER.get(data['upgrade_level'], 1.0)
        cost *= ZONE_MULTIPLIER.get(data['zone'], 1.0)
        
        if data.get('include_interior'):
            # Scaled using floor multiplier as per prompt
            cost += RENTAL_INTERIOR_BASE * floor_multiplier
            
        breakdown = BreakdownEngine.calculate_breakdown(cost)
        
        return {
            "total_cost": cost,
            "breakdown": breakdown
        }
