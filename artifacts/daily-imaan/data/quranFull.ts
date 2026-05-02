/**
 * Thin async wrapper around the bundled offline Qur'an data.
 *
 * The full Saheeh International + Uthmani text (~2.3 MB of JSON) lives in
 * `quranFullData.ts`. That module is loaded **lazily** via dynamic
 * `import()` so it does not parse during cold start of screens that
 * never need it (Home, Dhikr, Du'as, Settings, Qibla). Only Bookmarks
 * and the Surah detail screen actually read verse text from it.
 *
 * Once loaded, an O(1) lookup index is cached in-memory for the lifetime
 * of the JS runtime, so subsequent calls are effectively free. Concurrent
 * callers share a single in-flight promise — the heavy module is parsed
 * at most once per app session.
 *
 * No AI-generated commentary or paraphrasing is added here or in the
 * underlying data file. The English text is Saheeh International verbatim.
 */

export interface QuranAyahRecord {
  /** Ayah number within its surah (1-based). */
  n: number;
  /** Arabic in Uthmani script. */
  a: string;
  /** English: Saheeh International. */
  e: string;
}

export interface QuranSurahRecord {
  number: number;
  ayahs: QuranAyahRecord[];
}

/** Translator label for any UI that displays English text from this file. */
export const QURAN_TRANSLATION_LABEL = "Saheeh International";

let cachedIndex: Map<number, QuranSurahRecord> | null = null;
let pendingLoad: Promise<Map<number, QuranSurahRecord>> | null = null;

function loadIndex(): Promise<Map<number, QuranSurahRecord>> {
  if (cachedIndex) return Promise.resolve(cachedIndex);
  if (pendingLoad) return pendingLoad;
  pendingLoad = import("./quranFullData").then((mod) => {
    const idx = new Map<number, QuranSurahRecord>(
      mod.QURAN_FULL.map((s) => [s.number, s]),
    );
    cachedIndex = idx;
    pendingLoad = null;
    return idx;
  });
  return pendingLoad;
}

/**
 * Resolve a surah by 1-based id. Returns `undefined` if the id is out of
 * range. The first call triggers the dynamic import; subsequent calls hit
 * the cached in-memory index.
 */
export async function getQuranSurah(
  surahId: number,
): Promise<QuranSurahRecord | undefined> {
  const idx = await loadIndex();
  return idx.get(surahId);
}

/**
 * Fire-and-forget preload of the heavy data module. Useful from screens
 * that know the user is about to need the data (e.g., the Quran tab) so
 * tapping a surah feels instant. Safe to call multiple times.
 */
export function preloadQuranData(): void {
  void loadIndex();
}
