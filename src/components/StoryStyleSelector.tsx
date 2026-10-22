import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Star,
  Plus,
  Check,
  RotateCcw,
  Info,
  Flame,
  UserCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  STORY_CATEGORIES,
  MATURE_SUBSTYLE_GROUPS,
  MATURE_COUPLE_STYLES,
  MATURE_SOLO_SUBSTYLES,
  MATURE_INTENSITY_DIRECTIVES,
  getStoryStyleDescription,
  isMatureSensualSubstyle,
  isMatureCoupleStyle,
} from '../data/storyStyles.ts';
import { StoryStyleSelection, MatureSensualIntensity } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext';

interface StoryStyleSelectorProps {
  selection: StoryStyleSelection;
  onChange: (val: StoryStyleSelection) => void;
}

export const StoryStyleSelector: React.FC<StoryStyleSelectorProps> = ({
  selection,
  onChange,
}) => {
  const { t } = useLanguage();
  // Main section collapsed/expanded state (Default: HIDE)
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // All categories hidden/collapsed by default (Default: Hide All)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  // Toggle between Solo Substyles (19) and Couple Context (22)
  const [matureContextTab, setMatureContextTab] = useState<'solo' | 'couple'>('solo');

  // Desktop hover / focus tooltip state
  const [hoveredStyle, setHoveredStyle] = useState<{
    name: string;
    description: string;
    coords: { x: number; y: number; placement: 'top' | 'bottom' };
  } | null>(null);

  // Mobile / touch info dialog state
  const [mobileInfo, setMobileInfo] = useState<{
    name: string;
    description: string;
  } | null>(null);

  const hoverTimerRef = useRef<number | null>(null);

  // Auto-switch tab if user has active couple style selected
  useEffect(() => {
    if (isMatureCoupleStyle(selection.primary || '')) {
      setMatureContextTab('couple');
    }
  }, [selection.primary]);

  const handleItemHover = (name: string, targetEl: HTMLElement) => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = window.setTimeout(() => {
      const rect = targetEl.getBoundingClientRect();
      const desc = getStoryStyleDescription(name);

      const tooltipWidth = 280;
      const estimatedHeight = 110;

      const spaceBelow = window.innerHeight - rect.bottom;
      const placement: 'top' | 'bottom' =
        spaceBelow < estimatedHeight + 16 && rect.top > estimatedHeight + 16 ? 'top' : 'bottom';

      const targetCenter = rect.left + rect.width / 2;
      const clampedX = Math.max(
        16,
        Math.min(window.innerWidth - tooltipWidth - 16, targetCenter - tooltipWidth / 2)
      );

      const y = placement === 'top' ? rect.top - 8 : rect.bottom + 8;

      setHoveredStyle({
        name,
        description: desc,
        coords: { x: clampedX, y, placement },
      });
    }, 180);
  };

  const handleItemLeave = () => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setHoveredStyle(null);
  };

  useEffect(() => {
    const handleDismissTooltip = () => {
      if (hoverTimerRef.current) {
        window.clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      setHoveredStyle(null);
    };

    window.addEventListener('scroll', handleDismissTooltip, true);
    window.addEventListener('resize', handleDismissTooltip);
    return () => {
      if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
      window.removeEventListener('scroll', handleDismissTooltip, true);
      window.removeEventListener('resize', handleDismissTooltip);
    };
  }, []);

  const toggleCategory = (catId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleSelectMatureSubstyle = (substyleName: string) => {
    const isCurrentActive =
      (selection.primary === 'Mature & Sensual' && selection.matureSubstyle === substyleName) ||
      selection.primary === substyleName;

    if (isCurrentActive) {
      onChange({
        ...selection,
        primary: null,
        matureSubstyle: null,
      });
    } else {
      const nextSupporting = selection.supporting.filter(
        (s) => s !== substyleName && s !== 'Mature & Sensual'
      );
      onChange({
        ...selection,
        primary: 'Mature & Sensual',
        matureSubstyle: substyleName,
        matureIntensity: selection.matureIntensity || 'Soft',
        supporting: nextSupporting,
      });
    }
  };

  const handleSetMatureIntensity = (intensity: MatureSensualIntensity) => {
    onChange({
      ...selection,
      matureIntensity: intensity,
    });
  };

  const handleSelectPrimary = (item: string) => {
    if (isMatureSensualSubstyle(item)) {
      handleSelectMatureSubstyle(item);
      return;
    }

    if (item === 'Mature & Sensual') {
      if (selection.primary === 'Mature & Sensual') {
        onChange({
          ...selection,
          primary: null,
          matureSubstyle: null,
        });
      } else {
        onChange({
          ...selection,
          primary: 'Mature & Sensual',
          matureSubstyle: selection.matureSubstyle || 'Soft Sensuality',
          matureIntensity: selection.matureIntensity || 'Soft',
          supporting: selection.supporting.filter((s) => s !== 'Mature & Sensual'),
        });
      }
      return;
    }

    if (selection.primary === item) {
      onChange({
        ...selection,
        primary: null,
      });
    } else {
      const nextSupporting = selection.supporting.filter((s) => s !== item);
      onChange({
        ...selection,
        primary: item,
        supporting: nextSupporting,
        ...(isMatureCoupleStyle(item) ? { matureSubstyle: null } : {}),
      });
    }
  };

  const handleToggleSupporting = (item: string) => {
    if (
      selection.primary === item ||
      (selection.primary === 'Mature & Sensual' && selection.matureSubstyle === item)
    ) {
      return;
    }

    if (selection.supporting.includes(item)) {
      onChange({
        ...selection,
        supporting: selection.supporting.filter((s) => s !== item),
      });
    } else {
      if (selection.supporting.length >= 2) {
        return;
      }
      onChange({
        ...selection,
        supporting: [...selection.supporting, item],
      });
    }
  };

  const handleClearAll = () => {
    onChange({
      primary: null,
      supporting: [],
      custom: '',
      matureSubstyle: null,
      matureIntensity: 'Soft',
    });
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return STORY_CATEGORIES;
    const query = searchQuery.toLowerCase();

    return STORY_CATEGORIES.map((cat) => {
      const matchCat = cat.name.toLowerCase().includes(query);
      const matchItems = cat.items.filter((item) =>
        item.toLowerCase().includes(query)
      );

      if (matchCat) return cat;
      if (matchItems.length > 0) {
        return {
          ...cat,
          items: matchItems,
        };
      }
      return null;
    }).filter(Boolean) as typeof STORY_CATEGORIES;
  }, [searchQuery]);

  const isMatureSoloActivePrimary =
    (selection.primary === 'Mature & Sensual' && !isMatureCoupleStyle(selection.primary || '')) ||
    (isMatureSensualSubstyle(selection.primary || '') && !isMatureCoupleStyle(selection.primary || ''));

  const hasSelections =
    selection.primary !== null ||
    Boolean(selection.matureSubstyle) ||
    selection.supporting.length > 0 ||
    selection.custom.trim().length > 0;

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
            <h2 className="text-base font-semibold text-white flex items-center gap-2 group-hover:text-amber-300 transition-colors">
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t.storyStyleTitle}</span>
            </h2>
            {hasSelections && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 truncate max-w-[200px]">
                {selection.primary ? selection.primary : t.activeStylesLabel}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5 truncate sm:whitespace-normal">
            {t.storyStyleSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isExpanded && hasSelections && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            >
              <RotateCcw className="w-3 h-3" />
              {t.clearStyles}
            </button>
          )}

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
                isExpanded ? 'rotate-180 text-amber-400' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Active Selections Bar */}
      {hasSelections && (
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">{t.activeStylesLabel}</span>

          {/* Primary Style */}
          {selection.primary && (
            <span
              onMouseEnter={(e) => handleItemHover(selection.primary!, e.currentTarget)}
              onMouseLeave={handleItemLeave}
              onFocus={(e) => handleItemHover(selection.primary!, e.currentTarget)}
              onBlur={handleItemLeave}
              tabIndex={0}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 cursor-help"
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{t.primaryPrefix}: {selection.primary}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPrimary(selection.primary!);
                }}
                className="hover:text-white ml-0.5"
                title={t.unsetPrimaryTooltip}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Mature Solo Substyle Chip */}
          {isMatureSoloActivePrimary && selection.matureSubstyle && (
            <span
              onMouseEnter={(e) => handleItemHover(selection.matureSubstyle!, e.currentTarget)}
              onMouseLeave={handleItemLeave}
              onFocus={(e) => handleItemHover(selection.matureSubstyle!, e.currentTarget)}
              onBlur={handleItemLeave}
              tabIndex={0}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 cursor-help shadow-sm"
            >
              <Flame className="w-3 h-3 text-rose-400" />
              <span>
                {t.substylePrefix}: {selection.matureSubstyle} ({selection.matureIntensity || 'Soft'})
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange({ ...selection, matureSubstyle: null });
                }}
                className="hover:text-white ml-0.5"
                title={t.unsetMaturePrimaryTooltip}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Supporting */}
          {selection.supporting.map((sup) => (
            <span
              key={sup}
              onMouseEnter={(e) => handleItemHover(sup, e.currentTarget)}
              onMouseLeave={handleItemLeave}
              onFocus={(e) => handleItemHover(sup, e.currentTarget)}
              onBlur={handleItemLeave}
              tabIndex={0}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 cursor-help"
            >
              <Plus className="w-3 h-3 text-cyan-400" />
              <span>{t.supportingPrefix}: {sup}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleSupporting(sup);
                }}
                className="hover:text-white ml-0.5"
                title={t.removeSupportingTooltip}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Custom */}
          {selection.custom.trim() && (
            <span
              onMouseEnter={(e) => handleItemHover(selection.custom, e.currentTarget)}
              onMouseLeave={handleItemLeave}
              onFocus={(e) => handleItemHover(selection.custom, e.currentTarget)}
              onBlur={handleItemLeave}
              tabIndex={0}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-950/30 text-purple-300 border border-purple-800/40 cursor-help"
            >
              <span>{t.customPrefix}: {selection.custom}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange({ ...selection, custom: '' });
                }}
                className="hover:text-white ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Search & Custom Input Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchStoryPlaceholder}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none transition"
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

        {/* Custom Style Input */}
        <div>
          <input
            type="text"
            value={selection.custom}
            onChange={(e) => onChange({ ...selection, custom: e.target.value })}
            onMouseEnter={(e) => handleItemHover(selection.custom || 'Custom Story Style', e.currentTarget)}
            onMouseLeave={handleItemLeave}
            placeholder={t.customStoryPlaceholder}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none transition"
          />
        </div>
      </div>

      {/* Accordion Categories */}
      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {filteredCategories.map((category) => {
          const isOpen = Boolean(openCategories[category.id] || searchQuery.trim().length > 0);

          const selectedInCat =
            category.id === 'mature-sensual'
              ? category.items.filter(
                  (i) =>
                    (isMatureSoloActivePrimary &&
                      (selection.matureSubstyle === i || selection.primary === i)) ||
                    selection.primary === i ||
                    selection.supporting.includes(i)
                ).length + (selection.primary === 'Mature & Sensual' ? 1 : 0)
              : category.items.filter(
                  (i) => i === selection.primary || selection.supporting.includes(i)
                ).length;

          const isSearchMode = searchQuery.trim().length > 0;
          const matchingSoloCount = category.id === 'mature-sensual'
            ? MATURE_SOLO_SUBSTYLES.filter((name) => category.items.includes(name)).length
            : 0;
          const matchingCoupleCount = category.id === 'mature-sensual'
            ? MATURE_COUPLE_STYLES.filter((name) => category.items.includes(name)).length
            : 0;

          return (
            <div
              key={category.id}
              className="border border-slate-800/80 rounded-xl bg-slate-950/40 overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-semibold text-slate-200">{category.name}</span>
                  {selectedInCat > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {selectedInCat}
                    </span>
                  )}
                  {category.id === 'mature-sensual' && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      <Flame className="w-2.5 h-2.5" />
                      19 Solo + 22 Pasangan
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {category.id === 'mature-sensual' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPrimary('Mature & Sensual');
                      }}
                      title={
                        selection.primary === 'Mature & Sensual'
                          ? t.unsetPrimaryTooltip
                          : t.setPrimaryTooltip
                      }
                      className={`p-1 rounded transition ${
                        selection.primary === 'Mature & Sensual'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                      }`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          selection.primary === 'Mature & Sensual' ? 'fill-current' : ''
                        }`}
                      />
                    </button>
                  )}
                  {isOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </button>

              {isOpen && category.id === 'mature-sensual' && (
                <div className="px-4 pb-3 pt-2 border-t border-slate-800/50 space-y-3">
                  {/* Context Sub-Tabs (Solo vs Couple Context) */}
                  <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2.5">
                    <button
                      type="button"
                      onClick={() => setMatureContextTab('solo')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        matureContextTab === 'solo' && !isSearchMode
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                      <span>{t.matureTabSolo}</span>
                      {matchingSoloCount > 0 && isSearchMode && (
                        <span className="text-[10px] px-1 rounded bg-rose-500/30 text-rose-200">
                          {matchingSoloCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setMatureContextTab('couple')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        matureContextTab === 'couple' && !isSearchMode
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.matureTabCouple}</span>
                      {matchingCoupleCount > 0 && isSearchMode && (
                        <span className="text-[10px] px-1 rounded bg-amber-500/30 text-amber-200">
                          {matchingCoupleCount}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* SOLO CONTEXT VIEW */}
                  {(matureContextTab === 'solo' || (isSearchMode && matchingSoloCount > 0)) && (
                    <div className="space-y-3">
                      {/* Intensity & Single Subject Mandate */}
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-xs font-semibold text-slate-200">
                              {t.matureIntensityTitle}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              (Default: Soft)
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <UserCheck className="w-3 h-3" />
                            <span>{t.singleFemaleMandateBadge}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
                          {(['Soft', 'Bold', 'Provocative', 'High Glamour'] as MatureSensualIntensity[]).map(
                            (lvl) => {
                              const isSelected = (selection.matureIntensity || 'Soft') === lvl;
                              return (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() => handleSetMatureIntensity(lvl)}
                                  className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition ${
                                    isSelected
                                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold shadow-sm'
                                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                                  }`}
                                >
                                  {lvl}
                                </button>
                              );
                            }
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 italic">
                          {MATURE_INTENSITY_DIRECTIVES[selection.matureIntensity || 'Soft'].desc}
                        </p>
                      </div>

                      {/* Substyle Groups */}
                      {MATURE_SUBSTYLE_GROUPS.map((group) => {
                        const groupItems = group.substyles.filter((name) =>
                          category.items.includes(name)
                        );
                        if (groupItems.length === 0) return null;

                        return (
                          <div key={group.id} className="space-y-1.5">
                            <div className="text-[11px] font-semibold text-amber-400/90 px-0.5 flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-amber-400/70" />
                              <span>{group.title}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {groupItems.map((item) => {
                                const isPrimary =
                                  (selection.primary === 'Mature & Sensual' &&
                                    selection.matureSubstyle === item) ||
                                  selection.primary === item;
                                const isSupporting = selection.supporting.includes(item);
                                const canSupport = !isPrimary && selection.supporting.length < 2;

                                return (
                                  <div
                                    key={item}
                                    tabIndex={0}
                                    onMouseEnter={(e) => handleItemHover(item, e.currentTarget)}
                                    onMouseLeave={handleItemLeave}
                                    onFocus={(e) => handleItemHover(item, e.currentTarget)}
                                    onBlur={handleItemLeave}
                                    aria-describedby={
                                      hoveredStyle?.name === item ? 'story-style-tooltip' : undefined
                                    }
                                    className={`group p-2 rounded-lg border text-xs flex items-center justify-between transition outline-none focus:ring-1 focus:ring-amber-500/50 ${
                                      isPrimary
                                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-sm'
                                        : isSupporting
                                        ? 'bg-cyan-950/20 border-cyan-700/50 text-cyan-200'
                                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                                    }`}
                                  >
                                    <span className="font-medium truncate mr-1.5">{item}</span>

                                    <div className="flex items-center gap-1 shrink-0">
                                      {/* Info Button */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setMobileInfo({
                                            name: item,
                                            description: getStoryStyleDescription(item),
                                          });
                                        }}
                                        title={`Info: ${item}`}
                                        aria-label={`Deskripsi ${item}`}
                                        className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
                                      >
                                        <Info className="w-3 h-3" />
                                      </button>

                                      {/* Set Primary Button */}
                                      <button
                                        type="button"
                                        onClick={() => handleSelectMatureSubstyle(item)}
                                        title={
                                          isPrimary
                                            ? t.unsetMaturePrimaryTooltip
                                            : t.setMaturePrimaryTooltip
                                        }
                                        className={`p-1 rounded transition ${
                                          isPrimary
                                            ? 'bg-amber-500 text-slate-950 font-bold'
                                            : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                                        }`}
                                      >
                                        <Star
                                          className={`w-3 h-3 ${isPrimary ? 'fill-current' : ''}`}
                                        />
                                      </button>

                                      {/* Supporting Button */}
                                      {!isPrimary && (
                                        <button
                                          type="button"
                                          onClick={() => handleToggleSupporting(item)}
                                          disabled={!isSupporting && !canSupport}
                                          title={
                                            isSupporting
                                              ? t.removeSupportingTooltip
                                              : canSupport
                                              ? t.addSupportingTooltip
                                              : t.supportingLimitReached
                                          }
                                          className={`p-1 rounded transition ${
                                            isSupporting
                                              ? 'bg-cyan-600 text-white font-bold'
                                              : canSupport
                                              ? 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
                                              : 'text-slate-600 cursor-not-allowed'
                                          }`}
                                        >
                                          {isSupporting ? (
                                            <Check className="w-3 h-3" />
                                          ) : (
                                            <Plus className="w-3 h-3" />
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* COUPLE CONTEXT VIEW */}
                  {(matureContextTab === 'couple' || (isSearchMode && matchingCoupleCount > 0)) && (
                    <div className="space-y-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                          <Users className="w-3.5 h-3.5 text-amber-400" />
                          <span>{t.coupleMandateBadge}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Interaksi romantis, chemistry, & kedekatan pasangan dewasa
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {MATURE_COUPLE_STYLES.filter((name) => category.items.includes(name)).map(
                          (item) => {
                            const isPrimary = selection.primary === item;
                            const isSupporting = selection.supporting.includes(item);
                            const canSupport = !isPrimary && selection.supporting.length < 2;

                            return (
                              <div
                                key={item}
                                tabIndex={0}
                                onMouseEnter={(e) => handleItemHover(item, e.currentTarget)}
                                onMouseLeave={handleItemLeave}
                                onFocus={(e) => handleItemHover(item, e.currentTarget)}
                                onBlur={handleItemLeave}
                                aria-describedby={
                                  hoveredStyle?.name === item ? 'story-style-tooltip' : undefined
                                }
                                className={`group p-2 rounded-lg border text-xs flex items-center justify-between transition outline-none focus:ring-1 focus:ring-amber-500/50 ${
                                  isPrimary
                                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-sm'
                                    : isSupporting
                                    ? 'bg-cyan-950/20 border-cyan-700/50 text-cyan-200'
                                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <span className="font-medium truncate mr-1.5">{item}</span>

                                <div className="flex items-center gap-1 shrink-0">
                                  {/* Info Button */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMobileInfo({
                                        name: item,
                                        description: getStoryStyleDescription(item),
                                      });
                                    }}
                                    title={`Info: ${item}`}
                                    aria-label={`Deskripsi ${item}`}
                                    className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
                                  >
                                    <Info className="w-3 h-3" />
                                  </button>

                                  {/* Set Primary Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleSelectPrimary(item)}
                                    title={isPrimary ? t.unsetPrimaryTooltip : t.setPrimaryTooltip}
                                    className={`p-1 rounded transition ${
                                      isPrimary
                                        ? 'bg-amber-500 text-slate-950 font-bold'
                                        : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                                    }`}
                                  >
                                    <Star
                                      className={`w-3 h-3 ${isPrimary ? 'fill-current' : ''}`}
                                    />
                                  </button>

                                  {/* Supporting Button */}
                                  {!isPrimary && (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleSupporting(item)}
                                      disabled={!isSupporting && !canSupport}
                                      title={
                                        isSupporting
                                          ? t.removeSupportingTooltip
                                          : canSupport
                                          ? t.addSupportingTooltip
                                          : t.supportingLimitReached
                                      }
                                      className={`p-1 rounded transition ${
                                        isSupporting
                                          ? 'bg-cyan-600 text-white font-bold'
                                          : canSupport
                                          ? 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
                                          : 'text-slate-600 cursor-not-allowed'
                                      }`}
                                    >
                                      {isSupporting ? (
                                        <Check className="w-3 h-3" />
                                      ) : (
                                        <Plus className="w-3 h-3" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isOpen && category.id !== 'mature-sensual' && (
                <div className="px-4 pb-3 pt-1 border-t border-slate-800/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {category.items.map((item) => {
                    const isPrimary = selection.primary === item;
                    const isSupporting = selection.supporting.includes(item);
                    const canSupport = !isPrimary && selection.supporting.length < 2;

                    return (
                      <div
                        key={item}
                        tabIndex={0}
                        onMouseEnter={(e) => handleItemHover(item, e.currentTarget)}
                        onMouseLeave={handleItemLeave}
                        onFocus={(e) => handleItemHover(item, e.currentTarget)}
                        onBlur={handleItemLeave}
                        aria-describedby={
                          hoveredStyle?.name === item ? 'story-style-tooltip' : undefined
                        }
                        className={`group p-2 rounded-lg border text-xs flex items-center justify-between transition outline-none focus:ring-1 focus:ring-amber-500/50 ${
                          isPrimary
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                            : isSupporting
                            ? 'bg-cyan-950/20 border-cyan-700/50 text-cyan-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-medium truncate mr-1.5">{item}</span>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Info Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMobileInfo({
                                name: item,
                                description: getStoryStyleDescription(item),
                              });
                            }}
                            title={`Info: ${item}`}
                            aria-label={`Deskripsi ${item}`}
                            className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
                          >
                            <Info className="w-3 h-3" />
                          </button>

                          {/* Set Primary Button */}
                          <button
                            type="button"
                            onClick={() => handleSelectPrimary(item)}
                            title={isPrimary ? t.unsetPrimaryTooltip : t.setPrimaryTooltip}
                            className={`p-1 rounded transition ${
                              isPrimary
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                            }`}
                          >
                            <Star className={`w-3 h-3 ${isPrimary ? 'fill-current' : ''}`} />
                          </button>

                          {/* Set Supporting Button */}
                          {!isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleToggleSupporting(item)}
                              disabled={!isSupporting && !canSupport}
                              title={
                                isSupporting
                                  ? t.removeSupportingTooltip
                                  : canSupport
                                  ? t.addSupportingTooltip
                                  : t.supportingLimitReached
                              }
                              className={`p-1 rounded transition ${
                                isSupporting
                                  ? 'bg-cyan-600 text-white font-bold'
                                  : canSupport
                                  ? 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
                                  : 'text-slate-600 cursor-not-allowed'
                              }`}
                            >
                              {isSupporting ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Plus className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Desktop / Focus Tooltip */}
      {hoveredStyle && (
        <div
          role="tooltip"
          id="story-style-tooltip"
          className="fixed z-[9999] pointer-events-none w-72 max-w-[calc(100vw-32px)] bg-slate-900/95 backdrop-blur-md border border-amber-500/40 rounded-xl p-3 shadow-2xl shadow-black/80 text-left transition-opacity duration-150 animate-in fade-in"
          style={{
            left: `${hoveredStyle.coords.x}px`,
            ...(hoveredStyle.coords.placement === 'top'
              ? { bottom: `${window.innerHeight - hoveredStyle.coords.y}px` }
              : { top: `${hoveredStyle.coords.y}px` }),
          }}
        >
          <div className="flex items-center gap-1.5 mb-1 text-amber-300 font-semibold text-xs">
            <Info className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span className="truncate">{hoveredStyle.name}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300 font-normal">
            {hoveredStyle.description}
          </p>
        </div>
      )}

      {/* Mobile / Touch Dialog Modal */}
      {mobileInfo && (
        <div
          className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setMobileInfo(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span className="truncate">{mobileInfo.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileInfo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs leading-relaxed text-slate-300">
              {mobileInfo.description}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setMobileInfo(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </section>
  );
};
