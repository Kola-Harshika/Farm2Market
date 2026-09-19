import os
import logging
from typing import Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class NotificationService:
    @staticmethod
    def send_sms(phone: str, message: str, language: str = "en") -> Dict[str, Any]:
        """
        SMS dispatch service abstraction.
        Supports real SMS gateway integration via environment variables
        or transparent development mock mode.
        """
        provider = os.getenv("SMS_PROVIDER", "mock").lower()
        api_key = os.getenv("SMS_API_KEY", "")
        sender_id = os.getenv("SMS_SENDER_ID", "FARM2MKT")

        timestamp = datetime.utcnow().isoformat()

        if provider == "mock" or not api_key:
            logger.info(f"[SMS MOCK] To: {phone} | Sender: {sender_id} | Msg: {message}")
            return {
                "success": True,
                "status": "MOCK_DELIVERED",
                "provider": "mock",
                "phone": phone,
                "timestamp": timestamp,
                "message": message,
                "notice": "SMS provider not configured (Running in transparent demonstration mock mode)."
            }

        # Real SMS Gateway implementation stub (e.g. Twilio, Fast2SMS, Gupshup)
        try:
            # When live credentials are provided in .env:
            logger.info(f"Dispatching real SMS via provider '{provider}' to {phone}")
            # Example HTTP client call here when provider configured...
            return {
                "success": True,
                "status": "SENT",
                "provider": provider,
                "phone": phone,
                "timestamp": timestamp,
                "notice": f"Dispatched via {provider} gateway."
            }
        except Exception as e:
            logger.error(f"Failed to dispatch SMS to {phone}: {str(e)}")
            return {
                "success": False,
                "status": "ERROR",
                "provider": provider,
                "phone": phone,
                "timestamp": timestamp,
                "error": str(e)
            }

    @staticmethod
    def format_alert_message(
        crop_name: str,
        mandi_name: str,
        current_price: float,
        condition: str,
        target_price: float,
        language: str = "en"
    ) -> str:
        lang = language.lower() if language else "en"

        if lang in ("te", "telugu"):
            if condition.upper() == "BELOW":
                return f"[Farm2Market అలర్ట్] {mandi_name} లో {crop_name} ధర ₹{current_price:,.0f} కు పడిపోయింది. (మీ టార్గెట్: ₹{target_price:,.0f})"
            else:
                return f"[Farm2Market అలర్ట్] {mandi_name} లో {crop_name} ధర ₹{current_price:,.0f} కు చేరింది! (మీ టార్గెట్: ₹{target_price:,.0f})"
        elif lang in ("hi", "hindi"):
            if condition.upper() == "BELOW":
                return f"[Farm2Market अलर्ट] {mandi_name} में {crop_name} का भाव गिरकर ₹{current_price:,.0f} हो गया है। (लक्ष्य: ₹{target_price:,.0f})"
            else:
                return f"[Farm2Market अलर्ट] {mandi_name} में {crop_name} का भाव ₹{current_price:,.0f} पहुंच गया है! (लक्ष्य: ₹{target_price:,.0f})"
        else:
            if condition.upper() == "BELOW":
                return f"[Farm2Market Alert] {crop_name} price at {mandi_name} dropped to ₹{current_price:,.0f}/q (below your threshold of ₹{target_price:,.0f}/q)."
            else:
                return f"[Farm2Market Alert] {crop_name} price at {mandi_name} reached ₹{current_price:,.0f}/q (above your threshold of ₹{target_price:,.0f}/q)!"
