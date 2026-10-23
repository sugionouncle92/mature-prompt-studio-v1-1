import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Check,
  Sparkles,
  X,
  RotateCcw,
  Search,
  ChevronDown,
  Plus,
  Download,
  Upload,
  Edit2,
  Trash2,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import {
  PHOTOGRAPHIC_STYLES,
  DEFAULT_PHOTOGRAPHIC_STYLES,
  loadCustomPhotographicStylesFromStorage,
  saveCustomPhotographicStylesToStorage,
  validateCustomPhotographicStyle,
  exportCustomPhotographicStylesToJson,
  validateImportPhotographicStylesJson,
  ImportPhotographicStylesValidationResult,
} from '../data/photographicStyles.ts';

// Storage reference: STORAGE_KEY_CUSTOM_PHOTOGRAPHIC_STYLES
import { PhotographicStyleSelection, CustomPhotographicStyle } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext';

interface PhotographicStyleSelectorProps {
  selection: PhotographicStyleSelection;
  onChange: (val: PhotographicStyleSelection) => void;
  customStyles?: CustomPhotographicStyle[];
  onCustomStylesChange?: (val: CustomPhotographicStyle[]) => void;
}

export const PhotographicStyleSelector: React.FC<PhotographicStyleSelectorProps> = ({
  selection,
  onChange,
  customStyles: propsCustomStyles,
  onCustomStylesChange: propsOnCustomStylesChange,
}) => {
  const { t } = useLanguage();
  // Section collapsed/expanded state (Default: HIDE)
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Custom Photographic Styles local fallback state if not supplied by parent
  const [internalCustomStyles, setInternalCustomStyles] = useState<CustomPhotographicStyle[]>(() =>
    loadCustomPhotographicStylesFromStorage()
  );

  const customStyles = propsCustomStyles ?? internalCustomStyles;

  const updateCustomStyles = (newStyles: CustomPhotographicStyle[]) => {
    if (propsOnCustomStylesChange) {
      propsOnCustomStylesChange(newStyles);
    } else {
      setInternalCustomStyles(newStyles);
    }
    saveCustomPhotographicStylesToStorage(newStyles);
  };

  // Toast / ephemeral notice state
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showNotice = (msg: string) => {
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    setNotice(msg);
    noticeTimerRef.current = setTimeout(() => {
      setNotice(null);
    }, 3200);
  };

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    };
  }, []);

  // Modal States: Add/Edit Custom Style
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingStyle, setEditingStyle] = useState<CustomPhotographicStyle | null>(null);
  const [styleFormName, setStyleFormName] = useState('');
  const [styleFormDesc, setStyleFormDesc] = useState('');
  const [styleFormDirective, setStyleFormDirective] = useState('');
  const [styleFormEnabled, setStyleFormEnabled] = useState(true);
  const [styleFormError, setStyleFormError] = useState<string | null>(null);

  // Modal States: Delete Confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingStyle, setDeletingStyle] = useState<CustomPhotographicStyle | null>(null);

  // Modal States: Import
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importValidation, setImportValidation] = useState<ImportPhotographicStylesValidationResult | null>(null);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [importFileName, setImportFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Built-in style toggles
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

  // RESET DEFAULT: Strictly resets only built-in selections and custom text input.
  // NEVER touches customStyles and NEVER touches Character Locks.
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

  const activeCustomStyles = customStyles.filter((cs) => cs.enabled);
  const hasSelections =
    selection.selected.length > 0 || selection.custom.trim().length > 0 || activeCustomStyles.length > 0;

  // Custom Photographic Styles Handlers
  const handleOpenAddModal = () => {
    setEditingStyle(null);
    setStyleFormName('');
    setStyleFormDesc('');
    setStyleFormDirective('');
    setStyleFormEnabled(true);
    setStyleFormError(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (style: CustomPhotographicStyle) => {
    setEditingStyle(style);
    setStyleFormName(style.name);
    setStyleFormDesc(style.description || '');
    setStyleFormDirective(style.promptDirective);
    setStyleFormEnabled(style.enabled);
    setStyleFormError(null);
    setIsAddEditModalOpen(true);
  };

  const handleSaveStyleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStyleFormError(null);

    const validation = validateCustomPhotographicStyle(
      {
        name: styleFormName,
        description: styleFormDesc,
        promptDirective: styleFormDirective,
        id: editingStyle?.id,
      },
      customStyles,
      editingStyle?.id
    );

    if (!validation.valid) {
      setStyleFormError(validation.error || 'Input tidak valid.');
      return;
    }

    if (editingStyle) {
      // Edit existing style
      const updated = customStyles.map((s) =>
        s.id === editingStyle.id
          ? {
              ...s,
              name: styleFormName.trim(),
              description: styleFormDesc.trim() || undefined,
              promptDirective: styleFormDirective.trim(),
              enabled: styleFormEnabled,
              updatedAt: Date.now(),
            }
          : s
      );
      updateCustomStyles(updated);
      showNotice(t.customPhotoStyleSavedNotice);
    } else {
      // Create new custom style
      const newStyle: CustomPhotographicStyle = {
        id: `custom-photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: styleFormName.trim(),
        description: styleFormDesc.trim() || undefined,
        promptDirective: styleFormDirective.trim(),
        enabled: styleFormEnabled,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      updateCustomStyles([...customStyles, newStyle]);
      showNotice(t.customPhotoStyleSavedNotice);
    }

    setIsAddEditModalOpen(false);
    setEditingStyle(null);
  };

  const handleToggleCustomStyle = (id: string) => {
    const updated = customStyles.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    updateCustomStyles(updated);
  };

  const handleOpenDeleteModal = (style: CustomPhotographicStyle) => {
    setDeletingStyle(style);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteStyleConfirm = () => {
    if (!deletingStyle) return;
    const filtered = customStyles.filter((s) => s.id !== deletingStyle.id);
    updateCustomStyles(filtered);
    setIsDeleteModalOpen(false);
    setDeletingStyle(null);
    showNotice(t.customPhotoStyleDeletedNotice);
  };

  // Export Custom Photographic Styles
  const handleExportCustomPhotoStyles = () => {
    if (customStyles.length === 0) {
      showNotice(t.exportNoPhotoDataMsg);
      return;
    }

    try {
      const jsonContent = exportCustomPhotographicStylesToJson(customStyles);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mature-prompt-custom-photographic-styles-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotice(t.exportPhotoSuccessMsg);
    } catch {
      showNotice(t.exportNoPhotoDataMsg);
    }
  };

  // Import Custom Photographic Styles
  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const result = validateImportPhotographicStylesJson(text, customStyles);
      setImportValidation(result);
      setImportMode('append');
      setIsImportModalOpen(true);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!importValidation || !importValidation.validEntries.length) return;

    try {
      if (importMode === 'replace') {
        // Mode B: Replace all custom styles with imported valid entries
        updateCustomStyles(importValidation.validEntries);
        showNotice(t.importPhotoSuccessReplaceMsg);
      } else {
        // Mode A: Append / Merge
        const existingMap = new Map(customStyles.map((s) => [s.id, s]));
        const existingNameMap = new Map(
          customStyles.map((s) => [s.name.trim().toLowerCase(), s])
        );

        const merged = [...customStyles];

        for (const incoming of importValidation.validEntries) {
          const existingById = existingMap.get(incoming.id);
          const normName = incoming.name.trim().toLowerCase();
          const existingByName = existingNameMap.get(normName);

          if (existingById) {
            // Update existing entry with matching ID
            const idx = merged.findIndex((m) => m.id === incoming.id);
            if (idx !== -1) {
              merged[idx] = { ...incoming };
            }
          } else if (existingByName) {
            // Name conflict with a different ID: skip to prevent duplicate collision
            continue;
          } else {
            // Append brand new entry
            merged.push({ ...incoming });
            existingMap.set(incoming.id, incoming);
            existingNameMap.set(normName, incoming);
          }
        }

        updateCustomStyles(merged);
        showNotice(t.importPhotoSuccessAppendMsg);
      }
    } catch {
      showNotice(t.importPhotoFailedMsg);
    }

    setIsImportModalOpen(false);
    setImportValidation(null);
  };

  return (
    <section className={`bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm transition-all duration-200 relative ${isExpanded ? 'space-y-5' : ''}`}>
      {/* Toast Notice */}
      {notice && (
        <div className="absolute top-3 right-4 z-30 px-3.5 py-2 rounded-xl bg-cyan-950/95 border border-cyan-500/50 text-cyan-200 text-xs font-medium shadow-lg backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Hidden File Input for Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />

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
            {activeCustomStyles.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                {activeCustomStyles.length} Custom {t.activeStylesLabel || 'Aktif'}
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
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all active:scale-95 shadow-sm"
          >
            <span>{isExpanded ? (t.collapseSection || 'Tutup') : (t.expandSection || 'Buka')}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 ${
                isExpanded ? 'rotate-180 text-cyan-400' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Active Style Tags Bar */}
          {hasSelections && (
            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 items-center">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <Camera className="w-3 h-3 text-cyan-400" />
                Aktif:
              </span>

              {/* Built-in selected styles */}
              {selection.selected.map((styleName) => (
                <span
                  key={styleName}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-cyan-950/40 text-cyan-300 border border-cyan-800/40"
                >
                  <span>{styleName}</span>
                  <button
                    onClick={() => toggleStyle(styleName)}
                    className="hover:text-white ml-0.5"
                    title={`Hapus ${styleName}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {/* Active Custom Styles */}
              {activeCustomStyles.map((cs) => (
                <span
                  key={cs.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-purple-950/40 text-purple-300 border border-purple-800/40"
                >
                  <span>{cs.name}</span>
                  <button
                    onClick={() => handleToggleCustomStyle(cs.id)}
                    className="hover:text-white ml-0.5"
                    title={`Nonaktifkan ${cs.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {/* Custom Text Style */}
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

          {/* Built-in Style Grid */}
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

          {/* ========================================================================= */}
          {/* CUSTOM PHOTOGRAPHIC STYLES SECTION (STRICT INDEPENDENT SYSTEM)           */}
          {/* ========================================================================= */}
          <div className="pt-5 border-t border-slate-800/90 space-y-4">
            {/* Custom Photographic Styles Header & Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-white">
                    {t.customPhotoStylesTitle}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {activeCustomStyles.length} / {customStyles.length}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.customPhotoStylesSubtitle}
                </p>
              </div>

              {/* Action Buttons: Add, Export, Import */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition active:scale-95 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.btnAddCustomPhotoStyle}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCustomPhotoStyles}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition active:scale-95"
                  title="Ekspor seluruh custom photographic styles ke file JSON"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">{t.btnExportCustomPhotoStyles}</span>
                  <span className="sm:hidden">Export</span>
                </button>

                <button
                  type="button"
                  onClick={handleTriggerFileInput}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition active:scale-95"
                  title="Impor custom photographic styles dari file JSON"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{t.btnImportCustomPhotoStyles}</span>
                  <span className="sm:hidden">Import</span>
                </button>
              </div>
            </div>

            {/* Custom Styles Grid or Empty State */}
            {customStyles.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-center space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h4 className="text-xs font-bold text-white">{t.emptyCustomPhotoStylesTitle}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {t.emptyCustomPhotoStylesDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition shadow-sm active:scale-95 mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.btnCreateFirstCustomPhotoStyle}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 items-stretch">
                {customStyles.map((cs) => {
                  return (
                    <div
                      key={cs.id}
                      className={`p-3.5 rounded-xl border transition select-none flex flex-col justify-between h-full ${
                        cs.enabled
                          ? 'bg-cyan-950/20 border-cyan-500/50 shadow-sm shadow-cyan-950/20'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        {/* Top Row: Name & Toggle Switch */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Camera className={`w-3.5 h-3.5 shrink-0 ${cs.enabled ? 'text-cyan-400' : 'text-slate-500'}`} />
                            <span className="font-semibold text-xs text-white truncate" title={cs.name}>
                              {cs.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleCustomStyle(cs.id)}
                            className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                              cs.enabled ? 'bg-cyan-500' : 'bg-slate-800'
                            }`}
                            title={cs.enabled ? 'Nonaktifkan style' : 'Aktifkan style'}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                                cs.enabled ? 'translate-x-3.5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Description (if any) */}
                        {cs.description && (
                          <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                            {cs.description}
                          </p>
                        )}

                        {/* Directive snippet */}
                        <div className="bg-slate-900/60 rounded-lg p-2 border border-slate-800/80 text-[10px] text-slate-300 font-mono line-clamp-3 mb-2">
                          {cs.promptDirective}
                        </div>
                      </div>

                      {/* Card Footer: Status & Action Buttons */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60 mt-1">
                        <span
                          className={`text-[10px] font-medium ${
                            cs.enabled ? 'text-cyan-400' : 'text-slate-500'
                          }`}
                        >
                          {cs.enabled ? (t.activeStylesLabel || 'Aktif') : (t.photoStyleInactive || 'Nonaktif')}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(cs)}
                            className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition"
                            title="Edit Custom Style"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(cs)}
                            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                            title="Hapus Custom Style"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT CUSTOM PHOTOGRAPHIC STYLE                               */}
      {/* ========================================================================= */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">
                  {editingStyle ? t.modalEditCustomPhotoStyleTitle : t.modalAddCustomPhotoStyleTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {styleFormError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{styleFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveStyleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.photoStyleNameLabel} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={styleFormName}
                  onChange={(e) => setStyleFormName(e.target.value)}
                  placeholder={t.photoStyleNamePlaceholder}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.photoStyleDescLabel}
                </label>
                <input
                  type="text"
                  value={styleFormDesc}
                  onChange={(e) => setStyleFormDesc(e.target.value)}
                  placeholder={t.photoStyleDescPlaceholder}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.photoStyleDirectiveLabel} <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={styleFormDirective}
                  onChange={(e) => setStyleFormDirective(e.target.value)}
                  placeholder={t.photoStyleDirectivePlaceholder}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none transition font-mono leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-xs font-medium text-slate-300">{t.photoStyleStatusLabel}</span>
                  <p className="text-[11px] text-slate-500">
                    {styleFormEnabled ? t.photoStyleActive : t.photoStyleInactive}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStyleFormEnabled(!styleFormEnabled)}
                  className={`w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    styleFormEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      styleFormEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                >
                  {t.btnCancelPhotoStyle}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition shadow-sm active:scale-95"
                >
                  {t.btnSavePhotoStyle}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CONFIRMATION                                                */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && deletingStyle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {t.modalDeleteCustomPhotoStyleTitle}
                </h3>
                <p className="text-xs text-rose-300 font-medium mt-0.5">
                  &ldquo;{deletingStyle.name}&rdquo;
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {t.confirmDeleteCustomPhotoStyleDesc}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingStyle(null);
                }}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
              >
                {t.btnCancelPhotoStyle}
              </button>
              <button
                type="button"
                onClick={handleDeleteStyleConfirm}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition shadow-sm active:scale-95"
              >
                {t.btnConfirmDeletePhotoStyle}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: IMPORT CUSTOM PHOTOGRAPHIC STYLES                                  */}
      {/* ========================================================================= */}
      {isImportModalOpen && importValidation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">
                  {t.modalImportCustomPhotoStylesTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* File info */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
              <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">{importFileName}</span>
            </div>

            {/* Validation errors/warnings when no valid entries exist */}
            {importValidation.validEntries.length === 0 ? (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Berkas JSON tidak dapat diimpor:</span>
                </div>
                <ul className="text-xs text-rose-300/90 list-disc list-inside space-y-1">
                  {importValidation.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                {/* Stats summary */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-center">
                    <span className="text-lg font-bold text-emerald-300">
                      {importValidation.validEntries.length}
                    </span>
                    <p className="text-[10px] text-emerald-400 font-medium">Valid</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-center">
                    <span className="text-lg font-bold text-amber-300">
                      {importValidation.conflicts.length}
                    </span>
                    <p className="text-[10px] text-amber-400 font-medium">Konflik</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                    <span className="text-lg font-bold text-slate-300">
                      {importValidation.invalidEntriesCount}
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium">Tidak Valid</p>
                  </div>
                </div>

                {/* Errors list if any */}
                {importValidation.errors.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-600/40 space-y-1.5 text-xs text-rose-300">
                    <div className="flex items-center gap-1.5 font-semibold text-rose-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
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
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/40 space-y-1.5 text-xs text-amber-300">
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

                {/* Import Mode Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-200">
                    {t.importModeTitle}
                  </label>

                  <div
                    onClick={() => setImportMode('append')}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                      importMode === 'append'
                        ? 'bg-cyan-950/30 border-cyan-500/50'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                        importMode === 'append'
                          ? 'border-cyan-400 bg-cyan-400'
                          : 'border-slate-600'
                      }`}
                    >
                      {importMode === 'append' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">
                        {t.importModeAppend}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                        {t.importModeAppendDesc}
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setImportMode('replace')}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                      importMode === 'replace'
                        ? 'bg-rose-950/30 border-rose-500/50'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                        importMode === 'replace'
                          ? 'border-rose-400 bg-rose-400'
                          : 'border-slate-600'
                      }`}
                    >
                      {importMode === 'replace' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">
                        {t.importModeReplace}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                        {t.importModeReplaceDesc}
                      </p>
                      {importMode === 'replace' && (
                        <p className="text-[10px] text-rose-300 font-semibold mt-1">
                          {t.importModeReplaceWarning}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Preview list */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Pratinjau Entri Valid ({importValidation.validEntries.length}):
                  </span>
                  <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 text-xs">
                    {importValidation.validEntries.map((e, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-300 py-1 px-1.5 border-b border-slate-800/60 last:border-0">
                        <span className="font-medium text-white">{e.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">
                          {e.promptDirective}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
              >
                {t.btnCancelPhotoStyle}
              </button>
              {importValidation.validEntries.length > 0 && (
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition shadow-sm active:scale-95"
                >
                  Lanjutkan Impor ({importValidation.validEntries.length})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
