// Render the 6 Daily Imaan IG post templates as 1080x1350 PNG mockups
// from the spec in artifacts/daily-imaan/marketing/CONTENT_BRIEF.md.
// Output: artifacts/daily-imaan/marketing/template-previews/
import sharp from "sharp";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";

const OUT = "artifacts/daily-imaan/marketing/template-previews";
const LOGO = "artifacts/daily-imaan/marketing/logo/master/daily-imaan-icon-1024.png";
const W = 1080, H = 1350;

const SAGE = "#1A6B4A";
const CREAM = "#F2F0EC";
const GOLD = "#C8933C";
const FG = "#111827";
const MUTED = "#6B7280";
const HAIR_CREAM = "#E5E7EB";
const FG_SAGE = CREAM;
const MUTED_SAGE = "#A8C7B8";
const HAIR_SAGE = "#1F3329";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Common header (wordmark + sub-label) and footer (hairline + attribution row).
function frame({ bg, fg, muted, hair, sublabel, attribution = "Verbatim · Saheeh International" }) {
  return {
    bgRect: `<rect width="${W}" height="${H}" fill="${bg}"/>`,
    header: `
      <text x="${W/2}" y="160" text-anchor="middle"
        font-family="Inter" font-weight="600" font-size="34"
        fill="${fg}" letter-spacing="-0.5">Daily Imaan</text>
      <line x1="${W/2 - 18}" y1="186" x2="${W/2 + 18}" y2="186" stroke="${muted}" stroke-width="1.2"/>
      <text x="${W/2}" y="232" text-anchor="middle"
        font-family="Inter" font-weight="500" font-size="18"
        fill="${muted}" letter-spacing="3.5">${esc(sublabel)}</text>
    `,
    footer: `
      <line x1="80" y1="${H - 130}" x2="${W - 80}" y2="${H - 130}" stroke="${hair}" stroke-width="1"/>
      <text x="80" y="${H - 88}" font-family="Inter" font-weight="500" font-size="20"
        fill="${muted}">${esc(attribution)}</text>
      <text x="${W - 80}" y="${H - 88}" text-anchor="end"
        font-family="Inter" font-weight="500" font-size="20"
        fill="${muted}">@dailyimaanapp</text>
    `,
  };
}

function goldRule(y) {
  return `<line x1="${W/2 - 50}" y1="${y}" x2="${W/2 + 50}" y2="${y}" stroke="${GOLD}" stroke-width="2.5"/>`;
}

// --- Template 1: Qur'an Ayah (cream) ---
function t1() {
  const f = frame({ bg: CREAM, fg: SAGE, muted: MUTED, hair: HAIR_CREAM, sublabel: "QUR'AN · SURAH ASH-SHARH 94:6" });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${f.bgRect}${f.header}
    <text x="${W/2}" y="560" text-anchor="middle"
      font-family="Amiri" font-size="100" fill="${FG}" direction="rtl">إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا</text>
    <text x="${W/2}" y="780" text-anchor="middle"
      font-family="EB Garamond" font-style="italic" font-size="44" fill="${FG}">For indeed, with hardship</text>
    <text x="${W/2}" y="838" text-anchor="middle"
      font-family="EB Garamond" font-style="italic" font-size="44" fill="${FG}">[will be] ease.</text>
    ${goldRule(940)}
    <text x="${W/2}" y="1010" text-anchor="middle"
      font-family="Inter" font-weight="500" font-size="24" fill="${MUTED}">Surah Ash-Sharh 94:6 · Saheeh International</text>
    ${f.footer}
  </svg>`;
}

// --- Template 2: Hadith (cream) ---
function t2() {
  const f = frame({ bg: CREAM, fg: SAGE, muted: MUTED, hair: HAIR_CREAM, sublabel: "HADITH · SAHIH AL-BUKHARI" });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${f.bgRect}${f.header}
    <text x="${W/2}" y="500" text-anchor="middle"
      font-family="EB Garamond" font-style="italic" font-size="44" fill="${FG}">"Actions are but by intentions,</text>
    <text x="${W/2}" y="558" text-anchor="middle"
      font-family="EB Garamond" font-style="italic" font-size="44" fill="${FG}">and every man shall have only</text>
    <text x="${W/2}" y="616" text-anchor="middle"
      font-family="EB Garamond" font-style="italic" font-size="44" fill="${FG}">that which he intended."</text>
    <text x="${W/2}" y="710" text-anchor="middle"
      font-family="Inter" font-style="italic" font-size="22" fill="${MUTED}">Narrated by 'Umar ibn al-Khattab</text>
    ${goldRule(840)}
    <text x="${W/2}" y="908" text-anchor="middle"
      font-family="Inter" font-weight="500" font-size="24" fill="${MUTED}">Sahih al-Bukhari 1</text>
    <!-- gold grade chip -->
    <rect x="${W/2 - 60}" y="950" width="120" height="40" rx="20" fill="${GOLD}"/>
    <text x="${W/2}" y="977" text-anchor="middle"
      font-family="Inter" font-weight="600" font-size="18" fill="${FG}" letter-spacing="2">SAHIH</text>
    ${f.footer}
  </svg>`;
}

// --- Template 3: Du'a (cream) ---
function t3() {
  const f = frame({ bg: CREAM, fg: SAGE, muted: MUTED, hair: HAIR_CREAM, sublabel: "DU'A · WHEN ANXIOUS" });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${f.bgRect}${f.header}
    <text x="${W/2}" y="510" text-anchor="middle"
      font-family="Amiri" font-size="86" fill="${FG}" direction="rtl">حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ</text>
    <text x="${W/2}" y="620" text-anchor="middle"
      font-family="EB Garamond" font-style="italic" font-size="32" fill="${MUTED}">Hasbunā Allāhu wa niʿma al-wakīl</text>
    <text x="${W/2}" y="760" text-anchor="middle"
      font-family="EB Garamond" font-style="italic" font-size="40" fill="${FG}">"Sufficient for us is Allah,</text>
    <text x="${W/2}" y="812" text-anchor="middle"
      font-family="EB Garamond" font-style="italic" font-size="40" fill="${FG}">and [He is] the best Disposer of affairs."</text>
    ${goldRule(920)}
    <text x="${W/2}" y="990" text-anchor="middle"
      font-family="Inter" font-weight="500" font-size="24" fill="${MUTED}">Surah Ali 'Imran 3:173 · Saheeh International</text>
    ${f.footer}
  </svg>`;
}

// --- Template 4: Reminder (sage) ---
function t4() {
  const f = frame({ bg: SAGE, fg: FG_SAGE, muted: MUTED_SAGE, hair: HAIR_SAGE, sublabel: "REMINDER · QUR'AN 57:4" });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${f.bgRect}${f.header}
    <text x="${W/2}" y="640" text-anchor="middle"
      font-family="EB Garamond" font-style="italic" font-size="72" fill="${FG_SAGE}">"And He is with you</text>
    <text x="${W/2}" y="730" text-anchor="middle"
      font-family="EB Garamond" font-style="italic" font-size="72" fill="${FG_SAGE}">wherever you are."</text>
    ${goldRule(870)}
    <text x="${W/2}" y="940" text-anchor="middle"
      font-family="Inter" font-weight="500" font-size="24" fill="${MUTED_SAGE}">Surah Al-Hadid 57:4 · Saheeh International</text>
    ${f.footer}
  </svg>`;
}

// --- Template 5: Asma ul-Husna (sage) ---
function t5() {
  const f = frame({ bg: SAGE, fg: FG_SAGE, muted: MUTED_SAGE, hair: HAIR_SAGE, sublabel: "NAMES OF ALLAH · 1 / 99" });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${f.bgRect}${f.header}
    <text x="${W/2}" y="600" text-anchor="middle"
      font-family="Amiri" font-size="180" fill="${FG_SAGE}" direction="rtl">ٱللَّهُ</text>
    <text x="${W/2}" y="720" text-anchor="middle"
      font-family="Inter" font-weight="600" font-size="38" fill="${FG_SAGE}" letter-spacing="2.5">Allāh</text>
    <text x="${W/2}" y="820" text-anchor="middle"
      font-family="EB Garamond" font-style="italic" font-size="40" fill="${FG_SAGE}">"The God — the only one</text>
    <text x="${W/2}" y="872" text-anchor="middle"
      font-family="EB Garamond" font-style="italic" font-size="40" fill="${FG_SAGE}">worthy of worship."</text>
    ${goldRule(960)}
    <text x="${W/2}" y="1030" text-anchor="middle"
      font-family="Inter" font-weight="500" font-size="24" fill="${MUTED_SAGE}">Surah Al-Fatihah 1:1 · Saheeh International</text>
    ${f.footer}
  </svg>`;
}

// --- Template 6: App Feature (sage) — only template with logo on canvas ---
async function t6() {
  const f = frame({
    bg: SAGE, fg: FG_SAGE, muted: MUTED_SAGE, hair: HAIR_SAGE,
    sublabel: "THE APP · STREAK", attribution: "A daily Islamic companion",
  });
  const logoSize = 620;
  const logoBuf = await sharp(LOGO).resize(logoSize, logoSize).png().toBuffer();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${f.bgRect}${f.header}
    <text x="${W/2}" y="1010" text-anchor="middle"
      font-family="Inter" font-weight="600" font-size="46" fill="${FG_SAGE}">A gentle Streak. Never a guilt trip.</text>
    <text x="${W/2}" y="1080" text-anchor="middle"
      font-family="EB Garamond" font-style="italic" font-size="30" fill="${MUTED_SAGE}">One small habit, kept. That's the whole feature.</text>
    ${f.footer}
  </svg>`;
  // Composite the logo image at center between header and headline (centered around y=620)
  const baseSvg = Buffer.from(svg);
  return await sharp(baseSvg)
    .composite([{ input: logoBuf, top: 310, left: Math.round((W - logoSize) / 2) }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function renderSvgToFile(svg, outPath) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outPath);
}

async function run() {
  await mkdir(OUT, { recursive: true });
  await renderSvgToFile(t1(), join(OUT, "template-1-quran.png"));
  await renderSvgToFile(t2(), join(OUT, "template-2-hadith.png"));
  await renderSvgToFile(t3(), join(OUT, "template-3-dua.png"));
  await renderSvgToFile(t4(), join(OUT, "template-4-reminder.png"));
  await renderSvgToFile(t5(), join(OUT, "template-5-asma.png"));
  await writeFile(join(OUT, "template-6-app-feature.png"), await t6());
  console.log("Mockups generated at", OUT);
}
run().catch(e => { console.error(e); process.exit(1); });
