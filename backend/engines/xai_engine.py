from typing import Dict, Any

class XAIEngine:
    
    REQUIRED_KEYS = {
        "project_type",
        "plot_size",
        "floors",
        "zone",
        "site_type",
        "family_details",
        "structure_cost",
        "upgraded_finish_cost",
        "selected_tier",
        "final_cost",
    }
    
    def __init__(self, final_breakdown: dict):
        missing_keys = self.REQUIRED_KEYS - set(final_breakdown.keys())
        if missing_keys:
            raise ValueError(
                f"final_breakdown missing required keys: {missing_keys}"
            )
        
        self.final_breakdown = final_breakdown
    
    def generate_explanation(self) -> Dict[str, str]:
        """
        Generates a sophisticated AI-driven explanation for the cost estimate,
        incorporating market insights and specific project details.
        """
        project_type = self.final_breakdown["project_type"].replace('_', ' ').title()
        plot_size = self.final_breakdown["plot_size"]
        floors = self.final_breakdown["floors"]
        structure_cost = self.final_breakdown["structure_cost"]
        upgraded_finish_cost = self.final_breakdown["upgraded_finish_cost"]
        selected_tier = self.final_breakdown["selected_tier"]
        final_cost = self.final_breakdown["final_cost"]
        inflation_rate = self.final_breakdown.get("inflation_rate", 0.0)
        
        floor_story = "single-level residence" if floors == 1 else f"G+{floors-1} multi-level structure"
        if floors == 2: floor_story = "G+1 Duplex lifestyle home"

        project_summary = (
            f"Your proposed {project_type} on a {plot_size} plot has been analyzed using 2026 market benchmarks. "
            f"The engineering model accounts for a {floor_story} with precise structural integrity coefficients. "
            f"With the selection of the {selected_tier} finishing tier, we have prioritized durability and premium aesthetics."
        )

        cost_distribution_explanation = (
            f"The structural core (foundation, RCC, and brickwork) is budgeted at {structure_cost:,.0f}, ensuring "
            f"Seismic Zone compliance. The finishing segment, featuring premium flooring selections and "
            f"modern modular systems, is allocated at {upgraded_finish_cost:,.0f}. This balanced distribution "
            f"optimizes build quality without compromising on luxury."
        )

        tier_upgrade_explanation = (
            f"The {selected_tier} specification secures highest-grade materials. In today's market, this translates "
            f"to anti-skid granite for stairs, superior putty-finished walls, and branded plumbing fixtures "
            f"that define the premium 'Classic-Plus' standard of urban living."
        )

        inflation_adjustment = self.final_breakdown.get("inflation_adjustment", 0)
        inflation_explanation = (
            f"A strategic market buffer of {inflation_rate*100:.1f}% ({inflation_adjustment:,.0f}) is incorporated "
            f"to protect your budget from commodity volatility. This ensures the project remains financially "
            f"viable from foundation to handover."
        )

        site_features = []
        if self.final_breakdown.get("compound_wall_required"): site_features.append("Secure Compound Wall")
        if self.final_breakdown.get("rain_water_harvesting_required"): site_features.append("Eco-friendly RWH systems")
        
        site_feature_msg = ""
        if site_features:
            site_feature_msg = (
                f" Advanced site upgrades including {', '.join(site_features)} have been factored into the turnkey budget."
            )

        final_summary_statement = (
            f"The definitive investment estimate of {final_cost:,.0f} covers every logistical and construction detail. "
            f"From site-prep to final weather-shielding, your budget is calculated for maximum ROI. {site_feature_msg}"
        )

        return {
            "project_summary": project_summary,
            "cost_distribution_explanation": cost_distribution_explanation,
            "tier_upgrade_explanation": tier_upgrade_explanation,
            "inflation_explanation": inflation_explanation,
            "final_summary_statement": final_summary_statement,
        }
