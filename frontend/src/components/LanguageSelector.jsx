import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSelector = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' }
  ];

  if (compact) {
    return (
      <div className="flex items-center space-x-1 bg-white border border-emerald-800/20 rounded-full px-2 py-1 shadow-sm">
        <Globe className="w-4 h-4 text-emerald-800 shrink-0" aria-hidden="true" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label="Select Language"
          className="bg-transparent text-sm font-semibold text-emerald-950 focus:outline-none cursor-pointer"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.native}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Language selection">
      {languages.map((l) => {
        const isActive = language === l.code;
        return (
          <button
            key={l.code}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setLanguage(l.code)}
            className={`tap-target px-4 py-2 rounded-xl text-base font-bold transition-colors flex items-center gap-2 border-2 ${
              isActive
                ? 'bg-emerald-800 text-white border-emerald-900 shadow-md'
                : 'bg-white text-emerald-950 border-emerald-800/20 hover:border-emerald-700'
            }`}
          >
            <span className="text-sm opacity-80">{l.code.toUpperCase()}</span>
            <span className="text-lg">{l.native}</span>
          </button>
        );
      })}
    </div>
  );
};
