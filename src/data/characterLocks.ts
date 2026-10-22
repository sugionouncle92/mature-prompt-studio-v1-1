import type { CharacterLocksState, CharacterLockPreset } from '../types/index.ts';

export interface CharacterLockItem {
  key: keyof CharacterLocksState;
  tag: string;
  name: string;
  category: 'identity' | 'body' | 'outfit' | 'pose' | 'rendering';
  descriptionId: string;
  descriptionEn: string;
  promptInstruction: string;
  promptInstructionId: string;
  requiresReference: boolean;
  compatibilityGroup?: string;
}

export interface RegisteredAdditionalShorthand {
  tag: string;
  name: string;
  category: 'identity' | 'rendering';
  source: string;
  description: string;
}

/**
 * Single centralized configuration catalog for all 11 Character Locks.
 * Source of truth for UI toggle metadata, shorthand identifiers, and prompt engineering directives.
 */
export const CHARACTER_LOCKS_CONFIG: CharacterLockItem[] = [
  {
    key: 'facelock',
    tag: '/facelock 100%',
    name: 'Face Lock',
    category: 'identity',
    descriptionId: 'Mempertahankan struktur tulang wajah, identitas wajah, dan fitur unik dari prompt referensi.',
    descriptionEn: 'Preserves facial bone structure, facial identity, and recognizable features from the reference prompt.',
    promptInstruction: 'Strictly preserve the facial identity, facial bone structure, and distinctive facial features from the sample prompt.',
    promptInstructionId: 'Face Lock: Pertahankan identitas dan ciri-ciri wajah subjek berdasarkan foto referensi.',
    requiresReference: true,
    compatibilityGroup: 'face-identity',
  },
  {
    key: 'bodyshape',
    tag: '/bodyshape_lock',
    name: 'Body Shape Lock',
    category: 'body',
    descriptionId: 'Mempertahankan siluet tubuh, postur, tinggi, dan proporsi fisik karakter secara konsisten.',
    descriptionEn: 'Maintains exact body silhouette, build, height, and physical proportions consistently.',
    promptInstruction: 'Body Shape Lock: Strictly maintain the exact body silhouette, build, height, and physical proportions.',
    promptInstructionId: 'Body Shape Lock: Pertahankan siluet tubuh, postur, tinggi, dan proporsi fisik karakter secara konsisten.',
    requiresReference: true,
    compatibilityGroup: 'body-proportions',
  },
  {
    key: 'outfitlock',
    tag: '/outfitlock',
    name: 'Outfit Lock',
    category: 'outfit',
    descriptionId: 'Mengunci jenis busana, bahan kain, palet warna, dan motif pakaian agar tidak berubah.',
    descriptionEn: 'Locks the exact garment style, fabric material, color palette, and clothing patterns.',
    promptInstruction: 'Outfit Lock: Strictly keep the exact clothing style, cuts, fabric material, color palette, and garment details.',
    promptInstructionId: 'Outfit Lock: Pertahankan jenis pakaian, potongan, bahan, warna, dan motif sesuai referensi.',
    requiresReference: true,
    compatibilityGroup: 'outfit-preservation',
  },
  {
    key: 'poselock',
    tag: '/poselock',
    name: 'Pose Lock',
    category: 'pose',
    descriptionId: 'Menjaga pose utama tubuh, sikap berdiri/duduk, dan orientasi spasial inti.',
    descriptionEn: 'Retains the primary body stance, posture, and core spatial orientation.',
    promptInstruction: 'Pose Lock: Strictly retain the primary body stance, posture, and core spatial orientation.',
    promptInstructionId: 'Pose Lock: Menjaga pose utama tubuh, sikap berdiri/duduk, dan orientasi spasial inti.',
    requiresReference: false,
    compatibilityGroup: 'pose-stance',
  },
  {
    key: 'agepreserve',
    tag: '/agepreserve',
    name: 'Age Preserve',
    category: 'identity',
    descriptionId: 'Menegakkan kedewasaan karakter (jelas berusia 25 tahun ke atas) dan mencegah distorsi umur di bawah umur.',
    descriptionEn: 'Enforces adult maturity (strictly 25+ years old) and prevents youthful distortion.',
    promptInstruction: 'Age Preserve: Strictly preserve the adult age (clearly 25+ years old), maintaining authentic mature maturity.',
    promptInstructionId: 'Age Preserve: Menegakkan kedewasaan karakter dewasa (25+ tahun) secara konsisten.',
    requiresReference: false,
    compatibilityGroup: 'age-enforcement',
  },
  {
    key: 'expressionlock',
    tag: '/expressionlock',
    name: 'Expression Lock',
    category: 'identity',
    descriptionId: 'Mempertahankan ekspresi emosi dan wajah utama tanpa diubah oleh gaya cerita.',
    descriptionEn: 'Preserves the core emotional and facial expression without altering it for style.',
    promptInstruction: 'Strictly preserve the exact core facial expression.',
    promptInstructionId: 'Expression Lock: Mempertahankan ekspresi emosi dan wajah utama.',
    requiresReference: false,
    compatibilityGroup: 'expression-retention',
  },
  {
    key: 'hairlock',
    tag: '/hairlock',
    name: 'Hair Lock',
    category: 'identity',
    descriptionId: 'Menjaga gaya rambut, panjang, warna, tekstur, dan karakteristik rambut utama tetap utuh.',
    descriptionEn: 'Keeps hairstyle, length, color, texture, and distinctive hair features intact.',
    promptInstruction: 'Hair Lock: Strictly maintain the exact hairstyle, length, texture, and color.',
    promptInstructionId: 'Hair Lock: Pertahankan gaya rambut, panjang, warna, tekstur, dan garis rambut sesuai referensi.',
    requiresReference: true,
    compatibilityGroup: 'hair-retention',
  },
  {
    key: 'bodyproportionlock',
    tag: '/bodyproportionlock',
    name: 'Body Proportion Lock',
    category: 'body',
    descriptionId: 'Menjaga proporsi tubuh karakter tetap konsisten, termasuk perbandingan panjang torso, lengan, kaki, bahu, pinggang, dan ukuran anggota tubuh.',
    descriptionEn: 'Preserves consistent natural body proportions, limb lengths, torso-to-leg ratio, and overall physical proportions, preventing unintended proportional distortion.',
    promptInstruction: 'Body Proportion Lock: Preserve consistent natural body proportions, limb lengths, torso-to-leg ratio, and overall physical proportions.',
    promptInstructionId: 'Body Proportion Lock: Menjaga proporsi tubuh karakter tetap konsisten dan proporsional.',
    requiresReference: false,
    compatibilityGroup: 'body-proportions',
  },
  {
    key: 'anatomylock',
    tag: '/anatomylock',
    name: 'Anatomy Lock',
    category: 'body',
    descriptionId: 'Menjaga struktur anatomi manusia tetap masuk akal, termasuk jumlah dan bentuk anggota tubuh, posisi sendi, struktur tangan dan kaki, serta hubungan anatomis antarbagiannya.',
    descriptionEn: 'Maintains anatomically plausible human structure, correct limb count, joint articulation, and natural hand/foot anatomy without altering requested poses.',
    promptInstruction: 'Anatomy Lock: Maintain anatomically plausible human structure, correctly formed limbs and joints, and natural hand and foot anatomy.',
    promptInstructionId: 'Anatomy Lock: Menjaga struktur anatomi manusia, persendian, serta tangan dan kaki tetap realistis.',
    requiresReference: false,
    compatibilityGroup: 'anatomy-integrity',
  },
  {
    key: 'poseconsistency',
    tag: '/poseconsistency',
    name: 'Pose Consistency Lock',
    category: 'pose',
    descriptionId: 'Mempertahankan konsistensi pose, posisi anggota tubuh, arah badan, orientasi kepala, dan hubungan spasial antarbagiannya sesuai pose referensi atau instruksi pengguna.',
    descriptionEn: 'Preserves consistent pose, limb placement, body orientation, head angle, and spatial relationships matching reference poses or user instructions.',
    promptInstruction: 'Pose Consistency Lock: Preserve the specified reference pose, body orientation, limb placement, and spatial relationships.',
    promptInstructionId: 'Pose Consistency Lock: Mempertahankan konsistensi pose, orientasi badan, dan posisi anggota tubuh.',
    requiresReference: false,
    compatibilityGroup: 'pose-stance',
  },
  {
    key: 'perspectivecorrection',
    tag: '/perspectivecorrection',
    name: 'Perspective Correction Lock',
    category: 'rendering',
    descriptionId: 'Menjaga perspektif kamera, hubungan ukuran relatif antara bagian tubuh, arah pandang, dan konsistensi geometri visual agar tidak terjadi distorsi perspektif yang tidak diinginkan.',
    descriptionEn: 'Maintains coherent camera perspective, relative anatomical scaling, gaze direction, and visual geometric consistency without unintended optical distortion.',
    promptInstruction: 'Maintain coherent camera perspective and natural relative proportions without unintended perspective distortion, while fully honoring requested creative camera angles.',
    promptInstructionId: 'Perspective Correction Lock: Menjaga perspektif kamera dan konsistensi geometri visual tanpa distorsi.',
    requiresReference: false,
    compatibilityGroup: 'perspective-integrity',
  },
  {
    key: 'identitylock',
    tag: '/identitylock',
    name: 'Identity Lock',
    category: 'identity',
    descriptionId: 'Mempertahankan identitas wajah berdasarkan foto referensi, termasuk proporsi wajah, bentuk mata, hidung, bibir, rahang, warna kulit, garis rambut, dan ciri khas subjek.',
    descriptionEn: 'Preserves facial identity based on reference photo, including facial proportions, eye shape, nose, lips, jawline, skin tone, hairline, and unique characteristics.',
    promptInstruction: 'Identity Lock: Strictly preserve subject facial identity based on the reference photo, including facial proportions, eye shape, nose, lips, jawline, skin tone, hairline, and unique facial characteristics.',
    promptInstructionId: 'Identity Lock: Mempertahankan identitas wajah berdasarkan foto referensi, proporsi wajah, bentuk mata, hidung, bibir, rahang, warna kulit, dan garis rambut.',
    requiresReference: true,
    compatibilityGroup: 'face-identity',
  },
  {
    key: 'referencepriority',
    tag: '/referencepriority',
    name: 'Reference Priority',
    category: 'identity',
    descriptionId: 'Memprioritaskan karakteristik visual yang relevan pada gambar referensi dibandingkan deskripsi teks umum yang bertentangan dengannya.',
    descriptionEn: 'Prioritizes relevant visual characteristics in the reference image over conflicting generic text descriptions.',
    promptInstruction: 'Reference Priority: Prioritize relevant visual characteristics in the reference image over conflicting generic text descriptions.',
    promptInstructionId: 'Reference Priority: Memprioritaskan karakteristik visual yang relevan pada gambar referensi dibandingkan deskripsi teks umum yang bertentangan dengannya.',
    requiresReference: true,
    compatibilityGroup: 'reference-priority',
  },
  {
    key: 'facialconsistency',
    tag: '/facial-consistency',
    name: 'Facial Consistency',
    category: 'identity',
    descriptionId: 'Menjaga konsistensi identitas, proporsi, fitur wajah, usia tampak, dan karakteristik alami subjek berdasarkan referensi.',
    descriptionEn: 'Maintains consistency of identity, proportions, facial features, apparent age, and natural characteristics based on reference.',
    promptInstruction: 'Facial Consistency: Maintain strict consistency of facial identity, proportions, facial features, apparent age, and natural characteristics matching the reference.',
    promptInstructionId: 'Facial Consistency: Menjaga konsistensi identitas, proporsi, fitur wajah, usia tampak, dan karakteristik alami subjek berdasarkan referensi.',
    requiresReference: true,
    compatibilityGroup: 'face-identity',
  },
];

/**
 * Additional registered shorthands configured in the application (e.g. from photographic preset "Nyata").
 */
export const REGISTERED_ADDITIONAL_SHORTHANDS: RegisteredAdditionalShorthand[] = [
  {
    tag: '/identitylock',
    name: 'Identity Lock',
    category: 'identity',
    source: 'Nyata Preset',
    description: 'Master face identity lock prioritizing uploaded reference image.',
  },
  {
    tag: '/master-face-lock',
    name: 'Master Face Lock',
    category: 'identity',
    source: 'Nyata Preset',
    description: 'Inviolable facial likeness anchor.',
  },
  {
    tag: '/referencepriority',
    name: 'Reference Priority',
    category: 'identity',
    source: 'Nyata Preset',
    description: 'Enforces reference image features over generic text descriptors.',
  },
  {
    tag: '/facial-consistency',
    name: 'Facial Consistency',
    category: 'identity',
    source: 'Nyata Preset',
    description: 'Consistency of facial bone structure, eyes, nose, and lips across variations.',
  },
  {
    tag: '/photorealism',
    name: 'Photorealism',
    category: 'rendering',
    source: 'Nyata Preset',
    description: 'Authentic camera capture rendering without CGI/painting aesthetic.',
  },
  {
    tag: '/maximum-detail',
    name: 'Maximum Detail',
    category: 'rendering',
    source: 'Nyata Preset',
    description: 'High-fidelity skin pores, natural moisture reflections, and iris details.',
  },
  {
    tag: '/natural-skin-texture',
    name: 'Natural Skin Texture',
    category: 'rendering',
    source: 'Nyata Preset',
    description: 'Authentic human epidermis with visible pores, subtle lines, anti-waxy.',
  },
  {
    tag: '/anti-ai-artifacts',
    name: 'Anti AI Artifacts',
    category: 'rendering',
    source: 'Nyata Preset',
    description: 'Strict prohibition of plastic smoothing, fake digital grain, and beauty filters.',
  },
];

/**
 * Returns active CharacterLockItem objects based on state.
 */
export function getActiveLocks(locks: CharacterLocksState): CharacterLockItem[] {
  return CHARACTER_LOCKS_CONFIG.filter((item) => Boolean(locks[item.key]));
}

/**
 * Returns active shorthand tags, e.g. ['/facelock 100%', '/bodyshape_lock', ...].
 */
export function getActiveLockTags(locks: CharacterLocksState): string[] {
  return getActiveLocks(locks).map((item) => item.tag);
}

export interface IntegrateShorthandsOptions {
  isNyata?: boolean;
  photoStyles?: string[];
  storyStyle?: string;
  hasFaceReference?: boolean;
}

/**
 * Builds deduplicated natural language instructions from active Character Locks and optional presets.
 * If two locks overlap (e.g. bodyshape and bodyproportionlock, or multiple face identity locks),
 * they are merged cleanly into a single authoritative directive without duplicating text.
 */
export function buildDeduplicatedLockDirectives(
  locks: CharacterLocksState,
  optionsOrNyata?: boolean | string[] | IntegrateShorthandsOptions
): string[] {
  let isNyata = false;
  let photoStyles: string[] = [];
  let storyStyle = '';
  let hasFaceReference = true; // default true if unspecified to preserve existing behavior

  if (typeof optionsOrNyata === 'boolean') {
    isNyata = optionsOrNyata;
  } else if (Array.isArray(optionsOrNyata)) {
    photoStyles = optionsOrNyata;
  } else if (optionsOrNyata && typeof optionsOrNyata === 'object') {
    isNyata = Boolean(optionsOrNyata.isNyata);
    photoStyles = optionsOrNyata.photoStyles || [];
    storyStyle = optionsOrNyata.storyStyle || '';
    if (optionsOrNyata.hasFaceReference !== undefined) {
      hasFaceReference = optionsOrNyata.hasFaceReference;
    }
  }

  const directives: string[] = [];

  // Check non-photographic style conflict:
  const nonPhotoRegex = /^(?:anime|manga|comic|cartoon|illustration|watercolor|oil painting|pixel art|sketch|line art|vector|chibi)/i;
  const isExplicitNonPhoto = nonPhotoRegex.test(storyStyle.trim());

  // 1. Face Identity Locks (facelock, identitylock, facialconsistency + optional Nyata)
  const hasFaceLocks = locks.facelock || locks.identitylock || locks.facialconsistency || isNyata;
  if (hasFaceLocks) {
    const activeFaceCount =
      (locks.facelock ? 1 : 0) +
      (locks.identitylock ? 1 : 0) +
      (locks.facialconsistency ? 1 : 0) +
      (isNyata ? 1 : 0);

    const refClause = hasFaceReference ? 'matching the reference photo and prompt' : 'throughout the scene';

    if (activeFaceCount > 1) {
      directives.push(
        `Face Identity Lock: Strictly preserve subject facial identity, facial consistency, bone structure, eye shape, facial proportions, apparent age, and distinctive features ${refClause} with maximum fidelity.`
      );
    } else if (locks.identitylock) {
      directives.push(
        `Identity Lock: Strictly preserve facial identity, proportions, eye shape, nose, lips, jawline, skin tone, hairline, and unique characteristics ${refClause}.`
      );
    } else if (locks.facialconsistency) {
      directives.push(
        `Facial Consistency Lock: Maintain strict consistency of facial identity, proportions, facial features, apparent age, and natural characteristics ${refClause}.`
      );
    } else if (locks.facelock) {
      directives.push(
        `Face Lock: Strictly preserve facial bone structure, facial identity, eye shape, and recognizable features from reference.`
      );
    } else if (isNyata) {
      directives.push(
        hasFaceReference
          ? 'Face Identity Lock: Prioritize uploaded reference image as the primary identity anchor for facial geometry and features.'
          : 'Face Identity Lock: Maintain consistent facial geometry and recognizable features throughout all scene variations.'
      );
    }
  }

  // 1b. Reference Priority Lock
  if (locks.referencepriority) {
    if (hasFaceReference) {
      directives.push(
        'Reference Priority: Prioritize relevant visual characteristics in the reference image over conflicting generic text descriptions.'
      );
    } else {
      directives.push(
        'Reference Priority: Prioritize concrete visual descriptors and established subject identity over conflicting generic text descriptions.'
      );
    }
  }

  // 2. Body Shape & Body Proportion Lock
  if (locks.bodyshape && locks.bodyproportionlock) {
    directives.push(
      'Body & Proportion Lock: Strictly maintain exact body silhouette, build, height, and natural torso-to-limb proportions without distortion.'
    );
  } else if (locks.bodyshape) {
    directives.push(
      'Body Shape Lock: Strictly maintain the exact body silhouette, build, height, and physical proportions.'
    );
  } else if (locks.bodyproportionlock) {
    directives.push(
      'Body Proportion Lock: Preserve consistent natural body proportions, limb lengths, torso-to-leg ratio, and overall physical proportions.'
    );
  }

  // 3. Outfit Lock
  if (locks.outfitlock) {
    directives.push(
      'Outfit Lock: Strictly keep the exact clothing style, cuts, fabric material, color palette, and garment details.'
    );
  }

  // 4. Pose Lock & Pose Consistency
  if (locks.poselock && locks.poseconsistency) {
    directives.push(
      'Pose Lock & Consistency: Strictly retain primary body posture, stance, limb placement, body orientation, and core spatial relationships.'
    );
  } else if (locks.poselock) {
    directives.push(
      'Pose Lock: Strictly retain the primary body stance, posture, and core spatial orientation.'
    );
  } else if (locks.poseconsistency) {
    directives.push(
      'Pose Consistency Lock: Preserve the specified reference pose, body orientation, limb placement, and spatial relationships.'
    );
  }

  // 5. Age Preserve
  if (locks.agepreserve) {
    directives.push(
      'Age Preserve: Strictly preserve adult maturity (clearly 25+ years old), maintaining authentic mature appearance without youthful distortion.'
    );
  }

  // 6. Hair Lock
  if (locks.hairlock) {
    directives.push(
      'Hair Lock: Strictly maintain the exact hairstyle, length, texture, and color.'
    );
  }

  // 7. Expression Lock
  if (locks.expressionlock) {
    directives.push(
      'Expression Lock: Strictly preserve the exact core facial expression and emotional mood.'
    );
  }

  // 8. Anatomy Lock
  if (locks.anatomylock) {
    directives.push(
      'Anatomy Lock: Maintain anatomically plausible human structure, correctly formed limbs and joints, and natural hand and foot anatomy.'
    );
  }

  // 9. Perspective Correction Lock
  if (locks.perspectivecorrection) {
    directives.push(
      'Perspective Correction Lock: Maintain coherent camera perspective, gaze direction, and visual geometric consistency without unintended optical distortion.'
    );
  }

  // 10. Photographic Shorthand Styles Directives (if selected and not in conflict with explicit non-photographic style)
  if (!isExplicitNonPhoto && photoStyles.length > 0) {
    const norm = photoStyles.map((s) => s.toLowerCase().trim());
    const hasPhotorealism = norm.includes('photorealism') || norm.includes('/photorealism');
    const hasMaxDetail = norm.includes('maximum detail') || norm.includes('/maximum-detail');
    const hasSkinTexture = norm.includes('natural skin texture') || norm.includes('/natural-skin-texture');
    const hasAntiArtifacts =
      norm.includes('anti-ai-artifacts') ||
      norm.includes('anti-ai artifacts') ||
      norm.includes('/anti-ai-artifacts');

    // Deduplication with Nyata: if Nyata is already on, its master directive already encompasses skin texture and photorealism
    if (hasPhotorealism && !isNyata) {
      directives.push(
        'Photorealism: Authentic camera-captured photography aesthetic with physically plausible lighting, natural shadows, realistic color grading, perspective depth, and sensible human anatomy.'
      );
    }

    if (hasSkinTexture && !isNyata) {
      directives.push(
        'Natural Skin Texture: Authentic human skin texture with visible pores, fine lines, subtle tonal variations, and realistic epidermal micro-details, strictly avoiding plastic, waxy, or overly smoothed airbrushed textures.'
      );
    }

    if (hasMaxDetail) {
      directives.push(
        'Maximum Detail: High-fidelity natural sharpness across eyes, irises, hair strands, garment fabrics, and environmental elements without artificial oversharpening.'
      );
    }

    if (hasAntiArtifacts && !isNyata) {
      directives.push(
        'Anti-AI Artifacts: Zero AI artifacts, eliminating facial distortions, artificial waxy sheen, plastic smoothing, unnatural anatomy, and visual inconsistencies.'
      );
    }
  }

  return directives;
}

/**
 * Deterministically integrates expanded active shorthand instructions into the final prompt text.
 * - Extracts and preserves any trailing aspect ratio parameter (--ar <ratio>).
 * - Avoids duplicate sentence injection if already present.
 * - If no locks/styles are active, leaves the prompt clean without inserting unwanted constraints.
 */
export function integrateActiveShorthandsIntoPrompt(
  prompt: string,
  locks: CharacterLocksState,
  optionsOrNyata?: boolean | string[] | IntegrateShorthandsOptions
): string {
  const activeCount = Object.values(locks).filter(Boolean).length;
  let hasStylesOrNyata = false;

  if (typeof optionsOrNyata === 'boolean') {
    hasStylesOrNyata = optionsOrNyata;
  } else if (Array.isArray(optionsOrNyata)) {
    hasStylesOrNyata = optionsOrNyata.length > 0;
  } else if (optionsOrNyata && typeof optionsOrNyata === 'object') {
    hasStylesOrNyata = Boolean(optionsOrNyata.isNyata || (optionsOrNyata.photoStyles && optionsOrNyata.photoStyles.length > 0));
  }

  if (activeCount === 0 && !hasStylesOrNyata) {
    return prompt.trim();
  }

  const directives = buildDeduplicatedLockDirectives(locks, optionsOrNyata);
  if (directives.length === 0) {
    return prompt.trim();
  }

  // Separate trailing --ar parameter if present
  let cleanPrompt = prompt.trim();
  let trailingAr = '';
  const arMatch = cleanPrompt.match(/(?:--ar|--aspect-ratio)[:\s]+(\d+(?::\d+|\.\d+)?)\s*$/i);
  if (arMatch) {
    trailingAr = `--ar ${arMatch[1]}`;
    cleanPrompt = cleanPrompt.slice(0, arMatch.index).trim();
    if (cleanPrompt.endsWith(',')) {
      cleanPrompt = cleanPrompt.slice(0, -1).trim();
    }
  }

  // Check which directives need to be appended (avoid redundant sentences)
  const missingDirectives = directives.filter((d) => {
    // Check if key phrase from directive is already in the prompt
    const prefix = d.split(':')[0].toLowerCase();
    return !cleanPrompt.toLowerCase().includes(prefix);
  });

  if (missingDirectives.length === 0) {
    return trailingAr ? `${cleanPrompt} ${trailingAr}` : cleanPrompt;
  }

  const directivesText = missingDirectives.join('. ') + '.';
  const separator = cleanPrompt.endsWith('.') ? ' ' : '. ';
  const combined = `${cleanPrompt}${separator}${directivesText}`.replace(/\.{2,}/g, '.').trim();

  return trailingAr ? `${combined} ${trailingAr}` : combined;
}

export const STORAGE_KEY_CHARACTER_LOCK_PRESETS = 'mature_prompt_studio_lock_presets_v1';
export const STORAGE_KEY_ACTIVE_LOCK_PRESET_ID = 'mature_prompt_studio_active_preset_id_v1';

/**
 * Built-in standard configuration presets for Character Locks.
 * These act as reference templates that can be loaded, customized, or restored to defaults.
 */
export const BUILTIN_CHARACTER_LOCK_PRESETS: CharacterLockPreset[] = [
  {
    id: 'preset-01-realistis',
    name: '01. Realistis',
    description: 'Mempertahankan identitas dan penampilan karakter agar hasil gambar fotorealistis tetap konsisten.',
    isBuiltIn: true,
    locks: {
      facelock: true,
      bodyshape: true,
      outfitlock: true,
      poselock: false,
      agepreserve: true,
      expressionlock: false,
      hairlock: true,
      bodyproportionlock: true,
      anatomylock: true,
      poseconsistency: false,
      perspectivecorrection: false,
      identitylock: true,
      referencepriority: false,
      facialconsistency: true,
    },
    updatedAt: 1700000000000,
  },
  {
    id: 'preset-02-anime-to-realis',
    name: '02. Anime to Realis',
    description: 'Mengubah karakter anime menjadi manusia fotorealistis sambil mempertahankan ciri khas karakter yang relevan.',
    isBuiltIn: true,
    locks: {
      facelock: true,
      bodyshape: true,
      outfitlock: true,
      poselock: true,
      agepreserve: true,
      expressionlock: false,
      hairlock: true,
      bodyproportionlock: true,
      anatomylock: true,
      poseconsistency: false,
      perspectivecorrection: true,
      identitylock: true,
      referencepriority: true,
      facialconsistency: true,
    },
    updatedAt: 1700000000000,
  },
  {
    id: 'preset-03-identitas-wajah',
    name: '03. Identitas Wajah',
    description: 'Fokus mengunci identitas wajah, usia, dan rambut subjek dengan kebebasan penuh pada pose, busana, dan anatomi.',
    isBuiltIn: true,
    locks: {
      facelock: true,
      bodyshape: false,
      outfitlock: false,
      poselock: false,
      agepreserve: true,
      expressionlock: false,
      hairlock: true,
      bodyproportionlock: false,
      anatomylock: false,
      poseconsistency: false,
      perspectivecorrection: false,
      identitylock: true,
      referencepriority: true,
      facialconsistency: true,
    },
    updatedAt: 1700000000000,
  },
  {
    id: 'preset-04-outfit-pose',
    name: '04. Outfit & Pose',
    description: 'Mengunci busana, postur tubuh, dan sudut pandang secara ketat untuk variasi pencahayaan atau latar belakang.',
    isBuiltIn: true,
    locks: {
      facelock: false,
      bodyshape: true,
      outfitlock: true,
      poselock: true,
      agepreserve: false,
      expressionlock: false,
      hairlock: false,
      bodyproportionlock: true,
      anatomylock: true,
      poseconsistency: true,
      perspectivecorrection: true,
      identitylock: false,
      referencepriority: false,
      facialconsistency: false,
    },
    updatedAt: 1700000000000,
  },
  {
    id: 'preset-05-default',
    name: '05. Default Studio',
    description: 'Konfigurasi standar bawaan Mature Prompt Studio (11 lock aktif, 3 nonaktif).',
    isBuiltIn: true,
    locks: {
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
    },
    updatedAt: 1700000000000,
  },
];

/**
 * Checks whether two CharacterLocksState objects have identical toggle values across all 14 locks.
 */
export function areLocksEqual(a?: CharacterLocksState | null, b?: CharacterLocksState | null): boolean {
  if (!a || !b) return false;
  const lockKeys: (keyof CharacterLocksState)[] = [
    'facelock',
    'bodyshape',
    'outfitlock',
    'poselock',
    'agepreserve',
    'expressionlock',
    'hairlock',
    'bodyproportionlock',
    'anatomylock',
    'poseconsistency',
    'perspectivecorrection',
    'identitylock',
    'referencepriority',
    'facialconsistency',
  ];
  return lockKeys.every((k) => Boolean(a[k]) === Boolean(b[k]));
}

/**
 * Finds built-in preset template by its ID.
 */
export function getBuiltinPresetById(id: string): CharacterLockPreset | undefined {
  return BUILTIN_CHARACTER_LOCK_PRESETS.find((p) => p.id === id);
}

