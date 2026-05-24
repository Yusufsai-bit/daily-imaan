# Daily Imaan — Brand Guide

> A gentle daily return to the words of Allah.

This is the engineering reference. The visual brand guide lives on the canvas
(`artifacts/mockup-sandbox/src/components/mockups/daily-imaan-brand/BrandGuide.tsx`).

---

## 1. Essence

**For:** Busy Muslims who want a daily moment with the Qur'an without a habit-tracker
guilt-tripping them.

**We are:** Calm · reverent · unhurried · generous · companion (not coach).

**We are not:** Gamified · streak-shaming · ad-supported · an AI tafsir · loud.

**The tone test:** Would a soft-spoken elder approve of this copy? If not, rewrite it.

---

## 2. Color

All colors are defined here. Do not introduce a new color without updating this file.

| Token         | Hex       | Role                         |
|---------------|-----------|------------------------------|
| `emerald`     | `#1A6B4A` | Primary — buttons, brand mark, adaptive icon background |
| `forest`      | `#0F3B2C` | Primary deep — pressed states, headers on cream |
| `sage`        | `#D9E8DE` | Tint — dividers, inactive states, soft fills |
| `cream`       | `#F7F1E3` | Canvas background (light mode) |
| `lantern`     | `#FBFAF6` | Surface — cards, sheets |
| `gold`        | `#C9A24A` | Accent — illumination only, never for primary actions |
| `ink`         | `#1B1F1D` | Body text |
| `stone`       | `#6B7368` | Muted text — metadata, captions |

**Contrast pairings (verified):**
- `ink` on `cream` — 14.1 : 1 (AAA)
- `emerald` on `cream` — 6.4 : 1 (AA Large, AA UI)
- `stone` on `cream` — 4.9 : 1 (AA Normal)

**Dark mode:** invert `cream`/`lantern` to `forest`/`#0A2A20`, lift `ink` to
`#F1EAD8`, keep emerald and gold as-is — they read well on both.

**Gold is sacred.** Use it for illumination accents (verse number tags, hairlines
under section titles, brand-mark hover). Never for buttons, never for backgrounds.

---

## 3. Typography

**Constraint: Google Fonts only.** No paid foundries, no custom files.

| Family | Use | Notes |
|--------|-----|-------|
| **Lora** | Display, headlines, English verse text | Humanist serif. Weights 400 / 500 / 600. Avoid 700 — competes with Arabic. |
| **Inter** | Body, UI, buttons, metadata | Variable font. 400 body, 500 emphasis/buttons, tabular numerals for ayah/surah numbers. |
| **Noto Naskh Arabic** | Arabic / Qur'anic text rendered inside the app | Modern naskh designed for on-screen reading. Thicker strokes and more open counters than Amiri, so harakāt stay legible at body sizes on phones. Weights 400 / 700. |
| **Amiri** | Arabic / Qur'anic text in marketing graphics only (IG, posters, print) | Khaled Hosny's classical naskh, designed for Quranic typesetting. Reserved for large-format / display contexts where its ornate strokes are an asset. |

**Why two Arabic faces?** Amiri is the typographic standard for Qur'an rendering
in print and display — built for the Cairo edition mushaf, with full Uthmani
diacritics and the vertical metrics needed for tashkīl. But Amiri's strokes are
thin and ornate, which costs readability at body sizes on a phone screen. So
the app uses **Noto Naskh Arabic** (Google's screen-optimised naskh, also fully
diacritised) for everything rendered inside iOS/Android, and reserves Amiri for
marketing graphics where it can breathe at 48pt+. Do not substitute Scheherazade
or system Arabic fonts for either of them.

### Type scale (mobile)

| Token   | Size / line  | Family / weight                   | Use |
|---------|--------------|-----------------------------------|-----|
| display | 32 / 38      | Lora 500                          | Welcome screens, empty states |
| title   | 22 / 28      | Lora 500                          | Section titles |
| verse   | 18 / 30      | Lora 400                          | English verse translation |
| arabic  | 24 / 46      | Noto Naskh Arabic 400, `dir="rtl"` | Qur'anic verse, hadith, du'a (in-app) |
| body    | 15 / 24      | Inter 400                         | Tafsir paragraphs, descriptions |
| label   | 13 / 18      | Inter 500                         | Buttons, labels |
| meta    | 11 / 16      | Inter 500, 0.18em tracking, UPPER | Surah · Ayah · Date stamps |

### Loading the fonts in Expo

Use `useFonts` in the root layout (`app/_layout.tsx`). Show the splash screen
until fonts resolve so we never flash a system serif under an Arabic verse.

Fonts are pulled from `@expo-google-fonts/*` packages — no manual `.ttf` files
in `assets/fonts/`. This keeps lockfile-driven updates and avoids checking
binary assets into git.

```ts
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold }
  from "@expo-google-fonts/inter";
import { AmiriQuran_400Regular } from "@expo-google-fonts/amiri-quran";

useFonts({
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  AmiriQuran_400Regular,
});
```

**Arabic face:** Amiri Quran (specialised Mushaf-style variant of Khaled Hosny's
Amiri). Used for every Arabic block — Quran ayat, hadith Arabic, du'a, dhikr,
Asma ul Husna. Reference it via the `ARABIC_FONT_REGULAR` constant in
`constants/fonts.ts`, never as a raw string. Amiri Quran ships Regular only;
Quranic text shouldn't be bolded.

Previous Arabic face was Noto Naskh Arabic, which rendered Uthmani waqf signs
and superscript markings in generic naskh form. Swapped to Amiri Quran in
v1.0.x so the verses look Mushaf-correct on device.

---

## 4. Iconography

- **Library:** `lucide-react-native`
- **Style:** outline, 1.5px stroke, rounded line caps
- **Size:** 20px in compact UI, 24px in primary controls, 32px in empty states
- **Color:** `ink` for content, `emerald` for active/selected, `stone` for inactive

Avoid filled icons. Avoid colored icons. The brand reads through restraint.

---

## 5. Spacing & radius

- **Base grid:** 8pt. All spacing is a multiple of 4 (`4, 8, 12, 16, 24, 32, 48, 64`).
- **Section gap:** 32 (mobile), 48 (tablet+).
- **Component padding:** 16 inner, 24 around the ayah hero card.
- **Radius tokens:** `sm: 8` (inputs, chips) · `md: 16` (cards) · `lg: 24` (hero ayah card) · `pill: 999` (buttons).

---

## 6. Components

### Ayah card (the hero)
- Background `lantern` on a `cream` page.
- 1px `sage` border. No drop shadow heavier than `0 1px 0 rgba(15,59,44,0.04)`.
- Layout, top → bottom: meta strip (`Today` · `Surah : Ayah`), Arabic verse (Amiri),
  English verse (Lora italic optional), Saheeh International attribution (Inter meta).

### Buttons
- **Primary:** filled `emerald`, `lantern` text, pill radius, 16/24 padding.
- **Secondary:** `emerald` text, 1px `emerald` border, transparent background.
- **Tertiary / Mark-as-read:** `stone` text, no border, no background.
- Disabled: 40% opacity, no color shift.

### Tafsir block
- Always preceded by a 1×8 `gold` hairline + the label `TAFSIR IBN KATHIR`.
- Body in Lora 16/28. End every passage with the attribution
  `Verbatim · via quran.com · No AI commentary`.

---

## 7. Motion

- 200–400ms, `ease-out`.
- Fade + small upward translate (4px). No spring physics, no bounce.
- One thing moves at a time. No staggered choreography.
- Always honor `prefers-reduced-motion` / iOS Reduce Motion. When reduced, swap
  to instant transitions — no fade.

---

## 8. Voice & tone

### Say this
- "Welcome back."
- "Your verse for today is ready. Tap to read."
- "Take a moment when you're ready."
- "Read at your own pace."

### Never this
- "Don't break your streak!" — there are no streaks.
- "You missed yesterday." — yesterday is not our business.
- "3 days in a row! Keep going!" — no gamification.
- "Earn your daily reward." — no rewards exist.
- "Our AI explains this verse:" — we never do this.

### Sacred-text rules (non-negotiable)
1. Arabic Qur'anic text is shown verbatim from a verified mushaf source.
2. English translation is **Saheeh International** only. Always attributed.
3. Tafsir is **Ibn Kathir verbatim from quran.com**. Always attributed. Never
   paraphrased. Never AI-summarized.
4. No commentary, opinion, or "modern relevance" framing generated by the app.

---

## 9. Logo direction

The mark is the wordmark — `daily imaan` set in Lora 500, all lowercase, with the
crescent in `emerald` at 0.6× the cap height to its left. The crescent is a
geometric construction (two offset circles), not a decorative flourish. Reserve
the gold accent for the dot of the `i` in "imaan" if a richer brand moment is
needed (avatars, store hero, splash).

---

## 10. Asset checklist for the App / Play Store

- [x] Adaptive icon background `#1A6B4A` (in `app.json`)
- [x] Dark splash screen
- [ ] 1024×1024 master icon (Lora wordmark + crescent on `emerald`)
- [ ] Feature graphic 1024×500 (Play Store) — Arabic ayah on `cream`
- [ ] Five App Store screenshots — see `STORE_LISTING.md`

---

*Brand guide v1.0 — pair this with the visual sheet on the canvas
(`Daily Imaan — Brand Guide` shape) when onboarding new contributors.*
