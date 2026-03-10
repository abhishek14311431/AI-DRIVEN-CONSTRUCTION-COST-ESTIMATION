from typing import Dict, List, Optional


SITE_LABELS = {
    "half": "Half Site",
    "full": "Full Site",
    "double": "Double Site",
}

UNIT_TYPE_BY_SITE = {
    "half": "Single Bedroom",
    "full": "Double Bedroom",
    "double": "Multiple Bedroom",
}

# Base pricing anchor follows user requirement for half-site references.
FLOOR_BASE_COSTS = {
    "half": {"G+1": 2200000, "G+2": 3000000, "G+3": 3900000, "extra": 750000},
    "full": {"G+1": 2600000, "G+2": 3500000, "G+3": 4500000, "extra": 800000},
    "double": {"G+1": 3600000, "G+2": 5000000, "G+3": 6500000, "extra": 800000}
}

PLAN_MULTIPLIERS = {
    "Base": 1.00,
    "Classic": 1.14,
    "Premium": 1.28,
}

RENTAL_BREAKDOWN_RATIOS = {
    "Excavation & Foundation": 0.12,
    "RCC Structure": 0.23,
    "Brickwork": 0.10,
    "Plastering": 0.07,
    "Flooring": 0.08,
    "Plumbing": 0.07,
    "Electrical": 0.07,
    "Bathrooms": 0.09,
    "Staircase": 0.06,
    "Exterior Finish": 0.06,
    "Terrace Waterproofing": 0.05,
}

RENTAL_CATEGORIES = {
    "Excavation & Foundation": "STRUCTURE",
    "RCC Structure": "STRUCTURE",
    "Brickwork": "STRUCTURE",
    "Plastering": "FINISHING",
    "Flooring": "FINISHING",
    "Plumbing": "UTILITIES",
    "Electrical": "UTILITIES",
    "Bathrooms": "UTILITIES",
    "Staircase": "STRUCTURE",
    "Exterior Finish": "EXTERIOR",
    "Terrace Waterproofing": "EXTERIOR",
}

class RentalEngine:
    @staticmethod
    def _normalize_floors(floors: str, custom_floors: Optional[int]) -> str:
        if floors != "custom":
            return floors

        if custom_floors is None or custom_floors < 4:
            return "G+4"
        return f"G+{custom_floors}"

    @staticmethod
    def _compute_base_cost(site_type: str, normalized_floors: str) -> float:
        site_costs = FLOOR_BASE_COSTS.get(site_type, FLOOR_BASE_COSTS["half"])

        if normalized_floors in site_costs:
            return float(site_costs[normalized_floors])

        try:
            floor_number = int(normalized_floors.replace("G+", ""))
        except ValueError:
            floor_number = 3

        floor_number = max(1, floor_number)
        if floor_number <= 3:
            return float(site_costs.get(f"G+{floor_number}", site_costs["G+3"]))

        extra_floors = floor_number - 3
        return float(site_costs["G+3"] + (extra_floors * site_costs["extra"]))

    @staticmethod
    def _build_breakdown(total_cost: float) -> List[Dict]:
        items: List[Dict] = []
        for component, ratio in RENTAL_BREAKDOWN_RATIOS.items():
            amount = round(total_cost * ratio, 2)
            items.append({
                "component": component,
                "category": RENTAL_CATEGORIES.get(component, "STRUCTURE"),
                "amount": amount,
                "percentage": round(ratio * 100, 2),
            })

        return sorted(items, key=lambda x: x["amount"], reverse=True)

    @staticmethod
    def estimate_cost(data: dict) -> dict:
        site_type = data.get("site_type", "half")
        dimensions = data.get("dimensions", "20x40")
        plan = data.get("plan", "Base")
        input_floors = data.get("floors", "G+1")
        custom_floors = data.get("custom_floors")

        normalized_floors = RentalEngine._normalize_floors(input_floors, custom_floors)
        base_cost = RentalEngine._compute_base_cost(site_type, normalized_floors)
        total_cost = round(base_cost * PLAN_MULTIPLIERS.get(plan, 1.0), 2)
        breakdown = RentalEngine._build_breakdown(total_cost)

        return {
            "project_type": "Rental Homes",
            "site_type": SITE_LABELS.get(site_type, "Half Site"),
            "dimensions": dimensions,
            "floors": normalized_floors,
            "unit_type": UNIT_TYPE_BY_SITE.get(site_type, "Single Bedroom"),
            "plan": plan,
            "total_cost": total_cost,
            "breakdown": breakdown,
        }
