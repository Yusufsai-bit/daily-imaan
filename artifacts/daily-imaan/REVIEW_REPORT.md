# Daily Imaan — Senior Code & UX Review

_Review pass dated 6 May 2026. Reviewer's note: this is a remarkably mature codebase for a pre-launch app. Architecture is sound, security hygiene is strong, comments explain "why" not just "what". Most criticism below is about polish, edge cases, and a few genuine launch blockers._

---

## TL;DR — Ship-blockers (must fix before App Store / Play Store submission)

You are **not** ready to submit. There are three issues that will cause Apple/Google to reject the build OR cause a hard crash on real devices:

1. `app.json` has no `bundleIdentifier` (iOS) and no `package` (Android). Both stores will reject the build immediately.
2. `app.json` has no `NSLocationWhenInUseUsageDescription`. The first time a user opens Qibla or the app calls `Location.requestForegroundPermissionsAsync()` (prayer times), iOS will **hard-crash** the app with no friendly error.
3. `app.json` has no `ITSAppUsesNonExemptEncryption` declaration. App Store Connect will block submission until this is set.

Your `LAUNCH_CHECKLIST.md` line 11 says these are done. **They are not.** The checklist is out of date and giving false confidence. Treat it as untrusted until rewritten.

---

## Severity legend

- **P0** — Crash, data loss, store rejection, security. Fix before launch.
- **P1** — Real bug or significant UX/perf hit. Fix before public marketing push.
- **P2** — Polish, edge cases, code-quality refactors.
- **P3** — Cosmetic.

---

## P0 — Must fix before launch

### P0.1 Missing iOS bundleIdentifier — `app.json`
File: `artifacts/daily-imaan/app.json` (lines 16–18)

The entire `ios` block is `{ "supportsTablet": false }`. App Store Connect requires a reverse-DNS bundle identifier. Add:

```json
"ios": {
  "supportsTablet": false,
  "bundleIdentifier": "com.dailyimaan.app",
  "buildNumber": "1",
  "infoPlist": {
    "NSLocationWhenInUseUsageDescription": "Daily Imaan uses your location to calculate accurate prayer times and the Qibla direction. Your location never leaves your device.",
    "NSMotionUsageDescription": "Daily Imaan uses motion sensors to point the Qibla compass.",
    "ITSAppUsesNonExemptEncryption": false
  }
}
```

`bundleIdentifier` must match the App ID you register in your Apple Developer account.

### P0.2 Missing Android `package` — `app.json`
File: `artifacts/daily-imaan/app.json` (line 19)

`"android": {}` is empty. Add:

```json
"android": {
  "package": "com.dailyimaan.app",
  "versionCode": 1,
  "permissions": [
    "ACCESS_COARSE_LOCATION",
    "ACCESS_FINE_LOCATION",
    "POST_NOTIFICATIONS",
    "VIBRATE"
  ],
  "adaptiveIcon": {
    "foregroundImage": "./assets/images/icon.png",
    "backgroundColor": "#1A6B4A"
  }
}
```

### P0.3 Missing iOS Info.plist usage descriptions
Without `NSLocationWhenInUseUsageDescription`, iOS will **hard-crash** the app the first time `Location.requestForegroundPermissionsAsync()` is called. This is hit by:

- `hooks/usePrayerTimes.ts` (line 167) — fires on app start
- `app/qibla.tsx` (line 80) — fires when user taps Qibla pill on home

So your home screen will likely crash on real iOS devices on first launch. The reason this hasn't bitten you in Expo Go is because Expo Go has its own Info.plist with permission strings already declared. Production builds will crash.

### P0.4 LAUNCH_CHECKLIST.md is lying to you
File: `artifacts/daily-imaan/LAUNCH_CHECKLIST.md` (line 11)

Says: `[x] app.json hardened: real bundle ID, version code, build number, permission strings, encryption declaration.`

Reality: none of those exist in `app.json`. Either roll the checklist back to `[ ]` for honesty, or fix `app.json` and leave it checked. Right now it gives false confidence and will cause a wasted submission attempt.

Also: line 147 says "Adhan sound: notifications use the device's default sound, not a real adhan recitation." That contradicts your code, which fully wires `adhan-makkah.mp3` and `adhan-madinah.mp3` through `expo-notifications` plugin in `app.json`, the per-channel Android setup in `useNotifications.ts`, and the `adhanSound` setting in `AppContext.tsx`. The adhan IS implemented. Update the checklist.

### P0.5 Streak feature contradicts your stated product vision
File: `context/AppContext.tsx` (lines 80–84, 345–361)

In our session you specified: streak with **streak-freeze grace days**, with a celebratory next-open screen when a freeze is auto-applied.

What the code actually does: a counter that increments by 1 the first time the user opens the app each calendar day. It never decrements. There is **no concept of consecutive days**, **no concept of a missed day**, and **no streak-freeze logic**. The `longestStreak` field is overwritten with `count` on every increment, so they are always equal — making `longestStreak` redundant.

This isn't strictly a bug — your "soft streak / never punish" implementation matches your stated lapsed-user empathy. But it doesn't deliver the streak-freeze + celebratory restoration UX you described. Either:
- (a) Re-label this in-app as "Days with Allah" (count-up since first open), drop the word "streak" entirely from UI copy. This matches what the code actually does and is honestly more in line with the lapsed-user thesis.
- (b) Implement real streak logic: track consecutive days, allow 2 freezes/week, surface a "We saved your 14-day streak" screen on the first open after a missed day.

Pick one. Don't ship a counter labelled "streak."

### P0.6 No backend → streak dies on reinstall
You agreed to anonymous Firebase/Supabase auth in our session. The code uses AsyncStorage only (`STORAGE_KEY = "@daily_imaan_state"`). For your audience (lapsed Muslims who specifically need encouragement after gaps), losing 60 days of progress on a phone reset is a churn-grade event.

Concrete fix path:
1. Add `firebase/auth` and `firebase/firestore`, or `@supabase/supabase-js`.
2. On first launch (instead of pure AsyncStorage default state), call `signInAnonymously()` — invisible to user.
3. Mirror `state` to a per-UID document. AsyncStorage stays as the cache.
4. On future feature: prompt sign-in-with-Apple on milestone (e.g. day 21) — silent if dismissed.

This is meaningful work (~1–2 days) but it's the single highest-leverage retention investment you can make pre-launch.

---

## P1 — Significant issues

### P1.1 Welcome screen is too heavy for lapsed users
Files: `app/welcome.tsx`, `components/AboutContent.tsx`

Your audience is lapsed Muslims. On first launch they see: greeting → bismillah → intro paragraph → 4 "Sources you can trust" cards → 5-bullet "What we don't do" list → closing dua → Begin. That's a wall of credibility text aimed at a sceptical content reviewer, not a person who has been away from Quran for years.

Recommendation:
- Welcome screen content shrinks to: greeting, app name, **one** sentence ("Your daily ayah, hadith, and dua — no ads, no accounts"), and Begin.
- Below Begin, a small text link: "About & sources" → `/about`.
- The current AboutContent moves wholesale to `/about`. The route already exists.
- Bonus: show a soft preview of today's ayah above the Begin button. Convert with a taste, not a CV.

Lapsed users measure their first-app-open friction in seconds. Yours is currently in scroll-distance.

### P1.2 AsyncStorage write blocks the JS thread on every state change
File: `context/AppContext.tsx` (lines 272–294)

Every `updateState` call serialises the full state via `JSON.stringify` and writes synchronously (await) to AsyncStorage. On heavy users this state could be 50–100 KB. On older Androids, that's a 30–80ms stall on the JS thread, on every bookmark tap, settings tweak, or deed check.

Fix: debounce the persist call (e.g. 250ms trailing), or migrate to MMKV (`react-native-mmkv`), which is ~30× faster and synchronous.

### P1.3 Sequential daily-ayah picker has a DST bug
File: `data/featuredAyat.ts` (lines 401–414)

```js
const start = new Date(2024, 0, 1);
const today = new Date();
const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
```

This is a millisecond-difference divided by 24 hours. At a DST transition the diff is 23 or 25 hours that day, so `Math.floor` either repeats yesterday's verse or skips one. Subtle, but real — and your `getTodayHadith` uses the cleaner approach (year×10000 + month×100 + day) so the two could disagree on edge days.

Fix:
```js
function dayKey(d: Date): number {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
const diff = dayKey(today) - dayKey(new Date(2024, 0, 1));
```

That's date-arithmetic, not millisecond-arithmetic, and survives DST + leap years.

### P1.4 Curated daily pool is only 75 ayahs → cycle every 75 days
File: `data/featuredAyat.ts`

A user committing to daily reading sees the same ayah every ~2.5 months. That's noticeable on the second cycle. Your `LAUNCH_CHECKLIST.md` flags this as intentional (curated = no surprise hellfire ayah on a hard day) — fair philosophical position. But:

- Either grow the curated pool to 200–300 (still vetted, still gentle)
- Or rotate by Hijri date or weekday so the ayah-of-the-day pattern is harder to notice
- Or pick 75 random themed packs and surface "Today's reflection: Sabr (1 of 3 ayahs)" — turns 75 ayahs into ~25 unique-feeling experiences

### P1.5 Audio cleanup race in home tab
File: `app/(tabs)/index.tsx` (lines 218–222 + 277–293)

```js
useEffect(() => {
  return () => { if (sound) sound.unloadAsync(); };
}, [sound]);
```

`sound.unloadAsync()` is async. On rapid shuffle taps you can have an old sound un-loading while a new sound is loading. Worst case: audio session leaks and the user gets two recitations overlapping, or background audio that doesn't stop on screen leave.

Fix: track `currentSoundRef.current`, in cleanup `await ref.current?.unloadAsync()`, set ref to null. Don't use sound state as the cleanup dep.

### P1.6 Defaults mismatch between AppContext and useNotifications
File: `hooks/useNotifications.ts` (lines 195–201) vs `context/AppContext.tsx` (lines 169–175)

useNotifications default: `Fajr: false, Dhuhr: true, Asr: true, Maghrib: true, Isha: true`.
AppContext default: all five `true`.

Whichever path is hit first decides if Fajr makes a sound. This is a "one of these branches gets hit when settings haven't loaded" situation and it's invisible to QA. Pick one default and reuse it. Recommend: AppContext is the single source of truth, useNotifications imports it.

### P1.7 No timeout / abort on network calls
Files: `hooks/useTafsir.ts` (line 177), `hooks/usePrayerTimes.ts` (line 235)

Bare `fetch(url)` on slow/dead networks hangs indefinitely. Loading spinners spin forever. On lapsed users with patchy data, this looks like the app is broken.

Fix:
```js
const controller = new AbortController();
const id = setTimeout(() => controller.abort(), 10_000);
const res = await fetch(url, { signal: controller.signal });
clearTimeout(id);
```

Wire into the existing `cancelled` flag for clean component unmount.

### P1.8 No backend fallback for prayer times if Aladhan is down
File: `hooks/usePrayerTimes.ts`

Aladhan API is the single source. If it's down, you fall back to yesterday's cache (good), but a fresh user with no cache + Aladhan down sees "Could not load prayer times" and a useless app.

Fix: bundle the `adhan` npm package (~30KB) which calculates prayer times offline using the same astronomical math. Use the API only for reverse-geocoded city name + Hijri date.

### P1.9 Notification copy reads as transactional, not warm
File: `hooks/useNotifications.ts` (lines 169, 417, 476, 491)

> "Your verse for today is ready. Tap to read."

To a lapsed Muslim, this lands transactional. Possible warmer rotations:

- "A verse for your heart today."
- "Allah remembers you — your ayah is here."
- "A small light for today."
- (For adhkar evening) "A few minutes of peace before sleep."

Rotate copy across days. Keep length short (under 50 chars to avoid truncation in the iOS lock-screen condensed view).

### P1.10 App icon, adaptive icon, and splash all use the same 1024 png
Already flagged in your own LAUNCH_CHECKLIST.md (line 149). Worth elevating: the install impression is one of the cheapest leverage points you have. A purpose-built padded foreground for Android adaptive icons + a separate splash mark = looks 30% more professional with 1 day of design effort.

---

## P2 — Polish

### P2.1 O(n) array lookups for bookmarks/read-ayat
File: `context/AppContext.tsx` (line 309: `state.bookmarks.includes(ayahId)`)

After 1,000 reads, every Home render does a 1,000-element `.includes()` scan. Use a memoised `Set` derived from the array, or just store as a `Record<number, true>` (and migrate the existing array).

### P2.2 Welcome shows no ayah preview
Add a soft preview of today's ayah card to the welcome screen. Convert with a taste, not a manifesto. (See P1.1.)

### P2.3 Hadith book title parser is fragile
File: `app/(tabs)/index.tsx` (line 365):
```js
const hadithBookTitleEn = hadith.bookTitle.split("كتاب")[0]?.trim() ?? "";
```
Splits on Arabic word "كتاب" to strip it. If a future hadith doesn't include that word, this breaks. Better: split the field at data-source level into `bookTitleEn` + `bookTitleAr`.

### P2.4 Animated vs Reanimated 3
You import `react-native-reanimated` 4.1.1 in deps but use legacy `Animated` API in home + qibla. Reanimated 3 is more performant on UI thread. If you have time, migrate. If not, file as v1.1.

### P2.5 React Compiler beta + New Architecture both enabled
File: `app.json` (line 42):
```json
"experiments": { "typedRoutes": true, "reactCompiler": true }
```
Plus `newArchEnabled: true` (line 10). Both are still maturing. This stack is bleeding-edge and many third-party libs (especially `expo-av`, `expo-notifications`, gesture handler) only recently added stable New Architecture support. Risk: subtle re-render bugs on production builds that QA missed.

Recommendation: ship v1.0 with `reactCompiler: false`. Re-enable in v1.1 after you've proven the boring path works.

### P2.6 Notification permission denied → toggle still shows ON
File: `hooks/useNotifications.ts` (lines 405–407, 467–470)

If user denies the system permission prompt, the in-app toggle still reads ON. Comment acknowledges this. For lapsed users this is genuinely confusing ("I turned it on, why no notifications?"). Better UX:

- Detect denied state, flip toggle visibly OFF in AppContext, surface a small inline "Notifications are blocked — open Settings" link.

### P2.7 AsyncStorage cache writes not abort-aware
Tafsir prewarm fires on every ayah change. If the user shuffles rapidly, multiple in-flight prewarms race for the same cache key. Last-write-wins is fine here but the work is wasted. AbortController on prewarm too.

### P2.8 Inconsistent indentation in `featuredAyat.ts`
2-space vs 4-space mixed. Run prettier on the file.

### P2.9 Streak chip "displayStreak" floor at 1
File: `app/(tabs)/index.tsx` (line 362):
```js
const displayStreak = state.streak.count > 0 ? state.streak.count : 1;
```
On first open, before the streak `useEffect` fires, the chip shows "1 day streak" — but it's a lie until the increment lands. Minor cosmetic. Fix by gating on `loaded` or showing "Welcome" text first.

---

## P3 — Cosmetic

- Inconsistent indentation in `app/(tabs)/index.tsx` line 730 (10-space vs 8 elsewhere).
- `numberOfLines={1}` on prayer pill could truncate "1h 23m" when the user has large text scaling. Consider `flexShrink: 1` + ellipsis only on overflow.
- `formatTime12h` regex on `raw.split(" ")` only handles single-space "16:42 (EST)" — fine for current Aladhan responses but brittle.
- Repeated screen options spread across `<Stack.Screen>` entries in `_layout.tsx` (lines 142–151) — could be DRY-ed via `options` defaults.

---

## What you're doing exceptionally well

These are not throwaway compliments. Most pre-launch RN apps fail at one of these.

1. **Senior-level concurrency control in `useNotifications.ts`.** The per-category serialised queue with the documented gotcha about `previous.then(fn)` vs proper tail-chaining is something most engineers get wrong. You got it right and explained it.
2. **Sentry + Apple Team ID env-gated.** Both follow the right pattern — fail-loud for production, no-op in dev. No leaked secrets.
3. **Tafsir cache: TTL + LRU + offline stale fallback.** Three layers of resilience. Most apps ship one.
4. **Lazy `quranFullData` import** with cached O(1) index + preload pattern. Right pattern for the bundle-size problem.
5. **Permission requests are lazy.** Apple HIG-compliant. This alone saves you from a 30% rejection rate on first submission.
6. **Schema migration system in AppContext.** Pre-launch and you already have `version: 1` + a `migrateState` function. Most apps add this in v3 after the first data-loss incident.
7. **Comments document _why_, not _what_.** The `withCategoryLock` JSDoc, the AsyncStorage growth-cap comment, the welcome routing comment about deep links — these are the comments that matter.
8. **Privacy nutrition labels + privacy policy + store listing already drafted.** Most pre-launch apps write these the night before submission.
9. **Brand identity is tight.** "Daily Imaan" everywhere; no leftover "Quran Unlock" strings I could find. Decision held.
10. **Soft-streak philosophy is right for the audience.** Even though it doesn't match the streak-freeze model you described in our session, the underlying intuition (don't punish lapsed users) is correct and matches the audience deeper than gamification.

---

## Suggested fix order

If I had a week to ship this:

**Day 1 — Store blockers (P0.1–P0.4)**
- Fix `app.json` (add bundleId, package, infoPlist permissions, encryption flag, Android adaptiveIcon).
- Update `LAUNCH_CHECKLIST.md` to match reality.
- Add purpose-built adaptive icon foreground PNG.
- Run a real production build via EAS to confirm no further config issues.

**Day 2 — Crash fixes & retention (P0.5, P0.6)**
- Decide: rebrand "streak" as "Days with Allah" OR implement real streak-freeze logic. Don't ship the lie.
- Add anonymous Firebase Auth + Firestore mirroring of AppState. Anonymous-only for v1.

**Day 3 — UX core (P1.1, P1.9, P1.10)**
- Strip Welcome screen to greeting + 1 line + Begin + tiny "About & sources" link.
- Move full credibility content to `/about`.
- Rotate notification copy; pick warmer phrasing.
- Commission proper splash + adaptive icon foreground.

**Day 4 — Bugfixes (P1.3, P1.5, P1.6, P1.7, P1.8)**
- Fix DST bug in featured ayat picker.
- Fix audio cleanup race.
- Unify notification defaults.
- Add timeouts + AbortController on all `fetch()` calls.
- Bundle `adhan` package for offline prayer times.

**Day 5 — Performance pass (P1.2, P1.4, P2.1, P2.5)**
- Migrate AsyncStorage to MMKV (or debounce writes).
- Convert bookmarks/readAyat to Set-backed lookup.
- Disable `reactCompiler` for v1.
- Triple the daily ayat pool.

**Day 6 — TestFlight beta**
- Internal beta to 5–10 trusted testers (preferably real lapsed Muslims, not engineers).
- Collect: cold-start time, notification delivery success, prayer-time accuracy in their region, crashes from Sentry.

**Day 7 — Submit**
- App Store + Play Store. Plan for 1 round of rejection (probably about location permission demo).

---

## Open questions for you

1. **Do you want me to implement any of these fixes?** I can start with P0.1–P0.4 (the app.json fixes) which are mechanical and the highest leverage.
2. **Streak philosophy: rebrand to "Days with Allah" or implement real freeze logic?** This is a product call, not a code call.
3. **Backend choice: Firebase or Supabase?** Both work. Supabase is cheaper at scale and Postgres-native; Firebase has better React Native SDK ergonomics.
4. **Have you tested on a real low-end Android (e.g. <3GB RAM)?** The bundle size + AsyncStorage churn could be rough there.
5. **Is the Replit deployment your only build path, or do you have EAS Build set up?** The Replit URL serves Expo Go only — that's not your production build target.
