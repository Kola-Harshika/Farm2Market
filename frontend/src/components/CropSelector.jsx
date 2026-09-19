import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CropCard } from './CropCard';
import { VoiceButton } from './VoiceButton';
import { voiceService } from '../services/voiceService';
import { Search, Plus, CheckCircle2, Sparkles } from 'lucide-react';

export const CropSelector = ({ crops, selectedCrop, onSelectCrop }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [voiceNotice, setVoiceNotice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customCropInput, setCustomCropInput] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const categories = ['All', 'Vegetable', 'Cereal', 'Oilseed', 'Pulses', 'Spices', 'Fruit', 'Commercial'];

  const handleVoiceMatch = (spokenText) => {
    // 1. Try local voice matcher
    const matchedKey = voiceService.matchCropLocally(spokenText);
    if (matchedKey) {
      onSelectCrop(matchedKey);
      setVoiceNotice(`"${spokenText}" ➔ Selected`);
      setTimeout(() => setVoiceNotice(''), 3000);
      return;
    }

    // 2. Try direct match against crop name fields
    const lower = spokenText.toLowerCase().trim();
    const found = crops.find(c =>
      c.key.toLowerCase().includes(lower) ||
      c.name.toLowerCase().includes(lower) ||
      (c.name_te && c.name_te.includes(lower)) ||
      (c.name_hi && c.name_hi.includes(lower))
    );
    if (found) {
      onSelectCrop(found.key);
      setVoiceNotice(`"${spokenText}" ➔ Selected`);
      setTimeout(() => setVoiceNotice(''), 3000);
    } else {
      // Allow speaking ANY custom crop directly!
      const customKey = lower.replace(/\s+/g, '_');
      onSelectCrop(customKey);
      setVoiceNotice(`Spoken Crop "${spokenText}" ➔ Selected`);
      setTimeout(() => setVoiceNotice(''), 3000);
    }
  };

  const handleAddCustomCrop = (e) => {
    e.preventDefault();
    if (!customCropInput.trim()) return;
    const clean = customCropInput.trim();
    onSelectCrop(clean.toLowerCase().replace(/\s+/g, '_'));
    setShowCustomModal(false);
    setVoiceNotice(`"${clean}" ➔ Selected`);
    setTimeout(() => setVoiceNotice(''), 3500);
  };

  // Filter crops
  const filteredCrops = crops.filter(c => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      (c.name_te && c.name_te.toLowerCase().includes(term)) ||
      (c.name_hi && c.name_hi.toLowerCase().includes(term)) ||
      c.key.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-5">
      {/* Search, Custom Crop & Voice Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-800/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop or type any crop name..."
            aria-label="Search crop name"
            className="w-full pl-11 pr-4 py-3 bg-white border-2 border-emerald-900/20 rounded-2xl text-base font-semibold text-emerald-950 placeholder-emerald-900/40 focus:border-emerald-600 focus:outline-none shadow-xs"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          className="tap-target px-4 py-3 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-5 h-5 text-amber-800" />
          <span>Type Any Crop</span>
        </button>

        <VoiceButton
          onVoiceResult={handleVoiceMatch}
          label={t('speak_crop')}
        />
      </div>

      {voiceNotice && (
        <div className="flex items-center justify-center gap-2 p-2 bg-emerald-100 text-emerald-950 rounded-xl text-sm font-bold animate-fade-in text-center border border-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{voiceNotice}</span>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`tap-target px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-emerald-950 border border-emerald-900/15 hover:bg-emerald-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pictorial Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {filteredCrops.map((crop) => (
          <CropCard
            key={crop.key}
            crop={crop}
            isSelected={selectedCrop === crop.key}
            onSelect={onSelectCrop}
          />
        ))}

        {/* Custom Crop Card button */}
        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          className="tap-target flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-emerald-600/40 bg-emerald-50/50 hover:bg-emerald-100/50 transition-all text-center"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2 text-emerald-800">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-base font-extrabold text-emerald-950">
            Other Crop
          </span>
          <span className="text-xs text-emerald-800/70 font-semibold mt-0.5">
            Type any custom name
          </span>
        </button>
      </div>

      {/* Custom Crop Entry Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-emerald-900/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-emerald-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <span>Calculate Any Crop Price</span>
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-semibold">
              Enter any agricultural produce name (e.g. Ginger, Garlic, Mustard, Turmeric, Coffee, Mango, Cardamom, etc.):
            </p>
            <form onSubmit={handleAddCustomCrop} className="space-y-4">
              <input
                type="text"
                required
                autoFocus
                value={customCropInput}
                onChange={(e) => setCustomCropInput(e.target.value)}
                placeholder="Crop name (e.g., Ginger / అల్లం / अदरक)"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-emerald-800/20 rounded-2xl text-base font-bold text-emerald-950 focus:border-emerald-600 focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-700 text-white rounded-xl font-black text-sm hover:bg-emerald-600 shadow-md"
                >
                  Select Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
