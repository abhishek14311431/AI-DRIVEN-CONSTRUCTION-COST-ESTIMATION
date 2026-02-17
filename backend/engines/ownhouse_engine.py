from .floor_engine import FloorEngine
from ..utils.constants import FIXED_COSTS, INFLATION_RATE, SITE_TYPE_MULTIPLIER, FAMILY_ADJUSTMENT


class OwnHouseEngine:

    def __init__(self, plot_size: str, floors: int, lift_required: bool, site_type: str, family_details: dict):

        if not isinstance(floors, int) or floors < 1:
            raise ValueError("Floors must be an integer >= 1")

        if not isinstance(lift_required, bool):
            raise ValueError("lift_required must be a boolean")

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
    
    def calculate_ownhouse_cost(self) -> dict:

        floor_costs = self.floor_engine.calculate_floor_cost()

        area_per_floor = floor_costs["area_per_floor"]
        total_area = floor_costs["total_area"]
        structure_cost = floor_costs["structure_cost"]
        finish_cost = floor_costs["finish_cost"]

        compound_cost = FIXED_COSTS["compound"]
        water_sump_cost = FIXED_COSTS["water_sump"]
        septic_tank_cost = FIXED_COSTS["septic_tank"]

        lift_cost = FIXED_COSTS["lift"] if self.lift_required else 0

        site_multiplier = SITE_TYPE_MULTIPLIER[self.site_type]
        total_area *= site_multiplier
        structure_cost *= site_multiplier
        finish_cost *= site_multiplier
        compound_cost *= site_multiplier  

        subtotal_before_family = (
            structure_cost + finish_cost + water_sump_cost + septic_tank_cost + lift_cost
        )

        family_adjustment_factor = 1.0
        
        if "bedrooms" in self.family_details:
            try:
                num_bedrooms = float(self.family_details["bedrooms"])
                if num_bedrooms > 3:
                     family_adjustment_factor += (num_bedrooms - 3) * FAMILY_ADJUSTMENT["bedrooms"]
            except (ValueError, TypeError):
                pass

        adjusted_structure_cost = structure_cost
        adjusted_finish_cost = finish_cost * family_adjustment_factor
        
        subtotal_after_family = adjusted_structure_cost + adjusted_finish_cost + water_sump_cost + septic_tank_cost + lift_cost

        zone_multiplier = 1.0
        zone_adjusted_cost = subtotal_after_family * zone_multiplier

        inflation_adjustment = zone_adjusted_cost * INFLATION_RATE
        final_cost = zone_adjusted_cost + inflation_adjustment

        return {
            "project_type": "own_house",
            "plot_size": self.plot_size,
            "floors": self.floors,
            "zone": "Unified",
            "lift_required": self.lift_required,
            "site_type": self.site_type,
            "family_details": self.family_details,
            "area_per_floor": round(area_per_floor),
            "total_area": round(total_area),
            "structure_cost": round(adjusted_structure_cost),
            "finish_cost": round(adjusted_finish_cost),
            "compound_cost": round(compound_cost),
            "water_sump_cost": round(water_sump_cost),
            "septic_tank_cost": round(septic_tank_cost),
            "lift_cost": round(lift_cost),
            "subtotal_before_family": round(subtotal_before_family),
            "family_adjustment_factor": family_adjustment_factor,
            "subtotal_after_family": round(subtotal_after_family),
            "zone_multiplier": zone_multiplier,
            "zone_adjusted_cost": round(zone_adjusted_cost),
            "inflation_rate": INFLATION_RATE,
            "inflation_adjustment": round(inflation_adjustment),
            "final_cost": round(final_cost),
        }
