from .tier_engine import TierEngine
from ..utils.constants import FIXED_COSTS, STRUCTURE_BREAKDOWN, FINISH_BREAKDOWN, TIER_FEATURES


class BreakdownEngine:
    
    REQUIRED_KEYS = {
        "structure_cost",
        "finish_cost",
        "inflation_rate",
    }
    
    FIXED_COST_KEYS = {"water_sump_cost", "septic_tank_cost", "lift_cost", "rain_water_harvesting_cost"}
    
    
    UPGRADE_PRICES = {
        "flooring": {"granite": 400, "marble": 500, "italian-marble": 600},
        "walls": {"emulsion": 300, "texture": 450},
        "electrical": {"branded": 120, "smart": 250},
        "plumbing": {"branded": 160, "luxury": 350},
        "kitchen": {"modular": 250, "designer": 450},
        "security": {"advanced": 150, "premium": 300}
    }

    INTERIOR_PRICES = {
        "base": 200,
        "semi-furnished": 600,
        "fully-furnished": 1200
    }

    def __init__(self, base_result: dict, selected_tier: str):
        missing_keys = self.REQUIRED_KEYS - set(base_result.keys())
        if missing_keys:
            raise ValueError(
                f"base_result missing required keys: {missing_keys}"
            )
        
        self.base_result = base_result
        self.selected_tier = selected_tier
    
    def calculate_upgrades_cost(self, area: float) -> float:
        upgrades = self.base_result.get("upgrades", {})
        total_upgrade_cost = 0.0
        
        if not upgrades:
            return 0.0
            
        for category, option_id in upgrades.items():
            if category in self.UPGRADE_PRICES and option_id in self.UPGRADE_PRICES[category]:
                rate = self.UPGRADE_PRICES[category][option_id]
                total_upgrade_cost += rate * area
                
        return total_upgrade_cost

    def calculate_interior_cost(self, area: float) -> float:
        package_id = self.base_result.get("interior_package")
        if package_id and package_id in self.INTERIOR_PRICES:
            return self.INTERIOR_PRICES[package_id] * area
        return 0.0

    def generate_final_breakdown(self) -> dict:
        
        base_finish_cost = self.base_result["finish_cost"]
        total_area = float(self.base_result.get("total_area", 0))
        structure_cost = self.base_result["structure_cost"]
        inflation_rate = self.base_result["inflation_rate"]
        
        tier_engine = TierEngine(base_finish_cost, total_area, self.selected_tier)
        tier_result = tier_engine.apply_tier_upgrade()
        
        upgraded_finish_cost = tier_result["upgraded_finish_cost"]
        tier_multiplier = tier_result["tier_multiplier"]
        upgrade_difference = tier_result["upgrade_difference"]
        
        upgrades_cost = self.calculate_upgrades_cost(total_area)
        interior_cost = self.calculate_interior_cost(total_area)
        
        compound_req = self.base_result.get("compound_wall_required", False)
        rwh_req = self.base_result.get("rain_water_harvesting_required", False)
        
        extra_addons_cost = 0
        if compound_req:
            extra_addons_cost += FIXED_COSTS["compound"]
        if rwh_req:
            extra_addons_cost += FIXED_COSTS["rain_water_harvesting"]

        subtotal_before_zone = structure_cost + upgraded_finish_cost + upgrades_cost + interior_cost + extra_addons_cost
        
        fixed_costs_total = 0
        for key in self.FIXED_COST_KEYS:
            if key in self.base_result:
                fixed_costs_total += self.base_result[key]
        
        subtotal_before_zone += fixed_costs_total
        
        
        subtotal_after_family = subtotal_before_zone 
        
        zone_multiplier = 1.0 
        zone_adjusted_cost = subtotal_after_family * zone_multiplier 
        inflation_adjustment = zone_adjusted_cost * inflation_rate
        final_cost = zone_adjusted_cost + inflation_adjustment

        detailed_breakdown = []

        structure_actual_total = structure_cost

        structure_items = list(STRUCTURE_BREAKDOWN.items())
        structure_allocated = 0
        for index, (name, weight) in enumerate(structure_items):
            amount = round(structure_actual_total * weight)
            if index == len(structure_items) - 1:
                amount = round(structure_actual_total) - structure_allocated
            structure_allocated += amount
            icon = "Box"
            if "Excavation" in name: icon = "Pickaxe"
            elif "Foundation" in name: icon = "Shield"
            elif "RCC" in name: icon = "HardHat"
            elif "Brickwork" in name: icon = "AlignJustify"
            elif "Plastering" in name: icon = "Paintbrush"
            elif "Terrace" in name: icon = "Sun"

            detailed_breakdown.append({
                "category": "STRUCTURE",
                "item": name,
                "amount": amount,
                "icon": icon
            })

        flooring_map = {
            "Basic": "Ceramic Tiles & Granite Stairs Flooring",
            "Classic": "Premium Granite & Branded Ceramics",
            "Premium": "Imported Marble & High-end Ceramics",
            "Luxury": "Italian Marble & Designer Ceramics"
        }
        flooring_name = flooring_map.get(self.selected_tier, "Main Flooring (Incl. Granite Stairs)")

        finish_items = []
        for name, weight in FINISH_BREAKDOWN.items():
            base_amount = upgraded_finish_cost * weight
            display_name = flooring_name if name == "Main Flooring (Incl. Granite Stairs)" else name
            
            icon = "Layers"
            if "Electrical" in name or "Switches" in name: icon = "Zap"
            elif "Plumbing" in name or "Tank" in name: icon = "Droplets"
            elif "Sanitary" in name or "Fixtures" in name: icon = "Bath"
            elif "Painting" in name or "Surface" in name: icon = "Paintbrush"
            elif "Door" in name or "Window" in name: icon = "Layout"
            elif "Flooring" in name or "Tiling" in name: icon = "Square"
            
            finish_items.append({
                "item": display_name,
                "base_amount": base_amount,
                "icon": icon
            })

        finish_actual_total = upgraded_finish_cost
        finish_allocated = 0
        for index, item in enumerate(finish_items):
            amount = round(finish_actual_total * (item["base_amount"] / upgraded_finish_cost))
            if index == len(finish_items) - 1:
                amount = round(finish_actual_total) - finish_allocated
            finish_allocated += amount
            detailed_breakdown.append({
                "category": "FINISH",
                "item": item["item"],
                "amount": amount,
                "icon": item["icon"]
            })

        if upgrades_cost > 0:
            detailed_breakdown.append({
                "category": "ADD-ONS",
                "item": "Custom Material Selections",
                "amount": round(upgrades_cost),
                "icon": "Sparkles"
            })
        if interior_cost > 0:
            detailed_breakdown.append({
                "category": "ADD-ONS",
                "item": f"{self.base_result.get('interior_package', 'Selected')} Package",
                "amount": round(interior_cost),
                "icon": "Armchair"
            })
            
        if compound_req:
            detailed_breakdown.append({
                "category": "ADD-ONS",
                "item": "Compound Wall Execution",
                "amount": round(FIXED_COSTS["compound"]),
                "icon": "Shield"
            })
        if rwh_req:
            detailed_breakdown.append({
                "category": "ADD-ONS",
                "item": "Rain Water Harvesting System",
                "amount": round(FIXED_COSTS["rain_water_harvesting"]),
                "icon": "CloudRain"
            })

        if self.base_result.get("septic_tank_cost", 0) > 0:
            detailed_breakdown.append({
                "category": "FIXED COSTS",
                "item": "Standard Septic Tank System",
                "amount": round(self.base_result["septic_tank_cost"]),
                "icon": "Shield"
            })
        if self.base_result.get("lift_cost", 0) > 0:
            detailed_breakdown.append({
                "category": "FIXED COSTS",
                "item": "High-Speed Home Elevator",
                "amount": round(self.base_result["lift_cost"]),
                "icon": "Zap"  
            })

        if inflation_adjustment > 0:
            final_inflation = max(0, round(inflation_adjustment) - 10000)
            
            detailed_breakdown.append({
                "category": "ADJUSTMENTS",
                "item": "Market Price Adjustment (Inflation/Buffer)",
                "amount": final_inflation,
                "icon": "TrendingUp"
            })
            
            detailed_breakdown.append({
                "category": "FINISH",
                "item": "Basic Locks & Hardware", 
                "amount": 10000,
                "icon": "Lock"
            })

        result = self.base_result.copy()
        result.update({
            "selected_tier": self.selected_tier,
            "upgraded_finish_cost": round(upgraded_finish_cost),
            "tier_multiplier": tier_multiplier,
            "upgrade_difference": round(upgrade_difference),
            "finish_cost": round(upgraded_finish_cost),
            "upgrades_cost": round(upgrades_cost),
            "interior_cost": round(interior_cost),
            "extra_addons_cost": round(extra_addons_cost),
            "subtotal_before_zone": round(subtotal_before_zone),
            "zone_adjusted_cost": round(zone_adjusted_cost),
            "inflation_adjustment": round(inflation_adjustment),
            "final_cost": round(final_cost),
            "total_cost": round(final_cost),
            "tier_features": TIER_FEATURES.get(self.selected_tier, []),
            "pin_to_pin_details": detailed_breakdown
        })
        
        return result
