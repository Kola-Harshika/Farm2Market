from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import date, datetime

class CropResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    key: str
    name: str
    name_te: str
    name_hi: str
    icon: str
    unit: str
    category: str

class MandiResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    state: str
    district: str
    latitude: float
    longitude: float
    market_type: str
    distance_km: Optional[float] = None

class PriceHistoryItem(BaseModel):
    date: str
    modal_price: float
    min_price: float
    max_price: float
    arrivals_tonnes: Optional[float] = 0.0

class TransportAnalysisItem(BaseModel):
    mandi_id: int
    mandi_name: str
    state: str
    district: str
    distance_km: float
    road_distance_km: float
    transport_rate_per_km_q: float = 2.50
    transport_cost_per_quintal: float = 0.0
    estimated_transport_cost: float
    spoilage_rate_pct: float = 0.0
    spoilage_loss_per_quintal: float = 0.0
    spoilage_total_loss: float = 0.0
    gross_value: float
    estimated_net_value: float
    effective_net_price_per_quintal: float
    net_difference_vs_current: float
    historical_comparable_price: float
    last_updated: str
    latitude: float
    longitude: float
    is_best: bool = False
    google_maps_url: Optional[str] = None

class ColdStorageItem(BaseModel):
    id: int
    name: str
    name_te: Optional[str] = None
    location: str
    distance_km: float
    daily_rate_per_quintal: float
    capacity_tonnes: float
    accreditation: str = "WDRA Accredited"
    features: List[str] = []
    contact: Optional[str] = None
    latitude: float
    longitude: float
    google_maps_url: Optional[str] = None

class HistoricalAnalysis(BaseModel):
    recent_price: Optional[float] = None
    yesterday_price: Optional[float] = None
    daily_change: Optional[float] = None
    daily_change_percent: Optional[float] = None
    historical_baseline: Optional[float] = None
    recent_range_min: Optional[float] = None
    recent_range_max: Optional[float] = None
    deviation_percent: Optional[float] = None
    classification: str  # "LOW", "MODERATE", "HIGH", "INSUFFICIENT_DATA"
    confidence: Optional[float] = None
    historical_chart_data: List[PriceHistoryItem] = []

class AnalyzeRequest(BaseModel):
    crop: str # key, e.g. "onion"
    quantity: float = Field(gt=0, description="Quantity to sell")
    unit: str = "kg" # "kg", "quintal", "tonne"
    latitude: float
    longitude: float
    current_price: float = Field(gt=0, description="Offered price per quintal")
    current_mandi: Optional[str] = None
    language: Optional[str] = "en"
    low_bandwidth: Optional[bool] = False

class AnalyzeResponse(BaseModel):
    crop: str
    crop_name: str
    crop_icon: str
    quantity_input: float
    unit_input: str
    quantity_quintals: float
    current_price_per_quintal: float
    current_gross_value: float
    historical_analysis: HistoricalAnalysis
    comparison_markets: List[TransportAnalysisItem]
    best_option: Optional[TransportAnalysisItem] = None
    cold_storages: List[ColdStorageItem] = []
    spoilage_risk_info: Optional[Dict[str, Any]] = None
    weather_summary: Optional[Dict[str, Any]] = None
    explanation: str
    explanation_audio_text: str
    disclaimer: str
    data_last_updated: str
    total_historical_records: int

class AlertCreateRequest(BaseModel):
    phone_number: str
    crop_key: str
    mandi_id: Optional[int] = None
    condition: str # "BELOW", "ABOVE"
    target_price: float = Field(gt=0)
    language: Optional[str] = "en"
    notify_sms: bool = True
    notify_browser: bool = True

class AlertResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    phone_number: str
    crop_name: str
    crop_icon: str
    mandi_name: Optional[str]
    condition: str
    target_price: float
    language: str
    notify_sms: bool
    notify_browser: bool
    active: bool
    created_at: datetime

class VoiceQueryRequest(BaseModel):
    query: str
    language: Optional[str] = "en"
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class VoiceQueryResponse(BaseModel):
    understood_intent: str
    detected_crop: Optional[str] = None
    spoken_response: str
    display_response: str
    suggested_action: Optional[str] = None
    action_data: Optional[dict] = None

class HealthDataResponse(BaseModel):
    status: str
    data_source: str
    total_mandis: int
    total_crops: int
    total_price_records: int
    latest_record_date: Optional[str]
    earliest_record_date: Optional[str]
    active_alerts: int
