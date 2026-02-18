from typing import List, Dict, Any

# ==================================================
# UPGRADE ENGINE: FEATURE CONFIGURATION
# ==================================================

FEATURE_COSTS = {
    "granite_flooring": 150000,
    "marble_flooring": 300000,
    "italian_marble": 600000,
    "premium_paint": 120000,
    "texture_paint": 200000,
    "branded_plumbing": 180000,
    "imported_plumbing": 350000,
    "modular_electrical": 150000,
    "stone_elevation": 250000,
    "false_ceiling": 120000,
    "smart_automation": 450000
}

TIER_FEATURES = {
    "Basic": ["granite_flooring"],
    "Classic": ["marble_flooring", "premium_paint"],
    "Premium": ["marble_flooring", "premium_paint", "branded_plumbing", "false_ceiling"],
    "Luxury": ["italian_marble", "texture_paint", "imported_plumbing", "modular_electrical", "stone_elevation", "false_ceiling"],
    "Luxury Plus": ["italian_marble", "texture_paint", "imported_plumbing", "modular_electrical", "stone_elevation", "false_ceiling", "smart_automation"]
}

class UpgradeEngine:
    """
    Configurable upgrade system for calculating incremental construction costs.
    Prevents double charging by identifying overlapping features.
    """

    @staticmethod
    def calculate_upgrade_difference(
        current_features: List[str],
        target_tier: str,
        current_total_cost: float = 0
    ) -> Dict[str, Any]:
        """
        Logic To Implement:
        1) Get features included in target tier.
        2) Compare with current_features.
        3) Identify missing_features = tier_features - current_features.
        4) Sum cost of missing_features only.
        5) Return structured output.
        """
        # Normalize tier name (handle 'Basic', 'Classic', 'Premium', 'Luxury', 'Luxury Plus')
        normalized_tier = target_tier.title() if target_tier else "Basic"
        if normalized_tier == "Base":
            normalized_tier = "Basic"
        
        # 1) Get features included in target tier
        target_features = TIER_FEATURES.get(normalized_tier, TIER_FEATURES["Basic"])
        
        current_set = set(current_features)
        target_set = set(target_features)
        
        # 2) Identify missing_features = tier_features - current_features
        # These are the ones we NEED to add to get to the target tier
        new_features_added = list(target_set - current_set)
        
        # 3) Identify overlapping_features (already selected)
        overlapping_features = list(target_set & current_set)
        
        # 4) Sum cost of missing_features only
        incremental_upgrade_cost = sum(FEATURE_COSTS.get(feature, 0) for feature in new_features_added)
        
        # 5) Ensure total cost increases or stays same (never decreases)
        new_total_cost = current_total_cost + incremental_upgrade_cost
        
        return {
            "current_features": current_features,
            "target_tier": normalized_tier,
            "new_features_added": new_features_added,
            "overlapping_features": overlapping_features,
            "incremental_upgrade_cost": incremental_upgrade_cost,
            "new_total_cost": round(new_total_cost, 2)
        }
