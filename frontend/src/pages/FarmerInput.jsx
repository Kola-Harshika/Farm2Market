import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LocationSelector } from '../components/LocationSelector';
import { PriceInput } from '../components/PriceInput';
import { ArrowLeft, Scale, Loader2, Sparkles } from 'lucide-react';

export const FarmerInput = ({
  crop,
  quantity,
  unit,
  location,
  currentPrice,
  onQuantityChange,
  onUnitChange,
  onLocationChange,
  onPriceChange,
  onAnalyze,
  onBack,
  isAnalyzing = false
}) => {
  const { t } = useLanguage();

  // Calculate normalized quintals for farmer preview
  const getNormalizedQuintals = () => {
    const q = parseFloat(quantity) || 0;
    if (unit === 'kg') return Math.round((q / 100) * 100) / 100;
    if (unit === 'tonne') return q * 10;
    return q;
  };

  const isQuantityValid = quantity > 0;
  const isLocationValid = location && location.latitude && location.longitude;
  const isPriceValid = currentPrice > 0;

  return (
    <div className="min-h-screen max-w-2xl mx-auto p-4 sm:p-6 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Top bar with back button & step indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-900/10">
          <button
            type="button"
            onClick={onBack}
            className="tap-target inline-flex items-center gap-2 text-sm font-bold text-emerald-900 hover:text-emerald-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('back_button')}</span>
          </button>
          <div className="text-xs font-black uppercase text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
            Step 2 of 3
          </div>
        </div>

        {/* Selected Crop Pill */}
        <div className="p-3.5 bg-white rounded-2xl border border-emerald-900/15 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none" role="img">{crop.icon}</span>
            <div>
              <div className="text-xs font-bold text-emerald-900/60 uppercase">Selected Crop</div>
              <div className="text-lg font-black text-emerald-950">{crop.name}</div>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Standard Quality
          </span>
        </div>

        {/* Form Container */}
        <div className="bg-white p-5 sm:p-7 rounded-3xl border-2 border-emerald-900/15 shadow-sm space-y-6">
          {/* 1. Quantity Section */}
          <div className="space-y-3">
            <label className="block text-lg sm:text-xl font-bold text-emerald-950">
              {t('step_quantity')}
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                min="1"
                step="any"
                value={quantity || ''}
                onChange={(e) => onQuantityChange(parseFloat(e.target.value) || 0)}
                placeholder="500"
                aria-label={t('step_quantity')}
                className="flex-1 py-3 px-4 bg-slate-50 border-2 border-emerald-900/25 rounded-2xl text-2xl sm:text-3xl font-black text-emerald-950 placeholder-emerald-900/30 focus:border-emerald-700 focus:outline-none"
              />

              {/* Unit Dropdown / Buttons */}
              <div className="flex rounded-2xl border-2 border-emerald-900/20 overflow-hidden bg-slate-100 p-1 shrink-0">
                {[
                  { key: 'kg', label: t('unit_kg') },
                  { key: 'quintal', label: t('unit_quintal') },
                  { key: 'tonne', label: t('unit_tonne') }
                ].map((u) => (
                  <button
                    key={u.key}
                    type="button"
                    onClick={() => onUnitChange(u.key)}
                    className={`tap-target px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-colors ${
                      unit === u.key
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'text-emerald-950 hover:bg-slate-200'
                    }`}
                  >
                    {u.key}
                  </button>
                ))}
              </div>
            </div>

            {quantity > 0 && (
              <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-700" />
                <span>Normalized: <b>{getNormalizedQuintals()} quintals</b> ({getNormalizedQuintals() * 100} kg)</span>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* 2. Location Section */}
          <LocationSelector
            location={location}
            onLocationChange={onLocationChange}
          />

          <hr className="border-slate-100" />

          {/* 3. Current Price Section */}
          <PriceInput
            value={currentPrice}
            onChange={onPriceChange}
          />
        </div>
      </div>

      {/* Bottom Analyze Button */}
      <div className="sticky bottom-4 pt-6 mt-6 bg-gradient-to-t from-[#FBFBFA] via-[#FBFBFA] to-transparent">
        <button
          type="button"
          disabled={!isQuantityValid || !isLocationValid || !isPriceValid || isAnalyzing}
          onClick={onAnalyze}
          className={`tap-target w-full py-4 rounded-2xl text-lg sm:text-xl font-black shadow-lg transition-all flex items-center justify-center gap-3 border-2 ${
            isQuantityValid && isLocationValid && isPriceValid && !isAnalyzing
              ? 'bg-emerald-800 text-white border-emerald-900 hover:bg-emerald-700 active:scale-98 shadow-emerald-900/25'
              : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-white" />
              <span>Analyzing Mandi Intelligence...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 text-amber-300" />
              <span>{t('analyze_button')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
