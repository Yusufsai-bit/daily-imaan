import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Fetches verified scholarly tafsir for a given ayah from the Quran.com
 * Foundation API. The text is authored by the cited classical scholars (e.g.
 * Hafiz Ibn Kathir) and served verbatim by Quran.com — no AI commentary is
 * involved at any stage.
 *
 * Results are cached in AsyncStorage so subsequent loads are instant and
 * available offline.
 */

const TAFSIR_ID = 169; // Ibn Kathir (Abridged) — English, served by Quran.com
const CACHE_PREFIX = "@tafsir_v1_";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 90; // 90 days
const CACHE_INDEX_KEY = "@tafsir_v1_index";
/**
 * LRU cap so the tafsir cache never grows without bound. Each entry is
 * typically 1–4 KB, so 200 entries ≈ 0.5 MB — comfortable for AsyncStorage
 * while still covering a heavy reading session of multiple surahs.
 */
const CACHE_MAX_ENTRIES = 200;

interface CacheEntry {
  text: string;
  source: string;
  fetchedAt: number;
}

/**
 * Reads the LRU index (most-recently-used at the end). Tolerates a missing
 * or corrupted index by returning an empty list.
 */
async function readIndex(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_INDEX_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((k) => typeof k === "string");
    }
  } catch {
    // ignore — treat as empty
  }
  return [];
}

/**
 * Persist a tafsir entry under `cacheKey` and update the LRU index. If the
 * cap is exceeded, evict oldest entries (front of the list) until we're back
 * under the cap.
 */
async function writeWithLRU(cacheKey: string, entry: CacheEntry): Promise<void> {
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
    const idx = await readIndex();
    const filtered = idx.filter((k) => k !== cacheKey);
    filtered.push(cacheKey);
    while (filtered.length > CACHE_MAX_ENTRIES) {
      const evict = filtered.shift();
      if (evict) {
        try {
          await AsyncStorage.removeItem(evict);
        } catch {
          // ignore individual eviction failure
        }
      }
    }
    await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(filtered));
  } catch {
    // ignore storage errors entirely — tafsir still served from memory
  }
}

/**
 * Mark an existing entry as recently-used by moving its key to the end of
 * the index. Best-effort; index writes never block the hook.
 */
async function touchIndex(cacheKey: string): Promise<void> {
  try {
    const idx = await readIndex();
    const without = idx.filter((k) => k !== cacheKey);
    without.push(cacheKey);
    await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(without));
  } catch {
    // ignore
  }
}

/** Minimal HTML→plain-text conversion that preserves paragraph structure. */
function htmlToText(html: string): string {
  return html
    .replace(/<h[1-6][^>]*>/gi, "")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>(?!\n)/gi, "\n")
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&hellip;/g, "…")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export interface TafsirState {
  text: string | null;
  source: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: TafsirState = {
  text: null,
  source: null,
  loading: false,
  error: null,
};

export function useTafsir(
  surahId: number,
  ayahNumber: number,
  enabled: boolean,
): TafsirState {
  const [state, setState] = useState<TafsirState>(initialState);

  useEffect(() => {
    if (!enabled) {
      setState(initialState);
      return;
    }
    let cancelled = false;
    const verseKey = `${surahId}:${ayahNumber}`;
    const cacheKey = `${CACHE_PREFIX}${TAFSIR_ID}_${verseKey}`;

    setState({ text: null, source: null, loading: true, error: null });

    // Track an expired-but-readable cache entry so we can serve it as a stale
    // fallback if the network fetch fails (offline reading scenario).
    let staleCached: CacheEntry | null = null;

    (async () => {
      // 1. Try cache first.
      try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const parsed: CacheEntry = JSON.parse(cached);
          if (parsed?.text && Date.now() - parsed.fetchedAt < CACHE_TTL_MS) {
            if (!cancelled) {
              setState({
                text: parsed.text,
                source: parsed.source,
                loading: false,
                error: null,
              });
            }
            // Mark as recently used so the LRU eviction picks colder entries.
            touchIndex(cacheKey);
            return;
          }
          // Expired but parseable — keep it as the offline fallback.
          if (parsed?.text) staleCached = parsed;
        }
      } catch {
        // Ignore malformed cache and fall through to network fetch.
      }

      // 2. Fetch from Quran.com Foundation API.
      try {
        const url = `https://api.qurancdn.com/api/qdc/tafsirs/${TAFSIR_ID}/by_ayah/${verseKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Quran.com returned ${res.status}`);
        const data = await res.json();
        const rawText: string = data?.tafsir?.text ?? "";
        const sourceName: string =
          data?.tafsir?.translated_name?.name ||
          data?.tafsir?.resource_name ||
          "Tafsir Ibn Kathir";

        const cleanText = htmlToText(rawText);
        if (!cleanText) throw new Error("Empty tafsir response");

        const source = `${sourceName} · via Quran.com`;
        if (!cancelled) {
          setState({ text: cleanText, source, loading: false, error: null });
        }

        // Best-effort cache write with LRU eviction.
        const entry: CacheEntry = {
          text: cleanText,
          source,
          fetchedAt: Date.now(),
        };
        writeWithLRU(cacheKey, entry);
      } catch (e) {
        if (!cancelled) {
          // Offline / network error: serve the expired cache entry if we have
          // one. Better to read 91-day-old verbatim Ibn Kathir than nothing.
          if (staleCached) {
            setState({
              text: staleCached.text,
              source: staleCached.source ? `${staleCached.source} · cached` : null,
              loading: false,
              error: null,
            });
          } else {
            setState({
              text: null,
              source: null,
              loading: false,
              error: e instanceof Error ? e.message : "Could not load tafsir",
            });
          }
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, surahId, ayahNumber]);

  return state;
}

/**
 * Eagerly fetch + cache the tafsir for an ayah without subscribing any UI.
 * Called from the home screen for the current featured ayah after the first
 * interaction frame settles, so when the user later taps "Show tafsir" the
 * result is already in AsyncStorage and renders instantly.
 *
 * Best-effort and silent: a missing network connection, a 4xx/5xx response,
 * or a malformed payload all just no-op. Never throws.
 */
export async function prewarmTafsir(
  surahId: number,
  ayahNumber: number,
): Promise<void> {
  try {
    const verseKey = `${surahId}:${ayahNumber}`;
    const cacheKey = `${CACHE_PREFIX}${TAFSIR_ID}_${verseKey}`;

    // Fast path: a fresh cache entry already exists, nothing to do.
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const parsed: CacheEntry = JSON.parse(cached);
        if (parsed?.text && Date.now() - parsed.fetchedAt < CACHE_TTL_MS) {
          touchIndex(cacheKey);
          return;
        }
      }
    } catch {
      // Ignore malformed cache and fall through to network fetch.
    }

    const url = `https://api.qurancdn.com/api/qdc/tafsirs/${TAFSIR_ID}/by_ayah/${verseKey}`;
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    const rawText: string = data?.tafsir?.text ?? "";
    const sourceName: string =
      data?.tafsir?.translated_name?.name ||
      data?.tafsir?.resource_name ||
      "Tafsir Ibn Kathir";

    const cleanText = htmlToText(rawText);
    if (!cleanText) return;

    await writeWithLRU(cacheKey, {
      text: cleanText,
      source: `${sourceName} · via Quran.com`,
      fetchedAt: Date.now(),
    });
  } catch {
    // best-effort — never throws
  }
}
