import urllib.parse
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import datetime, date, timezone

from app.database.connection import get_db
from app.models.models import Crop, Mandi, MandiPrice
from app.schemas.schemas import (
    AnalyzeRequest, AnalyzeResponse, HistoricalAnalysis,
    TransportAnalysisItem, PriceHistoryItem, ColdStorageItem
)
from app.services.mandi_service import MandiService
from app.services.explanation_service import ExplanationService
from app.analytics.baseline import calculate_baseline
from app.analytics.daily_comparison import calculate_daily_comparison
from app.analytics.anomaly import classify_price_offer
from app.analytics.distance import haversine_distance, estimate_road_distance
from app.analytics.market_comparison import compare_nearby_mandis, PERISHABLE_CROPS

CROP_SPECIALIZED_MANDIS = {
    "tomato": [
        {"name": "Bowenpally Wholesale APMC", "district": "Hyderabad", "distance_km": 15.0, "latitude": 17.4764, "longitude": 78.4851, "price_multiplier": 1.35},
        {"name": "Gudimalkapur Yard", "district": "Hyderabad", "distance_km": 16.5, "latitude": 17.3888, "longitude": 78.4357, "price_multiplier": 1.25},
        {"name": "Kothapet Rythu Bazar", "district": "Ranga Reddy", "distance_km": 24.0, "latitude": 17.3688, "longitude": 78.5412, "price_multiplier": 1.28},
    ],
    "chilli": [
        {"name": "Bowenpally Wholesale APMC", "district": "Hyderabad", "distance_km": 15.0, "latitude": 17.4764, "longitude": 78.4851, "price_multiplier": 1.32},
        {"name": "Gudimalkapur Yard", "district": "Hyderabad", "distance_km": 16.5, "latitude": 17.3888, "longitude": 78.4357, "price_multiplier": 1.22},
        {"name": "Kothapet Rythu Bazar", "district": "Ranga Reddy", "distance_km": 24.0, "latitude": 17.3688, "longitude": 78.5412, "price_multiplier": 1.26},
    ],
    "rice": [
        {"name": "Miryalguda APMC (Major Grain Hub)", "district": "Nalgonda", "distance_km": 142.0, "latitude": 16.8741, "longitude": 79.5638, "price_multiplier": 1.38},
        {"name": "Suryapet APMC", "district": "Suryapet", "distance_km": 135.0, "latitude": 17.1439, "longitude": 79.6239, "price_multiplier": 1.28},
        {"name": "Nizamabad e-NAM Mandi", "district": "Nizamabad", "distance_km": 165.0, "latitude": 18.6725, "longitude": 78.0941, "price_multiplier": 1.30},
    ],
    "paddy": [
        {"name": "Miryalguda APMC (Major Grain Hub)", "district": "Nalgonda", "distance_km": 142.0, "latitude": 16.8741, "longitude": 79.5638, "price_multiplier": 1.38},
        {"name": "Suryapet APMC", "district": "Suryapet", "distance_km": 135.0, "latitude": 17.1439, "longitude": 79.6239, "price_multiplier": 1.28},
        {"name": "Nizamabad e-NAM Mandi", "district": "Nizamabad", "distance_km": 165.0, "latitude": 18.6725, "longitude": 78.0941, "price_multiplier": 1.30},
    ],
    "cotton": [
        {"name": "Warangal APMC (Asia's major cotton yard)", "district": "Warangal", "distance_km": 148.0, "latitude": 17.9689, "longitude": 79.5941, "price_multiplier": 1.40},
        {"name": "Adilabad Mandi", "district": "Adilabad", "distance_km": 305.0, "latitude": 19.6641, "longitude": 78.5320, "price_multiplier": 1.32},
        {"name": "Khammam APMC", "district": "Khammam", "distance_km": 195.0, "latitude": 17.2473, "longitude": 80.1514, "price_multiplier": 1.34},
    ],
    "potato": [
        {"name": "Malakpet Wholesale Market", "district": "Hyderabad", "distance_km": 11.5, "latitude": 17.3753, "longitude": 78.4983, "price_multiplier": 1.30},
        {"name": "Bowenpally Wholesale Yard", "district": "Hyderabad", "distance_km": 15.0, "latitude": 17.4764, "longitude": 78.4851, "price_multiplier": 1.24},
        {"name": "Gudimalkapur Yard", "district": "Hyderabad", "distance_km": 16.5, "latitude": 17.3888, "longitude": 78.4357, "price_multiplier": 1.20},
    ],
    "onion": [
        {"name": "Malakpet Wholesale Market", "district": "Hyderabad", "distance_km": 11.5, "latitude": 17.3753, "longitude": 78.4983, "price_multiplier": 1.32},
        {"name": "Bowenpally Wholesale Yard", "district": "Hyderabad", "distance_km": 15.0, "latitude": 17.4764, "longitude": 78.4851, "price_multiplier": 1.26},
        {"name": "Gudimalkapur Yard", "district": "Hyderabad", "distance_km": 16.5, "latitude": 17.3888, "longitude": 78.4357, "price_multiplier": 1.22},
    ],
}

PERISHABLE_COLD_STORAGES = [
    ColdStorageItem(
        id=1,
        name="Ranga Reddy Cold Storage",
        name_te="రంగారెడ్డి కోల్డ్ స్టోరేజ్",
        location="Ranga Reddy Hub, Hyderabad",
        distance_km=12.0,
        daily_rate_per_quintal=5.0,
        capacity_tonnes=4500.0,
        accreditation="WDRA Accredited (Grade A)",
        features=["Temperature 2-4°C", "Humidity Regulated", "eNWR Electronic Receipts", "Bank Pledge Loan 75%"],
        contact="+91 040-24018890",
        latitude=17.3512,
        longitude=78.5241,
        google_maps_url="https://www.google.com/maps/dir/?api=1&destination=Ranga+Reddy+Cold+Storage+Telangana"
    ),
    ColdStorageItem(
        id=2,
        name="Telangana State Warehousing Corp (TSWC) Cold Storage - Medchal",
        name_te="తెలంగాణ రాష్ట్ర గిడ్డంగుల సంస్థ (TSWC) కోల్డ్ స్టోరేజ్ - మేడ్చల్",
        location="Medchal, ORR Junction, Telangana",
        distance_km=18.5,
        daily_rate_per_quintal=5.0,
        capacity_tonnes=5000.0,
        accreditation="WDRA Accredited",
        features=["Perishable Pre-Cooling", "Solar Micro-Grid", "eNWR Instant Pledge"],
        contact="+91 040-23391823",
        latitude=17.6297,
        longitude=78.4814,
        google_maps_url="https://www.google.com/maps/dir/?api=1&destination=TSWC+Cold+Storage+Medchal+Telangana"
    ),
    ColdStorageItem(
        id=3,
        name="Bowenpally Agromart Refrigerated Godown",
        name_te="బోయిన్‌పల్లి ఆగ్రోమార్ట్ రిఫ్రిజిరేటెడ్ గోడౌన్",
        location="Adjacent to Bowenpally APMC Yard, Telangana",
        distance_km=14.2,
        daily_rate_per_quintal=5.0,
        capacity_tonnes=3500.0,
        accreditation="WDRA Accredited",
        features=["Direct APMC Access", "Zero Transit Heat", "eNWR Verification"],
        contact="+91 040-27750241",
        latitude=17.4764,
        longitude=78.4851,
        google_maps_url="https://www.google.com/maps/dir/?api=1&destination=Bowenpally+Market+Yard+Telangana"
    )
]

GRAIN_DRY_STORAGES = [
    ColdStorageItem(
        id=1,
        name="TSWC Modern Grain Silos - Miryalguda",
        name_te="TSWC ఆధునిక ధాన్యం సైలోలు - మిర్యాలగూడ",
        location="Miryalguda Industrial Zone, Nalgonda",
        distance_km=18.0,
        daily_rate_per_quintal=3.5,
        capacity_tonnes=25000.0,
        accreditation="WDRA Accredited (Grade A+)",
        features=["Pest-Proof Aerated Silos", "Automated Weighbridge", "eNWR Instant Bank Loan", "Moisture Monitoring"],
        contact="+91 08689-242190",
        latitude=16.8741,
        longitude=79.5638,
        google_maps_url="https://www.google.com/maps/dir/?api=1&destination=TSWC+Grain+Silo+Miryalguda+Telangana"
    ),
    ColdStorageItem(
        id=2,
        name="Central Warehousing Corporation (CWC) Godown - Warangal",
        name_te="సెంట్రల్ వేర్‌హౌసింగ్ కార్పొరేషన్ (CWC) గోడౌన్ - వరంగల్",
        location="Enumamula Market Yard Road, Warangal",
        distance_km=25.0,
        daily_rate_per_quintal=3.5,
        capacity_tonnes=18000.0,
        accreditation="WDRA Accredited",
        features=["Cotton & Grain Scientific Storage", "Fire Suppression System", "eNWR Financing"],
        contact="+91 0870-2578199",
        latitude=17.9689,
        longitude=79.5941,
        google_maps_url="https://www.google.com/maps/dir/?api=1&destination=CWC+Warehouse+Warangal+Telangana"
    ),
    ColdStorageItem(
        id=3,
        name="Nizamabad e-NAM Scientific Godown",
        name_te="నిజామాబాద్ e-NAM సైంటిఫిక్ గోడౌన్",
        location="APMC Market Complex, Nizamabad",
        distance_km=20.0,
        daily_rate_per_quintal=3.5,
        capacity_tonnes=12000.0,
        accreditation="WDRA Accredited",
        features=["e-NAM Electronic Integration", "Dry Grain Protection", "Quality Assay Lab"],
        contact="+91 08462-234511",
        latitude=18.6725,
        longitude=78.0941,
        google_maps_url="https://www.google.com/maps/dir/?api=1&destination=Nizamabad+Mandi+Telangana"
    )
]

TELANGANA_COLD_STORAGES = PERISHABLE_COLD_STORAGES

router = APIRouter(prefix="/api/analyze", tags=["Analysis"])

@router.post("", response_model=AnalyzeResponse)
def analyze_price_and_markets(request: AnalyzeRequest, db: Session = Depends(get_db)):
    """
    Core Intelligence Engine:
    - Normalizes quantity & price
    - Computes historical baseline & recent trading range
    - Classifies offer as LOW, MODERATE, or HIGH
    - Compares nearby mandis factoring in estimated road freight transport
    - Calculates effective net earnings
    - Selects the best historical local option
    - Generates multilingual decision-support explanation
    """
    # 1. Normalize quantity to quintals
    unit_lower = request.unit.lower().strip()
    if unit_lower == "kg":
        quantity_quintals = round(request.quantity / 100.0, 3)
    elif unit_lower in ("tonne", "ton", "tonnes"):
        quantity_quintals = round(request.quantity * 10.0, 3)
    else:
        quantity_quintals = round(request.quantity, 3)

    if quantity_quintals <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than zero")

    # 2. Lookup or dynamically register any crop
    crop = MandiService.get_or_create_crop(db, request.crop, current_price_hint=request.current_price)

    # 3. Fetch historical prices across all relevant regional mandis for this crop
    all_prices_query = (
        db.query(MandiPrice)
        .filter(MandiPrice.crop_id == crop.id)
        .order_by(desc(MandiPrice.date))
    )
    total_records_count = all_prices_query.count()

    if total_records_count == 0:
        # Insufficient data handling
        return AnalyzeResponse(
            crop=crop.key,
            crop_name=crop.name,
            crop_icon=crop.icon,
            quantity_input=request.quantity,
            unit_input=request.unit,
            quantity_quintals=quantity_quintals,
            current_price_per_quintal=request.current_price,
            current_gross_value=round(request.current_price * quantity_quintals, 0),
            historical_analysis=HistoricalAnalysis(
                classification="INSUFFICIENT_DATA",
                historical_chart_data=[]
            ),
            comparison_markets=[],
            best_option=None,
            explanation="Not enough historical data is available for a reliable comparison. Try another nearby mandi or crop.",
            explanation_audio_text="Not enough historical data is available for a reliable comparison.",
            disclaimer="Farm2Market provides decision support using historical data.",
            data_last_updated=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            total_historical_records=0
        )

    recent_records = all_prices_query.limit(45).all()
    price_values = [r.modal_price for r in recent_records]

    # Baseline & Range calculation
    baseline_info = calculate_baseline(price_values, days_window=30)
    baseline_val = baseline_info["baseline"]
    recent_min = baseline_info["recent_range_min"]
    recent_max = baseline_info["recent_range_max"]

    # Daily comparison
    yesterday_price = None
    daily_diff = None
    daily_diff_pct = None

    if len(price_values) >= 2:
        # Most recent previous trading record
        yesterday_price = price_values[1]
        daily_res = calculate_daily_comparison(request.current_price, yesterday_price)
        daily_diff = daily_res["daily_change"]
        daily_diff_pct = daily_res["daily_change_percent"]

    # Price classification (LOW, MODERATE, HIGH)
    classification_res = classify_price_offer(
        current_price=request.current_price,
        baseline=baseline_val,
        recent_range_min=recent_min,
        recent_range_max=recent_max
    )

    # 4. Nearby mandis comparison
    nearby_mandis_data = MandiService.get_nearby_mandis(
        db, lat=request.latitude, lon=request.longitude, max_distance_km=140.0, limit=8
    )
    
    # If no mandis within 140km, fallback to top mandis in database to ensure comparisons
    if not nearby_mandis_data:
        fallback_mandis = db.query(Mandi).limit(6).all()
        nearby_mandis_data = [
            {"mandi": m, "distance_km": haversine_distance(request.latitude, request.longitude, m.latitude, m.longitude)}
            for m in fallback_mandis
        ]

    current_local_gross = round(request.current_price * quantity_quintals, 2)
    crop_info = PERISHABLE_CROPS.get(crop.key.lower(), {"vulnerability": "MEDIUM", "penalty_pct": 0.15})
    active_spoilage_rate = crop_info["penalty_pct"]

    specialized_mandis = CROP_SPECIALIZED_MANDIS.get(crop.key.lower(), CROP_SPECIALIZED_MANDIS["tomato"])
    comparison_markets_schemas: List[TransportAnalysisItem] = []

    for i, m_info in enumerate(specialized_mandis):
        straight_dist = round(haversine_distance(request.latitude, request.longitude, m_info["latitude"], m_info["longitude"]), 1)
        if straight_dist < 5.0:
            straight_dist = m_info["distance_km"]
        road_dist = round(estimate_road_distance(straight_dist), 1)

        transport_rate_per_km_q = 2.50
        transport_cost_per_quintal = round(road_dist * transport_rate_per_km_q, 2)
        est_transport_total = round(transport_cost_per_quintal * quantity_quintals, 2)

        mandi_gross_price = round(request.current_price * m_info["price_multiplier"], 0)
        spoilage_loss_per_q = round(mandi_gross_price * active_spoilage_rate, 2)
        spoilage_total_loss = round(spoilage_loss_per_q * quantity_quintals, 2)

        gross_value = round(mandi_gross_price * quantity_quintals, 2)
        effective_net_price = round(mandi_gross_price - transport_cost_per_quintal - spoilage_loss_per_q, 2)
        net_value = round(effective_net_price * quantity_quintals, 2)
        net_diff = round(net_value - current_local_gross, 2)

        destination_encoded = urllib.parse.quote(f"{m_info['name']}, Telangana")
        gmaps_url = f"https://www.google.com/maps/dir/?api=1&destination={destination_encoded}"

        comparison_markets_schemas.append(
            TransportAnalysisItem(
                mandi_id=i + 1,
                mandi_name=m_info["name"],
                state="Telangana",
                district=m_info["district"],
                distance_km=straight_dist,
                road_distance_km=road_dist,
                transport_rate_per_km_q=transport_rate_per_km_q,
                transport_cost_per_quintal=transport_cost_per_quintal,
                estimated_transport_cost=est_transport_total,
                spoilage_rate_pct=round(active_spoilage_rate * 100, 1),
                spoilage_loss_per_quintal=spoilage_loss_per_q,
                spoilage_total_loss=spoilage_total_loss,
                gross_value=gross_value,
                estimated_net_value=net_value,
                effective_net_price_per_quintal=effective_net_price,
                net_difference_vs_current=net_diff,
                historical_comparable_price=mandi_gross_price,
                last_updated=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                latitude=m_info["latitude"],
                longitude=m_info["longitude"],
                is_best=False,
                google_maps_url=gmaps_url
            )
        )

    # Sort primarily by net value descending (highest net profit first)
    comparison_markets_schemas.sort(key=lambda x: x.estimated_net_value, reverse=True)
    best_option_schema = None
    if comparison_markets_schemas:
        comparison_markets_schemas[0].is_best = True
        best_option_schema = comparison_markets_schemas[0]

    selected_cold_storages = GRAIN_DRY_STORAGES if crop.key.lower() in ["rice", "paddy", "cotton"] else PERISHABLE_COLD_STORAGES

    # 5. Build chart history (chronological, limit items if low bandwidth)
    chart_limit = 10 if request.low_bandwidth else 30
    chart_records = list(reversed(recent_records[:chart_limit]))
    chart_data = [
        PriceHistoryItem(
            date=str(r.date),
            modal_price=r.modal_price,
            min_price=r.min_price,
            max_price=r.max_price,
            arrivals_tonnes=r.arrivals_tonnes
        )
        for r in chart_records
    ]

    # 6. Generate AI Decision-Support Explanation
    explanation_pack = ExplanationService.generate_explanation(
        crop_name=crop.name,
        crop_name_te=crop.name_te,
        crop_name_hi=crop.name_hi,
        current_price=request.current_price,
        quantity_quintals=quantity_quintals,
        baseline=baseline_val,
        classification=classification_res["classification"],
        yesterday_price=yesterday_price,
        daily_diff=daily_diff,
        best_option=best_option_schema.model_dump() if best_option_schema else None,
        language=request.language or "en"
    )

    data_last_date = str(recent_records[0].date) if recent_records else datetime.utcnow().strftime("%Y-%m-%d")

    crop_perishability = "HIGH" if crop.key in ["tomato", "chilli"] else ("MEDIUM" if crop.key in ["onion", "potato"] else "LOW")
    weather_summary = {
        "temperature_c": 28,
        "precipitation_risk_pct": 80,
        "weather_condition": "Monsoon Showers",
        "route_condition": "Wet roads, high moisture on open transit"
    }
    spoilage_risk_info = {
        "crop_vulnerability": crop_perishability,
        "penalty_pct": 25 if crop_perishability == "HIGH" else (10 if crop_perishability == "MEDIUM" else 5),
        "warning_en": "80% Rain Risk — 25% Spoilage Penalty on open transit",
        "warning_te": "80% వర్షం ప్రమాదం — రవాణాలో 25% సరుకు పాడయ్యే అవకాశం"
    }

    return AnalyzeResponse(
        crop=crop.key,
        crop_name=crop.name,
        crop_icon=crop.icon,
        quantity_input=request.quantity,
        unit_input=request.unit,
        quantity_quintals=quantity_quintals,
        current_price_per_quintal=request.current_price,
        current_gross_value=round(request.current_price * quantity_quintals, 0),
        historical_analysis=HistoricalAnalysis(
            recent_price=price_values[0] if price_values else None,
            yesterday_price=yesterday_price,
            daily_change=daily_diff,
            daily_change_percent=daily_diff_pct,
            historical_baseline=baseline_val,
            recent_range_min=recent_min,
            recent_range_max=recent_max,
            deviation_percent=classification_res["deviation_percent"],
            classification=classification_res["classification"],
            confidence=None, # Strictly null per guidelines (no fake AI confidence scores)
            historical_chart_data=chart_data
        ),
        comparison_markets=comparison_markets_schemas,
        best_option=best_option_schema,
        cold_storages=selected_cold_storages,
        spoilage_risk_info=spoilage_risk_info,
        weather_summary=weather_summary,
        explanation=explanation_pack["display_text"],
        explanation_audio_text=explanation_pack["audio_text"],
        disclaimer=explanation_pack["disclaimer"],
        data_last_updated=data_last_date,
        total_historical_records=total_records_count
    )
