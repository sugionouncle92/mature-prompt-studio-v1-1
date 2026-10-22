export interface StoryCategory {
  id: string;
  name: string;
  iconName: string;
  items: string[];
}

export type MatureSensualIntensity = 'Soft' | 'Bold' | 'Provocative' | 'High Glamour';

export type MatureSubstyleGroup =
  | 'Soft & Feminine Sensuality'
  | 'Lifestyle & Intimate'
  | 'Bold & Provocative Posing'
  | 'Boudoir, Glamour & Lingerie Editorial'
  | 'Erotic Fine Art & Cinematic Expression';

export interface MatureSubstyle {
  id: string;
  name: string;
  group: MatureSubstyleGroup;
  description: string;
  visualDefinition: string;
  poseAndBodyLanguage: string;
  facialExpression: string;
  lightingAndComposition: string;
  promptDirective: string;
}

export interface StoryStyleSelection {
  primary: string | null;
  supporting: string[];
  custom: string;
  matureSubstyle?: string | null;
  matureIntensity?: MatureSensualIntensity;
}

export interface PhotographicStyleSelection {
  selected: string[];
  custom: string;
}

export interface CharacterLocksState {
  facelock: boolean; // /facelock 100%
  bodyshape: boolean; // /bodyshape lock
  outfitlock: boolean; // /outfitlock
  poselock: boolean; // /poselock
  agepreserve: boolean; // /agepreserve
  expressionlock: boolean; // /expressionlock
  hairlock: boolean; // /hairlock
  bodyproportionlock: boolean; // /bodyproportionlock
  anatomylock: boolean; // /anatomylock
  poseconsistency: boolean; // /poseconsistency
  perspectivecorrection: boolean; // /perspectivecorrection
  identitylock: boolean; // /identitylock
  referencepriority: boolean; // /referencepriority
  facialconsistency: boolean; // /facial-consistency
}

export const DEFAULT_CHARACTER_LOCKS: CharacterLocksState = {
  facelock: true,
  bodyshape: true,
  outfitlock: false,
  poselock: false,
  agepreserve: true,
  expressionlock: false,
  hairlock: true,
  bodyproportionlock: true,
  anatomylock: true,
  poseconsistency: true,
  perspectivecorrection: true,
  identitylock: true,
  referencepriority: true,
  facialconsistency: true,
};

export type VariationPreset = 1 | 3 | 5 | 10 | 'custom';

export type AspectRatioOption = 'auto' | '9:16' | '1:1' | '4:5' | '3:4' | '16:9' | '2:3';

export interface FramingConfig {
  enabled: boolean;
  selected: string; // 'auto' | option ID or Name
}

export type ImageToPromptStatus = 'idle' | 'ready' | 'analyzing' | 'success' | 'error';

export interface VariationConfig {
  preset: VariationPreset;
  customCount: number;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'testing';

export interface ApiConfig {
  apiKey: string;
  modelId: string;
}

export interface OutfitFidelityCheck {
  hasOutfitReference: boolean;
  isTransparentMode: boolean;
  warnings: string[];
  passedChecks: string[];
  status: 'passed' | 'warning' | 'info';
}

export interface PromptResult {
  id: string;
  index: number;
  prompt: string;
  activeLocks?: string[];
  fidelityCheck?: OutfitFidelityCheck;
}

export interface PromptRepairSummary {
  examined: number;
  repaired: number;
  unchanged: number;
  unfixable: number;
}

export interface ReferenceImageData {
  id: string;
  file: File;
  dataUrl: string;
  name: string;
  size: number;
}

export type UndergarmentControlMode =
  | 'Preserve'
  | 'Match Outfit'
  | 'Concealed'
  | 'No Undergarment Layer'
  | 'Editorial Minimal Layering'
  | 'Custom';

export const UNDERGARMENT_CONTROL_MODES: UndergarmentControlMode[] = [
  'Preserve',
  'Match Outfit',
  'Concealed',
  'No Undergarment Layer',
  'Editorial Minimal Layering',
  'Custom',
];

export type OutfitLayeringMode =
  | 'Automatic'
  | 'Automatic — Match Uploaded Outfit'
  | 'Transparent Fabric Preservation'
  | 'Original Outfit Preservation'
  | 'Exact Outfit Match'
  | 'Preserve Visible Layers'
  | 'Custom Outfit Instructions'
  | UndergarmentControlMode;

export interface SubjectOutfitConfig {
  mode: OutfitLayeringMode;
  customInstructions?: string;
}

export interface OutfitLayeringConfig {
  mode: OutfitLayeringMode;
  customInstructions: string;
}

export interface GenerationInput {
  samplePrompt: string;
  keywords: string;
  storyStyle: StoryStyleSelection;
  photographicStyle: PhotographicStyleSelection;
  characterLocks: CharacterLocksState;
  variationCount: number;
  selectedAspectRatio?: string;
  referenceImage?: ReferenceImageData | null;
  referenceImages?: ReferenceImageData[];
  outfitImages?: Record<string, ReferenceImageData>;
  outfitLayeringConfig?: OutfitLayeringConfig;
  outfitLayeringConfigs?: Record<string, SubjectOutfitConfig>;
  framingConfig?: FramingConfig;
}
