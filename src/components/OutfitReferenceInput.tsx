import React, { useState, useRef } from 'react';
import {
  Shirt,
  Upload,
  RefreshCw,
  Trash2,
  AlertCircle,
  Info,
} from 'lucide-react';
import { ReferenceImageData, SubjectOutfitConfig, OutfitLayeringMode } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/jfif',
  'image/pjpeg',
];

const isValidImageFile = (file: File): boolean => {
  if (ALLOWED_MIME_TYPES.includes(file.type)) return true;
  return /\.(jpe?g|png|webp|gif|jfif)$/i.test(file.name);
};

export const PER_SUBJECT_OUTFIT_MODES: OutfitLayeringMode[] = [
  'Automatic',
  'Transparent Fabric Preservation',
  'Original Outfit Preservation',
  'Preserve Visible Layers',
  'Custom Outfit Instructions',
];

interface OutfitReferenceInputProps {
  subjects: ReferenceImageData[];
  outfitImages: Record<string, ReferenceImageData>;
  subjectOutfitConfigs?: Record<string, SubjectOutfitConfig>;
  onOutfitChange: (subjectId: string, outfit: ReferenceImageData) => void;
  onOutfitRemove: (subjectId: string) => void;
  onSubjectOutfitConfigChange?: (subjectId: string, config: SubjectOutfitConfig) => void;
}

export const OutfitReferenceInput: React.FC<OutfitReferenceInputProps> = ({
  subjects,
  outfitImages,
  onOutfitChange,
  onOutfitRemove,
}) => {
  const { t } = useLanguage();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [dragOverSubjectId, setDragOverSubjectId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleProcessFile = (subjectId: string, file: File) => {
    setValidationError(null);

    if (!isValidImageFile(file)) {
      setValidationError(t.imageTypeError);
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError(t.imageSizeError);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const outfitData: ReferenceImageData = {
        id: `outfit-${subjectId}-${Date.now()}`,
        file,
        dataUrl,
        name: file.name,
        size: file.size,
      };
      onOutfitChange(subjectId, outfitData);
    };
    reader.onerror = () => {
      setValidationError('Gagal membaca file gambar outfit.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (subjectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(subjectId, e.target.files[0]);
    }
    // reset input so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleDragOver = (subjectId: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSubjectId(subjectId);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSubjectId(null);
  };

  const handleDrop = (subjectId: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSubjectId(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(subjectId, e.dataTransfer.files[0]);
    }
  };

  const filledCount = subjects.filter((s) => !!outfitImages[s.id]).length;

  return (
    <div className="space-y-4 pt-4 border-t border-slate-800/80">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Shirt className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.outfitReferenceTitle}</span>
          </label>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 self-start sm:self-auto">
          {t.imageOptionalBadge}
        </span>
        </div>

        {/* Counter Badge */}
        {subjects.length > 0 && (
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                filledCount > 0
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {filledCount} / {subjects.length} {t.outfitSlotsFilledBadge}
            </span>
          </div>
        )}
      </div>

      {/* Subtitle / Explanatory Note */}
      <p className="text-[11px] text-slate-400 leading-relaxed -mt-1">
        {t.outfitReferenceSubtitle}
      </p>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="truncate">{validationError}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="text-rose-400 hover:text-rose-200 text-xs shrink-0 font-medium"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Case 1: No subjects uploaded yet */}
      {subjects.length === 0 && (
        <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/30 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
          <Shirt className="w-6 h-6 text-slate-600" />
          <p className="text-xs text-slate-400 max-w-md">
            {t.outfitNoSubjectsHint}
          </p>
        </div>
      )}

      {/* Case 2: One Outfit Slot per Uploaded Subject */}
      {subjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject, idx) => {
            const outfit = outfitImages[subject.id];
            const isDragging = dragOverSubjectId === subject.id;

            return (
              <div
                key={subject.id}
                className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3.5 hover:border-slate-700/80 transition shadow-sm"
              >
                {/* Hidden File Input for this specific slot */}
                <input
                  type="file"
                  ref={(el) => {
                    fileInputRefs.current[subject.id] = el;
                  }}
                  onChange={(e) => handleFileChange(subject.id, e)}
                  accept="image/png,image/jpeg,image/webp,image/gif,image/jfif,.jfif,.jpg,.jpeg,.png,.webp,.gif"
                  className="hidden"
                  aria-label={`${t.outfitSlotTitle} ${idx + 1}`}
                />

                {/* Slot Header with Paired Subject Avatar */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                      <img
                        src={subject.dataUrl}
                        alt={subject.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 px-1 py-0.2 bg-black/80 text-[9px] font-mono text-cyan-300 font-bold">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">
                        {t.outfitSlotTitle} {idx + 1}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">
                        {t.outfitSlotForSubjectPrefix} #{idx + 1} ({subject.name})
                      </p>
                    </div>
                  </div>

                  {outfit ? (
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
                      {t.outfitUploadedBadge}
                    </span>
                  ) : (
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
                      Fallback
                    </span>
                  )}
                </div>

                {/* Slot Media: Uploaded Preview OR Dropzone with Fallback Notice */}
                {outfit ? (
                  <div className="space-y-2">
                    <div className="relative w-full aspect-square sm:aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                      <img
                        src={outfit.dataUrl}
                        alt={outfit.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
                      <span className="truncate max-w-[140px] text-slate-200" title={outfit.name}>
                        {outfit.name}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {formatFileSize(outfit.size)}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[subject.id]?.click()}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                      >
                        <RefreshCw className="w-3 h-3 text-amber-400" />
                        <span>{t.outfitReplaceBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOutfitRemove(subject.id)}
                        className="inline-flex items-center justify-center p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 transition"
                        title={t.outfitRemoveBtn}
                        aria-label={t.outfitRemoveBtn}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div
                      onDragOver={(e) => handleDragOver(subject.id, e)}
                      onDragEnter={(e) => handleDragOver(subject.id, e)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(subject.id, e)}
                      onClick={() => fileInputRefs.current[subject.id]?.click()}
                      className={`border-2 border-dashed rounded-xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[95px] ${
                        isDragging
                          ? 'border-amber-400 bg-amber-950/20'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70'
                      }`}
                    >
                      <Upload className="w-5 h-5 text-amber-400 mb-1" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRefs.current[subject.id]?.click();
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-semibold text-xs border border-amber-500/30 transition mb-0.5"
                      >
                        <span>{t.outfitUploadBtn}</span>
                      </button>
                      <span className="text-[10px] text-slate-500">{t.dragDropText}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 text-[10.5px] flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 leading-snug">
                        <span className="font-semibold block text-amber-300">
                          {t.outfitFallbackActive} #{idx + 1}
                        </span>
                        <p className="text-[10px] text-amber-200/70">
                          {t.outfitFallbackDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
