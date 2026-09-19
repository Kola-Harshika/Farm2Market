import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Wifi, WifiOff } from 'lucide-react';

export const LowBandwidthToggle = ({ isLowBandwidth, onToggle }) => {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => onToggle(!isLowBandwidth)}
      aria-pressed={isLowBandwidth}
      className={`tap-target flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-all ${
        isLowBandwidth
          ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-sm'
          : 'bg-white/80 text-emerald-900 border-emerald-800/20 hover:bg-emerald-50'
      }`}
      title="Toggle low data mode for slow internet connections"
    >
      {isLowBandwidth ? (
        <>
          <WifiOff className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
          <span>{t('low_bandwidth_toggle')}: <b>ON</b></span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
          <span>{t('low_bandwidth_toggle')}</span>
        </>
      )}
    </button>
  );
};
