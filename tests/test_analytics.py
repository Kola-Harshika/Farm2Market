import pytest
from app.analytics.distance import haversine_distance, estimate_road_distance
from app.analytics.transport import calculate_transport_cost
from app.analytics.baseline import calculate_baseline
from app.analytics.daily_comparison import calculate_daily_comparison
from app.analytics.anomaly import classify_price_offer
from app.analytics.market_comparison import compare_nearby_mandis

def test_distance_calculation():
    # Hyderabad (17.3850, 78.4867) to Bowenpally (17.4764, 78.4871)
    dist = haversine_distance(17.3850, 78.4867, 17.4764, 78.4871)
    assert 9.0 <= dist <= 12.0
    road_dist = estimate_road_distance(dist)
    assert road_dist > dist

def test_transport_cost_model():
    # 5 quintals (500 kg), 15 km road distance -> Mini Loader
    cost_info = calculate_transport_cost(road_distance_km=15.0, quantity_quintals=5.0)
    assert cost_info["vehicle_type"] == "Mini Loader (Auto / Ape)"
    assert cost_info["base_charge"] == 300.0
    assert cost_info["estimated_cost"] > 300.0

    # 0 km distance -> 0 cost
    zero_info = calculate_transport_cost(road_distance_km=0.0, quantity_quintals=5.0)
    assert zero_info["estimated_cost"] == 0.0

def test_baseline_and_daily():
    prices = [2100.0, 2250.0, 2300.0, 2200.0, 2150.0]
    base = calculate_baseline(prices)
    assert base["baseline"] == 2200.0
    assert base["recent_range_min"] == 2100.0
    assert base["recent_range_max"] == 2300.0

    # Daily comparison
    daily = calculate_daily_comparison(current_price=1800.0, previous_day_price=2100.0)
    assert daily["daily_change"] == -300.0
    assert round(daily["daily_change_percent"], 1) == -14.3

def test_price_classification():
    # Baseline 2250, current offer 1800 -> LOW (> 8% drop)
    res_low = classify_price_offer(current_price=1800.0, baseline=2250.0)
    assert res_low["classification"] == "LOW"
    assert res_low["signal_color"] == "red"

    # Baseline 2250, current offer 2260 -> MODERATE
    res_mod = classify_price_offer(current_price=2260.0, baseline=2250.0)
    assert res_mod["classification"] == "MODERATE"
    assert res_mod["signal_color"] == "yellow"

    # Baseline 2250, current offer 2600 -> HIGH
    res_high = classify_price_offer(current_price=2600.0, baseline=2250.0)
    assert res_high["classification"] == "HIGH"
    assert res_high["signal_color"] == "green"
