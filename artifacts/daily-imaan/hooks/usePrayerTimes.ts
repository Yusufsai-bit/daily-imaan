import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface UsePrayerTimesResult {
  prayerTimes: PrayerTimes | null;
  nextPrayer: { name: string; time: string } | null;
  loading: boolean;
  error: string | null;
  locationDenied: boolean;
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

const CACHE_KEY = "@prayer_times_cache";

export function usePrayerTimes(method: number = 2): UsePrayerTimesResult {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    if (Platform.OS === "web") {
      setLoading(false);
      return;
    }

    async function fetchTimes() {
      try {
        // Try cache first
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          const { times, date } = JSON.parse(cached) as { times: PrayerTimes; date: string };
          const today = new Date().toDateString();
          if (date === today) {
            setPrayerTimes(times);
            setNextPrayer(getNextPrayer(times));
            setLoading(false);
            return;
          }
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationDenied(true);
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const { latitude, longitude } = loc.coords;

        const timestamp = Math.floor(Date.now() / 1000);
        const res = await fetch(
          `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${method}`
        );
        const json = await res.json() as { data?: { timings?: PrayerTimes } };
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
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ times, date: new Date().toDateString() }));
        }
      } catch (e) {
        setError("Could not load prayer times");
      } finally {
        setLoading(false);
      }
    }

    fetchTimes();
  }, [method]);

  return { prayerTimes, nextPrayer, loading, error, locationDenied };
}
