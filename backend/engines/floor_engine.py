from ..utils.constants import PLOT_SIZES, BASE_STRUCTURE_RATE, BASE_FINISH_RATE


class FloorEngine:

    def __init__(self, plot_size: str, floors: int):
        """
        Initialize FloorEngine with plot size and floor count.

        Args:
            plot_size (str): Size of the plot as per PLOT_SIZES dictionary
            floors (int): Number of floors to construct
        """
        plot_size = plot_size.lower().strip()
        if plot_size == "full-site": plot_size = "30x40"
        elif plot_size == "half-site": plot_size = "20x30"
        elif plot_size == "double-site": plot_size = "30x50" 

        if plot_size not in PLOT_SIZES:
            try:
                if 'x' in plot_size.lower():
                    parts = plot_size.lower().split('x')
                    if len(parts) == 2:
                        float(parts[0])
                        float(parts[1])
                    else:
                        raise ValueError()
                else:
                    raise ValueError()
            except:
                raise ValueError(
                    f"Invalid plot_size: {plot_size}. Must be a known key or a 'WxL' format."
                )

        if not isinstance(floors, int) or floors < 1:
            raise ValueError("Floors must be a positive integer")

        self.plot_size = plot_size
        self.floors = floors

    def calculate_floor_cost(self) -> dict:
        """
        Calculate construction costs based on plot size and floor count.

        Returns:
            dict: Dictionary containing:
                - area_per_floor (int): Area of each floor in sq ft
                - total_area (int): Total built-up area across all floors
                - structure_cost (int): Cost of structural work
                - finish_cost (int): Cost of finishing work
        """
        if self.plot_size in PLOT_SIZES:
            area_per_floor = PLOT_SIZES[self.plot_size]
        else:
            parts = self.plot_size.lower().split('x')
            area_per_floor = float(parts[0]) * float(parts[1])

        total_area = area_per_floor * self.floors
        structure_cost = total_area * BASE_STRUCTURE_RATE
        finish_cost = total_area * BASE_FINISH_RATE

        return {
            "area_per_floor": round(area_per_floor),
            "total_area": round(total_area),
            "structure_cost": round(structure_cost),
            "finish_cost": round(finish_cost),
        }
