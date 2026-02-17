import sys
import os
import json
from typing import Dict, Any, List

from . import test_runner

def print_box(title: str, content: List[str], color_code: str = "36"):
    width = 60
    print(f"\n\033[1;{color_code}m╔{'═' * (width-2)}╗\033[0m")
    print(f"\033[1;{color_code}m║ {title.center(width-4)} ║\033[0m")
    print(f"\033[1;{color_code}m╠{'═' * (width-2)}╣\033[0m")
    for line in content:
        print(f"\033[1;{color_code}m║\033[0m {line:<{width-4}} \033[1;{color_code}m║\033[0m")
    print(f"\033[1;{color_code}m╚{'═' * (width-2)}╝\033[0m")

def print_breakdown(result: Dict[str, Any], scenario_input: Dict[str, Any], title: str = "ESTIMATION AUDIT"):
    input_lines = [
        f"PROJECT:    {scenario_input.get('project_type', 'N/A').upper()}",
        f"PLOT SIZE:  {scenario_input.get('plot_size', 'N/A')}",
        f"FLOORS:     {scenario_input.get('floors', 'N/A')}",
        f"TIER:       {scenario_input.get('selected_tier', 'Basic')}",
        f"LIFT:       {'YES' if scenario_input.get('lift_required') else 'NO'}",
        f"COMPOUND:   {'YES' if scenario_input.get('compound_wall') else 'NO'}",
        f"INTERIOR:   {scenario_input.get('interior') if scenario_input.get('interior') else 'NONE'}",
        f"PARKING:    {scenario_input.get('family_details', {}).get('parking', 'NO')}"
    ]
    print_box("INPUT PROFILE", input_lines, "33") # Yellow for input

    output_lines = [
        f"STRUCTURE COST:   ₹{result.get('structure_cost', 0):>15,}",
        f"FINISH COST:      ₹{result.get('finish_cost', 0):>15,}",
        f"LIFT COST:        ₹{result.get('lift_cost', 0):>15,}",
        f"ADD-ONS/INTERIOR: ₹{result.get('interior_cost', 0) + result.get('upgrades_cost', 0):>15,}",
        f"INFLATION BUF:    ₹{result.get('inflation_adjustment', 0):>15,}",
        "─" * 56,
        f"\033[1;32mFINAL TOTAL:      ₹{result.get('final_cost', 0):>15,}\033[0m"
    ]
    print_box(title, output_lines, "32") # Green for output

def compare_scenarios(name1: str, name2: str):
    s1 = next((s for s in test_runner.SCENARIOS if s["name"] == name1), None)
    s2 = next((s for s in test_runner.SCENARIOS if s["name"] == name2), None)
    
    if not s1 or not s2:
        print("\033[1;31mError: Scenario name(s) not found in registry.\033[0m")
        return
        
    r1 = test_runner.run_calculation(s1["input"])
    r2 = test_runner.run_calculation(s2["input"])
    
    width = 90
    print(f"\n\033[1;36m╔{'═' * (width-2)}╗\033[0m")
    print(f"\033[1;36m║ {'SIDE-BY-SIDE ANALYTICS'.center(width-4)} ║\033[0m")
    print(f"\033[1;36m╠{'═' * 30}╦{'═' * 28}╦{'═' * 28}╣\033[0m")
    print(f"\033[1;36m║ {'COST FIELD':<28} ║ {name1[:26]:<26} ║ {name2[:26]:<26} ║\033[0m")
    print(f"\033[1;36m╠{'═' * 30}╬{'═' * 28}╬{'═' * 28}╣\033[0m")
    
    fields = [
        ("Final Total Cost", "final_cost"),
        ("Structure Component", "structure_cost"),
        ("Finishing Component", "finish_cost"),
        ("Add-ons & Extras", "interior_cost"),
        ("Built-up Area (SqFt)", "total_area")
    ]
    
    for label, key in fields:
        v1 = r1.get(key, 0)
        v2 = r2.get(key, 0)
        diff = v2 - v1
        color = "32" if diff > 0 else ("31" if diff < 0 else "37")
        diff_ind = f"({'+' if diff >= 0 else ''}{diff:,})"
        
        print(f"\033[1;36m║\033[0m {label:<28} \033[1;36m║\033[0m ₹{v1:>24,} \033[1;36m║\033[0m ₹{v2:>24,} \033[1;36m║\033[0m")
    
    print(f"\033[1;36m╚{'═' * 30}╩{'═' * 28}╩{'═' * 28}╝\033[0m\n")

def main():
    if sys.platform == "win32":
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except:
            pass

    if len(sys.argv) < 2:
        print("Usage:")
        print("  python -m backend.tests.result run                - Run full test suite")
        print("  python -m backend.tests.result <scenario_name>    - Run single breakdown")
        print("  python -m backend.tests.result compare <name1> <name2> - Compare two scenarios")
        print("  python -m backend.tests.result list               - List available scenarios")
        return

    cmd = sys.argv[1]
    
    if cmd == "list":
        print("\nAvailable Scenarios:")
        for s in test_runner.SCENARIOS:
            print(f" - {s['name']}")
    
    elif cmd == "run":
        test_runner.run_tests()
            
    elif cmd == "compare":
        if len(sys.argv) < 4:
            print("Usage: python -m backend.tests.result compare <name1> <name2>")
            return
        compare_scenarios(sys.argv[2], sys.argv[3])
        
    else:
        # Run single
        scenario = next((s for s in test_runner.SCENARIOS if s["name"] == cmd), None)
        if scenario:
            res = test_runner.run_calculation(scenario["input"])
            print_breakdown(res, scenario["input"], title=f"SCENARIO: {cmd}")
        else:
            print(f"Scenario '{cmd}' not found.")

if __name__ == "__main__":
    main()
