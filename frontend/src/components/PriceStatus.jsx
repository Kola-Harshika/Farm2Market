import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const PriceStatus = ({ classification, deviationPercent }) => {
  const { t } = useLanguage();

  const getStatusConfig = () => {
    switch (classification) {
      case 'LOW':
        return {
          icon: '🔴',
          title: t('status_low'),
          bg: 'bg-rose-100 border-rose-400 text-rose-950',
          badgeBg: 'bg-rose-600 text-white',
          desc: 'Your current offer is significantly lower than comparable historical prices.'
        };
      case 'HIGH':
        return {
          icon: '🟢',
          title: t('status_high'),
          bg: 'bg-emerald-100 border-emerald-400 text-emerald-950',
          badgeBg: 'bg-emerald-700 text-white',
          desc: 'Your current offer is above the historical comparable baseline.'
        };
      case 'MODERATE':
      default:
        return {
          icon: '🟡',
          title: t('status_moderate'),
          bg: 'bg-amber-100 border-amber-400 text-amber-950',
          badgeBg: 'bg-amber-600 text-white',
          desc: 'Your current offer is within the normal historical trading range.'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border-2 flex items-center justify-between shadow-sm ${config.bg}`}>
      <div className="flex items-center gap-3.5">
        <span className="text-3xl sm:text-4xl select-none" role="img" aria-label={classification}>
          {config.icon}
        </span>
        <div>
          <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wider opacity-80">
            {t('price_status')}
          </div>
          <div className="text-xl sm:text-2xl font-black leading-tight">
            {config.title}
          </div>
          <p className="text-xs sm:text-sm font-semibold opacity-90 mt-0.5">
            {config.desc}
          </p>
        </div>
      </div>

      {deviationPercent !== null && deviationPercent !== undefined && (
        <div className={`px-3 py-1.5 rounded-xl font-black text-sm sm:text-base shrink-0 ${config.badgeBg}`}>
          {deviationPercent > 0 ? `+${deviationPercent}%` : `${deviationPercent}%`}
        </div>
      )}
    </div>
  );
};
