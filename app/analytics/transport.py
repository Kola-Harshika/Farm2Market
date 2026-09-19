from typing import Dict, Any

def calculate_transport_cost(road_distance_km: float, quantity_quintals: float) -> Dict[str, Any]:
    """
    Transparent, realistic rural freight model for agricultural transport.
    Accounts for vehicle capacity tier, base loading/trip charge, and distance.
    """
    if road_distance_km <= 0:
        return {
            "estimated_cost": 0.0,
            "vehicle_type": "Local / On-site",
            "base_charge": 0.0,
            "per_km_rate": 0.0,
            "formula_explanation": "Zero additional road transport distance"
        }

    # Determine realistic vehicle tier based on payload
    if quantity_quintals <= 10.0:  # <= 1,000 kg (Auto / Mini-loader)
        vehicle_type = "Mini Loader (Auto / Ape)"
        base_charge = 300.0
        per_km_rate = 14.0
    elif quantity_quintals <= 30.0:  # 1,000 - 3,000 kg (Tata Ace / Mahindra Bolero Pickup)
        vehicle_type = "Small Commercial Vehicle (Tata Ace / Bolero Pickup)"
        base_charge = 450.0
        per_km_rate = 18.0
    else:  # > 3,000 kg (Tata 407 / 6-wheeler truck)
        vehicle_type = "Medium Commercial Truck (Tata 407 / Eicher)"
        base_charge = 700.0
        per_km_rate = 22.0

    distance_charge = road_distance_km * per_km_rate
    # Small variable weight factor for fuel drag: ₹1.5 per quintal per 100km
    weight_drag = (quantity_quintals * road_distance_km * 0.015)
    
    total_cost = round(base_charge + distance_charge + weight_drag, 0)

    return {
        "estimated_cost": total_cost,
        "vehicle_type": vehicle_type,
        "base_charge": base_charge,
        "per_km_rate": per_km_rate,
        "road_distance_km": road_distance_km,
        "formula_explanation": f"Base charge (₹{base_charge:.0f}) + (₹{per_km_rate:.0f}/km × {road_distance_km:.1f} km)"
    }
