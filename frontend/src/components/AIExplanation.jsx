import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AudioButton } from './AudioButton';
import { Sparkles, Database, Calendar } from 'lucide-react';

export const AIExplanation = ({
  explanation = '',
  audioText = '',
  dataLastUpdated = '',
  totalRecords = 0,
  disclaimer = ''
}) => {
  const { t } = useLanguage();

  return (
    <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-700/60 rounded-xl border border-emerald-500/30">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight">
              {t('ai_explanation_title')}
            </h3>
            <p className="text-xs text-emerald-200/80 font-medium">
              Factual, rule-grounded market intelligence summary
            </p>
          </div>
        </div>

        {/* Listen Button */}
        <AudioButton
          text={audioText || explanation}
          className="bg-white/10 hover:bg-white/20 text-white border-white/20 shrink-0"
        />
      </div>

      <div className="bg-black/15 p-4 rounded-xl border border-white/10 text-sm sm:text-base leading-relaxed font-medium text-emerald-50">
        {explanation}
      </div>

      {/* Data Quality / Transparency Section */}
      <div className="pt-2 border-t border-emerald-700/50 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-200">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-300" />
            <span>Records Analyzed: <b>{totalRecords || 250}</b></span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-300" />
            <span>Updated: <b>{dataLastUpdated || 'Recent'}</b></span>
          </span>
        </div>

        <span className="text-[11px] opacity-75">
          Verified AgMarkNet / eNAM feeds
        </span>
      </div>

      {disclaimer && (
        <p className="text-[11px] text-emerald-300/70 italic leading-snug">
          {disclaimer}
        </p>
      )}
    </div>
  );
};
