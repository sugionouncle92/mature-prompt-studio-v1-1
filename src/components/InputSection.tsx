import React from 'react';
import { FileText, KeyRound, Sparkles, RotateCcw } from 'lucide-react';
import { ImageToPromptInput } from './ImageToPromptInput';
import { ReferenceImageInput } from './ReferenceImageInput';
import { OutfitReferenceInput } from './OutfitReferenceInput';
import { ReferenceImageData, OutfitLayeringConfig, SubjectOutfitConfig } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext';

interface InputSectionProps {
  apiKey?: string;
  modelId?: string;
  samplePrompt: string;
  keywords: string;
  referenceImages: ReferenceImageData[];
  outfitImages: Record<string, ReferenceImageData>;
  subjectOutfitConfigs: Record<string, SubjectOutfitConfig>;
  layeringConfig?: OutfitLayeringConfig;
  onSamplePromptChange: (val: string) => void;
  onKeywordsChange: (val: string) => void;
  onReferenceImagesChange: (images: ReferenceImageData[]) => void;
  onOutfitChange: (subjectId: string, outfit: ReferenceImageData) => void;
  onOutfitRemove: (subjectId: string) => void;
  onSubjectOutfitConfigChange: (subjectId: string, config: SubjectOutfitConfig) => void;
  onLayeringConfigChange?: (config: OutfitLayeringConfig) => void;
  onClearInputs?: () => void;
  onReset?: () => void;
  resetKey?: number;
}

export const InputSection: React.FC<InputSectionProps> = ({
  apiKey = '',
  modelId = 'gemini-2.5-flash',
  samplePrompt,
  keywords,
  referenceImages,
  outfitImages,
  subjectOutfitConfigs,
  onSamplePromptChange,
  onKeywordsChange,
  onReferenceImagesChange,
  onOutfitChange,
  onOutfitRemove,
  onSubjectOutfitConfigChange,
  onClearInputs,
  onReset,
  resetKey,
}) => {
  const { t } = useLanguage();
  const hasSample = samplePrompt.trim().length > 0;
  const hasKeywords = keywords.trim().length > 0;
  const handleReset = onReset || onClearInputs;

  // Determine active logic
  let logicBadge = {
    title: t.awaitingInput,
    desc: t.awaitingInputDesc,
    color: 'text-slate-400 bg-slate-800/60 border-slate-700/60',
  };

  if (hasSample && hasKeywords) {
    logicBadge = {
      title: t.combinedMode,
      desc: t.combinedModeDesc,
      color: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/40',
    };
  } else if (hasSample) {
    logicBadge = {
      title: t.sampleOnlyMode,
      desc: t.sampleOnlyModeDesc,
      color: 'text-amber-400 bg-amber-950/30 border-amber-800/40',
    };
  } else if (hasKeywords) {
    logicBadge = {
      title: t.keywordsOnlyMode,
      desc: t.keywordsOnlyModeDesc,
      color: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/40',
    };
  }

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {t.inputsTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.inputsSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {handleReset && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title={t.resetInputs}
            >
              <RotateCcw className="w-3 h-3" />
              {t.resetInputs}
            </button>
          )}

          <div
            className={`px-3 py-1 rounded-full text-xs font-medium border ${logicBadge.color} flex items-center gap-1.5`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
            <span>{logicBadge.title}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Sample Prompt Area */}
        <div className="space-y-2 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <label
              htmlFor="sample-prompt"
              className="text-xs font-semibold text-slate-200 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              {t.samplePromptLabel}
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              {samplePrompt.length} {t.charsCount}
            </span>
          </div>

          <textarea
            id="sample-prompt"
            rows={6}
            value={samplePrompt}
            onChange={(e) => onSamplePromptChange(e.target.value)}
            placeholder={t.samplePromptPlaceholder}
            className="w-full flex-1 min-h-[150px] bg-slate-950/80 border border-slate-800 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 transition resize-y leading-relaxed outline-none"
          />
          <p className="text-[11px] text-slate-500">
            {t.samplePromptHint}
          </p>
        </div>

        {/* Keywords Area */}
        <div className="space-y-2 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <label
              htmlFor="keywords-input"
              className="text-xs font-semibold text-slate-200 flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              {t.keywordsLabel}
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              {keywords.length} {t.charsCount}
            </span>
          </div>

          <textarea
            id="keywords-input"
            rows={6}
            value={keywords}
            onChange={(e) => onKeywordsChange(e.target.value)}
            placeholder={t.keywordsPlaceholder}
            className="w-full flex-1 min-h-[150px] bg-slate-950/80 border border-slate-800 focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 transition resize-y leading-relaxed outline-none"
          />
          <p className="text-[11px] text-slate-500">
            {t.keywordsHint}
          </p>
        </div>
      </div>

      {/* C. IMAGE TO PROMPT (ANALISIS GAMBAR MENJADI PROMPT) */}
      <ImageToPromptInput
        apiKey={apiKey}
        modelId={modelId}
        samplePrompt={samplePrompt}
        onApplyToSamplePrompt={onSamplePromptChange}
        resetKey={resetKey}
      />

      {/* Optional Reference Images Input (Multi-Image Subject Reference) */}
      <ReferenceImageInput
        images={referenceImages}
        onChange={onReferenceImagesChange}
      />

      {/* Optional Outfit Reference Input (Per-Subject Dedicated Slots & Layering Control) */}
      <OutfitReferenceInput
        subjects={referenceImages}
        outfitImages={outfitImages}
        subjectOutfitConfigs={subjectOutfitConfigs}
        onOutfitChange={onOutfitChange}
        onOutfitRemove={onOutfitRemove}
        onSubjectOutfitConfigChange={onSubjectOutfitConfigChange}
      />
    </section>
  );
};
