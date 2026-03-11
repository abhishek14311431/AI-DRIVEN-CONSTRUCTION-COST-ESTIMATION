class ExteriorEngine:
    STYLE_RATE = {
        "modern": 520,
        "contemporary": 560,
        "scandinavian": 510,
        "transitional": 540,
        "industrial": 590,
        "farmhouse": 500,
        "rustic": 530,
        "traditional": 550,
        "victorian": 660,
        "french-country": 630,
        "mid-century-modern": 575,
        "mediterranean": 620,
        "coastal": 535,
        "craftsman": 565,
        "eclectic": 600,
        "asian": 580,
        "southwestern": 545,
        "shabby-chic-style": 505,
        "tropical": 555,
    }

    @staticmethod
    def estimate_cost(data: dict) -> dict:
        total_sqft = float(data.get("total_sqft", 1200))
        style = str(data.get("style", "modern")).strip().lower()

        shell_finish = total_sqft * ExteriorEngine.STYLE_RATE.get(style, 520)
        compound_wall = 120000 if data.get("include_compound_wall", True) else 0
        waterproofing = 85000 if data.get("include_waterproofing", True) else 0
        main_gate = 60000 if data.get("include_gate", True) else 0
        elevation = 145000 if data.get("include_elevation", True) else 0
        landscaping = 95000 if data.get("include_landscaping", False) else 0

        total_cost = round(
            shell_finish + compound_wall + waterproofing + main_gate + elevation + landscaping,
            2,
        )

        parts = [
            ("Exterior Finish Shell", "EXTERIOR", shell_finish),
            ("Compound Wall", "EXTERIOR", compound_wall),
            ("Terrace & External Waterproofing", "EXTERIOR", waterproofing),
            ("Main Gate", "EXTERIOR", main_gate),
            ("Elevation Treatment", "EXTERIOR", elevation),
            ("Landscape & Hardscape", "EXTERIOR", landscaping),
        ]

        breakdown = []
        for component, category, amount in parts:
            if amount <= 0:
                continue
            pct = round((amount / total_cost) * 100, 2) if total_cost else 0
            breakdown.append({
                "component": component,
                "category": category,
                "amount": round(amount, 2),
                "percentage": pct,
            })

        return {
            "project_type": "exterior",
            "style": style,
            "total_sqft": total_sqft,
            "total_cost": total_cost,
            "breakdown": breakdown,
        }
