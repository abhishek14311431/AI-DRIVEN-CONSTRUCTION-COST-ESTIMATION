from .floor_engine import FloorEngine
from ..utils.constants import FIXED_COSTS, INFLATION_RATE, SITE_TYPE_MULTIPLIER, FAMILY_ADJUSTMENT

class RentalEngine:

    def __init__(self, plot_size: str, floors: int, lift_required: bool, site_type: str, family_details: dict):
        if not isinstance(floors, int) or floors < 1:
            raise ValueError("Floors must be an integer >= 1")

        if site_type not in SITE_TYPE_MULTIPLIER:
            raise ValueError(
                f"Invalid site_type: {site_type}. Valid types are: {list(SITE_TYPE_MULTIPLIER.keys())}"
            )

        self.plot_size = plot_size
        self.floors = floors
        self.lift_required = lift_required
        self.site_type = site_type
        self.family_details = family_details
        self.floor_engine = FloorEngine(plot_size, floors)
    
    def calculate_rental_cost(self) -> dict:
        floor_costs = self.floor_engine.calculate_floor_cost()

        area_per_floor = floor_costs["area_per_floor"]
        total_area = floor_costs["total_area"]
        structure_cost = floor_costs["structure_cost"]
        finish_cost = floor_costs["finish_cost"]

        water_sump_cost = FIXED_COSTS["water_sump"]
        septic_tank_cost = FIXED_COSTS["septic_tank"]
        lift_cost = FIXED_COSTS["lift"] if self.lift_required else 0

        site_multiplier = SITE_TYPE_MULTIPLIER[self.site_type]
        if self.site_type == "half":
            total_area *= 0.6
            structure_cost *= 0.6
            finish_cost *= 0.6
            base_cost = structure_cost + finish_cost + water_sump_cost + septic_tank_cost + lift_cost
            if base_cost < 3_200_000:
                adjustment_factor = 3_200_000 / base_cost
                structure_cost *= adjustment_factor
                finish_cost *= adjustment_factor
        else:
            total_area *= site_multiplier
            structure_cost *= site_multiplier
            finish_cost *= site_multiplier

        subtotal_before_adjustments = structure_cost + finish_cost + water_sump_cost + septic_tank_cost + lift_cost

        family_adjustment_factor = 1.0
        for key, value in self.family_details.items():
            if key in FAMILY_ADJUSTMENT:
                try:
                    num_val = float(value)
                    if key == "bedrooms" and self.site_type == "double":
                        
                        family_adjustment_factor += (num_val - 3) * 0.08
                    else:
                        family_adjustment_factor += num_val * FAMILY_ADJUSTMENT[key]
                except (ValueError, TypeError):
                    if str(value).lower() == "yes":
                        family_adjustment_factor += FAMILY_ADJUSTMENT[key]

        subtotal_after_family = subtotal_before_adjustments * family_adjustment_factor
        
        parking_reduction = 0
        if self.family_details.get("parking") == "Yes":
            parking_reduction = 250000
            subtotal_after_family -= parking_reduction

        inflation_adjustment = subtotal_after_family * INFLATION_RATE
        final_cost = subtotal_after_family + inflation_adjustment

        return {
            "project_type": "rental",
            "plot_size": self.plot_size,
            "floors": self.floors,
            "zone": "Unified",
            "site_type": self.site_type,
            "lift_required": self.lift_required,
            "family_details": self.family_details,
            "area_per_floor": round(area_per_floor),
            "total_area": round(total_area),
            "structure_cost": round(structure_cost),
            "finish_cost": round(finish_cost),
            "water_sump_cost": round(water_sump_cost),
            "septic_tank_cost": round(septic_tank_cost),
            "lift_cost": round(lift_cost),
            "subtotal_before_adjustments": round(subtotal_before_adjustments),
            "family_adjustment_factor": family_adjustment_factor,
            "subtotal_after_family": round(subtotal_after_family),
            "zone_multiplier": 1.0,
            "zone_adjusted_cost": round(subtotal_after_family),
            "inflation_rate": INFLATION_RATE,
            "inflation_adjustment": round(inflation_adjustment),
            "final_cost": round(final_cost),
        }
