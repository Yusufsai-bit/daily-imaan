// Render the 5 Daily Imaan IG post templates as 1080x1350 PNG mockups
// matching the reference style: bold uppercase DAILY IMAAN header,
// non-italic English serif, centered 2-line footer (source / handle).
// Output: artifacts/daily-imaan/marketing/template-previews/
import sharp from "sharp";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";

const OUT = "artifacts/daily-imaan/marketing/template-previews";
const LOGO = "artifacts/daily-imaan/marketing/logo/master/daily-imaan-icon-1024.png";
const W = 1080, H = 1350;

const SAGE = "#1A6B4A";
const CREAM = "#F2F0EC";
const GOLD = "#C8933C";
const FG = "#1F2937";
const MUTED = "#6B7280";
const HAIR_CREAM = "#D6D2CC";
const FG_SAGE = CREAM;
const MUTED_SAGE = "#A8C7B8";
const HAIR_SAGE = "#2A4F3E";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Subtle radial geometric watermark behind the body. Eight-petal rosette.
function ornament({ stroke, opacity = 0.06, cx = W / 2, cy = 640, r = 240 }) {
  const petals = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const px = cx + Math.cos(a) * r * 0.55;
    const py = cy + Math.sin(a) * r * 0.55;
    petals.push(`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r * 0.55}" fill="none" stroke="${stroke}" stroke-width="1.4"/>`);
  }
  return `<g opacity="${opacity}">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="1.4"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.7}" fill="none" stroke="${stroke}" stroke-width="1.2"/>
    ${petals.join("")}
  </g>`;
}

function frame({ bg, fg, muted, hair, sublabel, footerSource, headerColor, watermarkStroke }) {
  const orn = ornament({ stroke: watermarkStroke });
  return {
    bgRect: `<rect width="${W}" height="${H}" fill="${bg}"/>`,
    watermark: orn,
    header: `
      <text x="${W/2}" y="160" text-anchor="middle"
        font-family="Inter" font-weight="700" font-size="28"
        fill="${headerColor}" letter-spacing="6">DAILY IMAAN</text>
      <text x="${W/2}" y="220" text-anchor="middle"
        font-family="Inter" font-weight="500" font-size="16"
        fill="${muted}" letter-spacing="3.5">${esc(sublabel)}</text>
    `,
    footer: `
      <line x1="180" y1="${H - 200}" x2="${W - 180}" y2="${H - 200}" stroke="${hair}" stroke-width="1"/>
      <text x="${W/2}" y="${H - 140}" text-anchor="middle"
        font-family="Inter" font-weight="600" font-size="18"
        fill="${headerColor}" letter-spacing="3">${esc(footerSource)}</text>
      <text x="${W/2}" y="${H - 100}" text-anchor="middle"
        font-family="Inter" font-weight="600" font-size="18"
        fill="${fg}" letter-spacing="3">@DAILYIMAANAPP</text>
    `,
  };
}

function goldRule(y) {
  return `<line x1="${W/2 - 40}" y1="${y}" x2="${W/2 + 40}" y2="${y}" stroke="${GOLD}" stroke-width="2.5"/>`;
}

// --- Template 1: Qur'an Ayah (cream) ---
function t1() {
  const f = frame({
    bg: CREAM, fg: FG, muted: MUTED, hair: HAIR_CREAM,
    sublabel: "QUR'AN · SURAH QAF 50:16", footerSource: "SAHEEH INTERNATIONAL",
    headerColor: SAGE, watermarkStroke: SAGE,
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${f.bgRect}${f.watermark}${f.header}
    <text x="${W/2}" y="600" text-anchor="middle"
      font-family="Amiri" font-size="72" fill="${FG}" direction="rtl">وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ ٱلْوَرِيدِ</text>
    ${goldRule(720)}
    <text x="${W/2}" y="850" text-anchor="middle"
      font-family="EB Garamond" font-weight="400" font-size="42" fill="${FG}">And We are closer to him than [his]</text>
    <text x="${W/2}" y="906" text-anchor="middle"
      font-family="EB Garamond" font-weight="400" font-size="42" fill="${FG}">jugular vein.</text>
    ${f.footer}
  </svg>`;
}

// --- Template 2: Hadith (cream) ---
function t2() {
  const f = frame({
    bg: CREAM, fg: FG, muted: MUTED, hair: HAIR_CREAM,
    sublabel: "HADITH · BUKHARI 1", footerSource: "SUNNAH.COM",
    headerColor: SAGE, watermarkStroke: SAGE,
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${f.bgRect}${f.watermark}${f.header}
    <text x="${W/2}" y="540" text-anchor="middle"
      font-family="EB Garamond" font-weight="400" font-size="42" fill="${FG}">"Actions are but by intentions,</text>
    <text x="${W/2}" y="596" text-anchor="middle"
      font-family="EB Garamond" font-weight="400" font-size="42" fill="${FG}">and every man shall have only</text>
    <text x="${W/2}" y="652" text-anchor="middle"
      font-family="EB Garamond" font-weight="400" font-size="42" fill="${FG}">that which he intended."</text>
    <text x="${W/2}" y="740" text-anchor="middle"
      font-family="Inter" font-weight="400" font-size="20" fill="${MUTED}">Narrated by 'Umar ibn al-Khattab</text>
    ${goldRule(810)}
    <rect x="${W/2 - 60}" y="860" width="120" height="40" rx="20" fill="${GOLD}"/>
    <text x="${W/2}" y="887" text-anchor="middle"
      font-family="Inter" font-weight="600" font-size="18" fill="${FG}" letter-spacing="2">SAHIH</text>
    ${f.footer}
  </svg>`;
}

// --- Template 3: Du'a (cream) ---
function t3() {
  const f = frame({
    bg: CREAM, fg: FG, muted: MUTED, hair: HAIR_CREAM,
    sublabel: "DU'A · WHEN ANXIOUS · ALI 'IMRAN 3:173", footerSource: "SAHEEH INTERNATIONAL",
    headerColor: SAGE, watermarkStroke: SAGE,
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${f.bgRect}${f.watermark}${f.header}
    <text x="${W/2}" y="540" text-anchor="middle"
      font-family="Amiri" font-size="72" fill="${FG}" direction="rtl">حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ</text>
    <text x="${W/2}" y="640" text-anchor="middle"
      font-family="EB Garamond" font-style="italic" font-size="30" fill="${MUTED}">Hasbunā Allāhu wa niʿma al-wakīl</text>
    ${goldRule(720)}
    <text x="${W/2}" y="830" text-anchor="middle"
      font-family="EB Garamond" font-weight="400" font-size="38" fill="${FG}">"Sufficient for us is Allah,</text>
    <text x="${W/2}" y="882" text-anchor="middle"
      font-family="EB Garamond" font-weight="400" font-size="38" fill="${FG}">and [He is] the best Disposer</text>
    <text x="${W/2}" y="934" text-anchor="middle"
      font-family="EB Garamond" font-weight="400" font-size="38" fill="${FG}">of affairs."</text>
    ${f.footer}
  </svg>`;
}

// --- Template 4: Asma ul-Husna (sage) ---
function t4() {
  const f = frame({
    bg: SAGE, fg: FG_SAGE, muted: MUTED_SAGE, hair: HAIR_SAGE,
    sublabel: "NAMES OF ALLAH · 1 / 99", footerSource: "SAHEEH INTERNATIONAL",
    headerColor: FG_SAGE, watermarkStroke: CREAM,
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${f.bgRect}${f.watermark}${f.header}
    <text x="${W/2}" y="600" text-anchor="middle"
      font-family="Amiri" font-size="180" fill="${FG_SAGE}" direction="rtl">ٱللَّهُ</text>
    <text x="${W/2}" y="720" text-anchor="middle"
      font-family="Inter" font-weight="600" font-size="34" fill="${FG_SAGE}" letter-spacing="3.5">ALLĀH</text>
    ${goldRule(800)}
    <text x="${W/2}" y="900" text-anchor="middle"
      font-family="EB Garamond" font-weight="400" font-size="36" fill="${FG_SAGE}">"The God — the only one</text>
    <text x="${W/2}" y="952" text-anchor="middle"
      font-family="EB Garamond" font-weight="400" font-size="36" fill="${FG_SAGE}">worthy of worship."</text>
    ${f.footer}
  </svg>`;
}

// --- Template 5: App Feature (sage) — only template with logo on canvas ---
async function t5() {
  const f = frame({
    bg: SAGE, fg: FG_SAGE, muted: MUTED_SAGE, hair: HAIR_SAGE,
    sublabel: "THE APP · STREAK", footerSource: "A DAILY ISLAMIC COMPANION",
    headerColor: FG_SAGE, watermarkStroke: CREAM,
  });
  const logoSize = 580;
  const logoBuf = await sharp(LOGO).resize(logoSize, logoSize).png().toBuffer();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${f.bgRect}${f.header}
    <text x="${W/2}" y="970" text-anchor="middle"
      font-family="Inter" font-weight="600" font-size="44" fill="${FG_SAGE}">A gentle Streak. Never a guilt trip.</text>
    <text x="${W/2}" y="1030" text-anchor="middle"
      font-family="EB Garamond" font-style="italic" font-size="28" fill="${MUTED_SAGE}">One small habit, kept. That's the whole feature.</text>
    ${f.footer}
  </svg>`;
  return await sharp(Buffer.from(svg))
    .composite([{ input: logoBuf, top: 290, left: Math.round((W - logoSize) / 2) }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function renderSvgToFile(svg, outPath) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outPath);
}

async function run() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
  await renderSvgToFile(t1(), join(OUT, "template-1-quran.png"));
  await renderSvgToFile(t2(), join(OUT, "template-2-hadith.png"));
  await renderSvgToFile(t3(), join(OUT, "template-3-dua.png"));
  await renderSvgToFile(t4(), join(OUT, "template-4-asma.png"));
  await writeFile(join(OUT, "template-5-app-feature.png"), await t5());
  console.log("Mockups generated at", OUT);
}
run().catch(e => { console.error(e); process.exit(1); });
