# Daily Imaan — Logo system

A complete logo kit for the Daily Imaan brand. Every asset is generated
from a single source script (`scripts/gen-logos.mjs` at the project
root). To regenerate everything after a brand change, run:

```bash
node scripts/gen-logos.mjs
```

---

## Brand colors used in this kit

| Token | Hex |
|---|---|
| Sage (primary) | `#1A6B4A` |
| Cream (warm bg / on-dark fg) | `#F2F0EC` |
| Black (mono) | `#000000` |
| White (mono on color) | `#FFFFFF` |

The wordmark is **Inter SemiBold**, slightly tracked. All text in the
SVG masters is **converted to outlines (paths)** so the SVGs render
identically anywhere — no font installation required.

---

## Folder layout

```
marketing/logo/
├── README.md                 ← this file
├── favicon.ico               ← multi-res 16/32/48 favicon for the web
├── svg/                      ← editable master files (vector)
├── png/                      ← rendered PNGs at multiple sizes
├── app/                      ← icons for the iOS / Android / web app
└── social/                   ← profile avatar + Open Graph image
```

---

## SVG masters (`svg/`)

Four logo layouts × four colorways = sixteen master files. Pick the
colorway that matches the background you're placing the logo on.

| Layout | When to use it |
|---|---|
| `mark-*.svg` | Crescent only — favicons, app icons, tiny placements |
| `wordmark-*.svg` | Wordmark only — when the crescent is shown elsewhere on the same surface |
| `horizontal-*.svg` | Crescent + wordmark side-by-side — primary lockup, headers, footers |
| `vertical-*.svg` | Crescent above wordmark — square contexts, posters, swag |

**Colorways** (suffix on each filename):

| Suffix | Foreground color | Use on… |
|---|---|---|
| `-sage` | `#1A6B4A` | Cream/white/light backgrounds |
| `-cream` | `#F2F0EC` | Sage/dark backgrounds |
| `-black` | `#000000` | Print / monochrome contexts |
| `-white` | `#FFFFFF` | Solid color photos, dark print |

There are also three app-specific SVG masters:

- `app-ios-icon.svg` — sage square with cream crescent (iOS app icon source)
- `app-android-adaptive-fg.svg` — transparent canvas with cream crescent at safe-area scale (Android adaptive icon foreground)
- `app-splash.svg` — sage square with cream crescent, smaller crescent for splash padding
- `social-avatar.svg` — sage square with cream crescent + wordmark stacked
- `social-og.svg` — cream landscape (1200×630) with horizontal lockup + tagline

---

## PNGs (`png/`)

Each logo SVG is rendered to PNG at the sizes typical for that layout:

| Layout | Sizes (px, longest edge) |
|---|---|
| `mark-*` | 64, 128, 256, 512, 1024 |
| `wordmark-*` | 400, 800, 1600 |
| `horizontal-*` | 600, 1200, 2400 |
| `vertical-*` | 400, 800, 1600 |

All PNGs use the SVG's natural aspect ratio with a fully transparent
background (so they composite cleanly onto any surface).

Filename pattern: `<layout>-<colorway>-<longest-edge>.png`
Example: `horizontal-sage-1200.png` is the horizontal lockup in sage,
1200px wide.

---

## App icons (`app/`)

Drop-in assets for the native apps and the web favicon.

| File | Size | Where it goes |
|---|---|---|
| `ios-icon-1024.png` | 1024×1024 | iOS — App Store and home screen master |
| `android-adaptive-foreground-1024.png` | 1024×1024 | Android adaptive icon foreground (transparent — Android composites it onto the sage background defined in `app.json`) |
| `splash-1024.png` | 1024×1024 | Expo splash screen image |
| `apple-touch-icon-180.png` | 180×180 | iOS web "Add to Home Screen" |
| `favicon-16.png` … `favicon-512.png` | 16, 32, 48, 192, 512 | Browser favicons in standard sizes |

The Expo app already references the right files (in
`artifacts/daily-imaan/app.json`):

- `icon` → `assets/images/icon.png` (a copy of `ios-icon-1024.png`)
- `android.adaptiveIcon.foregroundImage` → `assets/images/adaptive-icon.png`
- `splash.image` → `assets/images/splash-icon.png`
- `web.favicon` → `assets/images/favicon.png`

If you regenerate the logo system, the script automatically refreshes
those four bundled assets.

### `favicon.ico`

The multi-resolution `favicon.ico` at `marketing/logo/favicon.ico`
contains 16, 32, and 48 px frames. Most modern browsers prefer the PNG
favicons in `app/`, but `favicon.ico` is still useful for older
browsers and for direct hosting at the site root (e.g. `/favicon.ico`).

---

## Social (`social/`)

| File | Size | Where it goes |
|---|---|---|
| `avatar-1080.png` | 1080×1080 | Instagram / TikTok / Twitter profile photo |
| `avatar-400.png` | 400×400 | Smaller profile photo / forum avatar |
| `og-1200x630.png` | 1200×630 | Open Graph / Twitter card image for any link share |

The profile avatar uses sage background + cream crescent + cream
wordmark. The Open Graph card uses the cream background with the
horizontal sage lockup and the brand tagline `Verbatim. Sourced.
Quiet.` — short, calm, on-brand.

---

## Logo usage rules (lifted from the brand guide)

**Do**

- Place the lockup with at least one "D"-height of clear space on every
  side
- Use the sage colorway on cream/white surfaces; use cream on
  sage/dark surfaces
- Pair the crescent with the wordmark wherever space allows; the mark
  alone is for tight contexts only

**Don't**

- Stretch, skew, or rotate the lockup
- Recolor the wordmark to gold (gold is reserved for the small accent
  rule and the hadith grade chip)
- Set the wordmark in italic or all-caps
- Place the logo over busy photos
- Add gradients, shadows, or outlines to either the mark or the
  wordmark

---

## How a designer should pick the right file

| You need… | Use this |
|---|---|
| The website's tab icon | `app/favicon-32.png` (or `favicon.ico`) |
| An Instagram profile photo | `social/avatar-1080.png` |
| A link preview when sharing dailyimaan.app | `social/og-1200x630.png` |
| A header logo for a landing page (light bg) | `png/horizontal-sage-1200.png` |
| A header logo for a landing page (dark bg) | `png/horizontal-cream-1200.png` |
| A square placement (e.g. footer, product card) | `png/vertical-sage-800.png` |
| The crescent alone (small UI badge) | `png/mark-sage-128.png` |
| Editable vector for Figma / Illustrator | any file in `svg/` |
| Print at large size | `svg/horizontal-sage.svg` (or any layout — vectors scale infinitely) |
