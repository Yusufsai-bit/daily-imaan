import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

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
 * same calculation method (default ISNA = method 2).
 *
 * @param method  Calculation method (AlAdhan codes — 2 = ISNA, 1 = MWL, 3 = Egyptian, 4 = Umm al-Qura, 5 = Karachi).
 * @param school  Asr juristic school. 0 = Standard (Shafi'i/Maliki/Hanbali), 1 = Hanafi.
 */
export function usePrayerTimes(
  method: number = 2,
  school: number = 0
): UsePrayerTimesResult {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const [location, setLocation] = useState<PrayerLocation | null>(null);
  const [hijri, setHijri] = useState<HijriDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

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
              setLoading(false);
              // Don't return — we still re-validate location below in background
            }
          }
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationDenied(true);
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
        const res = await fetch(url);
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
        } else {
          setError("Could not load prayer times");
        }
      } catch {
        setError("Could not load prayer times");
      } finally {
        setLoading(false);
      }
    },
    [method, school]
  );

  useEffect(() => {
    fetchTimes(false);
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
    refresh,
  };
}
