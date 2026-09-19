import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_and_health():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["app"] == "FARM2MARKET"

    h = client.get("/api/health")
    assert h.status_code == 200
    assert h.json()["status"] == "healthy"

    data_h = client.get("/api/health/data")
    assert data_h.status_code == 200
    d = data_h.json()
    assert d["total_mandis"] >= 10
    assert d["total_crops"] >= 7
    assert d["total_price_records"] >= 2000

def test_crops_api():
    res = client.get("/api/crops")
    assert res.status_code == 200
    crops = res.json()
    assert len(crops) >= 7
    keys = [c["key"] for c in crops]
    assert "onion" in keys
    assert "tomato" in keys

def test_analyze_demo_scenario():
    # Prompt Scenario: Onion, 500 kg, Hyderabad, ₹1,800/q
    payload = {
        "crop": "onion",
        "quantity": 500,
        "unit": "kg",
        "latitude": 17.3850,
        "longitude": 78.4867,
        "current_price": 1800,
        "current_mandi": "Local Hyderabad Yard",
        "language": "en",
        "low_bandwidth": False
    }
    res = client.post("/api/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["crop"] == "onion"
    assert data["quantity_quintals"] == 5.0
    assert data["current_price_per_quintal"] == 1800.0
    assert data["historical_analysis"]["classification"] in ["LOW", "MODERATE"]
    assert len(data["comparison_markets"]) > 0
    assert data["best_option"] is not None
    assert "explanation" in data
    assert "disclaimer" in data

def test_voice_query_api():
    res = client.post("/api/voice/query", json={"query": "What is the price of onion?", "language": "en"})
    assert res.status_code == 200
    v = res.json()
    assert v["detected_crop"] == "onion"
    assert v["suggested_action"] == "SELECT_CROP"
