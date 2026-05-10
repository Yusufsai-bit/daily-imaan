# Daily Imaan — v1.1 (and beyond) Backlog

Captured here so v1.0 ships clean. Items are ordered by approximate impact-vs-effort. Re-prioritise based on what shows up in TestFlight feedback before committing to any of them.

---

## High impact / medium effort

### 1. Auto-scroll during recitation
The user's friend asked. Current API (alquran.cloud per-ayah audio) doesn't give us per-word timing. Two paths:

- **Path A (cheaper):** scroll to each ayah as a whole when its audio starts. ~½ day.
- **Path B (richer):** switch the audio source to a chapter-level recitation that ships with verse-timestamp metadata (Quran.com's Foundation API has these). Highlight active ayah + scroll to it. ~2 days.

Recommend Path A first; ship Path B in v1.2.

### 2. Memorisation tracker
The user's friend asked. Real new feature: pick "today's ayah to memorise", track per-ayah progress (heard / repeated / recalled), keep a running "memorised" set. Likely ~3 days end-to-end:

- Data model: `MemorisedSet`, `MemorisationDay { surahId, ayahNumber, attempts, recalled }`
- New screen `/memorise` with daily prompt
- Repeat-N-times audio playback for the chosen ayah
- "Test myself" mode where Arabic is shown blurred and revealed on tap
- Surface in Me tab as "X ayat memorised" alongside Khatam progress

### 3. Multiple translations
Currently Saheeh International only. Add Yusuf Ali, Pickthall, Mufti Taqi Usmani — 3 most common.

- Architecture: lazy-load translation packs as separate modules (each ~2 MB)
- Settings → Translation picker
- Surah detail + home daily ayah read from chosen translation
- Storage: bundle Saheeh; download others on demand and cache

~2–3 days. High Muslim Pro parity gain.

### 4. Multiple tafsirs
Currently Ibn Kathir abridged only. Quran.com Foundation API has Tabari, Saadi, Qurtubi for English readers.

- Settings → Tafsir picker (default Ibn Kathir)
- `useTafsir(surah, ayah, enabled, tafsirId)` extends signature; cache key includes the ID
- ~1 day

### 5. Ramadan / Iftar countdown
Surface on home during Ramadan. Time until next iftar (Maghrib) and time until next suhoor (Fajr) when within Ramadan window. Hijri calendar integration is already there. ~1 day.

### 6. Mosque finder
Muslim Pro has it. Use the device's location + a nearby-place API (Google Places or OpenStreetMap Overpass). Show a list + map view. Shows distance + walking time.

- Privacy concern: shares user's location with a third party. Document in privacy policy.
- ~3–4 days including map UI

### 7. iOS home-screen widget
Already have a stub (`@/modules/DailyImaanWidget`) but no native target. The Android widget is shipped. Use `@bacons/apple-targets` (in deps already).

- Size variants: small (today's ayah Arabic), medium (Arabic + English), large (with audio play deep-link)
- ~2 days for native target plumbing

---

## High impact / high effort

### 8. Multi-language UI
Muslim Pro has 14 languages. Top 4 to start: Arabic, Urdu, Indonesian, Turkish.

- Use `expo-localization` + `react-i18next`
- All UI strings extracted from JSX into a `locales/{lang}/common.json`
- Brand-tested copy review per language
- RTL flip for Arabic + Urdu (React Native handles this if `I18nManager.forceRTL(true)` is set, but every layout needs an audit for RTL correctness)

~2 weeks of work end-to-end. Probably v1.2.

### 9. Full khatam plan
Beyond passive khatam progress: a structured 30-day, 60-day, 365-day reading plan with daily goals and gentle accountability. Builds on the streak system already in v1.0.

- New AppContext field: `readingPlan: { type: '30day' | '60day' | '365day', startDate, dailyTarget }`
- Daily goal surfacing on home
- ~2–3 days

### 10. Audio download for offline
Bundle nothing today. Adding "Download surah audio for offline" lets users grab a surah's full recitation. Storage cost is real (Al-Fatihah ~30s, Al-Baqarah ~2hrs).

- Settings → Manage downloads with per-surah size + delete
- ~2 days

---

## Smaller polish wins (any of these is half a day or less)

- Translation switcher in surah header (uses #3 above)
- Reciter quick-switch in surah (no need to detour through Settings)
- Repeat ayah N times (precursor to memorisation)
- Juz / Hizb markers in surah detail
- Page-number markers (Mushaf-style)
- Copy-text button on each ayah and hadith
- Bookmark notes / personal annotations
- Hadith bookmarks tab (currently bookmarks screen only shows ayat)
- "Continue from here" deep-link from home → resume at last position with scroll offset
- Search across Quran (not just surah list)
- Asma ul Husna detail page per name (etymology, Quran references)
- Weekly summary email / in-app review ("This week you read X, kept your streak at Y")
- Tahajjud window indicator
- Sajdah verse list screen (companion to the per-verse badge already shipped in v1.0)
- Themed daily packs (Sabr, Gratitude, Family, Rizq) — friend asked for the dhikr equivalent
- Expandable / customisable dhikr categories — friend asked

---

## Out of scope (probably never)

- Halal restaurant finder — content moderation cost, regulatory risk per region, third-party API dependency
- In-app purchases / premium tier — explicit free-forever brand promise
- Social feed / community — moderation cost; against the "quiet, private practice" thesis
- Donation flow (Zakat / Sadaqah) — separates the app from worship; needs partner ecosystem; legal complexity per country

These aren't dismissals — they're explicit choices. Revisit if user demand and ops capacity both materialise.
