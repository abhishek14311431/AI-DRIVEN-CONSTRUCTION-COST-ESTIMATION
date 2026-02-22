from app.core.constants import (
    VILLA_BASE_COST,
    VILLA_UPGRADE_MULTIPLIER,
    OWN_HOUSE_FLOOR_MULTIPLIER,
    ZONE_MULTIPLIER
)
from app.engines.breakdown_engine import BreakdownEngine

class VillaEngine:
    @staticmethod
    def estimate_cost(data: dict) -> dict:
        cost = VILLA_BASE_COST
        
        # Floor scaling similar to own house
        cost *= OWN_HOUSE_FLOOR_MULTIPLIER.get(data['floor'], 1.0)
        cost *= VILLA_UPGRADE_MULTIPLIER.get(data['upgrade_level'], 1.0)
        cost *= ZONE_MULTIPLIER.get(data['zone'], 1.0)
            
        breakdown = BreakdownEngine.calculate_breakdown(cost)
        
        return {
            "total_cost": cost,
            "breakdown": breakdown
        }
