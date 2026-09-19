from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.connection import get_db
from app.models.models import Crop, Mandi, MandiPrice, AlertRule
from app.schemas.schemas import HealthDataResponse

router = APIRouter(prefix="/api/health", tags=["Health & Monitoring"])

@router.get("")
def health_check():
    return {
        "status": "healthy",
        "service": "Farm2Market Backend API",
        "version": "1.0.0"
    }

@router.get("/data", response_model=HealthDataResponse)
def data_health_status(db: Session = Depends(get_db)):
    """
    Developer & Data freshness monitoring endpoint.
    Reports real dataset size, freshness dates, and active alert rules.
    """
    total_mandis = db.query(Mandi).count()
    total_crops = db.query(Crop).count()
    total_prices = db.query(MandiPrice).count()
    active_alerts = db.query(AlertRule).filter(AlertRule.active == True).count()

    latest_date = db.query(func.max(MandiPrice.date)).scalar()
    earliest_date = db.query(func.min(MandiPrice.date)).scalar()

    return HealthDataResponse(
        status="OPERATIONAL",
        data_source="AgMarkNet / eNAM Normalized Dataset",
        total_mandis=total_mandis,
        total_crops=total_crops,
        total_price_records=total_prices,
        latest_record_date=str(latest_date) if latest_date else None,
        earliest_record_date=str(earliest_date) if earliest_date else None,
        active_alerts=active_alerts
    )
