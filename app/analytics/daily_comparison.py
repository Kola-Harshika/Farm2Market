from typing import Dict, Any, Optional

def calculate_daily_comparison(current_price: float, previous_day_price: Optional[float]) -> Dict[str, Any]:
    """
    Calculate day-to-day absolute and percentage change from the most recent previous trading record.
    """
    if previous_day_price is None or previous_day_price <= 0:
        return {
            "yesterday_price": None,
            "daily_change": None,
            "daily_change_percent": None,
            "summary_text": "No previous trading day price recorded"
        }

    diff = round(current_price - previous_day_price, 2)
    diff_percent = round((diff / previous_day_price) * 100, 1)

    if diff > 0:
        summary = f"+₹{abs(diff):.0f}/q (+{diff_percent}%) higher than previous day"
    elif diff < 0:
        summary = f"-₹{abs(diff):.0f}/q ({diff_percent}%) lower than previous day"
    else:
        summary = "Unchanged from previous day recorded price"

    return {
        "yesterday_price": previous_day_price,
        "daily_change": diff,
        "daily_change_percent": diff_percent,
        "summary_text": summary
    }
