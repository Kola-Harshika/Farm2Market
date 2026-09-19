import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PriceStatus } from './PriceStatus';
import { AudioButton } from './AudioButton';
import { TrendingDown, TrendingUp, Calendar, Scale } from 'lucide-react';

export const AnalysisCard = ({
  analysisData
}) => {
  const { t } = useLanguage();

  if (!analysisData) return null;

  const {
    crop_name,
    crop_icon,
    quantity_input,
    unit_input,
    quantity_quintals,
    current_price_per_quintal,
    current_gross_value,
    historical_analysis,
    explanation,
    explanation_audio_text,
    data_last_updated
  } = analysisData;

  const dailyChange = historical_analysis?.daily_change;
  const dailyChangePct = historical_analysis?.daily_change_percent;
  const baseline = historical_analysis?.historical_baseline;
  const recentMin = historical_analysis?.recent_range_min;
  const recentMax = historical_analysis?.recent_range_max;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Header Card: Crop, Quantity, Offered Price */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border-2 border-emerald-900/15 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl sm:text-5xl select-none" role="img">
              {crop_icon}
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 uppercase tracking-tight">
                {crop_name}
              </h2>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-900/70 font-semibold">
                <Scale className="w-4 h-4 text-emerald-700" />
                <span>
                  {quantity_input} {unit_input} ({quantity_quintals} quintals)
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-black uppercase tracking-wider text-emerald-900/70">
              {t('current_offer')}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-950">
              ₹{current_price_per_quintal?.toLocaleString()}<span className="text-sm font-bold text-emerald-800">/q</span>
            </div>
            <div className="text-xs font-semibold text-emerald-800/80">
              Gross: ₹{current_gross_value?.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Price Status Badge */}
        <PriceStatus
          classification={historical_analysis?.classification}
          deviationPercent={historical_analysis?.deviation_percent}
        />

        {/* Audio Listen Bar for Quick Access */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-900/70">
            Hear analysis in your language:
          </span>
          <AudioButton text={explanation_audio_text || explanation} />
        </div>
      </div>

      {/* Baseline & Daily Change Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Historical Baseline */}
        <div className="p-4 bg-white rounded-2xl border border-emerald-900/15 shadow-sm">
          <div className="text-xs font-extrabold text-emerald-900/60 uppercase">
            {t('historical_baseline')}
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-950 mt-1">
            ₹{baseline ? baseline.toLocaleString() : 'N/A'}<span className="text-xs font-semibold">/q</span>
          </div>
          <div className="text-[11px] text-emerald-800/70 font-semibold mt-0.5">
            {recentMin && recentMax ? `Range: ₹${recentMin} – ₹${recentMax}` : '30-day median'}
          </div>
        </div>

        {/* Daily Change */}
        <div className="p-4 bg-white rounded-2xl border border-emerald-900/15 shadow-sm">
          <div className="text-xs font-extrabold text-emerald-900/60 uppercase">
            {t('daily_change')}
          </div>
          {dailyChange !== null && dailyChange !== undefined ? (
            <>
              <div className={`text-xl sm:text-2xl font-black mt-1 flex items-center gap-1 ${
                dailyChange < 0 ? 'text-rose-700' : dailyChange > 0 ? 'text-emerald-700' : 'text-slate-700'
              }`}>
                {dailyChange < 0 ? <TrendingDown className="w-5 h-5 shrink-0" /> : <TrendingUp className="w-5 h-5 shrink-0" />}
                <span>{dailyChange > 0 ? `+₹${dailyChange}` : `−₹${Math.abs(dailyChange)}`}/q</span>
              </div>
              <div className="text-[11px] text-emerald-800/70 font-semibold mt-0.5">
                {dailyChangePct !== null ? `${dailyChangePct > 0 ? '+' : ''}${dailyChangePct}% vs yesterday` : ''}
              </div>
            </>
          ) : (
            <div className="text-base font-bold text-slate-500 mt-1">
              Recorded Today
            </div>
          )}
        </div>

        {/* Data Freshness */}
        <div className="col-span-2 sm:col-span-1 p-4 bg-white rounded-2xl border border-emerald-900/15 shadow-sm">
          <div className="text-xs font-extrabold text-emerald-900/60 uppercase">
            {t('data_freshness')}
          </div>
          <div className="text-base sm:text-lg font-black text-emerald-950 mt-1 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{data_last_updated || 'Latest recorded'}</span>
          </div>
          <div className="text-[11px] text-emerald-800/70 font-semibold mt-0.5">
            AgMarkNet / eNAM feeds
          </div>
        </div>
      </div>
    </div>
  );
};
