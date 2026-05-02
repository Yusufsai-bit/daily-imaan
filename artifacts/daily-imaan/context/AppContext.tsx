import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface AppSettings {
  ayatOrder: "sequential" | "random";
  notificationTimes: string[];
  prayerMethod: number;
  darkMode: boolean;
}

export interface StreakData {
  count: number;
  lastActiveDate: string;
  longestStreak: number;
}

export interface AppState {
  bookmarks: number[];
  streak: StreakData;
  goodDeeds: Record<string, string[]>;
  settings: AppSettings;
  readAyatIds: number[];
}

interface AppContextType {
  state: AppState;
  toggleBookmark: (ayahId: number) => void;
  isBookmarked: (ayahId: number) => boolean;
  markAyahRead: (ayahId: number) => void;
  toggleDeed: (deedId: string) => void;
  isDeedChecked: (deedId: string) => boolean;
  getTodayDeeds: () => string[];
  updateSettings: (settings: Partial<AppSettings>) => void;
  incrementStreak: () => void;
  loaded: boolean;
}

const DEFAULT_STATE: AppState = {
  bookmarks: [],
  streak: { count: 0, lastActiveDate: "", longestStreak: 0 },
  goodDeeds: {},
  settings: {
    ayatOrder: "sequential",
    notificationTimes: ["07:00", "13:00", "18:00"],
    prayerMethod: 2,
    darkMode: false,
  },
  readAyatIds: [],
};

const STORAGE_KEY = "@daily_imaan_state";

const AppContext = createContext<AppContextType | null>(null);

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved: AppState = JSON.parse(raw);
          setState({ ...DEFAULT_STATE, ...saved, settings: { ...DEFAULT_STATE.settings, ...saved.settings } });
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
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
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

  const incrementStreak = useCallback(() => {
    const today = getTodayKey();
    updateState((prev) => {
      const { streak } = prev;
      if (streak.lastActiveDate === today) return prev;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

      const wasYesterday = streak.lastActiveDate === yesterdayKey;
      const newCount = wasYesterday ? streak.count + 1 : 1;

      return {
        ...prev,
        streak: {
          count: newCount,
          lastActiveDate: today,
          longestStreak: Math.max(newCount, streak.longestStreak),
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

        // Increment streak when any deed is checked
        if (!todayDeeds.includes(deedId)) {
          const { streak } = prev;
          if (streak.lastActiveDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
            const wasYesterday = streak.lastActiveDate === yesterdayKey;
            const newCount = wasYesterday ? streak.count + 1 : 1;
            newState.streak = {
              count: newCount,
              lastActiveDate: today,
              longestStreak: Math.max(newCount, streak.longestStreak),
            };
          }
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

  return (
    <AppContext.Provider
      value={{
        state,
        toggleBookmark,
        isBookmarked,
        markAyahRead,
        toggleDeed,
        isDeedChecked,
        getTodayDeeds,
        updateSettings,
        incrementStreak,
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
