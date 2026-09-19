import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useLanguage } from '../context/LanguageContext';

export const VoiceButton = ({
  onVoiceResult,
  label = null,
  compact = false,
  className = ''
}) => {
  const { language, t } = useLanguage();
  const [errorMessage, setErrorMessage] = useState('');

  const {
    isSupported,
    isListening,
    startListening,
    stopListening
  } = useSpeechRecognition({
    language,
    onResult: (text) => {
      setErrorMessage('');
      if (onVoiceResult) onVoiceResult(text);
    },
    onError: (err) => {
      setErrorMessage(typeof err === 'string' ? err : t('voice_fallback_notice'));
      setTimeout(() => setErrorMessage(''), 5000);
    }
  });

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      setErrorMessage('');
      const started = startListening();
      if (!started && !isSupported) {
        setErrorMessage(t('voice_fallback_notice'));
      }
    }
  };

  const getStatusText = () => {
    if (isListening) return t('listening') || 'Listening... Speak now';
    if (label) return label;
    return t('speak_crop') || 'Speak Crop Name';
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={getStatusText()}
        className={`tap-target flex items-center justify-center gap-2 rounded-2xl font-bold transition-all shadow-md focus:ring-4 focus:ring-emerald-400 ${
          isListening
            ? 'bg-rose-600 text-white animate-pulse scale-105 shadow-rose-300 ring-4 ring-rose-300'
            : 'bg-emerald-700 text-white hover:bg-emerald-600 active:scale-95'
        } ${compact ? 'px-3 py-2 text-sm' : 'px-5 py-3 text-base w-full sm:w-auto'} ${className}`}
      >
        {isListening ? (
          <>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <Mic className="w-5 h-5 animate-bounce" />
            <span>{getStatusText()}</span>
          </>
        ) : (
          <>
            <Mic className="w-5 h-5 text-emerald-200" />
            <span>{getStatusText()}</span>
          </>
        )}
      </button>

      {errorMessage && (
        <div className="mt-2 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-lg p-2 max-w-sm text-center animate-fade-in">
          <MicOff className="w-4 h-4 inline-block mr-1 text-rose-600" />
          {errorMessage}
        </div>
      )}
    </div>
  );
};
