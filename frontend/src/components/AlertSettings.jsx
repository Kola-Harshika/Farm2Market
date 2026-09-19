import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { notificationService } from '../services/notificationService';
import { Bell, X, Check, Smartphone, Loader2 } from 'lucide-react';

export const AlertSettings = ({
  isOpen,
  onClose,
  cropKey = 'onion',
  cropName = 'Onion',
  defaultPrice = 2000,
  mandiId = null,
  mandiName = 'Nearby Mandis'
}) => {
  const { language, t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [condition, setCondition] = useState('BELOW'); // 'BELOW' | 'ABOVE'
  const [thresholdPrice, setThresholdPrice] = useState(defaultPrice || 2000);
  const [notifySms, setNotifySms] = useState(true);
  const [notifyBrowser, setNotifyBrowser] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState(null);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveResult(null);

    try {
      const res = await notificationService.registerAlert({
        phone_number: phoneNumber,
        crop_key: cropKey,
        mandi_id: mandiId,
        condition,
        target_price: parseFloat(thresholdPrice),
        language,
        notify_sms: notifySms,
        notify_browser: notifyBrowser
      });

      setSaveResult({
        success: true,
        message: t('alert_saved_success') || 'Alert successfully created!',
        notice: res.notice || (res.is_local_mock ? 'Alert registered in local demo mode.' : null)
      });

      if (notifyBrowser) {
        notificationService.showBrowserNotification(
          `Farm2Market Alert Set for ${cropName}`,
          { body: `We will alert you when price goes ${condition.toLowerCase()} ₹${thresholdPrice}/q.` }
        );
      }

      setTimeout(() => {
        setIsSaving(false);
      }, 1500);
    } catch (err) {
      setSaveResult({
        success: false,
        message: err.message || 'Failed to save alert.'
      });
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-900/20 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-emerald-950">
                {t('alert_modal_title')}
              </h3>
              <p className="text-xs text-emerald-900/60 font-semibold">
                {cropName} • {mandiName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-sm font-semibold text-emerald-950">
          <div>
            <label className="block text-xs uppercase tracking-wider text-emerald-900/70 mb-1">
              {t('phone_number')}
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700" />
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-emerald-900/20 rounded-xl font-bold focus:border-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-emerald-900/70 mb-1">
              {t('alert_condition')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCondition('BELOW')}
                className={`tap-target py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-colors ${
                  condition === 'BELOW'
                    ? 'bg-rose-100 text-rose-950 border-rose-400 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                🔻 Below Threshold
              </button>
              <button
                type="button"
                onClick={() => setCondition('ABOVE')}
                className={`tap-target py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-colors ${
                  condition === 'ABOVE'
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-400 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                🔺 Above Threshold
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-emerald-900/70 mb-1">
              {t('threshold_price')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-black text-emerald-800">
                ₹
              </span>
              <input
                type="number"
                required
                min="100"
                step="50"
                value={thresholdPrice}
                onChange={(e) => setThresholdPrice(e.target.value)}
                className="w-full pl-8 pr-16 py-2.5 bg-slate-50 border border-emerald-900/20 rounded-xl font-black text-lg focus:border-emerald-700 focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">
                / quintal
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifySms}
                onChange={(e) => setNotifySms(e.target.checked)}
                className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-slate-700">SMS Alerts (Configurable Gateway)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyBrowser}
                onChange={(e) => setNotifyBrowser(e.target.checked)}
                className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-slate-700">Instant Browser Notification</span>
            </label>
          </div>

          {saveResult && (
            <div className={`p-3 rounded-xl text-xs font-bold ${saveResult.success ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-rose-100 text-rose-950 border border-rose-300'}`}>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>{saveResult.message}</span>
              </div>
              {saveResult.notice && (
                <p className="mt-1 text-[11px] opacity-80 font-normal">
                  {saveResult.notice}
                </p>
              )}
            </div>
          )}

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 bg-emerald-800 text-white rounded-xl font-extrabold hover:bg-emerald-700 text-sm shadow-md flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{t('save_alert')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
