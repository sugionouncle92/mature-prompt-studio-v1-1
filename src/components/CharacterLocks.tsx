import React, { useState } from 'react';
import { Lock, ShieldCheck, UserCheck, Check, Scale, Activity, Compass, Eye, Sparkles, RotateCcw, ChevronDown } from 'lucide-react';
import { CharacterLocksState, DEFAULT_CHARACTER_LOCKS } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext';
import { CHARACTER_LOCKS_CONFIG } from '../data/characterLocks.ts';

interface CharacterLocksProps {
  locks: CharacterLocksState;
  onChange: (val: CharacterLocksState) => void;
}

export const CharacterLocks: React.FC<CharacterLocksProps> = ({ locks, onChange }) => {
  const { t } = useLanguage();
  // Section collapsed/expanded state (Default: HIDE)
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleLock = (key: keyof CharacterLocksState) => {
    onChange({
      ...locks,
      [key]: !locks[key],
    });
  };

  const setAll = (val: boolean) => {
    const nextState = { ...locks };
    CHARACTER_LOCKS_CONFIG.forEach((cfg) => {
      nextState[cfg.key] = val;
    });
    onChange(nextState);
  };

  const handleResetDefault = () => {
    onChange({ ...DEFAULT_CHARACTER_LOCKS });
  };

  const getLockIcon = (key: keyof CharacterLocksState) => {
    switch (key) {
      case 'agepreserve':
        return <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />;
      case 'bodyproportionlock':
        return <Scale className="w-3.5 h-3.5 text-amber-400" />;
      case 'anatomylock':
        return <Activity className="w-3.5 h-3.5 text-emerald-400" />;
      case 'poseconsistency':
        return <Compass className="w-3.5 h-3.5 text-cyan-400" />;
      case 'perspectivecorrection':
        return <Eye className="w-3.5 h-3.5 text-indigo-400" />;
      case 'identitylock':
        return <UserCheck className="w-3.5 h-3.5 text-rose-400" />;
      case 'referencepriority':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'facialconsistency':
        return <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <UserCheck className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const activeCount = Object.values(locks).filter(Boolean).length;

  return (
    <section className={`bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm transition-all duration-200 ${isExpanded ? 'space-y-4' : ''}`}>
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between gap-3 cursor-pointer select-none group transition ${
          isExpanded ? 'pb-3 border-b border-slate-800' : ''
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 group-hover:text-rose-300 transition-colors">
              <Lock className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{t.characterLocksTitle}</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {activeCount} {t.activeLocksCount}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 truncate sm:whitespace-normal">
            {t.characterLocksSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isExpanded && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="hidden lg:flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleResetDefault}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                title="Reset Character Locks to default state"
              >
                <RotateCcw className="w-3 h-3 text-rose-400" />
                {t.resetLocks || 'Reset Default'}
              </button>
              <button
                type="button"
                onClick={() => setAll(true)}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
              >
                {t.lockAll}
              </button>
              <button
                type="button"
                onClick={() => setAll(false)}
                className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-lg transition"
              >
                {t.unlockAll}
              </button>
            </div>
          )}

          {/* Expand/Collapse Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-expanded={isExpanded}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition group-hover:border-slate-600"
          >
            <span className="hidden sm:inline">{isExpanded ? t.collapseSection : t.expandSection}</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isExpanded ? 'rotate-180 text-rose-400' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Mobile Action Buttons Bar */}
          <div className="flex lg:hidden items-center gap-2 flex-wrap pb-1">
            <button
              type="button"
              onClick={handleResetDefault}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
              title="Reset Character Locks to default state"
            >
              <RotateCcw className="w-3 h-3 text-rose-400" />
              {t.resetLocks || 'Reset Default'}
            </button>
            <button
              type="button"
              onClick={() => setAll(true)}
              className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
            >
              {t.lockAll}
            </button>
            <button
              type="button"
              onClick={() => setAll(false)}
              className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-lg transition"
            >
              {t.unlockAll}
            </button>
          </div>

          {/* Locks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 items-stretch">
        {CHARACTER_LOCKS_CONFIG.map((item) => {
          const isActive = locks[item.key];
          const description = t.locksDesc[item.key];

          return (
            <div
              key={item.key}
              onClick={() => toggleLock(item.key)}
              className={`p-3.5 rounded-xl border cursor-pointer transition select-none flex flex-col justify-between h-full ${
                isActive
                  ? 'bg-rose-950/20 border-rose-500/50 shadow-sm shadow-rose-950/20'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <span className="font-mono text-xs font-bold text-amber-300 tracking-tight">
                    {item.tag}
                  </span>
                  {/* Switch Pill */}
                  <div
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative flex items-center shrink-0 ${
                      isActive ? 'bg-rose-500' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center text-[10px] ${
                        isActive ? 'translate-x-4 text-rose-600' : 'translate-x-0 text-slate-400'
                      }`}
                    >
                      {isActive && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 mb-1.5">
                  {getLockIcon(item.key)}
                  <span>{item.name}</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed mt-auto">
                  {description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
        </>
      )}
    </section>
  );
};
