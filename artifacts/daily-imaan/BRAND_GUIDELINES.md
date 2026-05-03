# Daily Imaan — Brand Guidelines

A quiet companion. Every word verbatim. No noise.

---

## 1. Brand essence

**Mission.** Help every Muslim spend a few intentional minutes a day with the Qur'an, authentic hadith, and prayer — without ads, accounts, or AI commentary getting in the way.

**Promise.** Every word you read is verbatim from a verified classical source — Saheeh International for the Qur'an, Tafsir Ibn Kathir (abridged) for tafsir, Riyāḍ aṣ-Ṣāliḥīn (Imam an-Nawawi) for hadith.

**Personality.**
- **Calm** — never urgent, never guilt-inducing
- **Honest** — quotes the source, attributes it, never paraphrases
- **Spacious** — silence and white space are part of the worship
- **Generous** — free, no accounts, no upsells, no tracking
- **Reverent** — Arabic is treated as sacred, never decorative

**What we are not.** We are not a "feed". We are not a notification machine. We are not an opinion. We do not interpret, summarise, rank, or remix sacred text.

---

## 2. Voice & tone

| Do | Don't |
|---|---|
| "Take a moment with Allah." | "Boost your imaan now!" |
| "Today's ayah is from Surah Al-Baqarah." | "🔥 Don't miss today's verse!" |
| "A gentle nudge, once a day." | "Daily streak alert — keep your imaan going!" |
| Quote first, frame second. | Frame first, quote later. |
| Cite the source every time. | Imply or omit the source. |

**Captions and copy** are short, lowercase-friendly, and end in stillness — not a CTA stack. One verb. One thought. One source line.

**Streak language**: only the word "Streak". Never "fire", "lose your streak", "don't break the chain". The streak is encouragement, never pressure.

---

## 3. Logo & wordmark

- **Wordmark**: "Daily Imaan" in **Inter SemiBold**, tracking +0.5pt at body sizes, never italic.
- **Lockups**: wordmark left-aligned next to the crescent mark. Minimum clear space = the height of the "D".
- **Mark**: a thin crescent. Not stylised, not mosque-shaped, not calligraphic. Solid `#1A6B4A` in light contexts, `#2DBF7F` in dark.
- **Don't**: stretch, recolor outside the palette, place over busy photos, add gradients to the wordmark, or set the wordmark in all caps.

---

## 4. Color palette

### Light mode (canonical)

| Role | Hex | Use |
|---|---|---|
| **Primary (Sage Green)** | `#1A6B4A` | Logo, primary buttons, accents, headings |
| **Primary Foreground** | `#FFFFFF` | Text on primary |
| **Background** | `#FAFAF8` | App background — warm, never pure white |
| **Card** | `#FFFFFF` | Card surfaces |
| **Foreground** | `#111827` | Body text |
| **Muted Foreground** | `#6B7280` | Source citations, helper text |
| **Secondary (Pale Sage)** | `#F0F4F1` | Tile backgrounds, soft surfaces |
| **Accent (Gold)** | `#C8933C` | Hadith reference badges, highlights — use sparingly |
| **Border** | `#E5E7EB` | Hairline dividers |

### Dark mode

| Role | Hex |
|---|---|
| Primary | `#2DBF7F` |
| Background | `#0D1B12` |
| Card | `#132218` |
| Foreground | `#F0F9F4` |
| Muted Foreground | `#9CA3AF` |
| Secondary | `#1A2E22` |

**Rules.** Sage green and cream are the brand. Gold is a *seasoning* — never a fill across large areas. No reds, no blues, no purples. No emoji palettes. No gradients except the soft sage→cream wash on hero surfaces.

---

## 4b. Logo

**The official Daily Imaan mark** is a single composition: a cream / soft-gold
crescent with a small hanging pendant, sitting above an open book, on a dark
sage (`#1A6B4A`) rounded square that carries a subtle tessellated Islamic
geometric pattern at low contrast. The "Daily Imaan" wordmark is set in a
cream serif inside the bottom of the same rounded square.

- **Master file:** `artifacts/daily-imaan/assets/images/icon.png` (1024 × 1024).
- **Distributable kit:** `artifacts/daily-imaan/marketing/logo/` — pre-built
  PNGs at every standard app, favicon, and social size, plus `favicon.ico`
  and a 1200×630 Open Graph card. A zipped copy lives at
  `artifacts/daily-imaan/marketing/daily-imaan-logo-kit.zip`.
- **To regenerate the kit from the master:** `node scripts/gen-logo-kit.mjs`
  from the project root.

**Rules**
- Do not stretch, recolor, or recompose. The mark is one composition; treat
  it as a unit. Always scale uniformly.
- Do not add drop shadows, strokes, or glows — the mark already sits on its
  own dark sage card.
- Do not place on patterned or busy backgrounds. Use calm cream, white, or
  sage surfaces.
- Minimum on-screen size 32 × 32 px. Below that, the wordmark becomes
  illegible; that's expected, and acceptable for favicons.
- For the App Store icon, use `app/app-store-1024.png` (no pre-rounded
  corners — Apple applies the superellipse mask at install time).

---

## 5. Typography

- **English / UI**: **Inter** (Regular 400, Medium 500, SemiBold 600, Bold 700). Tracking 0 at body, +0.5pt at small caps section labels (`SECTION LABEL` style at 11pt).
- **Arabic (in-app)**: **Noto Naskh Arabic** (Regular 400, Bold 700) — the brand standard for any Arabic rendered inside the iOS/Android app, where on-screen readability is the priority. Always set with full diacritical marks (Uthmani script). Never italicise. Never colorise individual letters. Always large enough to read every harakah.
- **Arabic (marketing graphics)**: **Amiri** — Khaled Hosny's classical naskh, used for Instagram posts, posters, and any large-format printed work where the more ornate strokes are an asset rather than a readability cost. Same rules: full diacritics, never italic, never recolored.
- **Numerals**: Arabic-Indic for Qur'anic citations (٢:٢٥٥) where space allows; Latin numerals are acceptable for dates and metrics.

**Hierarchy on a post**
- Source line (top): Inter SemiBold, 24pt, uppercase, +1pt tracking, sage green
- Arabic body (graphics): Amiri, 64pt, line-height 1.5, dark foreground
- Arabic body (in-app): Noto Naskh Arabic, 24pt, line-height 46, dark foreground
- English body: Inter Regular, 30pt, line-height 1.45, dark foreground
- Citation (bottom): Inter Medium, 22pt, muted foreground

---

## 6. Visual treatment

### Spacing
Generous. The most important element on the page is the silence around the words. Minimum margin on a 1080×1350 post is **96px** all sides.

### Hairlines
1px, `#E5E7EB` (light) or `#1F3329` (dark). Never thicker. Used to separate the Arabic from the English — never the source from the body.

### No
- No photographs of mosques, sunsets, or hands raised in dua behind the words
- No shadowed letterforms
- No gradient text
- No tilted angles
- No emoji except 🌙 (sparingly, as a wordless brand mark — never inside the sacred text)
- No hashtag stacks of more than 5

### Yes
- Soft sage→cream radial wash backgrounds
- Gold hairline rule under the source line
- Crescent mark, top-center, never larger than 32px on a post
- Two-line breathing room above and below the Arabic block

---

## 7. Source attribution (non-negotiable)

Every piece of public content **must** cite:

- **Qur'an**: `Surah [Name] [chapter:verse] · Saheeh International`
- **Hadith**: `Riyāḍ aṣ-Ṣāliḥīn [number] · sunnah.com`
- **Dua**: `[Source collection + reference]`

If we can't cite it, we don't post it.

---

## 8. Social handle conventions

- **Instagram**: `@daily.imaan`
- **TikTok**: `@daily.imaan`
- **Web**: `dailyimaan.app` (placeholder until claimed)

In post footers: `@daily.imaan` set in Inter Medium 18pt, muted foreground, never accent gold.

---

## 9. Forbidden

These will get the project rejected from app stores AND violate the project's own principles:

- AI-generated tafsir, translation, or commentary
- "Inspired by" reworded sacred text
- Generic wisdom quotes presented as Islamic
- Claims of authenticity for hadith we haven't verified
- Pressure mechanics ("don't lose your streak", countdown urgency)
- Any tracking pixel, ad SDK, third-party analytics beyond crash reporting
- Showing Arabic text without diacritics for "design reasons"

---

## 10. One-line summary

> **Verbatim. Sourced. Quiet.**
