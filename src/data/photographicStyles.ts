import type { CustomPhotographicStyle, CustomPhotographicStylesExportFile } from '../types/index.ts';

export interface PhotographicStyleItem {
  id: string;
  name: string;
  description: string;
  shorthand?: string;
  isMandatoryUltra?: boolean;
  promptDirective?: string;
}

export const NYATA_STYLE_CONFIG = {
  id: 'nyata',
  name: 'Nyata',
  shorthands: [
    '/identitylock',
    '/master-face-lock',
    '/referencepriority',
    '/facial-consistency',
    '/photorealism',
    '/maximum-detail',
    '/natural-skin-texture',
    '/anti-ai-artifacts',
  ] as const,
  faceIdentityLock: {
    shorthand: '/identitylock /master-face-lock /referencepriority /facial-consistency',
    instructions: [
      'Gunakan gambar referensi yang diunggah sebagai acuan utama identitas wajah subjek.',
      'Pertahankan identitas wajah asli secara konsisten, mencakup geometri dan proporsi wajah, bentuk mata, jarak antarmata, alis, kelopak mata, hidung, bibir, garis rahang, dagu, warna kulit, garis rambut, serta ciri khas wajah lainnya.',
      'Pertahankan usia tampak asli dan karakteristik alami subjek. Jangan mengganti subjek dengan orang lain, mengubah bentuk wajah secara sewenang-wenang, mempercantik wajah secara berlebihan, atau membuat subjek tampak lebih tua maupun lebih muda.',
      'Gambar referensi memiliki prioritas tertinggi dalam menentukan identitas. Deskripsi teks umum tidak boleh mengesampingkan ciri-ciri wajah yang terlihat pada referensi.',
      'Prinsip utama: pertahankan identitas orang yang sama, bukan sekadar menghasilkan wajah yang mirip.',
    ],
  },
  naturalPhotorealism: {
    shorthand: '/photorealism /maximum-detail /natural-skin-texture /anti-ai-artifacts',
    instructions: [
      'Hasil akhir harus tampak seperti foto nyata yang diambil menggunakan kamera, bukan ilustrasi, lukisan digital, atau CGI.',
      'Prioritaskan detail wajah yang tajam dan alami, pori-pori kulit yang realistis, garis halus serta ketidaksempurnaan kulit yang wajar, asimetri wajah autentik, detail rambut yang realistis, warna kulit alami, dan gradasi tonal yang meyakinkan.',
      'Pertahankan pencahayaan, bayangan, pantulan cahaya, dan interaksi cahaya dengan lingkungan yang masuk akal secara fisik.',
      'Hindari kulit terlalu halus, plastik, atau seperti lilin; beauty filter; penghalusan kulit digital berlebihan; detail wajah artifisial; penajaman berlebihan; distorsi wajah; anatomi tidak masuk akal; serta artefak gambar AI.',
      'Jangan menambahkan tekstur kulit secara berlebihan sampai wajah tampak kasar atau tidak alami.',
      'Prinsip utama: pertahankan tekstur kulit manusia yang autentik dan realisme fotografis tanpa mengubah identitas wajah subjek.',
    ],
  },
};

export const NYATA_PROMPT_DIRECTIVE = `NYATA RENDERING & FACE IDENTITY MANDATE (PRESET NYATA):
- FACE IDENTITY LOCK (${NYATA_STYLE_CONFIG.faceIdentityLock.shorthand}):
  * Gunakan gambar referensi yang diunggah sebagai acuan utama identitas wajah subjek.
  * Pertahankan identitas wajah asli secara konsisten, mencakup geometri dan proporsi wajah, bentuk mata, jarak antarmata, alis, kelopak mata, hidung, bibir, garis rahang, dagu, warna kulit, garis rambut, serta ciri khas wajah lainnya.
  * Pertahankan usia tampak asli dan karakteristik alami subjek. Jangan mengganti subjek dengan orang lain, mengubah bentuk wajah secara sewenang-wenang, mempercantik wajah secara berlebihan, atau membuat subjek tampak lebih tua maupun lebih muda.
  * Gambar referensi memiliki prioritas tertinggi dalam menentukan identitas. Deskripsi teks umum tidak boleh mengesampingkan ciri-ciri wajah yang terlihat pada referensi.
  * Prinsip utama: pertahankan identitas orang yang sama, bukan sekadar menghasilkan wajah yang mirip.
- NATURAL PHOTOREALISM & SKIN TEXTURE (${NYATA_STYLE_CONFIG.naturalPhotorealism.shorthand}):
  * Hasil akhir harus tampak seperti foto nyata yang diambil menggunakan kamera, bukan ilustrasi, lukisan digital, atau CGI.
  * Prioritaskan detail wajah yang tajam dan alami, pori-pori kulit yang realistis, garis halus serta ketidaksempurnaan kulit yang wajar, asimetri wajah autentik, detail rambut yang realistis, warna kulit alami, dan gradasi tonal yang meyakinkan.
  * Pertahankan pencahayaan, bayangan, pantulan cahaya, dan interaksi cahaya dengan lingkungan yang masuk akal secara fisik.
  * Hindari kulit terlalu halus, plastik, atau seperti lilin; beauty filter; penghalusan kulit digital berlebihan; detail wajah artifisial; penajaman berlebihan; distorsi wajah; anatomi tidak masuk akal; serta artefak gambar AI.
  * Jangan menambahkan tekstur kulit secara berlebihan sampai wajah tampak kasar atau tidak alami.
  * Prinsip utama: pertahankan tekstur kulit manusia yang autentik dan realisme fotografis tanpa mengubah identitas wajah subjek.`;

export const PHOTOGRAPHIC_STYLES: PhotographicStyleItem[] = [
  {
    id: 'nyata',
    name: 'Nyata',
    description: 'Mempertahankan identitas wajah sesuai referensi, tekstur kulit manusia yang autentik, detail anatomis alami, serta realisme fotografis tanpa efek kecantikan buatan.',
  },
  {
    id: 'photorealistic',
    name: 'Photorealistic',
    description: 'Convincing photo aesthetic, sensible natural lighting, authentic visual fidelity resembling real camera capture.',
  },
  {
    id: 'ultra-realistic',
    name: 'Ultra Realistic',
    description: 'Authentic micro-textures, visible skin pores & subtle imperfections, realistic eyelashes, hair strands, fabric fibers, and physically plausible lighting.',
    isMandatoryUltra: true,
  },
  {
    id: 'photorealism',
    name: 'Photorealism',
    shorthand: '/photorealism',
    description: 'Menghasilkan karakter visual seperti fotografi nyata dengan pencahayaan, bayangan, warna, perspektif, dan anatomi yang masuk akal.',
    promptDirective: 'Authentic camera-captured photography aesthetic with physically plausible lighting, natural shadows, realistic color grading, perspective depth, and sensible human anatomy.',
  },
  {
    id: 'maximum-detail',
    name: 'Maximum Detail',
    shorthand: '/maximum-detail',
    description: 'Memperkuat detail mata, rambut, tekstur kulit, pakaian, material, dan lingkungan dengan ketajaman alami tanpa penajaman berlebihan.',
    promptDirective: 'High-fidelity natural sharpness across eyes, irises, hair strands, garment fabrics, and environmental elements without artificial oversharpening.',
  },
  {
    id: 'natural-skin-texture',
    name: 'Natural Skin Texture',
    shorthand: '/natural-skin-texture',
    description: 'Mempertahankan pori-pori, garis halus, variasi tonal, dan ketidaksempurnaan kulit yang wajar, serta menghindari tampilan kulit plastik, lilin, atau terlalu halus.',
    promptDirective: 'Authentic human skin texture with visible pores, fine lines, subtle tonal variations, and realistic epidermal micro-details, strictly avoiding plastic, waxy, or overly smoothed airbrushed textures.',
  },
  {
    id: 'anti-ai-artifacts',
    name: 'Anti-AI Artifacts',
    shorthand: '/anti-ai-artifacts',
    description: 'Mengurangi distorsi wajah, tekstur artifisial, anatomi tidak wajar, dan inkonsistensi detail visual.',
    promptDirective: 'Zero AI artifacts, eliminating facial distortions, artificial waxy sheen, plastic smoothing, unnatural anatomy, and visual inconsistencies.',
  },
  {
    id: 'raw-photo',
    name: 'RAW Photo',
    description: 'Unprocessed camera look, natural non-destructive textures, realistic uncrushed colors, and balanced non-aggressive dynamic range.',
  },
  {
    id: 'cinematic-photography',
    name: 'Cinematic Photography',
    description: 'Directed lighting, atmospheric depth, cinematic framing, moody shadows, and deliberate narrative staging.',
  },
  {
    id: 'natural-camera',
    name: 'Natural Camera Rendering',
    description: 'Sensible perspective, natural ambient light, authentic depth of field, and unpolished realistic photography.',
  },
  {
    id: 'professional-editorial',
    name: 'Professional Editorial Photography',
    description: 'Magazine quality, controlled studio/location lighting, crisp material details, and refined editorial elegance.',
  },
  {
    id: 'high-detail',
    name: 'High Detail',
    description: 'Focused sharpness on eyes, hair strands, garment fabrics, and environmental elements without artificial oversharpening.',
  },
];

/**
 * Default Photographic Styles selected on initial application load or reset.
 * All 5 visual rendering styles active per reference:
 * Nyata, Photorealism, Maximum Detail, Natural Skin Texture, Anti-AI Artifacts.
 */
export const DEFAULT_PHOTOGRAPHIC_STYLES: string[] = [
  'Nyata',
  'Photorealism',
  'Maximum Detail',
  'Natural Skin Texture',
  'Anti-AI Artifacts',
];

/**
 * Returns active photographic shorthand tags (e.g. ['/photorealism', '/maximum-detail'])
 * for currently selected styles.
 */
export function getActivePhotographicShorthands(selectedStyles: string[]): string[] {
  const normalized = (selectedStyles || []).map((s) => s.toLowerCase().trim());
  const tags: string[] = [];
  for (const style of PHOTOGRAPHIC_STYLES) {
    if (style.shorthand) {
      if (
        normalized.includes(style.id.toLowerCase()) ||
        normalized.includes(style.name.toLowerCase()) ||
        normalized.includes(style.shorthand.toLowerCase())
      ) {
        tags.push(style.shorthand);
      }
    }
  }
  return tags;
}

/**
 * Returns active photographic style directives for prompt construction.
 */
export function getActivePhotographicDirectives(
  selectedStyles: string[]
): Array<{ id: string; name: string; tag: string; directive: string }> {
  const normalized = (selectedStyles || []).map((s) => s.toLowerCase().trim());
  const result: Array<{ id: string; name: string; tag: string; directive: string }> = [];
  for (const style of PHOTOGRAPHIC_STYLES) {
    if (style.shorthand && style.promptDirective) {
      if (
        normalized.includes(style.id.toLowerCase()) ||
        normalized.includes(style.name.toLowerCase()) ||
        normalized.includes(style.shorthand.toLowerCase())
      ) {
        result.push({
          id: style.id,
          name: style.name,
          tag: style.shorthand,
          directive: style.promptDirective,
        });
      }
    }
  }
  return result;
}

/* ==========================================================================
 * CUSTOM PHOTOGRAPHIC STYLES CONSTANTS, VALIDATORS, STORAGE & EXPORT/IMPORT
 * ========================================================================== */

export const STORAGE_KEY_CUSTOM_PHOTOGRAPHIC_STYLES = 'mature_prompt_studio_custom_photo_styles_v1';

export interface CustomPhotographicStyleValidationResult {
  valid: boolean;
  field?: 'name' | 'promptDirective';
  error?: string;
}

export function validateCustomPhotographicStyle(
  style: { name?: string; description?: string; promptDirective?: string; id?: string },
  existingStyles: CustomPhotographicStyle[],
  editingStyleId?: string
): CustomPhotographicStyleValidationResult {
  if (!style.name || !style.name.trim()) {
    return { valid: false, field: 'name', error: 'Nama gaya fotografi wajib diisi.' };
  }
  const normName = style.name.trim().toLowerCase();

  // Check collision with built-in styles
  const builtinMatch = PHOTOGRAPHIC_STYLES.find(
    (b) => b.name.toLowerCase() === normName || b.id.toLowerCase() === normName
  );
  if (builtinMatch) {
    return {
      valid: false,
      field: 'name',
      error: `Nama "${style.name}" bertabrakan dengan gaya fotografi bawaan (${builtinMatch.name}). Gunakan nama yang berbeda.`,
    };
  }

  // Check duplicate name with existing custom styles (excluding self when editing)
  const duplicate = existingStyles.find(
    (s) => s.id !== editingStyleId && s.name.trim().toLowerCase() === normName
  );
  if (duplicate) {
    return {
      valid: false,
      field: 'name',
      error: `Gaya fotografi kustom dengan nama "${style.name}" sudah ada. Gunakan nama yang unik.`,
    };
  }

  if (!style.promptDirective || !style.promptDirective.trim()) {
    return { valid: false, field: 'promptDirective', error: 'Instruksi prompt fotografi wajib diisi.' };
  }

  return { valid: true };
}

export function loadCustomPhotographicStylesFromStorage(): CustomPhotographicStyle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_PHOTOGRAPHIC_STYLES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.promptDirective === 'string'
    );
  } catch {
    return [];
  }
}

export function saveCustomPhotographicStylesToStorage(styles: CustomPhotographicStyle[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_PHOTOGRAPHIC_STYLES, JSON.stringify(styles));
  } catch (err) {
    console.error('Failed to save custom photographic styles to localStorage', err);
    throw err;
  }
}

export function exportCustomPhotographicStylesToJson(styles: CustomPhotographicStyle[]): string {
  const exportPayload: CustomPhotographicStylesExportFile = {
    format: 'mature-prompt-custom-photographic-styles',
    version: 1,
    exportedAt: new Date().toISOString(),
    totalStyles: styles.length,
    styles: styles.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description || '',
      promptDirective: s.promptDirective,
      enabled: Boolean(s.enabled),
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    })),
  };
  return JSON.stringify(exportPayload, null, 2);
}

export interface ImportPhotographicStylesConflictItem {
  type: 'same-id-same-content' | 'same-id-diff-content' | 'name-collision-existing' | 'name-collision-builtin';
  style: CustomPhotographicStyle;
  existingMatch?: CustomPhotographicStyle;
  message: string;
}

export interface ImportPhotographicStylesValidationResult {
  valid: boolean;
  totalParsed: number;
  validEntries: CustomPhotographicStyle[];
  invalidEntriesCount: number;
  errors: string[];
  conflicts: ImportPhotographicStylesConflictItem[];
}

export function validateImportPhotographicStylesJson(
  rawJson: string,
  existingStyles: CustomPhotographicStyle[]
): ImportPhotographicStylesValidationResult {
  const errors: string[] = [];
  const conflicts: ImportPhotographicStylesConflictItem[] = [];
  const validEntries: CustomPhotographicStyle[] = [];
  let invalidEntriesCount = 0;

  let parsed: any;
  try {
    parsed = JSON.parse(rawJson);
  } catch (e) {
    return {
      valid: false,
      totalParsed: 0,
      validEntries: [],
      invalidEntriesCount: 0,
      errors: ['Format file bukan JSON yang valid.'],
      conflicts: [],
    };
  }

  if (!parsed || typeof parsed !== 'object') {
    return {
      valid: false,
      totalParsed: 0,
      validEntries: [],
      invalidEntriesCount: 0,
      errors: ['Struktur file JSON tidak valid.'],
      conflicts: [],
    };
  }

  // Format header validation - strictly rejects non-photographic data (e.g. character locks file)
  if (parsed.format !== 'mature-prompt-custom-photographic-styles') {
    return {
      valid: false,
      totalParsed: 0,
      validEntries: [],
      invalidEntriesCount: 0,
      errors: [
        `Format file tidak sesuai: "${parsed.format || 'unknown'}". Diharapkan format "mature-prompt-custom-photographic-styles".`,
      ],
      conflicts: [],
    };
  }

  if (typeof parsed.version !== 'number' || parsed.version < 1) {
    return {
      valid: false,
      totalParsed: 0,
      validEntries: [],
      invalidEntriesCount: 0,
      errors: [`Versi format (${parsed.version}) tidak didukung.`],
      conflicts: [],
    };
  }

  if (!Array.isArray(parsed.styles)) {
    return {
      valid: false,
      totalParsed: 0,
      validEntries: [],
      invalidEntriesCount: 0,
      errors: ['Field "styles" harus berupa array daftar custom photographic styles.'],
      conflicts: [],
    };
  }

  const existingById = new Map(existingStyles.map((s) => [s.id, s]));
  const existingByName = new Map(existingStyles.map((s) => [s.name.trim().toLowerCase(), s]));

  const seenInFileById = new Set<string>();
  const seenInFileByName = new Set<string>();

  for (let i = 0; i < parsed.styles.length; i++) {
    const raw = parsed.styles[i];
    if (!raw || typeof raw !== 'object') {
      invalidEntriesCount++;
      errors.push(`Entri #${i + 1}: format entri tidak valid.`);
      continue;
    }

    const name = typeof raw.name === 'string' ? raw.name.trim() : '';
    const promptDirective = typeof raw.promptDirective === 'string' ? raw.promptDirective.trim() : '';
    const description = typeof raw.description === 'string' ? raw.description.trim() : '';
    const enabled = Boolean(raw.enabled);
    const id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : `custom-photo-${Date.now()}-${i}`;

    if (!name || !promptDirective) {
      invalidEntriesCount++;
      errors.push(`Entri #${i + 1} ("${name || 'Tanpa Nama'}"): Nama dan instruksi prompt fotografi wajib diisi.`);
      continue;
    }

    const normName = name.toLowerCase();

    // Check collision with built-in styles
    const builtinMatch = PHOTOGRAPHIC_STYLES.find(
      (b) => b.name.toLowerCase() === normName || b.id.toLowerCase() === normName
    );
    if (builtinMatch) {
      invalidEntriesCount++;
      errors.push(`Entri #${i + 1} ("${name}"): Nama bertabrakan dengan gaya fotografi bawaan (${builtinMatch.name}).`);
      continue;
    }

    // Duplicate name inside same file
    if (seenInFileByName.has(normName)) {
      invalidEntriesCount++;
      errors.push(`Entri #${i + 1} ("${name}"): Nama duplikat di dalam berkas impor.`);
      continue;
    }
    seenInFileByName.add(normName);
    seenInFileById.add(id);

    const styleObj: CustomPhotographicStyle = {
      id,
      name,
      description,
      promptDirective,
      enabled,
      createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : Date.now(),
      updatedAt: typeof raw.updatedAt === 'number' ? raw.updatedAt : Date.now(),
    };

    validEntries.push(styleObj);

    // Conflict detection against local collection
    const matchId = existingById.get(id);
    const matchName = existingByName.get(normName);

    if (matchId) {
      const isIdentical =
        matchId.name === styleObj.name &&
        matchId.promptDirective.trim() === styleObj.promptDirective.trim();

      if (isIdentical) {
        conflicts.push({
          type: 'same-id-same-content',
          style: styleObj,
          existingMatch: matchId,
          message: `ID "${id}" dan isi identik dengan gaya lokal "${matchId.name}".`,
        });
      } else {
        conflicts.push({
          type: 'same-id-diff-content',
          style: styleObj,
          existingMatch: matchId,
          message: `ID "${id}" sudah ada di lokal dengan konten berbeda ("${matchId.name}").`,
        });
      }
    } else if (matchName) {
      conflicts.push({
        type: 'name-collision-existing',
        style: styleObj,
        existingMatch: matchName,
        message: `Nama gaya "${name}" sudah digunakan oleh gaya lokal dengan ID berbeda.`,
      });
    }
  }

  return {
    valid: errors.length === 0 && validEntries.length > 0,
    totalParsed: parsed.styles.length,
    validEntries,
    invalidEntriesCount,
    errors,
    conflicts,
  };
}
