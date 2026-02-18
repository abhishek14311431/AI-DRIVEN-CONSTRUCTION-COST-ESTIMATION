from typing import Dict, List, Any, Optional, Tuple
from .utils.constants import MATERIAL_COSTS


def generate_upgrade_suggestions(
    breakdown: Dict[str, Any],
    current_tier: str,
    family_details: Optional[Dict[str, Any]] = None,
    lift_required: bool = False,
    project_type: str = "own_house"
) -> List[Dict[str, Any]]:
    """
    Generate upgrade suggestions based on current tier, breakdown, and project specifics.
    Prices scale with: bedrooms (more rooms = higher cost), family members, and lift requirement.
    """
    suggestions = []
    tiers = ["Basic", "Classic", "Premium", "Luxury", "Luxury Plus"]
    if project_type == "rental" and "Luxury" in tiers:
        tiers.remove("Luxury")
    if project_type == "rental" and "Luxury Plus" in tiers:
        tiers.remove("Luxury Plus")
        
    if current_tier not in tiers:
        current_tier = "Basic"
    current_index = tiers.index(current_tier)
    family_details = family_details or {}

    
    total_cost_with_lift = breakdown.get("final_cost", 0)
    lift_cost = breakdown.get("lift_cost", 0) if lift_required else 0
    base_cost_excl_lift = total_cost_with_lift - lift_cost

    TIER_PERCENTAGE_INCREASES = {
        "Classic": 0.18,  
        "Premium": 0.32,  
        "Luxury": 0.59,
        "Luxury Plus": 1.6
    }

    for i in range(current_index + 1, len(tiers)):
        next_tier = tiers[i]
        
        if next_tier in TIER_PERCENTAGE_INCREASES:
            percentage_increase = TIER_PERCENTAGE_INCREASES[next_tier]
            upgrade_cost = base_cost_excl_lift * percentage_increase
        else:
            upgrade_cost = calculate_upgrade_cost(
                breakdown, current_tier, next_tier, family_details, lift_required
            )

        savings = estimate_savings(breakdown, next_tier)
        benefits = get_tier_benefits(next_tier, project_type=project_type)

        suggestion = {
            "tier": next_tier,
            "upgrade_cost": round(upgrade_cost),
            "estimated_savings": savings,
            "roi_years": round(upgrade_cost / max(savings, 1), 1) if savings > 0 else "N/A",
            "benefits": benefits,
            "description": benefits[0] if benefits else f"Upgrade to {next_tier} tier",
        }
        suggestions.append(suggestion)

    return suggestions


def _get_factor_from_family(
    family_details: Dict[str, Any], lift_required: bool
) -> Tuple[float, float, float]:
    """
    Returns (room_factor, member_factor, lift_factor).
    - More rooms = higher upgrade cost (more area to cover)
    - More members = slightly higher (larger household)
    - Lift = extra cost when upgrading (premium lift finishes)
    """
    bedrooms_raw = family_details.get("bedrooms") or family_details.get("num_rooms") or "3"
    try:
        bedrooms = int(bedrooms_raw)
    except (ValueError, TypeError):
        bedrooms = 3
    if bedrooms <= 2:
        room_factor = 0.85
    elif bedrooms == 3:
        room_factor = 1.0
    elif bedrooms == 4:
        room_factor = 1.15
    else:
        room_factor = 1.25

    members_raw = (
        family_details.get("family-size")
        or family_details.get("total-members")
        or family_details.get("num_members")
        or "4"
    )
    try:
        members = int(members_raw)
    except (ValueError, TypeError):
        members = 4
    if members <= 2:
        member_factor = 0.9
    elif members <= 4:
        member_factor = 1.0
    elif members <= 6:
        member_factor = 1.08
    else:
        member_factor = 1.15

    lift_factor = 1.08 if lift_required else 1.0

    return room_factor, member_factor, lift_factor


def calculate_upgrade_cost(
    breakdown: Dict[str, Any],
    from_tier: str,
    to_tier: str,
    family_details: Optional[Dict[str, Any]] = None,
    lift_required: bool = False,
) -> float:
    """
    Calculate tier upgrade cost, scaled by rooms, members, and lift (Standard Area Method).
    """
    total_area = breakdown.get("total_area", 0) or 0
    family_details = family_details or {}

    materials_from = MATERIAL_COSTS.get(from_tier, MATERIAL_COSTS["Basic"])
    materials_to = MATERIAL_COSTS.get(to_tier, MATERIAL_COSTS["Classic"])

    base_cost_from = sum(materials_from.values()) * total_area
    base_cost_to = sum(materials_to.values()) * total_area
    base_upgrade = base_cost_to - base_cost_from

    room_factor, member_factor, lift_factor = _get_factor_from_family(
        family_details, lift_required
    )

    scaled_upgrade = base_upgrade * room_factor * member_factor * lift_factor
    return max(0, scaled_upgrade)


def estimate_savings(breakdown: Dict[str, Any], tier: str) -> float:
    """
    Estimate potential savings or value increase from upgrading to a tier.
    """
    base_cost = breakdown.get("final_cost", 0)
    tier_multipliers = {
        "Basic": 1.0,
        "Classic": 1.15,
        "Premium": 1.35,
        "Luxury": 1.6,
        "Luxury Plus": 2.2
    }

    value_increase = base_cost * (tier_multipliers[tier] - tier_multipliers.get(breakdown.get("selected_tier", "Basic"), 1.0))
    return value_increase * 0.1  


def get_tier_benefits(tier: str, project_type: str = "own_house") -> List[str]:
    
    is_rental = project_type == "rental"
    
    benefits = {
        "Classic": [
            "Premium Granite flooring for all areas",
            "External Granite Stairs with standard polish" if is_rental else "Granite stairs with standard polish (External/Internal)",
            "Better quality fixtures and fittings (Rental Durable)" if is_rental else "Better quality fixtures and fittings",
            "Improved durability and longevity"
        ],
        "Premium": [
            "Italian Marble flooring for main areas",
            "Superior External Granite for stairs and common areas" if is_rental else "Superior Granite for stairs and common areas",
            "Premium electrical and plumbing fixtures (Long-term rental)" if is_rental else "Premium electrical and plumbing fixtures",
            "Advanced security systems for multi-unit safety" if is_rental else "Advanced security systems"
        ],
        "Luxury": [
            "Designer finishes and custom luxury elements",
            "Smart home automation",
            "Ultra-premium appliances and fixtures",
            "State-of-the-art amenities"
        ],
        "Luxury Plus": [
            "Complete Smart Ecosystem & AI Control",
            "Biometric Security & Surveillance",
            "High-End Wellness & Spa Features",
            "Solar Energy & Climate Control Optimization"
        ]
    }
    return benefits.get(tier, [])


def get_ai_explanation_for_upgrades(upgrade_suggestions: List[Dict[str, Any]], breakdown: Dict[str, Any]) -> str:
    """
    Generate detailed AI explanation for upgrade suggestions.
    """
    if not upgrade_suggestions:
        return "Your current tier selection is already at the highest level. No upgrades are available."

    explanation = f"Based on your current {breakdown.get('selected_tier', 'Basic')} tier selection, here are some upgrade recommendations:\n\n"

    for suggestion in upgrade_suggestions:
        explanation += f"**Upgrade to {suggestion['tier']} Tier:**\n"
        explanation += f"- Upgrade Cost: ₹{suggestion['upgrade_cost']:,}\n"
        explanation += f"- Estimated Annual Value Increase: ₹{suggestion['estimated_savings']:,}\n"
        explanation += f"- ROI Period: {suggestion['roi_years']} years\n"
        explanation += "- Benefits:\n"
        for benefit in suggestion['benefits']:
            explanation += f"  • {benefit}\n"
        explanation += "\n"

    explanation += "**Recommendation:** Consider upgrading if you plan to stay in the property long-term or if resale value is important. Higher tiers offer better quality materials, increased property value, and potential rental income improvements."

    return explanation
