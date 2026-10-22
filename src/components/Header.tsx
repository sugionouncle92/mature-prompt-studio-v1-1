import React from 'react';
import { Settings, Sparkles, KeyRound, CheckCircle2, AlertCircle, Globe } from 'lucide-react';
import { ConnectionStatus } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  connectionStatus: ConnectionStatus;
  modelId: string;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  connectionStatus,
  modelId,
  onOpenSettings,
}) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-lg shadow-amber-950/40">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">{t.appTitle}</h1>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                {t.byokBadge}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Status, Language Selector & Settings Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Language Switcher */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-0.5 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
            <button
              type="button"
              onClick={() => setLanguage('id')}
              className={`px-2 py-1 rounded-md font-medium transition ${
                language === 'id'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Ganti ke Bahasa Indonesia"
            >
              ID
            </button>
            <span className="text-slate-700">|</span>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-md font-medium transition ${
                language === 'en'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switch to English"
            >
              EN
            </button>
          </div>

          {/* Download APK Pill */}
          <a
            href="./mature-prompt-studio-v1.0.0.apk"
            download="mature-prompt-studio-v1.0.0.apk"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/40 transition shadow-sm"
            title="Download Android Release APK (v1.0.0)"
          >
            <span>📱 APK</span>
            <span className="hidden sm:inline">Release</span>
          </a>

          {/* Connection Pill */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors bg-slate-800/70 hover:bg-slate-800 border-slate-700/80"
            title={t.settingsBtn}
          >
            {connectionStatus === 'connected' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300 font-mono hidden sm:inline">{modelId}</span>
                <span className="text-emerald-400">{t.connected}</span>
              </>
            ) : connectionStatus === 'error' ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-400">{t.apiError}</span>
              </>
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">{t.notConnected}</span>
              </>
            )}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.settingsBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
