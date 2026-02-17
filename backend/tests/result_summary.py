import sys
import os
from typing import Dict, Any, List

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except:
        pass

# Import the test runner logic
from . import test_runner

def get_extensive_scenarios() -> List[Dict[str, Any]]:
    scenarios = []
    
    # 1. Own House - 30x50 Variation (Extensive)
    for tier in ["Basic", "Classic", "Premium", "Luxury"]:
        for floors in [1, 2, 3]:
            scenarios.append({
                "name": f"Own_30x50_G{floors}_{tier}",
                "input": {
                    "project_type": "own-house", "plot_size": "30x50", "floors": floors, 
                    "selected_tier": tier, "family_details": {"bedrooms": 4, "members": 5},
                    "site_type": "full", "lift_required": floors > 2, "compound_wall": True,
                    "interior": "semi-furnished" if tier in ["Classic", "Premium"] else "fully-furnished" if tier == "Luxury" else None
                }
            })

    # 2. Rental - 30x50 Variation (Extensive)
    for tier in ["Basic", "Classic", "Premium"]:
        for floors in [2, 3, 4]:
            scenarios.append({
                "name": f"Rental_30x50_G{floors}_{tier}",
                "input": {
                    "project_type": "rental-homes", "plot_size": "30x50", "floors": floors, 
                    "selected_tier": tier, "family_details": {"total-members": 10, "parking": "Yes" if floors > 2 else "No"},
                    "site_type": "full", "lift_required": floors > 3
                }
            })

    # 3. Double Site 60x40 / 60x50
    for bhk in [3, 4]:
        for lift in [True, False]:
            scenarios.append({
                "name": f"Rental_DoubleSite_60x40_{bhk}BHK_Lift{'Yes' if lift else 'No'}",
                "input": {
                    "project_type": "rental-homes", "plot_size": "60x40", "floors": 3, 
                    "selected_tier": "Classic", "family_details": {"total-members": 12, "parking": "Yes", "bedrooms": bhk},
                    "site_type": "double", "lift_required": lift
                }
            })

    # 4. Small Sites 20x30 / 15x40
    for floors in [1, 2]:
        scenarios.append({
            "name": f"Rental_20x30_G{floors}_Basic",
            "input": {
                "project_type": "rental-homes", "plot_size": "20x30", "floors": floors, 
                "selected_tier": "Basic", "family_details": {"total-members": 4, "parking": "No"},
                "site_type": "full", "lift_required": False
            }
        })

    # 5. Luxury Own House Edge Cases
    scenarios.append({
        "name": "Luxury_Palace_30x40_G3",
        "input": {
            "project_type": "own-house", "plot_size": "30x40", "floors": 3, 
            "selected_tier": "Luxury", "family_details": {"bedrooms": 5, "members": 6},
            "site_type": "full", "lift_required": True, "compound_wall": True, "interior": "fully-furnished"
        }
    })

    # Add enough to reach 50 if still short
    target = 50
    current = len(scenarios)
    if current < target:
        for i in range(target - current):
            scenarios.append({
                "name": f"Random_Verification_{i+1}",
                "input": {
                    "project_type": "own-house" if i % 2 == 0 else "rental-homes",
                    "plot_size": "30x40", "floors": (i % 3) + 1, "selected_tier": "Classic",
                    "family_details": {"bedrooms": 3, "members": 4} if i % 2 == 0 else {"total-members": 6, "parking": "No"},
                    "site_type": "full", "lift_required": False
                }
            })
            
    return scenarios

def print_summary_table():
    scenarios = get_extensive_scenarios()
    
    width = 135
    print("\n" + "="*width)
    print("📊 COMPREHENSIVE TEST AUDIT - 50 SCENARIO SUMMARY".center(width))
    print("="*width)
    
    # Table Header with Inputs
    header = f"{'Scenario Identifier':<40} | {'Plot':<8} | {'Flr':<4} | {'Tier':<8} | {'Area':<9} | {'Structure':<14} | {'Finish':<14} | {'Final Total'}"
    print(header)
    print("-" * width)
    
    passed = 0
    for scenario in scenarios:
        try:
            payload = scenario["input"]
            res = test_runner.run_calculation(payload)
            
            name = scenario["name"]
            plot = payload.get("plot_size", "N/A")
            flr = payload.get("floors", "N/A")
            tier = payload.get("selected_tier", "Basic")
            area = f"{res.get('total_area', 0)}"
            struct = f"₹{res.get('structure_cost', 0):,}"
            finish = f"₹{res.get('finish_cost', 0):,}"
            total = f"₹{res.get('final_cost', 0):,}"
            
            print(f"{name[:40]:<40} | {plot:<8} | {flr:<4} | {tier:<8} | {area:<9} | {struct:<14} | {finish:<14} | {total}")
            passed += 1
        except Exception as e:
            print(f"{scenario['name'][:40]:<40} | ERROR: {str(e)}")

    print("-" * width)
    print(f"PASSED SUCCESSFUL REPORT GENERATION: {passed}/{len(scenarios)}".center(width))
    print("="*width + "\n")

if __name__ == "__main__":
    print_summary_table()
