import React from 'react';
import { Volume2, Square } from 'lucide-react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useLanguage } from '../context/LanguageContext';

export const AudioButton = ({ text, className = '' }) => {
  const { language, t } = useLanguage();
  const { isPlaying, speak, stop } = useAudioPlayer();

  const handleToggle = () => {
    if (isPlaying) {
      stop();
    } else {
      speak(text, language);
    }
  };

  if (!text) return null;

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isPlaying ? t('stop_button') : t('listen_button')}
      className={`tap-target inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all border shadow-sm ${
        isPlaying
          ? 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse'
          : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <Square className="w-5 h-5 text-rose-700 fill-rose-700" />
          <span>{t('stop_button') || 'Stop'}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5 text-emerald-800" />
          <span>{t('listen_button') || 'Listen'}</span>
        </>
      )}
    </button>
  );
};
