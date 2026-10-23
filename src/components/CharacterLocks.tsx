import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  ShieldCheck,
  UserCheck,
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
  AlertCircle,
  Copy,
  Trash2,
  Edit3,
  X,
  Download,
  Upload,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import {
  CharacterLocksState,
  DEFAULT_CHARACTER_LOCKS,
  CharacterLockPreset,
  CustomCharacterLock,
} from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext';
import {
  CHARACTER_LOCKS_CONFIG,
  STORAGE_KEY_CHARACTER_LOCK_PRESETS,
  STORAGE_KEY_ACTIVE_LOCK_PRESET_ID,
  LEGACY_BUILTIN_PRESET_IDS,
  areLocksEqual,
  filterOutLegacyBuiltinPresets,
  loadCustomLocksFromStorage,
  saveCustomLocksToStorage,
  validateCustomLock,
  exportCustomLocksToJson,
  validateImportJson,
  normalizeShorthand,
  ImportValidationResult,
} from '../data/characterLocks.ts';

// Storage reference: STORAGE_KEY_CUSTOM_CHARACTER_LOCKS
interface CharacterLocksProps {
  locks: CharacterLocksState;
  onChange: (val: CharacterLocksState) => void;
  customLocks?: CustomCharacterLock[];
  onCustomLocksChange?: (val: CustomCharacterLock[]) => void;
}

export const CharacterLocks: React.FC<CharacterLocksProps> = ({
  locks,
  onChange,
  customLocks: propsCustomLocks,
  onCustomLocksChange: propsOnCustomLocksChange,
}) => {
  const { t } = useLanguage();
  // Section collapsed/expanded state (Default: HIDE)
  const [isExpanded, setIsExpanded] = useState(false);

  // Custom Character Locks local fallback state if not supplied by parent
  const [internalCustomLocks, setInternalCustomLocks] = useState<CustomCharacterLock[]>(() =>
    loadCustomLocksFromStorage()
  );

  const customLocks = propsCustomLocks ?? internalCustomLocks;

  const updateCustomLocks = (newLocks: CustomCharacterLock[]) => {
    if (propsOnCustomLocksChange) {
      propsOnCustomLocksChange(newLocks);
    } else {
      setInternalCustomLocks(newLocks);
    }
    saveCustomLocksToStorage(newLocks);
  };

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
            customLockStates: item.customLockStates || {},
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

  // Modals state: Presets
  const [isSaveAsModalOpen, setIsSaveAsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');

  // Editing in Manage modal
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Modals state: Custom Character Locks
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingLock, setEditingLock] = useState<CustomCharacterLock | null>(null);
  const [lockFormName, setLockFormName] = useState('');
  const [lockFormShorthand, setLockFormShorthand] = useState('');
  const [lockFormDesc, setLockFormDesc] = useState('');
  const [lockFormInstruction, setLockFormInstruction] = useState('');
  const [lockFormEnabled, setLockFormEnabled] = useState(true);
  const [lockFormError, setLockFormError] = useState<string | null>(null);

  // Delete Custom Lock Modal
  const [deletingLock, setDeletingLock] = useState<CustomCharacterLock | null>(null);

  // Import Custom Locks Modal & File Input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importValidation, setImportValidation] = useState<ImportValidationResult | null>(null);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [importFileName, setImportFileName] = useState('');

  // Transient feedback notice
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => {
      setNoticeMessage(null);
    }, 3200);
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

  // Reset Default resets ONLY built-in locks (11 ON, 3 OFF) and strictly does not touch custom locks
  const handleResetDefault = () => {
    onChange({ ...DEFAULT_CHARACTER_LOCKS });
  };

  // Load a preset by ID and apply all 14 locks explicitly + custom lock states if present
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

    // Apply custom lock enabled states safely if recorded in preset
    if (presetToLoad.customLockStates) {
      const nextCustom = customLocks.map((cl) => {
        if (presetToLoad.customLockStates?.[cl.id] !== undefined) {
          return { ...cl, enabled: Boolean(presetToLoad.customLockStates[cl.id]) };
        }
        return cl;
      });
      updateCustomLocks(nextCustom);
    }

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
    const customLockStates: Record<string, boolean> = {};
    customLocks.forEach((cl) => {
      customLockStates[cl.id] = cl.enabled;
    });

    const updatedPresets = presets.map((p) => {
      if (p.id === activePreset.id) {
        return {
          ...p,
          locks: { ...locks },
          customLockStates,
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

    const customLockStates: Record<string, boolean> = {};
    customLocks.forEach((cl) => {
      customLockStates[cl.id] = cl.enabled;
    });

    const newPreset: CharacterLockPreset = {
      id: `preset-custom-${Date.now()}`,
      name: trimmedName,
      description: newPresetDesc.trim() || undefined,
      isBuiltIn: false,
      locks: { ...locks },
      customLockStates,
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
      customLockStates: presetToDup.customLockStates ? { ...presetToDup.customLockStates } : undefined,
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

  /* ========================================================================
   * CUSTOM CHARACTER LOCKS HANDLERS
   * ======================================================================== */

  const handleOpenAddModal = () => {
    setEditingLock(null);
    setLockFormName('');
    setLockFormShorthand('/');
    setLockFormDesc('');
    setLockFormInstruction('');
    setLockFormEnabled(true);
    setLockFormError(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (lock: CustomCharacterLock) => {
    setEditingLock(lock);
    setLockFormName(lock.name);
    setLockFormShorthand(lock.shorthand);
    setLockFormDesc(lock.description || '');
    setLockFormInstruction(lock.instruction);
    setLockFormEnabled(lock.enabled);
    setLockFormError(null);
    setIsAddEditModalOpen(true);
  };

  const handleSaveCustomLock = (e: React.FormEvent) => {
    e.preventDefault();
    setLockFormError(null);

    const validation = validateCustomLock(
      {
        name: lockFormName,
        shorthand: lockFormShorthand,
        instruction: lockFormInstruction,
        id: editingLock?.id,
      },
      customLocks,
      editingLock?.id
    );

    if (!validation.valid) {
      setLockFormError(validation.error || 'Input tidak valid.');
      return;
    }

    if (editingLock) {
      // Edit existing lock (preserving unique ID and createdAt)
      const updated = customLocks.map((l) =>
        l.id === editingLock.id
          ? {
              ...l,
              name: lockFormName.trim(),
              shorthand: lockFormShorthand.trim(),
              description: lockFormDesc.trim(),
              instruction: lockFormInstruction.trim(),
              enabled: lockFormEnabled,
              updatedAt: Date.now(),
            }
          : l
      );
      updateCustomLocks(updated);
      showNotice(t.customLockSavedNotice);
    } else {
      // Create new custom lock
      const newLock: CustomCharacterLock = {
        id: `custom-lock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: lockFormName.trim(),
        shorthand: lockFormShorthand.trim(),
        description: lockFormDesc.trim(),
        instruction: lockFormInstruction.trim(),
        enabled: lockFormEnabled,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      updateCustomLocks([...customLocks, newLock]);
      showNotice(t.customLockSavedNotice);
    }

    setIsAddEditModalOpen(false);
    setEditingLock(null);
  };

  const handleToggleCustomLock = (id: string) => {
    const updated = customLocks.map((l) =>
      l.id === id ? { ...l, enabled: !l.enabled } : l
    );
    updateCustomLocks(updated);
  };

  const handleDeleteLockConfirm = () => {
    if (!deletingLock) return;
    const filtered = customLocks.filter((l) => l.id !== deletingLock.id);
    updateCustomLocks(filtered);
    setDeletingLock(null);
    showNotice(t.customLockDeletedNotice);
  };

  const handleExportCustomLocks = () => {
    if (customLocks.length === 0) {
      showNotice(t.exportNoDataMsg);
      return;
    }
    try {
      const jsonStr = exportCustomLocksToJson(customLocks);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mature-prompt-custom-character-locks.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotice(t.exportSuccessMsg);
    } catch {
      showNotice('Gagal mengekspor data.');
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const result = validateImportJson(text, customLocks);
      setImportValidation(result);
      setImportMode('append');
      setIsImportModalOpen(true);
    };
    reader.onerror = () => {
      showNotice('Gagal membaca berkas impor.');
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!importValidation || !importValidation.validEntries.length) return;

    try {
      if (importMode === 'replace') {
        // Mode B: Replace all custom locks with imported entries
        updateCustomLocks(importValidation.validEntries);
        showNotice(t.importSuccessReplaceMsg);
      } else {
        // Mode A: Append / Merge
        const existingMap = new Map(customLocks.map((l) => [l.id, l]));
        const existingShorthandMap = new Map(
          customLocks.map((l) => [normalizeShorthand(l.shorthand), l])
        );

        const merged = [...customLocks];

        for (const incoming of importValidation.validEntries) {
          const existingById = existingMap.get(incoming.id);
          const normShort = normalizeShorthand(incoming.shorthand);
          const existingByShort = existingShorthandMap.get(normShort);

          if (existingById) {
            // Update the existing entry with matching ID
            const idx = merged.findIndex((m) => m.id === incoming.id);
            if (idx !== -1) {
              merged[idx] = { ...incoming };
            }
          } else if (existingByShort) {
            // Shorthand conflict with a different ID: skip to prevent duplicate collision
            continue;
          } else {
            // Append brand new entry
            merged.push({ ...incoming });
            existingMap.set(incoming.id, incoming);
            existingShorthandMap.set(normShort, incoming);
          }
        }

        updateCustomLocks(merged);
        showNotice(t.importSuccessAppendMsg);
      }
    } catch {
      showNotice(t.importFailedMsg);
    }

    setIsImportModalOpen(false);
    setImportValidation(null);
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
        return <Compass className="w-3.5 h-3.5 text-blue-400" />;
      case 'perspectivecorrection':
        return <Eye className="w-3.5 h-3.5 text-purple-400" />;
      case 'identitylock':
        return <UserCheck className="w-3.5 h-3.5 text-cyan-400" />;
      case 'referencepriority':
        return <Sparkles className="w-3.5 h-3.5 text-amber-300" />;
      case 'facialconsistency':
        return <Lock className="w-3.5 h-3.5 text-rose-300" />;
      default:
        return <Lock className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  const activeCount = Object.values(locks).filter(Boolean).length;
  const activeCustomCount = customLocks.filter((l) => l.enabled).length;

  const countActiveInPreset = (p: CharacterLockPreset): number => {
    if (!p.locks) return 0;
    return Object.values(p.locks).filter(Boolean).length;
  };

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
      {/* Hidden file input for importing custom locks */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json,application/json"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Header with Accordion Toggle & Quick Stats */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between gap-3 cursor-pointer select-none group"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Lock className="w-4 h-4 text-rose-400 shrink-0" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              {t.characterLocksTitle}
            </h2>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60 shrink-0">
              {activeCount}/14 {t.activeLocksCount}
              {activeCustomCount > 0 && ` + ${activeCustomCount} Custom`}
            </span>
            {activePreset && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                <Bookmark className="w-3 h-3 text-rose-400" />
                <span className="font-medium truncate max-w-[140px]">{activePreset.name}</span>
                <span
                  title={isConfigClean ? t.presetSavedStatus : t.presetModifiedStatus}
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
                          {p.name} ({countActiveInPreset(p)}/14)
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Action: Muat Preset */}
                <button
                  type="button"
                  onClick={handleLoadSelectedPreset}
                  disabled={!selectedDropdownPreset || selectedDropdownPreset.id === activePresetId}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition active:scale-95 shrink-0 shadow-sm ${
                    selectedDropdownPreset && selectedDropdownPreset.id !== activePresetId
                      ? 'text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/70 hover:border-rose-600 cursor-pointer'
                      : 'text-slate-500 bg-slate-900 border border-slate-800 opacity-60 cursor-not-allowed'
                  }`}
                  title={t.btnLoadPreset}
                >
                  <FolderOpen className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t.btnLoadPreset}</span>
                </button>
              </div>

              {/* Right: Manage Actions (Simpan, Simpan Sebagai, Kelola) */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
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
                  title={
                    activePreset
                      ? 'Perbarui preset aktif dengan kombinasi toggle saat ini'
                      : 'Muat preset terlebih dahulu untuk memperbaruinya'
                  }
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

          {/* Built-in Locks Grid */}
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
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {getLockIcon(item.key)}
                        <span className="font-semibold text-xs text-white truncate">
                          {item.name}
                        </span>
                      </div>
                      <div
                        className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                          isActive ? 'bg-rose-600' : 'bg-slate-800'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                            isActive ? 'translate-x-3.5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="mb-2">
                      <span className="inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-rose-300">
                        {item.tag}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================================================================
           * CUSTOM CHARACTER LOCKS AREA
           * ================================================================ */}
          <div className="pt-3 border-t border-slate-800/80 space-y-3">
            {/* Custom Locks Header & Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 p-3 sm:p-4 rounded-xl border border-slate-800">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                    {t.customLocksTitle}
                  </h3>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/60">
                    {customLocks.length} Lock ({activeCustomCount} {t.lockStatusActive})
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t.customLocksSubtitle}
                </p>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg transition shadow-sm active:scale-95"
                  title="Buat Custom Lock baru"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.btnAddCustomLock}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCustomLocks}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition active:scale-95"
                  title="Ekspor seluruh custom locks ke file JSON"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">{t.btnExportCustomLocks}</span>
                  <span className="sm:hidden">Export</span>
                </button>

                <button
                  type="button"
                  onClick={handleTriggerFileInput}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition active:scale-95"
                  title="Impor custom locks dari file JSON"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{t.btnImportCustomLocks}</span>
                  <span className="sm:hidden">Import</span>
                </button>
              </div>
            </div>

            {/* Custom Locks Grid or Empty State */}
            {customLocks.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-center space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h4 className="text-xs font-bold text-white">{t.emptyCustomLocksTitle}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {t.emptyCustomLocksDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition shadow-sm active:scale-95 mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.btnCreateFirstCustomLock}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 items-stretch">
                {customLocks.map((cl) => {
                  return (
                    <div
                      key={cl.id}
                      className={`p-3.5 rounded-xl border transition select-none flex flex-col justify-between h-full ${
                        cl.enabled
                          ? 'bg-amber-950/20 border-amber-500/50 shadow-sm shadow-amber-950/20'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        {/* Top Row: Name & Toggle Switch */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Layers className={`w-3.5 h-3.5 shrink-0 ${cl.enabled ? 'text-amber-400' : 'text-slate-500'}`} />
                            <span className="font-semibold text-xs text-white truncate">
                              {cl.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleCustomLock(cl.id)}
                            className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                              cl.enabled ? 'bg-amber-500' : 'bg-slate-800'
                            }`}
                            title={cl.enabled ? 'Nonaktifkan lock' : 'Aktifkan lock'}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                                cl.enabled ? 'translate-x-3.5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Shorthand Tag Badge */}
                        <div className="mb-2">
                          <span className="inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                            {cl.shorthand}
                          </span>
                        </div>

                        {/* Description (if any) */}
                        {cl.description && (
                          <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                            {cl.description}
                          </p>
                        )}

                        {/* Instruction snippet */}
                        <div className="bg-slate-900/60 rounded-lg p-2 border border-slate-800/80 text-[10px] text-slate-300 font-mono line-clamp-3 mb-2">
                          {cl.instruction}
                        </div>
                      </div>

                      {/* Card Footer: Status & Action Buttons */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60 mt-1">
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                            cl.enabled
                              ? 'text-amber-400 bg-amber-950/40'
                              : 'text-slate-500 bg-slate-900'
                          }`}
                        >
                          {cl.enabled ? t.lockStatusActive : t.lockStatusInactive}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(cl)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
                            title="Edit Custom Lock"
                          >
                            <Edit3 className="w-3 h-3 text-amber-400" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingLock(cl)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/60 transition"
                            title="Hapus Custom Lock"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ====================================================================
       * MODAL: ADD / EDIT CUSTOM CHARACTER LOCK
       * ==================================================================== */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">
                  {editingLock ? t.modalEditCustomLockTitle : t.modalAddCustomLockTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddEditModalOpen(false);
                  setEditingLock(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {lockFormError && (
              <div className="bg-rose-950/50 border border-rose-500/50 rounded-xl p-3 flex items-start gap-2 text-rose-200 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{lockFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCustomLock} className="space-y-3.5">
              {/* Field A: Lock Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.lockNameLabel} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lockFormName}
                  onChange={(e) => setLockFormName(e.target.value)}
                  placeholder={t.lockNamePlaceholder}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Field B: Shorthand */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.lockShorthandLabel} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lockFormShorthand}
                  onChange={(e) => setLockFormShorthand(e.target.value)}
                  placeholder={t.lockShorthandPlaceholder}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  {t.lockShorthandHint}
                </p>
              </div>

              {/* Field C: Description (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.lockDescLabel}
                </label>
                <input
                  type="text"
                  value={lockFormDesc}
                  onChange={(e) => setLockFormDesc(e.target.value)}
                  placeholder={t.lockDescPlaceholder}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Field D: Lock Instruction (Prompt Directive) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.lockInstructionLabel} <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={lockFormInstruction}
                  onChange={(e) => setLockFormInstruction(e.target.value)}
                  placeholder={t.lockInstructionPlaceholder}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none font-mono leading-relaxed"
                />
              </div>

              {/* Field E: Status Toggle */}
              <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-xs font-medium text-slate-300">{t.lockStatusLabel}:</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${lockFormEnabled ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}>
                    {lockFormEnabled ? t.lockStatusActive : t.lockStatusInactive}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLockFormEnabled(!lockFormEnabled)}
                    className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                      lockFormEnabled ? 'bg-amber-500' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                        lockFormEnabled ? 'translate-x-3.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddEditModalOpen(false);
                    setEditingLock(null);
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition"
                >
                  {t.btnCancelLock}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition shadow-sm active:scale-95"
                >
                  {t.btnSaveLock}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
       * MODAL: DELETE CONFIRMATION
       * ==================================================================== */}
      {deletingLock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t.modalDeleteCustomLockTitle}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{deletingLock.name} ({deletingLock.shorthand})</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t.confirmDeleteCustomLockDesc}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingLock(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition"
              >
                {t.btnCancelLock}
              </button>
              <button
                type="button"
                onClick={handleDeleteLockConfirm}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition shadow-sm active:scale-95"
              >
                {t.btnConfirmDeleteLock}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
       * MODAL: IMPORT CUSTOM CHARACTER LOCKS
       * ==================================================================== */}
      {isImportModalOpen && importValidation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">{t.modalImportCustomLocksTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportValidation(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Preview Area */}
            <div className="overflow-y-auto space-y-3.5 pr-1 flex-1">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Berkas:</span>
                  <span className="text-white font-mono font-medium">{importFileName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t.importValidCount}</span>
                  <span className="text-emerald-400 font-bold">{importValidation.validEntries.length}</span>
                </div>
                {importValidation.invalidEntriesCount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t.importInvalidCount}</span>
                    <span className="text-rose-400 font-bold">{importValidation.invalidEntriesCount}</span>
                  </div>
                )}
                {importValidation.conflicts.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t.importConflictsCount}</span>
                    <span className="text-amber-400 font-bold">{importValidation.conflicts.length}</span>
                  </div>
                )}
              </div>

              {/* Errors list if any */}
              {importValidation.errors.length > 0 && (
                <div className="bg-rose-950/30 border border-rose-600/40 rounded-xl p-3 space-y-1.5 text-xs text-rose-300">
                  <div className="flex items-center gap-1.5 font-semibold text-rose-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Kesalahan yang Ditemukan:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    {importValidation.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Conflicts list if any */}
              {importValidation.conflicts.length > 0 && (
                <div className="bg-amber-950/30 border border-amber-600/40 rounded-xl p-3 space-y-1.5 text-xs text-amber-300">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Detail Konflik:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    {importValidation.conflicts.map((c, i) => (
                      <li key={i}>{c.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Valid Entries Preview */}
              {importValidation.validEntries.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 mb-2">Daftar Lock Valid:</h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {importValidation.validEntries.map((l) => (
                      <div
                        key={l.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs"
                      >
                        <span className="text-white font-medium">{l.name}</span>
                        <span className="font-mono text-[10px] text-amber-300 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {l.shorthand}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Import Mode Selection */}
              {importValidation.validEntries.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-300">{t.importModeTitle}</h4>

                  {/* Mode A: Append */}
                  <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/40 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="mt-0.5 accent-amber-500"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">{t.importModeAppend}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{t.importModeAppendDesc}</div>
                    </div>
                  </label>

                  {/* Mode B: Replace */}
                  <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-rose-900/40 hover:border-rose-700/60 bg-rose-950/10 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-0.5 accent-rose-500"
                    />
                    <div>
                      <div className="text-xs font-semibold text-rose-300">{t.importModeReplace}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{t.importModeReplaceDesc}</div>
                      {importMode === 'replace' && (
                        <div className="mt-1.5 text-[10px] font-semibold text-rose-400 bg-rose-950/60 p-1.5 rounded border border-rose-800/60">
                          {t.importModeReplaceWarning}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportValidation(null);
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition"
              >
                {t.btnCancelLock}
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={!importValidation.validEntries.length}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition shadow-sm active:scale-95 ${
                  importValidation.validEntries.length
                    ? importMode === 'replace'
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {t.btnConfirmImport}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
       * MODAL: SIMPAN SEBAGAI PRESET BARU
       * ==================================================================== */}
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

      {/* ====================================================================
       * MODAL: KELOLA PRESET
       * ==================================================================== */}
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

            {/* Presets List */}
            <div className="overflow-y-auto py-3 space-y-2.5 flex-1 pr-1">
              {presets.length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-rose-400">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div className="max-w-sm mx-auto space-y-1">
                    <h4 className="text-xs font-bold text-white">{t.emptyPresetsTitle}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {t.emptyPresetsDesc}
                    </p>
                  </div>
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
