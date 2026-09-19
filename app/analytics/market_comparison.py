import urllib.parse
from typing import List, Dict, Any, Optional
from app.analytics.distance import haversine_distance, estimate_road_distance
from app.analytics.transport import calculate_transport_cost

PERISHABLE_CROPS = {
    "tomato": {"vulnerability": "HIGH", "penalty_pct": 0.25},
    "chilli": {"vulnerability": "HIGH", "penalty_pct": 0.25},
    "onion": {"vulnerability": "MEDIUM", "penalty_pct": 0.10},
    "potato": {"vulnerability": "MEDIUM", "penalty_pct": 0.10},
    "paddy": {"vulnerability": "LOW", "penalty_pct": 0.05},
    "rice": {"vulnerability": "LOW", "penalty_pct": 0.05},
    "cotton": {"vulnerability": "LOW", "penalty_pct": 0.05},
}

def compare_nearby_mandis(
    farmer_lat: float,
    farmer_lon: float,
    quantity_quintals: float,
    current_offered_price: float,
    mandi_records: List[Dict[str, Any]],
    current_mandi_id: Optional[int] = None,
    crop_key: str = "tomato",
    rain_risk_pct: float = 80.0
) -> Dict[str, Any]:
    """
    Economic decision-support engine comparing nearby mandis.
    Evaluates gross rate, distance, transport cost (₹2.50/km/q), spoilage risk deduction,
    and final net profit: Net Revenue = (Gross Rate - Transport Cost - Spoilage Loss) * Quantity.
    """
    current_local_gross = round(current_offered_price * quantity_quintals, 2)
    
    comparisons: List[Dict[str, Any]] = []
    crop_info = PERISHABLE_CROPS.get(crop_key.lower(), {"vulnerability": "MEDIUM", "penalty_pct": 0.15})
    # If rain risk >= 60%, apply the full weather penalty; otherwise scale down
    active_spoilage_rate = crop_info["penalty_pct"] if rain_risk_pct >= 60 else (crop_info["penalty_pct"] * (rain_risk_pct / 100.0))

    for item in mandi_records:
        mandi = item["mandi"]
        historical_price = float(item["latest_price"])
        last_updated = item["last_updated"]

        # Calculate straight and estimated road distances
        straight_dist = round(haversine_distance(farmer_lat, farmer_lon, mandi.latitude, mandi.longitude), 1)
        road_dist = round(estimate_road_distance(straight_dist), 1)

        # Standard freight rate: ₹2.50 per km per quintal
        transport_rate_per_km_q = 2.50
        transport_cost_per_quintal = round(road_dist * transport_rate_per_km_q, 2)
        est_transport_total = round(transport_cost_per_quintal * quantity_quintals, 2)

        # Spoilage deduction per quintal
        spoilage_loss_per_q = round(historical_price * active_spoilage_rate, 2)
        spoilage_total_loss = round(spoilage_loss_per_q * quantity_quintals, 2)

        # Formula: Net Revenue = (Gross Rate - Transport Cost - Spoilage Loss) * Quantity
        gross_value = round(historical_price * quantity_quintals, 2)
        effective_net_price = round(historical_price - transport_cost_per_quintal - spoilage_loss_per_q, 2)
        net_value = round(effective_net_price * quantity_quintals, 2)

        net_diff = round(net_value - current_local_gross, 2)
        destination_encoded = urllib.parse.quote(f"{mandi.name}, Telangana")
        gmaps_url = f"https://www.google.com/maps/dir/?api=1&destination={destination_encoded}"

        comparisons.append({
            "mandi_id": mandi.id,
            "mandi_name": mandi.name,
            "state": mandi.state,
            "district": mandi.district,
            "distance_km": straight_dist,
            "road_distance_km": road_dist,
            "transport_rate_per_km_q": transport_rate_per_km_q,
            "transport_cost_per_quintal": transport_cost_per_quintal,
            "estimated_transport_cost": est_transport_total,
            "spoilage_rate_pct": round(active_spoilage_rate * 100, 1),
            "spoilage_loss_per_quintal": spoilage_loss_per_q,
            "spoilage_total_loss": spoilage_total_loss,
            "gross_value": gross_value,
            "estimated_net_value": net_value,
            "effective_net_price_per_quintal": effective_net_price,
            "net_difference_vs_current": net_diff,
            "historical_comparable_price": historical_price,
            "last_updated": str(last_updated),
            "latitude": mandi.latitude,
            "longitude": mandi.longitude,
            "is_best": False,
            "google_maps_url": gmaps_url
        })

    # Sort primarily by net value descending (highest net profit first)
    comparisons.sort(key=lambda x: x["estimated_net_value"], reverse=True)

    best_option = None
    if comparisons:
        comparisons[0]["is_best"] = True
        best_option = comparisons[0]

    return {
        "current_local_gross": current_local_gross,
        "comparisons": comparisons,
        "best_option": best_option
    }
