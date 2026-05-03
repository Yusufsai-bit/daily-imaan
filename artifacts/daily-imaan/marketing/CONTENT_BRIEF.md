# Daily Imaan — Instagram Content Brief

**For external LLMs (Claude, ChatGPT, Gemini) generating post content for the Daily Imaan Instagram account.**

This brief is the single source of truth. Anything you have been told elsewhere about handles, voice, or templates is overridden by this document.

---

## How to use this brief

Paste this entire document into your LLM of choice. Then send a request like:

> "Following the Daily Imaan content brief above, generate **12 posts**: 4× Qur'an Ayah, 3× Hadith, 2× Du'a, 2× Reminder, 1× Asma ul-Husna. Return them in the Output Schema format. Self-verify against the Hard Rules checklist before returning each one."

The LLM should return one block per post in the format defined in §9. Do not ask it to design images — it produces the **text content** that will be dropped into a fixed visual template.

---

## 1. Mission & non-negotiables

Daily Imaan is a quiet companion app. Every word published — in the app and on Instagram — is **verbatim** from a verified classical source. We are not a feed, not an opinion, not a reminder bot.

**Verified sources (the only sources we ever quote):**

| Content type | Source | Citation form |
|---|---|---|
| Qur'an translation | Saheeh International | `Surah [Name] [chapter:verse] · Saheeh International` |
| Hadith | Riyāḍ aṣ-Ṣāliḥīn (Imam an-Nawawi), Sahih al-Bukhari, Sahih Muslim, Jami' at-Tirmidhi | `[Collection] [book:number] · [Grade]` |
| Du'a | Hisn al-Muslim (Fortress of the Muslim) or the Qur'an itself | `[Collection + reference]` or `Surah [Name] [c:v] · Saheeh International` |
| Names of Allah | The 99 Names tradition (al-asma' al-husna) | The verse where the name is established, e.g. `Surah Al-Hashr 59:24` |

**Non-negotiables — break any of these and the post is rejected:**

1. **Verbatim only.** Translations are quoted exactly as they appear in Saheeh International. Hadith are quoted exactly as in the cited collection's standard English translation. Never paraphrase, summarise, or "smooth out" the text.
2. **Sourced every time.** Every post carries the citation. If you cannot cite it, do not post it.
3. **No AI commentary.** No tafsir written by you. No "what this means for us today." No life lessons appended. The text speaks for itself.
4. **No emoji inside sacred text.** Ever. The 🌙 crescent may appear elsewhere as a wordless brand mark; nowhere else.
5. **Arabic with full diacritics (Uthmani).** If you cannot produce the harakāt, omit the Arabic line entirely rather than render it bare.
6. **No pressure mechanics.** No "don't lose your streak", no countdowns, no urgency, no guilt.
7. **No generic wisdom presented as Islamic.** Every quote is traceable to a specific āyah or hadith.

---

## 2. Voice & tone

Calm. Honest. Spacious. Reverent. The captions are short, lowercase-friendly, and end in stillness — not a CTA stack. One verb. One thought. One source line.

**Streak language:** the word is **"Streak"** — full stop. Never "fire", "lose your streak", "don't break the chain".

### Do / Don't

| Do | Don't |
|---|---|
| "Take a moment with Allah." | "Boost your imaan now!" |
| "Today's ayah is from Surah Al-Baqarah." | "🔥 Don't miss today's verse!" |
| "A gentle nudge, once a day." | "Daily streak alert — keep going!" |
| Quote first, frame second. | Frame first, quote later. |
| Cite the source every time. | Imply or omit the source. |
| "Not after. With." | "Allah is always there for you when life gets hard 💚" |
| "Hand it over." | "Give your worries to Allah and watch miracles happen ✨" |

### Caption length

- Hard cap: **3 short lines** of body, plus one source attribution line, plus a hashtag line.
- Often a caption is just one sentence. That is correct.

---

## 3. The handle

The Instagram (and TikTok) handle is **`@dailyimaanapp`**. Always written exactly that way — lowercase, no dot, no underscore. This overrides any other handle you have seen.

---

## 4. The brand frame (every post)

Every post is **1080 × 1350** px (Instagram portrait 4:5).

### Palette

| Role | Hex |
|---|---|
| Sage (primary) | `#1A6B4A` |
| Cream (warm background) | `#F2F0EC` |
| Gold (accent — sparingly) | `#C8933C` |
| Foreground (body text) | `#111827` |
| Muted (sub-labels, citations) | `#6B7280` |
| Hairline | `#E5E7EB` (on cream) / `#1F3329` (on sage) |

### Type

- **Inter** (400/500/600/700) — wordmark, sub-labels, citations, attribution, English UI text
- **EB Garamond Italic** — English serif body for verses, hadith, du'a translations, reminder fragments
- **Amiri** — Arabic, always with full Uthmani diacritics, never italicised

### Shared layout (used by all 5 templates)

```
┌──────────────────────────────────────────────┐
│                                              │  ← top margin ~120px
│             DAILY  IMAAN                     │  ← wordmark, Inter Bold, UPPERCASE, sage, +6pt tracking
│                                              │
│             SUB-LABEL · 50:16                │  ← Inter Medium, UPPERCASE, +4pt tracking, 16pt, dark muted
│                                              │
│                                              │
│         [BODY REGION — varies                │  ← centered, generous whitespace
│          per template]                       │
│                                              │
│              ───                             │  ← short gold rule, ~70px wide, gold
│                                              │
│                                              │
│  ───────────────────────────────────────     │  ← full-width hairline
│                                              │
│            SAHEEH INTERNATIONAL              │  ← source line, Inter SemiBold, UPPERCASE, sage, +3pt tracking
│            @DAILYIMAANAPP                    │  ← handle, Inter SemiBold, UPPERCASE, dark, +3pt tracking
└──────────────────────────────────────────────┘
                                                 ← bottom margin ~96px
```

**Hard frame rules:**

- Wordmark is always **`DAILY IMAAN`** — uppercase, Inter Bold ~26pt, sage, with generous letter-spacing (~6pt). Never lowercase, never italic, never larger than 28pt.
- Sub-label is an all-caps dark-muted string just below the wordmark — it identifies the *kind* of post and (where applicable) the citation reference (`QUR'AN · SURAH QAF 50:16`, `HADITH · BUKHARI 1`, `DU'A · WHEN ANXIOUS`, `NAMES OF ALLAH · 1 / 99`, `THE APP · STREAK`).
- Body region is the visual hero. Maximum margin everywhere — silence is part of the design.
- Short gold rule (~70px) sits between body and the optional citation/transliteration line. This is the only place gold ever appears, with the single exception of the Hadith grade chip (see template 2).
- Footer is **two centered lines**, stacked: source attribution on top (uppercase tracked sage SemiBold, e.g. `SAHEEH INTERNATIONAL`, `SUNNAH.COM`), the handle `@DAILYIMAANAPP` directly below it (same tracking, dark foreground). The legacy `Verbatim · …` prefix is removed — the source name alone is enough.
- **No post number.** No "01/20". No carousel index. Ever.

### Logo usage on posts

The Daily Imaan logo is the profile avatar — viewers already see it next to every post in the feed. Repeating it on the post body is clutter and competes with sacred text. Treat it as off-canvas by default.

- **Cream post bodies (Templates 1, 2, 3 — Qur'an / Hadith / Du'a): no logo image.** Attribution lives entirely in the text footer.
- **Sage post body (Template 4 — Asma ul-Husna): no logo image.** Same footer rule.
- **App Feature posts (Template 5) only:** the logo *is* the subject — place `marketing/logo/master/daily-imaan-icon-1024.png` at ~55–65 % of the canvas width, centered above the headline. This is the only template where the logo image appears.
- **Never** use the logo as a corner watermark or stamp on Qur'an, Hadith, Du'a, or Asma ul-Husna posts.
- **Wordless 🌙 crescent emoji** may still appear in captions (sparingly), as before — but never inside the rendered post canvas.

### Theme assignment per template

| # | Template | Theme |
|---|---|---|
| 1 | Qur'an Ayah | Cream `#F2F0EC` |
| 2 | Hadith | Cream `#F2F0EC` |
| 3 | Du'a | Cream `#F2F0EC` |
| 4 | Asma ul-Husna | Sage `#1A6B4A` |
| 5 | App Feature | Sage `#1A6B4A` |

On sage backgrounds, foreground swaps to cream `#F2F0EC` and muted swaps to a soft sage `#A8C7B8`.

---

## 5. The 5 templates

### Template 1 — Qur'an Ayah (cream)

**Sub-label:** `QUR'AN · SURAH [NAME] [C:V]`
**Body fields:**
1. Arabic line (Amiri, ~70pt, with diacritics) — required
2. English translation (EB Garamond Regular, ~36pt, line-height 1.35) — verbatim Saheeh International. **Not italic.**
3. Source name appears in the centered footer block (e.g. `SAHEEH INTERNATIONAL`). No inline citation line is needed when the sub-label already carries the surah:ayah reference.

**Sourcing rule:** English text MUST match `quran.com/[surah]/[ayah]/saheeh-international` character-for-character. If unsure, omit the post.

**Length rule:** Choose ayāt where the Saheeh English is ≤ 200 characters. Long āyāt belong in the app, not on the feed.

**Allowed accent:** Gold rule between English and citation. No grade chip, no extra accents.

**Worked example:**
- Sub-label: `QUR'AN · SURAH ASH-SHARH 94:6`
- Arabic: `إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا`
- English: `For indeed, with hardship [will be] ease.`
- Citation: `Surah Ash-Sharh 94:6 · Saheeh International`

---

### Template 2 — Hadith (cream)

**Sub-label:** `HADITH · [COLLECTION] [BOOK:NUMBER]` (e.g. `HADITH · BUKHARI 1`)
**Body fields:**
1. English hadith text (EB Garamond Regular, ~36pt) — verbatim from the cited collection's standard translation. **Not italic.**
2. Narrator line (Inter, ~20pt, dark muted): `Narrated by [Companion]` — only if the narrator is essential context
3. **Grade chip** (Inter SemiBold, ~16pt, gold pill background, dark foreground): `SAHIH` / `HASAN` / `DA'IF` — required
4. Source name `SUNNAH.COM` lives in the centered footer block. The collection + reference is already in the sub-label.

**Sourcing rule:** Text MUST be verifiable at `sunnah.com/[collection slug]/[book]:[number]`. Use only the canonical Saheeh-grade chains unless explicitly publishing a Hasan-graded supplication.

**Length rule:** ≤ 240 characters of English. Longer hadith are paraphrased into the app's reading view, never the feed.

**Allowed accent:** Gold rule + gold grade chip. The grade chip is the second (and only other) place gold is allowed.

**Worked example:**
- Sub-label: `HADITH · SAHIH AL-BUKHARI`
- English: `Actions are but by intentions, and every man shall have only that which he intended.`
- Narrator: `Narrated by 'Umar ibn al-Khattab`
- Citation: `Sahih al-Bukhari 1`
- Grade chip: `SAHIH`

---

### Template 3 — Du'a (cream)

**Sub-label:** `DU'A · [OCCASION OR CATEGORY] · [REFERENCE]` (e.g. `DU'A · WHEN ANXIOUS · ALI 'IMRAN 3:173`)
**Body fields:**
1. Arabic du'a (Amiri, ~64pt, full diacritics) — required
2. Transliteration (EB Garamond Italic, ~26pt, dark muted) — **always required** (we like the transliteration line; it stays on every du'a post)
3. English translation (EB Garamond Regular, ~32pt) — verbatim. **Not italic.**
4. Source name appears in the centered footer block (e.g. `SAHEEH INTERNATIONAL` for Qur'anic du'as, `SUNNAH.COM` for Hisn al-Muslim du'as).

**Sourcing rule:** Du'a must be from the Qur'an or from `sunnah.com` — typically Hisn al-Muslim entries map to a hadith collection. Do not post du'as you cannot trace.

**Length rule:** Arabic ≤ 12 words. Longer du'as belong in the app.

**Allowed accent:** Gold rule between English and citation only.

**Worked example:**
- Sub-label: `DU'A · WHEN ANXIOUS`
- Arabic: `حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ`
- Transliteration: `Hasbunā Allāhu wa niʿma al-wakīl`
- English: `Sufficient for us is Allah, and [He is] the best Disposer of affairs.`
- Citation: `Surah Ali 'Imran 3:173 · Saheeh International`

---

### Template 4 — Asma ul-Husna (sage)

**Sub-label:** `NAMES OF ALLAH · [N] / 99` (e.g. `NAMES OF ALLAH · 14 / 99`)

**Body fields:**
1. Arabic name (Amiri, ~140pt, cream on sage, with diacritics) — e.g. `ٱلرَّحْمَٰنُ`
2. Transliteration (Inter SemiBold, ~32pt, +2pt tracking, soft cream): `Ar-Raḥmān`
3. English meaning (EB Garamond Regular, ~32pt, cream): `The Most Compassionate`. **Not italic.**
4. Footer source line (e.g. `SAHEEH INTERNATIONAL`) — no inline citation needed; if you want to anchor the name in a specific verse, add it as a small dark-muted line above the gold rule (Inter Medium ~20pt).

**Sourcing rule:** Use the canonical 99 Names list. The citation is a verse from the Qur'an where the name appears (Saheeh International).

**Allowed accent:** Gold rule between meaning and citation only.

**Worked example:**
- Sub-label: `NAMES OF ALLAH · 1 / 99`
- Arabic: `ٱللَّهُ`
- Transliteration: `Allāh`
- English: `The God — the only one worthy of worship.`
- Citation: `Surah Al-Fatihah 1:1 · Saheeh International`

---

### Template 5 — App Feature (sage) — **the only template with the logo on canvas**

This is the only template that may speak in the brand's own voice — because it is describing the app, not quoting scripture.

**Sub-label:** `THE APP · [FEATURE NAME]` (e.g. `THE APP · STREAK`, `THE APP · DUAS LIBRARY`, `THE APP · TAFSIR`, `THE APP · OFFLINE`)

**Body fields:**
1. **Logo image** (`marketing/logo/master/daily-imaan-icon-1024.png`) — centered, ~55–65 % of canvas width, sitting above the headline. This is the only template where the logo image appears on canvas.
2. Headline (Inter SemiBold, ~46pt, cream): one short sentence describing the feature — ≤ 60 chars
3. Sub-line (EB Garamond Italic, ~28pt, soft cream): one supporting sentence — ≤ 100 chars
4. Footer carries `@DAILYIMAANAPP` alone (the source line above it can read `A DAILY ISLAMIC COMPANION` or simply be omitted). **No "Download now" CTA.** No app-store badges in the body.

**Voice rules for this template only:**
- Lowercase-friendly, calm.
- Never say "boost", "level up", "unlock", "premium", "ad-free" (we have nothing to compare against — the absence is the product).
- Streak number, if shown, is a real-feeling small integer (e.g. 7, 14, 42), never 1000+.

**Worked example:**
- Sub-label: `THE APP · STREAK`
- Headline: `A gentle Streak. Never a guilt trip.`
- Sub-line: `One small habit, kept. That's the whole feature.`
- Phone mockup: shows `Streak: 42` with three checked deeds for today.

---

## 6. Caption voice (the text under the post)

Captions are short, lowercase-friendly, and end in stillness. Often one sentence. Never more than 3 short lines of body, plus one source attribution line, plus a hashtag line of ≤ 3 tags.

**Lift these patterns from existing posts:**

| Post | Caption |
|---|---|
| Surah Al-Baqarah 2:152 | `A single verse. A complete relationship.` `#dailyimaan #quran #saheeh` |
| Surah Ash-Sharh 94:6 | `Not after. With.` `#dailyimaan #patience #quran` |
| Surah An-Nisa 4:81 | `Hand it over.` `#dailyimaan #tawakkul #quran` |
| Surah Ar-Ra'd 13:28 | `When the noise rises, this is the way down.` `#dailyimaan #dhikr #quran` |
| Surah Az-Zumar 39:53 | `All. Not most.` `#dailyimaan #mercy #quran` |

**Hashtag bank** (max 3 per post):
`#dailyimaan #quran #saheeh #hadith #sunnah #dhikr #salah #imaan #tawakkul #sabr #dua #fatihah #ilm #quranquotes #verbatim #asmaulhusna`

**Caption don'ts:**
- No "Tag someone who needs this 💚"
- No "Save this for later"
- No "Double tap if you agree"
- No "Tafsir below ⬇️"
- No long thread of life lessons

---

## 7. Hard rules — never violate (LLM self-check before returning each post)

Before returning each post, the LLM must walk through this checklist and confirm each item. Include the checklist result in the Output Schema (`hard_rules_passed: true|false` plus a `notes` field for any item that needed adjustment).

1. **Verbatim** — body text matches the cited source character-for-character (or, for Reminder, matches the candidate bank entry / verification URL).
2. **Sourced** — citation field is filled with a real, traceable reference.
3. **On-template** — every required field for the chosen template is present; no extra fields are invented.
4. **Handle correct** — any reference to the IG handle uses `@dailyimaanapp` exactly. (The brand frame already places it in the footer, but if a caption mentions the handle, it must match.)
5. **No emoji in sacred text** — Arabic and English body fields contain zero emoji. Captions may use 🌙 sparingly; nothing else.
6. **No paraphrase, no commentary** — no "what this means" sentences appended to the body. The Du'a transliteration is allowed because it is mechanical, not interpretive.
7. **Length cap respected** — Qur'an Ayah English ≤ 200 chars; Hadith English ≤ 240 chars; Du'a Arabic ≤ 12 words; App Feature headline ≤ 60 chars.
8. **No pressure language** — captions and App Feature copy contain no urgency, guilt, streak-loss, countdowns, or premium-tier framing.

If any item fails, regenerate the post or skip it. Never relax a rule to ship a post.

---

## 8. Output Schema

Return one fenced markdown block per post, in this exact shape:

```yaml
post_id: <free string, e.g. "ayah-2-152">
template: <one of: quran-ayah | hadith | dua | asma-ul-husna | app-feature>
sub_label: <the all-caps tracked string for the top of the post>

body:
  arabic: <Arabic text with full diacritics, or null>
  transliteration: <Latin-script transliteration, or null>     # required for dua, optional otherwise
  english: <verbatim English text, or null>
  narrator: <"Narrated by ..." string, or null>                # hadith only
  grade: <SAHIH | HASAN | DA'IF, or null>                      # hadith only
  headline: <App Feature headline, or null>                    # app-feature only
  subline: <App Feature sub-line, or null>                     # app-feature only

footer_source: <UPPERCASE source name for the footer, e.g. "SAHEEH INTERNATIONAL", "SUNNAH.COM", or "A DAILY ISLAMIC COMPANION" for app-feature>
verify_url: <quran.com or sunnah.com URL — strongly recommended; required for any new fragment not pulled from a canonical reference>

caption: |
  <line 1 of caption>
  <optional line 2>
  <optional line 3>
hashtags: [<tag1>, <tag2>, <tag3>]      # max 3, leading "#" required

hard_rules_passed: <true | false>
notes: <free text — anything the human reviewer should know, or null>
```

**Worked output example:**

```yaml
post_id: ayah-94-6
template: quran-ayah
sub_label: "QUR'AN · SURAH ASH-SHARH 94:6"

body:
  arabic: "إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا"
  transliteration: null
  english: "For indeed, with hardship [will be] ease."
  narrator: null
  grade: null
  headline: null
  subline: null

footer_source: "SAHEEH INTERNATIONAL"
verify_url: "https://quran.com/94/6/saheeh-international"

caption: |
  Not after. With.
hashtags: ["#dailyimaan", "#patience", "#quran"]

hard_rules_passed: true
notes: null
```

---

## 9. One-line summary

> **Sourced. Quiet. Verbatim.**

If a post fails any of those three words, it does not ship.
