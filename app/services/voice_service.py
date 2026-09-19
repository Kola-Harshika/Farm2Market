import re
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.models import Crop, MandiPrice
from sqlalchemy import desc

# Multilingual crop alias mapping
CROP_ALIASES = {
    "onion": ["onion", "onions", "ulligadda", "ulli", "yellagadda", "vulli", "pyaz", "pyaaz", "कांदा", "प्याज", "ఉల్లిపాయ", "ఉల్లిగడ్డ", "ఉల్లి"],
    "tomato": ["tomato", "tomatoes", "tamata", "tamatar", "టమాటా", "టమాట", "टमाटर"],
    "rice": ["rice", "paddy", "vari", "biyyam", "chawal", "dhan", "వరి", "బియ్యం", "धान", "चावल"],
    "potato": ["potato", "potatoes", "bangaladumpa", "aloo", "alu", "బంగాళాదుంప", "ఆలూ", "आलू"],
    "chilli": ["chilli", "chillies", "chili", "mirchi", "pachi mirchi", "yendu mirchi", "మిర్చి", "మిరపకాయ", "మిరప", "मिर्च", "मिर्ची"],
    "cotton": ["cotton", "patthi", "kapaas", "kapas", "పత్తి", "कपास"],
    "maize": ["maize", "corn", "mokkajonna", "makka", "bhutta", "మొక్కజొన్న", "మక్క", "मक्का", "भुट्टा"]
}

class VoiceService:
    @staticmethod
    def identify_crop_from_text(text: str) -> Optional[str]:
        text_clean = text.lower()
        for crop_key, aliases in CROP_ALIASES.items():
            for alias in aliases:
                if re.search(r'\b' + re.escape(alias) + r'\b', text_clean, re.UNICODE) or alias in text_clean:
                    return crop_key
        return None

    @staticmethod
    def parse_voice_query(
        db: Session,
        query: str,
        language: str = "en",
        lat: Optional[float] = None,
        lon: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Multilingual voice query understanding and response generation.
        Handles English, Telugu, and Hindi farmer phrases.
        """
        q = query.lower().strip()
        detected_crop = VoiceService.identify_crop_from_text(q)

        # Detect intent
        intent = "general_query"
        action = None
        action_data = {}

        if any(w in q for w in ["map", "location", "route", "మ్యాప్", "దారి", "నక్షా", "नक्शा", "रास्ता"]):
            intent = "view_map"
            action = "OPEN_MAP"
            spoken = "మ్యాప్ తెరవబడుతోంది." if language == "te" else ("नक्शा खोला जा रहा है।" if language == "hi" else "Opening nearby mandis map.")
            display = spoken

        elif any(w in q for w in ["compare", "nearby", "other mandi", "పోల్చు", "సమీప", "మండీలు", "तुलना", "नजदीकी मंडी"]):
            intent = "compare_mandis"
            action = "SHOW_COMPARISON"
            spoken = "సమీప మండీల పోలికను చూపిస్తున్నాను." if language == "te" else ("नजदीकी मंडियों की तुलना दिखाई जा रही है।" if language == "hi" else "Showing nearby mandi comparison.")
            display = spoken

        elif detected_crop:
            intent = "crop_price_inquiry"
            action = "SELECT_CROP"
            action_data = {"crop": detected_crop}

            # Fetch latest price for this crop
            crop_obj = db.query(Crop).filter(Crop.key == detected_crop).first()
            if crop_obj:
                latest = db.query(MandiPrice).filter(MandiPrice.crop_id == crop_obj.id).order_by(desc(MandiPrice.date)).first()
                if latest:
                    m_price = int(latest.modal_price)
                    if language == "te":
                        spoken = f"{crop_obj.name_te} సగటు మార్కెట్ ధర క్వింటాలుకు దాదాపు ₹{m_price:,} గా ఉంది. మీ ప్రస్తుత ధర ఎంత?"
                    elif language == "hi":
                        spoken = f"{crop_obj.name_hi} का औसत बाजार भाव लगभग ₹{m_price:,} प्रति क्विंटल है। आपको क्या भाव मिल रहा है?"
                    else:
                        spoken = f"Recent market baseline for {crop_obj.name} is ₹{m_price:,} per quintal. What price are you offered?"
                    display = spoken
                else:
                    spoken = f"Selected {crop_obj.name}."
                    display = spoken
            else:
                spoken = f"Selected {detected_crop}."
                display = spoken

        elif any(w in q for w in ["explain", "understand", "వివరించు", "అర్థం", "समझाओ", "बताओ"]):
            intent = "explain_result"
            spoken = "విశ్లేషణ సారాంశాన్ని చదువుతున్నాను." if language == "te" else ("विश्लेषण समझाया जा रहा है।" if language == "hi" else "Reading market analysis summary.")
            display = spoken

        else:
            intent = "help"
            if language == "te":
                spoken = "నేను మీకు పంట ధరలు, సమీప మండీల రవాణా ఖర్చులను పోల్చడంలో సహాయపడతాను. పంట పేరు లేదా మీ ధర చెప్పండి."
            elif language == "hi":
                spoken = "मैं आपको फसल के भाव और नजदीकी मंडी के भाड़े की तुलना में मदद कर सकता हूँ। फसल का नाम या भाव बोलें।"
            else:
                spoken = "I can help compare mandi prices and transport costs. Tell me your crop name or offered price."
            display = spoken

        return {
            "understood_intent": intent,
            "detected_crop": detected_crop,
            "spoken_response": spoken,
            "display_response": display,
            "suggested_action": action,
            "action_data": action_data
        }
