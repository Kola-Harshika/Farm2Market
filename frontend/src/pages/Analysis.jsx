import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AnalysisCard } from '../components/AnalysisCard';
import { MandiComparison } from '../components/MandiComparison';
import { TransportCard } from '../components/TransportCard';
import { HistoricalChart } from '../components/HistoricalChart';
import { MapView } from '../components/MapView';
import { AIExplanation } from '../components/AIExplanation';
import { AlertSettings } from '../components/AlertSettings';
import { LowBandwidthToggle } from '../components/LowBandwidthToggle';
import {
  Map as MapIcon,
  Bell,
  RotateCcw,
  ShieldAlert
} from 'lucide-react';

export const Analysis = ({
  analysisData,
  farmerLocation,
  onReset,
  isLowBandwidth,
  onToggleLowBandwidth
}) => {
  const { t } = useLanguage();
  const [isAdvancedView, setIsAdvancedView] = useState(false);
  const [showMap, setShowMap] = useState(!isLowBandwidth); // Auto-hide map in low bandwidth mode
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  if (!analysisData) return null;

  const {
    crop,
    crop_name,
    quantity_quintals,
    current_price_per_quintal,
    historical_analysis,
    comparison_markets,
    best_option,
    explanation,
    explanation_audio_text,
    disclaimer,
    data_last_updated,
    total_historical_records
  } = analysisData;

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pb-20">
      {/* Top Navigation Bar */}
      <header className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-900/10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="tap-target inline-flex items-center gap-2 text-sm font-bold text-emerald-900 hover:text-emerald-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
        </div>

        {/* Controls: Simple/Advanced View Toggle & Low Data Mode */}
        <div className="flex items-center gap-2">
          {/* Simple vs Advanced Toggle */}
          <div className="bg-white border border-emerald-900/20 rounded-full p-1 flex items-center text-xs font-black shadow-sm">
            <button
              type="button"
              onClick={() => setIsAdvancedView(false)}
              className={`tap-target px-3 py-1.5 rounded-full transition-colors ${
                !isAdvancedView
                  ? 'bg-emerald-800 text-white'
                  : 'text-emerald-900 hover:bg-slate-100'
              }`}
            >
              {t('simple_view')}
            </button>
            <button
              type="button"
              onClick={() => setIsAdvancedView(true)}
              className={`tap-target px-3 py-1.5 rounded-full transition-colors ${
                isAdvancedView
                  ? 'bg-emerald-800 text-white'
                  : 'text-emerald-900 hover:bg-slate-100'
              }`}
            >
              {t('advanced_view')}
            </button>
          </div>

          <LowBandwidthToggle
            isLowBandwidth={isLowBandwidth}
            onToggle={onToggleLowBandwidth}
          />
        </div>
      </header>

      {/* Main Core Analysis Card */}
      <AnalysisCard
        analysisData={analysisData}
        isSimpleView={!isAdvancedView}
        onOpenMap={() => setShowMap(true)}
        onOpenAlertModal={() => setIsAlertModalOpen(true)}
      />

      {/* AI Decision Support & Audio Read-Aloud */}
      <AIExplanation
        explanation={explanation}
        audioText={explanation_audio_text}
        dataLastUpdated={data_last_updated}
        totalRecords={total_historical_records}
        disclaimer={disclaimer}
      />

      {/* Nearby Mandi Intelligence & Comparison Table */}
      <MandiComparison
        markets={comparison_markets}
        bestOption={best_option}
        currentPrice={current_price_per_quintal}
        quantityQuintals={quantity_quintals}
      />

      {/* Advanced Details: Freight Breakdown & 30-Day Historical Trend */}
      {isAdvancedView && (
        <div className="space-y-6 animate-fade-in">
          {/* Transportation Freight Calculation Model */}
          <TransportCard
            quantityQuintals={quantity_quintals}
            bestMandi={best_option}
          />

          {/* Recharts Price History Visualizer */}
          <HistoricalChart
            chartData={historical_analysis?.historical_chart_data}
            currentPrice={current_price_per_quintal}
            baseline={historical_analysis?.historical_baseline}
            cropName={crop_name}
          />
        </div>
      )}

      {/* Interactive Map Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="tap-target inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border-2 border-emerald-900/20 text-emerald-950 font-bold text-sm hover:border-emerald-700 shadow-sm"
          >
            <MapIcon className="w-5 h-5 text-emerald-700" />
            <span>{showMap ? t('map_button_hide') : t('map_button_show')}</span>
          </button>

          {/* Set Price Alert Button */}
          <button
            type="button"
            onClick={() => setIsAlertModalOpen(true)}
            className="tap-target inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-100 text-amber-950 border border-amber-300 font-bold text-sm hover:bg-amber-200 shadow-sm"
          >
            <Bell className="w-4 h-4 text-amber-800" />
            <span>{t('alert_button')}</span>
          </button>
        </div>

        {showMap && (
          <div className="animate-fade-in">
            <MapView
              farmerLocation={farmerLocation}
              markets={comparison_markets}
              bestOption={best_option}
            />
          </div>
        )}
      </div>

      {/* Bottom Responsible Decision-Support Disclaimer Banner */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
        <div className="flex items-center gap-2 font-black text-slate-900">
          <ShieldAlert className="w-4 h-4 text-emerald-800" />
          <span>Responsible Agricultural Decision Support Notice</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          {t('disclaimer_text')}
        </p>
      </div>

      {/* Price Alert Configuration Modal */}
      <AlertSettings
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        cropKey={crop}
        cropName={crop_name}
        defaultPrice={historical_analysis?.historical_baseline || 2000}
        mandiId={best_option?.mandi_id}
        mandiName={best_option?.mandi_name || 'Regional Mandis'}
      />
    </div>
  );
};
