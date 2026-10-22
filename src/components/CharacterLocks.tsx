import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldCheck,
  UserCheck,
  Check,
  Scale,
  Activity,
  Compass,
  Eye,
  Sparkles,
  RotateCcw,
  ChevronDown,
  Bookmark,
  FolderOpen,
  Save,
  Plus,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Copy,
  Trash2,
  Edit3,
  X,
} from 'lucide-react';
import { CharacterLocksState, DEFAULT_CHARACTER_LOCKS, CharacterLockPreset } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext';
import {
  CHARACTER_LOCKS_CONFIG,
  STORAGE_KEY_CHARACTER_LOCK_PRESETS,
  STORAGE_KEY_ACTIVE_LOCK_PRESET_ID,
  LEGACY_BUILTIN_PRESET_IDS,
  areLocksEqual,
  filterOutLegacyBuiltinPresets,
} from '../data/characterLocks.ts';

interface CharacterLocksProps {
  locks: CharacterLocksState;
  onChange: (val: CharacterLocksState) => void;
}

export const CharacterLocks: React.FC<CharacterLocksProps> = ({ locks, onChange }) => {
  const { t } = useLanguage();
  // Section collapsed/expanded state (Default: HIDE)
  const [isExpanded, setIsExpanded] = useState(false);

  // Presets State — Starts empty by default, strictly migrates out any legacy built-in presets
  const [presets, setPresets] = useState<CharacterLockPreset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHARACTER_LOCK_PRESETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out legacy built-in presets by isBuiltIn or legacy built-in IDs
          return filterOutLegacyBuiltinPresets(parsed).map((item) => ({
            ...item,
            locks: {
              ...DEFAULT_CHARACTER_LOCKS,
              ...(item.locks || {}),
            },
          }));
        }
      }
    } catch {
      // fallback to empty list
    }
    return [];
  });

  const [activePresetId, setActivePresetId] = useState<string | null>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE_LOCK_PRESET_ID);
      if (savedId && !LEGACY_BUILTIN_PRESET_IDS.has(savedId)) {
        return savedId;
      }
    } catch {
      // fallback
    }
    return null;
  });

  const [selectedDropdownPresetId, setSelectedDropdownPresetId] = useState<string>(activePresetId || '');

  // Save presets to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHARACTER_LOCK_PRESETS, JSON.stringify(presets));
    } catch {
      // ignore storage errors
    }
  }, [presets]);

  // Save active preset ID whenever changed
  useEffect(() => {
    try {
      if (activePresetId) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_LOCK_PRESET_ID, activePresetId);
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_LOCK_PRESET_ID);
      }
    } catch {
      // ignore
    }
  }, [activePresetId]);

  // Sync selected dropdown when activePresetId or presets change
  useEffect(() => {
    if (activePresetId && presets.some((p) => p.id === activePresetId)) {
      setSelectedDropdownPresetId(activePresetId);
    } else if (presets.length > 0) {
      setSelectedDropdownPresetId(presets[0].id);
    } else {
      setSelectedDropdownPresetId('');
    }
  }, [activePresetId, presets]);

  // Modals state
  const [isSaveAsModalOpen, setIsSaveAsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');

  // Editing in Manage modal
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Transient feedback notice
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => {
      setNoticeMessage(null);
    }, 2800);
  };

  const activePreset = presets.find((p) => p.id === activePresetId) || null;
  const selectedDropdownPreset =
    presets.find((p) => p.id === selectedDropdownPresetId) || activePreset || presets[0] || null;

  // Check if live locks match active preset
  const isConfigClean = activePreset ? areLocksEqual(locks, activePreset.locks) : false;

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

  // Load a preset by ID and apply all 14 locks explicitly (both ON and OFF)
  const applyPreset = (presetToLoad: CharacterLockPreset) => {
    const fullLocks: CharacterLocksState = {
      facelock: Boolean(presetToLoad.locks.facelock),
      bodyshape: Boolean(presetToLoad.locks.bodyshape),
      outfitlock: Boolean(presetToLoad.locks.outfitlock),
      poselock: Boolean(presetToLoad.locks.poselock),
      agepreserve: Boolean(presetToLoad.locks.agepreserve),
      expressionlock: Boolean(presetToLoad.locks.expressionlock),
      hairlock: Boolean(presetToLoad.locks.hairlock),
      bodyproportionlock: Boolean(presetToLoad.locks.bodyproportionlock),
      anatomylock: Boolean(presetToLoad.locks.anatomylock),
      poseconsistency: Boolean(presetToLoad.locks.poseconsistency),
      perspectivecorrection: Boolean(presetToLoad.locks.perspectivecorrection),
      identitylock: Boolean(presetToLoad.locks.identitylock),
      referencepriority: Boolean(presetToLoad.locks.referencepriority),
      facialconsistency: Boolean(presetToLoad.locks.facialconsistency),
    };

    onChange(fullLocks);
    setActivePresetId(presetToLoad.id);
    setSelectedDropdownPresetId(presetToLoad.id);
    showNotice(`${t.presetLoadedNotice} (${presetToLoad.name})`);
  };

  // Load from dropdown button
  const handleLoadSelectedPreset = () => {
    if (selectedDropdownPreset) {
      applyPreset(selectedDropdownPreset);
    }
  };

  // Update active preset with current toggle states
  const handleUpdateActivePreset = () => {
    if (!activePreset) return;
    const updatedPresets = presets.map((p) => {
      if (p.id === activePreset.id) {
        return {
          ...p,
          locks: { ...locks },
          updatedAt: Date.now(),
        };
      }
      return p;
    });
    setPresets(updatedPresets);
    showNotice(`${t.presetSavedNotice} (${activePreset.name})`);
  };

  // Save As New Preset (Manual user creation)
  const handleSaveAsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newPresetName.trim();
    if (!trimmedName) return;

    const newPreset: CharacterLockPreset = {
      id: `preset-custom-${Date.now()}`,
      name: trimmedName,
      description: newPresetDesc.trim() || undefined,
      isBuiltIn: false,
      locks: { ...locks },
      updatedAt: Date.now(),
    };

    setPresets((prev) => [...prev, newPreset]);
    setActivePresetId(newPreset.id);
    setSelectedDropdownPresetId(newPreset.id);
    setNewPresetName('');
    setNewPresetDesc('');
    setIsSaveAsModalOpen(false);
    showNotice(`${t.presetSavedNotice} (${newPreset.name})`);
  };

  // Duplicate a preset
  const handleDuplicatePreset = (presetToDup: CharacterLockPreset) => {
    const duplicated: CharacterLockPreset = {
      id: `preset-custom-${Date.now()}`,
      name: `${presetToDup.name} (${t.btnDuplicatePreset})`,
      description: presetToDup.description,
      isBuiltIn: false,
      locks: { ...presetToDup.locks },
      updatedAt: Date.now(),
    };

    setPresets((prev) => [...prev, duplicated]);
    showNotice(`${t.presetSavedNotice} (${duplicated.name})`);
  };

  // Delete a user preset
  const handleDeletePreset = (presetToDelete: CharacterLockPreset) => {
    const confirmed = window.confirm(t.confirmDeletePreset);
    if (!confirmed) return;

    const nextPresets = presets.filter((p) => p.id !== presetToDelete.id);
    setPresets(nextPresets);

    if (activePresetId === presetToDelete.id) {
      const fallbackId = nextPresets[0]?.id || null;
      setActivePresetId(fallbackId);
      setSelectedDropdownPresetId(fallbackId || '');
    }
    showNotice(t.presetDeletedNotice);
  };

  // Start editing a preset in manage modal
  const startEditing = (preset: CharacterLockPreset) => {
    setEditingPresetId(preset.id);
    setEditName(preset.name);
    setEditDesc(preset.description || '');
  };

  // Save edited name/description
  const saveEditing = () => {
    if (!editingPresetId || !editName.trim()) return;
    setPresets((prev) =>
      prev.map((p) =>
        p.id === editingPresetId
          ? {
              ...p,
              name: editName.trim(),
              description: editDesc.trim() || undefined,
              updatedAt: Date.now(),
            }
          : p
      )
    );
    setEditingPresetId(null);
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
  const countActiveInPreset = (p: CharacterLockPreset) => Object.values(p.locks).filter(Boolean).length;

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
            {/* Active Preset Pill in Header (Only shown when a preset is loaded) */}
            {activePreset && (
              <span
                className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition ${
                  isConfigClean
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                    : 'bg-amber-950/40 text-amber-300 border-amber-800/60'
                }`}
                title={isConfigClean ? t.presetSavedStatus : t.presetModifiedStatus}
              >
                <Bookmark className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[130px]">{activePreset.name}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isConfigClean ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                  }`}
                />
              </span>
            )}
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
          {/* Toast Notification Banner */}
          {noticeMessage && (
            <div className="bg-rose-950/40 border border-rose-600/40 text-rose-200 text-xs px-3 py-2 rounded-xl flex items-center justify-between animate-fadeIn">
              <span className="font-medium">{noticeMessage}</span>
              <button
                type="button"
                onClick={() => setNoticeMessage(null)}
                className="text-rose-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* PRESET TOOLBAR */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-3">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Left: Dropdown & Status Indicator */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 min-w-0">
                <div className="flex items-center gap-1.5 shrink-0 text-xs font-semibold text-slate-300">
                  <Bookmark className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t.presetActiveLabel}</span>
                </div>

                {/* Preset Dropdown */}
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <select
                    value={selectedDropdownPresetId}
                    onChange={(e) => setSelectedDropdownPresetId(e.target.value)}
                    disabled={presets.length === 0}
                    className={`w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-rose-500 hover:border-slate-600 transition truncate ${
                      presets.length === 0 ? 'opacity-60 cursor-not-allowed text-slate-400' : 'cursor-pointer'
                    }`}
                  >
                    {presets.length === 0 ? (
                      <option value="">{t.emptyPresetsTitle}</option>
                    ) : (
                      presets.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Status Indicator Badge (Only shown when active preset exists) */}
                {activePreset && (
                  <div className="shrink-0 flex items-center">
                    {isConfigClean ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{t.presetSavedStatus}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/50 text-amber-300 border border-amber-800/60 shadow-sm">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                        <span>{t.presetModifiedStatus}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                {/* Muat Preset */}
                <button
                  type="button"
                  onClick={handleLoadSelectedPreset}
                  disabled={!selectedDropdownPreset}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition active:scale-95 shadow-sm ${
                    selectedDropdownPreset
                      ? 'text-rose-300 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 hover:border-rose-500/50'
                      : 'text-slate-500 bg-slate-900 border border-slate-800 opacity-50 cursor-not-allowed'
                  }`}
                  title={selectedDropdownPreset ? 'Terapkan seluruh konfigurasi preset terpilih ke toggle lock' : 'Pilih atau buat preset terlebih dahulu'}
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>{t.btnLoadPreset}</span>
                </button>

                {/* Simpan Preset (Update Active) */}
                <button
                  type="button"
                  onClick={handleUpdateActivePreset}
                  disabled={!activePreset}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition active:scale-95 shadow-sm ${
                    activePreset
                      ? 'text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600'
                      : 'text-slate-500 bg-slate-900 border border-slate-800 opacity-50 cursor-not-allowed'
                  }`}
                  title={activePreset ? 'Perbarui preset aktif dengan kombinasi toggle saat ini' : 'Muat preset terlebih dahulu untuk memperbaruinya'}
                >
                  <Save className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.btnSavePreset}</span>
                </button>

                {/* Simpan Sebagai... (Always enabled) */}
                <button
                  type="button"
                  onClick={() => setIsSaveAsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg transition active:scale-95 shadow-sm"
                  title="Simpan konfigurasi saat ini sebagai preset kustom baru"
                >
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.btnSaveAsPreset}</span>
                </button>

                {/* Kelola Preset (Always enabled) */}
                <button
                  type="button"
                  onClick={() => setIsManageModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg transition active:scale-95 shadow-sm"
                  title="Buka daftar lengkap dan kelola preset"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.btnManagePresets}</span>
                </button>
              </div>
            </div>

            {/* Sub-bar: Active Preset Description & Summary OR Empty Helper */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
              {selectedDropdownPreset ? (
                <>
                  <span className="italic leading-relaxed">
                    {selectedDropdownPreset.description || t.presetDescPlaceholder}
                  </span>
                  <span className="text-slate-400 font-semibold shrink-0">
                    {countActiveInPreset(selectedDropdownPreset)}/14 {t.activeLocksSummary}
                  </span>
                </>
              ) : (
                <span className="italic text-slate-400 leading-relaxed">
                  {t.emptyPresetsToolbarHint}
                </span>
              )}
            </div>
          </div>

          {/* Quick Lock Helpers (Mobile & Secondary) */}
          <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
            <div className="flex lg:hidden items-center gap-2 flex-wrap">
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

      {/* MODAL: SIMPAN SEBAGAI PRESET BARU */}
      {isSaveAsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-semibold text-white">{t.modalSavePresetTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSaveAsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.presetNameLabel} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder={t.presetNamePlaceholder}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.presetDescLabel}
                </label>
                <textarea
                  rows={2}
                  value={newPresetDesc}
                  onChange={(e) => setNewPresetDesc(e.target.value)}
                  placeholder={t.presetDescPlaceholder}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
                />
              </div>

              <div className="bg-slate-950/80 rounded-lg p-2.5 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Konfigurasi saat ini:</span>
                <span className="font-semibold text-rose-400">
                  {activeCount}/14 {t.activeLocksSummary}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSaveAsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition shadow-sm active:scale-95"
                >
                  {t.btnSavePreset}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KELOLA PRESET */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">{t.modalManagePresetsTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsManageModalOpen(false);
                  setEditingPresetId(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets List or Empty State */}
            <div className="overflow-y-auto py-3 space-y-3 flex-1 pr-1">
              {presets.length === 0 ? (
                /* Informative Empty State */
                <div className="py-10 px-4 text-center space-y-3 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <Bookmark className="w-6 h-6 text-rose-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">
                    {t.emptyPresetsTitle}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {t.emptyPresetsDesc}
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsManageModalOpen(false);
                        setIsSaveAsModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition shadow-sm active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t.btnCreateNewPreset}</span>
                    </button>
                  </div>
                </div>
              ) : (
                presets.map((preset) => {
                  const isPresetActive = preset.id === activePresetId;
                  const isEditingThis = editingPresetId === preset.id;
                  const lockCount = countActiveInPreset(preset);

                  return (
                    <div
                      key={preset.id}
                      className={`p-3.5 rounded-xl border transition ${
                        isPresetActive
                          ? 'bg-rose-950/20 border-rose-500/40'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isEditingThis ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                              {t.presetNameLabel}
                            </label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                              {t.presetDescLabel}
                            </label>
                            <input
                              type="text"
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingPresetId(null)}
                              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 rounded"
                            >
                              {t.btnCancel}
                            </button>
                            <button
                              type="button"
                              onClick={saveEditing}
                              className="px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded"
                            >
                              {t.btnSavePreset}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-white truncate">{preset.name}</span>
                              {isPresetActive && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-semibold">
                                  {t.presetActiveLabel}
                                </span>
                              )}
                              <span className="text-[11px] text-slate-400 font-mono">
                                ({lockCount}/14 {t.activeLocksSummary})
                              </span>
                            </div>
                            {preset.description && (
                              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                                {preset.description}
                              </p>
                            )}
                          </div>

                          {/* Actions for this user preset */}
                          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                            {/* Muat */}
                            <button
                              type="button"
                              onClick={() => {
                                applyPreset(preset);
                                setIsManageModalOpen(false);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-300 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg transition"
                              title="Terapkan preset ini sekarang"
                            >
                              <FolderOpen className="w-3 h-3" />
                              <span>{t.btnLoadPreset}</span>
                            </button>

                            {/* Duplikasi */}
                            <button
                              type="button"
                              onClick={() => handleDuplicatePreset(preset)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
                              title="Duplikasi preset ini"
                            >
                              <Copy className="w-3 h-3 text-cyan-400" />
                              <span>{t.btnDuplicatePreset}</span>
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => startEditing(preset)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
                              title="Edit nama dan deskripsi"
                            >
                              <Edit3 className="w-3 h-3 text-amber-400" />
                            </button>

                            {/* Hapus */}
                            <button
                              type="button"
                              onClick={() => handleDeletePreset(preset)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/40 rounded-lg transition"
                              title="Hapus preset ini"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsManageModalOpen(false);
                  setIsSaveAsModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.btnCreateNewPreset}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsManageModalOpen(false)}
                className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
              >
                {t.dismissBtn || 'Tutup'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
