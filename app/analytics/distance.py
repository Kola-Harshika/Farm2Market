import math

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great-circle distance between two points on Earth (in kilometers).
    Uses the Haversine formula.
    """
    R = 6371.0  # Earth's mean radius in kilometers

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c
    return round(distance, 1)

def estimate_road_distance(straight_line_km: float, road_factor: float = 1.25) -> float:
    """
    In rural and regional Indian transport networks, actual road routes are longer
    than straight-line geodesic lines. Standard rural road factor is ~1.25x.
    """
    return round(straight_line_km * road_factor, 1)
