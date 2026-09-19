import React from 'react';
import { Truck, Info } from 'lucide-react';

export const TransportCard = ({
  quantityQuintals = 5,
  bestMandi = null
}) => {
  if (!bestMandi) return null;

  const distanceKm = bestMandi.road_distance_km || bestMandi.distance_km;
  const transportCost = bestMandi.estimated_transport_cost;
  const grossValue = bestMandi.gross_value;
  const netValue = bestMandi.estimated_net_value;

  return (
    <div className="p-4 sm:p-5 bg-white rounded-2xl border border-emerald-900/15 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-800" />
          <h4 className="text-base sm:text-lg font-black text-emerald-950">
            Transportation Economic Model
          </h4>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
          Transparent Freight Estimation
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-emerald-900/70 font-semibold">1. Gross Market Value</div>
          <div className="text-lg font-black text-emerald-950 mt-1">
            ₹{grossValue?.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-900/60 mt-0.5">
            ₹{bestMandi.historical_comparable_price?.toLocaleString()}/q × {quantityQuintals} q
          </div>
        </div>

        <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200">
          <div className="text-rose-900/70 font-semibold">2. Estimated Freight</div>
          <div className="text-lg font-black text-rose-700 mt-1">
            − ₹{transportCost?.toLocaleString()}
          </div>
          <div className="text-[11px] text-rose-900/60 mt-0.5">
            {distanceKm} km road freight model
          </div>
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300">
          <div className="text-emerald-900/70 font-semibold">3. Estimated Net Value</div>
          <div className="text-lg font-black text-emerald-800 mt-1">
            ₹{netValue?.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-900/60 mt-0.5">
            ₹{bestMandi.effective_net_price_per_quintal?.toLocaleString()}/q effective
          </div>
        </div>
      </div>

      <div className="text-xs text-emerald-900/70 flex items-start gap-1.5 pt-1">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <span>
          Freight estimated using standard regional mini-truck/trolley rates (₹14/km base + ₹250 handling).
          Always negotiate final transport directly with local carriers.
        </span>
      </div>
    </div>
  );
};
