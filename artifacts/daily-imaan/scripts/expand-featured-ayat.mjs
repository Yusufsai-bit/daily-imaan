/**
 * Expands the curated FEATURED_AYAT pool. Verse TEXT is never typed by hand
 * — every entry is fetched verbatim from the Quran.com Foundation API
 * (text_uthmani + Saheeh International id 20), the same source the rest of
 * the dataset is audited against. Only the REFERENCES below are curated.
 *
 * Curation rule (per PROJECT_CONTEXT / LAUNCH_CHECKLIST): the daily pool is
 * for a gentle, no-guilt app — verses of mercy, hope, patience, dhikr, and
 * Allah's nearness that stand alone without harsh context.
 *
 * Run:  node scripts/expand-featured-ayat.mjs        (then re-run
 *       scripts/verify-quran-text.mjs, which must stay green)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CANDIDATES = [
  "39:53", // "do not despair of the mercy of Allah"
  "65:2",  // whoever fears Allah — He will make a way out
  "65:3",  // and provide from where he does not expect
  "65:7",  // Allah will bring ease after hardship
  "93:3",  // your Lord has not forsaken you
  "93:4",  // the Hereafter is better for you than the first
  "93:5",  // your Lord is going to give you, and you will be satisfied
  "94:5",  // with hardship comes ease
  "94:6",  // indeed, with hardship comes ease
  "2:153", // seek help through patience and prayer
  "2:201", // rabbanā ātinā — good in this world and the next
  "3:8",   // let not our hearts deviate
  "3:159", // by mercy from Allah you were lenient
  "10:57", // an instruction, healing, guidance and mercy
  "12:86", // I only complain of my grief to Allah
  "13:28", // hearts find rest in the remembrance of Allah
  "14:7",  // if you are grateful, I will increase you
  "16:97", // whoever does righteousness — a good life
  "16:128",// Allah is with those who fear Him and do good
  "18:10", // grant us mercy from Yourself
  "20:25", // my Lord, expand for me my breast
  "20:114",// my Lord, increase me in knowledge
  "21:87", // the dua of Yunus — lā ilāha illā anta
  "23:118",// my Lord, forgive and have mercy
  "25:74", // comfort of eyes from our spouses and offspring
  "29:69", // those who strive for Us — We will guide them
  "30:21", // affection and mercy between spouses
  "40:60", // call upon Me; I will respond
  "41:30", // angels descend: do not fear, do not grieve
  "46:13", // steadfast — no fear, nor will they grieve
  "49:13", // peoples and tribes, that you may know one another
  "55:60", // is the reward for good anything but good?
  "57:4",  // He is with you wherever you are
  "64:11", // whoever believes — He will guide his heart
  "73:8",  // remember your Lord and devote yourself completely
  "87:8",  // We will ease you toward ease
  "95:4",  // We created man in the best of stature
  "96:1",  // Read, in the name of your Lord
  "108:1", // We have granted you al-Kawthar
];

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const filePath = join(root, "data", "featuredAyat.ts");
const source = readFileSync(filePath, "utf8");

const start = source.indexOf("[", source.indexOf("FEATURED_AYAT"));
const end = source.lastIndexOf("];");
const existing = new Function(`return ${source.slice(start, end + 1)}`)();
const existingKeys = new Set(existing.map((e) => `${e.surahId}:${e.ayahNumber}`));
const maxId = Math.max(...existing.map((e) => e.id));

const fresh = CANDIDATES.filter((k) => !existingKeys.has(k));
const dupes = CANDIDATES.filter((k) => existingKeys.has(k));
if (dupes.length) console.log(`Skipping ${dupes.length} already-present: ${dupes.join(", ")}`);
if (!fresh.length) {
  console.log("Nothing new to add.");
  process.exit(0);
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res.json();
}

console.log(`Fetching ${fresh.length} verses + chapter names from api.quran.com …`);
const [uthmani, translation, chapters] = await Promise.all([
  fetchJson("https://api.quran.com/api/v4/quran/verses/uthmani"),
  fetchJson("https://api.quran.com/api/v4/quran/translations/20"),
  fetchJson("https://api.quran.com/api/v4/chapters?language=en"),
]);
const arabicByKey = new Map(uthmani.verses.map((v) => [v.verse_key, v.text_uthmani]));
const englishByKey = new Map(uthmani.verses.map((v, i) => [v.verse_key, translation.translations[i].text]));
const chapterName = new Map(chapters.chapters.map((c) => [c.id, c.name_simple]));

// Same footnote handling as the rest of the dataset: markers stripped,
// translators' bracketed clarifications kept.
const cleanEnglish = (t) =>
  String(t)
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();

const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

let block = "";
let nextId = maxId;
for (const key of fresh) {
  const [surahId, ayahNumber] = key.split(":").map(Number);
  const arabic = arabicByKey.get(key);
  const english = englishByKey.get(key);
  const name = chapterName.get(surahId);
  if (!arabic || !english || !name) throw new Error(`API missing data for ${key}`);
  nextId += 1;
  block += `  {
      id: ${nextId}, surahId: ${surahId}, surahNameEnglish: "${esc(name)}", ayahNumber: ${ayahNumber},
      arabicText: "${esc(String(arabic).normalize("NFC"))}",
      englishText: "${esc(cleanEnglish(english))}",
    },
`;
}

const updated = source.slice(0, end) + block + source.slice(end);
writeFileSync(filePath, updated, "utf8");
console.log(`Added ${nextId - maxId} entries (ids ${maxId + 1}–${nextId}). Pool: ${existing.length} → ${existing.length + (nextId - maxId)}.`);
console.log("Now run: node scripts/verify-quran-text.mjs");
