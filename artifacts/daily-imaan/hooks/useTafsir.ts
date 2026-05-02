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

interface CacheEntry {
  text: string;
  source: string;
  fetchedAt: number;
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
            return;
          }
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

        // Best-effort cache write.
        try {
          const entry: CacheEntry = {
            text: cleanText,
            source,
            fetchedAt: Date.now(),
          };
          await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
        } catch {
          // Ignore storage errors.
        }
      } catch (e) {
        if (!cancelled) {
          setState({
            text: null,
            source: null,
            loading: false,
            error: e instanceof Error ? e.message : "Could not load tafsir",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, surahId, ayahNumber]);

  return state;
}
