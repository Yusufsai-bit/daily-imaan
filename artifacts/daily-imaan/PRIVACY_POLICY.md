# Daily Imaan — Privacy Policy

**Effective: July 7, 2026**

Daily Imaan is built to respect your privacy. The app uses no advertising, no third-party analytics, and no behavioural tracking. We do not ask you to create an account, share an email, or sign in. This page describes exactly what data the app touches and where it goes.

## 1. Information stored on your device

The app stores the following data locally on your device using standard mobile storage (AsyncStorage). It is the canonical copy of your data — the optional cloud sync described in Section 5 is a mirror, not a replacement.

- Your bookmarks (saved ayat and saved hadith).
- Your reading progress and consecutive-day streak (including streak-freeze grace days).
- Your daily intentions / good-deed checkmarks (kept for the most recent 365 days, then automatically pruned).
- Your settings (dark mode, reciter, prayer calculation method, juristic school, daily reminder times, dhikr target preset, Arabic font size, continuous-play preference).
- Cached tafsir text (Ibn Kathir, Abridged) for offline reading.
- Cached prayer times for your area, including the rounded coordinates used for the calculation.
- The most recent surah you opened (so the home screen can offer a "Continue reading" tile).

## 2. Optional cloud sync (anonymous)

To prevent the loss of your streak and bookmarks if you reinstall the app or change phones, Daily Imaan can optionally mirror your data to a backend service (Supabase). When this is active:

- The app silently creates an **anonymous session** on first launch — no email, name, or login is requested or required. Your identity is a randomly-generated UUID stored on the device.
- The same data described in Section 1 is uploaded to a private row keyed to that UUID. The row is protected by Row Level Security so only your anonymous session can read or write it.
- We never see, request, or display any identifier that could link the row to you as a person. We do not have your name, email, phone number, IP address (beyond the inherent transport-level handling by our hosting provider), or device identifier.
- You can turn cloud backup off at any time from Settings → Privacy & Legal → Cloud backup. Turning it off **deletes the server-side row** and the app reverts to local-only storage.
- The backend is hosted by Supabase, Inc. Its security and privacy practices are described at <https://supabase.com/privacy>.

If cloud sync is not configured for a given build (which happens when the app is built without Supabase credentials), the app falls back silently to local-only storage and no data is uploaded.

## 3. Location

If you grant location permission, the app uses your current coordinates only to calculate accurate prayer times and to point the Qibla compass towards Makkah. Coordinates are sent to AlAdhan (api.aladhan.com) when fetching prayer times and never stored beyond the local cache. They are not associated with an identity, sold, or shared with advertisers.

You can revoke location access at any time from your device's system settings. Without location access, the app cannot calculate prayer times or the Qibla direction, but every other feature still works.

## 4. Notifications

Daily reminders, prayer-time alerts, and adhkar nudges are scheduled locally on your device using Expo Notifications. The text of each reminder is generated on-device from a small pool of warm prompts bundled with the app — we do not transmit a per-user notification payload. We cannot see whether or when a notification fires on your device.

## 5. Third-party services

The app makes outbound network requests to the following services to deliver Quranic content and (optionally) cloud-sync your local state. We do not control these third parties; please refer to their respective privacy policies for details.

- **AlAdhan** (api.aladhan.com) — receives your coordinates and chosen calculation method to return prayer times and Hijri dates. <https://aladhan.com/privacy-policy>
- **Quran.com Foundation** (api.qurancdn.com) — receives a verse reference to return the Saheeh International translation, the Uthmani Arabic text, and the Ibn Kathir tafsir. <https://quran.foundation/privacy>
- **Alquran.cloud** (cdn.alquran.cloud) — receives a surah/ayah/reciter reference to return the audio recitation MP3. <https://alquran.cloud/privacy-policy>
- **Supabase** (only when cloud backup is enabled) — receives the anonymous UUID and your state document (bookmarks, streak, settings), over HTTPS and encrypted at rest. <https://supabase.com/privacy>
- **Sentry** (only when crash reporting is enabled and the app crashes) — receives an anonymised stack trace, the app version, and the device model. <https://sentry.io/privacy/>

None of these services receive an account identifier or personal information from us beyond what is required for the request itself.

## 6. Crash reporting

If the app crashes, anonymized diagnostic information (the error message, stack trace, OS and app version, and device model) may be sent to Sentry to help us fix the bug. This report does not include your bookmarks, location, the contents of any cached text, the cloud-sync UUID, or any personally-identifying data. You can disable crash reporting from Settings → Privacy → Crash reports. If crash reporting is not configured for a given build, no reports are sent.

## 7. Children's privacy

Daily Imaan is suitable for all ages and does not knowingly collect information from children. There is no chat, no user-generated content, no advertising, and no in-app purchases. The optional cloud sync is anonymous by design, but parents of children under 13 in jurisdictions covered by COPPA or similar laws should disable cloud sync from Settings.

## 8. Your rights and how to exercise them

- **Erase all local data:** uninstall the app, or clear the app's data from your device's system settings.
- **Erase your cloud-synced row:** turn off Settings → Privacy & Legal → Cloud backup — this deletes the server row immediately, from inside the app. (If you have already uninstalled, email us with the date and approximate time of uninstall and we will purge the matching anonymous row.) Note that uninstalling alone does not delete a previously synced copy — that copy is what lets your streak survive a reinstall.
- **Export your data:** local data is human-readable JSON in your device's app sandbox. Cloud data is a single row in our `user_state` table; we will email you the contents on request.

You may also exercise the rights described under the GDPR (EU/UK), the CCPA (California), the Australian Privacy Principles, and any other privacy law applicable to you.

## 9. Changes to this policy

If we change this policy we will update the "Effective" date at the top and, where the change is material, surface a notice in the app on next launch. Material changes include: introducing any new third-party service, broadening the scope of data we collect, or any change that meaningfully affects your privacy posture.

## 10. Contact

Questions, concerns, deletion requests, or anything else privacy-adjacent: **support@dailyimaan.com**.

We are based in Australia. The current operator of Daily Imaan is the developer named in the App Store / Google Play listing.
