# Daily Imaan — Logo Kit

The official Daily Imaan brand mark: a cream / gold crescent with a hanging
pendant above an open book, set on a dark sage rounded square with a subtle
Islamic geometric pattern, and the **Daily Imaan** wordmark in cream serif
below. Generated from the master file at
`artifacts/daily-imaan/assets/images/icon.png` (1024 × 1024).

To regenerate this folder from scratch after editing the master, run from the
project root:

```sh
node scripts/gen-logo-kit.mjs
```

---

## Folder map

```
marketing/logo/
├── master/
│   └── daily-imaan-icon-1024.png   ← the source (do not edit downstream copies)
├── app/
│   ├── icon-{16,24,32,48,64,96,128,144,152,167,180,192,256,384,512,1024}.png
│   ├── apple-touch-icon-{120,152,167,180}.png
│   ├── app-store-1024.png          ← App Store marketing icon (no transparency)
│   └── play-store-512.png          ← Google Play store icon
├── favicon/
│   └── favicon-{16,32,48,192,512}.png
├── social/
│   ├── avatar-400.png              ← Instagram / TikTok / X profile (small)
│   ├── avatar-1080.png             ← Instagram profile (high-res)
│   └── og-1200x630.png             ← Open Graph link-share card
└── favicon.ico                     ← multi-resolution 16/32/48 favicon
```

---

## "I need ___ → use this file"

| You need…                              | Use this file                           |
|----------------------------------------|-----------------------------------------|
| The iOS app icon                       | `app/icon-1024.png`                     |
| The App Store marketing icon           | `app/app-store-1024.png`                |
| The Android launcher icon              | `app/icon-512.png`                      |
| The Google Play store icon             | `app/play-store-512.png`                |
| A favicon for a web page               | `favicon.ico` (root) or `favicon/favicon-32.png` |
| The Apple touch icon for a web page    | `app/apple-touch-icon-180.png`          |
| Your Instagram profile photo           | `social/avatar-1080.png`                |
| A small social avatar (X, TikTok, etc) | `social/avatar-400.png`                 |
| The link-preview card for a tweet/post | `social/og-1200x630.png`                |
| The clean master to edit further       | `master/daily-imaan-icon-1024.png`      |

---

## Specs

- **Master dimensions:** 1024 × 1024 px, sRGB, no alpha
- **Backdrop:** dark sage (`#1A6B4A`), with a subtle tessellated geometric
  pattern at low contrast
- **Mark colors:** cream / soft gold (`#F2F0EC` / `#C8933C`)
- **Wordmark:** "Daily Imaan", serif, cream, set inside the rounded square

---

## Usage rules

1. **Do not stretch.** Always scale uniformly. Square crops only.
2. **Do not recolor.** This logo is one composition; do not isolate or recolor
   any element.
3. **Do not add effects.** No drop shadows, glows, or strokes — the mark
   already sits on its own dark sage rounded card.
4. **Minimum size:** 32 × 32 px on screen. Below that, fall back to the bare
   `app/icon-32.png` or smaller and accept that the wordmark becomes
   illegible.
5. **Do not place on patterned or busy backgrounds.** The mark is designed to
   carry its own card, so put it on calm cream, white, or sage surfaces.
6. **For the App Store icon, do not pre-round corners.** Apple applies the
   superellipse mask at install time. Use `app/app-store-1024.png`.
