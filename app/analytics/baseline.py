from typing import List, Dict, Any, Optional
import statistics

def calculate_baseline(prices: List[float], days_window: int = 30) -> Dict[str, Any]:
    """
    Calculate statistical baseline from a series of historical modal prices.
    Uses median to avoid outlier distortion from sudden mandi spikes.
    """
    if not prices:
        return {
            "baseline": None,
            "recent_range_min": None,
            "recent_range_max": None,
            "mean": None,
            "std_dev": None,
            "count": 0
        }

    count = len(prices)
    median_val = round(statistics.median(prices), 2)
    mean_val = round(statistics.mean(prices), 2)
    std_val = round(statistics.stdev(prices), 2) if count > 1 else 0.0

    # Recent range (last 7 recorded trading points or all if fewer)
    recent_subset = prices[:min(7, count)]
    range_min = round(min(recent_subset), 2)
    range_max = round(max(recent_subset), 2)

    return {
        "baseline": median_val,
        "recent_range_min": range_min,
        "recent_range_max": range_max,
        "mean": mean_val,
        "std_dev": std_val,
        "count": count
    }
