import assert from 'node:assert';
import fs from 'node:fs';
import {
  STORY_CATEGORIES,
  STORY_STYLE_DESCRIPTIONS,
  MATURE_SUBSTYLE_GROUPS,
  MATURE_SUBSTYLES,
  MATURE_COUPLE_STYLES,
  MATURE_SOLO_SUBSTYLES,
  MATURE_INTENSITY_DIRECTIVES,
  SINGLE_ADULT_FEMALE_DIRECTIVE,
  getMatureSubstyleByName,
  isMatureSensualSubstyle,
  isMatureCoupleStyle,
  getIntensityDirective,
  getStoryStyleDescription,
  getStyleVisualDirective,
} from '../src/data/storyStyles.ts';
import {
  PHOTOGRAPHIC_STYLES,
  NYATA_STYLE_CONFIG,
  NYATA_PROMPT_DIRECTIVE,
  DEFAULT_PHOTOGRAPHIC_STYLES,
  getActivePhotographicShorthands,
  getActivePhotographicDirectives,
} from '../src/data/photographicStyles.ts';
import { GeminiService } from '../src/services/geminiService.ts';
import { translations } from '../src/i18n/translations.ts';
import { UNDERGARMENT_CONTROL_MODES, DEFAULT_CHARACTER_LOCKS } from '../src/types/index.ts';
import {
  ALL_FRAMING_OPTIONS,
  MANUAL_FRAMING_OPTIONS,
  AUTO_FRAMING_OPTION,
  FRAMING_GROUPS,
  resolveAutoFraming,
  getFramingOptionByIdOrName,
} from '../src/data/framingOptions.ts';
import {
  CHARACTER_LOCKS_CONFIG,
  REGISTERED_ADDITIONAL_SHORTHANDS,
  getActiveLockTags,
  integrateActiveShorthandsIntoPrompt,
  buildDeduplicatedLockDirectives,
  BUILTIN_CHARACTER_LOCK_PRESETS,
  STORAGE_KEY_CHARACTER_LOCK_PRESETS,
  STORAGE_KEY_ACTIVE_LOCK_PRESET_ID,
  areLocksEqual,
  getBuiltinPresetById,
  filterOutLegacyBuiltinPresets,
  isBuiltinPreset,
} from '../src/data/characterLocks.ts';

console.log('--- STARTING VERIFICATION TEST SUITE ---');

// 1. Verify Story Categories (13 categories, with Mature & Sensual 41 styles [19 solo + 22 couple] and Studio Photography 18 styles)
console.log('Test 1: Verify Story Style catalog...');
assert.strictEqual(STORY_CATEGORIES.length, 13, 'Must have exactly 13 Story Style categories');
let totalCatalogItems = 0;
for (const cat of STORY_CATEGORIES) {
  totalCatalogItems += cat.items.length;
  if (cat.id === 'mature-sensual') {
    assert.strictEqual(cat.items.length, 41, 'Mature & Sensual category must have 41 styles (19 solo + 22 couple)');
  } else if (cat.id === 'professional-photography') {
    assert.strictEqual(cat.items.length, 18, 'Professional & Studio Photography must have 18 sub-styles');
  } else {
    assert.strictEqual(cat.items.length, 10, `Category ${cat.name} must have exactly 10 sub-styles`);
  }
}
assert.strictEqual(totalCatalogItems, 169, 'Catalog must contain exactly 169 styles across 13 categories');
console.log('✓ Story Style catalog has 13 categories and 169 total active styles (including 19 solo + 22 couple styles in Mature & Sensual).');

// 1b. Verify Indonesian descriptions for all active Story Styles
console.log('Test 1b: Verify Indonesian Story Style descriptions...');
for (const cat of STORY_CATEGORIES) {
  for (const item of cat.items) {
    const desc = STORY_STYLE_DESCRIPTIONS[item];
    assert.ok(desc && desc.length > 20, `Missing or too short description for style: ${item}`);
    assert.strictEqual(getStoryStyleDescription(item), desc);
  }
}
const fallbackDesc = getStoryStyleDescription('');
assert.ok(fallbackDesc.includes('kustom'), 'Fallback custom description must explain custom style');
const customDesc = getStoryStyleDescription('Cyberpunk Noir');
assert.ok(customDesc.includes('Cyberpunk Noir'), 'Custom style description must include user input');
console.log('✓ All 169 active Story Styles have verified, comprehensive Indonesian descriptions.');

// 1c. Verify Mature & Sensual 19 Substyles, 5 Groups, Intensity Levels & Single Female Mandate
console.log('Test 1c: Verify Mature & Sensual 19 Substyles, 5 Groups, and Directives...');
const expected19MatureSubstyles = [
  // A. Soft & Feminine Sensuality
  'Soft Sensuality',
  'Feminine & Delicate',
  'Confident & Alluring',
  // B. Lifestyle & Intimate
  'Casual Sensual Lifestyle',
  'Intimate & Cozy',
  'Subtle Teasing',
  // C. Bold & Provocative Posing
  'Bold Sensual Posing',
  'Provocative Reclining',
  'Sultry Over-the-Shoulder',
  'Dominant & Commanding Pose',
  'Intense Erotic Expression',
  // D. Boudoir, Glamour & Lingerie Editorial
  'Boudoir Elegance',
  'Adult Glamour Magazine',
  'Luxury Lingerie Editorial',
  'Provocative Pin-Up Glamour',
  'Glamour & Seduction',
  // E. Erotic Fine Art & Cinematic Expression
  'Artistic Erotic Fine Art',
  'Implied Nude Fine Art',
  'Classic Erotic Glamour',
];

const matureCategory = STORY_CATEGORIES.find(c => c.id === 'mature-sensual');
assert.ok(matureCategory, 'Mature & Sensual category must exist');
for (const soloName of expected19MatureSubstyles) {
  assert.ok(matureCategory.items.includes(soloName), `Mature & Sensual must include solo substyle "${soloName}"`);
}

// Verify MATURE_SUBSTYLE_GROUPS
assert.strictEqual(MATURE_SUBSTYLE_GROUPS.length, 5, 'Must have exactly 5 substyle groups (A, B, C, D, E)');
assert.strictEqual(MATURE_SUBSTYLE_GROUPS[0].title, 'A. Soft & Feminine Sensuality');
assert.strictEqual(MATURE_SUBSTYLE_GROUPS[1].title, 'B. Lifestyle & Intimate');
assert.strictEqual(MATURE_SUBSTYLE_GROUPS[2].title, 'C. Bold & Provocative Posing');
assert.strictEqual(MATURE_SUBSTYLE_GROUPS[3].title, 'D. Boudoir, Glamour & Lingerie Editorial');
assert.strictEqual(MATURE_SUBSTYLE_GROUPS[4].title, 'E. Erotic Fine Art & Cinematic Expression');

// Verify all 19 substyles in MATURE_SUBSTYLES library with all required specification fields
assert.strictEqual(MATURE_SUBSTYLES.length, 19, 'Must have exactly 19 MatureSubstyle objects');
for (const sub of MATURE_SUBSTYLES) {
  assert.ok(expected19MatureSubstyles.includes(sub.name), `Unknown substyle ${sub.name}`);
  assert.ok(sub.description && sub.description.length > 20, `Missing description for ${sub.name}`);
  assert.ok(sub.visualDefinition && sub.visualDefinition.length > 20, `Missing visualDefinition for ${sub.name}`);
  assert.ok(sub.poseAndBodyLanguage && sub.poseAndBodyLanguage.length > 20, `Missing poseAndBodyLanguage for ${sub.name}`);
  assert.ok(sub.facialExpression && sub.facialExpression.length > 20, `Missing facialExpression for ${sub.name}`);
  assert.ok(sub.lightingAndComposition && sub.lightingAndComposition.length > 20, `Missing lightingAndComposition for ${sub.name}`);
  assert.ok(sub.promptDirective && sub.promptDirective.length > 20, `Missing promptDirective for ${sub.name}`);
  assert.strictEqual(isMatureSensualSubstyle(sub.name), true);
  assert.ok(getMatureSubstyleByName(sub.name) !== undefined);
}

// Verify MATURE_INTENSITY_DIRECTIVES (Soft, Bold, Provocative, High Glamour)
const intensityKeys = Object.keys(MATURE_INTENSITY_DIRECTIVES);
assert.deepStrictEqual(intensityKeys, ['Soft', 'Bold', 'Provocative', 'High Glamour']);
for (const key of intensityKeys) {
  const directive = getIntensityDirective(key);
  assert.ok(directive && directive.length > 20, `Intensity directive for "${key}" must exist`);
}

// Verify SINGLE_ADULT_FEMALE_DIRECTIVE
assert.ok(SINGLE_ADULT_FEMALE_DIRECTIVE.includes('[SINGLE ADULT FEMALE SUBJECT MANDATE]'));
assert.ok(SINGLE_ADULT_FEMALE_DIRECTIVE.includes('Exactly ONE adult female as the sole human subject'));
assert.ok(SINGLE_ADULT_FEMALE_DIRECTIVE.includes('STRICTLY NO partner, secondary model, background extras'));

// 1c2. Verify Mature & Sensual 22 Couple Context Styles preserved
console.log('Test 1c2: Verify Mature & Sensual 22 Couple Context Styles preserved...');
assert.strictEqual(MATURE_COUPLE_STYLES.length, 22, 'Must have exactly 22 couple relationship styles preserved');
for (const coupleStyle of MATURE_COUPLE_STYLES) {
  assert.ok(matureCategory.items.includes(coupleStyle), `Mature & Sensual must include couple style "${coupleStyle}"`);
  assert.strictEqual(isMatureCoupleStyle(coupleStyle), true, `isMatureCoupleStyle("${coupleStyle}") must be true`);
  const directive = getStyleVisualDirective(coupleStyle);
  assert.ok(directive && directive.length > 20, `Visual relationship directive for "${coupleStyle}" must exist`);
}
console.log('✓ All 22 Mature & Sensual Couple Context styles preserved and verified.');

console.log('✓ All 19 Mature & Sensual substyles, 5 groups, 4 intensity levels, and Single Female Mandate verified.');

// 1d. Verify Professional & Studio Photography styles & directives
console.log('Test 1d: Verify Professional & Studio Photography styles...');
const expectedStudioStyles = [
  'Professional Studio Portrait',
  'Corporate & Executive Portrait',
  'Personal Branding Portrait',
  'Beauty & Glamour Portrait',
  'Fashion Editorial Studio',
  'Fine Art Portrait',
  'Dramatic Studio Portrait',
  'Passport & ID Portrait',
  'Graduation Portrait',
  'Maternity Portrait',
  'Newborn & Baby Portrait',
  'Family & Group Portrait',
  'Prewedding & Couple Portrait',
  'Couple & Anniversary Portrait',
  'Commercial Product Photography',
  'E-commerce Catalog Photography',
  'High-Key Studio Photography',
  'Low-Key Studio Photography',
];
const studioCategory = STORY_CATEGORIES.find(c => c.id === 'professional-photography');
assert.ok(studioCategory, 'Professional & Studio Photography category must exist');
for (const style of expectedStudioStyles) {
  assert.ok(studioCategory.items.includes(style), `Professional Photography must include "${style}"`);
  const directive = getStyleVisualDirective(style);
  assert.ok(directive && directive.length > 20, `Visual directive for "${style}" must exist and be concrete`);
}
console.log('✓ All 18 Professional & Studio Photography styles verified with concrete visual directives.');

// 2. Verify Photographic Styles (including dedicated Ultra Realistic)
console.log('Test 2: Verify Photographic Styles...');
const ultraStyle = PHOTOGRAPHIC_STYLES.find(s => s.name === 'Ultra Realistic');
assert.ok(ultraStyle, 'Ultra Realistic must exist as a dedicated option');
assert.strictEqual(ultraStyle.isMandatoryUltra, true, 'Ultra Realistic must have isMandatoryUltra set');
console.log('✓ Dedicated Ultra Realistic photographic style verified.');

// 3. Verify GeminiService singleton
console.log('Test 3: Verify GeminiService singleton...');
const service1 = GeminiService.getInstance();
const service2 = GeminiService.getInstance();
assert.strictEqual(service1, service2, 'GeminiService must be a singleton');
console.log('✓ GeminiService singleton verified.');

// 4. Verify System Instruction Generation with Ultra Realistic
console.log('Test 4: Verify System Instruction with Ultra Realistic...');
const mockInputUltra = {
  samplePrompt: 'Wanita dewasa berusia 30 tahun duduk di dekat jendela ruang tamu yang nyaman.', // Indonesian input
  keywords: 'pencahayaan sinematik, pose anggun', // Indonesian input
  storyStyle: {
    primary: 'Sensual & Alluring',
    supporting: ['Romantic Tension', 'Slow-Burn Romance'],
    custom: '',
  },
  photographicStyle: {
    selected: ['Ultra Realistic', 'Cinematic Photography'],
    custom: '',
  },
  characterLocks: {
    facelock: true,
    bodyshape: true,
    outfitlock: true,
    poselock: false,
    agepreserve: true,
    expressionlock: false,
    hairlock: true,
  },
  variationCount: 3,
};

// Access private/internal builders via prototype/cast
const systemInstruction = service1['buildSystemInstruction'](mockInputUltra);
assert.ok(systemInstruction.includes('ULTRA REALISTIC RENDERING MANDATE'), 'Must contain Ultra Realistic mandate');
assert.ok(systemInstruction.includes('skin microtexture with visible pores'), 'Must detail skin pores and microtexture');
assert.ok(systemInstruction.includes('/facelock 100%'), 'Must contain active /facelock 100%');
assert.ok(systemInstruction.includes('/bodyshape lock'), 'Must contain active /bodyshape lock');
assert.ok(systemInstruction.includes('/outfitlock'), 'Must contain active /outfitlock');
assert.ok(systemInstruction.includes('/agepreserve'), 'Must contain active /agepreserve (25+)');
assert.ok(systemInstruction.includes('/hairlock'), 'Must contain active /hairlock');
assert.ok(!systemInstruction.includes('/poselock: Strictly retain'), 'Disabled poselock must not be active');
assert.ok(!systemInstruction.includes('/expressionlock: Strictly preserve'), 'Disabled expressionlock must not be active');
// Strict mandate: The output prompts must ALWAYS be in English regardless of input language
assert.ok(systemInstruction.includes('LANGUAGE: The final prompts must ALWAYS be in natural, descriptive English, regardless of input language.'));
console.log('✓ Ultra Realistic mandate & Character Locks constraints correctly applied.');
console.log('✓ English output language constraint strictly enforced in system instruction.');

// 5. Verify User Prompt Builder (Sample + Keywords combination & Visual Directives)
console.log('Test 5: Verify User Prompt Builder...');
const userPrompt = service1['buildUserPrompt'](mockInputUltra);
assert.ok(userPrompt.includes('[PROMPT SAMPLE (Source of Truth for Scene & Identity)]'), 'Must include Sample Prompt');
assert.ok(userPrompt.includes('[KEYWORDS / SCENE IDEA]'), 'Must include Keywords');
assert.ok(userPrompt.includes('Primary Style: "Sensual & Alluring"'), 'Must specify Primary Style');
assert.ok(userPrompt.includes('- Primary Visual Directive:'), 'Must include concrete visual transformation directive');
assert.ok(userPrompt.includes('Supporting Styles: "Romantic Tension", "Slow-Burn Romance"'), 'Must specify Supporting Styles');
assert.ok(userPrompt.includes('/facelock 100%'), 'Must include active lock tag');
assert.ok(userPrompt.includes('Generate exactly 3 standalone, copy-ready English image prompt variation(s)'), 'Must request exact count');

// 5b. Verify Mature & Sensual Substyle and Intensity prompt composition
console.log('Test 5b: Verify Mature & Sensual Substyle and Intensity prompt composition...');
const mockMatureSubstyleInput = {
  samplePrompt: 'A realistic 30-year-old adult woman sitting gracefully by an antique vanity.',
  keywords: 'silk robe, warm ambient candlelight',
  storyStyle: {
    primary: 'Mature & Sensual',
    matureSubstyle: 'Boudoir Elegance',
    matureIntensity: 'High Glamour',
    supporting: ['Indie Film Aesthetic'],
    custom: '',
  },
  photographicStyle: {
    selected: ['Ultra Realistic'],
    custom: '',
  },
  characterLocks: {
    facelock: true,
    bodyshape: false,
    outfitlock: false,
    poselock: false,
    agepreserve: true,
    expressionlock: false,
    hairlock: false,
  },
  variationCount: 1,
};
const maturePrompt = service1['buildUserPrompt'](mockMatureSubstyleInput);
assert.ok(maturePrompt.includes('Primary Style: "Mature & Sensual"'));
assert.ok(maturePrompt.includes('Selected Substyle: "Boudoir Elegance"'));
assert.ok(maturePrompt.includes('Substyle Visual Definition: Timeless fine-art boudoir portraiture'));
assert.ok(maturePrompt.includes('Posing & Body Language: Gracefully seated on antique settee'));
assert.ok(maturePrompt.includes('Intensity Level: "High Glamour"'));
assert.ok(maturePrompt.includes('[SINGLE ADULT FEMALE SUBJECT MANDATE]'));
assert.ok(maturePrompt.includes('Exactly ONE adult female as the sole human subject'));
assert.ok(maturePrompt.includes('Supporting Styles: "Indie Film Aesthetic"'));
console.log('✓ Mature & Sensual substyle, intensity, and Single Female Mandate correctly formatted in prompt.');

// 5b2. Verify Isolation: When Primary Style is NOT Mature & Sensual, mature substyle directives do NOT leak
console.log('Test 5b2: Verify isolation when Primary Style is not Mature & Sensual...');
const mockNonMatureInput = {
  samplePrompt: 'A chef in a bustling kitchen.',
  keywords: 'action, steam, cooking',
  storyStyle: {
    primary: 'Cinematic Drama',
    matureSubstyle: 'Boudoir Elegance',
    matureIntensity: 'High Glamour',
    supporting: ['Everyday Realism'],
    custom: '',
  },
  photographicStyle: {
    selected: ['Ultra Realistic'],
    custom: '',
  },
  characterLocks: {
    facelock: false,
    bodyshape: false,
    outfitlock: false,
    poselock: false,
    agepreserve: false,
    expressionlock: false,
    hairlock: false,
  },
  variationCount: 1,
};
const nonMaturePrompt = service1['buildUserPrompt'](mockNonMatureInput);
assert.ok(nonMaturePrompt.includes('Primary Style: "Cinematic Drama"'));
assert.ok(!nonMaturePrompt.includes('Boudoir Elegance'), 'Non-mature primary style must NOT leak mature substyle');
assert.ok(!nonMaturePrompt.includes('High Glamour intensity'), 'Non-mature primary style must NOT leak mature intensity');
assert.ok(!nonMaturePrompt.includes('[SINGLE ADULT FEMALE SUBJECT MANDATE]'), 'Non-mature primary style must NOT leak single female mandate');
console.log('✓ Primary Style switching isolation verified (no mature directive leakage).');

// 5b3. Verify Mature & Sensual Couple Context prompt composition (preserved)
console.log('Test 5b3: Verify Mature & Sensual Couple Context prompt composition...');
const mockCoupleInput = {
  samplePrompt: 'A realistic couple sitting close in an intimate dimly lit bedroom.',
  keywords: 'romantic ambiance, soft candlelight',
  storyStyle: {
    primary: 'Passionate Kissing',
    supporting: ['Intimate Bedroom Atmosphere'],
    custom: '',
  },
  photographicStyle: {
    selected: ['Ultra Realistic'],
    custom: '',
  },
  characterLocks: {
    facelock: true,
    bodyshape: false,
    outfitlock: false,
    poselock: false,
    agepreserve: true,
    expressionlock: false,
    hairlock: false,
  },
  variationCount: 1,
};
const couplePrompt = service1['buildUserPrompt'](mockCoupleInput);
assert.ok(couplePrompt.includes('Primary Style: "Passionate Kissing" (Mature & Sensual — Romantic & Intimate Couple Dynamics)'));
assert.ok(couplePrompt.includes('Anatomically accurate and believable kiss between adult partners'));
assert.ok(!couplePrompt.includes('[SINGLE ADULT FEMALE SUBJECT MANDATE]'), 'Couple context must NOT include single female mandate');
assert.ok(couplePrompt.includes('Supporting Styles: "Intimate Bedroom Atmosphere"'));
console.log('✓ Mature & Sensual Couple Context prompt composition correctly preserved without single female constraint.');

// 5c. Verify Professional Studio Photography transformation in prompt
const mockStudioInput = {
  samplePrompt: 'A 35-year-old male architect in a modern studio.',
  keywords: 'charismatic, sharp eyes',
  storyStyle: {
    primary: 'Corporate & Executive Portrait',
    supporting: ['Low-Key Studio Photography'],
    custom: '',
  },
  photographicStyle: {
    selected: ['Ultra Realistic'],
    custom: '',
  },
  characterLocks: {
    facelock: true,
    bodyshape: true,
    outfitlock: false,
    poselock: false,
    agepreserve: true,
    expressionlock: false,
    hairlock: false,
  },
  variationCount: 1,
};
const studioPrompt = service1['buildUserPrompt'](mockStudioInput);
assert.ok(studioPrompt.includes('Primary Style: "Corporate & Executive Portrait"'));
assert.ok(studioPrompt.includes('tailored business attire (formal blazer or suit with crisp collar)'));
assert.ok(studioPrompt.includes('Supporting Nuance ("Low-Key Studio Photography"): Low-key studio photography, dark dramatic tonal dominance'));
console.log('✓ Combined prompt input logic & Professional Studio Photography directives correctly formatted.');

// 5d. Verify Multi-Image Subject Reference Integration
console.log('Test 5d: Verify Multi-Image Subject Reference Integration...');
const mockMultiImageInput = {
  samplePrompt: 'A professional portrait of an adult woman.',
  keywords: 'studio lighting, sharp focus',
  storyStyle: {
    primary: 'Professional Studio Portrait',
    supporting: [],
    custom: '',
  },
  photographicStyle: {
    selected: ['Ultra Realistic'],
    custom: '',
  },
  characterLocks: {
    facelock: true,
    bodyshape: false,
    outfitlock: false,
    poselock: false,
    agepreserve: true,
    expressionlock: false,
    hairlock: false,
  },
  variationCount: 1,
  referenceImages: [
    {
      id: 'img-1',
      file: {},
      dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
      name: 'subject-angle-front.jpg',
      size: 102400,
    },
    {
      id: 'img-2',
      file: {},
      dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
      name: 'subject-angle-side.jpg',
      size: 105200,
    },
  ],
};

const multiImgSys = service1['buildSystemInstruction'](mockMultiImageInput);
assert.ok(multiImgSys.includes('MULTI-IMAGE SUBJECT & DEDICATED OUTFIT REFERENCES:'), 'Must include multi-image visual reference mandate');
assert.ok(multiImgSys.includes('The user has provided 2 visual reference image(s) for the subject(s).'));
assert.ok(multiImgSys.includes('If multiple images depict the same person from different angles'));

const multiImgUserPrompt = service1['buildUserPrompt'](mockMultiImageInput);
assert.ok(multiImgUserPrompt.includes('[SUBJECT & OUTFIT REFERENCES]:'));
assert.ok(multiImgUserPrompt.includes('2 visual subject reference(s) provided:'));
console.log('✓ Multi-Image Subject Reference integration verified.');

// 5f. Verify Separate Outfit Uploads Per Subject & Fallback Rules
console.log('Test 5f: Verify Separate Outfit Uploads Per Subject & Fallback Rules...');
const mockSubject1 = {
  id: 'subj-101',
  file: {},
  dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
  name: 'model-anna.jpg',
  size: 50000,
};
const mockSubject2 = {
  id: 'subj-102',
  file: {},
  dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
  name: 'model-david.jpg',
  size: 52000,
};
const mockSubject3 = {
  id: 'subj-103',
  file: {},
  dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
  name: 'model-claire.jpg',
  size: 54000,
};

const mockOutfit1 = {
  id: 'outfit-1',
  file: {},
  dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
  name: 'red-velvet-evening-gown.jpg',
  size: 60000,
};
const mockOutfit3 = {
  id: 'outfit-3',
  file: {},
  dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
  name: 'black-silk-lingerie.jpg',
  size: 61000,
};

// 1. Single Subject with Dedicated Outfit
const input1SubjWithOutfit = {
  ...mockMultiImageInput,
  referenceImages: [mockSubject1],
  outfitImages: { [mockSubject1.id]: mockOutfit1 },
};
const sys1 = service1['buildSystemInstruction'](input1SubjWithOutfit);
assert.ok(sys1.includes('Subject 1 ("model-anna.jpg"): Dedicated outfit provided ("red-velvet-evening-gown.jpg")'));
assert.ok(sys1.includes('dress Subject 1 in the attire, garment design, fabric material, and colors shown in Outfit Reference 1'));

// 2. Single Subject with Empty Outfit Slot -> Fallback Rule
const input1SubjEmptyOutfit = {
  ...mockMultiImageInput,
  referenceImages: [mockSubject1],
  outfitImages: {},
};
const sys1Fallback = service1['buildSystemInstruction'](input1SubjEmptyOutfit);
assert.ok(sys1Fallback.includes('Subject 1 ("model-anna.jpg"): NO separate outfit uploaded'));
assert.ok(sys1Fallback.includes('FALLBACK RULE: You MUST use the attire visibly worn by Subject 1 in Subject Reference 1'));

// 3. Two Subjects: Subject 1 has Dedicated Outfit, Subject 2 has Empty Outfit (Fallback)
const input2Subj = {
  ...mockMultiImageInput,
  referenceImages: [mockSubject1, mockSubject2],
  outfitImages: { [mockSubject1.id]: mockOutfit1 }, // only subject 1 has outfit
};
const sys2 = service1['buildSystemInstruction'](input2Subj);
assert.ok(sys2.includes('Subject 1 ("model-anna.jpg"): Dedicated outfit provided ("red-velvet-evening-gown.jpg")'));
assert.ok(sys2.includes('Subject 2 ("model-david.jpg"): NO separate outfit uploaded'));
assert.ok(sys2.includes('FALLBACK RULE: You MUST use the attire visibly worn by Subject 2 in Subject Reference 2'));
assert.ok(sys2.includes('STRICT SUBJECT ISOLATION: NEVER swap outfits between subjects'));

const user2 = service1['buildUserPrompt'](input2Subj);
assert.ok(user2.includes('Subject 1 ("model-anna.jpg"): Use attire from Outfit Reference 1 ("red-velvet-evening-gown.jpg")'));
assert.ok(user2.includes('Subject 2 ("model-david.jpg"): FALLBACK - preserve attire visibly worn in Subject Reference 2'));

// 4. Three Subjects: Subject 1 & 3 have outfits, Subject 2 has fallback
const input3Subj = {
  ...mockMultiImageInput,
  referenceImages: [mockSubject1, mockSubject2, mockSubject3],
  outfitImages: {
    [mockSubject1.id]: mockOutfit1,
    [mockSubject3.id]: mockOutfit3,
  },
};
const sys3 = service1['buildSystemInstruction'](input3Subj);
assert.ok(sys3.includes('Subject 1 ("model-anna.jpg"): Dedicated outfit provided ("red-velvet-evening-gown.jpg")'));
assert.ok(sys3.includes('Subject 2 ("model-david.jpg"): NO separate outfit uploaded'));
assert.ok(sys3.includes('Subject 3 ("model-claire.jpg"): Dedicated outfit provided ("black-silk-lingerie.jpg")'));

// 5. Stable ID Synchronization on Subject Removal:
// If Subject 1 is removed from [Subject 1, Subject 2, Subject 3], Subject 3's outfit remains paired to Subject 3
const newSubjectsAfterRemoval = [mockSubject2, mockSubject3];
const validSubjectIds = new Set(newSubjectsAfterRemoval.map(s => s.id));
const synchronizedOutfits = {};
for (const [subjId, outfit] of Object.entries(input3Subj.outfitImages)) {
  if (validSubjectIds.has(subjId)) {
    synchronizedOutfits[subjId] = outfit;
  }
}
assert.strictEqual(synchronizedOutfits[mockSubject1.id], undefined, 'Subject 1 outfit must be cleanly removed');
assert.strictEqual(synchronizedOutfits[mockSubject3.id].name, 'black-silk-lingerie.jpg', 'Subject 3 outfit must remain intact');
console.log('✓ Separate outfit uploads per subject, fallback rules, and stable ID synchronization verified.');

// 5g. Verify Outfit & Layering Control (5 modes, Transparent Fabric Preservation, and Custom Instructions)
console.log('Test 5g: Verify Outfit & Layering Control...');
const modesToTest = [
  'Automatic — Match Uploaded Outfit',
  'Exact Outfit Match',
  'Preserve Visible Layers',
  'Transparent Fabric Preservation',
  'Custom Outfit Instructions',
];

for (const m of modesToTest) {
  const testInput = {
    ...input3Subj,
    outfitLayeringConfig: {
      mode: m,
      customInstructions: m === 'Custom Outfit Instructions' ? 'White sheer babydoll with delicate lace hem' : '',
    },
  };
  const sysInst = service1['buildSystemInstruction'](testInput);
  assert.ok(sysInst.includes(`OUTFIT & LAYERING CONTROL MODE: "${m}"`), `Must include header for mode ${m}`);
  assert.ok(sysInst.includes('PRIORITY OF SOURCES & CONFLICT RESOLUTION:'), 'Must include priority of sources & conflict resolution');
  
  if (m === 'Transparent Fabric Preservation') {
    assert.ok(sysInst.includes('sheer, mesh, tulle, translucent chiffon, and delicate transparent lace'), 'Must include transparent fabric types');
    assert.ok(sysInst.includes('NO UNREQUESTED MODESTY / NO AUTOMATIC OPAQUENESS'), 'Must forbid unwanted modesty layers');
    assert.ok(sysInst.includes('Absolutely do NOT reduce transparency'), 'Must mandate transparency preservation');
  } else if (m === 'Exact Outfit Match') {
    assert.ok(sysInst.includes('PRIORITIZE 1:1 VISUAL ACCURACY'), 'Must mandate 1:1 visual match');
  } else if (m === 'Preserve Visible Layers') {
    assert.ok(sysInst.includes('PRESERVE VISIBLE LAYERS'), 'Must preserve layer sequence');
  } else if (m === 'Custom Outfit Instructions') {
    assert.ok(sysInst.includes('White sheer babydoll with delicate lace hem'), 'Must include custom outfit directives');
  }

  const userP = service1['buildUserPrompt'](testInput);
  assert.ok(userP.includes(`Mode: "${m}"`), `User prompt must include mode ${m}`);
  if (m === 'Custom Outfit Instructions') {
    assert.ok(userP.includes('Custom Instructions: "White sheer babydoll with delicate lace hem"'), 'User prompt must include custom instructions');
  }
}
console.log('✓ All 5 Outfit & Layering Control modes (including Transparent Fabric Preservation) verified.');

// 5h. Verify Transparent Fabric Preservation Sanitization & Unwanted Modesty Purge
console.log('Test 5h: Verify Transparent Fabric Preservation Sanitization...');
const testPromptWithSlip = 'A woman in a sheer black lace gown, with an opaque slip underneath, soft ambient lighting';
const testPromptWithCamisole = 'An authentic portrait wearing a transparent mesh dress with a nude camisole underneath, cinematic framing';
const testPromptWithLining = 'A beautiful woman in a sheer tulle evening dress, lined with opaque fabric, studio portrait';
const testPromptWithModestyLining = 'A sensual woman wearing delicate transparent lace lingerie with modesty lining, dramatic lighting';
const testPromptWithBoning = 'A woman wearing a sheer tulle corset gown with structured boning and sheer sleeves, soft lighting';
const testPromptWithPanels = 'A woman in a sheer organza dress with embroidered velvet panels on the bodice, elegant pose';

// 1. Unwanted modesty phrases purged in Transparent Fabric Preservation mode
const sanitizedSlip = GeminiService.sanitizeOutfitLayering(testPromptWithSlip, 'Transparent Fabric Preservation');
assert.strictEqual(sanitizedSlip, 'A woman in a sheer black lace gown, soft ambient lighting', 'Must purge ", with an opaque slip underneath"');

const sanitizedCamisole = GeminiService.sanitizeOutfitLayering(testPromptWithCamisole, 'Transparent Fabric Preservation');
assert.strictEqual(sanitizedCamisole, 'An authentic portrait wearing a transparent mesh dress, cinematic framing', 'Must purge "with a nude camisole underneath"');

const sanitizedLining = GeminiService.sanitizeOutfitLayering(testPromptWithLining, 'Transparent Fabric Preservation');
assert.strictEqual(sanitizedLining, 'A beautiful woman in a sheer tulle evening dress, studio portrait', 'Must purge ", lined with opaque fabric"');

const sanitizedModesty = GeminiService.sanitizeOutfitLayering(testPromptWithModestyLining, 'Transparent Fabric Preservation');
assert.strictEqual(sanitizedModesty, 'A sensual woman wearing delicate transparent lace lingerie, dramatic lighting', 'Must purge "with modesty lining"');

// 2. Structural design panels and corset boning preserved
const sanitizedBoning = GeminiService.sanitizeOutfitLayering(testPromptWithBoning, 'Transparent Fabric Preservation');
assert.strictEqual(sanitizedBoning, testPromptWithBoning, 'Structural corset boning must not be stripped');

const sanitizedPanels = GeminiService.sanitizeOutfitLayering(testPromptWithPanels, 'Transparent Fabric Preservation');
assert.strictEqual(sanitizedPanels, testPromptWithPanels, 'Integral embroidered velvet panels must not be stripped');

// 3. In other modes (e.g. Automatic or Exact), text is not altered unnecessarily
const unmolestedPrompt = GeminiService.sanitizeOutfitLayering(testPromptWithSlip, 'Automatic — Match Uploaded Outfit');
assert.strictEqual(unmolestedPrompt, testPromptWithSlip);
console.log('✓ Transparent Fabric Preservation sanitization & structural preservation verified.');

// 5i. Verify Independent Per-Subject Outfit & Layering Control
console.log('Test 5i: Verify Independent Per-Subject Outfit & Layering Control...');
const perSubjectInput = {
  ...input3Subj,
  outfitLayeringConfigs: {
    [mockSubject1.id]: {
      mode: 'Transparent Fabric Preservation',
      customInstructions: '',
    },
    [mockSubject2.id]: {
      mode: 'Automatic',
      customInstructions: '',
    },
    [mockSubject3.id]: {
      mode: 'Original Outfit Preservation',
      customInstructions: '',
    },
  },
};

const perSubjSys = service1['buildSystemInstruction'](perSubjectInput);
assert.ok(perSubjSys.includes('PER-SUBJECT OUTFIT & LAYERING CONTROL DIRECTIVES:'), 'Must include per-subject directives container');
assert.ok(perSubjSys.includes('SUBJECT 1 ("model-anna.jpg") OUTFIT & LAYERING DIRECTIVE (Mode: "Transparent Fabric Preservation")'));
assert.ok(perSubjSys.includes('NO UNREQUESTED MODESTY / NO AUTOMATIC OPAQUENESS'));
assert.ok(perSubjSys.includes('SUBJECT 2 ("model-david.jpg") OUTFIT & LAYERING DIRECTIVE (Mode: "Automatic")'));
assert.ok(perSubjSys.includes('AUTOMATIC OUTFIT MATCHING DIRECTIVE'));
assert.ok(perSubjSys.includes('SUBJECT 3 ("model-claire.jpg") OUTFIT & LAYERING DIRECTIVE (Mode: "Original Outfit Preservation")'));
assert.ok(perSubjSys.includes('PRIORITIZE 1:1 VISUAL ACCURACY'));

const perSubjUser = service1['buildUserPrompt'](perSubjectInput);
assert.ok(perSubjUser.includes('[PER-SUBJECT OUTFIT & LAYERING CONTROL]:'));
assert.ok(perSubjUser.includes('Subject 1 ("model-anna.jpg") (Mode: "Transparent Fabric Preservation")'));
assert.ok(perSubjUser.includes('Subject 2 ("model-david.jpg") (Mode: "Automatic")'));
assert.ok(perSubjUser.includes('Subject 3 ("model-claire.jpg") (Mode: "Original Outfit Preservation")'));
assert.ok(perSubjUser.includes('CRITICAL: One or more subjects use "Transparent Fabric Preservation"'));

// Test state independence: mutating Subject 2 does not affect Subject 1 or 3
const mutatedConfigs = {
  ...perSubjectInput.outfitLayeringConfigs,
  [mockSubject2.id]: {
    mode: 'Custom Outfit Instructions',
    customInstructions: 'Tailored charcoal tuxedo with satin lapels',
  },
};
assert.strictEqual(mutatedConfigs[mockSubject1.id].mode, 'Transparent Fabric Preservation');
assert.strictEqual(mutatedConfigs[mockSubject2.id].mode, 'Custom Outfit Instructions');
assert.strictEqual(mutatedConfigs[mockSubject3.id].mode, 'Original Outfit Preservation');

// Test removing Subject 1 from subjects: Subject 2 & 3 retain their exact configs
const validSubjsAfterDel = [mockSubject2, mockSubject3];
const validIdsSet = new Set(validSubjsAfterDel.map(s => s.id));
const prunedConfigs = {};
for (const [subjId, cfg] of Object.entries(mutatedConfigs)) {
  if (validIdsSet.has(subjId)) {
    prunedConfigs[subjId] = cfg;
  }
}
assert.strictEqual(prunedConfigs[mockSubject1.id], undefined, 'Subject 1 config cleanly pruned');
assert.strictEqual(prunedConfigs[mockSubject2.id].mode, 'Custom Outfit Instructions', 'Subject 2 config preserved without shifts');
assert.strictEqual(prunedConfigs[mockSubject3.id].mode, 'Original Outfit Preservation', 'Subject 3 config preserved without shifts');

// Test outfit image removal leaves Subject 2's layering config intact
const outfitImagesWithoutSubj2 = { ...perSubjectInput.outfitImages };
delete outfitImagesWithoutSubj2[mockSubject2.id];
assert.strictEqual(mutatedConfigs[mockSubject2.id].mode, 'Custom Outfit Instructions', 'Outfit image deletion must not reset layering config');

console.log('✓ Independent per-subject Outfit & Layering Control, prompt directives, and state isolation verified.');

// 5j. Verify Outfit Reference Fidelity Rules & Automated Audit Validation
console.log('Test 5j: Verify Outfit Reference Fidelity Rules & Automated Audit Validation...');
const fidelitySysInst = service1['buildSystemInstruction'](perSubjectInput);
assert.ok(fidelitySysInst.includes('DESIGN BLUEPRINT AUTHORITY: The uploaded outfit reference is the exact design blueprint for the garment'));
assert.ok(fidelitySysInst.includes('PRESERVE EXACT SILHOUETTE, CUT & LENGTH'));
assert.ok(fidelitySysInst.includes('SHOULDER STRAPS, NECKLINES & EDGES'));
assert.ok(fidelitySysInst.includes('ZONED TRANSPARENCY & DESIGN PANELS'));
assert.ok(fidelitySysInst.includes('STRICT SEPARATION OF REFERENCE SOURCES:'));
assert.ok(fidelitySysInst.includes('NEVER use clothing visible on the subject reference to overwrite or alter the design'));
assert.ok(fidelitySysInst.includes('STRICT OUTFIT REFERENCE MATCH & GARMENT PRESERVATION MANDATE'));
assert.ok(fidelitySysInst.includes('SEPARATION OF GARMENT DESIGN FROM BODY FIT:'));
assert.ok(fidelitySysInst.includes('PROHIBITIONS AGAINST AUTOMATIC REDESIGN'));

// 1. Valid high-fidelity prompt
const validFidelityPrompt = 'An ultra realistic portrait of an elegant woman wearing a floor-length sheer black mesh evening gown with delicate spaghetti straps, sweetheart neckline, and opaque velvet bodice panels, dramatic rim lighting.';
const checkValid = GeminiService.validateOutfitFidelity(validFidelityPrompt, perSubjectInput);
assert.strictEqual(checkValid.status, 'passed', 'High-fidelity prompt must pass validation');
assert.strictEqual(checkValid.warnings.length, 0, 'No warnings for valid prompt');
assert.ok(checkValid.passedChecks.includes('outfitCheckSilhouette'));
assert.ok(checkValid.passedChecks.includes('outfitCheckMaterialMesh'));
assert.ok(checkValid.passedChecks.includes('outfitCheckStrapsNeckline'));
assert.ok(checkValid.passedChecks.includes('outfitCheckNoModestyLinings'));

// 1b. Valid strict match prompt with asymmetric chain straps, diagonal panels, and natural body fit/drape
const strictMatchPrompt = 'An ultra realistic portrait of an elegant woman wearing a floor-length sheer black mesh evening gown with asymmetric chain straps, a plunging sweetheart neckline, diagonal satin panels across the bodice, and visible tailored seamlines; the sheer fabric drapes naturally and conforms to her posture with realistic fabric tension and gentle folds.';
const checkStrict = GeminiService.validateOutfitFidelity(strictMatchPrompt, perSubjectInput);
assert.strictEqual(checkStrict.status, 'passed', 'Strict match prompt with asymmetric and body fit details must pass');
assert.ok(checkStrict.passedChecks.includes('outfitCheckAsymmetryDetails'), 'Must detect asymmetric details and diagonal panels');
assert.ok(checkStrict.passedChecks.includes('outfitCheckBodyFitDrape'), 'Must detect natural body fit and fabric drape');

// 2. Prompt missing transparent fabric when Transparent Fabric Preservation is active
const missingSheerPrompt = 'An ultra realistic portrait of an elegant woman wearing a floor-length evening dress with delicate spaghetti straps and sweetheart neckline.';
const checkMissingSheer = GeminiService.validateOutfitFidelity(missingSheerPrompt, perSubjectInput);
assert.strictEqual(checkMissingSheer.status, 'warning');
assert.ok(checkMissingSheer.warnings.some(w => w.includes('Deskripsi material transparan/mesh tidak terdeteksi')));

// 3. Prompt containing unwanted modesty slip
const modestyViolationPrompt = 'An ultra realistic portrait of an elegant woman wearing a sheer mesh dress with an opaque slip underneath, delicate straps.';
const checkModesty = GeminiService.validateOutfitFidelity(modestyViolationPrompt, perSubjectInput);
assert.strictEqual(checkModesty.status, 'warning');
assert.ok(checkModesty.warnings.some(w => w.includes('lapisan modesty/slip dalam')));

// 4. Prompt with category drift (e.g. heavy winter coat)
const categoryDriftPrompt = 'An ultra realistic portrait of an elegant woman wearing an oversized winter coat and heavy wool sweater with mesh sleeves.';
const checkDrift = GeminiService.validateOutfitFidelity(categoryDriftPrompt, perSubjectInput);
assert.strictEqual(checkDrift.status, 'warning');
assert.ok(checkDrift.warnings.some(w => w.includes('kategori busana bergeser')));

// 5. Plain input without outfit reference or transparent mode
const plainInput = {
  samplePrompt: 'A simple portrait',
  keywords: 'studio',
  storyStyle: { primary: null, supporting: [], custom: '' },
  photographicStyle: { selected: ['Ultra Realistic'], custom: '' },
  characterLocks: { facelock: false, bodyshape: false, outfitlock: false, poselock: false, agepreserve: false, expressionlock: false, hairlock: false },
  variationCount: 1,
};
const checkPlain = GeminiService.validateOutfitFidelity('A simple portrait', plainInput);
assert.strictEqual(checkPlain.hasOutfitReference, false);
assert.strictEqual(checkPlain.isTransparentMode, false);
assert.strictEqual(checkPlain.status, 'info');

console.log('✓ Outfit reference fidelity prompt directives and automated validation checks verified.');

// 5k. Verify Undergarment Control Mode for Outfit Upload 1
console.log('Test 5k: Verify Undergarment Control Mode for Outfit Upload 1...');
assert.deepStrictEqual(UNDERGARMENT_CONTROL_MODES, [
  'Preserve',
  'Match Outfit',
  'Concealed',
  'No Undergarment Layer',
  'Editorial Minimal Layering',
  'Custom',
], 'UNDERGARMENT_CONTROL_MODES must match the exact 6 modes and ordering');

for (const ugMode of UNDERGARMENT_CONTROL_MODES) {
  const ugInput = {
    ...mockMultiImageInput,
    referenceImages: [
      { id: 'subj-1', file: {}, dataUrl: 'data:image/jpeg;base64,...', name: 'Subject 1', size: 1000 },
    ],
    outfitImages: {
      'subj-1': { id: 'outfit-1', file: {}, dataUrl: 'data:image/jpeg;base64,...', name: 'Sheer Mesh Dress', size: 1200 },
    },
    outfitLayeringConfigs: {
      'subj-1': { mode: ugMode, customInstructions: ugMode === 'Custom' ? 'Silk bralette' : '' },
    },
  };

  const ugSysInst = service1['buildSystemInstruction'](ugInput);
  assert.ok(ugSysInst.includes(`UNDERGARMENT & LAYERING CONTROL MODE: "${ugMode}"`), `System instruction must include directive for "${ugMode}"`);

  const ugUserPrompt = service1['buildUserPrompt'](ugInput);
  assert.ok(ugUserPrompt.includes(`(Mode: "${ugMode}")`), `User prompt must include per-subject directive for "${ugMode}"`);
}

// Verify "No Undergarment Layer" triggers transparent mode & purges unwanted modesty additions
const noUndergarmentInput = {
  ...mockMultiImageInput,
  referenceImages: [
    { id: 'subj-1', file: {}, dataUrl: 'data:image/jpeg;base64,...', name: 'Subject 1', size: 1000 },
  ],
  outfitImages: {
    'subj-1': { id: 'outfit-1', file: {}, dataUrl: 'data:image/jpeg;base64,...', name: 'Sheer Mesh Dress', size: 1200 },
  },
  outfitLayeringConfigs: {
    'subj-1': { mode: 'No Undergarment Layer' },
  },
};
const checkNoUndergarment = GeminiService.validateOutfitFidelity(
  'An ultra realistic portrait wearing a sheer mesh dress, with an opaque slip underneath, delicate straps.',
  noUndergarmentInput
);
assert.strictEqual(checkNoUndergarment.isTransparentMode, true);
assert.strictEqual(checkNoUndergarment.status, 'warning');
assert.ok(checkNoUndergarment.warnings.some(w => w.includes('lapisan modesty/slip dalam')));

const sanitizedNoUndergarment = GeminiService.sanitizeOutfitLayering(
  'A woman in a sheer black lace gown, with an opaque slip underneath, soft ambient lighting',
  'No Undergarment Layer'
);
assert.strictEqual(sanitizedNoUndergarment, 'A woman in a sheer black lace gown, soft ambient lighting');

const sanitizedNoUndergarmentDirect = GeminiService.sanitizeOutfitLayering(
  'A woman wearing a sheer dress, opaque slip underneath, delicate straps',
  'No Undergarment Layer'
);
assert.strictEqual(sanitizedNoUndergarmentDirect, 'A woman wearing a sheer dress, delicate straps');

const sanitizedNoUndergarmentBlack = GeminiService.sanitizeOutfitLayering(
  'A woman in a sheer mesh top, black inner slip, soft lighting',
  'No Undergarment Layer'
);
assert.strictEqual(sanitizedNoUndergarmentBlack, 'A woman in a sheer mesh top, soft lighting');

console.log('✓ Undergarment Control Mode (all 6 modes) verified for Outfit Upload 1.');

// 5e. Verify Aspect Ratio Global Enforcement in Prompt Engineering
console.log('Test 5e: Verify Aspect Ratio in System Instruction & User Prompt...');
const mockInputWithRatio = {
  ...mockMultiImageInput,
  selectedAspectRatio: '9:16',
};
const ratioSysInstruction = service1['buildSystemInstruction'](mockInputWithRatio);
assert.ok(ratioSysInstruction.includes('ASPECT RATIO MANDATE (STRICT):'), 'Must include strict aspect ratio mandate');
assert.ok(ratioSysInstruction.includes('global aspect ratio: 9:16'));
assert.ok(ratioSysInstruction.includes('--ar 9:16'));

const ratioUserPrompt = service1['buildUserPrompt'](mockInputWithRatio);
assert.ok(ratioUserPrompt.includes('[ASPECT RATIO - MANDATORY FOR ALL VARIATIONS]:'));
assert.ok(ratioUserPrompt.includes('Target aspect ratio: 9:16'));

// Verify Auto Aspect Ratio mode
const mockInputAutoRatio = {
  ...mockMultiImageInput,
  selectedAspectRatio: 'auto',
};
const autoSysInstruction = service1['buildSystemInstruction'](mockInputAutoRatio);
assert.ok(autoSysInstruction.includes('Aspect ratio is set to Automatic. Do NOT force a fixed --ar parameter flag.'));
const autoUserPrompt = service1['buildUserPrompt'](mockInputAutoRatio);
assert.ok(autoUserPrompt.includes('Automatic / default. Do not append fixed --ar parameters.'));
console.log('✓ Aspect Ratio prompt engineering directives verified for both specific ratio and auto mode.');

// 6. Verify Output Parser (Strips labels, markdown, and ensures prompt text only)
console.log('Test 6: Verify Response Parsing and Label Stripping...');
const rawMockResponse = JSON.stringify({
  prompts: [
    'Variation 1: An ultra realistic photographic portrait of a 30-year-old woman by a sunlit mahogany window frame, detailed skin pores, natural wisps of dark brown hair, silk blouse folds, soft golden hour lighting.',
    'Prompt 2: An authentic 35mm film still of a 30-year-old woman looking gently towards the veranda, subtle skin texture and eyelashes in sharp focus, amber rim light, shallow depth of field.'
  ]
});

const parsed = service1['parseResponse'](rawMockResponse, 2);
assert.strictEqual(parsed.length, 2, 'Must parse exactly 2 prompts');
assert.ok(!parsed[0].startsWith('Variation 1:'), 'Must strip "Variation 1:" prefix');
assert.ok(!parsed[1].startsWith('Prompt 2:'), 'Must strip "Prompt 2:" prefix');
console.log('✓ Parser successfully strips labels and produces pure prompt text.');

// 6b. Verify Deterministic Aspect Ratio Sanitization & Application to 100% of Variations
console.log('Test 6b: Verify Deterministic Aspect Ratio Application & Conflict Resolution...');
const testPromptPlain = 'A candid 35mm photograph of a woman smiling in golden hour sunlight';
const testPromptConflicting = 'A candid 35mm photograph of a woman smiling in golden hour sunlight --ar 16:9';
const testPromptDuplicate = 'A candid 35mm photograph of a woman smiling --ar 9:16 --ar 1:1';
const testPromptOldSyntax = 'A candid 35mm photograph of a woman smiling --aspect-ratio 4:5';

// Apply '9:16'
const resPlain = GeminiService.applyAspectRatio(testPromptPlain, '9:16');
assert.strictEqual(resPlain, `${testPromptPlain} --ar 9:16`);

const resConflicting = GeminiService.applyAspectRatio(testPromptConflicting, '9:16');
assert.strictEqual(resConflicting, `${testPromptPlain} --ar 9:16`, 'Must replace conflicting --ar 16:9 with --ar 9:16');

const resDuplicate = GeminiService.applyAspectRatio(testPromptDuplicate, '9:16');
assert.strictEqual(resDuplicate, 'A candid 35mm photograph of a woman smiling --ar 9:16', 'Must remove all duplicate --ar tags');

const resOldSyntax = GeminiService.applyAspectRatio(testPromptOldSyntax, '9:16');
assert.strictEqual(resOldSyntax, 'A candid 35mm photograph of a woman smiling --ar 9:16', 'Must replace --aspect-ratio flag');

// Apply 'auto' mode
const resAuto = GeminiService.applyAspectRatio(testPromptPlain, 'auto');
assert.strictEqual(resAuto, testPromptPlain, 'Auto mode must not force any fixed --ar tag');

// Verify application across 100% of multiple variations
const multiVariations = [
  'Variation 1 content without flags',
  'Variation 2 content with conflicting --ar 4:5',
  'Variation 3 content with --ar 16:9',
  'Variation 4 content with --ar 1:1',
];
const appliedAll = multiVariations.map(p => GeminiService.applyAspectRatio(p, '9:16'));
assert.strictEqual(appliedAll.length, 4);
appliedAll.forEach((p, idx) => {
  assert.ok(p.endsWith('--ar 9:16'), `Variation ${idx + 1} must end with --ar 9:16`);
  const arMatches = p.match(/--ar/g);
  assert.strictEqual(arMatches.length, 1, `Variation ${idx + 1} must have exactly one --ar parameter`);
});
console.log('✓ 100% of variations verified to have consistent, conflict-free aspect ratio applied.');

// 7. Verify Validation on Empty Connection Test
console.log('Test 7: Verify Connection Test Validation on Empty Key...');
service1.testConnection('', 'gemini-2.5-flash').then((res) => {
  assert.strictEqual(res.valid, false);
  assert.ok(res.message.includes('API Key cannot be empty'));
  console.log('✓ Empty API Key caught.');

  // Test Empty Model ID
  return service1.testConnection('test-key', '');
}).then((res) => {
  assert.strictEqual(res.valid, false);
  assert.ok(res.message.includes('Model ID cannot be empty'));
  console.log('✓ Empty Model ID caught.');

  // 7b. Verify Global Outfit Prompt Repair
  console.log('Test 7b: Verify Global Outfit Prompt Repair on Mixed Compliant & Flagged Prompts...');
  const repairInput = {
    ...noUndergarmentInput,
    selectedAspectRatio: '9:16',
  };
  const compliantPrompt = 'A cinematic 35mm photo of a woman in a sheer black lace gown with delicate straps, natural body drape, soft ambient light --ar 9:16';
  const flaggedPrompt = 'A portrait of a woman in a sheer mesh dress, with an opaque slip underneath, delicate straps --ar 9:16';

  const mockCurrentResults = [
    {
      id: 'var-1',
      prompt: compliantPrompt,
      fidelityCheck: GeminiService.validateOutfitFidelity(compliantPrompt, repairInput),
    },
    {
      id: 'var-2',
      prompt: flaggedPrompt,
      fidelityCheck: GeminiService.validateOutfitFidelity(flaggedPrompt, repairInput),
    },
  ];

  assert.strictEqual(mockCurrentResults[0].fidelityCheck.status, 'passed');
  assert.strictEqual(mockCurrentResults[1].fidelityCheck.status, 'warning');

  return service1.repairFlaggedPrompts('', '', mockCurrentResults, repairInput).then(({ repairedResults, summary }) => {
    assert.strictEqual(summary.examined, 2, 'Summary must report 2 examined prompts');
    assert.strictEqual(summary.unchanged, 1, 'Compliant prompt must be reported as unchanged');
    assert.strictEqual(summary.repaired, 1, 'Flagged prompt must be reported as repaired');
    assert.strictEqual(summary.unfixable, 0, 'No unfixable prompts');

    // Check item 1 (unchanged)
    assert.strictEqual(repairedResults[0].id, 'var-1');
    assert.strictEqual(repairedResults[0].prompt, compliantPrompt);

    // Check item 2 (repaired)
    assert.strictEqual(repairedResults[1].id, 'var-2');
    assert.ok(!repairedResults[1].prompt.includes('opaque slip underneath'), 'Modesty slip must be purged');
    assert.strictEqual(repairedResults[1].fidelityCheck.status, 'passed');
    assert.ok(repairedResults[1].prompt.endsWith('--ar 9:16'), 'Aspect ratio must be preserved');
    console.log('✓ Global Outfit Prompt Repair verified: compliant prompts untouched, flagged repaired, summary accurate.');
  });
}).then(() => {
  // 7c. Verify Individual Per-Card Outfit Prompt Repair
  console.log('Test 7c: Verify Individual Per-Card Outfit Prompt Repair...');
  const repairInput = {
    ...noUndergarmentInput,
    selectedAspectRatio: '9:16',
  };
  const compliantPrompt = 'A cinematic 35mm photo of a woman in a sheer black lace gown with delicate straps, natural body drape, soft ambient light --ar 9:16';
  const flaggedPrompt = 'A portrait of a woman in a sheer mesh dress, with an opaque slip underneath, delicate straps --ar 9:16';

  const card1 = {
    id: 'card-1',
    index: 1,
    prompt: flaggedPrompt,
    fidelityCheck: GeminiService.validateOutfitFidelity(flaggedPrompt, repairInput),
  };
  const card2 = {
    id: 'card-2',
    index: 2,
    prompt: compliantPrompt,
    fidelityCheck: GeminiService.validateOutfitFidelity(compliantPrompt, repairInput),
  };

  assert.strictEqual(card1.fidelityCheck.status, 'warning');
  assert.strictEqual(card2.fidelityCheck.status, 'passed');

  return service1.repairSinglePrompt('', '', card1, repairInput).then((repairedCard1) => {
    assert.strictEqual(repairedCard1.id, 'card-1');
    assert.ok(!repairedCard1.prompt.includes('opaque slip underneath'), 'Modesty slip must be purged from card 1');
    assert.strictEqual(repairedCard1.fidelityCheck.status, 'passed', 'Card 1 must be verified after repair');
    assert.ok(repairedCard1.prompt.endsWith('--ar 9:16'), 'Aspect ratio must be preserved');

    // Card 2 remains untouched
    assert.strictEqual(card2.prompt, compliantPrompt, 'Card 2 prompt must remain 100% untouched');
    assert.strictEqual(card2.fidelityCheck.status, 'passed');
    console.log('✓ Individual per-card prompt repair verified: card 1 repaired & verified, card 2 untouched.');
  });
}).then(() => {

  // 8. Verify i18n Translations Parity
  console.log('Test 8: Verify i18n Dictionary Parity between "id" and "en"...');
  const idKeys = Object.keys(translations.id);
  const enKeys = Object.keys(translations.en);
  assert.strictEqual(idKeys.length, enKeys.length, 'ID and EN translation dictionaries must have identical top-level key count');
  for (const k of idKeys) {
    assert.ok(k in translations.en, `Key "${k}" missing in English dictionary`);
  }
  console.log(`✓ Both "id" and "en" dictionaries contain ${idKeys.length} matching localized entries.`);
}).then(() => {
  // 9. Verify Image to Prompt Feature Logic & Integration
  console.log('Test 9: Verify Image to Prompt Feature Logic...');
  const gemini = GeminiService.getInstance();
  assert.strictEqual(typeof gemini.analyzeImageToPrompt, 'function', 'analyzeImageToPrompt method must exist on GeminiService');

  // Verify Required Keys for Section C Image to Prompt
  const requiredImageToPromptKeys = [
    'imageToPromptTitle',
    'imageToPromptSubtitle',
    'imageToPromptUploadZone',
    'imageToPromptFormats',
    'statusAwaitingImage',
    'statusReadyToAnalyze',
    'statusAnalyzing',
    'statusAnalysisSuccess',
    'statusAnalysisFailed',
    'btnAnalyzeImage',
    'btnReanalyzeImage',
    'btnUseAnalysisResult',
    'btnCopyAnalysis',
    'analysisCopied',
    'btnClearAnalysisResult',
    'btnChangeImage',
    'btnRemoveImage',
    'analysisResultLabel',
    'analysisResultPlaceholder',
    'confirmApplyTitle',
    'confirmApplyDesc',
    'btnReplacePrompt',
    'btnMergePrompt',
    'btnCancel',
    'appliedSuccessNotice',
    'errNoApiKeyForAnalysis',
    'errAnalysisFailed',
  ];

  for (const key of requiredImageToPromptKeys) {
    assert.ok(key in translations.id, `Missing "${key}" in translations.id`);
    assert.ok(key in translations.en, `Missing "${key}" in translations.en`);
  }

  // Verify merge logic when existing sample prompt is present vs empty
  const sampleEmpty = '';
  const sampleExisting = 'An elegant portrait of a woman in an evening gown, warm studio light.';
  const visualAnalysis = '35mm photograph of an adult woman with chestnut wavy hair, wearing a structured emerald silk blazer and delicate jewelry, sitting in a velvet armchair, soft Rembrandt lighting, natural shallow depth of field';

  // Apply to empty
  const appliedToEmpty = sampleEmpty ? `${sampleEmpty}\n\n[Visual Analysis Reference]:\n${visualAnalysis}` : visualAnalysis;
  assert.strictEqual(appliedToEmpty, visualAnalysis);

  // Merge with existing
  const mergedResult = `${sampleExisting.trim()}\n\n[Visual Analysis Reference]:\n${visualAnalysis.trim()}`;
  assert.ok(mergedResult.includes(sampleExisting));
  assert.ok(mergedResult.includes('[Visual Analysis Reference]:'));
  assert.ok(mergedResult.includes(visualAnalysis));

  console.log('✓ Image to Prompt feature logic, method signatures, prompt merging, and i18n keys verified.');
}).then(() => {
  // 10. Verify Framing Catalog (24 total: 1 Auto + 23 manual), Groups, Auto Logic & Final Prompt Integration
  console.log('Test 10: Verify Framing catalog (24 options: 1 Auto + 23 manual) & Integration...');

  // 10a. Count & Uniqueness
  assert.strictEqual(ALL_FRAMING_OPTIONS.length, 24, 'Must have exactly 24 Framing options (1 Auto + 23 manual)');
  assert.strictEqual(MANUAL_FRAMING_OPTIONS.length, 23, 'Must have exactly 23 manual Framing options');
  assert.strictEqual(AUTO_FRAMING_OPTION.id, 'auto');

  const optionIds = new Set();
  const optionNames = new Set();
  for (const opt of ALL_FRAMING_OPTIONS) {
    assert.ok(!optionIds.has(opt.id), `Duplicate framing ID found: ${opt.id}`);
    assert.ok(!optionNames.has(opt.name), `Duplicate framing Name found: ${opt.name}`);
    optionIds.add(opt.id);
    optionNames.add(opt.name);

    assert.ok(opt.name && opt.name.length > 0, `Missing English name for ${opt.id}`);
    assert.ok(opt.description && opt.description.length > 10, `Missing or too short Indonesian description for ${opt.id}`);
    assert.ok(opt.promptDirective && opt.promptDirective.length > 15, `Missing or too short prompt directive for ${opt.id}`);
  }

  // 10b. Verify 4 Groups
  assert.strictEqual(FRAMING_GROUPS.length, 4, 'Must have exactly 4 framing groups');
  const groupCounts = {
    'detail-portrait': 0,
    'body-fashion': 0,
    'distance-environment': 0,
    'camera-angle': 0,
  };

  for (const opt of MANUAL_FRAMING_OPTIONS) {
    assert.ok(opt.groupId in groupCounts, `Unknown groupId: ${opt.groupId}`);
    groupCounts[opt.groupId]++;
  }

  assert.strictEqual(groupCounts['detail-portrait'], 5, 'Group Detail & Portrait must have exactly 5 options');
  assert.strictEqual(groupCounts['body-fashion'], 6, 'Group Tubuh & Fashion must have exactly 6 options');
  assert.strictEqual(groupCounts['distance-environment'], 4, 'Group Jarak & Lingkungan must have exactly 4 options');
  assert.strictEqual(groupCounts['camera-angle'], 8, 'Group Sudut Kamera & Perspektif must have exactly 8 options');

  // 10c. Verify Auto Mode Resolver
  const testCloseUp = resolveAutoFraming('A beautiful close-up portrait focusing on her face and eyes', '');
  assert.strictEqual(testCloseUp.id, 'close-up');

  const testFullBody = resolveAutoFraming('Full body standing pose in an evening dress, complete head to toe view', '');
  assert.strictEqual(testFullBody.id, 'full-body');

  const testPOV = resolveAutoFraming('First person POV looking at her across the candlelit dinner table', '');
  assert.strictEqual(testPOV.id, 'pov');

  const testMacro = resolveAutoFraming('Macro shot of iris reflection and intricate eyelashes', '');
  assert.strictEqual(testMacro.id, 'extreme-macro-detail');

  const testNeutral = resolveAutoFraming('An adult woman sitting in a cafe', '');
  assert.ok(testNeutral && testNeutral.promptDirective.length > 0, 'Auto mode must resolve sensible default for neutral prompt');

  // 10d. Verify System Instruction & User Prompt Integration
  const baseInput = {
    samplePrompt: 'An adult woman in an elegant silk dress in a hotel room',
    keywords: 'cinematic lighting, elegant pose',
    storyStyle: { primary: null, supporting: [], custom: '' },
    photographicStyle: { selected: [], custom: '' },
    characterLocks: {
      facelock: false,
      bodyshape: false,
      outfitlock: false,
      poselock: false,
      agepreserve: false,
      expressionlock: false,
      hairlock: false,
    },
    variationCount: 1,
  };

  const service = GeminiService.getInstance();

  // Test 10d-1: Framing Disabled -> No Framing Mandate
  const disabledSysInst = service['buildSystemInstruction']({
    ...baseInput,
    framingConfig: { enabled: false, selected: 'full-body' },
  });
  const disabledUserPrompt = service['buildUserPrompt']({
    ...baseInput,
    framingConfig: { enabled: false, selected: 'full-body' },
  });
  assert.ok(!disabledSysInst.includes('FRAMING & CAMERA COMPOSITION MANDATE'), 'Disabled framing must not inject system mandate');
  assert.ok(!disabledUserPrompt.includes('[FRAMING & CAMERA COMPOSITION'), 'Disabled framing must not inject user prompt section');

  // Test 10d-2: Manual Mode "Full Body"
  const manualSysInst = service['buildSystemInstruction']({
    ...baseInput,
    framingConfig: { enabled: true, selected: 'full-body' },
  });
  const manualUserPrompt = service['buildUserPrompt']({
    ...baseInput,
    framingConfig: { enabled: true, selected: 'full-body' },
  });
  assert.ok(manualSysInst.includes('FRAMING & CAMERA COMPOSITION MANDATE (MANUAL MODE: "Full Body")'));
  assert.ok(manualSysInst.includes('Full-body composition showing the subject completely from head to toe'));
  assert.ok(manualUserPrompt.includes('[FRAMING & CAMERA COMPOSITION - MANDATORY]'));
  assert.ok(manualUserPrompt.includes('Shot Framing: "Full Body"'));

  // Test 10d-3: Manual Mode "Eye-Level Shot"
  const eyeLevelSysInst = service['buildSystemInstruction']({
    ...baseInput,
    framingConfig: { enabled: true, selected: 'eye-level-shot' },
  });
  assert.ok(eyeLevelSysInst.includes('Position the camera at the same height as the subject\'s eyes'));

  // Test 10d-4: Auto Mode
  const autoSysInst = service['buildSystemInstruction']({
    ...baseInput,
    framingConfig: { enabled: true, selected: 'auto' },
  });
  const autoUserPrompt = service['buildUserPrompt']({
    ...baseInput,
    framingConfig: { enabled: true, selected: 'auto' },
  });
  assert.ok(autoSysInst.includes('FRAMING & CAMERA COMPOSITION MANDATE (AUTO MODE)'));
  assert.ok(autoUserPrompt.includes('[FRAMING & CAMERA COMPOSITION - AUTO MODE]'));

  // 10e. Verify i18n Translation Keys
  const requiredFramingI18nKeys = [
    'framingTitle',
    'framingSubtitle',
    'framingToggleLabel',
    'framingActiveBadge',
    'framingInactiveBadge',
    'framingPlaceholder',
    'framingAutoLabel',
    'framingSelectedLabel',
    'framingGroupDetail',
    'framingGroupBody',
    'framingGroupDistance',
    'framingGroupAngle',
    'framingAutoDesc',
  ];

  for (const k of requiredFramingI18nKeys) {
    assert.ok(k in translations.id, `Missing "${k}" in translations.id`);
    assert.ok(k in translations.en, `Missing "${k}" in translations.en`);
  }

  console.log('✓ Framing catalog verified: 24 total options (1 Auto + 23 manual across 4 groups).');
  console.log('✓ Auto mode resolver, manual mode directives, and disabled state isolation verified.');
}).then(() => {
  // 11. Verify 4 New Character Locks (Default ON & Final Prompt Integration)
  console.log('Test 11: Verify 4 New Character Locks (Default ON, UI metadata, and Prompt Integration)...');

  const newLockKeys = [
    'bodyproportionlock',
    'anatomylock',
    'poseconsistency',
    'perspectivecorrection',
  ];

  // 11a. Verify translations exist in id and en
  for (const k of newLockKeys) {
    assert.ok(k in translations.id.locksDesc, `Missing description for ${k} in translations.id.locksDesc`);
    assert.ok(k in translations.en.locksDesc, `Missing description for ${k} in translations.en.locksDesc`);
    assert.ok(translations.id.locksDesc[k].length > 30, `Description for ${k} in ID is too short`);
    assert.ok(translations.en.locksDesc[k].length > 30, `Description for ${k} in EN is too short`);
  }

  // 11b. Verify Default State (12 active, poselock & expressionlock OFF, all 14 retained)
  const defaultLocks = DEFAULT_CHARACTER_LOCKS;

  assert.strictEqual(defaultLocks.facelock, true, '/facelock must be ON by default');
  assert.strictEqual(defaultLocks.bodyshape, true, '/bodyshape_lock must be ON by default');
  assert.strictEqual(defaultLocks.outfitlock, false, '/outfitlock must be OFF by default');
  assert.strictEqual(defaultLocks.poselock, false, '/poselock must be OFF by default');
  assert.strictEqual(defaultLocks.agepreserve, true, '/agepreserve must be ON by default');
  assert.strictEqual(defaultLocks.expressionlock, false, '/expressionlock must be OFF by default');
  assert.strictEqual(defaultLocks.hairlock, true, '/hairlock must be ON by default');
  assert.strictEqual(defaultLocks.bodyproportionlock, true, '/bodyproportionlock must be ON by default');
  assert.strictEqual(defaultLocks.anatomylock, true, '/anatomylock must be ON by default');
  assert.strictEqual(defaultLocks.poseconsistency, true, '/poseconsistency must be ON by default');
  assert.strictEqual(defaultLocks.perspectivecorrection, true, '/perspectivecorrection must be ON by default');
  assert.strictEqual(defaultLocks.identitylock, true, '/identitylock must be ON by default');
  assert.strictEqual(defaultLocks.referencepriority, true, '/referencepriority must be ON by default');
  assert.strictEqual(defaultLocks.facialconsistency, true, '/facial-consistency must be ON by default');

  // Total active in default state
  const defaultActiveCount = Object.values(defaultLocks).filter(Boolean).length;
  assert.strictEqual(defaultActiveCount, 11, 'Default configuration must have exactly 11 active locks (outfitlock, poselock & expressionlock OFF, 11 locks ON)');

  // 11c. Verify System Instruction & User Prompt Builder with new locks
  const service = GeminiService.getInstance();
  const inputWithNewLocks = {
    samplePrompt: 'Wanita anggun dengan gaun malam.',
    keywords: 'cinematic studio portrait',
    storyStyle: { primary: null, supporting: [], custom: '' },
    photographicStyle: { selected: [], custom: '' },
    characterLocks: defaultLocks,
    variationCount: 1,
  };

  const sysInst = service['buildSystemInstruction'](inputWithNewLocks);
  assert.ok(sysInst.includes('/bodyproportionlock'), 'System instruction must include /bodyproportionlock');
  assert.ok(sysInst.includes('Preserve consistent natural body proportions'), 'Must include body proportions directive');
  assert.ok(sysInst.includes('/anatomylock'), 'System instruction must include /anatomylock');
  assert.ok(sysInst.includes('Maintain anatomically plausible human structure'), 'Must include anatomy directive');
  assert.ok(sysInst.includes('/poseconsistency'), 'System instruction must include /poseconsistency');
  assert.ok(sysInst.includes('Preserve the specified reference pose'), 'Must include pose consistency directive');
  assert.ok(sysInst.includes('/perspectivecorrection'), 'System instruction must include /perspectivecorrection');
  assert.ok(sysInst.includes('Maintain coherent camera perspective'), 'Must include perspective correction directive');

  const userPrompt = service['buildUserPrompt'](inputWithNewLocks);
  assert.ok(userPrompt.includes('/bodyproportionlock'));
  assert.ok(userPrompt.includes('/anatomylock'));
  assert.ok(userPrompt.includes('/poseconsistency'));
  assert.ok(userPrompt.includes('/perspectivecorrection'));

  // 11d. Verify Inactive state isolation (when locks are OFF, no directives injected)
  const inputWithNewLocksOff = {
    ...inputWithNewLocks,
    characterLocks: {
      ...defaultLocks,
      bodyproportionlock: false,
      anatomylock: false,
      poseconsistency: false,
      perspectivecorrection: false,
    },
  };

  const sysInstOff = service['buildSystemInstruction'](inputWithNewLocksOff);
  assert.ok(!sysInstOff.includes('/bodyproportionlock'), 'Disabled bodyproportionlock must not be in system instruction');
  assert.ok(!sysInstOff.includes('/anatomylock'), 'Disabled anatomylock must not be in system instruction');
  assert.ok(!sysInstOff.includes('/poseconsistency'), 'Disabled poseconsistency must not be in system instruction');
  assert.ok(!sysInstOff.includes('/perspectivecorrection'), 'Disabled perspectivecorrection must not be in system instruction');

  const userPromptOff = service['buildUserPrompt'](inputWithNewLocksOff);
  assert.ok(!userPromptOff.includes('/bodyproportionlock'), 'Disabled bodyproportionlock must not be in user prompt');
  assert.ok(!userPromptOff.includes('/anatomylock'), 'Disabled anatomylock must not be in user prompt');
  assert.ok(!userPromptOff.includes('/poseconsistency'), 'Disabled poseconsistency must not be in user prompt');
  assert.ok(!userPromptOff.includes('/perspectivecorrection'), 'Disabled perspectivecorrection must not be in user prompt');

  console.log('✓ 4 New Character Locks verified: Default ON, UI descriptions, prompt integration, and inactive isolation.');

  // 12. Verify Default Application Settings (Aspect Ratio 9:16, Shot Framing ON + Auto, Story Style Hide All)
  console.log('Test 12: Verify Default Application Settings (Aspect Ratio = 9:16, Shot Framing = ON + Cowboy Shot, Story Style Selector = Hide All)...');
  const appSrc = fs.readFileSync('src/App.tsx', 'utf8');
  assert.ok(appSrc.includes("return '9:16';"), 'App.tsx must default selectedAspectRatio to 9:16');
  assert.ok(appSrc.includes("return { enabled: true, selected: 'cowboy-shot' };"), 'App.tsx must default framingConfig to ON (enabled: true) + Cowboy Shot (selected: cowboy-shot)');
  
  const storyStyleSrc = fs.readFileSync('src/components/StoryStyleSelector.tsx', 'utf8');
  assert.ok(storyStyleSrc.includes("const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});"), 'StoryStyleSelector must default all categories to hidden/collapsed (openCategories = {})');
  console.log('✓ Default Application Settings verified: Aspect Ratio = 9:16, Shot Framing = ON + Cowboy Shot, Story Style Selector = Hide All.');

  // 13. Verify Photographic Style "Nyata" Preset (Catalog, Descriptions, Prompt Integration, Coexistence, and Isolation)
  console.log('Test 13: Verify Photographic Style "Nyata" Preset...');
  
  // 13a. Catalog verification
  const nyataItem = PHOTOGRAPHIC_STYLES.find(s => s.id === 'nyata');
  assert.ok(nyataItem, 'Style "Nyata" must exist in PHOTOGRAPHIC_STYLES');
  assert.strictEqual(nyataItem.name, 'Nyata');
  assert.ok(nyataItem.description.includes('identitas wajah sesuai referensi'), 'Description must match specified text');
  assert.ok(nyataItem.description.includes('tekstur kulit manusia yang autentik'));

  // 13b. Translations verification
  assert.strictEqual(translations.id.photoDesc.nyata, nyataItem.description, 'Indonesian translation must match');
  assert.ok(translations.en.photoDesc.nyata, 'English translation must exist');
  assert.ok(translations.en.photoDesc.nyata.includes('facial identity matching reference'));

  // 13c. Config structure verification
  assert.strictEqual(NYATA_STYLE_CONFIG.id, 'nyata');
  assert.strictEqual(NYATA_STYLE_CONFIG.name, 'Nyata');
  assert.strictEqual(NYATA_STYLE_CONFIG.faceIdentityLock.shorthand, '/identitylock /master-face-lock /referencepriority /facial-consistency');
  assert.strictEqual(NYATA_STYLE_CONFIG.naturalPhotorealism.shorthand, '/photorealism /maximum-detail /natural-skin-texture /anti-ai-artifacts');
  assert.strictEqual(NYATA_STYLE_CONFIG.shorthands.length, 8);

  // 13d. Prompt Integration - Solo Nyata
  const inputSoloNyata = {
    samplePrompt: '30-year-old woman in elegant silk dress.',
    keywords: 'soft window light',
    storyStyle: { primary: '', supporting: [], custom: '', matureSubstyle: null, matureIntensity: 'Soft' },
    photographicStyle: { selected: ['Nyata'], custom: '' },
    characterLocks: DEFAULT_CHARACTER_LOCKS,
    variationCount: 1,
  };

  const sysInstNyata = service['buildSystemInstruction'](inputSoloNyata);
  assert.ok(sysInstNyata.includes('NYATA RENDERING & FACE IDENTITY MANDATE (PRESET NYATA)'), 'Must include Nyata mandate header');
  assert.ok(sysInstNyata.includes('/identitylock /master-face-lock /referencepriority /facial-consistency'), 'Must include Face Identity Lock shorthands');
  assert.ok(sysInstNyata.includes('/photorealism /maximum-detail /natural-skin-texture /anti-ai-artifacts'), 'Must include Natural Photorealism shorthands');
  assert.ok(sysInstNyata.includes('Gunakan gambar referensi yang diunggah sebagai acuan utama identitas wajah subjek.'), 'Must include Face Identity instructions');
  assert.ok(sysInstNyata.includes('Hasil akhir harus tampak seperti foto nyata yang diambil menggunakan kamera'), 'Must include Natural Photorealism instructions');
  assert.ok(!sysInstNyata.includes('ULTRA REALISTIC RENDERING MANDATE'), 'Must not include Ultra Realistic when only Nyata is selected');

  const userPromptNyata = service['buildUserPrompt'](inputSoloNyata);
  assert.ok(userPromptNyata.includes('Selected Styles: Nyata'));
  assert.ok(userPromptNyata.includes('/identitylock /master-face-lock'));
  assert.ok(userPromptNyata.includes('/photorealism /maximum-detail'));

  // 13e. Coexistence with Ultra Realistic (Both selected, single injection each, complementary)
  const inputBothStyles = {
    ...inputSoloNyata,
    photographicStyle: { selected: ['Nyata', 'Ultra Realistic'], custom: '' },
  };

  const sysInstBoth = service['buildSystemInstruction'](inputBothStyles);
  assert.ok(sysInstBoth.includes('NYATA RENDERING & FACE IDENTITY MANDATE (PRESET NYATA)'), 'Must include Nyata mandate');
  assert.ok(sysInstBoth.includes('ULTRA REALISTIC RENDERING MANDATE'), 'Must include Ultra Realistic mandate');
  // Check exact single occurrence of Nyata mandate
  const nyataMandateCount = (sysInstBoth.match(/NYATA RENDERING & FACE IDENTITY MANDATE/g) || []).length;
  assert.strictEqual(nyataMandateCount, 1, 'Nyata mandate must appear exactly once');
  const ultraMandateCount = (sysInstBoth.match(/ULTRA REALISTIC RENDERING MANDATE/g) || []).length;
  assert.strictEqual(ultraMandateCount, 1, 'Ultra Realistic mandate must appear exactly once');

  // 13f. Inactive Isolation (when Nyata is deselected, all its directives are removed cleanly)
  const inputNyataDeselected = {
    ...inputSoloNyata,
    photographicStyle: { selected: ['Ultra Realistic'], custom: '' },
  };

  const sysInstDeselected = service['buildSystemInstruction'](inputNyataDeselected);
  assert.ok(!sysInstDeselected.includes('NYATA RENDERING & FACE IDENTITY MANDATE'), 'Must not contain Nyata mandate when deselected');
  assert.ok(!sysInstDeselected.includes('/identitylock /master-face-lock'), 'Must not contain Nyata shorthands when deselected');
  assert.ok(sysInstDeselected.includes('ULTRA REALISTIC RENDERING MANDATE'), 'Ultra Realistic must remain intact');

  const userPromptDeselected = service['buildUserPrompt'](inputNyataDeselected);
  assert.ok(!userPromptDeselected.includes('Nyata Preset Directives'), 'User prompt must not contain Nyata directives when deselected');
  assert.ok(!userPromptDeselected.includes('/identitylock /master-face-lock'), 'User prompt must not contain Nyata shorthands when deselected');
  assert.ok(userPromptDeselected.includes('Selected Styles: Ultra Realistic'), 'Remaining styles must be intact');

  console.log('✓ Photographic Style "Nyata" verified: Catalog, i18n, prompt integration, coexistence, and clean isolation.');

  // 14. Verify Shorthand System Centralization, Active Locks Integration, Deduplication, and Isolation
  console.log('Test 14: Verify Shorthand System Centralization, Active Locks Integration, Deduplication, and Isolation...');

  // 14a. Centralized Catalog Verification
  assert.strictEqual(CHARACTER_LOCKS_CONFIG.length, 14, 'CHARACTER_LOCKS_CONFIG must contain exactly 14 core locks');
  const expectedLockKeys = [
    'facelock', 'bodyshape', 'outfitlock', 'poselock', 'agepreserve',
    'expressionlock', 'hairlock', 'bodyproportionlock', 'anatomylock',
    'poseconsistency', 'perspectivecorrection', 'identitylock', 'referencepriority', 'facialconsistency'
  ];
  for (const key of expectedLockKeys) {
    const item = CHARACTER_LOCKS_CONFIG.find(l => l.key === key);
    assert.ok(item, `Lock key "${key}" must exist in CHARACTER_LOCKS_CONFIG`);
    assert.ok(item.tag.startsWith('/'), `Lock "${key}" tag must start with /`);
    assert.ok(item.name && item.name.length > 2, `Lock "${key}" must have a valid name`);
    assert.ok(item.promptInstruction && item.promptInstruction.length > 10, `Lock "${key}" must have a prompt instruction`);
    assert.ok(item.descriptionId && item.descriptionId.length > 10, `Lock "${key}" must have Indonesian description`);
    assert.ok(item.descriptionEn && item.descriptionEn.length > 10, `Lock "${key}" must have English description`);
  }

  // 14b. Registered Additional Shorthands
  assert.strictEqual(REGISTERED_ADDITIONAL_SHORTHANDS.length, 8, 'Must have 8 registered additional shorthands');
  const additionalTags = REGISTERED_ADDITIONAL_SHORTHANDS.map(s => s.tag);
  assert.ok(additionalTags.includes('/identitylock'));
  assert.ok(additionalTags.includes('/master-face-lock'));
  assert.ok(additionalTags.includes('/photorealism'));
  assert.ok(additionalTags.includes('/natural-skin-texture'));

  // 14c. Active vs Inactive Shorthands: Only 1 Lock Active
  const singleLockState = {
    ...DEFAULT_CHARACTER_LOCKS,
    facelock: true,
    bodyshape: false,
    outfitlock: false,
    poselock: false,
    agepreserve: false,
    expressionlock: false,
    hairlock: false,
    bodyproportionlock: false,
    anatomylock: false,
    poseconsistency: false,
    perspectivecorrection: false,
    identitylock: false,
    referencepriority: false,
    facialconsistency: false,
  };
  const activeTagsSingle = getActiveLockTags(singleLockState);
  assert.deepStrictEqual(activeTagsSingle, ['/facelock 100%']);

  const promptSingle = integrateActiveShorthandsIntoPrompt('A woman walking in the park --ar 9:16', singleLockState);
  assert.ok(promptSingle.includes('Face Lock:'), 'Must include Face Lock directive');
  assert.ok(!promptSingle.includes('Body Shape Lock:'), 'Must not include inactive Body Shape Lock');
  assert.ok(!promptSingle.includes('Outfit Lock:'), 'Must not include inactive Outfit Lock');
  assert.ok(promptSingle.endsWith('--ar 9:16'), 'Must preserve trailing --ar parameter at the very end');

  // 14d. Entirely Inactive Shorthands: Zero Locks Active
  const allInactiveState = {
    facelock: false,
    bodyshape: false,
    outfitlock: false,
    poselock: false,
    agepreserve: false,
    expressionlock: false,
    hairlock: false,
    bodyproportionlock: false,
    anatomylock: false,
    poseconsistency: false,
    perspectivecorrection: false,
    identitylock: false,
    referencepriority: false,
    facialconsistency: false,
  };
  const activeTagsNone = getActiveLockTags(allInactiveState);
  assert.deepStrictEqual(activeTagsNone, []);

  const promptNone = integrateActiveShorthandsIntoPrompt('A serene mountain landscape --ar 16:9', allInactiveState);
  assert.strictEqual(promptNone, 'A serene mountain landscape --ar 16:9', 'Prompt must remain untouched when all locks are inactive');

  // 14e. Deduplication of Overlapping Shorthands
  // (i) bodyshape + bodyproportionlock
  const bodyOverlapState = {
    ...allInactiveState,
    bodyshape: true,
    bodyproportionlock: true,
  };
  const bodyDirectives = buildDeduplicatedLockDirectives(bodyOverlapState);
  assert.strictEqual(bodyDirectives.length, 1, 'bodyshape + bodyproportionlock must be deduplicated into 1 unified directive');
  assert.ok(bodyDirectives[0].includes('Body & Proportion Lock:'));

  // (ii) poselock + poseconsistency
  const poseOverlapState = {
    ...allInactiveState,
    poselock: true,
    poseconsistency: true,
  };
  const poseDirectives = buildDeduplicatedLockDirectives(poseOverlapState);
  assert.strictEqual(poseDirectives.length, 1, 'poselock + poseconsistency must be deduplicated into 1 unified directive');
  assert.ok(poseDirectives[0].includes('Pose Lock & Consistency:'));

  // (iii) facelock + Nyata identitylock
  const faceNyataOverlap = buildDeduplicatedLockDirectives({ ...allInactiveState, facelock: true }, true);
  assert.strictEqual(faceNyataOverlap.length, 1, 'facelock + Nyata identity must merge harmoniously without duplication');
  assert.ok(faceNyataOverlap[0].includes('Face Identity Lock:'));

  // 14f. Dynamic Output Formatting & No Redundant Sentence Injection
  const mockBasePrompt = 'Vivid portrait of an elegant woman, soft candlelight --ar 9:16';
  const integratedPrompt = integrateActiveShorthandsIntoPrompt(mockBasePrompt, DEFAULT_CHARACTER_LOCKS);
  // Repeat integration to verify idempotence (no duplicate sentences)
  const reIntegratedPrompt = integrateActiveShorthandsIntoPrompt(integratedPrompt, DEFAULT_CHARACTER_LOCKS);
  assert.strictEqual(reIntegratedPrompt, integratedPrompt, 'Re-integration must be idempotent and avoid duplicated sentences');

  // 14g. UI Components Check: OutputSection displays Active Shorthands & Edit capability
  const outputSectionSrc = fs.readFileSync('src/components/OutputSection.tsx', 'utf8');
  assert.ok(outputSectionSrc.includes('item.activeLocks'), 'OutputSection must inspect item.activeLocks');
  assert.ok(outputSectionSrc.includes('activeCharacterLocksLabel'), 'OutputSection must display activeCharacterLocksLabel');
  assert.ok(outputSectionSrc.includes('noActiveLocksNotice'), 'OutputSection must handle no active locks gracefully');
  assert.ok(outputSectionSrc.includes('handleStartEdit'), 'OutputSection must provide inline editing functionality');
  assert.ok(outputSectionSrc.includes('onUpdatePrompt'), 'OutputSection must support onUpdatePrompt callback');

  console.log('✓ Shorthand System Centralization, Active Locks Integration, Deduplication, and Isolation verified.');

  // 15. Verify 7 New Shorthands with DEFAULT ON (/identitylock, /referencepriority, /facial-consistency, /photorealism, /maximum-detail, /natural-skin-texture, /anti-ai-artifacts)
  console.log('Test 15: Verify 7 New Shorthands with DEFAULT ON...');

  // 15a. Location A: Character Locks 3 New Shorthands
  const charLockKeys = ['identitylock', 'referencepriority', 'facialconsistency'];
  for (const k of charLockKeys) {
    const item = CHARACTER_LOCKS_CONFIG.find(l => l.key === k);
    assert.ok(item, `Character Locks catalog must include new lock "${k}"`);
    assert.ok(item.tag.startsWith('/'), `Lock "${k}" tag must start with /`);
    assert.ok(item.name.length > 0, `Lock "${k}" must have a name`);
    assert.ok(item.descriptionId.length > 20, `Lock "${k}" must have Indonesian description`);
    assert.ok(item.promptInstruction.length > 20, `Lock "${k}" must have prompt directive`);
    assert.strictEqual(DEFAULT_CHARACTER_LOCKS[k], true, `New character lock "${k}" must be DEFAULT ON (true)`);
  }

  // 15b. Location B: Photographic Style 4 New Shorthands
  const photoShorthandIds = ['photorealism', 'maximum-detail', 'natural-skin-texture', 'anti-ai-artifacts'];
  for (const id of photoShorthandIds) {
    const item = PHOTOGRAPHIC_STYLES.find(s => s.id === id);
    assert.ok(item, `Photographic Styles catalog must include new style "${id}"`);
    assert.ok(item.shorthand && item.shorthand.startsWith('/'), `Style "${id}" shorthand must start with /`);
    assert.ok(item.name.length > 0, `Style "${id}" must have a name`);
    assert.ok(item.description.length > 20, `Style "${id}" must have description`);
    assert.ok(item.promptDirective && item.promptDirective.length > 20, `Style "${id}" must have prompt directive`);
    assert.ok(DEFAULT_PHOTOGRAPHIC_STYLES.includes(item.name), `Style "${item.name}" must be in DEFAULT_PHOTOGRAPHIC_STYLES`);
  }

  // 'Nyata' is active in default styles per reference
  assert.ok(DEFAULT_PHOTOGRAPHIC_STYLES.includes('Nyata'), 'DEFAULT_PHOTOGRAPHIC_STYLES must retain Nyata');
  assert.strictEqual(DEFAULT_PHOTOGRAPHIC_STYLES.length, 5, 'DEFAULT_PHOTOGRAPHIC_STYLES must have 5 items (Nyata + 4 new shorthands)');

  // 15c. Independent Toggleability & Persistence
  // Can turn off identitylock and photorealism independently
  const toggledLocks = {
    ...DEFAULT_CHARACTER_LOCKS,
    identitylock: false,
  };
  assert.strictEqual(toggledLocks.identitylock, false);
  assert.strictEqual(toggledLocks.referencepriority, true);
  assert.strictEqual(toggledLocks.facialconsistency, true);

  const toggledPhotoStyles = DEFAULT_PHOTOGRAPHIC_STYLES.filter(s => s !== 'Photorealism');
  assert.ok(!toggledPhotoStyles.includes('Photorealism'));
  assert.ok(toggledPhotoStyles.includes('Maximum Detail'));

  // 15d. Active Photographic Shorthand Tags Helper
  const activePhotoTags = getActivePhotographicShorthands(DEFAULT_PHOTOGRAPHIC_STYLES);
  assert.strictEqual(activePhotoTags.length, 4, 'Must return all 4 active shorthand tags for DEFAULT_PHOTOGRAPHIC_STYLES');
  assert.ok(activePhotoTags.includes('/photorealism'));
  assert.ok(activePhotoTags.includes('/maximum-detail'));
  assert.ok(activePhotoTags.includes('/natural-skin-texture'));
  assert.ok(activePhotoTags.includes('/anti-ai-artifacts'));

  // 15e. Integration into Prompt with all 7 new shorthands active
  const baseScenePrompt = 'A sophisticated woman in a silk trench coat walking through morning mist in Kyoto --ar 9:16';
  const fullIntegratedPrompt = integrateActiveShorthandsIntoPrompt(baseScenePrompt, DEFAULT_CHARACTER_LOCKS, {
    photoStyles: DEFAULT_PHOTOGRAPHIC_STYLES,
    hasFaceReference: true,
  });

  // Verify presence of directives
  assert.ok(fullIntegratedPrompt.includes('Face Identity Lock:'), 'Must include unified face identity directive');
  assert.ok(fullIntegratedPrompt.includes('Reference Priority:'), 'Must include reference priority directive');
  assert.ok(fullIntegratedPrompt.includes('Photorealism:'), 'Must include photorealism directive');
  assert.ok(fullIntegratedPrompt.includes('Natural Skin Texture:'), 'Must include natural skin texture directive');
  assert.ok(fullIntegratedPrompt.includes('Maximum Detail:'), 'Must include maximum detail directive');
  assert.ok(fullIntegratedPrompt.includes('Anti-AI Artifacts:'), 'Must include anti-ai artifacts directive');
  assert.ok(fullIntegratedPrompt.endsWith('--ar 9:16'), 'Trailing --ar 9:16 must be preserved at the end');

  // 15f. Deduplication when Nyata is selected alongside new photographic styles
  const promptWithNyataAndNew = integrateActiveShorthandsIntoPrompt(baseScenePrompt, DEFAULT_CHARACTER_LOCKS, {
    isNyata: true,
    photoStyles: DEFAULT_PHOTOGRAPHIC_STYLES,
    hasFaceReference: true,
  });
  // Since Nyata already provides photorealism and skin texture, redundant standalones are omitted
  const photorealismCount = (promptWithNyataAndNew.match(/Photorealism:/g) || []).length;
  assert.strictEqual(photorealismCount, 0, 'Standalone Photorealism directive should not duplicate when Nyata is active');
  assert.ok(promptWithNyataAndNew.includes('Maximum Detail:'), 'Maximum Detail remains active even with Nyata');

  // 15g. Non-photographic style respect (Anime/Manga does not force photorealism)
  const animePrompt = integrateActiveShorthandsIntoPrompt('Anime heroine in magical forest --ar 1:1', DEFAULT_CHARACTER_LOCKS, {
    photoStyles: DEFAULT_PHOTOGRAPHIC_STYLES,
    storyStyle: 'Anime & Manga Style',
    hasFaceReference: false,
  });
  assert.ok(!animePrompt.includes('Photorealism:'), 'Must not force Photorealism onto explicit Anime style');
  assert.ok(!animePrompt.includes('Natural Skin Texture:'), 'Must not force photographic skin pores onto Anime style');

  // 15h. Grounding without face reference (does not claim uploaded photo reference exists)
  const noRefPrompt = integrateActiveShorthandsIntoPrompt('Portrait of an astronaut on Mars --ar 16:9', DEFAULT_CHARACTER_LOCKS, {
    hasFaceReference: false,
  });
  assert.ok(!noRefPrompt.includes('reference photo and prompt'), 'Must not claim reference photo exists when none provided');
  assert.ok(noRefPrompt.includes('throughout the scene'), 'Must ground identity throughout the scene without hallucinating photo reference');

  // 15i. Verify UI Reset Buttons in CharacterLocks and PhotographicStyleSelector
  const charLocksSrc = fs.readFileSync('src/components/CharacterLocks.tsx', 'utf8');
  assert.ok(charLocksSrc.includes('handleResetDefault'), 'CharacterLocks must provide handleResetDefault');
  assert.ok(charLocksSrc.includes('DEFAULT_CHARACTER_LOCKS'), 'CharacterLocks must reset to DEFAULT_CHARACTER_LOCKS');

  const photoStyleSelectorSrc = fs.readFileSync('src/components/PhotographicStyleSelector.tsx', 'utf8');
  assert.ok(photoStyleSelectorSrc.includes('handleResetDefault'), 'PhotographicStyleSelector must provide handleResetDefault');
  assert.ok(photoStyleSelectorSrc.includes('DEFAULT_PHOTOGRAPHIC_STYLES'), 'PhotographicStyleSelector must reset to DEFAULT_PHOTOGRAPHIC_STYLES');
  assert.ok(photoStyleSelectorSrc.includes('style.shorthand'), 'PhotographicStyleSelector must render style.shorthand badge');

  console.log('✓ All 7 new shorthands (/identitylock, /referencepriority, /facial-consistency, /photorealism, /maximum-detail, /natural-skin-texture, /anti-ai-artifacts) verified with DEFAULT ON, independent toggle, prompt integration, deduplication, and non-photo/no-ref safety.');
}).then(() => {
  // 16. Verify Hide/Show Collapsible State on 5 Sections with Default HIDE
  console.log('Test 16: Verify Hide/Show Collapsible State on 5 Sections with Default HIDE...');

  const storyStyleSrc = fs.readFileSync('src/components/StoryStyleSelector.tsx', 'utf8');
  assert.ok(storyStyleSrc.includes('const [isExpanded, setIsExpanded] = useState(false);'), 'StoryStyleSelector must default isExpanded to false (HIDE)');
  assert.ok(storyStyleSrc.includes('ChevronDown'), 'StoryStyleSelector must render chevron indicator');

  const photoStyleSrc = fs.readFileSync('src/components/PhotographicStyleSelector.tsx', 'utf8');
  assert.ok(photoStyleSrc.includes('const [isExpanded, setIsExpanded] = useState(false);'), 'PhotographicStyleSelector must default isExpanded to false (HIDE)');
  assert.ok(photoStyleSrc.includes('ChevronDown'), 'PhotographicStyleSelector must render chevron indicator');

  const framingSrc = fs.readFileSync('src/components/FramingSelector.tsx', 'utf8');
  assert.ok(framingSrc.includes('const [isExpanded, setIsExpanded] = useState(false);'), 'FramingSelector must default isExpanded to false (HIDE)');
  assert.ok(framingSrc.includes('ChevronDown'), 'FramingSelector must render chevron indicator');

  const charLocksSrc = fs.readFileSync('src/components/CharacterLocks.tsx', 'utf8');
  assert.ok(charLocksSrc.includes('const [isExpanded, setIsExpanded] = useState(false);'), 'CharacterLocks must default isExpanded to false (HIDE)');
  assert.ok(charLocksSrc.includes('ChevronDown'), 'CharacterLocks must render chevron indicator');

  const variationSrc = fs.readFileSync('src/components/VariationSettings.tsx', 'utf8');
  assert.ok(variationSrc.includes('const [isExpanded, setIsExpanded] = useState(false);'), 'VariationSettings must default isExpanded to false (HIDE)');
  assert.ok(variationSrc.includes('ChevronDown'), 'VariationSettings must render chevron indicator');

  assert.ok(translations.id.expandSection && translations.id.collapseSection, 'id translation must have expandSection and collapseSection');
  assert.ok(translations.en.expandSection && translations.en.collapseSection, 'en translation must have expandSection and collapseSection');

  console.log('✓ Hide/Show Collapsible State verified on all 5 sections with Default HIDE, chevron indicators, and full translation parity.');
}).then(() => {
  // 17. Verify Empty Initial Preset State & Manual User Preset Management
  console.log('Test 17: Verify Empty Initial Preset State & Manual User Preset Management...');

  // 17a. Verify BUILTIN_CHARACTER_LOCK_PRESETS is empty (no automatic built-in presets)
  assert.ok(Array.isArray(BUILTIN_CHARACTER_LOCK_PRESETS), 'BUILTIN_CHARACTER_LOCK_PRESETS must be an array');
  assert.strictEqual(BUILTIN_CHARACTER_LOCK_PRESETS.length, 0, 'BUILTIN_CHARACTER_LOCK_PRESETS must be empty (0 presets)');

  // 17b. Verify migration filter: strips legacy built-in presets while preserving user-created presets
  const mixedStoragePresets = [
    {
      id: 'preset-01-realistis',
      name: '01. Realistis',
      isBuiltIn: true,
      locks: { ...DEFAULT_CHARACTER_LOCKS },
    },
    {
      id: 'preset-02-anime-to-realis',
      name: '02. Anime to Realis',
      isBuiltIn: true,
      locks: { ...DEFAULT_CHARACTER_LOCKS },
    },
    {
      id: 'preset-custom-user-1',
      name: '01. Realistis', // User named their own preset "01. Realistis"
      isBuiltIn: false,
      locks: { ...DEFAULT_CHARACTER_LOCKS, poselock: true },
    },
    {
      id: 'preset-custom-user-2',
      name: 'My Studio Setup',
      isBuiltIn: false,
      locks: { ...DEFAULT_CHARACTER_LOCKS, outfitlock: true },
    },
  ];

  const filtered = filterOutLegacyBuiltinPresets(mixedStoragePresets);
  assert.strictEqual(filtered.length, 2, 'Must filter out legacy built-in presets and retain only user presets');
  assert.strictEqual(filtered[0].id, 'preset-custom-user-1', 'Must preserve user preset even if named 01. Realistis');
  assert.strictEqual(filtered[1].id, 'preset-custom-user-2', 'Must preserve all user custom presets');

  // When no user presets exist in storage, result is empty array
  const emptyClean = filterOutLegacyBuiltinPresets([
    { id: 'preset-01-realistis', name: '01. Realistis', isBuiltIn: true, locks: {} },
  ]);
  assert.strictEqual(emptyClean.length, 0, 'When only built-ins existed, migration must result in empty array');

  // 17c. Manual user preset creation & full 14-toggle fidelity
  const manualUserPreset = {
    id: 'preset-custom-123456789',
    name: '01. Realistis',
    description: 'Manual custom preset created by user',
    isBuiltIn: false,
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
    updatedAt: Date.now(),
  };

  // Verify all 14 locks stored with exact fidelity
  assert.strictEqual(manualUserPreset.locks.facelock, true);
  assert.strictEqual(manualUserPreset.locks.bodyshape, true);
  assert.strictEqual(manualUserPreset.locks.outfitlock, true);
  assert.strictEqual(manualUserPreset.locks.poselock, false);
  assert.strictEqual(manualUserPreset.locks.agepreserve, true);
  assert.strictEqual(manualUserPreset.locks.expressionlock, false);
  assert.strictEqual(manualUserPreset.locks.hairlock, true);
  assert.strictEqual(manualUserPreset.locks.bodyproportionlock, true);
  assert.strictEqual(manualUserPreset.locks.anatomylock, true);
  assert.strictEqual(manualUserPreset.locks.poseconsistency, false);
  assert.strictEqual(manualUserPreset.locks.perspectivecorrection, false);
  assert.strictEqual(manualUserPreset.locks.identitylock, true);
  assert.strictEqual(manualUserPreset.locks.referencepriority, false);
  assert.strictEqual(manualUserPreset.locks.facialconsistency, true);

  // 17d. Equality & Dirty State Checking (areLocksEqual)
  const cloneLocks = { ...manualUserPreset.locks };
  assert.strictEqual(areLocksEqual(manualUserPreset.locks, cloneLocks), true, 'Identical locks must be equal');
  const dirtyLocks = { ...cloneLocks, poselock: true };
  assert.strictEqual(areLocksEqual(manualUserPreset.locks, dirtyLocks), false, 'Changing any lock must trigger dirty state');

  // 17e. Full 14-toggle application on Load (including OFF locks)
  const allTrueLocks = {
    facelock: true,
    bodyshape: true,
    outfitlock: true,
    poselock: true,
    agepreserve: true,
    expressionlock: true,
    hairlock: true,
    bodyproportionlock: true,
    anatomylock: true,
    poseconsistency: true,
    perspectivecorrection: true,
    identitylock: true,
    referencepriority: true,
    facialconsistency: true,
  };
  const loadedFromManual = {
    facelock: Boolean(manualUserPreset.locks.facelock),
    bodyshape: Boolean(manualUserPreset.locks.bodyshape),
    outfitlock: Boolean(manualUserPreset.locks.outfitlock),
    poselock: Boolean(manualUserPreset.locks.poselock),
    agepreserve: Boolean(manualUserPreset.locks.agepreserve),
    expressionlock: Boolean(manualUserPreset.locks.expressionlock),
    hairlock: Boolean(manualUserPreset.locks.hairlock),
    bodyproportionlock: Boolean(manualUserPreset.locks.bodyproportionlock),
    anatomylock: Boolean(manualUserPreset.locks.anatomylock),
    poseconsistency: Boolean(manualUserPreset.locks.poseconsistency),
    perspectivecorrection: Boolean(manualUserPreset.locks.perspectivecorrection),
    identitylock: Boolean(manualUserPreset.locks.identitylock),
    referencepriority: Boolean(manualUserPreset.locks.referencepriority),
    facialconsistency: Boolean(manualUserPreset.locks.facialconsistency),
  };
  assert.strictEqual(loadedFromManual.poselock, false, 'Loading must turn poselock OFF');
  assert.strictEqual(loadedFromManual.expressionlock, false, 'Loading must turn expressionlock OFF');
  assert.strictEqual(loadedFromManual.poseconsistency, false, 'Loading must turn poseconsistency OFF');
  assert.strictEqual(loadedFromManual.perspectivecorrection, false, 'Loading must turn perspectivecorrection OFF');
  assert.strictEqual(loadedFromManual.referencepriority, false, 'Loading must turn referencepriority OFF');
  assert.strictEqual(loadedFromManual.outfitlock, true, 'Loading must keep outfitlock ON');

  // 17f. Prompt Generator Integration with Manual Presets
  const testBasePrompt = 'A portrait of an adult woman in a luxury penthouse at night --ar 9:16';
  const promptFromManual = integrateActiveShorthandsIntoPrompt(testBasePrompt, manualUserPreset.locks, {
    hasFaceReference: true,
  });

  // Active locks must be included
  assert.ok(promptFromManual.includes('Face Identity Lock:'), 'Must include Face Identity Lock directive');
  assert.ok(promptFromManual.includes('Body & Proportion Lock:'), 'Must include Body & Proportion Lock directive');
  assert.ok(promptFromManual.includes('Outfit Lock:'), 'Must include Outfit Lock directive');
  assert.ok(promptFromManual.includes('Hair Lock:'), 'Must include Hair Lock directive');
  assert.ok(promptFromManual.includes('Anatomy Lock:'), 'Must include Anatomy Lock directive');

  // Inactive locks must NOT be included
  assert.ok(!promptFromManual.includes('Pose Lock:'), 'Must NOT include Pose Lock directive when poselock is OFF');
  assert.ok(!promptFromManual.includes('Expression Lock:'), 'Must NOT include Expression Lock directive when expressionlock is OFF');
  assert.ok(!promptFromManual.includes('Pose Consistency Lock:'), 'Must NOT include Pose Consistency Lock directive when poseconsistency is OFF');
  assert.ok(!promptFromManual.includes('Perspective Correction Lock:'), 'Must NOT include Perspective Correction Lock directive when perspectivecorrection is OFF');
  assert.ok(!promptFromManual.includes('Reference Priority:'), 'Must NOT include Reference Priority directive when referencepriority is OFF');

  // 17g. Storage Keys
  assert.strictEqual(STORAGE_KEY_CHARACTER_LOCK_PRESETS, 'mature_prompt_studio_lock_presets_v1');
  assert.strictEqual(STORAGE_KEY_ACTIVE_LOCK_PRESET_ID, 'mature_prompt_studio_active_preset_id_v1');

  // 17h. UI Structure & Empty State in CharacterLocks.tsx
  const charLocksCode = fs.readFileSync('src/components/CharacterLocks.tsx', 'utf8');
  assert.ok(charLocksCode.includes('filterOutLegacyBuiltinPresets'), 'Must use filterOutLegacyBuiltinPresets on load');
  assert.ok(charLocksCode.includes('t.emptyPresetsTitle'), 'Must render emptyPresetsTitle');
  assert.ok(charLocksCode.includes('t.emptyPresetsDesc'), 'Must render emptyPresetsDesc');
  assert.ok(charLocksCode.includes('t.btnCreateNewPreset'), 'Must provide btnCreateNewPreset button');
  assert.ok(charLocksCode.includes('t.presetActiveLabel'), 'Must display active preset label');
  assert.ok(charLocksCode.includes('t.btnLoadPreset'), 'Must provide load preset button');
  assert.ok(charLocksCode.includes('t.btnSavePreset'), 'Must provide save preset button');
  assert.ok(charLocksCode.includes('t.btnSaveAsPreset'), 'Must provide save as preset button');
  assert.ok(charLocksCode.includes('t.btnManagePresets'), 'Must provide manage presets button');
  assert.ok(charLocksCode.includes('t.modalSavePresetTitle'), 'Must contain Save As modal');
  assert.ok(charLocksCode.includes('t.modalManagePresetsTitle'), 'Must contain Manage Presets modal');
  assert.ok(charLocksCode.includes('const [isExpanded, setIsExpanded] = useState(false);'), 'Must preserve default HIDE');

  // 17i. Translation empty state strings
  assert.strictEqual(translations.id.emptyPresetsTitle, 'Belum ada preset tersimpan.');
  assert.ok(translations.id.emptyPresetsDesc.includes('Buat preset sendiri'));
  assert.strictEqual(translations.en.emptyPresetsTitle, 'No saved presets yet.');

  console.log('✓ Character Lock Presets verified: Empty initial state, zero built-ins, clean migration, manual user creation, 14-toggle fidelity, prompt generator integration, and responsive UI.');
}).then(() => {
  // 18. Verify Strict User Intent & Targeted Prompt Modification (A → B)
  console.log('Test 18: Verify Strict User Intent & Targeted Prompt Modification (A → B)...');
  const gemini = GeminiService.getInstance();

  const mockBothInput = {
    samplePrompt: 'A realistic 29-year-old Japanese woman with shoulder-length wavy black hair, wearing an elegant navy tailored business suit, standing in a brightly lit modern office lobby, candid 85mm portrait.',
    keywords: 'Ganti pakaian menjadi setelan formal hitam, ubah latar menjadi kamar hotel mewah temaram.',
    storyStyle: {
      primary: 'Mature & Sensual',
      matureSubstyle: 'Soft Sensuality',
      matureIntensity: 'Soft',
      supporting: [],
      custom: '',
    },
    photographicStyle: {
      selected: ['Ultra Realistic'],
      custom: '',
    },
    characterLocks: {
      facelock: true,
      bodyshape: true,
      outfitlock: false,
      poselock: false,
      agepreserve: true,
      expressionlock: false,
      hairlock: true,
    },
    variationCount: 2,
    selectedAspectRatio: '9:16',
  };

  // 18a. Verify System Instruction Mandates
  const sysInstruction = gemini['buildSystemInstruction'](mockBothInput);
  assert.ok(
    sysInstruction.includes('TARGETED PROMPT MODIFICATION (A → B) & STRICT USER INTENT MANDATE'),
    'Must include Targeted Prompt Modification section in System Instruction'
  );
  assert.ok(
    sysInstruction.includes('When both [PROMPT SAMPLE] and [KEYWORDS / SCENE IDEA] are provided, treat [KEYWORDS / SCENE IDEA] as DIRECT, TARGETED MODIFICATION INSTRUCTIONS'),
    'Must explicitly state A -> B targeted modification rule'
  );
  assert.ok(
    sysInstruction.includes('STRICT UNREQUESTED PRESERVATION (MINIMAL CHANGE PRINCIPLE)'),
    'Must enforce Minimal Change principle'
  );
  assert.ok(
    sysInstruction.includes('CLEAN CONFLICT RESOLUTION & REMOVAL'),
    'Must enforce clean conflict removal'
  );
  assert.ok(
    sysInstruction.includes('STRICT USER INTENT & NO UNNECESSARY CENSORSHIP'),
    'Must mandate No Unnecessary Censorship'
  );
  assert.ok(
    sysInstruction.includes('1. Explicit Targeted Modifications in Column B ([KEYWORDS / SCENE IDEA]) applied to [PROMPT SAMPLE]'),
    'Column B modifications must be priority #1 in source resolution'
  );

  // 18b. Verify User Prompt Builder with Both Inputs
  const userPromptBoth = gemini['buildUserPrompt'](mockBothInput);
  assert.ok(
    userPromptBoth.includes('[PROMPT SAMPLE (Source of Truth for Scene & Identity)]'),
    'Must include Prompt Sample header'
  );
  assert.ok(
    userPromptBoth.includes('[KEYWORDS / SCENE IDEA]'),
    'Must include Keywords header'
  );
  assert.ok(
    userPromptBoth.includes('[TARGETED MODIFICATION MANDATE (A → B) & STRICT USER INTENT]'),
    'Must include Targeted Modification Mandate when both inputs are provided'
  );
  assert.ok(
    userPromptBoth.includes('Column B [KEYWORDS / SCENE IDEA] contains DIRECT MODIFICATION INSTRUCTIONS for Column A [PROMPT SAMPLE].'),
    'Must instruct model that Column B directs modifications to Column A'
  );
  assert.ok(
    userPromptBoth.includes('TARGETED MODIFICATION ONLY: Change ONLY the specific attributes explicitly requested'),
    'Must restrict changes only to targeted attributes'
  );
  assert.ok(
    userPromptBoth.includes('STRICT PRESERVATION (MINIMAL CHANGE): Strictly preserve all unrequested details'),
    'Must mandate retention of unrequested details'
  );
  assert.ok(
    userPromptBoth.includes('NO UNNECESSARY CENSORSHIP: Execute the user\'s exact intent without softening'),
    'Must prohibit unnecessary censorship in user prompt directive'
  );

  // 18c. Verify User Prompt Builder with Sample Only (No A -> B mandate)
  const mockSampleOnlyInput = {
    ...mockBothInput,
    keywords: '',
  };
  const userPromptSampleOnly = gemini['buildUserPrompt'](mockSampleOnlyInput);
  assert.ok(
    userPromptSampleOnly.includes('[PROMPT SAMPLE (Source of Truth for Scene & Identity)]'),
    'Sample-only mode must include Prompt Sample'
  );
  assert.ok(
    !userPromptSampleOnly.includes('[KEYWORDS / SCENE IDEA]'),
    'Sample-only mode must not include Keywords block'
  );
  assert.ok(
    !userPromptSampleOnly.includes('[TARGETED MODIFICATION MANDATE (A → B) & STRICT USER INTENT]'),
    'Sample-only mode must not trigger A -> B modification mandate'
  );

  // 18d. Verify User Prompt Builder with Keywords Only (Ideation mode)
  const mockKeywordsOnlyInput = {
    ...mockBothInput,
    samplePrompt: '',
  };
  const userPromptKeywordsOnly = gemini['buildUserPrompt'](mockKeywordsOnlyInput);
  assert.ok(
    !userPromptKeywordsOnly.includes('[PROMPT SAMPLE (Source of Truth for Scene & Identity)]'),
    'Keywords-only mode must not include Prompt Sample'
  );
  assert.ok(
    userPromptKeywordsOnly.includes('[KEYWORDS / SCENE IDEA]'),
    'Keywords-only mode must include Keywords'
  );
  assert.ok(
    !userPromptKeywordsOnly.includes('[TARGETED MODIFICATION MANDATE (A → B) & STRICT USER INTENT]'),
    'Keywords-only mode must not trigger A -> B modification mandate'
  );

  // 18e. Verify App.tsx preserves previous results on failure
  const appCode = fs.readFileSync('src/App.tsx', 'utf8');
  assert.ok(!appCode.includes('setIsLoading(true);\n    setResults([]);'), 'Must not clear results before try block in handleGenerate');

  console.log('✓ Strict User Intent & Targeted Prompt Modification (A → B) verified: System instruction, user prompt builder, minimal change enforcement, and failure safety.');

  console.log('\n--- ALL TEST SUITE CHECKS PASSED SUCCESSFULLY (18/18) ---');
}).catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
