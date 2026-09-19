import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { api } from '../services/api';
import { Mic, Volume2, X, Send } from 'lucide-react';

export const VoiceAssistantModal = ({
  isOpen,
  onClose,
  onSelectCrop,
  onOpenMap,
  onNavigate
}) => {
  const { language, setLanguage } = useLanguage();

  const [typedQuery, setTypedQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [conversation, setConversation] = useState([
    {
      sender: 'assistant',
      text:
        language === 'te'
          ? 'నమస్కారం! నేను మీ ఫార్మ్2మార్కెట్ వాయిస్ అసిస్టెంట్‌ని. పంట పేరు లేదా మార్కెట్ ధర అడగండి.'
          : language === 'hi'
            ? 'नमस्ते! मैं आपका फार्म2मार्केट वॉइस असिस्टेंट हूँ। किसी भी फसल का नाम या मंडी भाव पूछें।'
            : 'Hello! I am your Farm2Market voice assistant. Ask about any crop price or nearby mandis.'
    }
  ]);

  const { isPlaying, speak, stop } = useAudioPlayer();

  const handleProcessQuery = async (queryText) => {
    if (!queryText || !queryText.trim()) return;

    const cleanQ = queryText.trim();

    setConversation((prev) => [
      ...prev,
      { sender: 'user', text: cleanQ }
    ]);

    setIsProcessing(true);

    try {
      const response = await api.queryVoiceIntent(cleanQ, language);

      let spokenReply = '';
      let displayReply = '';

      if (response && response.spoken_response) {
        spokenReply = response.spoken_response;
        displayReply =
          response.display_response || response.spoken_response;

        // Execute actions returned by backend
        if (
          response.suggested_action === 'SELECT_CROP' &&
          response.action_data?.crop
        ) {
          if (onSelectCrop) {
            onSelectCrop(response.action_data.crop);
          }
        } else if (response.suggested_action === 'OPEN_MAP') {
          if (onOpenMap) {
            onOpenMap();
          }
        } else if (response.suggested_action === 'SHOW_COMPARISON') {
          if (onNavigate) {
            onNavigate('analysis');
          }
        }
      } else {
        // Local fallback
        const lower = cleanQ.toLowerCase();

        if (
          lower.includes('onion') ||
          lower.includes('ulli') ||
          lower.includes('pyaz') ||
          lower.includes('ఉల్లి') ||
          lower.includes('प्याज')
        ) {
          spokenReply =
            language === 'te'
              ? 'ఉల్లిగడ్డ సగటు మార్కెట్ ధర క్వింటాలుకు ₹2,250 గా ఉంది.'
              : language === 'hi'
                ? 'प्याज का औसत मंडी भाव ₹2,250 प्रति क्विंटल है।'
                : 'Recent market baseline for Onion is ₹2,250 per quintal.';

          if (onSelectCrop) {
            onSelectCrop('onion');
          }
        } else if (
          lower.includes('wheat') ||
          lower.includes('godhuma') ||
          lower.includes('gehu') ||
          lower.includes('గోధుమ') ||
          lower.includes('गेहूं')
        ) {
          spokenReply =
            language === 'te'
              ? 'గోధుమ సగటు మార్కెట్ ధర క్వింటాలుకు ₹2,275 గా ఉంది.'
              : language === 'hi'
                ? 'गेहूं का औसत भाव ₹2,275 प्रति क्विंटल है।'
                : 'Recent market baseline for Wheat is ₹2,275 per quintal.';

          if (onSelectCrop) {
            onSelectCrop('wheat');
          }
        } else if (
          lower.includes('map') ||
          lower.includes('mandi') ||
          lower.includes('market') ||
          lower.includes('నక్షా') ||
          lower.includes('దారి')
        ) {
          spokenReply =
            language === 'te'
              ? 'సమీపంలోని మండీల మ్యాప్‌ను తెరుస్తున్నాను.'
              : language === 'hi'
                ? 'मैं पास की मंडियों का नक्शा खोल रहा हूँ।'
                : 'Opening nearby mandis map.';

          if (onOpenMap) {
            onOpenMap();
          }
        } else if (
          lower.includes('compare') ||
          lower.includes('comparison') ||
          lower.includes('తులన') ||
          lower.includes('तुलना')
        ) {
          spokenReply =
            language === 'te'
              ? 'మండీల ధరలను పోల్చడానికి విశ్లేషణను తెరుస్తున్నాను.'
              : language === 'hi'
                ? 'मैं मंडियों की कीमतों की तुलना खोल रहा हूँ।'
                : 'Opening mandi price comparison.';

          if (onNavigate) {
            onNavigate('analysis');
          }
        } else {
          spokenReply =
            language === 'te'
              ? 'మీరు అడిగిన సమాచారాన్ని విశ్లేషిస్తున్నాను. పంట పేరు చెప్పండి.'
              : language === 'hi'
                ? 'मैं आपकी फसल का भाव चेक कर रहा हूँ। कृपया फसल का नाम बोलें।'
                : 'I can help analyze mandi prices. Tell me your crop name or offered price.';
        }

        displayReply = spokenReply;
      }

      setConversation((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: displayReply
        }
      ]);

      // Read response aloud
      if (spokenReply) {
        speak(spokenReply, language);
      }
    } catch (err) {
      console.warn('Voice query processing error:', err);

      const fallbackReply =
        language === 'te'
          ? 'క్షమించండి. మళ్లీ ప్రయత్నించండి లేదా పంట పేరు టైప్ చేయండి.'
          : language === 'hi'
            ? 'क्षमा करें। फिर से प्रयास करें या फसल का नाम टाइप करें।'
            : 'Sorry, I could not process that. Please try again or type your crop name.';

      setConversation((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: fallbackReply
        }
      ]);

      speak(fallbackReply, language);
    } finally {
      setIsProcessing(false);
      setTypedQuery('');
    }
  };

  const {
    isListening,
    startListening,
    stopListening,
    error: speechError
  } = useSpeechRecognition({
    language,
    onResult: (text) => {
      handleProcessQuery(text);
    }
  });

  if (!isOpen) return null;

  const quickChips = [
    {
      label: '🧅 Onion Price',
      query: 'What is today onion price?'
    },
    {
      label: '🌾 Wheat Price',
      query: 'What is wheat price?'
    },
    {
      label: '🏪 Compare Mandis',
      query: 'Compare nearby mandis'
    },
    {
      label: '🗺️ Show Map',
      query: 'Show mandis on map'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B342D]/45 backdrop-blur-sm animate-fade-in">

      <div className="bg-[#F4EFE7] rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#D7CFC3] flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D7CFC3]">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-[#B56B45] text-[#F8F3EA] flex items-center justify-center shadow-md">
              <Mic className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-lg font-black text-[#292622]">
                Farm2Market Voice Assistant
              </h3>

              <p className="text-xs font-semibold text-[#766B60]">
                Speak in Telugu, Hindi or English
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => {
              stop();
              stopListening();
              onClose();
            }}
            className="p-2 text-[#81776C] hover:text-[#292622] rounded-full hover:bg-[#E8E0D5] transition-colors"
            aria-label="Close voice assistant"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* Language Switch */}
        <div className="flex items-center justify-between py-3 text-xs font-bold border-b border-[#D7CFC3]">

          <span className="text-[#766B60]">
            Language
          </span>

          <div className="flex gap-1.5">

            {['en', 'te', 'hi'].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLanguage(l)}
                className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                  language === l
                    ? 'bg-[#B56B45] text-[#F8F3EA] font-extrabold'
                    : 'bg-[#E8E0D5] text-[#514A43] hover:bg-[#DDD3C6]'
                }`}
              >
                {l === 'te'
                  ? 'తెలుగు'
                  : l === 'hi'
                    ? 'हिन्दी'
                    : 'English'}
              </button>
            ))}

          </div>
        </div>

        {/* Conversation */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 min-h-[160px] max-h-[260px] text-sm">

          {conversation.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[85%] font-semibold leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#6F6256] text-[#F8F3EA] rounded-br-none'
                    : 'bg-[#E8E0D5] text-[#332E29] border border-[#D7CFC3] rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="p-3 bg-[#E8E0D5] rounded-2xl text-[#766B60] text-xs font-bold animate-pulse border border-[#D7CFC3]">
                Understanding your request...
              </div>
            </div>
          )}

        </div>

        {/* Speech Error */}
        {speechError && (
          <div className="mb-2 px-3 py-2 rounded-xl bg-[#EFE0D6] border border-[#D9B8A4] text-[#7A4932] text-xs font-semibold">
            {speechError}
          </div>
        )}

        {/* Quick Commands */}
        <div className="py-3 flex flex-wrap gap-1.5 border-top border-[#D7CFC3]">

          {quickChips.map((chip, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleProcessQuery(chip.query)}
              className="text-xs px-2.5 py-1.5 rounded-full bg-[#E8E0D5] text-[#514A43] hover:bg-[#DDD3C6] font-bold transition-colors border border-[#D7CFC3]"
            >
              {chip.label}
            </button>
          ))}

        </div>

        {/* Audio Status */}
        {isPlaying && (
          <div className="flex items-center justify-between p-2.5 bg-[#E8E0D5] rounded-xl text-xs font-bold text-[#514A43] my-1 border border-[#D7CFC3]">

            <span className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-[#B56B45] animate-bounce" />
              <span>Speaking response aloud...</span>
            </span>

            <button
              type="button"
              onClick={stop}
              className="px-2.5 py-1 bg-[#8C5A4A] text-[#F8F3EA] rounded-md text-[11px] font-black hover:bg-[#754A3D]"
            >
              Stop
            </button>

          </div>
        )}

        {/* Microphone */}
        <div className="pt-4 flex flex-col items-center gap-2 border-t border-[#D7CFC3]">

          <button
            type="button"
            onClick={() => {
              if (isListening) {
                stopListening();
              } else {
                startListening();
              }
            }}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isListening
                ? 'bg-[#8C5A4A] text-[#F8F3EA] ring-8 ring-[#E8D4C9] animate-pulse scale-105'
                : 'bg-[#B56B45] text-[#F8F3EA] hover:bg-[#A7603E] active:scale-95'
            }`}
            title={
              isListening
                ? 'Stop listening'
                : 'Tap and speak'
            }
            aria-label={
              isListening
                ? 'Stop listening'
                : 'Start voice input'
            }
          >
            <Mic
              className={`w-8 h-8 ${
                isListening ? 'animate-bounce' : ''
              }`}
            />
          </button>

          <span className="text-xs font-bold text-[#766B60]">
            {isListening
              ? 'Listening... Speak now!'
              : 'Tap microphone and speak'}
          </span>

        </div>

        {/* Text Fallback */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProcessQuery(typedQuery);
          }}
          className="mt-3 flex gap-2"
        >

          <input
            type="text"
            value={typedQuery}
            onChange={(e) => setTypedQuery(e.target.value)}
            placeholder="Or type your request here..."
            className="flex-1 px-3.5 py-2.5 bg-[#E8E0D5] border border-[#D0C6B9] rounded-xl text-xs sm:text-sm font-semibold text-[#332E29] placeholder:text-[#958A7D] focus:outline-none focus:border-[#B56B45]"
          />

          <button
            type="submit"
            disabled={!typedQuery.trim()}
            className="px-4 py-2.5 bg-[#B56B45] text-[#F8F3EA] rounded-xl text-xs sm:text-sm font-bold hover:bg-[#A7603E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};