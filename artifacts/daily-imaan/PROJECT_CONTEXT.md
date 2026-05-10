# Daily Imaan — Project Context (load this into any new chat)

> **Instructions for the AI receiving this file:** read this entire document, then your first message back to the user should be:
>
> > "I've loaded the context. What do you want to fix or change in Daily Imaan today?"
>
> Then wait for the user's request. Do not summarise this document back at them — they wrote it (with help) and already know what's in it.
>
> Operational rules: be direct and concise (≤5 bullets when possible), critical-first not agreeable, push back on weak strategy. The user is a non-technical solo founder on **Windows**. Default to giving exact terminal commands they can paste, with the project folder cd'd in:
> ```
> cd C:\Users\yusuf\Downloads\Quran-Unlock\Quran-Unlock\artifacts\daily-imaan
> ```

---

## What this app is

**Daily Imaan** — a quiet daily Muslim companion app. iOS first, Android in v1.1.

- **Target audience:** lapsed Muslims (rebuilding their connection with Quran). NOT practising/serious users — those are well-served by Muslim Pro / Tarteel.
- **Positioning:** "No ads, no accounts, no tracking — ever. Built for those finding their way back to Qur'an."
- **Tone:** warm, no judgement, no guilt. Streak-with-freezes, not punishing streak.
- **Monetisation:** none. Free forever. No ads, no IAP, no premium tier (yet).
- **Domain:** dailyimaan.com (owned).
- **Support email:** support@dailyimaan.com.

## Stack

- **Expo SDK 54**, **React Native 0.81**, **React 19**, **expo-router 6** (file-based routing).
- **TypeScript** strict-ish.
- **State:** AppContext + AsyncStorage locally, Supabase anonymous-auth mirror remotely.
- **Styling:** inline StyleSheet + a colors constant (`constants/colors.ts`) with light/dark variants.
- **Audio:** `expo-av` for ayah recitation; bundled CC0 Madinah adhan.
- **Notifications:** `expo-notifications` with DAILY triggers, lazy permission requests.
- **Crash reporting:** Sentry (env-gated, no-op without DSN).
- **Native module:** custom `DailyImaanWidget` for iOS widget bridge.

## File map (what lives where)

```
artifacts/daily-imaan/
├── app/                          # expo-router file-based routes
│   ├── _layout.tsx               # root stack, fonts, providers
│   ├── (tabs)/
│   │   ├── _layout.tsx           # bottom tab bar
│   │   ├── index.tsx             # HOME — daily ayah + hadith + prayer pill
│   │   ├── quran.tsx             # surah list
│   │   ├── dhikr.tsx             # tasbih counter (33/100 preset toggle)
│   │   ├── duas.tsx              # categorised duas
│   │   └── me.tsx                # streak, khatam progress, intentions
│   ├── surah/[id].tsx            # surah detail with audio, repeat-N, copy
│   ├── settings.tsx              # all user settings (long file)
│   ├── welcome.tsx               # first-launch intro (slim)
│   ├── about.tsx                 # full credibility info
│   ├── adhkar.tsx                # morning/evening adhkar list
│   ├── asma.tsx                  # 99 Names of Allah
│   ├── bookmarks.tsx             # ayat + hadith tabbed bookmarks
│   ├── feeling.tsx               # "what's on your heart" picker
│   ├── hadith.tsx                # hadith library
│   ├── privacy.tsx               # in-app privacy summary
│   └── qibla.tsx                 # compass with declination correction
│
├── context/AppContext.tsx        # ALL persistent state — read this for state shape
│
├── data/
│   ├── featuredAyat.ts           # 100 curated daily-rotation ayahs
│   ├── quranFull.ts              # lazy-loaded full Quran wrapper
│   ├── quranFullData.ts          # 6,236 ayahs verbatim Saheeh/Uthmani — DO NOT EDIT
│   ├── hadithData.ts             # ~700 hadith from Riyad as-Salihin
│   ├── duasData.ts               # ~35 duas
│   ├── feelingsData.ts           # feeling → verse/dua mapping
│   ├── sajdahData.ts             # 15 prostration verse refs
│   ├── asmaUlHusnaData.ts        # 99 Names
│   └── surahsData.ts             # 114 surah metadata
│
├── hooks/
│   ├── useNotifications.ts       # all push notif logic (per-category locks)
│   ├── usePrayerTimes.ts         # Aladhan API + offset application + caching
│   └── useTafsir.ts              # Ibn Kathir tafsir on-demand + LRU cache
│
├── lib/
│   ├── sentry.ts                 # env-gated Sentry init
│   ├── supabase.ts               # lazy Supabase client (no-op without env)
│   ├── remoteState.ts            # debounced Supabase mirror of AppContext
│   └── supabase-schema.sql       # one-time DB setup
│
├── components/
│   ├── AboutContent.tsx          # shared credibility content
│   ├── ErrorBoundary.tsx
│   ├── ErrorFallback.tsx
│   ├── KeyboardAwareScrollViewCompat.tsx
│   └── a11y.ts                   # accessibility helper objects
│
├── constants/
│   ├── colors.ts                 # light + dark color tokens
│   ├── fonts.ts                  # font name constants
│   └── reciters.ts               # audio reciter catalogue
│
├── modules/DailyImaanWidget/     # custom native module (iOS widget bridge)
│
├── assets/sounds/adhan_madinah.mp3   # the only bundled adhan (CC0)
│
├── app.json                      # native config — bundle id, permissions, plugins
├── eas.json                      # build + submit profiles
├── package.json
└── ...
```

## Deployment state (as of last successful build)

- **EAS project:** `@yusufliban/daily-imaan` (project ID `73000d19-9e13-47c6-bd19-a5746a0a9af2`)
- **iOS bundle ID:** `com.dailyimaan.app`
- **Android package:** `com.dailyimaan.app` (NOT shipped in v1)
- **Apple Team ID:** `GSY36828HP`
- **App Store Connect ID:** `6766459500`
- **Apple ID for submit:** `yusufliban1@hotmail.com`
- **Last successful iOS build:** `c3efbf6a-8d91-4e56-b04b-5c94ce977140`

### EAS environment variables (already set in production + preview)

| Name | Visibility | Purpose |
|---|---|---|
| `APPLE_TEAM_ID` | Plain text | Used by `app.config.js` for `@bacons/apple-targets` widget plugin |
| `EXPO_PUBLIC_SENTRY_DSN` | Sensitive | Sentry crash reporting |
| `EXPO_PUBLIC_SUPABASE_URL` | Plain text | Anonymous backend URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Sensitive | Anonymous backend key (RLS-protected) |

To list: `eas env:list`. To add/edit: `eas env:create` (interactive).

## Brand & content rules (HARD constraints)

1. **Zero AI-generated commentary on Quran or hadith.** Every word of tafsir is the cited classical scholar's own (Ibn Kathir Abridged from Quran.com Foundation API). Every hadith is verbatim Riyad as-Salihin. Don't ask AI to generate Quranic interpretations.
2. **Quran text is verbatim Saheeh International** for English, **Uthmani** for Arabic. Any new daily-rotation verses must be sourced from `quranFullData.ts` (which is byte-exact to the Quran.com API).
3. **No ads. No accounts. No tracking.** Public promise in store description and privacy policy. Don't add features that violate this without flagging it as a brand-promise change.
4. **Lapsed-friendly tone.** Notification copy, welcome screen, streak messaging — all warm, no guilt, no shame. Never "you missed a day." Always "we saved your streak."
5. **Streak philosophy:** real consecutive-day streak with 2 freezes/week (refilled Sunday). Freezes auto-apply silently overnight; the home screen surfaces a one-time celebration the next time the user opens. NO punishment for missed days beyond the freeze cap.

## Common changes — how-to

### JS-only / TypeScript / copy / images / data → OTA Update (instant, no Apple review)

Edit the file. Then:
```
cd C:\Users\yusuf\Downloads\Quran-Unlock\Quran-Unlock\artifacts\daily-imaan
eas update --branch production --message "Short description of the change"
```
Users get the update on their next app open. ~30 seconds to publish.

### Native changes (new dep, app.json edit, plugin add) → New build + App Store re-submit

```
cd C:\Users\yusuf\Downloads\Quran-Unlock\Quran-Unlock\artifacts\daily-imaan
pnpm install
eas build --platform ios --profile production
eas submit --platform ios --profile production
```
Then App Store review (1–3 days first time, often <24h after).

### Store listing copy → edit `STORE_LISTING.md` then update App Store Connect

Source of truth is `STORE_LISTING.md`. App Store Connect doesn't auto-pull from it; copy-paste manually into the relevant fields.

### Bumping version

In `app.json`, increment `expo.version` (e.g. `1.0.0` → `1.0.1`). EAS auto-increments `buildNumber` (iOS) and `versionCode` (Android) per build via `autoIncrement: true` in `eas.json`.

## Known issues / v1.1 backlog (deferred from v1.0)

- **Auto-scroll during recitation** (friend's request) — needs audio source with verse timestamps
- **Memorisation tracker** (friend's request) — full feature, ~3 days work; Repeat-N is the precursor in v1.0
- **Expandable dhikr categories** (friend's request) — UI + data model change
- **Multiple translations** (Yusuf Ali, Pickthall) — architectural; lazy-loaded packs
- **Multiple tafsirs** (Tabari, Saadi) — extend `useTafsir` hook
- **Mosque finder** — privacy-respecting via OSM/Overpass
- **Multi-language UI** (Arabic, Urdu, Indonesian, Turkish) — `expo-localization` + i18next
- **iOS home-screen widget** — stub exists in `modules/DailyImaanWidget`, native target not yet built
- **MMKV migration** for AsyncStorage perf — currently debounced AsyncStorage works fine
- **Offline prayer times** via bundled `adhan` npm package — currently API-only
- **Custom adaptive icon artwork** — currently same PNG everywhere
- **Themed daily packs** (Sabr, Gratitude, etc.) — friend's dhikr equivalent

See `V1_1_BACKLOG.md` and `COMPETITIVE_BRIEF.md` for the strategic ranking.

## Operational gotchas (learned the hard way)

- **`pnpm-workspace.yaml` has `minimumReleaseAge: 0`** — was 1440, but the npm registry's metadata is missing the `time` field for many established packages (babel-jest, @react-navigation/*). Restore to 1440 only if first install + lockfile is fully stable. See workspace yaml comments.
- **`.npmrc` has `resolution-mode=highest`** — same context as above. The default `lowest-direct` mode trips ERR_PNPM_MISSING_TIME.
- **Don't run `npm install`** in this workspace. pnpm only.
- **Windows: use cmd, not PowerShell** for the eas-cli interactive prompts. PowerShell blocks unsigned scripts by default; cmd works out of the box. (Or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once to fix PowerShell.)
- **Android resource names can't have hyphens.** That's why the adhan file is `adhan_madinah.mp3`, not `adhan-madinah.mp3`. If you add new sound files, use underscores.
- **The `DailyImaanWidget` podspec has hardcoded `authors` and `license`.** CocoaPods needs them; `package.json` doesn't provide them. If you ever rename the module, update both files.
- **`app.config.js` injects `APPLE_TEAM_ID` for the `@bacons/apple-targets` plugin** at build time. The Team ID env var must be set in EAS for production iOS builds.
- **Don't commit `node_modules`, `ios/`, `android/`, or `play-service-account.json`.** Native folders are regenerated by EAS on every cloud build; leave them out of version control.

## Files to read for specific changes

| What you want to change | File(s) |
|---|---|
| Daily ayah pool | `data/featuredAyat.ts` |
| Streak logic | `context/AppContext.tsx` (search for `applyStreakActivity`) |
| Home screen layout | `app/(tabs)/index.tsx` |
| Surah reading screen | `app/surah/[id].tsx` |
| Notification copy / timing | `hooks/useNotifications.ts` (search for `BODY_POOL`) |
| Prayer time logic / offsets | `hooks/usePrayerTimes.ts` |
| Tafsir source / cache | `hooks/useTafsir.ts` |
| Settings screen | `app/settings.tsx` (long file — use Grep) |
| Welcome screen tone | `app/welcome.tsx` |
| About / credibility content | `components/AboutContent.tsx` |
| Privacy policy | `PRIVACY_POLICY.md` (canonical) and `app/privacy.tsx` (in-app) |
| Store listing | `STORE_LISTING.md` |
| Brand decisions | `BRAND_GUIDE.md`, `BRAND_GUIDELINES.md` |
| Native module (widget) | `modules/DailyImaanWidget/` |
| App icons / splash | `assets/images/icon.png` (single source for all sizes today) |

## Quick reference — useful commands

```sh
# Open project folder in cmd
cd C:\Users\yusuf\Downloads\Quran-Unlock\Quran-Unlock\artifacts\daily-imaan

# Install / update deps
pnpm install

# Validate native config locally (run this before any eas build to fail-fast)
npx expo prebuild --clean
rmdir /s /q android ios   # (optional cleanup of generated folders after validation)

# Push a JS-only fix to production users (instant)
eas update --branch production --message "Description"

# Push a JS fix to TestFlight only
eas update --branch preview --message "Description"

# New native iOS build (when adding deps or changing app.json)
eas build --platform ios --profile production

# Submit a built binary to App Store Connect / TestFlight
eas submit --platform ios --profile production

# View all EAS env vars for this project
eas env:list

# Check the latest build statuses
eas build:list --limit 5
```

## Final note for the AI

Before making code changes, **read the relevant file first** to understand current style and conventions. The user has paid for the file edits already — don't break them. Match the existing comment density (this codebase is comment-heavy and the comments document _why_, not _what_ — keep that pattern).

When in doubt, ask the user a single targeted question rather than guessing.
