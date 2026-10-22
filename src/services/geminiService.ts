import type { GenerationInput, PromptResult, OutfitFidelityCheck, PromptRepairSummary } from '../types/index.ts';
import {
  getStyleVisualDirective,
  getMatureSubstyleByName,
  isMatureSensualSubstyle,
  isMatureCoupleStyle,
  getIntensityDirective,
  SINGLE_ADULT_FEMALE_DIRECTIVE,
} from '../data/storyStyles.ts';
import {
  getFramingOptionByIdOrName,
  resolveAutoFraming,
} from '../data/framingOptions.ts';
import {
  NYATA_STYLE_CONFIG,
  NYATA_PROMPT_DIRECTIVE,
  getActivePhotographicShorthands,
  getActivePhotographicDirectives,
} from '../data/photographicStyles.ts';
import {
  CHARACTER_LOCKS_CONFIG,
  getActiveLockTags,
  integrateActiveShorthandsIntoPrompt,
} from '../data/characterLocks.ts';

export interface ModelValidationResult {
  valid: boolean;
  message: string;
  availableModels?: string[];
}

export class GeminiService {
  private static instance: GeminiService;

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  /**
   * Tests API key and Model ID against the official Gemini endpoint.
   * If the model does not exist or fails, returns descriptive error message.
   */
  public async testConnection(apiKey: string, modelId: string): Promise<ModelValidationResult> {
    const cleanedKey = apiKey.trim();
    const cleanedModel = modelId.trim();

    if (!cleanedKey) {
      return { valid: false, message: 'API Key cannot be empty.' };
    }
    if (!cleanedModel) {
      return { valid: false, message: 'Model ID cannot be empty.' };
    }

    // Sanitize model id (strip models/ prefix if entered)
    const normalizedModel = cleanedModel.startsWith('models/') 
      ? cleanedModel.replace('models/', '') 
      : cleanedModel;

    try {
      // 1. First test checking the specific model metadata
      const modelUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(normalizedModel)}?key=${encodeURIComponent(cleanedKey)}`;
      const response = await fetch(modelUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        if (response.status === 400 || response.status === 403) {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData?.error?.message || 'Invalid API Key or permission denied.';
          return { valid: false, message: `Authentication Error: ${errMsg}` };
        }

        if (response.status === 404) {
          // Model not found - fetch list of models to assist the user
          const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(cleanedKey)}`;
          const listRes = await fetch(listUrl).catch(() => null);
          let recommended: string[] = [];
          if (listRes && listRes.ok) {
            const listData = await listRes.json();
            if (Array.isArray(listData.models)) {
              recommended = listData.models
                .filter((m: { supportedGenerationMethods?: string[] }) => 
                  m.supportedGenerationMethods?.includes('generateContent')
                )
                .map((m: { name: string }) => m.name.replace('models/', ''))
                .slice(0, 8);
            }
          }

          return {
            valid: false,
            message: `Model '${cleanedModel}' was not found in the Gemini API catalog (404 Not Found). Official recommended models include: ${
              recommended.length > 0 ? recommended.slice(0, 4).join(', ') : 'gemini-2.5-flash, gemini-2.0-flash, gemini-1.5-flash'
            }. Please choose a valid model.`,
            availableModels: recommended,
          };
        }

        if (response.status === 429) {
          return { valid: false, message: 'API quota exceeded or rate limit reached (429).' };
        }

        return { valid: false, message: `Gemini API returned status ${response.status}: ${response.statusText}` };
      }

      const modelInfo = await response.json();
      if (modelInfo && !modelInfo.supportedGenerationMethods?.includes('generateContent')) {
        return {
          valid: false,
          message: `Model '${cleanedModel}' exists but does not support 'generateContent'. Please choose a generative model.`,
        };
      }

      return {
        valid: true,
        message: `Connection successful! Connected to '${modelInfo.displayName || normalizedModel}'.`,
      };
    } catch (err: unknown) {
      const errStr = err instanceof Error ? err.message : 'Unknown network failure';
      return {
        valid: false,
        message: `Network failure connecting to Gemini API: ${errStr}. Check your internet connection or proxy.`,
      };
    }
  }

  /**
   * Generates prompt variations using Gemini API with strict prompt engineering.
   */
  public async generatePrompts(
    apiKey: string,
    modelId: string,
    input: GenerationInput
  ): Promise<PromptResult[]> {
    const cleanedKey = apiKey.trim();
    const cleanedModel = modelId.trim();

    if (!cleanedKey) {
      throw new Error('API Key is required. Please configure your key in "API & Pengaturan".');
    }
    if (!cleanedModel) {
      throw new Error('Model ID is required.');
    }

    const normalizedModel = cleanedModel.startsWith('models/') 
      ? cleanedModel.replace('models/', '') 
      : cleanedModel;

    // Build the system prompt
    const systemInstructionText = this.buildSystemInstruction(input);
    const userPromptContent = this.buildUserPrompt(input);

    // Build user parts (text + optional multi-image visual references & dedicated outfits)
    const userParts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [
      { text: userPromptContent },
    ];

    if (input.referenceImages && input.referenceImages.length > 0) {
      input.referenceImages.forEach((img, idx) => {
        try {
          const [header, base64Data] = img.dataUrl.split(',');
          if (base64Data) {
            const mimeMatch = header.match(/:(.*?);/);
            const mimeType = mimeMatch ? mimeMatch[1] : img.file?.type || 'image/jpeg';
            userParts.push({ text: `[SUBJECT REFERENCE IMAGE ${idx + 1}: ${img.name}]` });
            userParts.push({
              inlineData: {
                mimeType,
                data: base64Data,
              },
            });
          }
        } catch {
          // ignore corrupted data gracefully
        }

        // Include paired outfit reference image if uploaded for this subject
        const outfit = input.outfitImages?.[img.id];
        if (outfit) {
          try {
            const [oHeader, oBase64Data] = outfit.dataUrl.split(',');
            if (oBase64Data) {
              const oMimeMatch = oHeader.match(/:(.*?);/);
              const oMimeType = oMimeMatch ? oMimeMatch[1] : outfit.file?.type || 'image/jpeg';
              userParts.push({ text: `[OUTFIT REFERENCE IMAGE FOR SUBJECT ${idx + 1}: ${outfit.name}]` });
              userParts.push({
                inlineData: {
                  mimeType: oMimeType,
                  data: oBase64Data,
                },
              });
            }
          } catch {
            // ignore
          }
        }
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(normalizedModel)}:generateContent?key=${encodeURIComponent(cleanedKey)}`;

    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemInstructionText }],
      },
      contents: [
        {
          role: 'user',
          parts: userParts,
        },
      ],
      generationConfig: {
        temperature: 0.75,
        topP: 0.95,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            prompts: {
              type: 'ARRAY',
              description: 'Array of complete, standalone, copy-ready English image generation prompts.',
              items: {
                type: 'STRING',
              },
            },
          },
          required: ['prompts'],
        },
      },
    };

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network request failed';
      throw new Error(`Network failure during generation: ${msg}`);
    }

    if (!response.ok) {
      if (response.status === 400 || response.status === 403) {
        const errorJson = await response.json().catch(() => null);
        const detail = errorJson?.error?.message || '';
        if (
          detail.toLowerCase().includes('image') ||
          detail.toLowerCase().includes('multimodal') ||
          detail.toLowerCase().includes('inline_data') ||
          detail.toLowerCase().includes('unsupported input')
        ) {
          throw new Error(
            `Model '${cleanedModel}' tidak mendukung input multi-gambar (${detail}). Silakan gunakan model multimodal resmi seperti 'gemini-2.5-flash' atau 'gemini-2.0-flash'.`
          );
        }
        if (response.status === 403) {
          throw new Error('Invalid Gemini API Key or authentication failure (403). Check your key in Settings.');
        }
        throw new Error(`Gemini API Error (400): ${detail || response.statusText}`);
      }
      if (response.status === 404) {
        throw new Error(`Model '${cleanedModel}' was not found on Gemini API. Please select a valid model in Settings.`);
      }
      if (response.status === 429) {
        throw new Error('Gemini API rate limit or quota exceeded (429). Please wait a moment or check your Google AI quota.');
      }
      const errorJson = await response.json().catch(() => null);
      const detail = errorJson?.error?.message || response.statusText;
      throw new Error(`Gemini API error (${response.status}): ${detail}`);
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0];

    if (!candidate || !candidate.content?.parts?.[0]?.text) {
      if (candidate?.finishReason === 'SAFETY') {
        throw new Error('Generation was blocked by Gemini safety filters. Please refine scene themes to ensure consensual adult content.');
      }
      throw new Error('Received an empty response from Gemini API.');
    }

    const rawText = candidate.content.parts[0].text;
    const extractedPrompts = this.parseResponse(rawText, input.variationCount);

    if (extractedPrompts.length === 0) {
      throw new Error('Could not parse valid prompt variations from the model response.');
    }

    // 1. Sanitize & enforce active outfit & layering control rules across 100% of variations
    const anyTransparentMode =
      input.outfitLayeringConfig?.mode === 'Transparent Fabric Preservation' ||
      input.outfitLayeringConfig?.mode === 'No Undergarment Layer' ||
      input.outfitLayeringConfig?.mode === 'Editorial Minimal Layering' ||
      (input.referenceImages && input.referenceImages.some((subj) => {
        const mode = input.outfitLayeringConfigs?.[subj.id]?.mode;
        return mode === 'Transparent Fabric Preservation' || mode === 'No Undergarment Layer' || mode === 'Editorial Minimal Layering';
      }));

    const effectiveLayeringMode = anyTransparentMode
      ? 'Transparent Fabric Preservation'
      : (input.outfitLayeringConfig?.mode || 'Automatic');

    const outfitSanitizedPrompts = extractedPrompts.map((p) =>
      GeminiService.sanitizeOutfitLayering(
        p,
        effectiveLayeringMode,
        input.outfitLayeringConfig?.customInstructions
      )
    );

    // 2. Deterministically apply active aspect ratio to 100% of prompt variations
    const finalizedPrompts = outfitSanitizedPrompts.map((p) =>
      GeminiService.applyAspectRatio(p, input.selectedAspectRatio)
    );

    // 3. Deterministically integrate expanded active shorthand instructions into 100% of prompt variations
    const isNyata = input.photographicStyle.selected.includes('nyata') || 
                    input.photographicStyle.selected.includes('Nyata');
    const withShorthandsPrompts = finalizedPrompts.map((p) =>
      integrateActiveShorthandsIntoPrompt(p, input.characterLocks, {
        isNyata,
        photoStyles: input.photographicStyle.selected,
        storyStyle: input.storyStyle?.primary || '',
        hasFaceReference: Boolean(input.referenceImages && input.referenceImages.length > 0),
      })
    );

    const activeLockTags = [
      ...getActiveLockTags(input.characterLocks),
      ...getActivePhotographicShorthands(input.photographicStyle.selected),
    ];

    return withShorthandsPrompts.map((p, idx) => ({
      id: `prompt-${Date.now()}-${idx}`,
      index: idx + 1,
      prompt: p,
      activeLocks: activeLockTags,
      fidelityCheck: GeminiService.validateOutfitFidelity(p, input),
    }));
  }

  /**
   * Globally repairs all prompt variations flagged with outfit fidelity issues,
   * preserving character identity, pose, atmosphere, and non-outfit instructions,
   * while strictly restoring outfit reference fidelity and purging modesty violations.
   */
  /**
   * Repairs a single flagged prompt variation based on detected outfit issues
   * and uploaded outfit reference images.
   */
  public async repairSinglePrompt(
    apiKey: string,
    modelId: string,
    item: PromptResult,
    input: GenerationInput
  ): Promise<PromptResult> {
    const originalWarnings = item.fidelityCheck?.warnings || [];
    if (originalWarnings.length === 0) {
      return item;
    }

    const anyTransparentMode =
      input.outfitLayeringConfig?.mode === 'Transparent Fabric Preservation' ||
      input.outfitLayeringConfig?.mode === 'No Undergarment Layer' ||
      input.outfitLayeringConfig?.mode === 'Editorial Minimal Layering' ||
      (input.referenceImages && input.referenceImages.some((subj) => {
        const mode = input.outfitLayeringConfigs?.[subj.id]?.mode;
        return mode === 'Transparent Fabric Preservation' || mode === 'No Undergarment Layer' || mode === 'Editorial Minimal Layering';
      }));

    const effectiveLayeringMode = anyTransparentMode
      ? 'Transparent Fabric Preservation'
      : (input.outfitLayeringConfig?.mode || 'Preserve');

    let repairedPromptText = item.prompt;

    // 1. Attempt AI-assisted repair if API credentials exist
    if (apiKey && apiKey.trim()) {
      try {
        const cleanedKey = apiKey.trim();
        const targetModel = modelId && modelId.trim() ? modelId.trim() : 'gemini-2.5-flash';
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${cleanedKey}`;

        // Find relevant outfit references
        const outfitNames: string[] = [];
        if (input.referenceImages && input.outfitImages) {
          for (const subj of input.referenceImages) {
            const o = input.outfitImages[subj.id];
            if (o) outfitNames.push(`Outfit for ${subj.name}: ${o.name}`);
          }
        }

        const repairInstruction = `You are a precision prompt repair specialist for an image generator.
Your objective is to repair the following English prompt so that it strictly resolves the detected outfit fidelity issues while keeping all other prompt elements 100% intact.

DETECTED OUTFIT ISSUES:
${originalWarnings.map(w => `- ${w}`).join('\n')}
${outfitNames.length > 0 ? `\nMAPPED OUTFIT REFERENCES:\n${outfitNames.join('\n')}` : ''}

CURRENT PROMPT:
"${item.prompt}"

RULES:
1. PRESERVE 100% of subject facial features, hair, age, physical build, pose, camera perspective, lighting, mood, composition, and trailing aspect ratio flags (--ar).
2. RESOLVE ALL OUTFIT ISSUES:
   - If modesty slips, camisoles, or opaque under-layers were added, PURGE them completely. Keep sheer/mesh fabrics authentically unlined and transparent.
   - Accurately describe the reference outfit's structural details: exact silhouette, necklines, shoulder/chain straps, tailored seam lines, diagonal panels, and fabric textures.
   - Separate Garment Design Lock from Natural Body Fit: describe natural fabric drape and tension over the subject's anatomy without altering the garment design.
3. Return ONLY the repaired English prompt text. No markdown formatting, no quotes, no conversational explanation.`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: repairInstruction }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 1000 },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim().length > 20) {
            repairedPromptText = this.cleanPromptText(candidateText);
          }
        }
      } catch {
        // fallback to deterministic repair below
      }
    }

    // 2. Fallback / deterministic sanitization & structural repair
    repairedPromptText = GeminiService.sanitizeOutfitLayering(
      repairedPromptText,
      effectiveLayeringMode,
      input.outfitLayeringConfig?.customInstructions
    );

    // If missing transparent fabric terms in transparent mode, enhance with structural terms
    if (anyTransparentMode && !/\b(?:sheer|mesh|transparent|translucent|tulle|lace)\b/i.test(repairedPromptText)) {
      repairedPromptText = `${repairedPromptText.replace(/\s*--ar\s+.*$/i, '')}, sheer transparent mesh fabric with unlined delicate tailored seams and natural body drape ${input.selectedAspectRatio && input.selectedAspectRatio !== 'auto' ? `--ar ${input.selectedAspectRatio}` : ''}`.trim();
    }

    // Re-apply aspect ratio and shorthand constraints
    repairedPromptText = GeminiService.applyAspectRatio(repairedPromptText, input.selectedAspectRatio);
    const isNyataRepair = input.photographicStyle.selected.includes('nyata') || 
                          input.photographicStyle.selected.includes('Nyata');
    repairedPromptText = integrateActiveShorthandsIntoPrompt(repairedPromptText, input.characterLocks, {
      isNyata: isNyataRepair,
      photoStyles: input.photographicStyle.selected,
      storyStyle: input.storyStyle?.primary || '',
      hasFaceReference: Boolean(input.referenceImages && input.referenceImages.length > 0),
    });

    // 3. Re-validate repaired prompt
    const newFidelityCheck = GeminiService.validateOutfitFidelity(repairedPromptText, input);

    return {
      ...item,
      prompt: repairedPromptText,
      activeLocks: item.activeLocks || [
        ...getActiveLockTags(input.characterLocks),
        ...getActivePhotographicShorthands(input.photographicStyle.selected),
      ],
      fidelityCheck: newFidelityCheck,
    };
  }

  /**
   * Scans and repairs all prompt variations containing outfit fidelity warnings
   * while strictly restoring outfit reference fidelity and purging modesty violations.
   */
  public async repairFlaggedPrompts(
    apiKey: string,
    modelId: string,
    currentResults: PromptResult[],
    input: GenerationInput
  ): Promise<{
    repairedResults: PromptResult[];
    summary: PromptRepairSummary;
  }> {
    const examined = currentResults.length;
    let repaired = 0;
    let unchanged = 0;
    let unfixable = 0;

    const repairedResults: PromptResult[] = [];

    for (const item of currentResults) {
      // 1. If not flagged with warnings, keep untouched
      if (!item.fidelityCheck || item.fidelityCheck.warnings.length === 0) {
        unchanged++;
        repairedResults.push(item);
        continue;
      }

      const originalWarningsCount = item.fidelityCheck.warnings.length;
      const repairedItem = await this.repairSinglePrompt(apiKey, modelId, item, input);
      const currentWarningsCount = repairedItem.fidelityCheck?.warnings.length ?? 0;
      const isPassed = repairedItem.fidelityCheck?.status === 'passed';

      if (
        currentWarningsCount < originalWarningsCount ||
        isPassed ||
        repairedItem.prompt !== item.prompt
      ) {
        repaired++;
      } else {
        unfixable++;
      }
      repairedResults.push(repairedItem);
    }

    return {
      repairedResults,
      summary: {
        examined,
        repaired,
        unchanged,
        unfixable,
      },
    };
  }

  /**
   * Analyzes an uploaded image and extracts a comprehensive, high-fidelity descriptive prompt
   * capturing visible subjects, outfits, poses, expressions, composition, lighting, and environment.
   */
  public async analyzeImageToPrompt(
    apiKey: string,
    modelId: string,
    dataUrl: string,
    mimeType?: string
  ): Promise<string> {
    const cleanedKey = apiKey.trim();
    const cleanedModel = modelId.trim();

    if (!cleanedKey) {
      throw new Error('API Key Gemini belum dikonfigurasi. Silakan masukkan API Key di menu Pengaturan.');
    }
    if (!cleanedModel) {
      throw new Error('Model ID belum ditentukan. Silakan pilih model di menu Pengaturan.');
    }

    const [header, base64Data] = dataUrl.split(',');
    if (!base64Data) {
      throw new Error('Data gambar tidak valid atau korup.');
    }

    let detectedMime = mimeType;
    if (!detectedMime) {
      const match = header.match(/:(.*?);/);
      detectedMime = match ? match[1] : 'image/jpeg';
    }

    const systemInstruction = `You are an expert photographic visual analyst for Mature Prompt Studio.
Your task is to analyze the provided image with high precision and transform its visible visual elements into a single, comprehensive, copy-ready English prompt for generative image models.

STRICT VISUAL ANALYSIS DIRECTIVES:
1. Subject(s): Accurately identify and describe the visible human subject(s) (count, gender, discernible adult age range, facial features, hair color and style, body shape).
2. Outfits & Attire: Meticulously describe clothing type, fabrics (e.g. sheer silk, lace, velvet, satin, knit), cut, straps, seams, colors, layering, and any visible transparency.
3. Pose & Anatomy: Exact bodily posture, spine curvature, limb placement, head tilt, hands, and shoulder alignment.
4. Facial Expression & Gaze: Authentic expression, eye contact direction (e.g. looking directly into the lens, looking over the shoulder, eyes closed), mouth/lip position.
5. Lighting & Atmosphere: Key light direction, fill light, shadows, specular highlights, rim lights, ambient mood (e.g. golden hour, dim bedside lamp, moody chiaroscuro).
6. Composition & Camera: Framing (e.g. close-up portrait, medium shot, three-quarter, full body), camera angle, lens perspective (e.g. 85mm portrait, 35mm candid), depth of field, background bokeh.
7. Environment & Props: Setting, room interior, furniture, textiles, background elements, background color palette.
8. Realism & Quality: Micro-textures, skin texture, fabric weave, photographic authenticity, unedited camera aesthetic.

RULES:
- Base your analysis ONLY on what is directly observable in the image. Do not invent non-existent props or characters.
- Mark any uncertain details as unknown rather than assuming.
- Output ONLY the final descriptive English prompt text. Do not wrap in markdown code blocks, do not include preamble, conversational greetings, or numbered bullet points. Output a cohesive, highly descriptive prompt paragraph suitable for use as a Reference Prompt.`;

    const userPromptText = `Analyze this image in detail according to the visual analysis directives. Produce a single comprehensive English prompt describing everything visibly present in the image.`;

    const normalizedModel = cleanedModel.startsWith('models/') ? cleanedModel.slice(7) : cleanedModel;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(normalizedModel)}:generateContent?key=${encodeURIComponent(cleanedKey)}`;

    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          role: 'user',
          parts: [
            { text: userPromptText },
            {
              inlineData: {
                mimeType: detectedMime,
                data: base64Data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errDetails = '';
      try {
        const errorData = await response.json();
        errDetails = errorData.error?.message || response.statusText;
      } catch {
        errDetails = response.statusText;
      }
      throw new Error(`Analisis gambar gagal (${response.status}): ${errDetails}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const textPart = candidate?.content?.parts?.[0]?.text;

    if (!textPart || !textPart.trim()) {
      throw new Error('Hasil analisis gambar kosong dari model AI.');
    }

    let cleaned = textPart.trim();
    if (cleaned.startsWith('```') && cleaned.endsWith('```')) {
      cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
    }
    if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
      cleaned = cleaned.slice(1, -1).trim();
    }

    return cleaned;
  }

  /**
   * Validates generated prompt text against outfit reference design rules,
   * detecting garment category drift, unwanted modesty additions, and missing
   * transparent mesh/silhouette descriptors.
   */
  public static validateOutfitFidelity(
    prompt: string,
    input: GenerationInput
  ): OutfitFidelityCheck {
    const hasOutfitReference = Boolean(
      input.outfitImages && Object.keys(input.outfitImages).length > 0
    );

    const isTransparentMode =
      input.outfitLayeringConfig?.mode === 'Transparent Fabric Preservation' ||
      input.outfitLayeringConfig?.mode === 'No Undergarment Layer' ||
      input.outfitLayeringConfig?.mode === 'Editorial Minimal Layering' ||
      Boolean(
        input.referenceImages &&
          input.referenceImages.some(
            (s) => {
              const m = input.outfitLayeringConfigs?.[s.id]?.mode;
              return m === 'Transparent Fabric Preservation' || m === 'No Undergarment Layer' || m === 'Editorial Minimal Layering';
            }
          )
      );

    if (!hasOutfitReference && !isTransparentMode) {
      return {
        hasOutfitReference: false,
        isTransparentMode: false,
        warnings: [],
        passedChecks: [],
        status: 'info',
      };
    }

    const warnings: string[] = [];
    const passedChecks: string[] = [];

    // 1. Modesty Layering Check (Crucial for Transparent Fabric Preservation)
    const modestyViolations = [
      /\b(?:opaque|modesty|nude|matching|dark|white|black|inner|flesh-toned|skin-toned)\s+(?:slip|camisole|undershirt|lining|layer|underlayer|undergarment|undergarments)\s*(?:underneath|beneath|inside|under)?/i,
      /\b(?:slip|camisole|undershirt|undergarment)\s+(?:underneath|beneath|inside|under)\b/i,
      /\b(?:lined with opaque fabric|lined with an opaque lining|lined with modesty fabric)\b/i,
    ];

    const hasModestyViolation = modestyViolations.some((regex) => regex.test(prompt));
    if (hasModestyViolation) {
      warnings.push('Terdeteksi indikasi penambahan lapisan modesty/slip dalam di balik pakaian transparan.');
    } else if (isTransparentMode) {
      passedChecks.push('outfitCheckNoModestyLinings');
    }

    // 2. Material Texture, Mesh & Transparency Check
    const hasTransparentFabricTerms =
      /\b(?:sheer|mesh|transparent|translucent|tulle|organza|chiffon|lace|see-through|netting|transparency)\b/i.test(
        prompt
      );

    if (isTransparentMode) {
      if (hasTransparentFabricTerms) {
        passedChecks.push('outfitCheckMaterialMesh');
        passedChecks.push('outfitCheckPanelsTransparency');
      } else {
        warnings.push('Deskripsi material transparan/mesh tidak terdeteksi pada prompt saat mode No Undergarment Layer / Transparent Fabric aktif.');
      }
    }

    // 3. Silhouette, Cut & Garment Structure Check
    const hasSilhouetteTerms =
      /\b(?:dress|gown|bodice|corset|skirt|robe|blouse|cut|silhouette|hemline|hem|slit|neckline|straps?|halter|garment|attire|apparel|bodysuit|romper|jumpsuit|two-piece|outfit)\b/i.test(
        prompt
      );

    if (hasSilhouetteTerms) {
      passedChecks.push('outfitCheckSilhouette');
    } else if (hasOutfitReference) {
      warnings.push('Deskripsi siluet atau potongan busana dari referensi outfit sangat minim.');
    }

    // 4. Straps, Neckline, Edges & Hardware Check
    const hasStrapsOrNecklineTerms =
      /\b(?:straps?|halter|strapless|spaghetti|neckline|collar|sleeves?|hemline|edge|border|plunge|sweetheart|seams?|boning|piping|chain\s+straps?|hardware|buckles?|chains?|metallic\s+rings?)\b/i.test(
        prompt
      );

    if (hasStrapsOrNecklineTerms) {
      passedChecks.push('outfitCheckStrapsNeckline');
      passedChecks.push('outfitCheckSeamsDetails');
    }

    // 5. Asymmetric Details & Diagonal Panels Check
    const hasAsymmetricOrDiagonalTerms =
      /\b(?:asymmetric|asymmetrical|diagonal|slant|one-shoulder|diagonal\s+panel|partition|geometric|angle|angular|off-center|asymmetry|criss-cross|cross\s+straps?)\b/i.test(
        prompt
      );

    if (hasAsymmetricOrDiagonalTerms) {
      passedChecks.push('outfitCheckAsymmetryDetails');
    }

    // 6. Natural Body Fit & Drape Check (Separation of Design Lock from Anatomical Fit)
    const hasBodyFitDrapeTerms =
      /\b(?:drape|draping|conforms?|contouring|hugs?|curves?|folds?|tension|creasing|tailored\s+fit|fitted|natural\s+fall|clings?|falls\s+naturally)\b/i.test(
        prompt
      );

    if (hasBodyFitDrapeTerms) {
      passedChecks.push('outfitCheckBodyFitDrape');
    }

    // 7. Category Drift Check (e.g. Turning sheer evening wear into heavy winter outerwear)
    if (isTransparentMode) {
      const heavyDrift = /\b(?:winter coat|parka|heavy wool sweater|padded jacket|raincoat|oversized hoodie)\b/i.test(
        prompt
      );
      if (heavyDrift) {
        warnings.push('Terdeteksi kemungkinan kategori busana bergeser drastis dari gaun/pakaian mesh menjadi pakaian luar tebal.');
      }
    }

    return {
      hasOutfitReference,
      isTransparentMode,
      warnings,
      passedChecks,
      status: warnings.length > 0 ? 'warning' : 'passed',
    };
  }

  /**
   * Sanitizes prompt text to strictly enforce outfit layering rules.
   * In 'Transparent Fabric Preservation' mode, purges unrequested modesty slips,
   * camisoles, opaque linings, and imaginary undergarments that contradict
   * the transparent fabric reference.
   */
  public static sanitizeOutfitLayering(
    prompt: string,
    mode?: string,
    _customInstructions?: string
  ): string {
    let cleaned = prompt.trim();

    if (
      mode === 'Transparent Fabric Preservation' ||
      mode === 'No Undergarment Layer' ||
      mode === 'Editorial Minimal Layering'
    ) {
      const unwantedModestyPatterns = [
        /,\s*(?:with|featuring|wearing|layered with|layered over|worn over|worn with|paired with)\s+(?:an?\s+)?(?:(?:opaque|modesty|nude|matching|dark|white|black|inner|flesh-toned|skin-toned)\s+)*(?:slip|camisole|undershirt|lining|layer|underlayer|undergarment|undergarments|bra and panties|bra)\s*(?:underneath|beneath|inside|under)?/gi,
        /\b(?:with|featuring|wearing|layered with|layered over|worn over|worn with|paired with)\s+(?:an?\s+)?(?:(?:opaque|modesty|nude|matching|dark|white|black|inner|flesh-toned|skin-toned)\s+)*(?:slip|camisole|undershirt|lining|layer|underlayer|undergarment|undergarments|bra and panties|bra)\s*(?:underneath|beneath|inside|under)?/gi,
        /,\s*(?:an?\s+)?(?:(?:opaque|modesty|nude|matching|dark|white|black|inner|flesh-toned|skin-toned)\s+)+(?:slip|camisole|undershirt|lining|layer|underlayer|undergarment|undergarments)\s*(?:underneath|beneath|inside|under)?/gi,
        /,\s*(?:an?\s+)?(?:slip|camisole|undershirt|underlayer|undergarments?)\s+(?:underneath|beneath|inside|under)/gi,
        /,\s*(?:lined with|with)\s+(?:an?\s+)?(?:opaque|modesty|nude|inner)?\s*(?:fabric lining|lining|slip|camisole|layer)\s*(?:underneath|beneath)?/gi,
        /\b(?:lined with opaque fabric|lined with an opaque lining|lined with modesty fabric|lined with an inner lining|lined with a nude slip)\b/gi,
        /\b(?:opaque slip underneath|modesty slip underneath|nude slip underneath|black slip underneath|inner slip underneath|slip underneath|camisole underneath)\b/gi,
        /\b(?:modesty lining|opaque lining underneath|opaque inner lining|modesty underlayer)\b/gi,
      ];

      for (const pattern of unwantedModestyPatterns) {
        cleaned = cleaned.replace(pattern, '');
      }

      // Clean up punctuation artifacts (e.g. double commas, dangling commas before periods, multiple spaces)
      cleaned = cleaned
        .replace(/,\s*,/g, ',')
        .replace(/,\s*\./g, '.')
        .replace(/\s{2,}/g, ' ')
        .replace(/\s+([,.])/g, '$1')
        .trim();
    }

    return cleaned;
  }

  /**
   * Sanitizes and applies the selected aspect ratio consistently to a prompt.
   * If a specific ratio is provided (e.g. '9:16', '1:1'), resolves and removes
   * conflicting or duplicate --ar flags and appends the single canonical --ar flag.
   * If 'auto' or unspecified, preserves natural prompt text without forcing fixed --ar.
   */
  public static applyAspectRatio(prompt: string, ratio?: string): string {
    const trimmed = prompt.trim();
    if (!ratio || ratio === 'auto') {
      return trimmed;
    }

    // Remove any existing aspect ratio parameters (e.g., --ar 16:9, --ar:9:16, --aspect-ratio 1:1)
    const sanitized = trimmed
      .replace(/(?:--ar|--aspect-ratio)[:\s]+\d+(?::\d+|\.\d+)?/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    return `${sanitized} --ar ${ratio}`;
  }

  private buildSystemInstruction(input: GenerationInput): string {
    const isUltra = input.photographicStyle.selected.includes('ultra-realistic') || 
                    input.photographicStyle.selected.includes('Ultra Realistic');
    const isNyata = input.photographicStyle.selected.includes('nyata') || 
                    input.photographicStyle.selected.includes('Nyata');

    const hasAspectRatio = input.selectedAspectRatio && input.selectedAspectRatio !== 'auto';
    const aspectRatioMandate = hasAspectRatio
      ? `ASPECT RATIO MANDATE (STRICT):
- The user has configured the global aspect ratio: ${input.selectedAspectRatio}.
- Frame the visual composition, subject distance, and camera perspective specifically optimized for a ${input.selectedAspectRatio} canvas.
- Conclude EVERY single generated prompt variation with the parameter flag: --ar ${input.selectedAspectRatio}
- Do NOT omit this parameter and do NOT add any conflicting ratio flags.`
      : `ASPECT RATIO MANDATE:
- Aspect ratio is set to Automatic. Do NOT force a fixed --ar parameter flag. Allow the external generator to use its default framing.`;

    // Framing Mandate (Dynamic Auto or Explicit Manual)
    let framingMandate = '';
    if (input.framingConfig?.enabled) {
      const isAuto = !input.framingConfig.selected || input.framingConfig.selected === 'auto';
      if (isAuto) {
        const resolved = resolveAutoFraming(
          input.samplePrompt,
          input.keywords,
          input.storyStyle.primary
        );
        framingMandate = `FRAMING & CAMERA COMPOSITION MANDATE (AUTO MODE):
- The user has activated Framing in "Auto" mode.
- System dynamic visual recommendation: "${resolved.name}" (${resolved.groupName}).
- DIRECTIVE: Adapt camera shot distance and perspective dynamically based on scene context, subject count, and narrative mood.
- Recommended visual guideline: ${resolved.promptDirective}
- If the user's prompt or keywords explicitly indicate a camera shot (e.g. "full body", "close up", "POV"), prioritize that explicit choice.
- Never output the literal word "Auto" in prompt texts; translate it into concrete, evocative camera and framing instructions.`;
      } else {
        const selectedOpt = getFramingOptionByIdOrName(input.framingConfig.selected);
        if (selectedOpt && selectedOpt.id !== 'auto') {
          framingMandate = `FRAMING & CAMERA COMPOSITION MANDATE (MANUAL MODE: "${selectedOpt.name}"):
- The user has explicitly selected the camera framing: "${selectedOpt.name}" (${selectedOpt.groupName}).
- MANDATORY FRAMING DIRECTIVE: ${selectedOpt.promptDirective}
- Apply this exact shot composition consistently across all generated variations without drifting into contradictory shot lengths or camera angles.
- Maintain compatibility with active Character Locks, outfit blueprints, and the chosen aspect ratio.`;
        }
      }
    }

    const layeringMode = input.outfitLayeringConfig?.mode || 'Automatic';
    const customOutfitInst = input.outfitLayeringConfig?.customInstructions?.trim() || '';

    const buildLayeringModeDirective = (mode: string, customInst: string): string => {
      switch (mode) {
        case 'Preserve':
          return `UNDERGARMENT & LAYERING CONTROL MODE: "Preserve"
- FAITHFUL OUTFIT & LAYERING PRESERVATION:
  * Replicate the mapped outfit reference (or fallback to subject reference clothing) as the primary garment blueprint.
  * Faithfully preserve observable undergarments, lining, and internal/visible clothing layers directly present in the reference image.
  * DO NOT invent, fabricate, or inject extra unrequested inner layers or undergarments.
  * Maintain authentic garment lines, silhouettes, straps, neckline, and structural layers as seen in the reference without modification.`;

        case 'Match Outfit':
          return `UNDERGARMENT & LAYERING CONTROL MODE: "Match Outfit"
- MATCH OUTFIT HARMONY: Ensure all undergarments and underlying fabric layers seamlessly match the exact color tone, fabric material, and styling aesthetics of the outer outfit.
  * Replicate the mapped outfit reference's cut, neckline, straps, and silhouette.
  * Create a cohesive, well-coordinated high-end fashion appearance where base layers feel intentionally designed with the primary garment.`;

        case 'Concealed':
          return `UNDERGARMENT & LAYERING CONTROL MODE: "Concealed"
- CONCEALED BASE LAYERS: Ensure all undergarments and inner layers are completely invisible, seamless, or modesty-concealed beneath the outerwear.
  * Replicate the mapped outfit reference silhouette, cuts, straps, and styling cleanly.
  * No visible bra straps, panty lines, or peeking undergarment edges. Clean, uninterrupted contours and polished silhouette.`;

        case 'No Undergarment Layer':
          return `UNDERGARMENT & LAYERING CONTROL MODE: "No Undergarment Layer"
- NO UNDERGARMENT LAYER / UNLINED SHEER PRESERVATION (CRITICAL BLUEPRINT MANDATE):
  * SOVEREIGN BLUEPRINT AUTHORITY: The uploaded outfit reference is the exact design blueprint for the garment. Analyze and replicate all observable physical characteristics.
  * PRESERVE EXACT SILHOUETTE, CUT & LENGTH: Retain the exact overall silhouette, cut, garment category, and length observed in the reference outfit (e.g. if the reference depicts a sleeveless sheer top, dress, or gown, replicate that exact cut).
  * SHOULDER STRAPS, NECKLINES & EDGES: Faithfully replicate the exact shape and positioning of shoulder straps, plunge/v-neckline, and finished hem/border edge lines.
  * MATERIAL TEXTURE, MESH PATTERNS & TRANSLUCENCY: Faithfully preserve all sheer, mesh, tulle, translucent chiffon, and delicate transparent lace fabric characteristics unlined.
  * UNLINED SHEER / NO MODESTY LAYERING: Absolutely do NOT add modesty slips, camisoles, undershirts, bra cups, or unrequested inner undergarments beneath sheer or mesh garments. Preserve the garment authentically unlined.
  * FORBIDDEN INNER MODESTY ADDITIONS: Under NO circumstances should generated prompt texts contain phrases like "slip underneath", "camisole underneath", "modesty lining", "opaque lining", "undergarment layer", "lined with opaque fabric", or "inner slip".
  * SEAMS & STRUCTURAL DETAILS: Preserve visible tailored seamlines, borders, and fabric join lines that define the outfit structure.
  * SEPARATION OF GARMENT DESIGN FROM BODY FIT: Lock the exact garment design to the reference while allowing natural fabric drape and tension over the subject's anatomy.`;

        case 'Editorial Minimal Layering':
          return `UNDERGARMENT & LAYERING CONTROL MODE: "Editorial Minimal Layering"
- EDITORIAL MINIMAL LAYERING (HIGH FASHION):
  * Clean, minimal haute-couture layering aesthetic prioritizing avant-garde garment lines, intentional negative space, and uncompromised fabric transparency.
  * Strips away clunky undergarments, preserving bare-minimum structural layers only where structurally necessary for the outer garment's architecture.
  * Do NOT insert generic opaque modesty slips or bulky inner garments under translucent fabrics.`;

        case 'Custom':
          return `UNDERGARMENT & LAYERING CONTROL MODE: "Custom"
- CUSTOM UNDERGARMENT DIRECTIVES: ${customInst ? `"${customInst}"` : 'User has specified custom undergarment mode.'}
- Faithfully integrate the user's custom instructions for undergarments, base layers, and inner garments into the scene description.`;

        case 'Original Outfit Preservation':
        case 'Exact Outfit Match':
          return `OUTFIT & LAYERING CONTROL MODE: "${mode}"
- STRICT OUTFIT REFERENCE MATCH & PRIORITIZE 1:1 VISUAL ACCURACY:
  * SOVEREIGN BLUEPRINT AUTHORITY: Replicate the uploaded outfit reference (or fallback subject clothing) with strict precision.
  * PRESERVE VISIBLE DESIGN DETAILS: Retain exact silhouettes, necklines, shoulder straps, chain straps, diagonal panels, seam lines, hems, colors, patterns, and materials.
  * SEPARATE GARMENT DESIGN LOCK FROM BODY FIT: Keep the exact garment construction locked to the reference while allowing fabric to drape and tension naturally over the subject's anatomy.
  * NO AUTOMATIC REDESIGN: NEVER swap or alter the outfit with alternative designs across prompt variations. NEVER add unrequested bra cups or modesty linings, and NEVER symmetrize asymmetric designs.
  * If outfit reference is empty, faithfully use the clothing from the paired subject reference.
  * NEVER modify the subject's visual identity, facial features, or body shape to match the outfit.`;

        case 'Preserve Visible Layers':
          return `OUTFIT & LAYERING CONTROL MODE: "Preserve Visible Layers"
- PRESERVE VISIBLE LAYERS: Maintain the exact sequence, arrangement, shape, and interrelationships of clothing layers actually visible in the reference.
- DO NOT automatically add extra inner layers or unrequested undergarments.
- DO NOT strip away visible outer layers or jackets.
- DO NOT convert transparent or sheer fabric layers into opaque cloth, nor opaque into sheer, without explicit reference grounding.
- DO NOT fabricate hidden, cropped, or obscured clothing layers.`;

        case 'Transparent Fabric Preservation':
          return `OUTFIT & LAYERING CONTROL MODE: "Transparent Fabric Preservation"
- TRANSPARENT FABRIC PRESERVATION & OUTFIT REFERENCE FIDELITY MANDATE (STRICT):
  * DESIGN BLUEPRINT AUTHORITY: The uploaded outfit reference is the exact design blueprint for the garment, NOT a generic style mood. Analyze and replicate only observable physical characteristics.
  * PRESERVE EXACT SILHOUETTE, CUT & LENGTH:
    - Retain the exact overall silhouette, cut, garment category, and length observed in the reference outfit (e.g. if the reference depicts a floor-length mesh gown, NEVER transform it into a lace bodysuit, teddy, mini dress, or unrelated garment).
    - Do NOT automatically alter the shape, cuts, or length of the garment across variations.
  * SHOULDER STRAPS, NECKLINES & EDGES:
    - Faithfully replicate the exact shape and positioning of shoulder straps (e.g. delicate spaghetti straps, halter, wide bands, strapless, or asymmetrical styling).
    - Maintain the exact neckline shape (e.g. plunge, sweetheart, scoop, cowl) and finished hem/border edge lines.
  * MATERIAL TEXTURE, MESH PATTERNS & TRANSLUCENCY:
    - Faithfully preserve all transparent fabric characteristics (sheer, mesh, tulle, translucent chiffon, and delicate transparent lace) exactly as shown in the outfit reference.
    - Preserve observable weave texture, drape, natural wrinkles, seams, and tailored cuts.
  * ZONED TRANSPARENCY & DESIGN PANELS:
    - Accurately distinguish transparent panels, opaque panels, and diagonal partitions.
    - If the reference exhibits opaque bust cups, solid waist paneling, or diagonal velvet cuts set against transparent mesh, DO NOT homogenize everything into a uniform level of transparency. Retain the distinct distribution of sheer vs opaque sections.
    - NEVER delete or omit visible panels or design details.
    - NEVER add unrequested panels, linings, straps, or extra fabric patches.
  * SEAMS, JOINTS & VISIBLE LAYERS:
    - Preserve visible tailored seamlines, structural boning, piping, and fabric join lines that define the outfit structure.
    - If multiple layers are visible in the reference, maintain their exact hierarchy and distinct qualities.
  * NO UNREQUESTED MODESTY / NO AUTOMATIC OPAQUENESS:
    - Absolutely do NOT reduce transparency, do NOT convert sheer/translucent fabric into opaque cloth, and do NOT insert imaginary modesty coverings, slips, camisoles, or bras that do not exist in the reference outfit.
  * FORBIDDEN INNER MODESTY ADDITIONS:
    - Under NO circumstances should generated prompt texts contain phrases like "slip underneath", "camisole underneath", "modesty lining", "opaque lining", "undergarment layer", "lined with opaque fabric", "modesty layer", "inner slip", or "covered underneath with a lining".
  * DISTINGUISH ATTIRE STRUCTURE:
    - Accurately differentiate between:
      (a) The main sheer/transparent fabric,
      (b) Integrated design panels, embroidery, or structural seams that are genuine elements of the outfit,
      (c) Genuine separate outer garments (such as coats, blazers, or shawls).
      DO NOT conflate integral design panels with inner modesty layers.
  * NO INVENTED DETAILS / NO FABRICATION:
    - Never add unrequested undergarments, modesty liners, extra straps, unprompted jewelry, or extra base layers absent from the reference.
    - Portions that are out-of-frame, blurry, or cropped must not be treated as known. If structural aspects cannot be determined with certainty, do NOT fabricate unseen details as if they were present.
  * SEPARATE MATERIAL FROM SUBJECT IDENTITY:
    - Sheer fabrics and transparency must never distort or alter the subject's facial likeness, hair, body shape, or identity.
  * PERSISTENCE ACROSS ALL VARIATIONS:
    - Variation beats in mood, lighting, pose, and camera angle must NOT cause transparent fabrics to turn opaque, alter the silhouette, or gain unrequested modesty coverings.`;

        case 'Custom Outfit Instructions':
          return `OUTFIT & LAYERING CONTROL MODE: "Custom Outfit Instructions"
- CUSTOM OUTFIT DIRECTIVES: ${customInst ? `"${customInst}"` : 'User has selected custom mode without additional notes.'}
- Apply these custom attire preferences, materials, layers, colors, and cuts to the designated subject(s).
- Harmonize with active locks and reference mapping, resolving any conflicts in favor of the user's explicit custom instructions.`;

        case 'Automatic':
        case 'Automatic — Match Uploaded Outfit':
        default:
          return `OUTFIT & LAYERING CONTROL MODE: "${mode}"
- AUTOMATIC OUTFIT MATCHING DIRECTIVE:
  * Use the mapped outfit reference (or fallback to subject reference clothing) as the primary source of attire.
  * Faithfully analyze and preserve observable characteristics: garment type, colors, patterns, cuts, materials, textures, accessories, visible transparency, and visible layers.
  * DO NOT automatically inject unrequested undergarments, modesty undershirts, or extra fabric layers that are absent in the reference.
  * If details are obscured or not visible, do not fabricate unseen garments.`;
      }
    };

    const buildSubjectLayeringDirectives = (): string => {
      if (input.referenceImages && input.referenceImages.length > 0) {
        const perSubject = input.referenceImages.map((subj, idx) => {
          const config = input.outfitLayeringConfigs?.[subj.id] || input.outfitLayeringConfig || { mode: 'Automatic' };
          const mode = config.mode;
          const custom = config.customInstructions || '';
          return `--- SUBJECT ${idx + 1} ("${subj.name}") OUTFIT & LAYERING DIRECTIVE (Mode: "${mode}") ---\n${buildLayeringModeDirective(mode, custom)}`;
        });
        return `PER-SUBJECT OUTFIT & LAYERING CONTROL DIRECTIVES:\nEach subject has an independent Outfit & Layering Control configuration:\n\n${perSubject.join('\n\n')}`;
      }
      return buildLayeringModeDirective(layeringMode, customOutfitInst);
    };

    const layeringDirective = buildSubjectLayeringDirectives();

    return `You are an expert English-language AI image prompt engineer for external AI image generators (e.g. Midjourney, ChatGPT, Miora).
Your task is to transform user-provided sample prompts and/or keywords into coherent, detailed, standalone prompts.

RULES & BOUNDARIES:
- TEXT ONLY: You generate text only. You do not generate, edit, or return images.
- STANDALONE PROMPTS: Every variation must be a complete, self-contained prompt ready to be pasted directly into an external image generator.
- NO COMMENTARY: Return ONLY the prompt text. DO NOT include titles, numbers, markdown headings inside the prompt, commentary, notes, summaries, prompt scores, explanations, quotation marks, or preamble.
- LANGUAGE: The final prompts must ALWAYS be in natural, descriptive English, regardless of input language.

${aspectRatioMandate}${framingMandate ? `\n\n${framingMandate}` : ''}

ADULT & CONSENSUAL CONTENT REQUIREMENTS:
- All depicted characters in mature, romantic, or sensual themes must be clearly established adults aged 25 or older (or at least 21+).
- All intimate, romantic, or sensual interactions must be explicitly consensual adult interactions.
- Absolutely never sexualize minors or ambiguous-age characters. Do not portray coercion as consensual intimacy.
- Maintain respectful adult aesthetic standards without vulgar anatomical obscenity.

VISUAL RELATIONSHIP & SCENE TRANSFORMATION MANDATE:
- Translate selected styles into concrete, evocative visual descriptions rather than merely appending style names or tags.
- Explicitly detail relevant aspects: subject presentation, relationship dynamics, body posture, facial expressions, eye contact, physical proximity, authentic kissing contact, outfit drape/texture, camera framing, lighting, and environment.
- Primary Style sets the main visual identity; up to 2 Supporting Styles add compatible atmospheric or mood layers.
- Avoid contradictory directives. Prioritize Primary Style if conflicts occur.
- STRICT PRESERVATION OF SAMPLE PROMPT: If the user provided a sample prompt, treat it as the ground truth. Strictly preserve character identity and the specified number of subjects. Do NOT convert a solo character into a couple unless requested by the prompt or the chosen style explicitly dictates couple interaction. If couple interaction is depicted, ensure both partners are consenting mature adults with authentic anatomy, natural physical contact, and genuine chemistry.

PROFESSIONAL & STUDIO PHOTOGRAPHY MANDATE:
- When professional portrait, formal, milestone, commercial, or studio lighting styles are selected, translate them into concrete optical, lighting, and camera directives.
- CAMERA & LIGHTING SPECIFICATIONS: Specify appropriate focal lengths (e.g., 85mm portrait lens, 50mm, or macro), studio lighting setups (three-point, beauty dish, high-key wrap-around, low-key chiaroscuro, Rembrandt lighting, softbox diffusion), studio backdrops (seamless cyclorama, canvas, pure white, textured dark), and true-to-life skin tones.
- CONTEXTUAL RELEVANCE & TONALITY: Apply only parameters relevant to the selected style. Do NOT apply dramatic moody shadows to a biometric passport photo, and do NOT inject romantic themes into a corporate executive portrait or commercial product photo.
- PRESERVATION OF REFERENCE PROMPT: Strictly preserve user-specified subject identity, facial locks, subject count, and core scene. Never replace a solo portrait with a couple or group unless the style or user explicitly asks for family, group, or couple photography.

${input.referenceImages && input.referenceImages.length > 0 ? `MULTI-IMAGE SUBJECT & DEDICATED OUTFIT REFERENCES:
- The user has provided ${input.referenceImages.length} visual reference image(s) for the subject(s).
- Carefully examine all provided images to extract consistent subject traits: facial identity, bone structure, eye shape and color, hairstyle, skin tone, body build, and styling cues.
- If multiple images depict the same person from different angles, poses, or lighting conditions, synthesize them into a consistent, cohesive subject representation.
- If images depict different subjects, treat them as distinct visual references without assuming they are the same person unless instructed.
- Do NOT hallucinate or invent features that contradict the provided visual images.

OUTFIT REFERENCE MAPPING & STRICT SEPARATION OF REFERENCE SOURCES:
- STRICT SEPARATION OF REFERENCE SOURCES:
  * Subject reference images are strictly used for facial identity, hair, physical build, and anatomical characteristics.
  * Outfit reference images are strictly used for garment design, materials, cuts, patterns, straps, and panel layouts.
  * NEVER use clothing visible on the subject reference to overwrite or alter the design from an explicitly mapped outfit slot.
  * If a subject's outfit slot is empty, use the attire on the subject reference as a fallback.
- Each Subject Reference has its own dedicated outfit reference slot:
${input.referenceImages.map((subj, idx) => {
  const outfit = input.outfitImages?.[subj.id];
  if (outfit) {
    return `  * Subject ${idx + 1} ("${subj.name}"): Dedicated outfit provided ("${outfit.name}"). You MUST dress Subject ${idx + 1} in the attire, garment design, fabric material, and colors shown in Outfit Reference ${idx + 1}. Do NOT change Subject ${idx + 1}'s facial identity or body proportions.`;
  } else {
    return `  * Subject ${idx + 1} ("${subj.name}"): NO separate outfit uploaded. FALLBACK RULE: You MUST use the attire visibly worn by Subject ${idx + 1} in Subject Reference ${idx + 1}. Do NOT invent unseen clothing details.`;
  }
}).join('\n')}
- STRICT SUBJECT ISOLATION: NEVER swap outfits between subjects (e.g. never apply Subject 1's outfit to Subject 2 or vice-versa).
- Weave these authentic visual characteristics and outfit details seamlessly into the generated prompt descriptions across all variations while preserving active locks and selected styles.

STRICT OUTFIT REFERENCE MATCH & GARMENT PRESERVATION MANDATE (PRIMARY BLUEPRINT AUTHORITY):
- SOVEREIGN GARMENT DESIGN AUTHORITY:
  * The image(s) in GAMBAR REFERENSI OUTFIT serve as the sovereign primary source of truth for all clothing design.
  * Do NOT redesign, reinterpret, simplify, or substitute the outfit design based on AI preferences or convenience.
  * Faithfully preserve all observable garment features:
    1. Overall shape, tailored cuts, and silhouette.
    2. Necklines, shoulder straps, chain straps, cross straps, and exact strap placements.
    3. Seam lines, fabric edges, panels, stitching, joints, boning, piping, and construction.
    4. Diagonal panels, angled partitions, fabric layering, and the orientation & position of each element.
    5. Colors, fabric textures, mesh patterns, lace motifs, materials, and zoned transparency characteristics.
    6. Garment length, hem shapes (scalloped, raw, rolled, slit), and design proportions.
    7. Decorative hardware, chain links, buckles, metallic rings, and asymmetric structural elements.
  * Never add or remove garment details not requested by the user.

- PROHIBITIONS AGAINST AUTOMATIC REDESIGN (STRICT NO-REDESIGN RULES):
  * NEVER alter the design into a generic similar version.
  * NEVER add unrequested bra cups, opaque linings, modesty cover panels, or extra clothing absent from reference.
  * NEVER omit, smooth over, or delete visible straps, chain straps, diagonal panels, seam lines, or visible accessories.
  * NEVER alter garment length, cuts, colors, or structural design.
  * NEVER convert sheer/mesh fabrics into opaque solid cloth or vice versa.
  * NEVER balance or symmetrize an asymmetric garment design (preserve asymmetric straps, diagonal panels, or unilateral cuts faithfully).
  * NEVER simplify garment construction merely for generation ease.

- SEPARATION OF GARMENT DESIGN FROM BODY FIT:
  * Differentiate between TWO distinct visual tasks:
    (A) GARMENT DESIGN LOCK: The design, cuts, straps, panels, materials, transparency zones, and decorative details of the clothing remain strictly locked to the outfit reference.
    (B) NATURAL BODY FIT: Adapt how the garment naturally falls, conforms, drapes, and tensions across the unique anatomy, posture, and movement of the subject. Natural perspective, gravity folds, and fabric tension around curves must be described realistically WITHOUT altering the underlying garment design.

- SYSTEMATIC REFERENCE ANALYSIS PROCESS:
  * Analyze the outfit reference image across: garment type & silhouette, strap count & position, neckline shape, primary & secondary panels, diagonal panel orientation, material & transparency, seam lines & hems, and asymmetric & decorative details.
  * Translate these observed details directly into prompt text without fabricating unseen elements.` : ''}

${isUltra ? `ULTRA REALISTIC RENDERING MANDATE:
- Prioritize authentic camera-captured appearance, anatomically plausible human proportions, and detailed natural skin microtexture with visible pores, fine lines, and subtle natural imperfections.
- Describe realistic eyes, natural moisture reflection, distinct eyelashes, individual hair strands, believable fabric fibers, and clothing folds.
- Emphasize physically plausible lighting, consistent direction of illumination, natural depth of field, and optical fidelity.
- Strictly AVOID: plastic/waxy skin, oversmoothing, artificial symmetry, exaggerated body proportions, synthetic digital grain, fake pores, and CGI/3D render appearance.
- Do NOT simply append the phrase 'ultra realistic'; substantively enrich the descriptions of skin, hair, cloth, lighting, and optical depth.` : ''}

${isNyata ? `${NYATA_PROMPT_DIRECTIVE}` : ''}

${layeringDirective}

PRIORITY OF SOURCES & CONFLICT RESOLUTION:
1. Visual identity and Character Locks from Subject Reference (highest priority, inviolable for facial features, hair, and body proportions).
2. Garment Design from Mapped Outfit Reference (sovereign blueprint authority for clothing design, cuts, straps, panels, materials, and transparency; strictly prevents subject's visible clothing from bleeding into or overwriting the dedicated outfit design).
3. Natural Body Fit & Drape (drapes the locked garment design realistically over the subject's anatomy with authentic fabric tension, folds, and gravity, without altering the underlying design).
4. Selected Outfit & Layering / Undergarment Control rules (applied per-subject based on individual configurations; preserves unlined sheer fabrics and prevents unwanted modesty additions).
5. Selected Story Style & Photographic Style (modulates atmosphere, lighting, camera framing, and narrative interaction WITHOUT modifying, overwriting, or deleting core outfit structural details).
6. User's compatible textual instructions (if custom instructions provided).
7. Creative variations in scene framing, pose, lighting, and mood.

CHARACTER LOCKS ENFORCEMENT:
Treat all active locks as hard prompt constraints:
${this.buildLocksInstruction(input.characterLocks)}

VARIATIONS DIVERSITY:
- Each variation must create meaningful differences through actions, gestures, emotional beats, character interaction, timing, environmental blocking, and composition.
- Do NOT simply swap synonyms (e.g. replacing 'beautiful' with 'attractive').
- Maintain core identity, active locks, and selected Story Style consistently across all variations.`;
  }

  private buildLocksInstruction(locks: GenerationInput['characterLocks']): string {
    const active = CHARACTER_LOCKS_CONFIG
      .filter((item) => Boolean(locks[item.key]))
      .map((item) => {
        if (item.key === 'bodyshape') {
          return `- /bodyshape_lock (/bodyshape lock): ${item.promptInstruction}`;
        }
        return `- ${item.tag}: ${item.promptInstruction}`;
      });

    if (active.length === 0) {
      return "No character locks active. Subtle natural variations in pose, clothing, and expression are permitted.";
    }
    return active.join('\n');
  }

  private buildUserPrompt(input: GenerationInput): string {
    const parts: string[] = [];

    parts.push(`Generate exactly ${input.variationCount} standalone, copy-ready English image prompt variation(s) based on the following instructions:`);

    if (input.samplePrompt.trim()) {
      parts.push(`\n[PROMPT SAMPLE (Source of Truth for Scene & Identity)]:\n${input.samplePrompt.trim()}`);
    }

    if (input.keywords.trim()) {
      parts.push(`\n[KEYWORDS / SCENE IDEA]:\n${input.keywords.trim()}`);
    }

    if (input.referenceImages && input.referenceImages.length > 0) {
      const subjectOutfitsSummary = input.referenceImages.map((subj, idx) => {
        const outfit = input.outfitImages?.[subj.id];
        if (outfit) {
          return `  - Subject ${idx + 1} ("${subj.name}"): Use attire from Outfit Reference ${idx + 1} ("${outfit.name}").`;
        } else {
          return `  - Subject ${idx + 1} ("${subj.name}"): FALLBACK - preserve attire visibly worn in Subject Reference ${idx + 1}.`;
        }
      }).join('\n');

      parts.push(`\n[SUBJECT & OUTFIT REFERENCES]:\n${input.referenceImages.length} visual subject reference(s) provided:\n${subjectOutfitsSummary}`);
    }

    // Story Style
    const storyParts: string[] = [];
    const isMatureCouplePrimary = isMatureCoupleStyle(input.storyStyle.primary || '');
    const isMatureSoloPrimary =
      (input.storyStyle.primary === 'Mature & Sensual' && !isMatureCouplePrimary) ||
      (isMatureSensualSubstyle(input.storyStyle.primary || '') && !isMatureCouplePrimary);

    if (isMatureSoloPrimary) {
      // 1. Primary Style: Mature & Sensual Solo Substyle
      storyParts.push(`Primary Style: "Mature & Sensual" (Solo Adult Female Aesthetic)`);

      // 2. Substyle terpilih
      const substyleName =
        input.storyStyle.matureSubstyle ||
        (isMatureSensualSubstyle(input.storyStyle.primary || '') ? input.storyStyle.primary : 'Soft Sensuality');
      const substyleObj = getMatureSubstyleByName(substyleName || 'Soft Sensuality');

      if (substyleObj) {
        storyParts.push(`Selected Substyle: "${substyleObj.name}" (Group: ${substyleObj.group})`);
        storyParts.push(`- Substyle Visual Definition: ${substyleObj.visualDefinition}`);
        storyParts.push(`- Posing & Body Language: ${substyleObj.poseAndBodyLanguage}`);
        storyParts.push(`- Facial Expression: ${substyleObj.facialExpression}`);
        storyParts.push(`- Lighting & Composition: ${substyleObj.lightingAndComposition}`);
        storyParts.push(`- Photography Direction: ${substyleObj.promptDirective}`);
      } else if (substyleName) {
        storyParts.push(`Selected Substyle: "${substyleName}"`);
        const subDirective = getStyleVisualDirective(substyleName);
        if (subDirective) {
          storyParts.push(`- Substyle Directive: ${subDirective}`);
        }
      }

      // 3. Intensity Level
      const intensity = input.storyStyle.matureIntensity || 'Soft';
      storyParts.push(`Intensity Level: "${intensity}" — ${getIntensityDirective(intensity)}`);

      // 5. Aturan Single Adult Female Subject (Mandatory for Solo Substyles)
      storyParts.push(`\n${SINGLE_ADULT_FEMALE_DIRECTIVE}`);
    } else if (isMatureCouplePrimary) {
      // Mature & Sensual in Couple / Relationship Dynamics Context (Preserved)
      storyParts.push(`Primary Style: "${input.storyStyle.primary}" (Mature & Sensual — Romantic & Intimate Couple Dynamics)`);
      const coupleDirective = getStyleVisualDirective(input.storyStyle.primary!);
      if (coupleDirective) {
        storyParts.push(`- Primary Visual Directive: ${coupleDirective}`);
      }
    } else if (input.storyStyle.primary) {
      storyParts.push(`Primary Style: "${input.storyStyle.primary}" (determines scene narrative, action, core interaction)`);
      const primaryDirective = getStyleVisualDirective(input.storyStyle.primary);
      if (primaryDirective) {
        storyParts.push(`- Primary Visual Directive: ${primaryDirective}`);
      }
    }

    // 4. Supporting Styles (Max 2)
    if (input.storyStyle.supporting && input.storyStyle.supporting.length > 0) {
      const activeSupporting = input.storyStyle.supporting.slice(0, 2);
      storyParts.push(`Supporting Styles: ${activeSupporting.map(s => `"${s}"`).join(', ')} (enriches atmosphere; nuance only, must not overpower primary style)`);
      activeSupporting.forEach((s) => {
        const supDirective = getStyleVisualDirective(s);
        if (supDirective) {
          storyParts.push(`- Supporting Nuance ("${s}"): ${supDirective}`);
        }
      });
    }

    // Custom Story Style
    if (input.storyStyle.custom && input.storyStyle.custom.trim()) {
      storyParts.push(`Custom Story Style: "${input.storyStyle.custom.trim()}" (complementary custom narrative direction)`);
    }

    if (storyParts.length > 0) {
      parts.push(`\n[STORY STYLE DIRECTIONS]:\n${storyParts.join('\n')}`);
    } else {
      parts.push(`\n[STORY STYLE]: None selected. Do not force an artificial narrative genre.`);
    }

    // Photographic Style
    const photoParts: string[] = [];
    if (input.photographicStyle.selected.length > 0) {
      photoParts.push(`Selected Styles: ${input.photographicStyle.selected.join(', ')}`);
    }
    if (input.photographicStyle.custom && input.photographicStyle.custom.trim()) {
      photoParts.push(`Custom Photographic Style: "${input.photographicStyle.custom.trim()}"`);
    }
    const isNyataPrompt = input.photographicStyle.selected.includes('nyata') || 
                          input.photographicStyle.selected.includes('Nyata');
    if (isNyataPrompt) {
      photoParts.push(`Nyata Preset Directives:
- Face Identity Lock Shorthand: ${NYATA_STYLE_CONFIG.faceIdentityLock.shorthand}
- Natural Photorealism Shorthand: ${NYATA_STYLE_CONFIG.naturalPhotorealism.shorthand}
- Principles: Prioritize uploaded reference image as the primary identity anchor (facial geometry, proportions, natural age). Render authentic camera-captured realism with visible skin pores and natural microtexture without beauty filters, plastic skin, or artificial distortion.`);
    } else {
      const activePhotoDirectives = getActivePhotographicDirectives(input.photographicStyle.selected);
      if (activePhotoDirectives.length > 0) {
        photoParts.push(
          `Active Photographic Shorthand Directives:\n${activePhotoDirectives.map((d) => `- ${d.tag} (${d.name}): ${d.directive}`).join('\n')}`
        );
      }
    }
    if (photoParts.length > 0) {
      parts.push(`\n[PHOTOGRAPHIC RENDERING STYLES]:\n${photoParts.join('\n')}`);
    }

    // Active Locks
    const activeLockTags = getActiveLockTags(input.characterLocks);

    if (activeLockTags.length > 0) {
      parts.push(`\n[ACTIVE CHARACTER LOCKS - HARD CONSTRAINTS]:\n${activeLockTags.join(' ')}\nEnforce these locks strictly. Append the active lock flags to the prompt only if helpful for external generator tags, but above all integrate their hard constraints into the visual scene description.`);
    }

    // Aspect Ratio in User Prompt
    if (input.selectedAspectRatio && input.selectedAspectRatio !== 'auto') {
      parts.push(`\n[ASPECT RATIO - MANDATORY FOR ALL VARIATIONS]:\nTarget aspect ratio: ${input.selectedAspectRatio}. Compose every scene specifically for this framing and conclude each prompt variation with "--ar ${input.selectedAspectRatio}".`);
    } else {
      parts.push(`\n[ASPECT RATIO]:\nAutomatic / default. Do not append fixed --ar parameters.`);
    }

    // Framing in User Prompt
    if (input.framingConfig?.enabled) {
      const isAuto = !input.framingConfig.selected || input.framingConfig.selected === 'auto';
      if (isAuto) {
        const resolved = resolveAutoFraming(
          input.samplePrompt,
          input.keywords,
          input.storyStyle.primary
        );
        parts.push(`\n[FRAMING & CAMERA COMPOSITION - AUTO MODE]:
Camera Framing is set to Auto. Automatically analyze the scene and apply the most fitting composition (Recommended: "${resolved.name}": ${resolved.promptDirective}). Do not output the literal word "Auto".`);
      } else {
        const selectedOpt = getFramingOptionByIdOrName(input.framingConfig.selected);
        if (selectedOpt && selectedOpt.id !== 'auto') {
          parts.push(`\n[FRAMING & CAMERA COMPOSITION - MANDATORY]:
Shot Framing: "${selectedOpt.name}" (${selectedOpt.groupName}).
Directive: ${selectedOpt.promptDirective}
Ensure all prompt variations strictly reflect this framing without conflicting camera distances.`);
        }
      }
    }

    // Outfit & Layering Control in User Prompt
    if (input.referenceImages && input.referenceImages.length > 0) {
      const perSubjectDirectives = input.referenceImages.map((subj, idx) => {
        const config = input.outfitLayeringConfigs?.[subj.id] || input.outfitLayeringConfig || { mode: 'Automatic' };
        const mode = config.mode;
        const custom = config.customInstructions?.trim();
        if (mode === 'Transparent Fabric Preservation' || mode === 'No Undergarment Layer') {
          return `  - Subject ${idx + 1} ("${subj.name}") (Mode: "${mode}"):
    * Strictly preserve all sheer/mesh/tulle/lace transparency without adding unrequested modesty slips, camisoles, or opaque under-layers.
    * Replicate exact silhouette, shoulder straps, neckline, visible seams, and panel distribution from the uploaded outfit reference.
    * Do NOT alter the garment category (e.g. do NOT turn mesh gowns into bodysuits) and do NOT homogenize transparent vs opaque zones.`;
        } else if (mode === 'Editorial Minimal Layering') {
          return `  - Subject ${idx + 1} ("${subj.name}") (Mode: "${mode}"): Editorial minimal layering with clean silhouette and authentic fabric transparency without bulky undergarments or modesty slips.`;
        } else if (mode === 'Preserve') {
          return `  - Subject ${idx + 1} ("${subj.name}") (Mode: "${mode}"): Preserve original undergarments and clothing layers from the reference image without adding unrequested garments.`;
        } else if (mode === 'Match Outfit') {
          return `  - Subject ${idx + 1} ("${subj.name}") (Mode: "${mode}"): Match undergarments to the outfit's colors, materials, and styling seamlessly.`;
        } else if (mode === 'Concealed') {
          return `  - Subject ${idx + 1} ("${subj.name}") (Mode: "${mode}"): Conceal all undergarment layers seamlessly with no visible lines or peeking edges.`;
        } else if (mode === 'Custom') {
          return `  - Subject ${idx + 1} ("${subj.name}") (Mode: "${mode}"):${custom ? ` Custom Undergarment Instructions: "${custom}"` : ' Apply custom undergarment styling'}.`;
        } else if (mode === 'Original Outfit Preservation' || mode === 'Exact Outfit Match') {
          return `  - Subject ${idx + 1} ("${subj.name}") (Mode: "${mode}"): 1:1 strict preservation of the uploaded/referenced outfit colors, cuts, patterns, and materials.`;
        } else if (mode === 'Preserve Visible Layers') {
          return `  - Subject ${idx + 1} ("${subj.name}") (Mode: "${mode}"): Preserve visible layer hierarchy and sequence without adding or removing layers.`;
        } else if (mode === 'Custom Outfit Instructions') {
          return `  - Subject ${idx + 1} ("${subj.name}") (Mode: "${mode}"):${custom ? ` Custom Instructions: "${custom}"` : ' Apply user custom styling'}.`;
        } else {
          return `  - Subject ${idx + 1} ("${subj.name}") (Mode: "${mode}"): Match attire from outfit/subject reference faithfully without fabricating unseen garments.`;
        }
      }).join('\n');

      const anyTransparent = input.referenceImages.some((subj) => {
        const mode = input.outfitLayeringConfigs?.[subj.id]?.mode;
        return mode === 'Transparent Fabric Preservation' || mode === 'No Undergarment Layer' || mode === 'Editorial Minimal Layering';
      });

      parts.push(`\n[PER-SUBJECT OUTFIT & LAYERING CONTROL]:\n${perSubjectDirectives}\nEnforce these per-subject outfit and layering rules consistently across 100% of generated variations.${anyTransparent ? '\nCRITICAL: One or more subjects use "Transparent Fabric Preservation" or "No Undergarment Layer" — do NOT generate phrases like "slip underneath", "modesty lining", or "opaque undergarments".' : ''}`);

      parts.push(`\n[STRICT OUTFIT REFERENCE MATCH & GARMENT DESIGN LOCK]:
- Primary authority for clothing: Uploaded Outfit Reference images.
- Preserve all visible garment details: exact silhouette, necklines, shoulder/chain straps, seam lines, diagonal panels, fabric textures, and sheer/mesh transparency.
- Do NOT substitute generic similar styles, do NOT add unrequested bra cups or modesty linings, and do NOT symmetrize asymmetric designs.
- Separate Garment Design Lock from Natural Body Fit: lock the exact clothing design while describing natural fabric drape, tension, and conforming folds over the subject's anatomy.`);
    } else {
      const activeLayeringMode = input.outfitLayeringConfig?.mode || 'Automatic';
      const activeCustomOutfit = input.outfitLayeringConfig?.customInstructions?.trim();
      if (activeLayeringMode === 'Transparent Fabric Preservation') {
        parts.push(`\n[OUTFIT & LAYERING CONTROL - CRITICAL MANDATE]:
Mode: "Transparent Fabric Preservation"
- Strictly preserve all sheer, mesh, tulle, and transparent lace fabric characteristics without adding modesty slips, camisoles, or opaque under-layers.
- Do NOT generate phrases like "slip underneath", "modesty lining", or "opaque undergarments".
- Keep the fabric transparent as in the reference, distinguishing integral design panels from separate layers.
- Enforce this strictly across 100% of the ${input.variationCount} variation(s).`);
      } else {
        parts.push(`\n[OUTFIT & LAYERING CONTROL]:\nMode: "${activeLayeringMode}"\n${activeLayeringMode === 'Custom Outfit Instructions' && activeCustomOutfit ? `Custom Instructions: "${activeCustomOutfit}"\n` : ''}Enforce this outfit and layering control consistently across 100% of generated variations.`);
      }
    }

    parts.push(`\n[OUTPUT REQUIREMENT]:\nOutput a JSON object with a single field "prompts" containing an array of ${input.variationCount} string(s). Each string must be solely the final descriptive English prompt text, with no introductory labels, no markdown formatting inside the text, and no commentary.`);

    return parts.join('\n');
  }

  private parseResponse(raw: string, expectedCount: number): string[] {
    try {
      // 1. Try direct JSON parse
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.prompts) && parsed.prompts.length > 0) {
        return parsed.prompts.map((p: unknown) => this.cleanPromptText(String(p)));
      }
    } catch {
      // JSON parse failed; attempt markdown fence extraction
      const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          if (Array.isArray(parsed.prompts) && parsed.prompts.length > 0) {
            return parsed.prompts.map((p: unknown) => this.cleanPromptText(String(p)));
          }
        } catch {
          // continue fallback
        }
      }
    }

    // Fallback: Split by double newlines or numbered lines if raw text was returned
    const lines = raw.split(/\n\s*\n/).map(l => this.cleanPromptText(l)).filter(l => l.length > 20);
    if (lines.length > 0) {
      return lines.slice(0, expectedCount);
    }

    return [this.cleanPromptText(raw)];
  }

  private cleanPromptText(text: string): string {
    return text
      .replace(/^Variation \d+[:\s-]*/i, '')
      .replace(/^Prompt \d+[:\s-]*/i, '')
      .replace(/^#+\s+/gm, '')
      .replace(/^"|"$/g, '')
      .trim();
  }
}
