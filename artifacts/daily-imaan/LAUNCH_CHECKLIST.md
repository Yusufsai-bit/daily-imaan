# Daily Imaan — Launch Checklist

Everything in **CODE-SIDE** is already done. Everything in **YOUR ACTION** requires you to log in to a third party, sign something, or pay a fee.

Work through them top to bottom.

---

## CODE-SIDE — already done ✅

- [x] `app.json` hardened with iOS bundleIdentifier (`com.dailyimaan.app`), Android package (`com.dailyimaan.app`), iOS Info.plist usage descriptions (location + motion), `ITSAppUsesNonExemptEncryption: false`, Android permissions array, Android adaptive icon, version + buildNumber/versionCode.
- [x] Splash screen configured (single asset; v1.1 should add a purpose-built splash mark).
- [x] `eas.json` with development / preview / production build profiles + submit profiles.
- [x] Native time picker on iOS / Android (with explicit Cancel/Done on iOS).
- [x] Accessibility roles, labels, hints, decorative-icon flags, font-scaling caps across Home / Settings / Me / Privacy.
- [x] Sentry SDK installed (`@sentry/react-native ~7.2.0`) and wired into the app's `ErrorBoundary`. No-op when `EXPO_PUBLIC_SENTRY_DSN` is unset, so the app runs fine without it.
- [x] Privacy Policy: in-app screen at `/privacy`, linked from Settings → Privacy & Legal, plus a hostable `PRIVACY_POLICY.md` at the project root.
- [x] Store listing copy ready in `STORE_LISTING.md`.
- [x] Privacy nutrition labels (Apple) + Data safety form (Google) reference in `PRIVACY_NUTRITION_LABELS.md`.
- [x] Bundled adhan audio: `adhan_madinah.mp3` (CC0) registered in `app.json`'s `expo-notifications` plugin, wired into AppContext (`adhanSound` setting), iOS sound field, and Android per-channel routing in `useNotifications.ts`. Attribution in `assets/sounds/README.md` and the in-app About content card. (The Makkah option was removed pre-submission — truncated file + wrong attribution; see the sounds README.)
- [x] Real consecutive-day streak with weekly freeze grace days (2 freezes per week, refilled each Sunday). Auto-applies to bridge missed days; surfaces a one-time celebratory banner on the home screen when a freeze rescues a streak.
- [x] DST-safe daily ayah picker (uses calendar-day arithmetic, not millisecond-difference).
- [x] Supabase remote-state mirror (anonymous-auth backed) wired into AppContext. **No-op when env vars are unset** — the app works offline-only out of the box. See `lib/supabase.ts` for the 5-minute setup if you want streaks to survive reinstalls.
- [x] Anonymous session stored in the iOS Keychain / Android Keystore (chunked, via `expo-secure-store`) so it survives uninstall→reinstall — this is what makes "streak survives reinstalls" literally true. Sessions written by builds ≤12 into AsyncStorage migrate automatically on first read.
- [x] Cloud backup toggle in Settings → Privacy & Legal. Turning it off deletes the server-side row (matches the privacy policy's promise).
- [x] Asr juristic school picker (Standard / Hanafi) in Settings — exposes the `prayerSchool` state + AlAdhan `school` param that were already wired.
- [x] AbortController + 10s timeout on every outbound `fetch()` (tafsir, prayer-times, prewarm).
- [x] Audio cleanup race fixed (ref-based unmount cleanup).
- [x] React Compiler beta DISABLED for v1 stability. Re-enable in v1.1 after the boring path ships.

---

## YOUR ACTION — accounts and credentials

### A1. Apple Developer Program — $99/year
1. Sign up at <https://developer.apple.com/programs/>. 24–48 hours for individual approval, longer for organizations.
2. Once enrolled, find your **Team ID** at <https://developer.apple.com/account#MembershipDetailsCard>. It is exactly 10 alphanumeric characters.
3. In Apple Developer → Certificates, Identifiers & Profiles → Identifiers, register a new App ID with bundle ID `com.dailyimaan.app`. (Or change the bundleIdentifier in `app.json` to whatever you prefer and use that.)
4. Set the EAS secret so production builds can find it:
   ```sh
   eas secret:create --scope project --name APPLE_TEAM_ID --value YOUR10CHARTEAMID
   ```

### A2. App Store Connect record
1. Go to <https://appstoreconnect.apple.com> → My Apps → "+" → New App.
2. Fields:
   - Platform: iOS
   - Name: **Daily Imaan**
   - Primary language: English (US)
   - Bundle ID: `com.dailyimaan.app` (the one you registered in step A1.3)
   - SKU: anything unique, e.g. `daily-imaan-001`.
3. Once created, copy the **Apple ID** (a long numeric string at the top of the app's page) and put it in `eas.json` under `submit.production.ios.ascAppId`.
4. Also put your Apple sign-in email in `submit.production.ios.appleId`.

### G1. Google Play Console — $25 one-time
1. Sign up at <https://play.google.com/console>. ID verification required.
2. Create a new app:
   - App name: **Daily Imaan**
   - Default language: English (US)
   - App or game: App
   - Free or paid: Free

### G2. Google Play service account JSON
1. In Play Console, go to Setup → API access → Create new service account in Google Cloud → grant "Release Manager" → download the JSON key.
2. Save the JSON to `artifacts/daily-imaan/play-service-account.json`.
3. **Do NOT commit this file.** Add it to `.gitignore` if it isn't already.

### S1. EAS account
1. Run `pnpm exec eas-cli login` from `artifacts/daily-imaan/`.
2. Run `pnpm exec eas-cli init` to link the project to your EAS account.

### S2. Sentry account (optional but strongly recommended)
1. Sign up at <https://sentry.io>. Create a project of type "React Native".
2. Copy the DSN.
3. Set it as an EAS secret:
   ```sh
   eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "https://...@sentry.io/..."
   ```
4. (Advanced) For source-map upload, also set `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` as EAS secrets.

### S3. Supabase account (optional but strongly recommended for retention)
Without Supabase, every user's streak / bookmarks / progress lives only on their phone — they lose everything on reinstall. With Supabase, anonymous auth lets the streak survive a phone reset invisibly.

1. Sign up at <https://supabase.com> (free tier covers tens of thousands of users).
2. Create a new project. Pick a strong database password and save it.
3. In **Authentication → Providers**, enable **Anonymous Sign-Ins**.
4. Open the SQL Editor → New query, paste the contents of `lib/supabase-schema.sql`, click Run.
5. From **Project Settings → API**, copy the Project URL and the **anon** (public) key.
6. Set as EAS secrets:
   ```sh
   eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://xxx.supabase.co"
   eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJh..."
   ```
7. The next production build will start syncing automatically. No code change needed.

---

## YOUR ACTION — host the Privacy Policy

You need a public HTTPS URL serving the policy. Pick one:

- **Easiest:** push `PRIVACY_POLICY.md` to a public GitHub repo and link to the rendered URL.
- **GitHub Pages:** convert `PRIVACY_POLICY.md` to `index.md` in a `gh-pages` branch and enable Pages. Custom domain optional.
- **Replit Static Deploy:** create a tiny static project that serves the markdown rendered as HTML.

Once the URL is live, paste it into App Store Connect (App Privacy → Privacy Policy URL) and Google Play Console (Store presence → Main store listing → Privacy policy).

---

## YOUR ACTION — finalize app config

Search-and-replace these placeholders before building:

| File | Placeholder | Set to |
| --- | --- | --- |
| `eas.json` | `REPLACE_WITH_YOUR_APPLE_ID_EMAIL` | Email used for Apple sign-in |
| `eas.json` | `REPLACE_WITH_APP_STORE_CONNECT_APP_ID` | Numeric ID from App Store Connect (see A2 step 3) |
| `eas.json` | `REPLACE_WITH_APPLE_TEAM_ID` | Same Team ID as A1 |
| (already done) | `support@dailyimaan.com` is now embedded in `PRIVACY_POLICY.md` | — |

---

## YOUR ACTION — install the new dependencies

The latest fix-pass added two npm packages. From `artifacts/daily-imaan/`:

```sh
pnpm install
```

This pulls in `@supabase/supabase-js` (remote state) and `react-native-url-polyfill` (Supabase requires it on RN). Both have zero impact when Supabase env vars are unset.

---

## YOUR ACTION — build, beta-test, submit

### Step 1 — Production build
From `artifacts/daily-imaan/`:
```sh
pnpm exec eas-cli build --platform all --profile production
```
This builds for both iOS and Android in the cloud. iOS takes ~20 min, Android ~10 min. EAS will prompt you for credentials the first time (let it manage them).

### Step 2 — Beta-test on TestFlight (iOS) and Internal Testing (Android)

**iOS / TestFlight:**
1. After the build succeeds, run `pnpm exec eas-cli submit --platform ios --profile production` to upload it.
2. In App Store Connect → TestFlight, add yourself and a small group of trusted testers.
3. Test for 2–3 days minimum. Pay attention to: prayer-time accuracy in your geo, notifications firing reliably, audio playing, Qibla pointing in the right direction, dark mode, accessibility (VoiceOver / TalkBack), streak freeze celebration showing after a missed day.

**Android / Internal Testing:**
1. Run `pnpm exec eas-cli submit --platform android --profile production`.
2. In Play Console → Testing → Internal testing, create a release, add testers (email list).

### Step 3 — Fill out store metadata

For both stores, fill in everything from `STORE_LISTING.md` and `PRIVACY_NUTRITION_LABELS.md`. Both stores require:
- App name + subtitle / short description
- Full description
- Keywords / tags
- Category
- Age rating questionnaire (answer truthfully — there's no objectionable content; rating will come back as 4+ / Everyone)
- Privacy Policy URL
- Support URL
- Screenshots (see `STORE_LISTING.md` for required sizes)
- Icon (1024 × 1024 for App Store; 512 × 512 for Play Store)

### Step 4 — Submit for review

**App Store:** Apple's review takes 1–3 days for a first submission. They'll likely ask one or both of:
- Demo of how to grant location permission and see prayer times update.
- Confirmation that all religious content is from a credible source. Your `STORE_LISTING.md` already cites Saheeh International and Ibn Kathir (Abridged) — paste the same citation into the App Review Notes.

**Google Play:** Review usually completes in a few hours to a day for first submissions, but can be longer.

### Step 5 — Post-launch

- [ ] Monitor Sentry for crashes for the first 48 hours.
- [ ] Respond to early reviews — even brief responses build trust.
- [ ] Plan v1.1: iOS home-screen widget (the Android one is already shipped), real adaptive icon artwork (currently re-uses the main icon), proper TestFlight beta groups for ongoing iteration.

---

## Quick reference — known limitations of v1.0

These are intentional and not bugs, but you may want to call them out in your release notes:

- **iOS widget:** shipped (`targets/DailyImaanWidget` via `@bacons/apple-targets`), alongside the Android widget. Known v1 limitation: the timeline refreshes only at midnight, so the "next prayer" line can go stale until the app is opened — device-test before relying on it.
- **App icon:** uses the same `icon.png` for the main icon, the adaptive icon foreground, and the splash. Replacing with purpose-built artwork (1024×1024 main, padded foreground for Android adaptive, separate splash logo) will make the install experience feel more polished.
- **Local-first by default:** the app works offline without any backend. Streak / bookmarks survive reinstalls **only when** Supabase env vars are configured (see S3).

## Deliberate v1 product decisions

These are choices, not bugs — flagged here so a future reviewer or task does not accidentally "fix" them.

- **Daily ayat are drawn from a curated rotation (100 vetted verses), not from the full 6,236-ayah dataset.** This is intentional: a "gentle, no guilt" daily app should not surface, say, a verse about hellfire on a hard day. The full Qur'an dataset is bundled offline and used by the Surah / Bookmarks screens; daily delivery uses the curated list. The store description ("drawn from a curated rotation of the Qur'an") reflects this honestly. Consider expanding to 200–300 in v1.1.
- **Tafsir / context is fetched verbatim on demand from Quran.com (Ibn Kathir, Abridged), not bundled.** ZERO AI-generated commentary on Islamic content. First load per ayah requires a network round-trip; subsequent reads are served from an LRU AsyncStorage cache.
- **Notifications use a generic body, not the verse text.** Embedding the verse in the body would go stale across days because a DAILY trigger fires the same payload forever. Today's verse is computed fresh when the user opens the app from the notification. Body copy now rotates daily across a small pool to avoid feeling robotic.
- **"Mark as Read" notification action is dismiss-only** (does not foreground the app); tapping the body itself opens the app to read the verse.
- **Streak freezes auto-apply silently overnight, not on-demand.** Designed for a lapsed audience: the freeze should rescue you, not require you to remember to use it. Two freezes refill every Sunday.
