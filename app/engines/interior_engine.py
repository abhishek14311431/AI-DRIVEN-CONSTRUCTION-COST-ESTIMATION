from app.core.constants import INTERIOR_SQFT_RATES
from app.engines.breakdown_engine import BreakdownEngine

class InteriorEngine:
    @staticmethod
    def estimate_cost(data: dict) -> dict:
        total_sqft = data['total_sqft']
        style = data['style']
        
        rate = INTERIOR_SQFT_RATES.get(style, 800)
        cost = total_sqft * rate
        
        breakdown = BreakdownEngine.calculate_breakdown(cost)
        
        return {
            "total_cost": cost,
            "breakdown": breakdown
        }
