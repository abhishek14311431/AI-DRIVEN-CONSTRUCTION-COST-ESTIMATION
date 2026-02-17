from ..utils.constants import MATERIAL_COSTS


class TierEngine:

    def __init__(self, base_finish_cost: float, total_area: float, selected_tier: str):
        if selected_tier not in MATERIAL_COSTS:
            raise ValueError(
                f"Invalid selected_tier: {selected_tier}. Valid tiers are: {list(MATERIAL_COSTS.keys())}"
            )

        self.base_finish_cost = base_finish_cost
        self.total_area = total_area
        self.selected_tier = selected_tier

    def apply_tier_upgrade(self) -> dict:

        materials = MATERIAL_COSTS[self.selected_tier]
        flooring_cost = materials["flooring"] * self.total_area
        walls_cost = materials["walls"] * self.total_area
        ceiling_cost = materials["ceiling"] * self.total_area
        total_material_cost = flooring_cost + walls_cost + ceiling_cost

        if self.selected_tier == "Basic":
            upgraded_finish_cost = self.base_finish_cost
            upgrade_difference = 0
            total_material_cost = 0
            flooring_cost = 0
            walls_cost = 0
            ceiling_cost = 0
        else:
            upgraded_finish_cost = self.base_finish_cost + total_material_cost
            upgrade_difference = total_material_cost

        tier_multiplier = upgraded_finish_cost / self.base_finish_cost if self.base_finish_cost > 0 else 1.0

        return {
            "selected_tier": self.selected_tier,
            "materials": materials,
            "flooring_cost": round(flooring_cost),
            "walls_cost": round(walls_cost),
            "ceiling_cost": round(ceiling_cost),
            "total_material_cost": round(total_material_cost),
            "base_finish_cost": round(self.base_finish_cost),
            "upgraded_finish_cost": round(upgraded_finish_cost),
            "upgrade_difference": round(upgrade_difference),
            "tier_multiplier": tier_multiplier,
        }
