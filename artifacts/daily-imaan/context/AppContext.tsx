import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { DEFAULT_RECITER_ID } from "@/constants/reciters";

export interface PrayerSoundSettings {
  Fajr: boolean;
  Dhuhr: boolean;
  Asr: boolean;
  Maghrib: boolean;
  Isha: boolean;
}

export interface AppSettings {
  ayatOrder: "sequential" | "random";
  notificationTimes: string[];
  prayerMethod: number;
  /** Asr juristic school. 0 = Standard (Shafi'i/Maliki/Hanbali), 1 = Hanafi. */
  prayerSchool: number;
  darkMode: boolean;
  /**
   * Per-prayer sound toggle for prayer-time notifications.
   * Fajr defaults to OFF (quiet hours — no household disturbance before sunrise).
   * Other prayers default to ON. Sound used is the system default notification
   * sound. A bundled adhan recitation requires a licensed audio asset.
   */
  prayerSoundEnabled: PrayerSoundSettings;
  /**
   * Audio reciter for ayah playback. Stored as the alquran.cloud edition
   * code (e.g. "ar.alafasy"). See constants/reciters.ts for the catalogue.
   */
  reciter: string;
  /**
   * When true, the home screen surfaces a "Daily Hadith" shortcut that
   * opens a curated authentic hadith for the day. Defaults to ON. Users
   * who prefer to keep the home screen Quran-only can hide it from
   * Settings without affecting any other functionality.
   */
  dailyHadithEnabled: boolean;
}

export interface StreakData {
  count: number;
  lastActiveDate: string;
  longestStreak: number;
}

/**
 * Last position the user was reading in the Mushaf, surfaced on the Home
 * screen as a "Continue reading" card. Updated whenever the surah detail
 * screen mounts. Only the surah is tracked (not the scroll offset) because
 * the user typically resumes near the start.
 */
export interface LastReadPosition {
  surahId: number;
  ayahNumber: number;
  surahName: string;
  updatedAt: number;
}

export interface AppState {
  /** Schema version for future migrations. Bumped on breaking field changes. */
  version: number;
  bookmarks: number[];
  /**
   * Saved hadith IDs (stable string IDs from data/hadithData.ts → DailyHadith.id,
   * which mirror the canonical sunnah.com reference numbers). Stored separately
   * from ayah bookmarks because the keyspaces are different and conflating them
   * would corrupt either list on read.
   */
  hadithBookmarks: string[];
  streak: StreakData;
  goodDeeds: Record<string, string[]>;
  settings: AppSettings;
  readAyatIds: number[];
  lastReadPosition: LastReadPosition | null;
}

interface AppContextType {
  state: AppState;
  toggleBookmark: (ayahId: number) => void;
  isBookmarked: (ayahId: number) => boolean;
  toggleHadithBookmark: (hadithId: string) => void;
  isHadithBookmarked: (hadithId: string) => boolean;
  markAyahRead: (ayahId: number) => void;
  toggleDeed: (deedId: string) => void;
  /**
   * Idempotent — adds the deed to today's list if missing, never removes.
   * Use for auto-linking from in-app actions (Read Quran, Made Dua,
   * Completed Dhikr) so we never undo a user's manual check.
   */
  markDeedDone: (deedId: string) => void;
  isDeedChecked: (deedId: string) => boolean;
  getTodayDeeds: () => string[];
  updateSettings: (settings: Partial<AppSettings>) => void;
  incrementStreak: () => void;
  setLastReadPosition: (pos: LastReadPosition) => void;
  loaded: boolean;
}

const CURRENT_STATE_VERSION = 1;

const DEFAULT_STATE: AppState = {
  version: CURRENT_STATE_VERSION,
  bookmarks: [],
  hadithBookmarks: [],
  streak: { count: 0, lastActiveDate: "", longestStreak: 0 },
  goodDeeds: {},
  settings: {
    ayatOrder: "sequential",
    notificationTimes: ["07:00", "13:00", "18:00"],
    prayerMethod: 2,
    prayerSchool: 0,
    darkMode: false,
    prayerSoundEnabled: {
      Fajr: false,
      Dhuhr: true,
      Asr: true,
      Maghrib: true,
      Isha: true,
    },
    reciter: DEFAULT_RECITER_ID,
    dailyHadithEnabled: true,
  },
  readAyatIds: [],
  lastReadPosition: null,
};

const STORAGE_KEY = "@daily_imaan_state";

const AppContext = createContext<AppContextType | null>(null);

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Storage growth cap: keep only good-deed entries from the last 365 days.
 * Date keys are ISO-format (YYYY-MM-DD) which sort lexically. Also drops empty
 * arrays so unchecking the last deed of a day removes the day entirely.
 */
const GOOD_DEEDS_RETENTION_DAYS = 365;
function pruneGoodDeeds(
  goodDeeds: Record<string, string[]>
): Record<string, string[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - GOOD_DEEDS_RETENTION_DAYS);
  const cutoffKey = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, "0")}-${String(cutoff.getDate()).padStart(2, "0")}`;
  const result: Record<string, string[]> = {};
  for (const key of Object.keys(goodDeeds)) {
    const value = goodDeeds[key];
    if (key >= cutoffKey && value && value.length > 0) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Apply migrations for any state shape older than CURRENT_STATE_VERSION.
 * Each migration is additive — we never delete user data. Returns saved state
 * with all required fields populated to defaults so older clients can keep
 * their bookmarks, streak, and intentions intact across upgrades.
 */
function migrateState(saved: Partial<AppState>): AppState {
  // v0 → v1: introduces `version`, `lastReadPosition`, `settings.reciter`.
  // The merge below covers all current fields. When future migrations are
  // needed, branch on `saved.version` here.
  return {
    ...DEFAULT_STATE,
    ...saved,
    settings: { ...DEFAULT_STATE.settings, ...(saved.settings ?? {}) },
    streak: { ...DEFAULT_STATE.streak, ...(saved.streak ?? {}) },
    bookmarks: Array.isArray(saved.bookmarks) ? saved.bookmarks : [],
    hadithBookmarks: Array.isArray(saved.hadithBookmarks) ? saved.hadithBookmarks : [],
    readAyatIds: Array.isArray(saved.readAyatIds) ? saved.readAyatIds : [],
    goodDeeds:
      typeof saved.goodDeeds === "object" && saved.goodDeeds !== null
        ? saved.goodDeeds
        : {},
    lastReadPosition: saved.lastReadPosition ?? null,
    version: CURRENT_STATE_VERSION,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<AppState>;
          setState(migrateState(saved));
        }
      } catch {
        // use defaults
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const save = useCallback(async (newState: AppState) => {
    try {
      // Cap unbounded growth: prune goodDeeds to retention window before persist.
      const persisted: AppState = {
        ...newState,
        goodDeeds: pruneGoodDeeds(newState.goodDeeds),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // ignore
    }
  }, []);

  const updateState = useCallback(
    (updater: (prev: AppState) => AppState) => {
      setState((prev) => {
        const next = updater(prev);
        save(next);
        return next;
      });
    },
    [save]
  );

  const toggleBookmark = useCallback(
    (ayahId: number) => {
      updateState((prev) => ({
        ...prev,
        bookmarks: prev.bookmarks.includes(ayahId)
          ? prev.bookmarks.filter((id) => id !== ayahId)
          : [...prev.bookmarks, ayahId],
      }));
    },
    [updateState]
  );

  const isBookmarked = useCallback(
    (ayahId: number) => state.bookmarks.includes(ayahId),
    [state.bookmarks]
  );

  const toggleHadithBookmark = useCallback(
    (hadithId: string) => {
      updateState((prev) => ({
        ...prev,
        hadithBookmarks: prev.hadithBookmarks.includes(hadithId)
          ? prev.hadithBookmarks.filter((id) => id !== hadithId)
          : [...prev.hadithBookmarks, hadithId],
      }));
    },
    [updateState]
  );

  const isHadithBookmarked = useCallback(
    (hadithId: string) => state.hadithBookmarks.includes(hadithId),
    [state.hadithBookmarks]
  );

  const markAyahRead = useCallback(
    (ayahId: number) => {
      updateState((prev) => ({
        ...prev,
        readAyatIds: prev.readAyatIds.includes(ayahId)
          ? prev.readAyatIds
          : [...prev.readAyatIds, ayahId],
      }));
    },
    [updateState]
  );

  // Soft streak — counts total "Days with Allah", never decrements.
  // No punishment for missed days, illness, menstruation, travel, or rest.
  // The number only ever goes up.
  const incrementStreak = useCallback(() => {
    const today = getTodayKey();
    updateState((prev) => {
      const { streak } = prev;
      if (streak.lastActiveDate === today) return prev;

      const newCount = streak.count + 1;
      return {
        ...prev,
        streak: {
          count: newCount,
          lastActiveDate: today,
          longestStreak: newCount,
        },
      };
    });
  }, [updateState]);

  const toggleDeed = useCallback(
    (deedId: string) => {
      const today = getTodayKey();
      updateState((prev) => {
        const todayDeeds = prev.goodDeeds[today] ?? [];
        const newDeeds = todayDeeds.includes(deedId)
          ? todayDeeds.filter((d) => d !== deedId)
          : [...todayDeeds, deedId];

        const newState = {
          ...prev,
          goodDeeds: { ...prev.goodDeeds, [today]: newDeeds },
        };

        // Soft streak — increment "Days with Allah" once per day on any deed.
        if (!todayDeeds.includes(deedId)) {
          const { streak } = prev;
          if (streak.lastActiveDate !== today) {
            const newCount = streak.count + 1;
            newState.streak = {
              count: newCount,
              lastActiveDate: today,
              longestStreak: newCount,
            };
          }
        }
        return newState;
      });
    },
    [updateState]
  );

  /**
   * Add a deed to today's list if not already present. Never removes — used
   * for auto-linking from in-app actions (e.g. opening a dua, completing a
   * dhikr round, scrolling a surah). Bumps the soft streak the first time
   * any deed is added today.
   */
  const markDeedDone = useCallback(
    (deedId: string) => {
      const today = getTodayKey();
      updateState((prev) => {
        const todayDeeds = prev.goodDeeds[today] ?? [];
        if (todayDeeds.includes(deedId)) return prev;
        const newState: AppState = {
          ...prev,
          goodDeeds: { ...prev.goodDeeds, [today]: [...todayDeeds, deedId] },
        };
        const { streak } = prev;
        if (streak.lastActiveDate !== today) {
          const newCount = streak.count + 1;
          newState.streak = {
            count: newCount,
            lastActiveDate: today,
            longestStreak: newCount,
          };
        }
        return newState;
      });
    },
    [updateState]
  );

  const isDeedChecked = useCallback(
    (deedId: string) => {
      const today = getTodayKey();
      return (state.goodDeeds[today] ?? []).includes(deedId);
    },
    [state.goodDeeds]
  );

  const getTodayDeeds = useCallback(() => {
    const today = getTodayKey();
    return state.goodDeeds[today] ?? [];
  }, [state.goodDeeds]);

  const updateSettings = useCallback(
    (newSettings: Partial<AppSettings>) => {
      updateState((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...newSettings },
      }));
    },
    [updateState]
  );

  const setLastReadPosition = useCallback(
    (pos: LastReadPosition) => {
      updateState((prev) => {
        // Skip the write if the position is unchanged — avoids storage churn
        // when the surah detail screen re-renders.
        const cur = prev.lastReadPosition;
        if (
          cur &&
          cur.surahId === pos.surahId &&
          cur.ayahNumber === pos.ayahNumber
        ) {
          return prev;
        }
        return { ...prev, lastReadPosition: pos };
      });
    },
    [updateState]
  );

  return (
    <AppContext.Provider
      value={{
        state,
        toggleBookmark,
        isBookmarked,
        toggleHadithBookmark,
        isHadithBookmarked,
        markAyahRead,
        toggleDeed,
        markDeedDone,
        isDeedChecked,
        getTodayDeeds,
        updateSettings,
        incrementStreak,
        setLastReadPosition,
        loaded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
