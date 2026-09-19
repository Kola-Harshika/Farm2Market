from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.models import Crop
from app.schemas.schemas import CropResponse

router = APIRouter(prefix="/api/crops", tags=["Crops"])

@router.get("", response_model=List[CropResponse])
def get_crops(db: Session = Depends(get_db)):
    """
    Retrieve all registered crops with pictorial icons and multilingual names.
    """
    return db.query(Crop).order_by(Crop.id).all()
