import React, { useState, useRef, useEffect } from 'react';
import { Focus, ChevronDown, Check, Sparkles } from 'lucide-react';
import {
  FRAMING_GROUPS,
  AUTO_FRAMING_OPTION,
  MANUAL_FRAMING_OPTIONS,
  FramingOption,
  getFramingOptionByIdOrName,
} from '../data/framingOptions';
import { FramingConfig } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext';

interface FramingSelectorProps {
  config: FramingConfig;
  onChange: (newConfig: FramingConfig) => void;
}

export const FramingSelector: React.FC<FramingSelectorProps> = ({
  config,
  onChange,
}) => {
  const { t } = useLanguage();
  // Section collapsed/expanded state (Default: HIDE)
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    onChange({
      ...config,
      enabled: !config.enabled,
    });
  };

  const handleSelect = (option: FramingOption) => {
    onChange({
      ...config,
      selected: option.id,
    });
    setIsOpen(false);
  };

  const activeOption =
    getFramingOptionByIdOrName(config.selected) || AUTO_FRAMING_OPTION;

  return (
    <section className={`bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm transition-all duration-200 ${isExpanded ? 'space-y-4' : ''}`}>
      {/* Header with Title & Toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between gap-3 cursor-pointer select-none group transition ${
          isExpanded ? 'pb-3 border-b border-slate-800' : ''
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 group-hover:text-cyan-300 transition-colors">
              <Focus className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{t.framingTitle}</span>
            </h2>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-medium border truncate max-w-[200px] ${
                config.enabled
                  ? 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60'
                  : 'text-slate-500 bg-slate-900 border-slate-800'
              }`}
            >
              {config.enabled ? `${activeOption.name}` : t.framingInactiveBadge}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 truncate sm:whitespace-normal">
            {t.framingSubtitle}
          </p>
        </div>

        {/* Header Controls: Switch & Expand */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Toggle Switch */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center"
          >
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={handleToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

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
                isExpanded ? 'rotate-180 text-cyan-400' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Dropdown Container */}
      <div className="relative" ref={dropdownRef}>
        {/* Dropdown Button */}
        <button
          type="button"
          onClick={() => config.enabled && setIsOpen(!isOpen)}
          disabled={!config.enabled}
          className={`w-full text-left bg-slate-950/80 border rounded-xl p-3.5 flex items-center justify-between gap-3 transition ${
            !config.enabled
              ? 'border-slate-800/60 opacity-60 cursor-not-allowed text-slate-500'
              : isOpen
              ? 'border-cyan-500/80 ring-2 ring-cyan-500/20 text-slate-200'
              : 'border-slate-800 hover:border-slate-700 text-slate-200'
          }`}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-400">
                {t.framingSelectedLabel}
              </span>
              <span className="text-xs font-bold text-white">
                {activeOption.name}
              </span>
              {activeOption.id === 'auto' && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {t.framingAutoLabel}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 truncate">
              {activeOption.description}
            </p>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-cyan-400' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && config.enabled && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl max-h-84 overflow-y-auto divide-y divide-slate-800/80 animate-fadeIn">
            {/* 1. AUTO OPTION (First, before groups) */}
            <div className="p-1.5">
              <button
                type="button"
                onClick={() => handleSelect(AUTO_FRAMING_OPTION)}
                className={`w-full text-left p-3 rounded-lg transition flex items-start justify-between gap-3 ${
                  activeOption.id === 'auto'
                    ? 'bg-cyan-950/40 text-cyan-200 border border-cyan-800/50'
                    : 'hover:bg-slate-900 text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      {AUTO_FRAMING_OPTION.name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300">
                      Otomatis
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {AUTO_FRAMING_OPTION.description}
                  </p>
                </div>
                {activeOption.id === 'auto' && (
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                )}
              </button>
            </div>

            {/* 2-5. THE 4 FRAMING GROUPS */}
            {FRAMING_GROUPS.map((group) => {
              const groupItems = MANUAL_FRAMING_OPTIONS.filter(
                (opt) => opt.groupId === group.id
              );

              return (
                <div key={group.id} className="p-1.5">
                  {/* Group Header (Visual non-selectable separator) */}
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase bg-slate-900/60 rounded-md my-1 flex items-center justify-between">
                    <span>{group.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 font-normal">
                      ({groupItems.length} opsi)
                    </span>
                  </div>

                  {/* Group Items */}
                  <div className="space-y-1">
                    {groupItems.map((option) => {
                      const isSelected = activeOption.id === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleSelect(option)}
                          className={`w-full text-left p-2.5 rounded-lg transition flex items-start justify-between gap-3 ${
                            isSelected
                              ? 'bg-cyan-950/40 text-cyan-200 border border-cyan-800/50'
                              : 'hover:bg-slate-900 text-slate-200'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-semibold text-white block">
                              {option.name}
                            </span>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                              {option.description}
                            </p>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
        </>
      )}
    </section>
  );
};
