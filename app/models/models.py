from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Boolean, ForeignKey, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.connection import Base

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(50), unique=True, index=True, nullable=False) # e.g. "onion", "tomato"
    name = Column(String(100), nullable=False)
    name_te = Column(String(100), nullable=False)
    name_hi = Column(String(100), nullable=False)
    icon = Column(String(10), nullable=False) # e.g. "🧅"
    unit = Column(String(20), default="quintal")
    category = Column(String(50), default="Vegetable")

    prices = relationship("MandiPrice", back_populates="crop", cascade="all, delete-orphan")
    alerts = relationship("AlertRule", back_populates="crop")

class Mandi(Base):
    __tablename__ = "mandis"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), index=True, nullable=False)
    state = Column(String(100), index=True, nullable=False)
    district = Column(String(100), index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    market_type = Column(String(50), default="APMC")

    prices = relationship("MandiPrice", back_populates="mandi", cascade="all, delete-orphan")
    alerts = relationship("AlertRule", back_populates="mandi")

class MandiPrice(Base):
    __tablename__ = "mandi_prices"

    id = Column(Integer, primary_key=True, index=True)
    mandi_id = Column(Integer, ForeignKey("mandis.id"), nullable=False, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"), nullable=False, index=True)
    date = Column(Date, index=True, nullable=False)
    variety = Column(String(100), default="Local/Common")
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    modal_price = Column(Float, nullable=False)
    arrivals_tonnes = Column(Float, default=0.0)
    data_source = Column(String(50), default="AgMarkNet")

    mandi = relationship("Mandi", back_populates="prices")
    crop = relationship("Crop", back_populates="prices")

    __table_args__ = (
        Index("idx_mandi_crop_date", "mandi_id", "crop_id", "date"),
    )

class AlertRule(Base):
    __tablename__ = "alert_rules"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(20), nullable=False)
    crop_id = Column(Integer, ForeignKey("crops.id"), nullable=False)
    mandi_id = Column(Integer, ForeignKey("mandis.id"), nullable=True) # None = any nearby
    condition = Column(String(20), nullable=False) # "BELOW", "ABOVE"
    target_price = Column(Float, nullable=False)
    language = Column(String(10), default="en") # "en", "te", "hi"
    notify_sms = Column(Boolean, default=True)
    notify_browser = Column(Boolean, default=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    crop = relationship("Crop", back_populates="alerts")
    mandi = relationship("Mandi", back_populates="alerts")

class DataIngestionLog(Base):
    __tablename__ = "data_ingestion_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    records_added = Column(Integer, default=0)
    records_skipped = Column(Integer, default=0)
    data_source = Column(String(50), default="AgMarkNet")
    status = Column(String(20), default="SUCCESS")
    message = Column(String(255), default="")
