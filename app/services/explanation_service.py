from typing import Dict, Any, Optional

class ExplanationService:
    @staticmethod
    def generate_explanation(
        crop_name: str,
        crop_name_te: str,
        crop_name_hi: str,
        current_price: float,
        quantity_quintals: float,
        baseline: Optional[float],
        classification: str,
        yesterday_price: Optional[float],
        daily_diff: Optional[float],
        best_option: Optional[Dict[str, Any]],
        language: str = "en"
    ) -> Dict[str, str]:
        """
        Generates responsible, factual, transparent decision-support explanation.
        NEVER predicts future certainty or promises profits.
        Supports English, Telugu, and Hindi.
        """
        lang = language.lower() if language else "en"

        # English Generation
        if lang == "en":
            parts = []
            if classification == "LOW":
                parts.append(
                    f"Your current {crop_name} offer of ₹{current_price:,.0f}/q is lower than the comparable historical baseline of ₹{baseline:,.0f}/q."
                )
            elif classification == "HIGH":
                parts.append(
                    f"Your current {crop_name} offer of ₹{current_price:,.0f}/q is higher than the comparable historical baseline of ₹{baseline:,.0f}/q."
                )
            elif classification == "MODERATE":
                parts.append(
                    f"Your current {crop_name} offer of ₹{current_price:,.0f}/q is within the normal historical trading range for this season."
                )
            else:
                parts.append(
                    f"Historical comparison is limited for {crop_name} in this area."
                )

            if yesterday_price is not None and daily_diff is not None:
                if daily_diff < 0:
                    parts.append(f"It is ₹{abs(daily_diff):,.0f}/q lower than yesterday's recorded price of ₹{yesterday_price:,.0f}/q.")
                elif daily_diff > 0:
                    parts.append(f"It is ₹{daily_diff:,.0f}/q higher than yesterday's recorded price of ₹{yesterday_price:,.0f}/q.")

            if best_option:
                m_name = best_option["mandi_name"]
                m_dist = best_option["distance_km"]
                m_hist = best_option["historical_comparable_price"]
                m_trans = best_option["estimated_transport_cost"]
                m_net = best_option["estimated_net_value"]
                net_gain = best_option["net_difference_vs_current"]

                if net_gain > 0:
                    parts.append(
                        f"Nearby market '{m_name}' ({m_dist:.0f} km away) recently recorded ₹{m_hist:,.0f}/q. "
                        f"After deducting an estimated transportation cost of ₹{m_trans:,.0f}, "
                        f"it yields an estimated net value of ₹{m_net:,.0f} (+₹{net_gain:,.0f} compared to selling locally). "
                        f"This is the strongest estimated option based on available historical comparisons."
                    )
                else:
                    parts.append(
                        f"Although nearby mandis were evaluated, transportation expenses reduce their net return below your current local offer."
                    )

            display_text = " ".join(parts)
            audio_text = display_text

        # Telugu Generation (తెలుగు)
        elif lang in ("te", "telugu"):
            parts = []
            crop_label = crop_name_te or crop_name
            if classification == "LOW":
                parts.append(
                    f"మీ ప్రస్తుత {crop_label} ధర క్వింటాలుకు ₹{current_price:,.0f}, సాధారణ సగటు ధర ₹{baseline:,.0f} కంటే తక్కువగా ఉంది."
                )
            elif classification == "HIGH":
                parts.append(
                    f"మీ ప్రస్తుత {crop_label} ధర క్వింటాలుకు ₹{current_price:,.0f}, మార్కెట్ సగటు ధర ₹{baseline:,.0f} కంటే ఎక్కువగా ఉంది."
                )
            else:
                parts.append(
                    f"మీ ప్రస్తుత {crop_label} ధర క్వింటాలుకు ₹{current_price:,.0f}, సాధారణ మార్కెట్ ధర పరిధిలోనే ఉంది."
                )

            if yesterday_price is not None and daily_diff is not None:
                if daily_diff < 0:
                    parts.append(f"నిన్నటి ధర ₹{yesterday_price:,.0f} తో పోలిస్తే ₹{abs(daily_diff):,.0f} తగ్గింది.")
                elif daily_diff > 0:
                    parts.append(f"నిన్నటి ధర కంటే ₹{daily_diff:,.0f} పెరిగింది.")

            if best_option:
                m_name = best_option["mandi_name"]
                m_dist = best_option["distance_km"]
                m_trans = best_option["estimated_transport_cost"]
                net_gain = best_option["net_difference_vs_current"]

                if net_gain > 0:
                    parts.append(
                        f"సమీపంలోని {m_name} మండి ({m_dist:.0f} కి.మీ) లో రవాణా ఖర్చు ₹{m_trans:,.0f} తీసివేసిన తర్వాత కూడా మీకు ₹{net_gain:,.0f} అదనపు లాభం వచ్చే అవకాశం ఉంది. ఈ విశ్లేషణ ప్రకారం ఇది ఉత్తమ ఎంపికగా కనిపిస్తోంది."
                    )

            display_text = " ".join(parts)
            audio_text = display_text

        # Hindi Generation (हिन्दी)
        elif lang in ("hi", "hindi"):
            parts = []
            crop_label = crop_name_hi or crop_name
            if classification == "LOW":
                parts.append(
                    f"आपकी {crop_label} की वर्तमान कीमत ₹{current_price:,.0f} प्रति क्विंटल, ऐतिहासिक औसत ₹{baseline:,.0f} से कम है।"
                )
            elif classification == "HIGH":
                parts.append(
                    f"आपकी {crop_label} की वर्तमान कीमत ₹{current_price:,.0f} प्रति क्विंटल, ऐतिहासिक औसत ₹{baseline:,.0f} से अधिक है।"
                )
            else:
                parts.append(
                    f"आपकी {crop_label} की वर्तमान कीमत ₹{current_price:,.0f} प्रति क्विंटल, सामान्य मौसमी दायरे में है।"
                )

            if yesterday_price is not None and daily_diff is not None:
                if daily_diff < 0:
                    parts.append(f"यह कल की कीमत ₹{yesterday_price:,.0f} से ₹{abs(daily_diff):,.0f} कम है।")
                elif daily_diff > 0:
                    parts.append(f"यह कल की कीमत से ₹{daily_diff:,.0f} अधिक है।")

            if best_option:
                m_name = best_option["mandi_name"]
                m_dist = best_option["distance_km"]
                m_trans = best_option["estimated_transport_cost"]
                net_gain = best_option["net_difference_vs_current"]

                if net_gain > 0:
                    parts.append(
                        f"पास की मंडी {m_name} ({m_dist:.0f} किमी) में अनुमानित भाड़ा ₹{m_trans:,.0f} काटने के बाद भी ₹{net_gain:,.0f} अधिक शुद्ध लाभ मिल सकता है। इस विश्लेषण के आधार पर यह विचारणीय विकल्प है।"
                    )

            display_text = " ".join(parts)
            audio_text = display_text
        else:
            display_text = f"{crop_name} offered price ₹{current_price}/q compared with historical baseline ₹{baseline}/q."
            audio_text = display_text

        disclaimer = (
            "Farm2Market provides decision support using historical market data and transport models. "
            "Actual daily spot prices and road transport costs may vary. The farmer remains the final decision-maker."
        )

        return {
            "display_text": display_text,
            "audio_text": audio_text,
            "disclaimer": disclaimer
        }
