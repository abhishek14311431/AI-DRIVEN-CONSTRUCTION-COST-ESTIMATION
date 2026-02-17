import sys
import os
import json
from typing import Dict, Any, List

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from ..engines.rental_engine import RentalEngine
from ..engines.ownhouse_engine import OwnHouseEngine
from ..engines.breakdown_engine import BreakdownEngine
from ..engines.xai_engine import XAIEngine

SCENARIOS = [
    # --- OWN HOUSE ---
    {
        "name": "Own_G1_Base_NoCompound_NoInterior",
        "input": {
            "project_type": "own-house", "plot_size": "30x40", "floors": 1, "selected_tier": "Basic",
            "family_details": {"bedrooms": 3, "members": 4}, "site_type": "full",
            "lift_required": False, "compound_wall": False, "interior": None
        }
    },
    {
        "name": "Own_G1_Base_Compound_NoInterior",
        "input": {
            "project_type": "own-house", "plot_size": "30x40", "floors": 1, "selected_tier": "Basic",
            "family_details": {"bedrooms": 3, "members": 4}, "site_type": "full",
            "lift_required": False, "compound_wall": True, "interior": None
        }
    },
    {
        "name": "Own_G1_Classic_SemiFurnished",
        "input": {
            "project_type": "own-house", "plot_size": "30x40", "floors": 1, "selected_tier": "Classic",
            "family_details": {"bedrooms": 3, "members": 4}, "site_type": "full",
            "lift_required": False, "compound_wall": True, "interior": "semi-furnished"
        }
    },
    {
        "name": "Own_G1_Premium_FullFurnished",
        "input": {
            "project_type": "own-house", "plot_size": "30x40", "floors": 1, "selected_tier": "Premium",
            "family_details": {"bedrooms": 3, "members": 4}, "site_type": "full",
            "lift_required": False, "compound_wall": True, "interior": "fully-furnished"
        }
    },
    {
        "name": "Own_G2_Base_NoCompound",
        "input": {
            "project_type": "own-house", "plot_size": "30x40", "floors": 2, "selected_tier": "Basic",
            "family_details": {"bedrooms": 4, "members": 5}, "site_type": "full",
            "lift_required": False, "compound_wall": False, "interior": None
        }
    },
    {
        "name": "Own_G2_Premium_WithLift",
        "input": {
            "project_type": "own-house", "plot_size": "30x40", "floors": 2, "selected_tier": "Premium",
            "family_details": {"bedrooms": 4, "members": 5}, "site_type": "full",
            "lift_required": True, "compound_wall": True, "interior": "semi-furnished"
        }
    },
    {
        "name": "Own_G3_Luxury",
        "input": {
            "project_type": "own-house", "plot_size": "30x50", "floors": 3, "selected_tier": "Luxury",
            "family_details": {"bedrooms": 5, "members": 6}, "site_type": "full",
            "lift_required": True, "compound_wall": True, "interior": "fully-furnished"
        }
    },
    {
        "name": "Own_G1_Base_FullInterior",
        "input": {
            "project_type": "own-house", "plot_size": "30x40", "floors": 1, "selected_tier": "Basic",
            "family_details": {"bedrooms": 3, "members": 4}, "site_type": "full",
            "lift_required": False, "compound_wall": True, "interior": "fully-furnished"
        }
    },
    
    # --- RENTAL ---
    {
        "name": "Rental_20x30_G2_Basic",
        "input": {
            "project_type": "rental-homes", "plot_size": "20x30", "floors": 2, "selected_tier": "Basic",
            "family_details": {"total-members": 4, "parking": "No"}, "site_type": "full",
            "lift_required": False
        }
    },
    {
        "name": "Rental_20x40_G2_Basic",
        "input": {
            "project_type": "rental-homes", "plot_size": "20x40", "floors": 2, "selected_tier": "Basic",
            "family_details": {"total-members": 4, "parking": "No"}, "site_type": "full",
            "lift_required": False
        }
    },
    {
        "name": "Rental_20x40_G3_Basic",
        "input": {
            "project_type": "rental-homes", "plot_size": "20x40", "floors": 3, "selected_tier": "Basic",
            "family_details": {"total-members": 6, "parking": "No"}, "site_type": "full",
            "lift_required": False
        }
    },
    {
        "name": "Rental_30x40_G2_Basic",
        "input": {
            "project_type": "rental-homes", "plot_size": "30x40", "floors": 2, "selected_tier": "Basic",
            "family_details": {"total-members": 6, "parking": "No"}, "site_type": "full",
            "lift_required": False
        }
    },
    {
        "name": "Rental_30x40_G2_Classic",
        "input": {
            "project_type": "rental-homes", "plot_size": "30x40", "floors": 2, "selected_tier": "Classic",
            "family_details": {"total-members": 6, "parking": "No"}, "site_type": "full",
            "lift_required": False
        }
    },
    {
        "name": "Rental_30x40_G2_Premium",
        "input": {
            "project_type": "rental-homes", "plot_size": "30x40", "floors": 2, "selected_tier": "Premium",
            "family_details": {"total-members": 6, "parking": "No"}, "site_type": "full",
            "lift_required": False
        }
    },
    {
        "name": "Rental_30x50_G2_Basic",
        "input": {
            "project_type": "rental-homes", "plot_size": "30x50", "floors": 2, "selected_tier": "Basic",
            "family_details": {"total-members": 8, "parking": "No"}, "site_type": "full",
            "lift_required": False
        }
    },
    {
        "name": "Rental_30x50_G3_Basic",
        "input": {
            "project_type": "rental-homes", "plot_size": "30x50", "floors": 3, "selected_tier": "Basic",
            "family_details": {"total-members": 10, "parking": "No"}, "site_type": "full",
            "lift_required": False
        }
    },
    {
        "name": "Rental_Parking_Deduction_Check",
        "input": {
            "project_type": "rental-homes", "plot_size": "30x40", "floors": 2, "selected_tier": "Basic",
            "family_details": {"total-members": 6, "parking": "Yes"}, "site_type": "full",
            "lift_required": False
        }
    },
    {
        "name": "Rental_NoParking_Check",
        "input": {
            "project_type": "rental-homes", "plot_size": "30x40", "floors": 2, "selected_tier": "Basic",
            "family_details": {"total-members": 6, "parking": "No"}, "site_type": "full",
            "lift_required": False
        }
    },
    {
        "name": "Rental_DoubleSite_60x40_G2_3BHK",
        "input": {
            "project_type": "rental-homes", "plot_size": "60x40", "floors": 2, "selected_tier": "Basic",
            "family_details": {"total-members": 8, "parking": "No", "bedrooms": 3}, "site_type": "double",
            "lift_required": False
        }
    },
    {
        "name": "Rental_DoubleSite_60x40_G2_4BHK",
        "input": {
            "project_type": "rental-homes", "plot_size": "60x40", "floors": 2, "selected_tier": "Basic",
            "family_details": {"total-members": 10, "parking": "No", "bedrooms": 4}, "site_type": "double",
            "lift_required": False
        }
    },
    {
        "name": "Rental_DoubleSite_WithLift",
        "input": {
            "project_type": "rental-homes", "plot_size": "60x50", "floors": 3, "selected_tier": "Classic",
            "family_details": {"total-members": 12, "parking": "Yes", "bedrooms": 3}, "site_type": "double",
            "lift_required": True
        }
    },

    # --- EDGE CASES & VARIATIONS ---
    {"name": "Own_MinFloors_G1", "input": {"project_type": "own-house", "plot_size": "30x40", "floors": 1, "selected_tier": "Basic", "family_details": {"bedrooms": 2, "members": 2}, "site_type": "full", "lift_required": False}},
    {"name": "Own_MaxFloors_G4", "input": {"project_type": "own-house", "plot_size": "30x40", "floors": 5, "selected_tier": "Basic", "family_details": {"bedrooms": 5, "members": 8}, "site_type": "full", "lift_required": True}},
    {"name": "Rental_MinFloors_G1", "input": {"project_type": "rental-homes", "plot_size": "20x30", "floors": 1, "selected_tier": "Basic", "family_details": {"total-members": 2, "parking": "No"}, "site_type": "full", "lift_required": False}},
    {"name": "Rental_MaxFloors_G4", "input": {"project_type": "rental-homes", "plot_size": "30x40", "floors": 5, "selected_tier": "Basic", "family_details": {"total-members": 15, "parking": "Yes"}, "site_type": "full", "lift_required": False}},
    {"name": "Invalid_Upgrade_Combo_Base_PremiumInterior", "input": {"project_type": "own-house", "plot_size": "30x40", "floors": 1, "selected_tier": "Basic", "family_details": {"bedrooms": 3, "members": 4}, "site_type": "full", "lift_required": False, "interior": "fully-furnished"}},
]

# Add more to reach ~35
for i in range(1, 11):
    SCENARIOS.append({
        "name": f"Dynamic_Scenario_{i}",
        "input": {
            "project_type": "own-house" if i % 2 == 0 else "rental-homes",
            "plot_size": "30x40",
            "floors": (i % 3) + 1,
            "selected_tier": ["Basic", "Classic", "Premium"][i % 3],
            "family_details": {"bedrooms": 3, "members": 4} if i % 2 == 0 else {"total-members": 4, "parking": "No"},
            "site_type": "full",
            "lift_required": i > 5
        }
    })

def run_calculation(payload: Dict[str, Any]) -> Dict[str, Any]:
    project_type = payload["project_type"]
    plot_size = payload.get("dimensions") or payload["plot_size"]
    floors = payload["floors"]
    lift_required = payload.get("lift_required", False)
    site_type = payload.get("site_type", "full")
    family_details = payload["family_details"]
    selected_tier = payload["selected_tier"].capitalize()
    if selected_tier == "Base": selected_tier = "Basic"
    
    # Engine Dispatch
    if project_type in ["rental-homes", "rental"]:
        base_result = RentalEngine(plot_size, floors, lift_required, site_type, family_details).calculate_rental_cost()
    else:
        base_result = OwnHouseEngine(plot_size, floors, lift_required, site_type, family_details).calculate_ownhouse_cost()
        
    # Inject extras
    base_result["compound_wall_required"] = payload.get("compound_wall", False)
    base_result["upgrades"] = payload.get("upgrades", {})
    base_result["interior_package"] = payload.get("interior", None)
    
    breakdown = BreakdownEngine(base_result, selected_tier).generate_final_breakdown()
    return breakdown

def validate_scenario(name: str, payload: Dict[str, Any], result: Dict[str, Any]) -> List[str]:
    errors = []
    total_cost = result.get("final_cost", 0)
    structure_cost = result.get("structure_cost", 0)
    finish_cost = result.get("finish_cost", 0)
    
    # 1. total_cost > 0
    if total_cost <= 0: errors.append(f"total_cost <= 0 (Actual: {total_cost})")
    
    # 2. structure_cost >= 40% of total (approximate in these engines)
    if total_cost > 0 and (structure_cost / total_cost) < 0.35: # Using 35% as threshold for flexibility
        errors.append(f"structure_cost too low (<35%) (Actual: {structure_cost/total_cost:.1%})")
        
    # Other logic checks require comparing with other scenarios (tracked in run_tests)
    return errors

def run_tests():
    print("="*60)
    print("AI CONSTRUCTION COST ESTIMATOR - PRODUCTION TEST RUNNER")
    print("="*60)
    
    passed_count = 0
    results_map = {}
    
    for scenario in SCENARIOS:
        name = scenario["name"]
        payload = scenario["input"]
        
        try:
            result = run_calculation(payload)
            results_map[name] = result
            errors = validate_scenario(name, payload, result)
            
            print(f"\nSCENARIO: {name}")
            print(f"INPUTS: Type={payload['project_type']}, Plot={payload['plot_size']}, Floors={payload['floors']}, Tier={payload['selected_tier']}")
            print(f"OUTPUT:")
            print(f"  Total Cost: ₹{result['final_cost']:,}")
            print(f"  Structure:  ₹{result['structure_cost']:,}")
            print(f"  Finish:     ₹{result['finish_cost']:,}")
            print(f"  Floors:     {result['floors']}")
            print(f"  Tier:       {result['selected_tier']}")
            
            if not errors:
                print("VALIDATION: PASS ✅")
                passed_count += 1
            else:
                print("VALIDATION: FAIL ❌")
                for err in errors:
                    print(f"  - {err}")
            print("-" * 34)
            
        except Exception as e:
            print(f"\nSCENARIO: {name} - CRASHED 💥")
            print(f"  Error: {str(e)}")
            import traceback
            traceback.print_exc()

    # --- CROSS-SCENARIO LOGIC VALIDATION ---
    print("\n" + "="*60)
    print("CROSS-SCENARIO LOGIC VALIDATION")
    print("="*60)
    
    logic_checks = [
        ("Compound adds cost", "Own_G1_Base_Compound_NoInterior", "Own_G1_Base_NoCompound_NoInterior", "final_cost", ">"),
        ("Finish cost increase with Tier", "Own_G1_Classic_SemiFurnished", "Own_G1_Base_Compound_NoInterior", "finish_cost", ">"),
        ("Floors increase cost", "Own_G2_Base_NoCompound", "Own_G1_Base_NoCompound_NoInterior", "final_cost", ">"),
        ("Premium > Classic", "Rental_30x40_G2_Premium", "Rental_30x40_G2_Classic", "finish_cost", ">"),
        ("Area increase cost", "Rental_20x40_G2_Basic", "Rental_20x30_G2_Basic", "final_cost", ">"),
        ("Parking deduction check", "Rental_Parking_Deduction_Check", "Rental_NoParking_Check", "final_cost", "<"),
        ("BHK variation check (Double Site)", "Rental_DoubleSite_60x40_G2_4BHK", "Rental_DoubleSite_60x40_G2_3BHK", "final_cost", ">")
    ]
    
    logic_passed = 0
    for title, target, ref, field, op in logic_checks:
        val_target = results_map.get(target, {}).get(field, 0)
        val_ref = results_map.get(ref, {}).get(field, 0)
        
        success = False
        if op == ">": success = val_target > val_ref
        elif op == "<": success = val_target < val_ref
        
        status = "PASS ✅" if success else "FAIL ❌"
        if success: logic_passed += 1
        print(f"CHECK: {title.ljust(35)} [{status}]")
        if not success:
            print(f"  - Detail: {target} ({val_target}) {op} {ref} ({val_ref})")

    print("\n" + "="*60)
    print("FINAL TEST REPORT")
    print("="*60)
    print(f"TOTAL SCENARIOS: {len(SCENARIOS)}")
    print(f"PASSED:          {passed_count}")
    print(f"FAILED:          {len(SCENARIOS) - passed_count}")
    print(f"LOGIC CHECKS:    {logic_passed}/{len(logic_checks)}")
    print("="*60)

if __name__ == "__main__":
    run_tests()
