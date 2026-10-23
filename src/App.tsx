import React, { useState, useEffect, useRef } from 'react';
import {
  Wand2,
  AlertCircle,
  Sparkles,
  Shield,
} from 'lucide-react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { StoryStyleSelector } from './components/StoryStyleSelector';
import { PhotographicStyleSelector } from './components/PhotographicStyleSelector';
import { FramingSelector } from './components/FramingSelector';
import { CharacterLocks } from './components/CharacterLocks';
import { VariationSettings } from './components/VariationSettings';
import { OutputSection } from './components/OutputSection';
import { SettingsModal } from './components/SettingsModal';
import {
  StoryStyleSelection,
  PhotographicStyleSelection,
  CharacterLocksState,
  DEFAULT_CHARACTER_LOCKS,
  VariationConfig,
  AspectRatioOption,
  FramingConfig,
  PromptResult,
  ConnectionStatus,
  ApiConfig,
  GenerationInput,
  ReferenceImageData,
  OutfitLayeringConfig,
  OutfitLayeringMode,
  SubjectOutfitConfig,
} from './types/index.ts';
import { GeminiService } from './services/geminiService.ts';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { DEFAULT_PHOTOGRAPHIC_STYLES } from './data/photographicStyles.ts';

const STORAGE_KEY_API = 'mature_prompt_studio_api_key';
const STORAGE_KEY_MODEL = 'mature_prompt_studio_model_id';
const STORAGE_KEY_OUTFIT_LAYERING = 'mature_prompt_studio_outfit_layering_mode';
const STORAGE_KEY_OUTFIT_CUSTOM = 'mature_prompt_studio_outfit_custom_instructions';
const STORAGE_KEY_SUBJECT_OUTFIT_CONFIGS = 'mature_prompt_studio_subject_outfit_configs';
const STORAGE_KEY_FRAMING_CONFIG = 'mature_prompt_studio_framing_config_v3';
const STORAGE_KEY_ASPECT_RATIO = 'mature_prompt_studio_aspect_ratio_v2';
const STORAGE_KEY_CHARACTER_LOCKS = 'mature_prompt_studio_character_locks_v3';
const STORAGE_KEY_PHOTOGRAPHIC_STYLE = 'mature_prompt_studio_photographic_style_v2';

const StudioContent: React.FC = () => {
  const { t, language } = useLanguage();

  // Inputs
  const [samplePrompt, setSamplePrompt] = useState('');
  const [keywords, setKeywords] = useState('');
  const [referenceImages, setReferenceImages] = useState<ReferenceImageData[]>([]);
  const [outfitImages, setOutfitImages] = useState<Record<string, ReferenceImageData>>({});
  const [subjectOutfitConfigs, setSubjectOutfitConfigs] = useState<Record<string, SubjectOutfitConfig>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUBJECT_OUTFIT_CONFIGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SUBJECT_OUTFIT_CONFIGS, JSON.stringify(subjectOutfitConfigs));
    } catch {
      // ignore storage errors
    }
  }, [subjectOutfitConfigs]);

  const [outfitLayeringConfig, setOutfitLayeringConfig] = useState<OutfitLayeringConfig>(() => {
    try {
      const savedMode = localStorage.getItem(STORAGE_KEY_OUTFIT_LAYERING);
      const savedCustom = localStorage.getItem(STORAGE_KEY_OUTFIT_CUSTOM) || '';
      const validModes: OutfitLayeringMode[] = [
        'Automatic',
        'Automatic — Match Uploaded Outfit',
        'Original Outfit Preservation',
        'Exact Outfit Match',
        'Preserve Visible Layers',
        'Transparent Fabric Preservation',
        'Custom Outfit Instructions',
      ];
      if (savedMode && validModes.includes(savedMode as OutfitLayeringMode)) {
        return { mode: savedMode as OutfitLayeringMode, customInstructions: savedCustom };
      }
      const legacyUndergarment = localStorage.getItem('mature_prompt_studio_undergarment_control');
      if (legacyUndergarment) {
        return { mode: 'Automatic', customInstructions: '' };
      }
    } catch {
      // fallback to default
    }
    return {
      mode: 'Automatic',
      customInstructions: '',
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_OUTFIT_LAYERING, outfitLayeringConfig.mode);
      localStorage.setItem(STORAGE_KEY_OUTFIT_CUSTOM, outfitLayeringConfig.customInstructions);
    } catch {
      // ignore storage errors
    }
  }, [outfitLayeringConfig]);

  // Styles
  const [storyStyle, setStoryStyle] = useState<StoryStyleSelection>({
    primary: null,
    supporting: [],
    custom: '',
    matureSubstyle: null,
    matureIntensity: 'Soft',
  });

  const [photographicStyle, setPhotographicStyle] = useState<PhotographicStyleSelection>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PHOTOGRAPHIC_STYLE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.selected)) {
          return {
            selected: parsed.selected,
            custom: typeof parsed.custom === 'string' ? parsed.custom : '',
          };
        }
      }
    } catch {
      // fallback
    }
    return {
      selected: [...DEFAULT_PHOTOGRAPHIC_STYLES],
      custom: '',
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PHOTOGRAPHIC_STYLE, JSON.stringify(photographicStyle));
    } catch {
      // ignore
    }
  }, [photographicStyle]);

  // Locks (4 new locks default to true)
  const [characterLocks, setCharacterLocks] = useState<CharacterLocksState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHARACTER_LOCKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_CHARACTER_LOCKS,
            ...parsed,
          };
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_CHARACTER_LOCKS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHARACTER_LOCKS, JSON.stringify(characterLocks));
    } catch {
      // ignore
    }
  }, [characterLocks]);

  // Variations & Aspect Ratio (Default: 9:16)
  const [variationConfig, setVariationConfig] = useState<VariationConfig>({
    preset: 3,
    customCount: 3,
  });
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatioOption>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ASPECT_RATIO);
      if (saved) return saved as AspectRatioOption;
    } catch {
      // fallback
    }
    return '9:16';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ASPECT_RATIO, selectedAspectRatio);
    } catch {
      // ignore
    }
  }, [selectedAspectRatio]);

  // Camera Framing Config (Default: ON + Cowboy Shot)
  const [framingConfig, setFramingConfig] = useState<FramingConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FRAMING_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            enabled: parsed.enabled !== undefined ? Boolean(parsed.enabled) : true,
            selected: parsed.selected || 'cowboy-shot',
          };
        }
      }
    } catch {
      // fallback
    }
    return { enabled: true, selected: 'cowboy-shot' };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FRAMING_CONFIG, JSON.stringify(framingConfig));
    } catch {
      // ignore
    }
  }, [framingConfig]);

  // API Config & Status
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    apiKey: '',
    modelId: 'gemini-2.5-flash',
  });
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Generation & Output State
  const [isLoading, setIsLoading] = useState(false);
  const [repairingCardIds, setRepairingCardIds] = useState<Record<string, boolean>>({});
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<PromptResult[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const generationSessionRef = useRef(0);

  // Load API config from localStorage on init
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem(STORAGE_KEY_API) || '';
      const savedModel = localStorage.getItem(STORAGE_KEY_MODEL) || 'gemini-2.5-flash';
      setApiConfig({ apiKey: savedKey, modelId: savedModel });

      if (savedKey.trim()) {
        setConnectionStatus('connected');
        setStatusMessage(language === 'id' 
          ? `Terkonfigurasi menggunakan ${savedModel}.` 
          : `Configured to use ${savedModel}.`);
      }
    } catch {
      // localStorage may be restricted in some sandboxes
    }
  }, [language]);

  const handleSaveSettings = (newConfig: ApiConfig) => {
    setApiConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY_API, newConfig.apiKey);
      localStorage.setItem(STORAGE_KEY_MODEL, newConfig.modelId);
    } catch {
      // fallback
    }
    if (newConfig.apiKey.trim()) {
      setConnectionStatus('connected');
      setStatusMessage(language === 'id'
        ? `Siap. Menggunakan model: ${newConfig.modelId}`
        : `Ready. Using model: ${newConfig.modelId}`);
    } else {
      setConnectionStatus('disconnected');
      setStatusMessage(t.keyRemovedMessage);
    }
  };

  const handleClearApiKey = () => {
    setApiConfig((prev) => ({ ...prev, apiKey: '' }));
    try {
      localStorage.removeItem(STORAGE_KEY_API);
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    // 1. Cancel ongoing generation so stale results do not appear
    generationSessionRef.current += 1;
    setIsLoading(false);
    setErrorMessage(null);

    // 2. Clear Column A (Prompt Sample)
    setSamplePrompt('');

    // 3. Clear Variation Results and card states
    setResults([]);
    setRepairingCardIds({});
    setCardErrors({});

    // 4. Trigger reset in Section C (ImageToPromptInput)
    setResetKey((prev) => prev + 1);

    // NOTE: Column B (keywords) is strictly PRESERVED.
    // NOTE: Reference images, outfit images, story styles, photographic styles,
    // framing, character locks, variation settings, and API config are strictly PRESERVED.
  };

  const handleReferenceImagesChange = (newImages: ReferenceImageData[]) => {
    setReferenceImages(newImages);
    // Keep only outfit images and configs whose subjectId exists in newImages
    const validSubjectIds = new Set(newImages.map((img) => img.id));
    setOutfitImages((prev) => {
      const next: Record<string, ReferenceImageData> = {};
      for (const [subjId, outfit] of Object.entries(prev)) {
        if (validSubjectIds.has(subjId)) {
          next[subjId] = outfit;
        }
      }
      return next;
    });

    setSubjectOutfitConfigs((prev) => {
      const next: Record<string, SubjectOutfitConfig> = {};
      for (const [subjId, cfg] of Object.entries(prev)) {
        if (validSubjectIds.has(subjId)) {
          next[subjId] = cfg;
        }
      }
      return next;
    });
  };

  const handleOutfitChange = (subjectId: string, outfit: ReferenceImageData) => {
    setOutfitImages((prev) => ({
      ...prev,
      [subjectId]: outfit,
    }));
  };

  const handleOutfitRemove = (subjectId: string) => {
    setOutfitImages((prev) => {
      const next = { ...prev };
      delete next[subjectId];
      return next;
    });
  };

  const handleSubjectOutfitConfigChange = (subjectId: string, config: SubjectOutfitConfig) => {
    setSubjectOutfitConfigs((prev) => ({
      ...prev,
      [subjectId]: config,
    }));
    if (referenceImages[0]?.id === subjectId) {
      setOutfitLayeringConfig({
        mode: config.mode,
        customInstructions: config.customInstructions || '',
      });
    }
  };

  const handleGenerate = async () => {
    setErrorMessage(null);

    // 1. Validation: Both inputs empty
    if (!samplePrompt.trim() && !keywords.trim()) {
      setErrorMessage(t.emptyInputsError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Validation: API Key missing
    if (!apiConfig.apiKey.trim()) {
      setIsSettingsOpen(true);
      setErrorMessage(t.apiKeyMissingError);
      return;
    }

    const targetCount =
      variationConfig.preset === 'custom'
        ? variationConfig.customCount
        : variationConfig.preset;

    const generationInput: GenerationInput = {
      samplePrompt,
      keywords,
      storyStyle,
      photographicStyle,
      characterLocks,
      variationCount: targetCount,
      selectedAspectRatio,
      referenceImages,
      outfitImages,
      outfitLayeringConfig,
      outfitLayeringConfigs: subjectOutfitConfigs,
      framingConfig,
    };

    const currentSession = ++generationSessionRef.current;
    setIsLoading(true);

    try {
      const geminiService = GeminiService.getInstance();
      const generated = await geminiService.generatePrompts(
        apiConfig.apiKey,
        apiConfig.modelId,
        generationInput
      );

      if (currentSession !== generationSessionRef.current) return;

      setResults(generated);
      setConnectionStatus('connected');

      // Scroll smoothly to output
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: unknown) {
      if (currentSession !== generationSessionRef.current) return;
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during generation.';
      setErrorMessage(msg);
      if (msg.includes('401') || msg.includes('403') || msg.includes('404')) {
        setConnectionStatus('error');
      }
    } finally {
      if (currentSession === generationSessionRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleUpdatePrompt = (id: string, updatedPrompt: string) => {
    setResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, prompt: updatedPrompt } : r))
    );
  };

  const handleRepairSinglePrompt = async (item: PromptResult) => {
    if (repairingCardIds[item.id]) return;

    setRepairingCardIds((prev) => ({ ...prev, [item.id]: true }));
    setCardErrors((prev) => {
      const next = { ...prev };
      delete next[item.id];
      return next;
    });

    try {
      const geminiService = GeminiService.getInstance();
      const currentGenerationInput: GenerationInput = {
        samplePrompt,
        keywords,
        storyStyle,
        photographicStyle,
        characterLocks,
        variationCount: results.length,
        selectedAspectRatio,
        referenceImages,
        outfitImages,
        outfitLayeringConfig,
        outfitLayeringConfigs: subjectOutfitConfigs,
        framingConfig,
      };

      const repairedItem = await geminiService.repairSinglePrompt(
        apiConfig.apiKey,
        apiConfig.modelId,
        item,
        currentGenerationInput
      );

      setResults((prev) => prev.map((r) => (r.id === item.id ? repairedItem : r)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.repairFailedNotice;
      setCardErrors((prev) => ({ ...prev, [item.id]: msg }));
    } finally {
      setRepairingCardIds((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const isInputEmpty = !samplePrompt.trim() && !keywords.trim();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Top Header */}
      <Header
        connectionStatus={connectionStatus}
        modelId={apiConfig.modelId}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs sm:text-sm flex items-start justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block text-rose-300">{t.validationNoticeTitle}</span>
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white text-xs font-semibold px-2 py-1 rounded hover:bg-rose-900/40"
            >
              {t.dismissBtn}
            </button>
          </div>
        )}

        {/* 1. Core Scene Inputs */}
        <InputSection
          apiKey={apiConfig.apiKey}
          modelId={apiConfig.modelId}
          samplePrompt={samplePrompt}
          keywords={keywords}
          referenceImages={referenceImages}
          outfitImages={outfitImages}
          subjectOutfitConfigs={subjectOutfitConfigs}
          layeringConfig={outfitLayeringConfig}
          onSamplePromptChange={setSamplePrompt}
          onKeywordsChange={setKeywords}
          onReferenceImagesChange={handleReferenceImagesChange}
          onOutfitChange={handleOutfitChange}
          onOutfitRemove={handleOutfitRemove}
          onSubjectOutfitConfigChange={handleSubjectOutfitConfigChange}
          onLayeringConfigChange={setOutfitLayeringConfig}
          onClearInputs={handleReset}
          onReset={handleReset}
          resetKey={resetKey}
        />

        {/* 2. Story Style Selector */}
        <StoryStyleSelector
          selection={storyStyle}
          onChange={setStoryStyle}
        />

        {/* 3. Photographic Style Selector */}
        <PhotographicStyleSelector
          selection={photographicStyle}
          onChange={setPhotographicStyle}
        />

        {/* 4. Camera Framing & Shot Composition */}
        <FramingSelector
          config={framingConfig}
          onChange={setFramingConfig}
        />

        {/* 5. Character Locks */}
        <CharacterLocks
          locks={characterLocks}
          onChange={setCharacterLocks}
        />

        {/* 6. Variation Settings & Aspect Ratio */}
        <VariationSettings
          config={variationConfig}
          onChange={setVariationConfig}
          aspectRatio={selectedAspectRatio}
          onAspectRatioChange={setSelectedAspectRatio}
        />

        {/* Action Trigger Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm">
          <div className="text-xs text-slate-400 flex items-center gap-2 self-start sm:self-auto">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-relaxed">
              {t.adultShieldNotice}
            </span>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || isInputEmpty}
            className={`w-full sm:w-auto shrink-0 px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-lg transition duration-150 ${
              isInputEmpty
                ? 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                : isLoading
                ? 'bg-amber-600/70 text-slate-200 cursor-wait'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-950/40 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-slate-900" />
                <span>{t.generatingBtn}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-slate-950" />
                <span>{t.generateBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* 6. Output Section */}
        <div id="results-section">
          <OutputSection
            results={results}
            isLoading={isLoading}
            repairingCardIds={repairingCardIds}
            cardErrors={cardErrors}
            onClearResults={() => {
              setResults([]);
              setRepairingCardIds({});
              setCardErrors({});
            }}
            onRepairSinglePrompt={handleRepairSinglePrompt}
            onUpdatePrompt={handleUpdatePrompt}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {t.footerCopy}</p>
          <p className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {t.footerDisclaimer}
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={apiConfig}
        connectionStatus={connectionStatus}
        statusMessage={statusMessage}
        onSave={handleSaveSettings}
        onClearKey={handleClearApiKey}
        onStatusChange={(st, msg) => {
          setConnectionStatus(st);
          setStatusMessage(msg);
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <StudioContent />
    </LanguageProvider>
  );
};
