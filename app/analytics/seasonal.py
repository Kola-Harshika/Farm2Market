from typing import List, Dict, Any
import statistics

def calculate_seasonal_bands(prices: List[float]) -> Dict[str, Any]:
    """
    Calculate seasonal quartile distribution (p25, p50, p75).
    """
    if len(prices) < 4:
        return {
            "p25": None,
            "p50": None,
            "p75": None,
            "iqr": None
        }

    sorted_prices = sorted(prices)
    n = len(sorted_prices)

    p25 = round(sorted_prices[int(n * 0.25)], 2)
    p50 = round(statistics.median(sorted_prices), 2)
    p75 = round(sorted_prices[int(n * 0.75)], 2)
    iqr = round(p75 - p25, 2)

    return {
        "p25": p25,
        "p50": p50,
        "p75": p75,
        "iqr": iqr
    }
