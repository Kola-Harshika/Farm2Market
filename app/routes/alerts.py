from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.models import AlertRule, Crop, Mandi
from app.schemas.schemas import AlertCreateRequest, AlertResponse
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.post("", response_model=AlertResponse)
def create_alert(request: AlertCreateRequest, db: Session = Depends(get_db)):
    """
    Register a price alert rule for SMS or browser notifications.
    """
    crop = db.query(Crop).filter(Crop.key == request.crop_key.lower()).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")

    mandi = None
    if request.mandi_id:
        mandi = db.query(Mandi).filter(Mandi.id == request.mandi_id).first()

    alert = AlertRule(
        phone_number=request.phone_number,
        crop_id=crop.id,
        mandi_id=request.mandi_id,
        condition=request.condition.upper(),
        target_price=request.target_price,
        language=request.language or "en",
        notify_sms=request.notify_sms,
        notify_browser=request.notify_browser,
        active=True
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    return AlertResponse(
        id=alert.id,
        phone_number=alert.phone_number,
        crop_name=crop.name,
        crop_icon=crop.icon,
        mandi_name=mandi.name if mandi else "All Nearby Mandis",
        condition=alert.condition,
        target_price=alert.target_price,
        language=alert.language,
        notify_sms=alert.notify_sms,
        notify_browser=alert.notify_browser,
        active=alert.active,
        created_at=alert.created_at
    )

@router.get("", response_model=List[AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    """
    Retrieve all registered alert rules.
    """
    alerts = db.query(AlertRule).filter(AlertRule.active == True).order_by(AlertRule.id.desc()).all()
    res = []
    for a in alerts:
        res.append(
            AlertResponse(
                id=a.id,
                phone_number=a.phone_number,
                crop_name=a.crop.name if a.crop else "Unknown",
                crop_icon=a.crop.icon if a.crop else "🌾",
                mandi_name=a.mandi.name if a.mandi else "All Nearby Mandis",
                condition=a.condition,
                target_price=a.target_price,
                language=a.language,
                notify_sms=a.notify_sms,
                notify_browser=a.notify_browser,
                active=a.active,
                created_at=a.created_at
            )
        )
    return res

@router.delete("/{alert_id}")
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    """
    Deactivate an alert rule.
    """
    alert = db.query(AlertRule).filter(AlertRule.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert rule not found")
    
    alert.active = False
    db.commit()
    return {"message": "Alert rule deactivated successfully", "id": alert_id}

@router.post("/test-trigger/{alert_id}")
def test_trigger_alert(alert_id: int, db: Session = Depends(get_db)):
    """
    Test trigger an alert to demonstrate the SMS dispatch / mock engine.
    """
    alert = db.query(AlertRule).filter(AlertRule.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert rule not found")

    mandi_name = alert.mandi.name if alert.mandi else "Local Mandi"
    crop_name = alert.crop.name if alert.crop else "Crop"

    msg = NotificationService.format_alert_message(
        crop_name=crop_name,
        mandi_name=mandi_name,
        current_price=alert.target_price,
        condition=alert.condition,
        target_price=alert.target_price,
        language=alert.language
    )

    send_res = NotificationService.send_sms(
        phone=alert.phone_number,
        message=msg,
        language=alert.language
    )

    return {
        "alert_id": alert_id,
        "message": msg,
        "notification_result": send_res
    }
