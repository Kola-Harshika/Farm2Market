import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Award, ShieldAlert } from 'lucide-react';

export const MandiComparison = ({
  markets = [],
  bestOption = null,
  quantityQuintals = 0
}) => {
  const { t } = useLanguage();

  if (!markets || markets.length === 0) {
    return (
      <div className="p-6 text-center bg-white rounded-2xl border border-emerald-900/15 text-emerald-900/60 font-semibold">
        No nearby mandis found for comparison.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Best Option Highlight Banner */}
      {bestOption && (
        <div className="p-5 rounded-2xl bg-emerald-800 text-white shadow-md border-2 border-emerald-900 space-y-2">
          <div className="flex items-center gap-2 text-emerald-200 text-xs sm:text-sm font-black uppercase tracking-wider">
            <Award className="w-5 h-5 text-amber-300 fill-amber-300" />
            <span>{t('best_option_title')}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {bestOption.mandi_name}
              </h3>
              <p className="text-sm text-emerald-100 font-medium">
                {bestOption.road_distance_km || bestOption.distance_km} km away • Historical Price: ₹{bestOption.historical_comparable_price?.toLocaleString()}/q
              </p>
            </div>

            <div className="bg-emerald-900/80 px-4 py-2 rounded-xl border border-emerald-700/50 text-right shrink-0">
              <div className="text-xs text-emerald-200 font-bold">Est. Net Return</div>
              <div className="text-2xl font-black text-amber-300">
                ₹{bestOption.estimated_net_value?.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-200">
                (₹{bestOption.effective_net_price_per_quintal?.toLocaleString()}/q net)
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium pt-2 border-t border-emerald-700/50">
            {t('best_option_note')}
          </p>
        </div>
      )}

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border border-emerald-900/15 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-emerald-900/10">
          <h4 className="text-base sm:text-lg font-black text-emerald-950">
            {t('mandi_comparison_title')}
          </h4>
          <p className="text-xs sm:text-sm text-emerald-900/60 font-semibold">
            {t('comparison_subtitle')} ({quantityQuintals} quintals)
          </p>
        </div>

        {/* Desktop / Tablet Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-900/5 text-emerald-950 font-extrabold border-b border-emerald-900/10">
                <th className="p-3 sm:p-3.5">{t('table_mandi')}</th>
                <th className="p-3 sm:p-3.5 text-center">{t('table_distance')}</th>
                <th className="p-3 sm:p-3.5 text-right">{t('table_hist_price')}</th>
                <th className="p-3 sm:p-3.5 text-right">{t('table_transport')}</th>
                <th className="p-3 sm:p-3.5 text-right font-black">{t('table_net_value')}</th>
                <th className="p-3 sm:p-3.5 text-right">{t('table_net_rate')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {markets.map((m) => {
                const isBest = bestOption && bestOption.mandi_id === m.mandi_id;
                return (
                  <tr
                    key={m.mandi_id}
                    className={`transition-colors ${
                      isBest ? 'bg-emerald-50/90 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="p-3 sm:p-3.5">
                      <div className="flex items-center gap-1.5">
                        {isBest && <Award className="w-4 h-4 text-emerald-700 shrink-0" />}
                        <span className="font-bold text-emerald-950">{m.mandi_name}</span>
                      </div>
                      <div className="text-[11px] text-emerald-900/60 font-normal">
                        {m.district}, {m.state}
                      </div>
                    </td>
                    <td className="p-3 sm:p-3.5 text-center font-semibold text-emerald-900/80">
                      {m.road_distance_km || m.distance_km} km
                    </td>
                    <td className="p-3 sm:p-3.5 text-right font-semibold text-emerald-950">
                      ₹{m.historical_comparable_price?.toLocaleString()}
                    </td>
                    <td className="p-3 sm:p-3.5 text-right font-semibold text-slate-600">
                      ₹{m.estimated_transport_cost?.toLocaleString()}
                    </td>
                    <td className="p-3 sm:p-3.5 text-right font-black text-emerald-950">
                      ₹{m.estimated_net_value?.toLocaleString()}
                    </td>
                    <td className="p-3 sm:p-3.5 text-right font-bold text-emerald-800">
                      ₹{m.effective_net_price_per_quintal?.toLocaleString()}/q
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 text-[11px] text-emerald-900/70 border-t border-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Based on historical market records and estimated road freight formulas. Actual spot rates vary daily.</span>
        </div>
      </div>
    </div>
  );
};
