from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.services.mandi_service import MandiService
from app.schemas.schemas import MandiResponse

router = APIRouter(prefix="/api/mandis", tags=["Mandis"])

@router.get("/nearby", response_model=List[MandiResponse])
def get_nearby_mandis(
    lat: float = Query(..., description="Latitude of farmer or reference location"),
    lon: float = Query(..., description="Longitude of farmer or reference location"),
    radius_km: float = Query(120.0, description="Search radius in kilometers"),
    db: Session = Depends(get_db)
):
    """
    Find mandis near the specified GPS coordinates within the specified radius.
    """
    results = MandiService.get_nearby_mandis(db, lat=lat, lon=lon, max_distance_km=radius_km)
    response_items = []
    for r in results:
        m = r["mandi"]
        response_items.append(
            MandiResponse(
                id=m.id,
                name=m.name,
                state=m.state,
                district=m.district,
                latitude=m.latitude,
                longitude=m.longitude,
                market_type=m.market_type,
                distance_km=r["distance_km"]
            )
        )
    return response_items
