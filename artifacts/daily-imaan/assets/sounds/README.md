# `assets/sounds/` — Adhan audio

The in-app **Adhan Sound** picker (Settings → ADHAN SOUND) offers three options:

| Option           | Status     | Required file                |
| ---------------- | ---------- | ---------------------------- |
| Device default   | Always works | (none — uses system sound) |
| Adhan — Makkah   | ✅ Bundled | `assets/sounds/adhan-makkah.mp3` |
| Adhan — Madinah  | ✅ Bundled | `assets/sounds/adhan-madinah.mp3` |

Both files are registered in the `expo-notifications` plugin's `sounds[]`
array in `artifacts/daily-imaan/app.json` and ship in the native build.

When a bundled adhan is missing at runtime, `expo-notifications` silently
falls back to the device's default notification sound — the picker stays
functional, the user just hears the system sound. So the app ships safely
either way; adding the audio is a pure enhancement.

---

## How to enable the bundled adhans

1. **Source two MP3 files** (see "Where to get the audio" below) and place
   them here as exactly:
   - `adhan-makkah.mp3`
   - `adhan-madinah.mp3`

   Each should be **30–60 seconds** ideally — full 2–3 minute adhans work
   but iOS truncates notification sounds to 30s anyway.

2. **Register the files in `app.json`.** Find the `expo-notifications`
   plugin entry and replace the empty `sounds: []` with:
   ```json
   "sounds": [
     "./assets/sounds/adhan-makkah.mp3",
     "./assets/sounds/adhan-madinah.mp3"
   ]
   ```
   The `_comment_sounds` field next to it documents this same step inline.

3. **Rebuild.** Sounds bundled via the plugin are baked into the native
   app at build time — they cannot be added in Expo Go or via OTA update.
   ```
   eas build --profile development --platform ios
   eas build --profile development --platform android
   ```
   For App Store / Play Store releases, run the `production` profile.

That's it — the picker now plays the chosen adhan at every prayer time
where the per-prayer toggle is ON.

---

## Where to get the audio (sourcing + licensing)

**Do not** download a "famous" adhan from YouTube or a random Islamic
app and ship it — almost every well-known adhan recording is **copyrighted**
by the reciter, the broadcaster, or the mosque (the Haramain Sharifain
office in particular has been known to file takedowns).

Vetted permissive sources, in order of safety:

### 1. Self-recorded by a local muezzin who consents (best)
Bulletproof legally. Most mosques will happily record one for a free
non-commercial Islamic app if you ask. Get a one-line written consent
("I, [name], grant Daily Imaan a perpetual royalty-free license to
distribute this recording.") and keep it in your records.

### 2. Wikimedia Commons
Search [commons.wikimedia.org](https://commons.wikimedia.org/) for
"adhan" or "athan". Filter to **CC0** or **CC-BY 4.0**. The file page
will state the license clearly. CC-BY requires you to credit the
uploader somewhere in the app — add the line to `components/AboutContent.tsx`
under SOURCES YOU CAN TRUST.

### 3. Pixabay / Freesound (with care)
Both host CC0 audio. Search for "adhan" or "azan", verify the license on
each individual file's page (not just the search filter). Download the
highest-quality MP3.

### Conversion tips
- iOS prefers `.caf` for notification sounds, but `.mp3` works for both
  iOS and Android when registered through the expo-notifications plugin.
  Stick with `.mp3` for simplicity.
- Trim to 30s with any audio editor (Audacity, free; ffmpeg one-liner:
  `ffmpeg -i input.mp3 -t 30 -c copy adhan-makkah.mp3`).
- Normalize loudness so it doesn't startle the user
  (`ffmpeg -i input.mp3 -filter:a loudnorm output.mp3`).

### What you must NOT use
- Any recording from `assets.aladhan.com`, `islamcan.com`, or similar
  free-download sites whose licensing terms are unstated.
- Any "famous reciter" adhan (Mishary Rashid, al-Ghamdi, etc.) without
  the reciter's explicit written permission.
- Any recording made inside Masjid al-Haram or Masjid an-Nabawi by the
  Haramain media office — those are explicitly copyrighted.

---

## License paper trail

When you add audio here, also add a short note in this README under a
new `## Bundled audio license` section:

```
### adhan-makkah.mp3
- Source URL: https://...
- Uploader / reciter: ...
- License: CC0 / CC-BY 4.0 / written permission (attach .pdf)
- Date acquired: YYYY-MM-DD
```

Apple and Google won't ask, but if a rights-holder ever files a complaint
you'll have everything you need to respond in under five minutes.

---

## Bundled audio license

### adhan-makkah.mp3
- **Source URL**: https://commons.wikimedia.org/wiki/File:Adhan,_Great_Mosque_of_Mecca_-_Jan_21,_2013.webm
- **Original file**: https://upload.wikimedia.org/wikipedia/commons/a/a7/Adhan%2C_Great_Mosque_of_Mecca_-_Jan_21%2C_2013.webm
- **Uploader**: Seyfula Islam (originally posted to YouTube, mirrored to Wikimedia Commons)
- **License**: Creative Commons Attribution 3.0 (CC BY 3.0) — uploader-asserted via the YouTube CC license option (pre-August 2025, when YouTube's CC default was 3.0)
- **Date acquired**: 2026-05-04
- **Processing**: extracted audio from the source `.webm` with ffmpeg, trimmed to 30 s (iOS notification-sound max), 3 s fade-out, EBU R128 loudness-normalised to -16 LUFS, 96 kbps stereo MP3.
- **Attribution shown in app**: see `components/AboutContent.tsx` → "Adhan audio".

### adhan-madinah.mp3
- **Source URL**: https://commons.wikimedia.org/wiki/File:The_Adhan_-_Muslim_Call_to_Prayer_-_Aaqib_Azeez.mp3
- **Original file**: https://upload.wikimedia.org/wikipedia/commons/7/7d/The_Adhan_-_Muslim_Call_to_Prayer_-_Aaqib_Azeez.mp3
- **Uploader / reciter**: Atcovi (Wikimedia user; described as "own work")
- **License**: Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)
- **Date acquired**: 2026-05-04
- **Processing**: trimmed to 30 s, 3 s fade-out, loudness-normalised to -16 LUFS, 96 kbps stereo MP3 (re-encoded via ffmpeg).
- **Attribution shown in app**: see `components/AboutContent.tsx` → "Adhan audio".
- **CC BY-SA reminder**: derivative works of *this audio file* must be released under CC BY-SA 4.0 or compatible. Bundling it inside the closed-source app is "mere aggregation" and does not relicense the rest of the app — but if you remix the recording itself, the remix is share-alike.

> ⚠️ The "Makkah" and "Madinah" labels in Settings are **stylistic** — they do not imply the recordings were captured inside Masjid al-Haram or Masjid an-Nabawi by the Haramain media office (those recordings are explicitly copyrighted and must not be shipped). The Makkah file is from a Wikimedia mirror of an external recording near the Great Mosque; the Madinah file is a generic muezzin recital ("own work" upload). If a rights-holder ever objects to either file, swap it out and update this section.
