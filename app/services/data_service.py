from typing import Dict, Any, List
from sqlalchemy.orm import Session
from datetime import datetime, date
import logging
from app.models.models import Crop, Mandi, MandiPrice, DataIngestionLog

logger = logging.getLogger(__name__)

class DataService:
    @staticmethod
    def clean_and_normalize_record(raw: Dict[str, Any]) -> Dict[str, Any]:
        """
        Data cleaning pipeline:
        - Validates numeric prices (min <= modal <= max, price > 0)
        - Cleans strings and dates
        - Checks bounds
        """
        try:
            # Parse price values
            min_p = float(raw.get("min_price", 0))
            max_p = float(raw.get("max_price", 0))
            modal_p = float(raw.get("modal_price", 0))

            if modal_p <= 0 and min_p > 0:
                modal_p = min_p
            if min_p <= 0 and modal_p > 0:
                min_p = modal_p
            if max_p <= 0 and modal_p > 0:
                max_p = modal_p

            # Sanity checks
            if modal_p <= 0 or modal_p > 200000:
                return {"valid": False, "reason": "Outlier or zero modal price"}

            if min_p > max_p:
                min_p, max_p = max_p, min_p

            if not (min_p <= modal_p <= max_p):
                modal_p = round((min_p + max_p) / 2.0, 2)

            record_date = raw.get("date")
            if isinstance(record_date, str):
                record_date = datetime.strptime(record_date, "%Y-%m-%d").date()

            return {
                "valid": True,
                "date": record_date,
                "crop_key": str(raw.get("crop", "")).strip().lower(),
                "mandi_name": str(raw.get("market", "")).strip(),
                "state": str(raw.get("state", "")).strip(),
                "district": str(raw.get("district", "")).strip(),
                "variety": str(raw.get("variety", "Common")).strip(),
                "min_price": min_p,
                "max_price": max_p,
                "modal_price": modal_p,
                "arrivals_tonnes": float(raw.get("arrivals", 0.0)),
                "latitude": float(raw.get("latitude", 0.0)),
                "longitude": float(raw.get("longitude", 0.0)),
                "data_source": str(raw.get("source", "AgMarkNet"))
            }
        except Exception as e:
            return {"valid": False, "reason": str(e)}

    @staticmethod
    def ingest_records(db: Session, records: List[Dict[str, Any]], data_source: str = "AgMarkNet") -> Dict[str, Any]:
        """
        Batch clean and ingest public market records into database.
        Logs statistics for data transparency.
        """
        added = 0
        skipped = 0

        # Cache existing crops and mandis
        crop_cache = {c.key: c for c in db.query(Crop).all()}
        mandi_cache = {m.name.lower(): m for m in db.query(Mandi).all()}

        for raw in records:
            cleaned = DataService.clean_and_normalize_record(raw)
            if not cleaned["valid"]:
                skipped += 1
                continue

            crop = crop_cache.get(cleaned["crop_key"])
            if not crop:
                skipped += 1
                continue

            mandi_key = cleaned["mandi_name"].lower()
            mandi = mandi_cache.get(mandi_key)
            if not mandi and cleaned["latitude"] != 0.0:
                mandi = Mandi(
                    name=cleaned["mandi_name"],
                    state=cleaned["state"],
                    district=cleaned["district"],
                    latitude=cleaned["latitude"],
                    longitude=cleaned["longitude"]
                )
                db.add(mandi)
                db.commit()
                db.refresh(mandi)
                mandi_cache[mandi_key] = mandi

            if not mandi:
                skipped += 1
                continue

            # Check duplicate
            existing = db.query(MandiPrice).filter(
                MandiPrice.mandi_id == mandi.id,
                MandiPrice.crop_id == crop.id,
                MandiPrice.date == cleaned["date"]
            ).first()

            if not existing:
                price_record = MandiPrice(
                    mandi_id=mandi.id,
                    crop_id=crop.id,
                    date=cleaned["date"],
                    variety=cleaned["variety"],
                    min_price=cleaned["min_price"],
                    max_price=cleaned["max_price"],
                    modal_price=cleaned["modal_price"],
                    arrivals_tonnes=cleaned["arrivals_tonnes"],
                    data_source=data_source
                )
                db.add(price_record)
                added += 1

        db.commit()

        # Log ingestion stats
        log = DataIngestionLog(
            records_added=added,
            records_skipped=skipped,
            data_source=data_source,
            status="SUCCESS",
            message=f"Successfully processed {len(records)} records."
        )
        db.add(log)
        db.commit()

        return {
            "total_processed": len(records),
            "records_added": added,
            "records_skipped": skipped,
            "data_source": data_source
        }
