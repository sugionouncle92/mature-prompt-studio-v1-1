import React, { useState } from 'react';
import { Camera, Check, Sparkles, X, RotateCcw, Search, ChevronDown } from 'lucide-react';
import { PHOTOGRAPHIC_STYLES, DEFAULT_PHOTOGRAPHIC_STYLES } from '../data/photographicStyles.ts';
import { PhotographicStyleSelection } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext';

interface PhotographicStyleSelectorProps {
  selection: PhotographicStyleSelection;
  onChange: (val: PhotographicStyleSelection) => void;
}

export const PhotographicStyleSelector: React.FC<PhotographicStyleSelectorProps> = ({
  selection,
  onChange,
}) => {
  const { t } = useLanguage();
  // Section collapsed/expanded state (Default: HIDE)
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleStyle = (name: string) => {
    if (selection.selected.includes(name)) {
      onChange({
        ...selection,
        selected: selection.selected.filter((s) => s !== name),
      });
    } else {
      onChange({
        ...selection,
        selected: [...selection.selected, name],
      });
    }
  };

  const handleClearAll = () => {
    onChange({
      selected: [],
      custom: '',
    });
  };

  const handleResetDefault = () => {
    onChange({
      selected: [...DEFAULT_PHOTOGRAPHIC_STYLES],
      custom: '',
    });
  };

  const getStyleDescription = (id: string, fallback: string) => {
    const descMap = t.photoDesc as Record<string, string>;
    return descMap[id] || fallback;
  };

  const filteredStyles = PHOTOGRAPHIC_STYLES.filter((style) => {
    const localizedDesc = getStyleDescription(style.id, style.description);
    const q = searchQuery.toLowerCase().trim();
    return (
      style.name.toLowerCase().includes(q) ||
      (style.shorthand && style.shorthand.toLowerCase().includes(q)) ||
      localizedDesc.toLowerCase().includes(q)
    );
  });

  const hasSelections =
    selection.selected.length > 0 || selection.custom.trim().length > 0;

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
            <h2 className="text-base font-semibold text-white flex items-center gap-2 group-hover:text-cyan-300 transition-colors">
              <Camera className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{t.photoStyleTitle}</span>
            </h2>
            {selection.selected.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {selection.selected.length} {t.activeStylesLabel || 'Aktif'}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5 truncate sm:whitespace-normal">
            {t.photoStyleSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isExpanded && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleResetDefault}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                title="Reset Photographic Styles to default state"
              >
                <RotateCcw className="w-3 h-3 text-cyan-400" />
                {t.resetPhotoStyles || 'Reset Default'}
              </button>
              {hasSelections && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-lg transition"
                >
                  <X className="w-3 h-3" />
                  {t.clearPhotoStyles}
                </button>
              )}
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
                isExpanded ? 'rotate-180 text-cyan-400' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Mobile Actions Bar */}
          <div className="flex sm:hidden items-center gap-2 flex-wrap pb-1">
            <button
              type="button"
              onClick={handleResetDefault}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
              title="Reset Photographic Styles to default state"
            >
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              {t.resetPhotoStyles || 'Reset Default'}
            </button>
            {hasSelections && (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-3 h-3" />
                {t.clearPhotoStyles}
              </button>
            )}
          </div>

          {/* Active Tags */}
      {hasSelections && (
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">{t.activeStylesLabel}</span>
          {selection.selected.map((item) => (
            <span
              key={item}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                item === 'Ultra Realistic'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-cyan-950/30 text-cyan-300 border-cyan-800/40'
              }`}
            >
              <span>{item}</span>
              <button
                onClick={() => toggleStyle(item)}
                className="hover:text-white ml-0.5"
                title="Remove Style"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {selection.custom.trim() && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-950/30 text-purple-300 border border-purple-800/40">
              <span>{t.customPrefix}: {selection.custom}</span>
              <button
                onClick={() => onChange({ ...selection, custom: '' })}
                className="hover:text-white ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Search & Custom Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPhotoPlaceholder}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div>
          <input
            type="text"
            value={selection.custom}
            onChange={(e) => onChange({ ...selection, custom: e.target.value })}
            placeholder={t.customPhotoPlaceholder}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none transition"
          />
        </div>
      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
        {filteredStyles.map((style) => {
          const isSelected = selection.selected.includes(style.name);
          const isUltra = style.isMandatoryUltra;
          const description = getStyleDescription(style.id, style.description);

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => toggleStyle(style.name)}
              className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between h-full ${
                isSelected
                  ? isUltra
                    ? 'bg-amber-500/10 border-amber-500/60 shadow-sm shadow-amber-950/20'
                    : 'bg-cyan-950/30 border-cyan-500/60 shadow-sm shadow-cyan-950/20'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {style.shorthand && (
                      <span className="font-mono text-[10px] font-bold text-amber-300 tracking-tight bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {style.shorthand}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-200">{style.name}</span>
                    {isUltra && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                        {t.microdetailBadge}
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition shrink-0 ${
                      isSelected
                        ? isUltra
                          ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold'
                          : 'bg-cyan-500 border-cyan-500 text-slate-950 font-bold'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-auto">
                  {description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
        </>
      )}
    </section>
  );
};
