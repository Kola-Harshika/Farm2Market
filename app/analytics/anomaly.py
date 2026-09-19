from typing import Dict, Any, Optional

def classify_price_offer(
    current_price: float,
    baseline: Optional[float],
    recent_range_min: Optional[float] = None,
    recent_range_max: Optional[float] = None,
    low_threshold_pct: float = 8.0,
    high_threshold_pct: float = 8.0
) -> Dict[str, Any]:
    """
    Classify the current offered price against historical baseline and recent trading range.
    Thresholds are fully configurable.
    
    LOW: Significantly lower than comparable baseline (>8% below).
    MODERATE: Within standard historical spread (-8% to +8%).
    HIGH: Above standard historical baseline (>8% above).
    """
    if baseline is None or baseline <= 0:
        return {
            "classification": "INSUFFICIENT_DATA",
            "signal_color": "gray",
            "deviation_percent": None,
            "badge_label": "INSUFFICIENT DATA",
            "summary_text": "Not enough historical records for a statistically reliable price baseline."
        }

    deviation = current_price - baseline
    dev_percent = round((deviation / baseline) * 100, 1)

    if dev_percent < -low_threshold_pct:
        classification = "LOW"
        signal_color = "red"
        badge_label = "LOW"
        summary_text = f"Offered price is {abs(dev_percent)}% below the historical baseline of ₹{baseline:.0f}/q."
    elif dev_percent > high_threshold_pct:
        classification = "HIGH"
        signal_color = "green"
        badge_label = "HIGH"
        summary_text = f"Offered price is {dev_percent}% above the historical baseline of ₹{baseline:.0f}/q."
    else:
        classification = "MODERATE"
        signal_color = "yellow"
        badge_label = "MODERATE"
        summary_text = f"Offered price is within the normal historical trading range (±{low_threshold_pct}% of baseline ₹{baseline:.0f}/q)."

    return {
        "classification": classification,
        "signal_color": signal_color,
        "deviation_percent": dev_percent,
        "badge_label": badge_label,
        "summary_text": summary_text
    }
