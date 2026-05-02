# Daily Imaan — Launch Checklist

Everything in **CODE-SIDE** is already done. Everything in **YOUR ACTION** requires you to log in to a third party, sign something, or pay a fee — I cannot do those for you, but each one tells you exactly what to do.

Work through them top to bottom.

---

## CODE-SIDE — already done ✅

- [x] `app.json` hardened: real bundle ID, version code, build number, permission strings, encryption declaration.
- [x] Adaptive icon configured for Android (foreground + brand background).
- [x] Splash screen configured for light + dark.
- [x] `eas.json` with development / preview / production build profiles + submit profiles.
- [x] Native time picker on iOS / Android (with explicit Cancel/Done on iOS).
- [x] Accessibility roles, labels, hints, decorative-icon flags, font-scaling caps across Home / Settings / Me / Privacy.
- [x] Sentry SDK installed (`@sentry/react-native ~7.2.0`) and wired into the app's `ErrorBoundary`. No-op when `EXPO_PUBLIC_SENTRY_DSN` is unset, so the app runs fine without it.
- [x] Privacy Policy: in-app screen at `/privacy`, linked from Settings → Privacy & Legal, plus a hostable `PRIVACY_POLICY.md` at the project root.
- [x] Store listing copy ready in `STORE_LISTING.md`.
- [x] Privacy nutrition labels (Apple) + Data safety form (Google) reference in `PRIVACY_NUTRITION_LABELS.md`.

---

## YOUR ACTION — accounts and credentials

### A1. Apple Developer Program — $99/year
1. Sign up at <https://developer.apple.com/programs/>. This takes 24–48 hours for individual approval, longer for organizations.
2. Once enrolled, find your **Team ID** at <https://developer.apple.com/account#MembershipDetailsCard>. It is exactly 10 alphanumeric characters.
3. Replace `"appleTeamId": "XXXXXXXXXX"` in `artifacts/daily-imaan/app.json` (under the `@bacons/apple-targets` plugin entry) with your real Team ID.
4. Replace `"appleTeamId": "REPLACE_WITH_APPLE_TEAM_ID"` in `artifacts/daily-imaan/eas.json` (under `submit.production.ios`).

### A2. App Store Connect record
1. Go to <https://appstoreconnect.apple.com> → My Apps → "+" → New App.
2. Fields:
   - Platform: iOS
   - Name: **Daily Imaan**
   - Primary language: English (US)
   - Bundle ID: pick **`com.dailyimaan.app`** from the dropdown _(it must already exist as an App ID in your Developer account — create it under Certificates, Identifiers & Profiles → Identifiers if needed)._
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
2. Save the JSON to `artifacts/daily-imaan/play-service-account.json` _(this path is already referenced from `eas.json`)_.
3. **Do NOT commit this file.** Add it to `.gitignore` if it isn't already.

### S1. EAS account
1. Run `pnpm exec eas-cli login` from `artifacts/daily-imaan/` (you'll need to install eas-cli globally or use npx).
2. Run `pnpm exec eas-cli init` to link the project to your EAS account.

### S2. Sentry account (optional but strongly recommended)
1. Sign up at <https://sentry.io>. Create a project of type "React Native".
2. Copy the DSN.
3. Set it as an env var for the production build: `eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "https://...@sentry.io/..."`
4. (Advanced) For source-map upload, also set `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` as EAS secrets. The Sentry plugin will pick them up at build time.

---

## YOUR ACTION — host the Privacy Policy

You need a public HTTPS URL serving the policy. Pick one:

- **Easiest:** push `PRIVACY_POLICY.md` to a public GitHub repo and link to the rendered URL (e.g. `https://github.com/yourname/daily-imaan-legal/blob/main/PRIVACY_POLICY.md`).
- **GitHub Pages:** convert `PRIVACY_POLICY.md` to `index.md` in a `gh-pages` branch and enable Pages on that repo. Custom domain optional.
- **Replit Static Deploy:** create a tiny static project that serves the markdown rendered as HTML.

Once the URL is live, paste it into App Store Connect (App Privacy → Privacy Policy URL) and Google Play Console (Store presence → Main store listing → Privacy policy).

---

## YOUR ACTION — finalize app config

Search-and-replace these placeholders before building:

| File | Placeholder | Set to |
| --- | --- | --- |
| `app.json` | `"appleTeamId": "XXXXXXXXXX"` | Real 10-char Team ID |
| `eas.json` | `REPLACE_WITH_YOUR_APPLE_ID_EMAIL` | Email used for Apple sign-in |
| `eas.json` | `REPLACE_WITH_APP_STORE_CONNECT_APP_ID` | Numeric ID from App Store Connect (see A2 step 3) |
| `eas.json` | `REPLACE_WITH_APPLE_TEAM_ID` | Same Team ID as above |
| `PRIVACY_POLICY.md` | `support@dailyimaan.app` | Real support email |

---

## YOUR ACTION — build, beta-test, submit

### Step 1 — Production build
From `artifacts/daily-imaan/`:
```sh
pnpm exec eas-cli build --platform all --profile production
```
This will build for both iOS and Android in the cloud. iOS takes ~20 min, Android ~10 min. EAS will prompt you for credentials the first time (let it manage them).

### Step 2 — Beta-test on TestFlight (iOS) and Internal Testing (Android)

**iOS / TestFlight:**
1. After the build succeeds, run `pnpm exec eas-cli submit --platform ios --profile production` to upload it.
2. In App Store Connect → TestFlight, add yourself and a small group of trusted testers. Apple processes the build for ~10 min.
3. Test for at least 2–3 days. Pay attention to: prayer-time accuracy in your geo, notifications firing reliably, audio playing, Qibla pointing in the right direction, dark mode, accessibility (VoiceOver / TalkBack).

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

These are intentional and not bugs, but you may want to call them out in your release notes or know they exist:

- **Adhan sound:** notifications use the device's default sound, not a real adhan recitation. Bundling an adhan audio file requires a license and was deferred.
- **iOS widget:** not yet shipped. The Android widget is.
- **App icon:** uses the same `icon.png` for the main icon, the adaptive icon foreground, and the splash. Replacing with purpose-built artwork (1024×1024 main, padded foreground for Android adaptive, separate splash logo) will make the install experience feel more polished.
- **No backend:** by design. Every operation is local or directly hits a public Quran/prayer-times API.

## Deliberate v1 product decisions

These are choices, not bugs — flagged here so a future reviewer or task does not accidentally "fix" them.

- **Daily ayat are drawn from a curated rotation (~75 vetted verses), not from the full 6,236-ayah dataset.** This is intentional: a "gentle, no guilt" daily app should not surface, say, a verse about hellfire on a hard day. The full Qur'an dataset is bundled offline and used by the Surah / Bookmarks screens; daily delivery uses the curated list. The store description ("drawn from a curated rotation of the Qur'an") reflects this honestly. If you want this to change later, treat it as a separate product task.
- **Tafsir / context is fetched verbatim on demand from Quran.com (Ibn Kathir, Abridged), not bundled.** This is required by the brief: ZERO AI-generated commentary on Islamic content. Authoring 6,236 one-line contexts in-house would either require significant scholar-vetted writing or violate the brief; on-demand verbatim Ibn Kathir is the v1 solution. First load per ayah requires a network round-trip; subsequent reads are served from an LRU AsyncStorage cache.
- **Notifications use a generic body, not the verse text.** Embedding the verse in the body would go stale across days because a DAILY trigger fires the same payload forever. Today's verse is computed fresh when the user opens the app from the notification.
- **"Mark as Read" notification action is dismiss-only** (does not foreground the app); tapping the body itself opens the app to read the verse.
