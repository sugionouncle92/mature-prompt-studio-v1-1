import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  X,
  AlertCircle,
  FileImage,
  CheckCircle2,
} from 'lucide-react';
import { ReferenceImageData } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext';

export const MAX_REFERENCE_IMAGES = 5;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB per image
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

interface ReferenceImageInputProps {
  images: ReferenceImageData[];
  onChange: (images: ReferenceImageData[]) => void;
  maxImages?: number;
}

export const ReferenceImageInput: React.FC<ReferenceImageInputProps> = ({
  images,
  onChange,
  maxImages = MAX_REFERENCE_IMAGES,
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const processFiles = (files: FileList | File[]) => {
    setValidationError(null);
    const fileArray = Array.from(files);

    if (fileArray.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      setValidationError(t.imageMaxLimitReached);
      return;
    }

    const filesToProcess = fileArray.slice(0, remainingSlots);
    if (fileArray.length > remainingSlots) {
      setValidationError(t.imageMaxLimitReached);
    }

    const validFiles: File[] = [];
    for (const file of filesToProcess) {
      if (!isValidImageFile(file)) {
        setValidationError(t.imageTypeError);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setValidationError(t.imageSizeError);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    let processedCount = 0;
    const newItems: ReferenceImageData[] = [];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        newItems.push({
          id: `ref-img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          dataUrl,
          name: file.name,
          size: file.size,
        });
        processedCount++;
        if (processedCount === validFiles.length) {
          onChange([...images, ...newItems]);
        }
      };
      reader.onerror = () => {
        processedCount++;
        setValidationError('Gagal membaca beberapa file gambar.');
        if (processedCount === validFiles.length && newItems.length > 0) {
          onChange([...images, ...newItems]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(images.filter((img) => img.id !== id));
    setValidationError(null);
  };

  const handleRemoveAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    setValidationError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-3 pt-3 border-t border-slate-800/80">
      {/* Hidden Multi-File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/gif,image/jfif,.jfif,.jpg,.jpeg,.png,.webp,.gif"
        multiple
        className="hidden"
        aria-label={t.referenceImageTitle}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.referenceImageTitle}</span>
          </label>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700/60">
            {images.length} / {maxImages}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {images.length > 0 && (
            <button
              type="button"
              onClick={handleRemoveAll}
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 px-2 py-0.5 rounded hover:bg-slate-800/50 transition"
              title={t.removeAllImagesBtn}
            >
              <Trash2 className="w-3 h-3" />
              <span>{t.removeAllImagesBtn}</span>
            </button>
          )}

          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
            {t.imageOptionalBadge}
          </span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400">
        {t.referenceImageSubtitle}
      </p>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{validationError}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="text-rose-400 hover:text-white text-xs px-1.5 py-0.5 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* When Images Exist -> Display Responsive Multi-Thumbnail Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="group relative bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden p-2 flex flex-col justify-between hover:border-slate-700 transition"
            >
              {/* Thumbnail Container */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-800/80 mb-1.5">
                <img
                  src={img.dataUrl}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />

                {/* Index Badge */}
                <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/70 text-cyan-300 text-[10px] font-mono font-bold backdrop-blur-xs border border-white/10">
                  #{idx + 1}
                </span>

                {/* Remove Single Button */}
                <button
                  type="button"
                  onClick={(e) => handleRemoveOne(img.id, e)}
                  title={`${t.removeImageBtn}: ${img.name}`}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/75 hover:bg-rose-900 text-slate-300 hover:text-white transition shadow"
                  aria-label={`${t.removeImageBtn} ${img.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* File Info */}
              <div className="px-0.5 space-y-0.5">
                <p className="text-[11px] font-medium text-slate-200 truncate" title={img.name}>
                  {img.name}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {formatFileSize(img.size)}
                </p>
              </div>
            </div>
          ))}

          {/* Quick "Add Image" Card if below limit */}
          {images.length < maxImages && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-cyan-500/60 bg-slate-950/30 hover:bg-cyan-950/20 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition aspect-square"
              title={t.addMoreImagesBtn}
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mb-1.5">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-300">
                {t.addMoreImagesBtn}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                {maxImages - images.length} tersisa
              </span>
            </button>
          )}
        </div>
      )}

      {/* When Empty -> Full Drag & Drop Zone */}
      {images.length === 0 && (
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition ${
            isDragging
              ? 'border-cyan-400 bg-cyan-950/20'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/70'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-2.5">
            <FileImage className="w-5 h-5 text-cyan-400" />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 mb-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-sm transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t.uploadImageBtn}</span>
            </button>
            <span className="text-xs text-slate-400">{t.dragDropText}</span>
          </div>

          <p className="text-[11px] text-slate-500 mt-0.5">
            {t.imageFormatHint}
          </p>
        </div>
      )}

      {/* Loaded Status Summary */}
      {images.length > 0 && (
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {images.length} {t.imageUploadedBadge}
            </span>
          </div>
          <span>{t.imageFormatHint}</span>
        </div>
      )}
    </div>
  );
};
