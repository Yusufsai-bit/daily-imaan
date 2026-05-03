// Generate Daily Imaan logo kit from the master icon.
// Source: artifacts/daily-imaan/assets/images/icon.png (1024x1024 sage composition)
// Output: artifacts/daily-imaan/marketing/logo/
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";

const ROOT = "artifacts/daily-imaan";
const SRC = join(ROOT, "assets/images/icon.png");
const OUT = join(ROOT, "marketing/logo");
const SAGE = "#1A6B4A";
const CREAM = "#F2F0EC";

const APP_SIZES = [16, 24, 32, 48, 64, 96, 128, 144, 152, 167, 180, 192, 256, 384, 512, 1024];
const SOCIAL_SIZES = [400, 1080];

async function ensureClean() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(join(OUT, "app"), { recursive: true });
  await mkdir(join(OUT, "social"), { recursive: true });
  await mkdir(join(OUT, "favicon"), { recursive: true });
  await mkdir(join(OUT, "master"), { recursive: true });
}

async function resizeSquare(size, outPath) {
  await mkdir(dirname(outPath), { recursive: true });
  await sharp(SRC).resize(size, size, { kernel: "lanczos3" }).png({ compressionLevel: 9 }).toFile(outPath);
}

async function buildFaviconIco() {
  const tmp16 = join(OUT, "favicon", "_tmp-16.png");
  const tmp32 = join(OUT, "favicon", "_tmp-32.png");
  const tmp48 = join(OUT, "favicon", "_tmp-48.png");
  await resizeSquare(16, tmp16);
  await resizeSquare(32, tmp32);
  await resizeSquare(48, tmp48);
  const ico = await pngToIco([tmp16, tmp32, tmp48]);
  await writeFile(join(OUT, "favicon.ico"), ico);
  await rm(tmp16); await rm(tmp32); await rm(tmp48);
}

async function buildOgCard() {
  // 1200x630 OG card: solid sage background, icon centered at 520x520
  const iconSize = 520;
  const iconBuf = await sharp(SRC).resize(iconSize, iconSize, { kernel: "lanczos3" }).png().toBuffer();
  await sharp({
    create: { width: 1200, height: 630, channels: 3, background: SAGE },
  })
    .composite([{ input: iconBuf, top: Math.round((630 - iconSize) / 2), left: Math.round((1200 - iconSize) / 2) }])
    .png({ compressionLevel: 9 })
    .toFile(join(OUT, "social", "og-1200x630.png"));
}

async function buildAppleTouch() {
  // Apple touch icons: 120, 152, 167, 180
  for (const s of [120, 152, 167, 180]) {
    await resizeSquare(s, join(OUT, "app", `apple-touch-icon-${s}.png`));
  }
}

async function buildAppStoreIcon() {
  // App Store / iOS marketing 1024 (no transparency, no rounded corners — Apple adds them)
  await sharp(SRC).resize(1024, 1024, { kernel: "lanczos3" }).flatten({ background: SAGE }).png().toFile(join(OUT, "app", "app-store-1024.png"));
}

async function buildAndroidPlayStore() {
  // Google Play 512x512 feature graphic-friendly icon
  await sharp(SRC).resize(512, 512, { kernel: "lanczos3" }).flatten({ background: SAGE }).png().toFile(join(OUT, "app", "play-store-512.png"));
}

async function run() {
  await ensureClean();

  // Master copy at 1024 (verbatim)
  await sharp(SRC).png().toFile(join(OUT, "master", "daily-imaan-icon-1024.png"));

  // App icon size matrix
  for (const s of APP_SIZES) {
    await resizeSquare(s, join(OUT, "app", `icon-${s}.png`));
  }

  // Specific platform deliverables
  await buildAppStoreIcon();
  await buildAndroidPlayStore();
  await buildAppleTouch();

  // Favicons (PNG + multi-res ICO)
  for (const s of [16, 32, 48, 192, 512]) {
    await resizeSquare(s, join(OUT, "favicon", `favicon-${s}.png`));
  }
  await buildFaviconIco();

  // Social avatars
  for (const s of SOCIAL_SIZES) {
    await resizeSquare(s, join(OUT, "social", `avatar-${s}.png`));
  }

  // Open Graph card
  await buildOgCard();

  console.log("Logo kit generated at", OUT);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
