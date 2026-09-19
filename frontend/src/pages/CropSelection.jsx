import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CropSelector } from '../components/CropSelector';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const CropSelection = ({
  crops = [],
  selectedCrop,
  onSelectCrop,
  onNext,
  onBack
}) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 py-5 flex flex-col">

      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-300">
        <button
          type="button"
          onClick={onBack}
          className="
            tap-target inline-flex items-center gap-2
            text-sm font-bold text-stone-700
            hover:text-stone-950 transition-colors
          "
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back_button')}</span>
        </button>

        <div
          className="
            text-xs font-bold uppercase tracking-wide
            text-stone-600 bg-stone-200
            px-3 py-1.5 rounded-full
          "
        >
          Step 1 of 3
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-7 pt-7">

        {/* Heading */}
        <div className="text-center space-y-2">
          <div className="text-4xl mb-2">🌾</div>

          <h2 className="text-2xl sm:text-4xl font-black text-stone-900">
            {t('step_crop')}
          </h2>

          <p className="text-sm sm:text-base text-stone-600 font-medium max-w-xl mx-auto">
            Select your crop using a picture, type its name, or speak it.
          </p>
        </div>

        {/* Crop Selector */}
        <div
          className="
            bg-[#F4EFE7]
            border border-stone-300
            rounded-3xl
            p-4 sm:p-6
            shadow-sm
          "
        >
          <CropSelector
            crops={crops}
            selectedCrop={selectedCrop}
            onSelectCrop={(key) => {
              onSelectCrop(key);
            }}
          />
        </div>

        {/* Selected Crop Indicator */}
        {selectedCrop && (
          <div
            className="
              flex items-center justify-center
              gap-2
              text-sm font-bold
              text-stone-700
            "
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#B56B45]" />
            Crop selected
          </div>
        )}
      </div>

      {/* Bottom Proceed Button */}
      <div className="pt-7 mt-auto">
        <button
          type="button"
          disabled={!selectedCrop}
          onClick={onNext}
          className={`
            tap-target
            w-full
            py-4
            rounded-2xl
            text-lg sm:text-xl
            font-black
            transition-all
            flex items-center justify-center gap-3
            border
            ${
              selectedCrop
                ? `
                  bg-[#B56B45]
                  text-white
                  border-[#9D5937]
                  hover:bg-[#A7603E]
                  active:scale-[0.98]
                  shadow-md
                `
                : `
                  bg-stone-200
                  text-stone-400
                  border-stone-300
                  cursor-not-allowed
                `
            }
          `}
        >
          <span>{t('next_button')}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
};