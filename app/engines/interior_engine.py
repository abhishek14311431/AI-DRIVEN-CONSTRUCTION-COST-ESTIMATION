class InteriorEngine:
    STYLE_MULTIPLIER = {
        "modern": 1.0,
        "contemporary": 1.05,
        "scandinavian": 1.08,
        "transitional": 1.1,
        "industrial": 1.12,
        "farmhouse": 1.08,
        "rustic": 1.12,
        "traditional": 1.1,
        "victorian": 1.2,
        "french-country": 1.18,
        "mid-century-modern": 1.14,
        "mediterranean": 1.16,
        "coastal": 1.07,
        "craftsman": 1.11,
        "eclectic": 1.13,
        "asian": 1.12,
        "southwestern": 1.09,
        "shabby-chic-style": 1.06,
        "tropical": 1.1,
    }

    FINISH_RATE = {
        "budget": 850,
        "standard": 1100,
        "premium": 1450,
    }

    @staticmethod
    def estimate_cost(data: dict) -> dict:
        total_sqft = float(data.get("total_sqft", 1000))
        style = str(data.get("style", "modern")).strip().lower()
        finish_level = str(data.get("finish_level", "standard")).strip().lower()

        base_rate = InteriorEngine.FINISH_RATE.get(finish_level, 1100)
        style_factor = InteriorEngine.STYLE_MULTIPLIER.get(style, 1.0)

        civil_and_finish = total_sqft * base_rate * style_factor
        false_ceiling = total_sqft * 120 if data.get("include_false_ceiling", True) else 0
        modular_kitchen = 180000 if data.get("include_modular_kitchen", True) else 0
        wardrobes = total_sqft * 85 if data.get("include_wardrobes", True) else 0

        total_cost = round(civil_and_finish + false_ceiling + modular_kitchen + wardrobes, 2)

        parts = [
            ("Interior Civil & Finish", "FINISH", civil_and_finish),
            ("False Ceiling", "OPTIONAL", false_ceiling),
            ("Modular Kitchen", "OPTIONAL", modular_kitchen),
            ("Wardrobes & Storage", "OPTIONAL", wardrobes),
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
            "project_type": "interior",
            "style": style,
            "finish_level": finish_level,
            "total_sqft": total_sqft,
            "total_cost": total_cost,
            "breakdown": breakdown,
        }
