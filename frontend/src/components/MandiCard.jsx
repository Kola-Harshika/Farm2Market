import React from 'react';
import { Award, ArrowUpRight, TrendingDown } from 'lucide-react';

export const MandiCard = ({ market, isBest = false, isCurrent = false }) => {

  return (
    <div
      className={`p-4 rounded-2xl border-2 transition-all shadow-sm ${
        isBest
          ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20'
          : isCurrent
          ? 'bg-slate-50 border-slate-300'
          : 'bg-white border-emerald-900/15'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          {isBest && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-700 text-white mb-1.5 uppercase tracking-wide">
              <Award className="w-3.5 h-3.5" /> Best Option for Consideration
            </span>
          )}
          {isCurrent && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800 mb-1.5 uppercase">
              Current Local Mandi
            </span>
          )}
          <h4 className="text-base sm:text-lg font-black text-emerald-950 leading-tight">
            {market.mandi_name}
          </h4>
          <p className="text-xs text-emerald-900/60 font-semibold">
            {market.district}, {market.state} • {market.road_distance_km || market.distance_km} km road distance
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs font-bold text-emerald-900/70">
            Historical Price
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-950">
            ₹{market.historical_comparable_price?.toLocaleString()}/q
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-emerald-900/10 grid grid-cols-2 gap-2 text-xs sm:text-sm">
        <div className="bg-white/80 p-2 rounded-xl border border-emerald-900/10">
          <div className="text-emerald-900/70 font-semibold">Est. Transport Cost</div>
          <div className="font-extrabold text-emerald-950">
            ₹{market.estimated_transport_cost?.toLocaleString()}
          </div>
        </div>

        <div className="bg-white/80 p-2 rounded-xl border border-emerald-900/10">
          <div className="text-emerald-900/70 font-semibold">Est. Net Return</div>
          <div className="font-extrabold text-emerald-950">
            ₹{market.estimated_net_value?.toLocaleString()}
          </div>
        </div>
      </div>

      {market.net_difference_vs_current !== undefined && market.net_difference_vs_current !== 0 && (
        <div className="mt-2.5 flex items-center justify-between text-xs font-bold">
          <span className="text-emerald-900/70">Vs. Selling Locally:</span>
          {market.net_difference_vs_current > 0 ? (
            <span className="text-emerald-700 flex items-center gap-0.5">
              <ArrowUpRight className="w-4 h-4" /> +₹{market.net_difference_vs_current?.toLocaleString()} est. net gain
            </span>
          ) : (
            <span className="text-rose-600 flex items-center gap-0.5">
              <TrendingDown className="w-4 h-4" /> -₹{Math.abs(market.net_difference_vs_current)?.toLocaleString()} lower
            </span>
          )}
        </div>
      )}
    </div>
  );
};
