from app.core.constants import EXTERIOR_BASE_COST
from app.engines.breakdown_engine import BreakdownEngine

class ExteriorEngine:
    @staticmethod
    def estimate_cost(data: dict) -> dict:
        # For simplicity, we use the base cost and adjust slightly if some items are excluded
        cost = EXTERIOR_BASE_COST
        
        # Simple logical deduction if items are not included
        if not data.get('include_compound_wall'): cost -= 80000
        if not data.get('include_waterproofing'): cost -= 50000
        if not data.get('include_gate'): cost -= 40000
        if not data.get('include_elevation'): cost -= 100000

        # Ensure cost doesn't go below zero
        cost = max(cost, 50000)
            
        breakdown = BreakdownEngine.calculate_breakdown(cost)
        
        return {
            "total_cost": cost,
            "breakdown": breakdown
        }
