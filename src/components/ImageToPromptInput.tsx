import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ArrowRight,
  Loader2,
  X,
  Layers,
  Replace,
} from 'lucide-react';
import { ImageToPromptStatus } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext';
import { GeminiService } from '../services/geminiService';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jfif',
  'image/pjpeg',
];

const isValidImage = (file: File): boolean => {
  if (ALLOWED_MIME_TYPES.includes(file.type)) return true;
  return /\.(jpe?g|png|webp|jfif)$/i.test(file.name);
};

interface ImageToPromptInputProps {
  apiKey: string;
  modelId: string;
  samplePrompt: string;
  onApplyToSamplePrompt: (newPrompt: string) => void;
  resetKey?: number;
}

export const ImageToPromptInput: React.FC<ImageToPromptInputProps> = ({
  apiKey,
  modelId,
  samplePrompt,
  onApplyToSamplePrompt,
  resetKey,
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<{
    name: string;
    size: number;
    dataUrl: string;
    mimeType: string;
  } | null>(null);

  const [status, setStatus] = useState<ImageToPromptStatus>('idle');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [appliedToast, setAppliedToast] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const analysisSessionRef = useRef(0);

  useEffect(() => {
    if (resetKey !== undefined && resetKey > 0) {
      analysisSessionRef.current += 1;
      setImage(null);
      setStatus('idle');
      setAnalysisResult('');
      setErrorMsg(null);
      setCopied(false);
      setAppliedToast(false);
      setShowConfirmModal(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [resetKey]);

  const handleFileProcess = (file: File) => {
    setErrorMsg(null);

    if (!isValidImage(file)) {
      setErrorMsg(t.imageTypeError);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg(t.imageSizeError);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const mimeType = file.type || 'image/jpeg';
      setImage({
        name: file.name,
        size: file.size,
        dataUrl,
        mimeType,
      });
      setStatus('ready');
    };
    reader.onerror = () => {
      setErrorMsg(t.imageTypeError);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (status !== 'analyzing') {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (status === 'analyzing') return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemoveImage = () => {
    if (status === 'analyzing') return;
    setImage(null);
    setStatus('idle');
    setErrorMsg(null);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    if (!apiKey.trim()) {
      setErrorMsg(t.errNoApiKeyForAnalysis);
      return;
    }

    const currentSession = ++analysisSessionRef.current;
    setErrorMsg(null);
    setStatus('analyzing');

    try {
      const result = await GeminiService.getInstance().analyzeImageToPrompt(
        apiKey,
        modelId,
        image.dataUrl,
        image.mimeType
      );
      if (currentSession !== analysisSessionRef.current) return;
      setAnalysisResult(result);
      setStatus('success');
    } catch (err: unknown) {
      if (currentSession !== analysisSessionRef.current) return;
      setStatus('error');
      const msg = err instanceof Error ? err.message : t.errAnalysisFailed;
      setErrorMsg(msg);
    }
  };

  const handleCopy = async () => {
    if (!analysisResult.trim()) return;
    try {
      await navigator.clipboard.writeText(analysisResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleClearResult = () => {
    setAnalysisResult('');
    setStatus(image ? 'ready' : 'idle');
    setErrorMsg(null);
  };

  const handleUseResult = () => {
    if (!analysisResult.trim()) return;

    if (samplePrompt.trim().length > 0) {
      setShowConfirmModal(true);
    } else {
      executeApply(analysisResult.trim());
    }
  };

  const executeApply = (finalText: string) => {
    onApplyToSamplePrompt(finalText);
    setShowConfirmModal(false);
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 3000);
  };

  const handleReplacePrompt = () => {
    executeApply(analysisResult.trim());
  };

  const handleMergePrompt = () => {
    const existing = samplePrompt.trim();
    const addition = analysisResult.trim();
    const merged = `${existing}\n\n[Visual Analysis Reference]:\n${addition}`;
    executeApply(merged);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Status badge config
  const getStatusBadge = () => {
    switch (status) {
      case 'analyzing':
        return {
          label: t.statusAnalyzing,
          color: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
          icon: <Loader2 className="w-3 h-3 animate-spin text-amber-400" />,
        };
      case 'ready':
        return {
          label: t.statusReadyToAnalyze,
          color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60',
          icon: <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />,
        };
      case 'success':
        return {
          label: t.statusAnalysisSuccess,
          color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
        };
      case 'error':
        return {
          label: t.statusAnalysisFailed,
          color: 'text-rose-400 bg-rose-950/40 border-rose-800/60',
          icon: <AlertCircle className="w-3 h-3 text-rose-400" />,
        };
      case 'idle':
      default:
        return {
          label: t.statusAwaitingImage,
          color: 'text-slate-400 bg-slate-800/60 border-slate-700/60',
          icon: <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />,
        };
    }
  };

  const statusBadge = getStatusBadge();
  const isAnalyzing = status === 'analyzing';

  return (
    <div className="pt-2 border-t border-slate-800/80 space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jfif"
        className="hidden"
        onChange={handleFileChange}
        disabled={isAnalyzing}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-violet-400" />
            {t.imageToPromptTitle}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            {t.imageToPromptSubtitle}
          </p>
        </div>

        {/* Status Badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.color} flex items-center gap-1.5 self-start sm:self-auto shrink-0`}
        >
          {statusBadge.icon}
          <span>{statusBadge.label}</span>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-rose-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Toast alert when applied */}
      {appliedToast && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t.appliedSuccessNotice}</span>
        </div>
      )}

      {/* Main Grid: Upload / Preview Area + Analysis Result Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Left Column: Upload or Preview */}
        <div className="flex flex-col justify-between h-full">
          {!image ? (
            /* Drag and Drop Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isAnalyzing && fileInputRef.current?.click()}
              className={`h-full min-h-[200px] border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-violet-500 bg-violet-950/20 shadow-lg shadow-violet-950/20'
                  : 'border-slate-800 bg-slate-950/40 hover:border-violet-500/50 hover:bg-slate-900/60'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-violet-950/60 border border-violet-800/50 flex items-center justify-center text-violet-400 mb-2.5">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-slate-200 mb-1">
                {t.imageToPromptUploadZone}
              </p>
              <p className="text-[11px] text-slate-500">
                {t.imageToPromptFormats}
              </p>
            </div>
          ) : (
            /* Image Preview Card */
            <div className="h-full flex flex-col justify-between bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-3">
              <div className="relative group rounded-lg overflow-hidden border border-slate-800/80 bg-slate-900/80 flex items-center justify-center min-h-[160px] max-h-[220px]">
                <img
                  src={image.dataUrl}
                  alt={image.name}
                  className="w-full h-full max-h-[220px] object-contain rounded-lg"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-violet-300">
                    <Loader2 className="w-7 h-7 animate-spin text-violet-400" />
                    <span className="text-xs font-medium">{t.statusAnalyzing}</span>
                  </div>
                )}
              </div>

              {/* Image Info & Actions */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-medium text-slate-200 truncate" title={image.name}>
                    {image.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {formatFileSize(image.size)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                    className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    title={t.btnChangeImage}
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{t.btnChangeImage}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isAnalyzing}
                    className="p-1 text-xs font-medium text-rose-400 hover:text-rose-200 hover:bg-rose-950/50 border border-transparent hover:border-rose-800/40 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title={t.btnRemoveImage}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Trigger Analysis Button */}
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`w-full py-2 px-3.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm ${
                  isAnalyzing
                    ? 'bg-violet-900/40 text-violet-300 border border-violet-800/40 cursor-wait'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-950/50'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t.statusAnalyzing}</span>
                  </>
                ) : status === 'success' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t.btnReanalyzeImage}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.btnAnalyzeImage}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Editable Analysis Result Textarea */}
        <div className="flex flex-col justify-between space-y-2 h-full">
          <div className="flex items-center justify-between">
            <label
              htmlFor="analysis-result-area"
              className="text-xs font-semibold text-slate-200 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-violet-400" />
              {t.analysisResultLabel}
            </label>
            {analysisResult.length > 0 && (
              <span className="text-[11px] text-slate-500 font-mono">
                {analysisResult.length} {t.charsCount}
              </span>
            )}
          </div>

          <textarea
            id="analysis-result-area"
            rows={7}
            value={analysisResult}
            onChange={(e) => setAnalysisResult(e.target.value)}
            placeholder={t.analysisResultPlaceholder}
            className="w-full flex-1 min-h-[170px] bg-slate-950/80 border border-slate-800 focus:border-violet-500/80 focus:ring-2 focus:ring-violet-500/20 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 transition resize-y leading-relaxed outline-none"
          />

          {/* Action Buttons for Result */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 mt-auto">
            <div className="flex items-center gap-2">
              {analysisResult.trim().length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white rounded-lg transition"
                    title={t.btnCopyAnalysis}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">{t.analysisCopied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{t.btnCopyAnalysis}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleClearResult}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
                    title={t.btnClearAnalysisResult}
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{t.btnClearAnalysisResult}</span>
                  </button>
                </>
              )}
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={handleUseResult}
              disabled={!analysisResult.trim() || isAnalyzing}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-sm shadow-violet-950/50 transition ml-auto"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>{t.btnUseAnalysisResult}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal when Sample Prompt already has text */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-violet-950/80 border border-violet-800/50 flex items-center justify-center text-violet-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white">
                  {t.confirmApplyTitle}
                </h4>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t.confirmApplyDesc}
            </p>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleReplacePrompt}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition shadow-sm"
              >
                <Replace className="w-3.5 h-3.5" />
                <span>{t.btnReplacePrompt}</span>
              </button>

              <button
                type="button"
                onClick={handleMergePrompt}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition shadow-sm"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t.btnMergePrompt}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition"
              >
                {t.btnCancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
