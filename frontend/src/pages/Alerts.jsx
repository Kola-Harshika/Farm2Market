import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Bell, ArrowLeft, Trash2, Smartphone } from 'lucide-react';

export const AlertsPage = ({ onBack }) => {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.fetchAlerts();
      setAlerts(data);
    } catch (e) {
      console.warn('Failed to fetch alerts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleDelete = async (id) => {
    await api.deleteAlert(id);
    setAlerts(alerts.filter(a => a.id !== id));
    setStatusMessage('Alert deleted.');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="min-h-screen max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-emerald-900/10">
        <button
          type="button"
          onClick={onBack}
          className="tap-target inline-flex items-center gap-2 text-sm font-bold text-emerald-900 hover:text-emerald-700"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back_button')}</span>
        </button>
        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
          Mandi Price Alerts
        </span>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
          Configured Market Alerts
        </h2>
        <p className="text-xs sm:text-sm text-emerald-900/70 font-semibold">
          Automated checks against daily AgMarkNet price arrivals.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-bold">
          {statusMessage}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-slate-500 font-bold">
          Loading active alert rules...
        </div>
      ) : alerts.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-emerald-900/15 space-y-2">
          <Bell className="w-8 h-8 text-emerald-800/40 mx-auto" />
          <p className="text-emerald-950 font-bold">No price alerts registered yet.</p>
          <p className="text-xs text-emerald-900/60 font-medium">
            Run an analysis and tap "Set Price Alert" to receive notifications.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className="p-4 bg-white rounded-2xl border border-emerald-900/15 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl select-none" role="img">{alt.crop_icon || '🌾'}</span>
                  <span className="font-extrabold text-base text-emerald-950">
                    {alt.crop_name || 'Crop'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-black ${
                    alt.condition === 'BELOW' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {alt.condition} ₹{alt.target_price}/q
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>📱 {alt.phone_number}</span>
                  <span>•</span>
                  <span>{alt.mandi_name || 'All Regional Mandis'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(alt.id)}
                className="tap-target p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Delete Alert"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Smartphone className="w-4 h-4 text-emerald-700" />
          <span>SMS Gateway Abstraction Note</span>
        </div>
        <p>
          SMS provider can be connected via <code>SMS_PROVIDER</code>, <code>SMS_API_KEY</code>, and <code>SMS_SENDER_ID</code> in the backend environment.
          In development, alerts are safely logged and simulated via transparent mock mode.
        </p>
      </div>
    </div>
  );
};
