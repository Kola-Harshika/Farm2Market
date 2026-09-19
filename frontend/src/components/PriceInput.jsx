import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { VoiceButton } from './VoiceButton';

export const PriceInput = ({ value, onChange, onVoiceCapture }) => {
  const { t } = useLanguage();

  const handleVoicePrice = (spokenText) => {
    // Extract first numeric match from voice
    const digits = spokenText.match(/\d+/g);
    if (digits && digits.length > 0) {
      const parsedPrice = parseFloat(digits.join(''));
      if (parsedPrice > 0 && parsedPrice < 200000) {
        onChange(parsedPrice);
        if (onVoiceCapture) onVoiceCapture(parsedPrice);
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-lg sm:text-xl font-bold text-emerald-950">
        {t('step_price')}
      </label>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-emerald-800">
            ₹
          </div>
          <input
            type="number"
            min="1"
            max="100000"
            step="10"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            placeholder="1800"
            aria-label={t('step_price')}
            className="w-full pl-12 pr-24 py-3.5 bg-white border-2 border-emerald-900/25 rounded-2xl text-2xl sm:text-3xl font-black text-emerald-950 placeholder-emerald-900/30 focus:border-emerald-700 focus:outline-none shadow-sm"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
            / quintal
          </div>
        </div>

        <VoiceButton
          onVoiceResult={handleVoicePrice}
          label="Voice Price"
          compact={false}
        />
      </div>

      <p className="text-xs sm:text-sm text-emerald-800/80 font-medium">
        💡 {t('price_helper')}
      </p>
    </div>
  );
};
