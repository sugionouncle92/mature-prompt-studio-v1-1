export type FramingGroupId =
  | 'detail-portrait'
  | 'body-fashion'
  | 'distance-environment'
  | 'camera-angle';

export interface FramingGroup {
  id: FramingGroupId;
  name: string; // Indonesian group title
  englishName: string;
}

export interface FramingOption {
  id: string;
  name: string; // English name
  groupId: FramingGroupId | 'auto';
  groupName: string; // Indonesian group name
  description: string; // Indonesian description
  promptDirective: string; // Visual prompt instruction for AI image generation
}

export const FRAMING_GROUPS: FramingGroup[] = [
  {
    id: 'detail-portrait',
    name: 'Detail & Portrait',
    englishName: 'Detail & Portrait',
  },
  {
    id: 'body-fashion',
    name: 'Tubuh & Fashion',
    englishName: 'Body & Fashion',
  },
  {
    id: 'distance-environment',
    name: 'Jarak & Lingkungan',
    englishName: 'Distance & Environment',
  },
  {
    id: 'camera-angle',
    name: 'Sudut Kamera & Perspektif',
    englishName: 'Camera Angle & Perspective',
  },
];

export const AUTO_FRAMING_OPTION: FramingOption = {
  id: 'auto',
  name: 'Auto',
  groupId: 'auto',
  groupName: 'Auto',
  description: 'Menyesuaikan framing secara otomatis berdasarkan isi dan kebutuhan visual prompt.',
  promptDirective:
    'Dynamically select and compose the most visually compelling camera framing tailored to the scene context, subject count, and narrative mood.',
};

export const MANUAL_FRAMING_OPTIONS: FramingOption[] = [
  // A. DETAIL & PORTRAIT (5 options)
  {
    id: 'extreme-macro-detail',
    name: 'Extreme Macro Detail',
    groupId: 'detail-portrait',
    groupName: 'Detail & Portrait',
    description: 'Detail sangat dekat pada tekstur atau bagian kecil, seperti iris mata, bulu mata, dan material pakaian.',
    promptDirective:
      'Extreme macro detail composition focusing intensely on micro-textures and fine intricate elements, capturing visible skin pores, individual eyelashes, moisture reflection in the iris, and delicate fabric fibers in ultra-sharp optical clarity.',
  },
  {
    id: 'extreme-close-up',
    name: 'Extreme Close Up',
    groupId: 'detail-portrait',
    groupName: 'Detail & Portrait',
    description: 'Menampilkan bagian wajah atau objek secara sangat dekat.',
    promptDirective:
      'Extreme close-up shot tightly framing a specific facial feature or visual focal point, accentuating intimate expressions, gaze intensity, and razor-sharp textures with shallow depth of field.',
  },
  {
    id: 'close-up',
    name: 'Close Up',
    groupId: 'detail-portrait',
    groupName: 'Detail & Portrait',
    description: 'Berfokus pada wajah dan kepala untuk menonjolkan ekspresi serta detail wajah.',
    promptDirective:
      'Close-up portrait framing the subject\'s face and head, highlighting nuanced facial expressions, authentic eye contact, refined skin texture, and soft atmospheric lighting.',
  },
  {
    id: 'medium-close-up',
    name: 'Medium Close Up',
    groupId: 'detail-portrait',
    groupName: 'Detail & Portrait',
    description: 'Menampilkan kepala hingga dada atas.',
    promptDirective:
      'Medium close-up portrait framing the subject from the head to the upper chest, maintaining clear focus on facial expression, neckline, and upper garment details with balanced composition.',
  },
  {
    id: 'bust-shot',
    name: 'Bust Shot',
    groupId: 'detail-portrait',
    groupName: 'Detail & Portrait',
    description: 'Menampilkan kepala, bahu, dan bagian dada atas.',
    promptDirective:
      'Classic bust shot framing the subject from the head through the shoulders and upper chest, presenting an elegant portrait composition with distinct posture and attire styling.',
  },

  // B. TUBUH & FASHION (6 options)
  {
    id: 'medium-shot',
    name: 'Medium Shot',
    groupId: 'body-fashion',
    groupName: 'Tubuh & Fashion',
    description: 'Menampilkan kepala hingga pinggang.',
    promptDirective:
      'Medium shot framing the subject from the head to the waistline, capturing body language, hand gestures, and garment silhouette in a natural conversational perspective.',
  },
  {
    id: 'medium-full-shot',
    name: 'Medium Full Shot',
    groupId: 'body-fashion',
    groupName: 'Tubuh & Fashion',
    description: 'Menampilkan kepala hingga sekitar paha.',
    promptDirective:
      'Medium full shot framing the subject from the head down to approximately the mid-thighs, balancing complete outfit silhouette, torso posture, and surrounding spatial environment.',
  },
  {
    id: 'american-shot',
    name: 'American Shot',
    groupId: 'body-fashion',
    groupName: 'Tubuh & Fashion',
    description: 'Menampilkan kepala hingga pertengahan paha.',
    promptDirective:
      'American shot framing the subject from the head to mid-thigh, emphasizing cinematic confidence, posture, and waistline attire details with balanced headroom.',
  },
  {
    id: 'cowboy-shot',
    name: 'Cowboy Shot',
    groupId: 'body-fashion',
    groupName: 'Tubuh & Fashion',
    description: 'Menampilkan kepala hingga sekitar lutut.',
    promptDirective:
      'Cowboy shot framing the subject from the head down to just above the knees, highlighting leg stance, lower garment drape, and grounded physical presence.',
  },
  {
    id: 'three-quarter-shot',
    name: 'Three-Quarter Shot',
    groupId: 'body-fashion',
    groupName: 'Tubuh & Fashion',
    description: 'Menampilkan sebagian besar tubuh, umumnya dari kepala hingga paha atau betis.',
    promptDirective:
      'Three-quarter body shot framing the subject from the head to the shins or calves, showcasing the majority of the body, attire drape, and dynamic posture.',
  },
  {
    id: 'full-body',
    name: 'Full Body',
    groupId: 'body-fashion',
    groupName: 'Tubuh & Fashion',
    description: 'Menampilkan seluruh tubuh dari kepala hingga kaki, termasuk alas kaki.',
    promptDirective:
      'Full-body composition showing the subject completely from head to toe, with the entire body and both feet visible inside the frame. Avoid unintended cropping.',
  },

  // C. JARAK & LINGKUNGAN (4 options)
  {
    id: 'long-shot',
    name: 'Long Shot',
    groupId: 'distance-environment',
    groupName: 'Jarak & Lingkungan',
    description: 'Menampilkan subjek secara utuh bersama lingkungan di sekitarnya.',
    promptDirective:
      'Long shot framing the complete subject standing within the full context of their surrounding environment, establishing architectural depth, spatial relationship, and atmospheric mood.',
  },
  {
    id: 'wide-shot',
    name: 'Wide Shot',
    groupId: 'distance-environment',
    groupName: 'Jarak & Lingkungan',
    description: 'Menampilkan lingkungan yang luas dengan subjek tetap terlihat jelas.',
    promptDirective:
      'Wide-angle shot capturing an expansive environment with the subject clearly discernible and harmoniously integrated into the panoramic setting.',
  },
  {
    id: 'extreme-long-shot',
    name: 'Extreme Long Shot',
    groupId: 'distance-environment',
    groupName: 'Jarak & Lingkungan',
    description: 'Menampilkan pemandangan sangat luas dengan subjek relatif kecil.',
    promptDirective:
      'Extreme long shot framing a vast, sprawling landscape or grand interior where the subject appears relatively small, emphasizing environmental scale and cinematic grandeur.',
  },
  {
    id: 'establishing-shot',
    name: 'Establishing Shot',
    groupId: 'distance-environment',
    groupName: 'Jarak & Lingkungan',
    description: 'Memperkenalkan lokasi atau lingkungan secara menyeluruh.',
    promptDirective:
      'Establishing shot providing a comprehensive overview of the scenic location and ambient setting, grounding the scene\'s spatial geography and architectural context.',
  },

  // D. SUDUT KAMERA & PERSPEKTIF (8 options)
  {
    id: 'pov',
    name: 'Point of View (POV)',
    groupId: 'camera-angle',
    groupName: 'Sudut Kamera & Perspektif',
    description: 'Menampilkan adegan dari sudut pandang karakter.',
    promptDirective:
      'First-person Point of View (POV) perspective capturing the scene directly through the eyes of an observer or interacting partner, creating immersive intimate proximity.',
  },
  {
    id: 'over-the-shoulder',
    name: 'Over The Shoulder',
    groupId: 'camera-angle',
    groupName: 'Sudut Kamera & Perspektif',
    description: 'Mengambil gambar melewati bahu subjek di latar depan.',
    promptDirective:
      'Over-the-shoulder camera angle framed from just behind the foreground subject\'s shoulder, focusing past them onto the primary subject to heighten interpersonal tension and depth.',
  },
  {
    id: 'birds-eye-view',
    name: "Bird's-Eye View",
    groupId: 'camera-angle',
    groupName: 'Sudut Kamera & Perspektif',
    description: 'Sudut pandang dari atas untuk memperlihatkan tata letak subjek dan lingkungan.',
    promptDirective:
      "High-altitude bird's-eye view looking down from an elevated vantage point to reveal spatial geometry, subject placement, and environmental layout.",
  },
  {
    id: 'high-angle-shot',
    name: 'High-Angle Shot',
    groupId: 'camera-angle',
    groupName: 'Sudut Kamera & Perspektif',
    description: 'Kamera berada di atas subjek dan mengarah ke bawah.',
    promptDirective:
      'High-angle shot with the camera positioned above the subject looking downward, creating a compelling downward gaze, flattering facial contours, and spatial grounding.',
  },
  {
    id: 'eye-level-shot',
    name: 'Eye-Level Shot',
    groupId: 'camera-angle',
    groupName: 'Sudut Kamera & Perspektif',
    description: 'Kamera sejajar dengan mata subjek.',
    promptDirective:
      'Position the camera at the same height as the subject\'s eyes for a natural eye-level perspective.',
  },
  {
    id: 'low-angle-shot',
    name: 'Low-Angle Shot',
    groupId: 'camera-angle',
    groupName: 'Sudut Kamera & Perspektif',
    description: 'Kamera berada di bawah subjek dan mengarah ke atas.',
    promptDirective:
      'Low-angle shot with the camera positioned below the subject tilting upward, accentuating height, commanding presence, and elegant vertical lines.',
  },
  {
    id: 'worms-eye-view',
    name: "Worm's-Eye View",
    groupId: 'camera-angle',
    groupName: 'Sudut Kamera & Perspektif',
    description: 'Sudut kamera sangat rendah, dekat tanah, mengarah tajam ke atas.',
    promptDirective:
      "Extreme worm's-eye view camera angle placed at ground level angling steeply upward toward the subject, dramatic vertical perspective, and striking low horizon.",
  },
  {
    id: 'overhead-shot',
    name: 'Overhead Shot',
    groupId: 'camera-angle',
    groupName: 'Sudut Kamera & Perspektif',
    description: 'Kamera tepat di atas subjek dan mengarah ke bawah.',
    promptDirective:
      'Direct top-down overhead shot (god\'s-eye perspective) positioned directly 90 degrees above the subject, highlighting symmetrical arrangement, pose geometry, and floor surface texture.',
  },
];

/**
 * All 24 Framing options (1 Auto + 23 manual).
 */
export const ALL_FRAMING_OPTIONS: FramingOption[] = [
  AUTO_FRAMING_OPTION,
  ...MANUAL_FRAMING_OPTIONS,
];

/**
 * Look up a framing option by its ID or Name (case-insensitive).
 */
export function getFramingOptionByIdOrName(query: string): FramingOption | undefined {
  if (!query) return undefined;
  const q = query.trim().toLowerCase();
  return ALL_FRAMING_OPTIONS.find(
    (opt) => opt.id.toLowerCase() === q || opt.name.toLowerCase() === q
  );
}

/**
 * Resolves the most appropriate framing option for Auto mode based on the user's
 * textual inputs (sample prompt, keywords, and scene style).
 */
export function resolveAutoFraming(
  samplePrompt: string,
  keywords: string,
  primaryStyle?: string | null
): FramingOption {
  const combined = `${samplePrompt} ${keywords}`.toLowerCase();

  // 1. Check for explicit framing mentions in user's prompt text
  if (/\b(?:macro|iris|eyelashes|eyelash|micro-texture)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'extreme-macro-detail')!;
  }
  if (/\b(?:extreme close up|extreme close-up|ecu)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'extreme-close-up')!;
  }
  if (/\b(?:close up|close-up|facial portrait|face portrait|face focus)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'close-up')!;
  }
  if (/\b(?:bust shot|head and shoulders|chest-up|upper chest)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'bust-shot')!;
  }
  if (/\b(?:full body|full-body|head to toe|entire body|shoes|feet visible)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'full-body')!;
  }
  if (/\b(?:three-quarter|three quarter|3\/4 body)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'three-quarter-shot')!;
  }
  if (/\b(?:cowboy shot|knees up|to the knees)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'cowboy-shot')!;
  }
  if (/\b(?:american shot|mid-thigh|to mid thigh)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'american-shot')!;
  }
  if (/\b(?:medium full|thigh-up|to the thighs)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'medium-full-shot')!;
  }
  if (/\b(?:medium shot|waist-up|to the waist)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'medium-shot')!;
  }
  if (/\b(?:pov|point of view|first person)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'pov')!;
  }
  if (/\b(?:over the shoulder|ots)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'over-the-shoulder')!;
  }
  if (/\b(?:bird's-eye|birds eye|aerial view)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'birds-eye-view')!;
  }
  if (/\b(?:worm's-eye|worms eye|ground level looking up)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'worms-eye-view')!;
  }
  if (/\b(?:overhead shot|top down|top-down|directly above)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'overhead-shot')!;
  }
  if (/\b(?:high angle|from above looking down)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'high-angle-shot')!;
  }
  if (/\b(?:low angle|from below looking up)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'low-angle-shot')!;
  }
  if (/\b(?:eye level|eye-level)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'eye-level-shot')!;
  }
  if (/\b(?:establishing shot|scenic overview)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'establishing-shot')!;
  }
  if (/\b(?:extreme long shot|distant landscape)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'extreme-long-shot')!;
  }
  if (/\b(?:wide shot|wide-angle|panoramic)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'wide-shot')!;
  }
  if (/\b(?:long shot|environmental portrait)\b/i.test(combined)) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'long-shot')!;
  }

  // 2. Infer framing from contextual cues or primary style
  const style = (primaryStyle || '').toLowerCase();

  // Intimate / sensual / boudoir / beauty usually thrives in medium close-up or close-up
  if (style.includes('sensual') || style.includes('boudoir') || style.includes('glamour') || style.includes('beauty')) {
    if (combined.includes('gown') || combined.includes('dress') || combined.includes('lingerie set')) {
      return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'medium-full-shot')!;
    }
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'medium-close-up')!;
  }

  // Fashion / street style / dynamic action favors full body or medium shot
  if (style.includes('fashion') || style.includes('editorial') || style.includes('street')) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'full-body')!;
  }

  // Cinematic / film noir favors medium shot or eye-level shot
  if (style.includes('cinematic') || style.includes('noir')) {
    return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'medium-shot')!;
  }

  // Default neutral framing for mature portraits
  return MANUAL_FRAMING_OPTIONS.find((o) => o.id === 'medium-close-up')!;
}
