from app.core.constants import (
    RENTAL_SITE_TYPES,
    RENTAL_PLAN_MULTIPLIERS,
    RENTAL_BREAKDOWN_RATIOS,
    ZONE_MULTIPLIER
)

class RentalEngine:
    @staticmethod
    def estimate_cost(data: dict) -> dict:
        """
        Estimate rental home construction cost based on:
        - Site type (Half/Full/Double Site)
        - Dimensions (specific to each site type)
        - Floors (G+1, G+2, G+3, or G+N for custom)
        - Plan level (Base/Classic/Premium)
        - Zone (A/B/C) for location-based pricing
        
        Returns structured response with:
        - Auto-assigned unit type based on site type
        - Semi-interior finishing details
        - External staircase details
        - Detailed cost breakdown (sorted descending)
        """
        
        site_type = data.get('site_type')
        dimensions = data.get('dimensions')
        floors = data.get('floors')  # Now using 'floors' instead of 'floor'
        plan = data.get('plan', 'Base')
        zone = data.get('zone', 'B')
        
        # Validate inputs
        if site_type not in RENTAL_SITE_TYPES:
            raise ValueError(f"Invalid site type: {site_type}")
        
        site_config = RENTAL_SITE_TYPES[site_type]
        if dimensions not in site_config['dimensions']:
            raise ValueError(f"Invalid dimensions '{dimensions}' for {site_type}")
        
        if plan not in RENTAL_PLAN_MULTIPLIERS:
            raise ValueError(f"Invalid plan: {plan}. Must be one of: Base, Classic, Premium")
        
        if zone not in ["A", "B", "C"]:
            raise ValueError(f"Invalid zone: {zone}. Must be one of: A, B, C")
        
        # Step 1: Get base cost for G+1 from dimensions
        base_g1_cost = float(site_config['dimensions'][dimensions]['base_cost_g1'])
        
        # Step 2: Parse and apply floor multiplier
        floor_cost = RentalEngine._calculate_floor_cost(base_g1_cost, floors)
        
        # Step 3: Apply plan multiplier (Base 1.0, Classic 1.10, Premium 1.20)
        plan_multiplier = RENTAL_PLAN_MULTIPLIERS.get(plan, 1.0)
        planned_cost = floor_cost * plan_multiplier
        
        # Step 4: Apply zone multiplier for location
        zone_multiplier = ZONE_MULTIPLIER.get(zone, 1.0)
        total_cost = planned_cost * zone_multiplier
        
        # Step 5: Generate breakdown (11 components for rental homes)
        breakdown = RentalEngine._calculate_breakdown(total_cost)
        
        # Get unit details (auto-assigned based on site type)
        unit_type = site_config['unit_type']
        bedrooms = site_config['bedrooms']
        bathrooms = site_config['bathrooms']
        
        return {
            "project_type": "Rental Homes",
            "site_type": site_type,
            "dimensions": dimensions,
            "floors": floors,
            "unit_type": unit_type,
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "plan": plan,
            "semi_interior": True,
            "external_staircase": True,
            "total_cost": round(total_cost, 2),
            "breakdown": breakdown
        }
    
    @staticmethod
    def _calculate_floor_cost(base_g1_cost: float, floors: str) -> float:
        """
        Calculate cost based on floor level.
        
        Reference pricing (Half Site):
        G+1: 22 Lakhs
        G+2: 30 Lakhs
        G+3: 38-39 Lakhs
        Extra floors: 7-8 Lakhs each
        
        This translates to approximate multipliers:
        G+1: 1.00x base
        G+2: 1.36x base (approximately 30L / 22L)
        G+3: 1.77x base (approximately 38L / 22L)
        G+4+: base + (levels - 1) * extra_cost
        """
        if not floors.startswith("G+"):
            raise ValueError(f"Invalid floor format: {floors}. Expected format: G+1, G+2, G+3, etc.")
        
        try:
            floor_level = int(floors.split("+")[1])
        except (ValueError, IndexError):
            raise ValueError(f"Invalid floor format: {floors}")
        
        if floor_level < 1:
            raise ValueError(f"Floor level must be >= 1")
        
        # Apply floor multipliers based on parking specifications
        if floor_level == 1:
            return base_g1_cost * 1.00
        elif floor_level == 2:
            return base_g1_cost * 1.36  # ~36% increase
        elif floor_level == 3:
            return base_g1_cost * 1.77  # ~77% increase
        else:
            # For G+4 and above: G+3 cost + (7-8 lakhs per extra floor)
            # Approximate: 77% of base + 35-40% per extra floor
            g3_cost = base_g1_cost * 1.77
            extra_floors = floor_level - 3
            # Extra floor cost is approximately 35% of base cost per floor
            extra_cost_per_floor = base_g1_cost * 0.35
            return g3_cost + (extra_floors * extra_cost_per_floor)
    
    @staticmethod
    def _calculate_breakdown(total_cost: float) -> list:
        """
        Calculate simplified 11-component cost breakdown for rental homes.
        Components:
        1. Excavation & Foundation
        2. RCC Structure
        3. Brickwork
        4. Plastering
        5. Flooring
        6. Plumbing
        7. Electrical
        8. Bathrooms
        9. Staircase (external)
        10. Exterior Finish
        11. Terrace Waterproofing
        
        Returns list sorted by cost in descending order.
        """
        breakdown_items = []
        
        for component, ratio in RENTAL_BREAKDOWN_RATIOS.items():
            amount = total_cost * ratio
            
            # Determine category for frontend display
            if component in ["Excavation & Foundation", "RCC Structure", "Brickwork", "Plastering"]:
                category = "STRUCTURE"
            elif component in ["Plumbing", "Electrical"]:
                category = "UTILITIES"
            elif component in ["Bathrooms"]:
                category = "BATHROOM"
            elif component in ["Flooring"]:
                category = "FLOORING"
            elif component in ["Staircase", "Exterior Finish", "Terrace Waterproofing"]:
                category = "EXTERIOR"
            else:
                category = "STRUCTURE"
            
            breakdown_items.append({
                "component": component,
                "amount": round(amount, 2),
                "percentage": round(ratio * 100, 1),
                "category": category
            })
        
        # Sort by cost in descending order (most expensive first)
        breakdown_items.sort(key=lambda x: x['amount'], reverse=True)
        
        return breakdown_items
