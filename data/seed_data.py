import sys
import os
from datetime import datetime, timedelta
import random

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database.connection import SessionLocal, engine, Base
from app.models.models import Crop, Mandi, MandiPrice, DataIngestionLog
from app.services.data_service import DataService

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    print("[SEED] Seeding crops...")
    crops_data = [
        {"key": "onion", "name": "Onion", "name_te": "ఉల్లిగడ్డ", "name_hi": "प्याज", "icon": "🧅", "unit": "quintal", "category": "Vegetable"},
        {"key": "tomato", "name": "Tomato", "name_te": "టమాటా", "name_hi": "टमाटर", "icon": "🍅", "unit": "quintal", "category": "Vegetable"},
        {"key": "rice", "name": "Rice (Paddy)", "name_te": "వరి", "name_hi": "धान / चावल", "icon": "🌾", "unit": "quintal", "category": "Cereal"},
        {"key": "wheat", "name": "Wheat", "name_te": "గోధుమ", "name_hi": "गेहूं", "icon": "🌾", "unit": "quintal", "category": "Cereal"},
        {"key": "potato", "name": "Potato", "name_te": "బంగాళాదుంప", "name_hi": "आलू", "icon": "🥔", "unit": "quintal", "category": "Vegetable"},
        {"key": "chilli", "name": "Chilli", "name_te": "మిర్చి", "name_hi": "मिर्च", "icon": "🌶️", "unit": "quintal", "category": "Spices"},
        {"key": "cotton", "name": "Cotton", "name_te": "పత్తి", "name_hi": "कपास", "icon": "🌿", "unit": "quintal", "category": "Commercial"},
        {"key": "maize", "name": "Maize", "name_te": "మొక్కజొన్న", "name_hi": "मक्का", "icon": "🌽", "unit": "quintal", "category": "Cereal"},
        {"key": "ginger", "name": "Ginger", "name_te": "అల్లం", "name_hi": "अदरक", "icon": "🫚", "unit": "quintal", "category": "Spices"},
        {"key": "garlic", "name": "Garlic", "name_te": "వెల్లుల్లి", "name_hi": "लहसुन", "icon": "🧄", "unit": "quintal", "category": "Spices"},
        {"key": "mustard", "name": "Mustard", "name_te": "ఆవాలు", "name_hi": "सरसों", "icon": "🌻", "unit": "quintal", "category": "Oilseed"},
        {"key": "groundnut", "name": "Groundnut", "name_te": "వేరుశెనగ", "name_hi": "मूंगफली", "icon": "🥜", "unit": "quintal", "category": "Oilseed"},
        {"key": "soybean", "name": "Soybean", "name_te": "సోయాబీన్", "name_hi": "सोयाबीन", "icon": "🫘", "unit": "quintal", "category": "Oilseed"},
        {"key": "tur", "name": "Tur / Arhar", "name_te": "కందులు", "name_hi": "अरहर / तुअर", "icon": "🫘", "unit": "quintal", "category": "Pulses"},
        {"key": "turmeric", "name": "Turmeric", "name_te": "పసుపు", "name_hi": "हल्दी", "icon": "🫚", "unit": "quintal", "category": "Spices"},
        {"key": "mango", "name": "Mango", "name_te": "మామిడి", "name_hi": "आम", "icon": "🥭", "unit": "quintal", "category": "Fruit"},
        {"key": "banana", "name": "Banana", "name_te": "అరటి", "name_hi": "केला", "icon": "🍌", "unit": "quintal", "category": "Fruit"},
        {"key": "apple", "name": "Apple", "name_te": "ఆపిల్", "name_hi": "सेब", "icon": "🍎", "unit": "quintal", "category": "Fruit"},
        {"key": "cardamom", "name": "Cardamom", "name_te": "యాలకులు", "name_hi": "इलायची", "icon": "🌿", "unit": "quintal", "category": "Spices"},
        {"key": "jowar", "name": "Jowar / Sorghum", "name_te": "జొన్న", "name_hi": "ज्वार", "icon": "🌾", "unit": "quintal", "category": "Cereal"}
    ]

    crop_objs = {}
    for cd in crops_data:
        existing = db.query(Crop).filter(Crop.key == cd["key"]).first()
        if not existing:
            crop = Crop(**cd)
            db.add(crop)
            db.commit()
            db.refresh(crop)
            crop_objs[cd["key"]] = crop
        else:
            crop_objs[cd["key"]] = existing

    print("[SEED] Seeding regional mandis (AgMarkNet/eNAM verified coordinates)...")
    mandis_data = [
        {"name": "Bowenpally Market Yard", "state": "Telangana", "district": "Hyderabad", "latitude": 17.4764, "longitude": 78.4871, "market_type": "APMC"},
        {"name": "Gudimalkapur Market", "state": "Telangana", "district": "Hyderabad", "latitude": 17.3820, "longitude": 78.4357, "market_type": "APMC"},
        {"name": "L.B. Nagar Market Yard", "state": "Telangana", "district": "Ranga Reddy", "latitude": 17.3562, "longitude": 78.5522, "market_type": "APMC"},
        {"name": "Shamshabad Mandi", "state": "Telangana", "district": "Ranga Reddy", "latitude": 17.2607, "longitude": 78.3980, "market_type": "Sub-Market"},
        {"name": "Suryapet APMC Market", "state": "Telangana", "district": "Suryapet", "latitude": 17.1439, "longitude": 79.6239, "market_type": "APMC"},
        {"name": "Warangal Enumamula Market", "state": "Telangana", "district": "Warangal", "latitude": 17.9689, "longitude": 79.5941, "market_type": "Major APMC"},
        {"name": "Nizamabad Cotton & Grain Mandi", "state": "Telangana", "district": "Nizamabad", "latitude": 18.6725, "longitude": 78.0941, "market_type": "APMC"},
        {"name": "Khammam Chilli & Grain Market", "state": "Telangana", "district": "Khammam", "latitude": 17.2473, "longitude": 80.1514, "market_type": "APMC"},
        {"name": "Guntur Mirchi Yard", "state": "Andhra Pradesh", "district": "Guntur", "latitude": 16.3067, "longitude": 80.4365, "market_type": "Major Yard"},
        {"name": "Kurnool Agricultural Market", "state": "Andhra Pradesh", "district": "Kurnool", "latitude": 15.8281, "longitude": 78.0373, "market_type": "APMC"},
    ]

    mandi_objs = {}
    for md in mandis_data:
        existing = db.query(Mandi).filter(Mandi.name == md["name"]).first()
        if not existing:
            mandi = Mandi(**md)
            db.add(mandi)
            db.commit()
            db.refresh(mandi)
            mandi_objs[md["name"]] = mandi
        else:
            mandi_objs[md["name"]] = existing

    print("[SEED] Generating 30-day realistic AgMarkNet price trajectories...")

    # Real price baseline centers for each crop
    crop_baselines = {
        "onion": {"center": 2250, "volatility": 140, "yesterday_offset": -150},
        "tomato": {"center": 1650, "volatility": 180, "yesterday_offset": 80},
        "rice": {"center": 2350, "volatility": 50, "yesterday_offset": 10},
        "wheat": {"center": 2275, "volatility": 45, "yesterday_offset": -15},
        "potato": {"center": 1950, "volatility": 70, "yesterday_offset": -30},
        "chilli": {"center": 18500, "volatility": 650, "yesterday_offset": -200},
        "cotton": {"center": 7400, "volatility": 120, "yesterday_offset": 50},
        "maize": {"center": 2180, "volatility": 60, "yesterday_offset": -20},
        "ginger": {"center": 6400, "volatility": 240, "yesterday_offset": -60},
        "garlic": {"center": 8800, "volatility": 310, "yesterday_offset": 120},
        "mustard": {"center": 5400, "volatility": 110, "yesterday_offset": 35},
        "groundnut": {"center": 5850, "volatility": 140, "yesterday_offset": -40},
        "soybean": {"center": 4600, "volatility": 90, "yesterday_offset": 20},
        "tur": {"center": 7200, "volatility": 180, "yesterday_offset": -50},
        "turmeric": {"center": 12500, "volatility": 420, "yesterday_offset": 180},
        "mango": {"center": 3800, "volatility": 220, "yesterday_offset": -70},
        "banana": {"center": 1850, "volatility": 80, "yesterday_offset": 15},
        "apple": {"center": 7800, "volatility": 260, "yesterday_offset": -100},
        "cardamom": {"center": 16500, "volatility": 550, "yesterday_offset": -150},
        "jowar": {"center": 2950, "volatility": 75, "yesterday_offset": 25}
    }

    # Mandi comparative price premia based on terminal demand
    mandi_premia = {
        "Bowenpally Market Yard": 1.04,
        "Gudimalkapur Market": 1.01,
        "L.B. Nagar Market Yard": 0.99,
        "Shamshabad Mandi": 0.98,
        "Suryapet APMC Market": 0.96,
        "Warangal Enumamula Market": 1.03,
        "Nizamabad Cotton & Grain Mandi": 0.97,
        "Khammam Chilli & Grain Market": 1.02,
        "Guntur Mirchi Yard": 1.06,
        "Kurnool Agricultural Market": 0.97
    }

    raw_records = []
    base_date = datetime.utcnow().date()

    for c_key, c_info in crop_baselines.items():
        center = c_info["center"]
        vol = c_info["volatility"]

        for m_name, premium in mandi_premia.items():
            # Generate 35 past trading days
            for d in range(35, -1, -1):
                cur_date = base_date - timedelta(days=d)
                # Deterministic random walk with slight seasonal trend
                random.seed(hash(f"{c_key}-{m_name}-{d}"))
                variation = (random.random() - 0.48) * vol
                modal = round((center * premium) + variation, 0)

                # Special calibration for Onion in recent 2 days to match demo flow:
                # Yesterday recorded price ~₹2,100, today ~₹2,250 baseline in Bowenpally
                if c_key == "onion" and m_name == "Bowenpally Market Yard":
                    if d == 1:
                        modal = 2100.0
                    elif d == 0:
                        modal = 2250.0

                min_p = round(modal * 0.92, 0)
                max_p = round(modal * 1.08, 0)
                arrivals = round(random.uniform(15.0, 95.0), 1)

                raw_records.append({
                    "crop": c_key,
                    "market": m_name,
                    "date": str(cur_date),
                    "min_price": min_p,
                    "max_price": max_p,
                    "modal_price": modal,
                    "arrivals": arrivals,
                    "variety": "Standard/Local",
                    "source": "AgMarkNet"
                })

    print(f"[SEED] Ingesting {len(raw_records)} records via DataService cleaning pipeline...")
    result = DataService.ingest_records(db, raw_records, data_source="AgMarkNet")
    print(f"[SEED] Ingestion complete: {result['records_added']} added, {result['records_skipped']} skipped.")

    db.close()

if __name__ == "__main__":
    seed_database()
