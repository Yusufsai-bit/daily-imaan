/**
 * Content-integrity gate: verifies every bundled Qur'an string against the
 * Quran.com Foundation API — the source the data files claim verbatim
 * provenance from.
 *
 *   node scripts/verify-quran-text.mjs
 *
 * Checks:
 *   1. data/quranFullData.ts  — all 6,236 ayat, Arabic (text_uthmani) and
 *      English (Saheeh International, translation id 20).
 *   2. data/featuredAyat.ts   — the curated daily-rotation pool, both fields.
 *
 * English normalization: the API embeds footnote markup
 * (<sup foot_note=...>N</sup>); the bundled data stripped markers but kept
 * the translators' bracketed clarifications, so tags are stripped and
 * whitespace collapsed on both sides before comparing.
 *
 * Exit code 0 = everything verbatim; 1 = any mismatch (printed).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function extractArrayLiteral(source, marker) {
  const at = source.indexOf(marker);
  if (at < 0) throw new Error(`marker not found: ${marker}`);
  const start = source.indexOf("[", at);
  const end = source.lastIndexOf("];");
  if (start < 0 || end < 0) throw new Error(`array bounds not found for ${marker}`);
  // Data files hold plain literals (verified: no code, only arrays of
  // objects), so evaluating the slice is safe and avoids a TS toolchain.
  return new Function(`return ${source.slice(start, end + 1)}`)();
}

const quranFull = extractArrayLiteral(
  readFileSync(join(root, "data", "quranFullData.ts"), "utf8"),
  "QURAN_FULL",
);
const featured = extractArrayLiteral(
  readFileSync(join(root, "data", "featuredAyat.ts"), "utf8"),
  "FEATURED_AYAT",
);

function normalizeEnglish(text) {
  return String(text)
    .replace(/<[^>]*>[\s\S]*?<\/[^>]*>|<[^>]*>/g, (m) =>
      // Drop <sup ...>N</sup> footnote markers entirely; strip other tags
      // but keep their inner text.
      /^<sup/i.test(m) ? "" : m.replace(/<[^>]*>/g, ""),
    )
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .normalize("NFC")
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeArabic(text) {
  // NFC + whitespace collapse ONLY. Unicode normalization does not change
  // letters or diacritics — it canonicalizes combining-mark encoding (the
  // same rendered glyphs can be stored in several byte sequences), which is
  // exactly the kind of difference a copy/paste pipeline introduces. Any
  // real textual difference still fails.
  return String(text).normalize("NFC").replace(/\s+/g, " ").trim();
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

console.log("Fetching canonical text from api.quran.com …");
const [uthmaniRes, translationRes] = await Promise.all([
  fetchJson("https://api.quran.com/api/v4/quran/verses/uthmani"),
  fetchJson("https://api.quran.com/api/v4/quran/translations/20"),
]);

const apiArabicByKey = new Map(
  uthmaniRes.verses.map((v) => [v.verse_key, v.text_uthmani]),
);
// translations/20 returns entries aligned with canonical verse order —
// re-key them via the uthmani verse list (same order, same length).
if (translationRes.translations.length !== uthmaniRes.verses.length) {
  throw new Error(
    `API shape changed: ${translationRes.translations.length} translations vs ${uthmaniRes.verses.length} verses`,
  );
}
const apiEnglishByKey = new Map(
  uthmaniRes.verses.map((v, i) => [v.verse_key, translationRes.translations[i].text]),
);

const problems = [];

// ---- 1. Full dataset --------------------------------------------------
let checked = 0;
for (const surah of quranFull) {
  for (const ayah of surah.ayahs) {
    const key = `${surah.number}:${ayah.n}`;
    checked += 1;
    const apiArabic = apiArabicByKey.get(key);
    const apiEnglish = apiEnglishByKey.get(key);
    if (apiArabic === undefined) {
      problems.push({ where: `quranFullData ${key}`, field: "arabic", issue: "missing from API response" });
      continue;
    }
    if (normalizeArabic(ayah.a) !== normalizeArabic(apiArabic)) {
      problems.push({ where: `quranFullData ${key}`, field: "arabic", local: ayah.a, api: apiArabic });
    }
    if (normalizeEnglish(ayah.e) !== normalizeEnglish(apiEnglish)) {
      problems.push({ where: `quranFullData ${key}`, field: "english", local: ayah.e, api: apiEnglish });
    }
  }
}
console.log(`quranFullData: ${checked} ayat checked.`);
if (checked !== 6236) {
  problems.push({ where: "quranFullData", field: "count", issue: `expected 6236 ayat, found ${checked}` });
}

// ---- 2. Featured pool --------------------------------------------------
for (const f of featured) {
  const key = `${f.surahId}:${f.ayahNumber}`;
  const apiArabic = apiArabicByKey.get(key);
  const apiEnglish = apiEnglishByKey.get(key);
  if (apiArabic === undefined) {
    problems.push({ where: `featuredAyat #${f.id} (${key})`, field: "arabic", issue: "missing from API response" });
    continue;
  }
  if (normalizeArabic(f.arabicText) !== normalizeArabic(apiArabic)) {
    problems.push({ where: `featuredAyat #${f.id} (${key})`, field: "arabic", local: f.arabicText, api: apiArabic });
  }
  if (normalizeEnglish(f.englishText) !== normalizeEnglish(apiEnglish)) {
    problems.push({ where: `featuredAyat #${f.id} (${key})`, field: "english", local: f.englishText, api: apiEnglish });
  }
}
console.log(`featuredAyat: ${featured.length} entries checked.`);

// ---- Report -------------------------------------------------------------
if (problems.length === 0) {
  console.log("\n✅ VERBATIM: every bundled string matches the Quran.com Foundation API.");
  process.exit(0);
}
console.log(`\n❌ ${problems.length} mismatch(es):\n`);
for (const p of problems.slice(0, 20)) {
  console.log(`— ${p.where} [${p.field}]`);
  if (p.issue) console.log(`   ${p.issue}`);
  if (p.local !== undefined) {
    console.log(`   local: ${String(p.local).slice(0, 160)}`);
    console.log(`   api:   ${String(normalizeEnglish(p.api)).slice(0, 160)}`);
  }
}
if (problems.length > 20) console.log(`… and ${problems.length - 20} more`);
process.exit(1);
