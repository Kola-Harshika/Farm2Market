import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';

export const HistoricalChart = ({
  chartData = [],
  currentPrice = 0,
  baseline = 0,
  cropName = ''
}) => {
  const { t } = useLanguage();

  if (!chartData || chartData.length === 0) {
    return (
      <div className="p-6 text-center bg-white rounded-2xl border border-emerald-900/15 text-emerald-900/60 font-semibold">
        No historical chart data available for this selection.
      </div>
    );
  }

  // Format data for chart
  const formattedData = chartData.map((d) => ({
    date: d.date.slice(5), // "MM-DD"
    fullDate: d.date,
    modalPrice: d.modal_price,
    minPrice: d.min_price,
    maxPrice: d.max_price
  }));

  // Min and max for domain
  const prices = formattedData.map((d) => d.modalPrice);
  if (currentPrice) prices.push(currentPrice);
  if (baseline) prices.push(baseline);
  const minVal = Math.floor(Math.min(...prices) * 0.85);
  const maxVal = Math.ceil(Math.max(...prices) * 1.15);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-900/15 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h3 className="text-base sm:text-lg font-bold text-emerald-950">
          {t('chart_title')} {cropName ? `— ${cropName}` : ''}
        </h3>
        <span className="text-xs font-semibold text-emerald-800/70">
          Modal Price (₹ / quintal)
        </span>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />

            <XAxis
              dataKey="date"
              tickLine={false}
              tick={{ fontSize: 11, fill: '#52665B' }}
              stroke="#D1D5DB"
            />

            <YAxis
              domain={[minVal, maxVal]}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#52665B' }}
              stroke="#D1D5DB"
              tickFormatter={(v) => `₹${v}`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-emerald-950 text-white p-2.5 rounded-xl text-xs space-y-1 shadow-lg border border-emerald-800">
                      <div className="font-bold text-emerald-300">{data.fullDate}</div>
                      <div>Modal Price: <b>₹{data.modalPrice?.toLocaleString()}</b></div>
                      <div className="text-emerald-200/70">Range: ₹{data.minPrice} – ₹{data.maxPrice}</div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Baseline reference line */}
            {baseline > 0 && (
              <ReferenceLine
                y={baseline}
                stroke="#D4A373"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{
                  value: `Baseline ₹${baseline}`,
                  position: 'insideTopRight',
                  fill: '#8B5E34',
                  fontSize: 11,
                  fontWeight: 'bold'
                }}
              />
            )}

            {/* Current offer reference line */}
            {currentPrice > 0 && (
              <ReferenceLine
                y={currentPrice}
                stroke="#D90429"
                strokeWidth={2}
                label={{
                  value: `Your Offer ₹${currentPrice}`,
                  position: 'insideBottomRight',
                  fill: '#D90429',
                  fontSize: 11,
                  fontWeight: 'bold'
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="modalPrice"
              stroke="#2D6A4F"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-4 text-emerald-950/80 font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#2D6A4F] inline-block"></span> Mandi History
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b-2 border-dashed border-[#D4A373] inline-block"></span> Baseline
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#D90429] inline-block"></span> Offered
          </span>
        </div>
        <p className="text-emerald-900/60 text-[11px] italic">
          {t('chart_disclaimer')}
        </p>
      </div>
    </div>
  );
};
