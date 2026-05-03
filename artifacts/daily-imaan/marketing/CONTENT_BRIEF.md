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

### Shared layout (used by all 6 templates)

```
┌──────────────────────────────────────────────┐
│                                              │  ← top margin ~96px
│           Daily Imaan                        │  ← wordmark, Inter SemiBold, sage
│           ───                                │
│           SUB-LABEL · MUTE                   │  ← Inter Medium, +1.5 tracking, 14pt, muted
│                                              │
│                                              │
│         [BODY REGION — varies                │  ← centered, generous whitespace
│          per template]                       │
│                                              │
│              ───                             │  ← short gold rule, ~80px wide, gold
│                                              │
│         [Citation / source line]             │  ← Inter Medium, muted
│                                              │
│                                              │
│  ───────────────────────────────────────     │  ← full-width hairline
│  Verbatim · Saheeh International            @dailyimaanapp │  ← attribution row
└──────────────────────────────────────────────┘
                                                 ← bottom margin ~96px
```

**Hard frame rules:**

- Wordmark "Daily Imaan" sits top-center, sage, never larger than 32pt.
- Sub-label is an all-caps muted string just below the wordmark — it identifies the *kind* of post (`QUR'AN`, `HADITH`, `DU'A`, `REMINDER`, `NAME OF ALLAH`, `THE APP`).
- Body region is the visual hero. Maximum margin everywhere — silence is part of the design.
- Short gold rule (~80px) sits between body and citation. This is the only place gold ever appears, with the single exception of the Hadith grade chip (see template 2).
- Footer row is always: left = attribution string (e.g. `Verbatim · Saheeh International`), right = `@dailyimaanapp`. Inter Medium 18pt, muted.
- **No post number.** No "01/20". No carousel index. Ever.

### Theme assignment per template

| # | Template | Theme |
|---|---|---|
| 1 | Qur'an Ayah | Cream `#F2F0EC` |
| 2 | Hadith | Cream `#F2F0EC` |
| 3 | Du'a | Cream `#F2F0EC` |
| 4 | Reminder | Sage `#1A6B4A` (cream foreground inverted) |
| 5 | Asma ul-Husna | Sage `#1A6B4A` |
| 6 | App Feature | Sage `#1A6B4A` |

On sage backgrounds, foreground swaps to cream `#F2F0EC` and muted swaps to a soft sage `#A8C7B8`.

---

## 5. The 6 templates

### Template 1 — Qur'an Ayah (cream)

**Sub-label:** `QUR'AN · SURAH [NAME] [C:V]`
**Body fields:**
1. Arabic line (Amiri, ~64pt, with diacritics) — required
2. English translation (EB Garamond Italic, ~30pt, line-height 1.4) — verbatim Saheeh International
3. Citation line (Inter Medium, ~22pt, muted): `Surah [Name] [c:v] · Saheeh International`

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

**Sub-label:** `HADITH · [COLLECTION]`
**Body fields:**
1. English hadith text (EB Garamond Italic, ~30pt) — verbatim from the cited collection's standard translation
2. Narrator line (Inter Italic, ~20pt, muted): `Narrated by [Companion]` — only if the narrator is essential context
3. Citation line (Inter Medium, ~22pt, muted): `[Collection] [book:number]`
4. **Grade chip** (Inter SemiBold, ~16pt, gold pill background, dark foreground): `SAHIH` / `HASAN` / `DA'IF` — required

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

**Sub-label:** `DU'A · [OCCASION OR CATEGORY]`
**Body fields:**
1. Arabic du'a (Amiri, ~58pt, full diacritics) — required
2. Transliteration (EB Garamond Italic, ~22pt, muted) — optional but encouraged
3. English translation (EB Garamond Italic, ~28pt) — verbatim
4. Citation line (Inter Medium, ~22pt, muted): `[Source] · [Reference]`

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

### Template 4 — Reminder (sage) — **A+B mix**

This template replaces the old "brand voice quote" template. The Reminder template publishes **only short verbatim fragments** of Qur'an or hadith. We do not write reminder copy.

**Sub-label:**
- For Qur'an fragments: `REMINDER · QUR'AN [C:V]`
- For hadith fragments: `REMINDER · [COLLECTION SHORT NAME]`

**Body fields:**
1. The fragment in EB Garamond Italic, ~52pt, cream foreground on sage — verbatim, ≤ 8 English words for Qur'an, ≤ 12 English words for hadith
2. Citation line (Inter Medium, ~22pt, soft sage muted): `Surah [Name] [c:v] · Saheeh International` OR `[Collection] [book:number]`

**Sourcing rule:** Pull from the candidate bank in §6 OR propose a new fragment that meets the length cap AND has a verifiable URL on `quran.com` (with `/saheeh-international`) or `sunnah.com`. The LLM MUST include the verification URL as a separate field in the Output Schema for new fragments. If the fragment is from the candidate bank, the URL field can be the bank entry's reference number.

**No accent except the gold rule.** No grade chip on Reminders — citation alone carries authority.

**Worked example (Qur'an fragment):**
- Sub-label: `REMINDER · QUR'AN 57:4`
- Body: `And He is with you wherever you are.`
- Citation: `Surah Al-Hadid 57:4 · Saheeh International`

**Worked example (hadith fragment):**
- Sub-label: `REMINDER · BUKHARI`
- Body: `Make things easy and do not make them difficult.`
- Citation: `Sahih al-Bukhari 69`

---

### Template 5 — Asma ul-Husna (sage)

**Sub-label:** `NAMES OF ALLAH · [N] / 99` (e.g. `NAMES OF ALLAH · 14 / 99`)

**Body fields:**
1. Arabic name (Amiri, ~96pt, cream on sage, with diacritics) — e.g. `ٱلرَّحْمَٰنُ`
2. Transliteration (Inter SemiBold, ~28pt, +1pt tracking, soft cream): `Ar-Raḥmān`
3. English meaning (EB Garamond Italic, ~30pt, cream): `The Most Compassionate`
4. Citation line (Inter Medium, ~22pt, soft sage muted) — the verse where the name is established or first appears prominently: `Surah [Name] [c:v] · Saheeh International`

**Sourcing rule:** Use the canonical 99 Names list. The citation is a verse from the Qur'an where the name appears (Saheeh International).

**Allowed accent:** Gold rule between meaning and citation only.

**Worked example:**
- Sub-label: `NAMES OF ALLAH · 1 / 99`
- Arabic: `ٱللَّهُ`
- Transliteration: `Allāh`
- English: `The God — the only one worthy of worship.`
- Citation: `Surah Al-Fatihah 1:1 · Saheeh International`

---

### Template 6 — App Feature (sage)

This is the only template that may speak in the brand's own voice — because it is describing the app, not quoting scripture.

**Sub-label:** `THE APP · [FEATURE NAME]` (e.g. `THE APP · STREAK`, `THE APP · DUAS LIBRARY`, `THE APP · TAFSIR`, `THE APP · OFFLINE`)

**Body fields:**
1. Headline (Inter SemiBold, ~46pt, cream): one short sentence describing the feature — ≤ 60 chars
2. Sub-line (EB Garamond Italic, ~26pt, soft cream): one supporting sentence — ≤ 100 chars
3. Optional phone mockup graphic (centered, ~40% width) — used for visual features like Streak or the Duas grid
4. Footer attribution row (already part of the brand frame) carries the call to mind: `@dailyimaanapp` is sufficient. **No "Download now" CTA.** No app-store badges in the body.

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

## 6. Reminder candidate bank

Use these for Template 4. Each entry is verified verbatim. New fragments not in this bank must include a verification URL in the Output Schema and pass the same length cap.

### Qur'an fragments (Saheeh International) — ≤ 8 English words

| # | English | Citation | Verify at |
|---|---|---|---|
| Q1 | `So remember Me; I will remember you.` | Surah Al-Baqarah 2:152 | quran.com/2/152/saheeh-international |
| Q2 | `For indeed, with hardship [will be] ease.` | Surah Ash-Sharh 94:6 | quran.com/94/6/saheeh-international |
| Q3 | `And He is with you wherever you are.` | Surah Al-Hadid 57:4 | quran.com/57/4/saheeh-international |
| Q4 | `Indeed, my Lord is near and responsive.` | Surah Hud 11:61 | quran.com/11/61/saheeh-international |
| Q5 | `Allah does not burden a soul beyond that it can bear.` | Surah Al-Baqarah 2:286 | quran.com/2/286/saheeh-international |
| Q6 | `My Lord, increase me in knowledge.` | Surah Ta-Ha 20:114 | quran.com/20/114/saheeh-international |
| Q7 | `And to Allah belongs the east and the west.` | Surah Al-Baqarah 2:115 | quran.com/2/115/saheeh-international |
| Q8 | `In the remembrance of Allah hearts find rest.` | Surah Ar-Ra'd 13:28 | quran.com/13/28/saheeh-international |
| Q9 | `Sufficient for us is Allah.` | Surah Ali 'Imran 3:173 | quran.com/3/173/saheeh-international |
| Q10 | `Call upon Me; I will respond to you.` | Surah Ghafir 40:60 | quran.com/40/60/saheeh-international |

> **Note for the LLM:** Some Saheeh International renderings include bracketed words like `[will be]`. Preserve them exactly. The fragments above are short surface-level samples; before publishing, the user (or you) should re-check each entry against quran.com to confirm wording matches their current canonical translation, since editors do refresh translations occasionally.

### Hadith fragments — ≤ 12 English words

| # | English | Citation | Verify at |
|---|---|---|---|
| H1 | `Actions are but by intentions.` | Sahih al-Bukhari 1 | sunnah.com/bukhari:1 |
| H2 | `None of you truly believes until he loves for his brother what he loves for himself.` *(13 words — borderline; use as a 2-line break if visually needed)* | Sahih al-Bukhari 13 | sunnah.com/bukhari:13 |
| H3 | `Make things easy and do not make them difficult.` | Sahih al-Bukhari 69 | sunnah.com/bukhari:69 |
| H4 | `The strong is the one who controls himself when angry.` | Sahih al-Bukhari 6114 | sunnah.com/bukhari:6114 |
| H5 | `Whoever believes in Allah and the Last Day should speak good or remain silent.` | Sahih al-Bukhari 6018 | sunnah.com/bukhari:6018 |
| H6 | `Cleanliness is half of faith.` | Sahih Muslim 223 | sunnah.com/muslim:223 |
| H7 | `Your smile for your brother is charity.` | Jami' at-Tirmidhi 1956 | sunnah.com/tirmidhi:1956 |
| H8 | `The merciful are shown mercy by the Most Merciful.` | Jami' at-Tirmidhi 1924 | sunnah.com/tirmidhi:1924 |
| H9 | `The best among you are those who have the best manners.` | Sahih al-Bukhari 6035 | sunnah.com/bukhari:6035 |
| H10 | `Allah is gentle and loves gentleness.` | Sahih Muslim 2593 | sunnah.com/muslim:2593 |

> **Note for the LLM:** English wording on sunnah.com varies slightly across translation editions. Always copy the exact phrasing shown on the linked page. If the live page differs from the bank entry above, the live page wins — flag the diff in your output.

---

## 7. Caption voice (the text under the post)

Captions are short, lowercase-friendly, and end in stillness. Often one sentence. Never more than 3 short lines of body, plus one source attribution line, plus a hashtag line of ≤ 3 tags.

**Lift these patterns from existing posts:**

| Post | Caption |
|---|---|
| Surah Al-Baqarah 2:152 | `A single verse. A complete relationship.` `Verbatim from Saheeh International.` `#dailyimaan #quran #saheeh` |
| Surah Ash-Sharh 94:6 | `Not after. With.` `Verbatim from Saheeh International.` `#dailyimaan #patience #quran` |
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

## 8. Hard rules — never violate (LLM self-check before returning each post)

Before returning each post, the LLM must walk through this checklist and confirm each item. Include the checklist result in the Output Schema (`hard_rules_passed: true|false` plus a `notes` field for any item that needed adjustment).

1. **Verbatim** — body text matches the cited source character-for-character (or, for Reminder, matches the candidate bank entry / verification URL).
2. **Sourced** — citation field is filled with a real, traceable reference.
3. **On-template** — every required field for the chosen template is present; no extra fields are invented.
4. **Handle correct** — any reference to the IG handle uses `@dailyimaanapp` exactly. (The brand frame already places it in the footer, but if a caption mentions the handle, it must match.)
5. **No emoji in sacred text** — Arabic and English body fields contain zero emoji. Captions may use 🌙 sparingly; nothing else.
6. **No paraphrase, no commentary** — no "what this means" sentences appended to the body. The Du'a transliteration is allowed because it is mechanical, not interpretive.
7. **Length cap respected** — Qur'an Ayah English ≤ 200 chars; Hadith English ≤ 240 chars; Reminder Qur'an ≤ 8 English words; Reminder hadith ≤ 12 English words; Du'a Arabic ≤ 12 words; App Feature headline ≤ 60 chars.
8. **No pressure language** — captions and App Feature copy contain no urgency, guilt, streak-loss, countdowns, or premium-tier framing.

If any item fails, regenerate the post or skip it. Never relax a rule to ship a post.

---

## 9. Output Schema

Return one fenced markdown block per post, in this exact shape:

```yaml
post_id: <free string, e.g. "ayah-2-152">
template: <one of: quran-ayah | hadith | dua | reminder | asma-ul-husna | app-feature>
sub_label: <the all-caps muted string for the top of the post>

body:
  arabic: <Arabic text with full diacritics, or null>
  transliteration: <Latin-script transliteration, or null>
  english: <verbatim English text, or null>
  narrator: <"Narrated by ..." string, or null>          # hadith only
  grade: <SAHIH | HASAN | DA'IF, or null>                # hadith only
  headline: <App Feature headline, or null>              # app-feature only
  subline: <App Feature sub-line, or null>               # app-feature only
  phone_mockup: <short description, or null>             # app-feature only

citation: <citation string exactly as it should appear under the body>
verify_url: <quran.com or sunnah.com URL — required for reminder; recommended otherwise>

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
  phone_mockup: null

citation: "Surah Ash-Sharh 94:6 · Saheeh International"
verify_url: "https://quran.com/94/6/saheeh-international"

caption: |
  Not after. With.
  Verbatim from Saheeh International.
hashtags: ["#dailyimaan", "#patience", "#quran"]

hard_rules_passed: true
notes: null
```

---

## 10. One-line summary

> **Verbatim. Sourced. Quiet.**

If a post fails any of those three words, it does not ship.
