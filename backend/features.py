from typing import Any, Dict, List

from utils.constants import PLOT_SIZES


def _map_project_type(value: str) -> int:
    mapping = {"rental": 0, "own_house": 1}
    try:
        return mapping[value]
    except KeyError:
        raise ValueError(f"Invalid project_type: {value}. Expected one of: {list(mapping.keys())}")


def _map_zone(value: str) -> int:
    mapping = {"A": 2, "B": 1, "C": 0}
    try:
        return mapping[value]
    except KeyError:
        raise ValueError(f"Invalid zone: {value}. Expected one of: {list(mapping.keys())}")


def _map_tier(value: str) -> int:
    mapping = {"Basic": 0, "Classic": 1, "Premium": 2, "Luxury": 3}
    try:
        return mapping[value]
    except KeyError:
        raise ValueError(f"Invalid selected_tier: {value}. Expected one of: {list(mapping.keys())}")


def _map_lift(value: Any) -> int:
    if isinstance(value, bool):
        return 1 if value else 0
    if isinstance(value, (int, float)):
        return 1 if int(value) != 0 else 0
    raise ValueError("lift_required must be a boolean or numeric equivalent")


def _map_site_type(value: str) -> int:
    mapping = {"half": 0, "full": 1, "double": 2}
    try:
        return mapping[value]
    except KeyError:
        raise ValueError(f"Invalid site_type: {value}. Expected one of: {list(mapping.keys())}")


def prepare_features(input_data: Dict[str, Any]) -> List[float]:
    """
    Prepare numeric features from input dictionary for ML preprocessing.

    The returned feature vector (in order) is:
      [project_type, zone, selected_tier, lift_required, site_type,
       plot_area, floors, total_area, structure_cost, finish_cost,
       num_members, num_rooms, grandparent_room]

    Validation is performed on categorical fields and required numeric fields.
    """
    project_type = _map_project_type(input_data.get("project_type"))
    zone = _map_zone(input_data.get("zone"))
    selected_tier = _map_tier(input_data.get("selected_tier"))
    lift_required = _map_lift(input_data.get("lift_required", False))
    site_type = _map_site_type(input_data.get("site_type"))

    plot_area = None
    if "plot_size" in input_data and input_data["plot_size"] in PLOT_SIZES:
        plot_area = float(PLOT_SIZES[input_data["plot_size"]])
    elif "plot_area" in input_data:
        plot_area = float(input_data["plot_area"])
    elif "total_area" in input_data and "floors" in input_data and input_data["floors"]:
        plot_area = float(input_data["total_area"]) / float(input_data["floors"])
    else:
        raise ValueError("Unable to determine plot_area: provide 'plot_size' or 'plot_area' or both 'total_area' and 'floors'.")

    try:
        floors = int(input_data.get("floors"))
    except Exception:
        raise ValueError("'floors' is required and must be an integer")

    try:
        total_area = float(input_data.get("total_area"))
    except Exception:
        raise ValueError("'total_area' is required and must be numeric")

    try:
        structure_cost = float(input_data.get("structure_cost"))
    except Exception:
        raise ValueError("'structure_cost' is required and must be numeric")

    try:
        finish_cost = float(input_data.get("finish_cost"))
    except Exception:
        raise ValueError("'finish_cost' is required and must be numeric")

    family_details = input_data.get("family_details", {})
    num_members = float(family_details.get("num_members", 0))
    num_rooms = float(family_details.get("num_rooms", 0))
    grandparent_room = float(family_details.get("grandparent_room", 0))

    features: List[float] = [
        float(project_type),
        float(zone),
        float(selected_tier),
        float(lift_required),
        float(site_type),
        plot_area,
        float(floors),
        total_area,
        structure_cost,
        finish_cost,
        num_members,
        num_rooms,
        grandparent_room,
    ]

    return features
