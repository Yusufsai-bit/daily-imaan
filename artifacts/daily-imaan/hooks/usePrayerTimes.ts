import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import type { PrayerOffsets } from "@/context/AppContext";

const ZERO_OFFSETS: PrayerOffsets = {
  Fajr: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0,
};

/**
 * Shift "HH:MM" or "HH:MM (TZ)" by deltaMin minutes, wrapping at 24h.
 * Empty input or zero delta is a no-op so consumers can pass raw values
 * regardless of whether offsets are active. Tolerates the TZ suffix the
 * Aladhan API sometimes appends.
 */
function shiftTime(timeStr: string, deltaMin: number): string {
  if (!timeStr || deltaMin === 0) return timeStr;
  const head = timeStr.split(" ")[0] ?? timeStr;
  const tzSuffix = timeStr.slice(head.length); // preserves any " (EST)" tail
  const [hStr, mStr] = head.split(":");
  const h = parseInt(hStr ?? "", 10);
  const m = parseInt(mStr ?? "", 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return timeStr;
  const totalMin = h * 60 + m + deltaMin;
  const wrappedMin = ((totalMin % 1440) + 1440) % 1440;
  const newH = Math.floor(wrappedMin / 60);
  const newM = wrappedMin % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}${tzSuffix}`;
}

/**
 * Apply per-prayer offsets to a raw PrayerTimes payload. Sunrise is
 * unaffected (it's an astronomical reference point, not a prayer to be
 * nudged for mosque parity).
 */
function applyOffsetsTo(raw: PrayerTimes, offsets: PrayerOffsets): PrayerTimes {
  return {
    Fajr: shiftTime(raw.Fajr, offsets.Fajr),
    Sunrise: raw.Sunrise,
    Dhuhr: shiftTime(raw.Dhuhr, offsets.Dhuhr),
    Asr: shiftTime(raw.Asr, offsets.Asr),
    Maghrib: shiftTime(raw.Maghrib, offsets.Maghrib),
    Isha: shiftTime(raw.Isha, offsets.Isha),
  };
}

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerLocation {
  city: string | null;
  country: string | null;
  latitude: number;
  longitude: number;
}

export interface HijriDate {
  day: string;
  monthEn: string;
  monthAr: string;
  year: string;
  formatted: string; // e.g. "12 Shawwāl 1447"
}

interface UsePrayerTimesResult {
  prayerTimes: PrayerTimes | null;
  nextPrayer: { name: string; time: string } | null;
  location: PrayerLocation | null;
  hijri: HijriDate | null;
  loading: boolean;
  error: string | null;
  locationDenied: boolean;
  source: string;
  /**
   * True when the prayer times being shown are from a previous day's cache,
   * served as a fallback because location/network is currently unavailable.
   * UI can surface a "Showing last known times" banner.
   */
  isStale: boolean;
  refresh: () => Promise<void>;
}

function getNextPrayer(times: PrayerTimes): { name: string; time: string } | null {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: "Fajr", time: times.Fajr },
    { name: "Dhuhr", time: times.Dhuhr },
    { name: "Asr", time: times.Asr },
    { name: "Maghrib", time: times.Maghrib },
    { name: "Isha", time: times.Isha },
  ];

  for (const prayer of prayers) {
    const [hourStr, minuteStr] = prayer.time.split(":");
    const hour = parseInt(hourStr ?? "0");
    const minute = parseInt((minuteStr ?? "00").split(" ")[0] ?? "0");
    const prayerMinutes = hour * 60 + minute;
    if (prayerMinutes > currentTime) {
      return prayer;
    }
  }
  return prayers[0] ?? null; // next day Fajr
}

const CACHE_KEY = "@prayer_times_cache_v2";

interface CachedPayload {
  times: PrayerTimes;
  date: string;
  method: number;
  school: number;
  // Rounded coords so small GPS jitter doesn't constantly invalidate cache,
  // but real travel (different city) does.
  latRounded: number;
  lngRounded: number;
  location: PrayerLocation;
  hijri: HijriDate | null;
}

/**
 * Fetches prayer times for the user's current location.
 *
 * Source: AlAdhan API (api.aladhan.com) — open-source astronomical
 * calculation library that powers most Muslim prayer-time apps.
 * Produces identical results to IslamicFinder when configured with the
 * same calculation method.
 *
 * @param method  Calculation method (AlAdhan codes — 1 = MWL, 2 = ISNA, 3 = Egyptian, 4 = Umm al-Qura, 5 = Karachi).
 *                Default matches AppContext's DEFAULT_STATE (1 = MWL) so a
 *                caller that forgets to pass it agrees with the app default.
 * @param school  Asr juristic school. 0 = Standard (Shafi'i/Maliki/Hanbali), 1 = Hanafi.
 */
export function usePrayerTimes(
  method: number = 1,
  school: number = 0,
  offsets: PrayerOffsets = ZERO_OFFSETS,
): UsePrayerTimesResult {
  // Raw API/cache values. The exposed `prayerTimes` below is the
  // offset-adjusted derivation of this — keeping raw in state means
  // changing offsets in Settings updates the displayed times instantly
  // without re-fetching, and the cache stays valid across offset edits.
  const [rawPrayerTimes, setRawPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const [location, setLocation] = useState<PrayerLocation | null>(null);
  const [hijri, setHijri] = useState<HijriDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [isStale, setIsStale] = useState(false);

  // Derive the offset-adjusted view exposed to consumers. Memoised on
  // (raw, offsets-key) so the object reference is stable across renders
  // when nothing changed — important because consumers depend on
  // `prayerTimes` identity for downstream effects.
  const offsetKey = `${offsets.Fajr}|${offsets.Dhuhr}|${offsets.Asr}|${offsets.Maghrib}|${offsets.Isha}`;
  const prayerTimes = useMemo(
    () => (rawPrayerTimes ? applyOffsetsTo(rawPrayerTimes, offsets) : null),
    // We deliberately key on offsetKey rather than `offsets` directly so
    // a fresh-but-equal offsets object from Settings doesn't churn the memo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawPrayerTimes, offsetKey],
  );

  // Recompute nextPrayer when the offset-adjusted times change. Without
  // this, an offset change would update the schedule pill but leave the
  // "X in Y minutes" countdown wrong until the next 60s tick.
  useEffect(() => {
    if (prayerTimes) setNextPrayer(getNextPrayer(prayerTimes));
  }, [prayerTimes]);

  // Local rename so the existing setPrayerTimes(payload.times) calls below
  // continue to work without a search-and-replace. They're storing raw
  // values into the raw state.
  const setPrayerTimes = setRawPrayerTimes;

  /**
   * Best-effort: hydrate prayer times from any cache entry matching the
   * user's calculation method/school, even if it's from an earlier day or
   * a slightly different location. Returns true when something was loaded
   * so the caller can show stale UI instead of an empty state.
   */
  const loadAnyCacheAsStale = useCallback(async (): Promise<boolean> => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (!cached) return false;
      const payload = JSON.parse(cached) as CachedPayload;
      if (!payload?.times) return false;
      setPrayerTimes(payload.times);
      setNextPrayer(getNextPrayer(payload.times));
      setLocation(payload.location);
      if (payload.hijri) setHijri(payload.hijri);
      setIsStale(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const fetchTimes = useCallback(
    async (force: boolean = false) => {
      if (Platform.OS === "web") {
        setLoading(false);
        return;
      }

      setError(null);
      if (force) setLoading(true);

      try {
        const today = new Date().toDateString();

        // Try cache first (only if not forced)
        if (!force) {
          const cached = await AsyncStorage.getItem(CACHE_KEY);
          if (cached) {
            const payload = JSON.parse(cached) as CachedPayload;
            const sameDay = payload.date === today;
            const sameMethod = payload.method === method;
            const sameSchool = payload.school === school;
            if (sameDay && sameMethod && sameSchool) {
              setPrayerTimes(payload.times);
              setNextPrayer(getNextPrayer(payload.times));
              setLocation(payload.location);
              if (payload.hijri) setHijri(payload.hijri);
              setIsStale(false);
              setLoading(false);
              // Don't return — we still re-validate location below in background
            }
          }
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationDenied(true);
          // Fall back to any cached schedule (even from a previous day) so
          // the UI isn't empty. Marked as stale for the banner.
          await loadAnyCacheAsStale();
          setLoading(false);
          return;
        }
        setLocationDenied(false);

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const { latitude, longitude } = loc.coords;
        const latRounded = Math.round(latitude * 100) / 100; // ~1km precision
        const lngRounded = Math.round(longitude * 100) / 100;

        // Reuse cache if same coords + same day + same method/school
        if (!force) {
          const cached = await AsyncStorage.getItem(CACHE_KEY);
          if (cached) {
            const payload = JSON.parse(cached) as CachedPayload;
            if (
              payload.date === today &&
              payload.method === method &&
              payload.school === school &&
              payload.latRounded === latRounded &&
              payload.lngRounded === lngRounded
            ) {
              setPrayerTimes(payload.times);
              setNextPrayer(getNextPrayer(payload.times));
              setLocation(payload.location);
              if (payload.hijri) setHijri(payload.hijri);
              setIsStale(false);
              setLoading(false);
              return;
            }
          }
        }

        // Reverse geocode for friendly city display (best-effort)
        let city: string | null = null;
        let country: string | null = null;
        try {
          const places = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });
          const place = places[0];
          if (place) {
            city = place.city || place.subregion || place.region || null;
            country = place.country || null;
          }
        } catch {
          // Reverse geocoding can fail offline — that's fine, just no city label.
        }

        const resolvedLocation: PrayerLocation = {
          city,
          country,
          latitude,
          longitude,
        };
        setLocation(resolvedLocation);

        const timestamp = Math.floor(Date.now() / 1000);
        const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`;
        // Hard 10s timeout. Without this a stalled network leaves the
        // home prayer pill stuck on "Loading prayer times…" indefinitely.
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10_000);
        let res: Response;
        try {
          res = await fetch(url, { signal: controller.signal });
        } finally {
          clearTimeout(timeoutId);
        }
        const json = (await res.json()) as {
          data?: {
            timings?: PrayerTimes;
            date?: {
              hijri?: {
                day?: string;
                month?: { en?: string; ar?: string };
                year?: string;
              };
            };
          };
        };
        const timings = json?.data?.timings;

        if (timings) {
          const times: PrayerTimes = {
            Fajr: timings.Fajr,
            Sunrise: timings.Sunrise,
            Dhuhr: timings.Dhuhr,
            Asr: timings.Asr,
            Maghrib: timings.Maghrib,
            Isha: timings.Isha,
          };
          setPrayerTimes(times);
          setNextPrayer(getNextPrayer(times));

          let resolvedHijri: HijriDate | null = null;
          const h = json?.data?.date?.hijri;
          if (h && h.day && h.month?.en && h.year) {
            resolvedHijri = {
              day: h.day,
              monthEn: h.month.en,
              monthAr: h.month.ar ?? "",
              year: h.year,
              formatted: `${h.day} ${h.month.en} ${h.year} AH`,
            };
            setHijri(resolvedHijri);
          }

          const payload: CachedPayload = {
            times,
            date: today,
            method,
            school,
            latRounded,
            lngRounded,
            location: resolvedLocation,
            hijri: resolvedHijri,
          };
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
          setIsStale(false);
        } else {
          setError("Could not load prayer times");
          await loadAnyCacheAsStale();
        }
      } catch {
        setError("Could not load prayer times");
        await loadAnyCacheAsStale();
      } finally {
        setLoading(false);
      }
    },
    [method, school, loadAnyCacheAsStale]
  );

  useEffect(() => {
    fetchTimes(false);
  }, [fetchTimes]);

  // Tick the "next prayer" calculation every 60s and force a fresh fetch when
  // the local date rolls over (midnight crossing or DST transition). Without
  // this the home screen could keep showing yesterday's "Maghrib in 2h" long
  // after midnight if the user leaves the app open.
  useEffect(() => {
    if (Platform.OS === "web") return;
    let lastDate = new Date().toDateString();
    const id = setInterval(() => {
      const today = new Date().toDateString();
      if (today !== lastDate) {
        lastDate = today;
        fetchTimes(true);
        return;
      }
      // Re-run getNextPrayer because the wall clock has advanced; the
      // prayer times themselves haven't changed. Use the offset-adjusted
      // `prayerTimes` (not raw) so the user's manual offsets are honoured
      // in the "Next prayer" pill countdown.
      if (prayerTimes) setNextPrayer(getNextPrayer(prayerTimes));
    }, 60_000);
    return () => clearInterval(id);
    // prayerTimes intentionally omitted — its identity changes only when
    // offsets or raw times change, both of which already drive the
    // separate useEffect above. Including it here would re-create the
    // interval every offset tweak.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTimes]);

  const refresh = useCallback(() => fetchTimes(true), [fetchTimes]);

  return {
    prayerTimes,
    nextPrayer,
    location,
    hijri,
    loading,
    error,
    locationDenied,
    source: "AlAdhan · ISNA-compatible",
    isStale,
    refresh,
  };
}
