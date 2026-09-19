from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.schemas import VoiceQueryRequest, VoiceQueryResponse
from app.services.voice_service import VoiceService

router = APIRouter(prefix="/api/voice", tags=["Voice"])

@router.post("/query", response_model=VoiceQueryResponse)
def handle_voice_query(request: VoiceQueryRequest, db: Session = Depends(get_db)):
    """
    Process spoken natural language audio transcriptions in English, Telugu, or Hindi.
    Extracts intents, crop entities, and responds with audio-ready text and actions.
    """
    result = VoiceService.parse_voice_query(
        db=db,
        query=request.query,
        language=request.language or "en",
        lat=request.latitude,
        lon=request.longitude
    )
    return VoiceQueryResponse(**result)
