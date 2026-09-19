import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const CropCard = ({ crop, isSelected, onSelect }) => {
  const { language } = useLanguage();

  // Get translated crop name
  const displayName = language === 'te' ? crop.name_te : language === 'hi' ? crop.name_hi : crop.name;

  return (
    <button
      type="button"
      onClick={() => onSelect(crop.key)}
      aria-pressed={isSelected}
      className={`tap-target flex flex-col items-center justify-center p-4 rounded-2xl border-3 transition-all transform active:scale-95 ${
        isSelected
          ? 'bg-emerald-100/80 border-emerald-700 shadow-lg scale-102 ring-4 ring-emerald-600/20'
          : 'bg-white border-emerald-900/15 hover:border-emerald-600 hover:shadow-md'
      }`}
    >
      <span className="text-5xl sm:text-6xl mb-2 select-none filter drop-shadow-sm" role="img" aria-label={displayName}>
        {crop.icon}
      </span>
      <span className="text-lg sm:text-xl font-extrabold text-emerald-950 text-center leading-tight">
        {displayName}
      </span>
      {language !== 'en' && (
        <span className="text-xs text-emerald-800/70 font-semibold mt-0.5">
          {crop.name}
        </span>
      )}
    </button>
  );
};
