# Daily Imaan — Beta + Launch Prep

This is a one-pass guide. Work through it top to bottom. Every command shown is meant to be copied verbatim. Open a terminal in `artifacts/daily-imaan/` (Windows: PowerShell or Git Bash both fine).

You're on Windows, so **iOS builds run in EAS Build cloud** — there's no local Mac path.

---

## Step 1 — Install the new dependencies

```sh
pnpm install
```

Should pull in `@supabase/supabase-js` + `react-native-url-polyfill` and finish in 30–60 seconds. If you see any peer-dependency warnings about React versions, ignore them — the catalog pinning in `pnpm-workspace.yaml` handles that.

If `pnpm` itself isn't installed:

```sh
npm install -g pnpm
```

---

## Step 2 — Sign up for an Expo (EAS) account

Free.

1. Go to <https://expo.dev/signup>.
2. Use whatever email you like. Verify it.
3. Back in the terminal:

```sh
pnpm exec eas-cli login
```

Enter the email + password from step 2. You should see "Logged in as <yourname>".

4. Link this project to your EAS account:

```sh
pnpm exec eas-cli init
```

Accept the defaults. This creates an EAS project ID and writes it into your `app.json` / `eas.json`.

---

## Step 3 — Set the Apple Team ID secret

You said you have it. From the project folder:

```sh
pnpm exec eas-cli secret:create --scope project --name APPLE_TEAM_ID --value YOUR10CHARTEAMID
```

Replace `YOUR10CHARTEAMID` with the actual 10-character string from <https://developer.apple.com/account#MembershipDetailsCard>.

---

## Step 4 — Set up Sentry (5 min, free tier)

1. Go to <https://sentry.io/signup/> and create an account.
2. Once in, click "Create Project" → pick **React Native** → name it `daily-imaan`.
3. After creation, Sentry shows you a DSN — a long URL like `https://abc123@o12345.ingest.sentry.io/678910`. **Copy it.**
4. Set it as an EAS secret:

```sh
pnpm exec eas-cli secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "https://YOUR_FULL_DSN_HERE"
```

That's it. Sentry will start receiving crash reports the next time you build.

---

## Step 5 — Set up Supabase (5 min, free tier)

This is what makes streaks survive reinstalls.

1. Go to <https://supabase.com/dashboard/sign-up> and create an account.
2. Click "New Project". Name it `daily-imaan`. Set a strong database password (save it in a password manager — you don't need it for the app, only for direct DB access). Region: pick the one closest to your audience (Sydney for Australia-first).
3. Wait ~2 minutes for the project to provision.
4. **Enable Anonymous Sign-Ins:** left sidebar → Authentication → Providers → scroll to find "Anonymous Sign-Ins" → toggle ON → Save.
5. **Run the schema:** left sidebar → SQL Editor → "New query" → paste the entire contents of `lib/supabase-schema.sql` → click "Run". Should report "Success. No rows returned." That created the `user_state` table + RLS policies.
6. **Grab the API keys:** left sidebar → Project Settings (gear icon) → API. Copy two values:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (long base64 string starting with `eyJh...`)
7. Set both as EAS secrets:

```sh
pnpm exec eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://YOUR_PROJECT_URL.supabase.co"
pnpm exec eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "YOUR_ANON_KEY"
```

If either secret already exists from a previous run, add `--force` to overwrite.

---

## Step 6 — Validate the config locally (do NOT skip)

This catches every native config error before you spend minutes on a cloud build:

```sh
pnpm exec expo prebuild --clean
```

Expected output: Expo generates `ios/` and `android/` native folders, prints "✔ All checks passed", then exits cleanly. If it errors, paste the output to me — that means something in `app.json` is malformed.

You can immediately delete those folders after — they regenerate on every build:

```sh
rmdir /s /q ios android
```

(or on bash: `rm -rf ios android`)

---

## Step 7 — Pay the Google Play $25 fee

You said this is the only outstanding paid step. Without it the Android build can be uploaded but not published. From <https://play.google.com/console>:
- "Setup → Account details" → complete identity verification (1–3 days)
- Pay the $25 registration fee

While you're there:
- "Setup → API access" → "Create new service account" in Google Cloud → grant "Release Manager" role → "Manage Keys" → "Create Key" → JSON → download.
- Save the JSON to **`artifacts/daily-imaan/play-service-account.json`**. (It's already in `.gitignore` — never commit it.)

---

## Step 8 — Update `eas.json` with your real Apple identifiers

Open `eas.json` and replace these three placeholders under `submit.production.ios`:

| Placeholder | Replace with |
|---|---|
| `REPLACE_WITH_YOUR_APPLE_ID_EMAIL` | The email used for your Apple Developer account |
| `REPLACE_WITH_APP_STORE_CONNECT_APP_ID` | The numeric app ID from App Store Connect (after you register the app there) |
| `REPLACE_WITH_APPLE_TEAM_ID` | Your 10-char Team ID (same as Step 3) |

Then register the app in App Store Connect:
1. <https://appstoreconnect.apple.com> → My Apps → "+" → New App.
2. Platform: iOS · Name: **Daily Imaan** · Primary language: English (US) · Bundle ID: pick `com.dailyimaan.app` from the dropdown (it must already exist as an App ID — register it under "Certificates, Identifiers & Profiles" → "Identifiers" if not). · SKU: anything unique like `daily-imaan-001`.
3. Once created, the app's URL contains a long numeric — that's your `ascAppId`. Paste it into `eas.json`.

---

## Step 9 — First production build (cloud, 15–25 min)

```sh
pnpm exec eas-cli build --platform all --profile production
```

This kicks off two parallel builds — one iOS, one Android. EAS will prompt you for Apple credentials the first time iOS builds; let EAS manage your provisioning profiles + signing certs (it's the easier path).

You'll get two download URLs when it's done. Don't install them on a real device yet — TestFlight and Play Internal Testing are next.

---

## Step 10 — Beta tester invites

When you're ready, paste me the list of beta tester emails. I'll prepare:
- An iOS TestFlight invite list (Apple IDs)
- A Play Internal Testing email list (Gmails preferred)
- A 1-page "what to test" doc you can send them

Or you can do it directly:
- iOS: <https://appstoreconnect.apple.com> → TestFlight → Internal Testing → add testers
- Android: <https://play.google.com/console> → Testing → Internal testing → create release → add tester list

---

## Step 11 — Submit to stores

```sh
pnpm exec eas-cli submit --platform ios --profile production
pnpm exec eas-cli submit --platform android --profile production
```

iOS review: 1–3 days for first submission. Apple may request a demo of how location permission works for prayer times — your app is anonymous so no test account needed.

Play review: usually a few hours, sometimes 1–2 days for first submissions.

---

## Quick reference — secrets you need set (recap)

```sh
pnpm exec eas-cli secret:list
```

You should see exactly:
- `APPLE_TEAM_ID`
- `EXPO_PUBLIC_SENTRY_DSN`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

If any are missing, the production build will still succeed but those features will silently no-op.

---

## What to do if something errors

- **`pnpm install` fails** — make sure you're in `artifacts/daily-imaan/`, not the repo root. Then `pnpm install` from there.
- **`expo prebuild` errors** — paste the output to me. Usually a typo in `app.json` or a missing native module.
- **EAS build fails on iOS** — check the build URL. Most common: missing `APPLE_TEAM_ID` or a bundle-ID mismatch with the App Store Connect record.
- **EAS build fails on Android** — usually a missing `play-service-account.json` (only matters at submit, not build) or an `versionCode` collision (already at 1; bump if you re-submit).
- **TestFlight build "processing" forever** — Apple sometimes takes 10–15 min. If still stuck after an hour, check the App Store Connect activity log for export-compliance prompts.

---

## When everything is shipped

Open Sentry. Watch the crash count for 48 hours. Reply to every early review (even brief replies build trust). Plan v1.1.
