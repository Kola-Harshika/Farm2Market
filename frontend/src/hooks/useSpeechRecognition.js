import { useState, useRef, useEffect, useCallback } from 'react';

const LANGUAGE_MAP = {
  te: 'te-IN',
  hi: 'hi-IN',
  en: 'en-IN',
};

export const useSpeechRecognition = ({
  onResult,
  onError,
  language = 'en',
} = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const startingRef = useRef(false);
  const mountedRef = useRef(true);

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window ||
      'webkitSpeechRecognition' in window);

  const getLanguage = useCallback((lang) => {
    return LANGUAGE_MAP[lang] || 'en-IN';
  }, []);

  const stopListening = useCallback(() => {
    startingRef.current = false;

    const recognition = recognitionRef.current;

    if (recognition) {
      try {
        recognition.abort();
      } catch {
        // Recognition may already be stopped.
      }
    }

    recognitionRef.current = null;

    if (mountedRef.current) {
      setIsListening(false);
    }
  }, []);

  const startListening = useCallback(
    (overrideLang) => {
      if (!isSupported) {
        const message =
          'Voice input is not supported in this browser. Please use Google Chrome or Microsoft Edge.';

        setError(message);

        if (onError) {
          onError(message);
        }

        return false;
      }

      // Prevent double-click / multiple recognition sessions.
      if (startingRef.current || recognitionRef.current) {
        return false;
      }

      startingRef.current = true;

      setError(null);
      setTranscript('');

      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        const message =
          'Speech recognition is unavailable in this browser.';

        startingRef.current = false;
        setError(message);

        if (onError) {
          onError(message);
        }

        return false;
      }

      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      const selectedLanguage =
        overrideLang || language;

      recognition.lang = getLanguage(selectedLanguage);

      recognition.onstart = () => {
        startingRef.current = false;

        if (mountedRef.current) {
          setIsListening(true);
          setError(null);
        }
      };

      recognition.onresult = (event) => {
        let finalText = '';
        let interimText = '';

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          const result = event.results[i];

          if (!result || !result[0]) {
            continue;
          }

          const text = result[0].transcript;

          if (result.isFinal) {
            finalText += text;
          } else {
            interimText += text;
          }
        }

        const combinedText =
          finalText || interimText;

        if (mountedRef.current && combinedText) {
          setTranscript(combinedText);

          // Send final recognized speech to the application.
          if (finalText.trim() && onResult) {
            onResult(finalText.trim());
          }
        }
      };

      recognition.onnomatch = () => {
        if (!mountedRef.current) return;

        const message =
          'I could not understand that. Please speak again clearly.';

        setError(message);
        setIsListening(false);

        if (onError) {
          onError(message);
        }
      };

      recognition.onerror = (event) => {
        console.warn(
          'Speech recognition error:',
          event.error
        );

        startingRef.current = false;

        let message =
          'Something went wrong with voice input. Please try again.';

        switch (event.error) {
          case 'not-allowed':
          case 'service-not-allowed':
            message =
              'Microphone permission was denied. Please allow microphone access in your browser settings.';
            break;

          case 'audio-capture':
            message =
              'No microphone was detected. Please check your microphone.';
            break;

          case 'no-speech':
            message =
              'No speech detected. Please tap the microphone and speak.';
            break;

          case 'network':
            message =
              'Voice recognition needs an internet connection in this browser.';
            break;

          case 'aborted':
            // User intentionally stopped recognition.
            message = null;
            break;

          case 'language-not-supported':
            message =
              'This language is not available for speech recognition in your browser. Try English.';
            break;

          default:
            message =
              `Voice input error: ${event.error || 'unknown error'}.`;
        }

        if (mountedRef.current) {
          setIsListening(false);

          if (message) {
            setError(message);

            if (onError) {
              onError(message);
            }
          }
        }
      };

      recognition.onend = () => {
        startingRef.current = false;

        if (recognitionRef.current === recognition) {
          recognitionRef.current = null;
        }

        if (mountedRef.current) {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
        return true;
      } catch (error) {
        console.error(
          'Unable to start speech recognition:',
          error
        );

        startingRef.current = false;
        recognitionRef.current = null;

        const message =
          'Could not start the microphone. Please check microphone permission and try again.';

        if (mountedRef.current) {
          setIsListening(false);
          setError(message);
        }

        if (onError) {
          onError(message);
        }

        return false;
      }
    },
    [
      isSupported,
      language,
      getLanguage,
      onResult,
      onError,
    ]
  );

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      const recognition = recognitionRef.current;

      if (recognition) {
        try {
          recognition.abort();
        } catch {
          // Ignore cleanup errors.
        }
      }

      recognitionRef.current = null;
      startingRef.current = false;
    };
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
  };
};