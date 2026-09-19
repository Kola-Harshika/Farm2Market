import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { LowBandwidthToggle } from '../components/LowBandwidthToggle';
import { ArrowRight, Play, Sprout, ShieldCheck, TrendingUp, Truck } from 'lucide-react';

export const Landing = ({
  onGetStarted,
  onTryDemo,
  isLowBandwidth,
  onToggleLowBandwidth
}) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Top Header with Language & Low-Bandwidth Switch */}
      <header className="flex items-center justify-between py-2 border-b border-emerald-900/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-black text-sm">
            🌾
          </div>
          <span className="font-black tracking-wider text-emerald-950 text-sm sm:text-base">
            FARM2MARKET
          </span>
        </div>

        <div className="flex items-center gap-2">
          <LowBandwidthToggle
            isLowBandwidth={isLowBandwidth}
            onToggle={onToggleLowBandwidth}
          />
          <LanguageSelector compact={true} />
        </div>
      </header>

      {/* Hero Section */}
      <main className="my-auto py-10 sm:py-16 text-center space-y-8">
        {/* Subtle Tag / Problem Statement Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-black uppercase tracking-wider">
          <Sprout className="w-4 h-4 text-emerald-700" />
          <span>TechSurge • PS-A02 — Selling Blind</span>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-emerald-950 tracking-tight leading-none">
            {t('app_name')}
          </h1>
          <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-800 tracking-tight">
            “{t('tagline')}”
          </p>
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-emerald-900/80 font-semibold max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
          {/* GET STARTED */}
          <button
            type="button"
            onClick={onGetStarted}
            className="tap-target w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-800 text-white text-lg sm:text-xl font-black shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-emerald-900"
          >
            <span>{t('get_started')}</span>
            <ArrowRight className="w-6 h-6" />
          </button>

          {/* TRY DEMO (HACKATHON) */}
          <button
            type="button"
            onClick={onTryDemo}
            className="tap-target w-full sm:w-auto px-6 py-4 rounded-2xl bg-amber-50 text-amber-950 text-base sm:text-lg font-black border-2 border-amber-400 hover:bg-amber-100 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Play className="w-5 h-5 text-amber-700 fill-amber-700" />
            <span>{t('try_demo')}</span>
          </button>
        </div>

        {/* 3 Core Value Props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-8 text-left">
          <div className="p-4 bg-white rounded-2xl border border-emerald-900/10 shadow-sm flex items-start gap-3">
            <TrendingUp className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-sm text-emerald-950">Historical Baseline</div>
              <div className="text-xs text-emerald-900/70">Know if today's price is low, normal or high before selling.</div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-900/10 shadow-sm flex items-start gap-3">
            <Truck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-sm text-emerald-950">Transport Freight</div>
              <div className="text-xs text-emerald-900/70">Calculates road travel cost so you know your actual net earnings.</div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-900/10 shadow-sm flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-sm text-emerald-950">Voice & Regional</div>
              <div className="text-xs text-emerald-900/70">Telugu, Hindi & English voice assistant for low-literacy farmers.</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-emerald-900/60 font-semibold border-t border-emerald-900/10 space-y-1">
        <p>Built for Indian Farmers • Real AgMarkNet & eNAM Mandi Data Architecture</p>
        <p className="text-[11px] opacity-75">{t('disclaimer_text')}</p>
      </footer>
    </div>
  );
};
