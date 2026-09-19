from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.models import Crop, MandiPrice
from app.services.mandi_service import MandiService
from app.schemas.schemas import PriceHistoryItem

router = APIRouter(prefix="/api/prices", tags=["Prices"])

@router.get("/history", response_model=List[PriceHistoryItem])
def get_price_history(
    crop: str = Query(..., description="Crop key, e.g. 'onion'"),
    mandi_id: Optional[int] = Query(None, description="Optional specific mandi ID"),
    days: int = Query(30, description="Number of past days to retrieve"),
    db: Session = Depends(get_db)
):
    """
    Get historical trading price series for chart visualization.
    """
    crop_obj = MandiService.get_crop_by_key(db, crop)
    if not crop_obj:
        raise HTTPException(status_code=404, detail="Crop not found")

    records = MandiService.get_historical_prices(db, crop_id=crop_obj.id, mandi_id=mandi_id, days_limit=days)
    return [
        PriceHistoryItem(
            date=str(r.date),
            modal_price=r.modal_price,
            min_price=r.min_price,
            max_price=r.max_price,
            arrivals_tonnes=r.arrivals_tonnes
        )
        for r in records
    ]

@router.get("/latest")
def get_latest_prices(
    crop: str = Query(..., description="Crop key, e.g. 'onion'"),
    db: Session = Depends(get_db)
):
    """
    Get the latest prices for a crop across all tracked mandis.
    """
    crop_obj = MandiService.get_crop_by_key(db, crop)
    if not crop_obj:
        raise HTTPException(status_code=404, detail="Crop not found")

    from app.models.models import Mandi
    mandis = db.query(Mandi).all()
    results = MandiService.get_latest_mandi_prices_for_crop(db, crop_obj.id, [m.id for m in mandis])
    
    return [
        {
            "mandi_id": r["mandi"].id,
            "mandi_name": r["mandi"].name,
            "district": r["mandi"].district,
            "state": r["mandi"].state,
            "modal_price": r["latest_price"],
            "last_updated": str(r["last_updated"])
        }
        for r in results
    ]
