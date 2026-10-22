import React, { useState } from 'react';
import {
  X,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Cpu,
  Save,
  Trash2,
  RefreshCw,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { ApiConfig, ConnectionStatus } from '../types/index.ts';
import { GeminiService } from '../services/geminiService.ts';
import { useLanguage } from '../context/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  connectionStatus: ConnectionStatus;
  statusMessage: string;
  onSave: (newConfig: ApiConfig) => void;
  onClearKey: () => void;
  onStatusChange: (status: ConnectionStatus, message: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  connectionStatus,
  statusMessage,
  onSave,
  onClearKey,
  onStatusChange,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [modelId, setModelId] = useState(config.modelId);
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const popularModels = [
    { id: 'gemini-2.5-flash', label: 'gemini-2.5-flash' },
    { id: 'gemini-2.0-flash', label: 'gemini-2.0-flash' },
    { id: 'gemini-1.5-flash', label: 'gemini-1.5-flash' },
    { id: 'gemini-3.5-flash-lite', label: 'gemini-3.5-flash-lite' },
  ];

  const handleTestConnection = async () => {
    setIsTesting(true);
    onStatusChange('testing', language === 'id' 
      ? 'Memvalidasi API Key & Model ID ke Google Gemini API...' 
      : 'Validating API Key & Model ID against Google Gemini API...');

    const geminiService = GeminiService.getInstance();
    const result = await geminiService.testConnection(apiKey, modelId);

    setIsTesting(false);
    if (result.valid) {
      onStatusChange('connected', result.message);
    } else {
      onStatusChange('error', result.message);
    }
  };

  const handleSave = () => {
    onSave({ apiKey: apiKey.trim(), modelId: modelId.trim() });
    onClose();
  };

  const handleClear = () => {
    if (window.confirm(t.confirmClearKey)) {
      setApiKey('');
      onClearKey();
      onStatusChange('disconnected', t.keyRemovedMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{t.settingsModalTitle}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {t.byokBadge} — Bring Your Own Key
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.settingsModalSubtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner */}
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 transition ${
            connectionStatus === 'connected'
              ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-300'
              : connectionStatus === 'error'
              ? 'bg-rose-950/25 border-rose-500/40 text-rose-300'
              : connectionStatus === 'testing'
              ? 'bg-amber-950/25 border-amber-500/40 text-amber-300'
              : 'bg-slate-950/60 border-slate-800 text-slate-400'
          }`}
        >
          {connectionStatus === 'connected' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : connectionStatus === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          ) : connectionStatus === 'testing' ? (
            <RefreshCw className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-spin" />
          ) : (
            <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          )}

          <div className="space-y-0.5">
            <span className="font-semibold block capitalize">
              {t.statusPrefix} {connectionStatus}
            </span>
            <p className="leading-relaxed opacity-90">
              {statusMessage || t.statusDefaultHint}
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          {/* Language Selection Setting */}
          <div className="space-y-1.5 p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.appLanguageLabel}</span>
            </label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setLanguage('id')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  language === 'id'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-slate-900 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🇮🇩 Bahasa Indonesia</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  language === 'en'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-slate-900 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🇬🇧 English</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {t.appLanguageHint}
            </p>
          </div>

          {/* API Key */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>{t.apiKeyFieldLabel}</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-normal"
              >
                <span>{t.getKeyLinkText}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t.apiKeyPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 font-mono outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              {t.apiKeyStorageNotice}
            </p>
          </div>

          {/* Model ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.modelIdFieldLabel}</span>
            </label>

            <input
              type="text"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              placeholder={t.modelIdPlaceholder}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 font-mono outline-none"
            />

            {/* Quick model selector chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {popularModels.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModelId(m.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono border transition ${
                    modelId === m.id
                      ? 'bg-cyan-950/40 text-cyan-300 border-cyan-700 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {m.id}
                </button>
              ))}
            </div>

            {/* Model Verification Advisory Notice */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 block">
                {t.modelNoticeTitle}
              </span>
              <p>
                {t.modelNoticeBody}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey.trim()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-50 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? t.testingConnectionBtn : t.testConnectionBtn}</span>
            </button>

            {apiKey.trim() && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/20 hover:border-rose-800 border border-transparent transition"
                title={t.clearKeyBtn}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.clearKeyBtn}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
            >
              {t.cancelBtn}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-950/30 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.saveSettingsBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
