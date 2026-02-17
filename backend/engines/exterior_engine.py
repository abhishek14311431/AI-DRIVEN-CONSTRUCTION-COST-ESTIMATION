from .floor_engine import FloorEngine
from ..utils.constants import FIXED_COSTS, INFLATION_RATE, SITE_TYPE_MULTIPLIER, FAMILY_ADJUSTMENT


class ExteriorEngine:

    def __init__(self, plot_size: str, floors: int, site_type: str, family_details: dict):
        if not isinstance(floors, int) or floors < 1:
            raise ValueError("Floors must be an integer >= 1")

        if site_type not in SITE_TYPE_MULTIPLIER:
            raise ValueError(
                f"Invalid site_type: {site_type}. Valid types are: {list(SITE_TYPE_MULTIPLIER.keys())}"
            )

        self.plot_size = plot_size
        self.floors = floors
        self.site_type = site_type
        self.family_details = family_details
        self.floor_engine = FloorEngine(plot_size, floors)

    def calculate_exterior_cost(self) -> dict:

        floor_costs = self.floor_engine.calculate_floor_cost()

        area_per_floor = floor_costs["area_per_floor"]
        total_area = floor_costs["total_area"]
        structure_cost = floor_costs["structure_cost"] * 0.3  
        finish_cost = floor_costs["finish_cost"] * 1.5  

        water_sump_cost = FIXED_COSTS["water_sump"] * 0.2
        septic_tank_cost = FIXED_COSTS["septic_tank"] * 0.2

        site_multiplier = SITE_TYPE_MULTIPLIER[self.site_type]
        total_area *= site_multiplier
        structure_cost *= site_multiplier
        finish_cost *= site_multiplier

        subtotal_before_adjustments = structure_cost + finish_cost + water_sump_cost + septic_tank_cost

        family_adjustment_factor = 1.0
        for key, value in self.family_details.items():
            if key in FAMILY_ADJUSTMENT:
                try:
                    num_val = float(value)
                    family_adjustment_factor += num_val * FAMILY_ADJUSTMENT[key]
                except (ValueError, TypeError):
                    if str(value).lower() == "yes":
                        family_adjustment_factor += FAMILY_ADJUSTMENT[key]

        subtotal_after_family = subtotal_before_adjustments * family_adjustment_factor

        zone_multiplier = 1.0
        zone_adjusted_cost = subtotal_after_family * zone_multiplier

        inflation_adjustment = zone_adjusted_cost * INFLATION_RATE
        final_cost = zone_adjusted_cost + inflation_adjustment

        return {
            "project_type": "exterior",
            "plot_size": self.plot_size,
            "floors": self.floors,
            "zone": "Unified",
            "site_type": self.site_type,
            "family_details": self.family_details,
            "area_per_floor": round(area_per_floor),
            "total_area": round(total_area),
            "structure_cost": round(structure_cost),
            "finish_cost": round(finish_cost),
            "water_sump_cost": round(water_sump_cost),
            "septic_tank_cost": round(septic_tank_cost),
            "subtotal_before_adjustments": round(subtotal_before_adjustments),
            "family_adjustment_factor": family_adjustment_factor,
            "subtotal_after_family": round(subtotal_after_family),
            "zone_multiplier": zone_multiplier,
            "zone_adjusted_cost": round(zone_adjusted_cost),
            "inflation_rate": INFLATION_RATE,
            "inflation_adjustment": round(inflation_adjustment),
            "final_cost": round(final_cost),
        }
