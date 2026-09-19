import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { locationService, PRESET_HUBS } from '../services/locationService';
import { MapPin, Navigation, Check, Loader2 } from 'lucide-react';

export const LocationSelector = ({ location, onLocationChange }) => {
  const { language, t } = useLanguage();
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);

  const handleUseGps = async () => {
    setDetectingGps(true);
    try {
      const loc = await locationService.getCurrentLocation();
      onLocationChange({
        latitude: loc.latitude,
        longitude: loc.longitude,
        name: loc.source === 'GPS' ? 'Current GPS Location' : (loc.label || 'Hyderabad Hub'),
        isGps: loc.source === 'GPS'
      });
      setGpsSuccess(true);
      setTimeout(() => setGpsSuccess(false), 3000);
    } catch (e) {
      console.warn('GPS error:', e);
    } finally {
      setDetectingGps(false);
    }
  };

  const handleSelectHub = (hub) => {
    const displayName = language === 'te' ? hub.name_te : language === 'hi' ? hub.name_hi : hub.name;
    onLocationChange({
      latitude: hub.latitude,
      longitude: hub.longitude,
      name: displayName,
      isGps: false,
      hubId: hub.id
    });
  };

  return (
    <div className="space-y-4">
      <label className="block text-lg sm:text-xl font-bold text-emerald-950">
        {t('step_location')}
      </label>

      {/* GPS Primary Button */}
      <button
        type="button"
        onClick={handleUseGps}
        disabled={detectingGps}
        className={`tap-target w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl font-bold text-base transition-all border-2 ${
          gpsSuccess
            ? 'bg-emerald-700 text-white border-emerald-800'
            : 'bg-white text-emerald-900 border-emerald-700/30 hover:bg-emerald-50 active:scale-98 shadow-sm'
        }`}
      >
        {detectingGps ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
            <span>Detecting coordinates...</span>
          </>
        ) : gpsSuccess ? (
          <>
            <Check className="w-5 h-5 text-emerald-200" />
            <span>{t('gps_detected')} ({location.latitude}, {location.longitude})</span>
          </>
        ) : (
          <>
            <Navigation className="w-5 h-5 text-emerald-700" />
            <span>{t('use_gps')}</span>
          </>
        )}
      </button>

      {/* Preset Hubs for Quick Tap */}
      <div className="space-y-2">
        <p className="text-xs sm:text-sm font-semibold text-emerald-900/70">
          {t('select_preset_hub')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_HUBS.map((hub) => {
            const displayName = language === 'te' ? hub.name_te : language === 'hi' ? hub.name_hi : hub.name;
            const isSelected =
              Math.abs(location.latitude - hub.latitude) < 0.01 &&
              Math.abs(location.longitude - hub.longitude) < 0.01;

            return (
              <button
                key={hub.id}
                type="button"
                onClick={() => handleSelectHub(hub)}
                className={`tap-target text-left px-3.5 py-2.5 rounded-xl border text-sm font-bold flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                    : 'bg-white text-emerald-950 border-emerald-900/15 hover:border-emerald-600'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-300' : 'text-emerald-700'}`} />
                  <span className="truncate">{displayName}</span>
                </span>
                {isSelected && <Check className="w-4 h-4 text-emerald-200 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
