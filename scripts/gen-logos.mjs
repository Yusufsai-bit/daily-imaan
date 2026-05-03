import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import opentype from 'opentype.js';
import pngToIco from 'png-to-ico';

const ROOT = path.resolve('artifacts/daily-imaan/marketing/logo');
const APP_ASSETS = path.resolve('artifacts/daily-imaan/assets/images');
const FONT = path.resolve(process.env.HOME, '.fonts/Inter-SemiBold.ttf');

const SAGE = '#1A6B4A';
const CREAM = '#F2F0EC';

const dirs = ['svg', 'png', 'app', 'social'];
for (const d of dirs) fs.mkdirSync(path.join(ROOT, d), { recursive: true });

const font = opentype.parse(fs.readFileSync(FONT).buffer);

function buildTextPath(text, fontSize, x, y) {
  const scale = fontSize / font.unitsPerEm;
  const trackingEm = 0.005;
  const trackingUnits = trackingEm * font.unitsPerEm;
  const combined = new opentype.Path();
  let cursor = x;
  let prev = null;
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    if (prev) cursor += font.getKerningValue(prev, glyph) * scale;
    const gp = glyph.getPath(cursor, y, fontSize);
    combined.extend(gp);
    cursor += glyph.advanceWidth * scale + trackingUnits * scale;
    prev = glyph;
  }
  return combined;
}

function textPath(text, fontSize, x, y, color) {
  const p = buildTextPath(text, fontSize, x, y);
  return `<path d="${p.toPathData(3)}" fill="${color}"/>`;
}

function textMetrics(text, fontSize) {
  const p = buildTextPath(text, fontSize, 0, 0);
  const bb = p.getBoundingBox();
  return { width: bb.x2 - bb.x1, height: bb.y2 - bb.y1, x1: bb.x1, y1: bb.y1, x2: bb.x2, y2: bb.y2 };
}

function crescentMaskDef(id) {
  return `<defs>
    <mask id="${id}" maskUnits="userSpaceOnUse">
      <rect x="0" y="0" width="200" height="200" fill="black"/>
      <circle cx="100" cy="100" r="85" fill="white"/>
      <circle cx="116" cy="94" r="76" fill="black"/>
    </mask>
  </defs>`;
}

function crescentRect(maskId, color, x = 0, y = 0, size = 200) {
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${color}" mask="url(#${maskId})"/>`;
}

function svgWrap(viewBox, body, bg = null) {
  const bgRect = bg ? `<rect x="0" y="0" width="100%" height="100%" fill="${bg}"/>` : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" xmlns:xlink="http://www.w3.org/1999/xlink">${bgRect}${body}</svg>`;
}

function makeMarkSvg(color, bg = null) {
  const body = `${crescentMaskDef('m')}${crescentRect('m', color)}`;
  return svgWrap('0 0 200 200', body, bg);
}

function makeWordmarkSvg(color, bg = null) {
  const fontSize = 120;
  const m = textMetrics('Daily Imaan', fontSize);
  const padX = 40;
  const padY = 40;
  const w = Math.ceil(m.width + padX * 2);
  const h = Math.ceil(m.height + padY * 2);
  const x = padX - m.x1;
  const y = padY - m.y1;
  const body = textPath('Daily Imaan', fontSize, x, y, color);
  return svgWrap(`0 0 ${w} ${h}`, body, bg);
}

function makeHorizontalSvg(color, bg = null) {
  const fontSize = 120;
  const m = textMetrics('Daily Imaan', fontSize);
  const markSize = Math.ceil(m.height * 1.55);
  const gap = Math.ceil(m.height * 0.45);
  const padX = 40;
  const padY = 40;
  const contentW = markSize + gap + Math.ceil(m.width);
  const contentH = Math.max(markSize, Math.ceil(m.height));
  const w = contentW + padX * 2;
  const h = contentH + padY * 2;
  const markY = padY + (contentH - markSize) / 2;
  const textY = padY + (contentH - m.height) / 2 - m.y1;
  const textX = padX + markSize + gap - m.x1;
  const maskId = 'mh';
  const body = `${crescentMaskDef(maskId)}
    <g transform="translate(${padX},${markY}) scale(${markSize / 200})">
      <rect x="0" y="0" width="200" height="200" fill="${color}" mask="url(#${maskId})"/>
    </g>
    ${textPath('Daily Imaan', fontSize, textX, textY, color)}`;
  return svgWrap(`0 0 ${w} ${h}`, body, bg);
}

function makeVerticalSvg(color, bg = null) {
  const fontSize = 100;
  const m = textMetrics('Daily Imaan', fontSize);
  const markSize = 280;
  const gap = 60;
  const padX = 40;
  const padY = 40;
  const contentW = Math.max(markSize, Math.ceil(m.width));
  const contentH = markSize + gap + Math.ceil(m.height);
  const w = contentW + padX * 2;
  const h = contentH + padY * 2;
  const markX = padX + (contentW - markSize) / 2;
  const textX = padX + (contentW - m.width) / 2 - m.x1;
  const textY = padY + markSize + gap - m.y1;
  const maskId = 'mv';
  const body = `${crescentMaskDef(maskId)}
    <g transform="translate(${markX},${padY}) scale(${markSize / 200})">
      <rect x="0" y="0" width="200" height="200" fill="${color}" mask="url(#${maskId})"/>
    </g>
    ${textPath('Daily Imaan', fontSize, textX, textY, color)}`;
  return svgWrap(`0 0 ${w} ${h}`, body, bg);
}

function makeAppIconSvg(bgColor, fgColor, marginRatio = 0.22) {
  const size = 1024;
  const margin = Math.round(size * marginRatio);
  const inner = size - margin * 2;
  const maskId = 'ai';
  const body = `${crescentMaskDef(maskId)}
    <rect x="0" y="0" width="${size}" height="${size}" fill="${bgColor}"/>
    <g transform="translate(${margin},${margin}) scale(${inner / 200})">
      <rect x="0" y="0" width="200" height="200" fill="${fgColor}" mask="url(#${maskId})"/>
    </g>`;
  return svgWrap(`0 0 ${size} ${size}`, body);
}

function makeAdaptiveForegroundSvg(fgColor) {
  const size = 1024;
  const margin = Math.round(size * 0.30);
  const inner = size - margin * 2;
  const maskId = 'af';
  const body = `${crescentMaskDef(maskId)}
    <g transform="translate(${margin},${margin}) scale(${inner / 200})">
      <rect x="0" y="0" width="200" height="200" fill="${fgColor}" mask="url(#${maskId})"/>
    </g>`;
  return svgWrap(`0 0 ${size} ${size}`, body);
}

function makeSocialAvatarSvg() {
  const size = 1080;
  const fontSize = 88;
  const m = textMetrics('Daily Imaan', fontSize);
  const markSize = 360;
  const gap = 40;
  const totalH = markSize + gap + m.height;
  const startY = (size - totalH) / 2;
  const markX = (size - markSize) / 2;
  const textX = (size - m.width) / 2 - m.x1;
  const textY = startY + markSize + gap - m.y1;
  const maskId = 'sa';
  const body = `${crescentMaskDef(maskId)}
    <rect x="0" y="0" width="${size}" height="${size}" fill="${SAGE}"/>
    <g transform="translate(${markX},${startY}) scale(${markSize / 200})">
      <rect x="0" y="0" width="200" height="200" fill="${CREAM}" mask="url(#${maskId})"/>
    </g>
    ${textPath('Daily Imaan', fontSize, textX, textY, CREAM)}`;
  return svgWrap(`0 0 ${size} ${size}`, body);
}

function makeOgSvg() {
  const w = 1200, h = 630;
  const fontSize = 104;
  const m = textMetrics('Daily Imaan', fontSize);
  const markSize = 200;
  const gap = 36;
  const contentW = markSize + gap + m.width;
  const startX = (w - contentW) / 2;
  const markY = (h - markSize) / 2 - 20;
  const textX = startX + markSize + gap - m.x1;
  const textY = (h - m.height) / 2 - m.y1 - 20;
  const tagFont = 32;
  const tag = 'Verbatim. Sourced. Quiet.';
  const tm = textMetrics(tag, tagFont);
  const tagX = (w - tm.width) / 2 - tm.x1;
  const tagY = h / 2 + 100 - tm.y1;
  const maskId = 'og';
  const body = `${crescentMaskDef(maskId)}
    <rect x="0" y="0" width="${w}" height="${h}" fill="${CREAM}"/>
    <g transform="translate(${startX},${markY}) scale(${markSize / 200})">
      <rect x="0" y="0" width="200" height="200" fill="${SAGE}" mask="url(#${maskId})"/>
    </g>
    ${textPath('Daily Imaan', fontSize, textX, textY, SAGE)}
    ${textPath(tag, tagFont, tagX, tagY, '#6B7280')}`;
  return svgWrap(`0 0 ${w} ${h}`, body);
}

async function svgToPng(svgString, outPath, width, height = null) {
  const buf = Buffer.from(svgString);
  let pipeline = sharp(buf, { density: 384 });
  if (height) pipeline = pipeline.resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
  else pipeline = pipeline.resize({ width });
  await pipeline.png().toFile(outPath);
}

async function svgToPngFlat(svgString, outPath, width, height, bgColor) {
  const { r, g, b } = hexRgb(bgColor);
  const buf = Buffer.from(svgString);
  await sharp(buf, { density: 384 })
    .resize(width, height, { fit: 'contain', background: { r, g, b, alpha: 1 } })
    .flatten({ background: { r, g, b } })
    .png()
    .toFile(outPath);
}

function hexRgb(hex) {
  const h = hex.replace('#', '');
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

const colorways = [
  { name: 'sage', color: SAGE },
  { name: 'cream', color: CREAM },
  { name: 'black', color: '#000000' },
  { name: 'white', color: '#FFFFFF' },
];

const variants = [
  { kind: 'mark', make: makeMarkSvg, pngWidths: [64, 128, 256, 512, 1024] },
  { kind: 'wordmark', make: makeWordmarkSvg, pngWidths: [400, 800, 1600] },
  { kind: 'horizontal', make: makeHorizontalSvg, pngWidths: [600, 1200, 2400] },
  { kind: 'vertical', make: makeVerticalSvg, pngWidths: [400, 800, 1600] },
];

console.log('Generating SVG masters and PNGs...');

const generatedSvgs = [];
const generatedPngs = [];

for (const v of variants) {
  for (const c of colorways) {
    const name = `${v.kind}-${c.name}`;
    const svg = v.make(c.color);
    const svgPath = path.join(ROOT, 'svg', `${name}.svg`);
    fs.writeFileSync(svgPath, svg);
    generatedSvgs.push(svgPath);
    for (const w of v.pngWidths) {
      const pngPath = path.join(ROOT, 'png', `${name}-${w}.png`);
      await svgToPng(svg, pngPath, w);
      generatedPngs.push(pngPath);
    }
  }
}

console.log('Generating app-specific icons...');

const iosIconSvg = makeAppIconSvg(SAGE, CREAM, 0.22);
fs.writeFileSync(path.join(ROOT, 'svg', 'app-ios-icon.svg'), iosIconSvg);
await svgToPng(iosIconSvg, path.join(ROOT, 'app', 'ios-icon-1024.png'), 1024, 1024);

const adaptiveFgSvg = makeAdaptiveForegroundSvg(CREAM);
fs.writeFileSync(path.join(ROOT, 'svg', 'app-android-adaptive-fg.svg'), adaptiveFgSvg);
await svgToPng(adaptiveFgSvg, path.join(ROOT, 'app', 'android-adaptive-foreground-1024.png'), 1024, 1024);

const splashSvg = makeAppIconSvg(SAGE, CREAM, 0.30);
fs.writeFileSync(path.join(ROOT, 'svg', 'app-splash.svg'), splashSvg);
await svgToPng(splashSvg, path.join(ROOT, 'app', 'splash-1024.png'), 1024, 1024);

await svgToPng(iosIconSvg, path.join(ROOT, 'app', 'apple-touch-icon-180.png'), 180, 180);

for (const w of [16, 32, 48, 192, 512]) {
  await svgToPng(iosIconSvg, path.join(ROOT, 'app', `favicon-${w}.png`), w, w);
}

console.log('Building favicon.ico...');
const icoBufs = await Promise.all([16, 32, 48].map(w => fs.promises.readFile(path.join(ROOT, 'app', `favicon-${w}.png`))));
const icoBuf = await pngToIco(icoBufs);
fs.writeFileSync(path.join(ROOT, 'favicon.ico'), icoBuf);

console.log('Generating social avatar (IG/TikTok profile)...');
const avatarSvg = makeSocialAvatarSvg();
fs.writeFileSync(path.join(ROOT, 'svg', 'social-avatar.svg'), avatarSvg);
await svgToPng(avatarSvg, path.join(ROOT, 'social', 'avatar-1080.png'), 1080, 1080);
await svgToPng(avatarSvg, path.join(ROOT, 'social', 'avatar-400.png'), 400, 400);

console.log('Generating Open Graph image (1200x630)...');
const ogSvg = makeOgSvg();
fs.writeFileSync(path.join(ROOT, 'svg', 'social-og.svg'), ogSvg);
await svgToPng(ogSvg, path.join(ROOT, 'social', 'og-1200x630.png'), 1200, 630);

console.log('Updating Expo app assets (icon.png, adaptive-icon.png, splash-icon.png)...');
fs.copyFileSync(path.join(ROOT, 'app', 'ios-icon-1024.png'), path.join(APP_ASSETS, 'icon.png'));
fs.copyFileSync(path.join(ROOT, 'app', 'android-adaptive-foreground-1024.png'), path.join(APP_ASSETS, 'adaptive-icon.png'));
fs.copyFileSync(path.join(ROOT, 'app', 'splash-1024.png'), path.join(APP_ASSETS, 'splash-icon.png'));
fs.copyFileSync(path.join(ROOT, 'app', 'favicon-512.png'), path.join(APP_ASSETS, 'favicon.png'));

console.log('Done.');
console.log(`SVGs: ${generatedSvgs.length}`);
console.log(`PNGs: ${generatedPngs.length}`);
