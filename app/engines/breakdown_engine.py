from typing import Any, Dict, List
from app.core.constants import (
    OWN_HOUSE_PLOT_RULES,
    EXTRA_BEDROOM_INCREASE,
    FLOOR_INCREASE_MULTIPLIER,
    CORE_BREAKDOWN_COMPONENTS,
    OWN_HOUSE_ADDONS,
    OWN_HOUSE_PLAN_MULTIPLIERS,
    INTERIOR_PACKAGE_BASE,
    BREAKDOWN_PERCENTAGES
)

class BreakdownEngine:
    @staticmethod
    def calculate_smart_breakdown(inputs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Implementation of 2026 Dynamic Cost Logic Order:
        1. Get base budget (based on plot)
        2. Apply bedroom adjustment (+₹3L per extra bedroom)
        3. Apply floor multiplier (1.12 if extra floor)
        4. Generate base 18-component breakdown
        5. Add optional features (if selected)
        6. Apply plan multiplier (Base / Classic / Premium / Elite)
        7. Recalculate total, compute percentages & sort descending
        """
        
        # 1. Get base budget from plot
        plot_size = inputs.get("dimensions", "30x40")
        base_type = "FULL" 
        if plot_size in ["40x60", "50x80", "60x80", "60x100"]:
            base_type = "DOUBLE"
            
        base_budget = OWN_HOUSE_PLOT_RULES.get(base_type, {}).get(plot_size, 6000000)
        
        # 2. Apply bedroom adjustment (+₹3L per extra bedroom)
        base_beds = OWN_HOUSE_PLOT_RULES[base_type].get("min_bedrooms", 3)
        current_beds = int(inputs.get("bedrooms", base_beds))
        extra_beds = max(0, current_beds - base_beds)
        bed_adjustment = extra_beds * EXTRA_BEDROOM_INCREASE
        running_total = base_budget + bed_adjustment
        
        # 3. Apply floor multiplier (1.12 if extra floor)
        floors = inputs.get("floor", "G+1")
        if floors == "G+2":
            running_total *= FLOOR_INCREASE_MULTIPLIER
        elif floors == "G+3":
            running_total *= (FLOOR_INCREASE_MULTIPLIER ** 2)

        # 3.5 Apply Inflation Factor (1.02% Increase)
        INFLATION_FACTOR = 1.0102
            
        # 4. Generate base 18-component breakdown (PRE-INFLATION)
        breakdown_items = []
        septic_cost = CORE_BREAKDOWN_COMPONENTS["Septic Tank"].get("amount", 50000)
        total_fixed = septic_cost
        variable_total = running_total - total_fixed
        total_ratio = sum(c.get("ratio", 0) for c in CORE_BREAKDOWN_COMPONENTS.values() if "ratio" in c)
        
        for name, data in CORE_BREAKDOWN_COMPONENTS.items():
            if "amount" in data:
                amt = data["amount"]
            else:
                ratio = data.get("ratio", 0)
                if total_ratio > 0:
                    amt = variable_total * (ratio / total_ratio)
                else:
                    amt = 0
            
            breakdown_items.append({
                "component": name,
                "category": data.get("category", "STRUCTURE"),
                "amount": round(amt, 2)
            })
            
        # 5. Add optional features (ONLY IF SELECTED)
        if inputs.get("include_compound"):
            breakdown_items.append({"component": "Compound Wall", "category": "EXTERIOR", "amount": OWN_HOUSE_ADDONS["compound_wall"]})
            
        if inputs.get("include_rainwater"):
            breakdown_items.append({"component": "Rainwater Harvesting", "category": "EXTERIOR", "amount": OWN_HOUSE_ADDONS["rainwater_harvesting"]})
            
        if inputs.get("include_parking"):
            breakdown_items.append({"component": "Car Parking Covering", "category": "EXTERIOR", "amount": OWN_HOUSE_ADDONS["car_parking"]})
            
        plan_type = inputs.get("structural_style", "Base")
        if inputs.get("include_interior"):
            interior_cost = INTERIOR_PACKAGE_BASE.get(plan_type, 0)
            if interior_cost > 0:
                breakdown_items.append({"component": f"Interior Finishing Package ({plan_type})", "category": "OPTIONAL", "amount": interior_cost})

        # 6. Apply plan multiplier (Base / Classic / Premium / Elite)
        multiplier = OWN_HOUSE_PLAN_MULTIPLIERS.get(plan_type, 1.0)
        total_pre_inflation = 0
        for item in breakdown_items:
            item["amount"] *= multiplier
            item["amount"] = round(item["amount"], 2)
            total_pre_inflation += item["amount"]
            
        # 7. Apply Inflation to the final multi-tiered total
        inflation_amount = total_pre_inflation * (INFLATION_FACTOR - 1)
        final_total = total_pre_inflation + inflation_amount

        # 8. Recalculate total, compute percentages & sort descending by amount
        # Percentage is relative to the total_pre_inflation so sum of percentages in grid is 100%
        if total_pre_inflation > 0:
            for item in breakdown_items:
                item["percentage"] = round((item["amount"] / total_pre_inflation) * 100, 2)
        
        sorted_breakdown = sorted(breakdown_items, key=lambda x: x["amount"], reverse=True)
            
        # Project Summary (STRICT FORMAT)
        summary = {
            "plot_size": plot_size,
            "bedrooms": f"{current_beds} BHK",
            "floors": floors,
            "plan": plan_type
        }
        family = inputs.get("family_count", None)
        if family: summary["members"] = f"{family} persons"
        summary["lift"] = "Included" if inputs.get("lift_required") else "Not Added"
        summary["pooja_room"] = "Included" if inputs.get("pooja_room") else "Not Added"
        interior_pkg = inputs.get("interior_package", "none")
        summary["interior"] = f"{interior_pkg.replace('_', ' ').title()} Package" if interior_pkg and interior_pkg != "none" else "Not Added"
        summary["compound_wall"] = "Included" if inputs.get("include_compound") else "Not Added"
        summary["rainwater_harvesting"] = "Included" if inputs.get("include_rainwater") else "Not Added"
        summary["car_parking"] = "Included" if inputs.get("include_parking") else "Not Added"

        return {
            "project_summary": summary,
            "total_cost": round(final_total, 2),
            "total_before_inflation": round(total_pre_inflation, 2),
            "inflation_amount": round(inflation_amount, 2),
            "breakdown": sorted_breakdown
        }

    @staticmethod
    def calculate_breakdown(total_cost: float) -> List[Dict[str, Any]]:
        """
        Fallback breakdown generator for generic project types (Rental, Villa, Commercial).
        Uses standard ratios from constants.
        """
        breakdown_list = []
        for name, ratio in BREAKDOWN_PERCENTAGES.items():
            amt = total_cost * ratio
            breakdown_list.append({
                "component": name,
                "category": "STRUCTURE",
                "amount": round(amt, 2),
                "percentage": round(ratio * 100, 2)
            })
        
        return sorted(breakdown_list, key=lambda x: x["amount"], reverse=True)
