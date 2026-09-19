import { useState, useEffect, useCallback, useRef } from 'react';

const LANGUAGE_MAP = {
  te: 'te-IN',
  hi: 'hi-IN',
  en: 'en-IN'
};

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const activeUtteranceRef = useRef(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      activeUtteranceRef.current = null;
      setIsPlaying(false);
    }
  }, [isSupported]);

  const speak = useCallback((text, language = 'en') => {
    if (!isSupported) {
      setError('Text-to-speech is not supported in this browser.');
      return false;
    }

    if (!text || !text.trim()) {
      return false;
    }

    // Always cancel active audio first
    stop();
    setError(null);

    const targetLang = LANGUAGE_MAP[language] || 'en-IN';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.rate = 0.95; // Slightly measured for rural clarity
    utterance.pitch = 1.0;

    // Pick best matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang === targetLang || v.lang.startsWith(language));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      activeUtteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      // Ignore interruption from canceling previous speech
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.warn('Speech synthesis error:', event);
        setError(`Speech playback error: ${event.error}`);
      }
      setIsPlaying(false);
      activeUtteranceRef.current = null;
    };

    activeUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }, [isSupported, stop]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    isSupported,
    isPlaying,
    error,
    speak,
    stop
  };
};
