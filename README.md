# Mature Prompt Studio V1.1

> **Text-Only Prompt Engineering Web Application & Mobile App**  
> Designed for external AI image generators (Miora, Midjourney, ChatGPT, etc.)
> Live Web App: https://sugionouncle92.github.io/mature-prompt-studio-v1-1/

---

## Overview

**Mature Prompt Studio V1.1** is a professional prompt engineering tool that transforms sample prompts, keywords, and subject/outfit references into rich, detailed, standalone English prompts.

### Key Rules & Philosophy
- **Text-Only:** Does not generate, edit, or store images.
- **BYOK (Bring Your Own Key):** Safe client-side storage for Google Gemini API credentials.
- **Dedicated Ultra Realistic Rendering:** Injects authentic camera-captured appearance, micro-textures (visible skin pores, fine lines, eyelashes, individual hair strands), and physically plausible lighting while banning waxy/plastic smoothing or synthetic grain.
- **Consensual Adult Agency:** All characters depicted in mature/sensual scenarios are strictly adults (25+), maintaining consensual interactions without vulgarity.
- **Prompt Only Output:** Generates clean prompts without markdown headings, titles, prompt scores, or commentary inside copied text.

---

## Features

1. **Core Scene Inputs**
   - **A. Prompt Sample:** Large textarea to paste an existing reference prompt. Preserves scene core and character identity.
   - **B. Keywords / Scene Idea:** Freeform keywords for actions, mood, interactions, and lighting.
   - **Combination Modes:** Sample Only (optimization), Keywords Only (ideation), or Both (enhancement).
2. **Story Style Selector (12 Categories, 120 Styles)**
   - Humor & Comedy, Cinematic & Film, Romance & Relationships, Mature & Sensual, Drama & Emotion, Thriller & Suspense, Action & Adventure, Slice of Life, Fantasy & Supernatural, Period & Cultural Drama, Social & Human Interaction, Commercial & Editorial Storytelling, plus Custom Style.
   - **1 Primary Style** (determines scene narrative & core actions) + **Max 2 Supporting Styles** (enriches atmosphere).
3. **Photographic Style Selector**
   - Includes **Ultra Realistic** (dedicated substantive microdetail instructions), Photorealistic, RAW Photo, Cinematic Photography, Natural Camera Rendering, Professional Editorial Photography, High Detail, and Custom Style.
4. **Character Locks (7 Independent Toggles)**
   - `/facelock 100%`: Facial identity & bone structure.
   - `/bodyshape lock`: Body silhouette & proportions.
   - `/outfitlock`: Clothing style, fabric, and colors.
   - `/poselock`: Stance & core orientation.
   - `/agepreserve`: Adult age preservation (25+).
   - `/expressionlock`: Facial expression preservation.
   - `/hairlock`: Hairstyle, length, and color.
5. **Variation Engine (True Scene Variations)**
   - 1, 3, 5, 10, or Custom count.
   - Varies action, timing, gestures, emotional beats, and composition without breaking active character locks.
6. **Output Management**
   - Separate UI cards for each variation.
   - **Copy Prompt:** Copies only that card's prompt text.
   - **Copy All Prompts:** Copies all prompt bodies separated by blank lines (no card labels or commentary).
7. **Application Language (Bahasa Antarmuka)**
   - Two selectable UI languages: **Bahasa Indonesia (ID)** and **English (EN)**.
   - Quick language toggle in the top header and within **API & Pengaturan**.
   - Immediate real-time switching without page reload.
   - Persistent preference saved in `localStorage`.
   - **Strict Prompt Separation Rule:** Whatever the interface language (ID or EN), and whether the user input is in Indonesian or English, all generated output prompts remain **100% strictly in English**, optimized for external AI image generators.
8. **API & Pengaturan (BYOK)**
   - Password-masked key input with visibility toggle.
   - Model ID field (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`, or custom `gemini-3.5-flash-lite`).
   - Real-time **Test Connection** against official Google Gemini API.

---

## Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Verification Test Suite
```bash
node --experimental-strip-types tests/verify-logic.mjs
```
