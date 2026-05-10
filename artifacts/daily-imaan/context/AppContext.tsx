import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { DEFAULT_RECITER_ID } from "@/constants/reciters";
import { syncRemoteState, hydrateRemoteState } from "@/lib/remoteState";

export interface PrayerSoundSettings {
  Fajr: boolean;
  Dhuhr: boolean;
  Asr: boolean;
  Maghrib: boolean;
  Isha: boolean;
}

/**
 * Per-prayer manual offset in minutes. Lets users match their local mosque
 * exactly when calculation methods produce a slightly different time.
 *
 * Range: -15 .. +15 (clamped on write). Default 0 for every prayer. Applied
 * at both display time (home screen, schedule sheet) and at notification
 * scheduling time, so the user only sets it in one place.
 *
 * "Most-requested feature in negative reviews of every prayer app" —
 * see COMPETITIVE_BRIEF.md.
 */
export interface PrayerOffsets {
  Fajr: number;
  Dhuhr: number;
  Asr: number;
  Maghrib: number;
  Isha: number;
}

export interface AppSettings {
  ayatOrder: "sequential" | "random";
  notificationTimes: string[];
  prayerMethod: number;
  /** Asr juristic school. 0 = Standard (Shafi'i/Maliki/Hanbali), 1 = Hanafi. */
  prayerSchool: number;
  darkMode: boolean;
  /**
   * Per-prayer sound toggle for prayer-time notifications. All five prayers
   * default to ON so users hear a nudge at every salah out of the box; users
   * can mute Fajr (or any other) individually from Settings if they don't
   * want the pre-sunrise alert. The actual sound played when ON is governed
   * by `adhanSound` below.
   */
  prayerSoundEnabled: PrayerSoundSettings;
  /**
   * Which audio file plays when a prayer-time reminder fires with sound on.
   *  - "default":  device's default notification sound (always available).
   *  - "madinah":  bundled adhan-madinah.mp3 (CC0 public domain, requires
   *                no attribution — chosen over Makkah for v1 to keep the
   *                in-app About screen tighter).
   * Falls back to "default" if the chosen audio file is missing at runtime
   * (expo-notifications silently uses the system sound when a referenced
   * filename isn't found in the bundle).
   *
   * NOTE: "makkah" was supported in v1-beta but is dropped before launch
   * to simplify CC BY 3.0 attribution requirements. AppContext migration
   * coerces any persisted "makkah" value back to "default" so old clients
   * upgrade cleanly.
   */
  adhanSound: "default" | "madinah";
  /**
   * Audio reciter for ayah playback. Stored as the alquran.cloud edition
   * code (e.g. "ar.alafasy"). See constants/reciters.ts for the catalogue.
   */
  reciter: string;
  /**
   * Master switch for the daily ayah reminder notification(s). When OFF,
   * `notificationTimes` is ignored at scheduling time and no ayah pushes
   * are scheduled. Defaults to OFF — reminders are an opt-in feature so
   * the app stays quiet on a fresh install.
   */
  dailyAyahReminderEnabled: boolean;
  /**
   * Master switch for the daily hadith reminder notification. When ON,
   * fires one daily nudge at `hadithReminderTime`. Defaults to OFF.
   */
  dailyHadithReminderEnabled: boolean;
  /** HH:MM (24h) for the daily hadith reminder. Defaults to "20:00". */
  hadithReminderTime: string;
  /**
   * Master switch for the morning + evening adhkar reminders. When ON,
   * two daily nudges are scheduled — morning (07:00) and evening (17:30).
   * Defaults to OFF. Times are sensible global defaults; future enhancement
   * can tie them to actual Fajr/Asr from usePrayerTimes.
   */
  adhkarReminderEnabled: boolean;
  /**
   * Crash-reporting opt-out. When false, Sentry capture functions early-exit
   * even if Sentry was initialized. Defaults to ON because anonymized stack
   * traces help us fix bugs faster — but the user is in control.
   */
  crashReportsEnabled: boolean;
  /**
   * Mushaf mode in Surah detail — when true, hides the English translation
   * and the Tafsir/Listen action row to focus on the Arabic text. Off by
   * default. Toggle from the Surah detail header.
   */
  mushafMode: boolean;
  /**
   * Dhikr target preset.
   *  - "sunnah":   33 / 33 / 34 (totals 100, post-salah hadith)
   *  - "extended": 100 / 100 / 100 (per-category extended sessions)
   * Persisted so the user's preference survives across sessions.
   * Picker lives at the top of the Dhikr tab.
   */
  dhikrPreset: "sunnah" | "extended";
  /**
   * Arabic font size in the Surah detail screen. Three discrete sizes
   * map to multipliers on the base (24px) Arabic line. Persisted so the
   * choice survives reading sessions. Older readers regularly need
   * "large" — accommodating that is a basic accessibility win and a
   * Muslim Pro parity feature.
   */
  arabicFontSize: "small" | "medium" | "large";
  /**
   * When ON, finishing one ayah's audio auto-plays the next ayah in the
   * surah. Off by default — most users tap-to-listen on a single ayah.
   * Toggle lives in the Surah detail header next to mushaf-mode.
   */
  continuousPlay: boolean;
  /**
   * Per-prayer manual offset in minutes. See PrayerOffsets type doc above.
   * Applied at every display + scheduling site so the user adjusts in
   * one place and the change propagates everywhere.
   */
  prayerOffsets: PrayerOffsets;
}

export interface StreakData {
  /** Current consecutive-day streak. Resets to 0 only when a missed day cannot
   * be bridged by an available freeze. Increments to 1 on first activity. */
  count: number;
  /** Highest count ever achieved. Tracked separately because count CAN go down
   * (when freezes run out). longestStreak only ever goes up. */
  longestStreak: number;
  /** YYYY-MM-DD of the most recent recorded activity. Empty string before
   * first activity. Used to detect consecutive vs missed days. */
  lastActiveDate: string;
  /** 0–2 streak freezes available. Refilled to 2 each Sunday (UTC-local).
   * A freeze auto-applies when the user returns after exactly one missed day,
   * preserving the streak silently. Two missed days = needs both freezes,
   * three or more = streak resets regardless of freezes. */
  freezesAvailable: number;
  /** YYYY-MM-DD of the Sunday on which freezes were last refilled.
   * Empty string before first refill. Drives the weekly top-up. */
  freezesRefilledOn: string;
  /** YYYY-MM-DD of the most recent day a freeze was applied to save the
   * streak. Null when no freeze has been used yet, or after the user has
   * dismissed the celebration. Drives the "We saved your streak" toast. */
  savedByFreezeOn: string | null;
  /** YYYY-MM-DD on which the user last dismissed the freeze-saved
   * celebration. When equal to savedByFreezeOn, the celebration is hidden. */
  freezeCelebrationAcknowledgedOn: string | null;
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
  /**
   * First-launch welcome screen flag. False until the user has seen the
   * welcome / sources / privacy intro and tapped "Begin". Stored at the
   * top level (not in settings) so it cannot be reset by a settings reset.
   */
  welcomeSeen: boolean;
  /**
   * Soft home-screen tip banner ("Want a daily reminder? Enable in Settings")
   * dismissal flag. Once true, the banner never re-appears. Also auto-hides
   * via render-time check when the user has actually enabled a reminder.
   */
  homeTipDismissed: boolean;
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
  /** Record an activity for today (open app, read ayah, etc.). Computes
   * consecutive-day logic, applies freezes when possible, and bumps the
   * streak. Idempotent within the same calendar day — the second call on
   * a given day no-ops. Replaces the legacy `incrementStreak`. */
  recordActivity: () => void;
  /** Dismiss the "We saved your streak" celebration (after user has seen
   * it once). Sets freezeCelebrationAcknowledgedOn to today. Idempotent. */
  acknowledgeFreezeCelebration: () => void;
  setLastReadPosition: (pos: LastReadPosition) => void;
  /** Mark the first-launch welcome flow as completed. Idempotent. */
  setWelcomeSeen: () => void;
  /** Permanently dismiss the home-screen reminder tip banner. Idempotent. */
  dismissHomeTip: () => void;
  loaded: boolean;
}

// v2 schema: real consecutive-day streak with freeze grace days. v1 had only
// a count-up "Days with Allah" counter. Migration preserves the count and
// longestStreak; new freeze fields default to 2 freezes available.
const CURRENT_STATE_VERSION = 2;

const DEFAULT_STATE: AppState = {
  version: CURRENT_STATE_VERSION,
  bookmarks: [],
  hadithBookmarks: [],
  streak: {
    count: 0,
    longestStreak: 0,
    lastActiveDate: "",
    freezesAvailable: 2,
    freezesRefilledOn: "",
    savedByFreezeOn: null,
    freezeCelebrationAcknowledgedOn: null,
  },
  goodDeeds: {},
  settings: {
    ayatOrder: "sequential",
    notificationTimes: ["07:00", "13:00", "18:00"],
    prayerMethod: 1,
    prayerSchool: 0,
    darkMode: false,
    prayerSoundEnabled: {
      Fajr: true,
      Dhuhr: true,
      Asr: true,
      Maghrib: true,
      Isha: true,
    },
    adhanSound: "default",
    reciter: DEFAULT_RECITER_ID,
    dailyAyahReminderEnabled: false,
    dailyHadithReminderEnabled: false,
    hadithReminderTime: "20:00",
    adhkarReminderEnabled: false,
    crashReportsEnabled: true,
    mushafMode: false,
    dhikrPreset: "sunnah",
    arabicFontSize: "medium",
    continuousPlay: false,
    prayerOffsets: { Fajr: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 },
  },
  readAyatIds: [],
  lastReadPosition: null,
  welcomeSeen: false,
  homeTipDismissed: false,
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
  // v1 → v2: adds streak freeze fields (freezesAvailable, freezesRefilledOn,
  //   savedByFreezeOn, freezeCelebrationAcknowledgedOn). Existing users keep
  //   their count + longestStreak, get 2 fresh freezes, and lastActiveDate
  //   carries over so the consecutive-day calc works on first new launch.
  // Coerce dropped adhan-sound value. v1-beta supported "makkah" but the
  // CC BY 3.0 attribution requirement was dropped pre-launch. Persisted
  // "makkah" values become "default" rather than crashing the type-narrowed
  // path in useNotifications.
  const savedSettings = saved.settings ?? {};
  if ((savedSettings as { adhanSound?: string }).adhanSound === "makkah") {
    (savedSettings as { adhanSound?: string }).adhanSound = "default";
  }

  return {
    ...DEFAULT_STATE,
    ...saved,
    settings: { ...DEFAULT_STATE.settings, ...savedSettings },
    streak: { ...DEFAULT_STATE.streak, ...(saved.streak ?? {}) },
    bookmarks: Array.isArray(saved.bookmarks) ? saved.bookmarks : [],
    hadithBookmarks: Array.isArray(saved.hadithBookmarks) ? saved.hadithBookmarks : [],
    readAyatIds: Array.isArray(saved.readAyatIds) ? saved.readAyatIds : [],
    goodDeeds:
      typeof saved.goodDeeds === "object" && saved.goodDeeds !== null
        ? saved.goodDeeds
        : {},
    lastReadPosition: saved.lastReadPosition ?? null,
    welcomeSeen: typeof saved.welcomeSeen === "boolean" ? saved.welcomeSeen : false,
    homeTipDismissed:
      typeof saved.homeTipDismissed === "boolean" ? saved.homeTipDismissed : false,
    version: CURRENT_STATE_VERSION,
  };
}

/**
 * Compute the calendar-day gap between two YYYY-MM-DD strings (b minus a).
 * Returns the integer number of days, ignoring the time-of-day. Robust to
 * DST transitions and leap years because it works on date arithmetic, not
 * milliseconds. Returns Infinity if either string is empty/invalid.
 */
function dayGapBetween(a: string, b: string): number {
  if (!a || !b) return Infinity;
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) return Infinity;
  // Strip TZ effects: anchor both to UTC noon so DST shifts can't move the
  // delta across a day boundary. Resulting diff is always a clean multiple of
  // 86_400_000 ms.
  const aUtc = Date.UTC(da.getFullYear(), da.getMonth(), da.getDate());
  const bUtc = Date.UTC(db.getFullYear(), db.getMonth(), db.getDate());
  return Math.round((bUtc - aUtc) / (1000 * 60 * 60 * 24));
}

/**
 * Returns the YYYY-MM-DD of the most recent Sunday on or before `dateKey`.
 * Used as the canonical "weekly refill anchor" so the same week always maps
 * to the same anchor regardless of which day the user opens the app.
 */
function mostRecentSundayKey(dateKey: string): string {
  if (!dateKey) return "";
  const d = new Date(dateKey + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "";
  const dow = d.getDay(); // 0 = Sunday … 6 = Saturday
  d.setDate(d.getDate() - dow);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const FREEZES_PER_WEEK = 2;

/**
 * Apply the consecutive-day streak rules for a single activity event.
 *
 * Rules:
 *   - Same day already counted → no change (idempotent).
 *   - 1-day gap (yesterday → today) → count++, normal continuation.
 *   - 2-day gap with ≥1 freeze → count++ (uses 1 freeze), savedByFreezeOn=today.
 *   - 3-day gap with 2 freezes → count++ (uses 2 freezes), savedByFreezeOn=today.
 *   - Larger gap or insufficient freezes → count = 1, freezes preserved.
 *   - No prior activity → count = 1.
 *
 * Weekly freeze top-up: every Sunday, freezesAvailable refills to FREEZES_PER_WEEK.
 * Refill happens lazily on the first activity of a new week.
 */
function applyStreakActivity(
  prev: StreakData,
  todayKey: string,
): StreakData {
  // No-op if already counted today.
  if (prev.lastActiveDate === todayKey) return prev;

  // Weekly freeze refill check (lazy).
  const thisWeekAnchor = mostRecentSundayKey(todayKey);
  let freezes = prev.freezesAvailable;
  let refilledOn = prev.freezesRefilledOn;
  if (thisWeekAnchor && thisWeekAnchor !== prev.freezesRefilledOn) {
    freezes = FREEZES_PER_WEEK;
    refilledOn = thisWeekAnchor;
  }

  const gap = dayGapBetween(prev.lastActiveDate, todayKey);

  // First-ever activity.
  if (gap === Infinity) {
    return {
      count: 1,
      longestStreak: Math.max(1, prev.longestStreak),
      lastActiveDate: todayKey,
      freezesAvailable: freezes,
      freezesRefilledOn: refilledOn,
      savedByFreezeOn: prev.savedByFreezeOn,
      freezeCelebrationAcknowledgedOn: prev.freezeCelebrationAcknowledgedOn,
    };
  }

  // Same-day or older-than-today (clock skew) — idempotent.
  if (gap <= 0) return prev;

  // Consecutive day → simple bump.
  if (gap === 1) {
    const newCount = prev.count + 1;
    return {
      count: newCount,
      longestStreak: Math.max(newCount, prev.longestStreak),
      lastActiveDate: todayKey,
      freezesAvailable: freezes,
      freezesRefilledOn: refilledOn,
      savedByFreezeOn: prev.savedByFreezeOn,
      freezeCelebrationAcknowledgedOn: prev.freezeCelebrationAcknowledgedOn,
    };
  }

  // Missed days — try to bridge with freezes. We need (gap - 1) freezes to
  // cover the days between lastActive and today (the today activity itself
  // doesn't consume a freeze).
  const missedDays = gap - 1;
  if (missedDays <= freezes) {
    const newCount = prev.count + 1;
    return {
      count: newCount,
      longestStreak: Math.max(newCount, prev.longestStreak),
      lastActiveDate: todayKey,
      freezesAvailable: freezes - missedDays,
      freezesRefilledOn: refilledOn,
      // Surface the celebration only once per missed-day rescue.
      savedByFreezeOn: todayKey,
      // Reset acknowledgement so the celebration fires.
      freezeCelebrationAcknowledgedOn: null,
    };
  }

  // Streak broken — too many missed days. Reset count to 1 (this activity
  // counts as day 1 of a new streak). longestStreak preserved.
  return {
    count: 1,
    longestStreak: prev.longestStreak,
    lastActiveDate: todayKey,
    freezesAvailable: freezes,
    freezesRefilledOn: refilledOn,
    // No celebration on reset.
    savedByFreezeOn: prev.savedByFreezeOn,
    freezeCelebrationAcknowledgedOn: prev.freezeCelebrationAcknowledgedOn,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      // 1. Hydrate from local AsyncStorage first — instant, works offline.
      let initial: AppState | null = null;
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<AppState>;
          initial = migrateState(saved);
          setState(initial);
        }
      } catch {
        // use defaults
      } finally {
        setLoaded(true);
      }

      // 2. Try remote (Supabase anonymous session). If env vars are unset or
      // network fails, this no-ops gracefully — local state remains canonical.
      // If a newer remote state exists, we adopt it (last-write-wins by
      // updatedAt). The remote layer is opt-in: see lib/remoteState.ts.
      try {
        const remote = await hydrateRemoteState();
        if (remote) {
          const merged = migrateState(remote);
          // Only adopt remote if it is materially newer or local is empty.
          // We use a simple "remote wins if remote streak.lastActiveDate is
          // strictly newer than local" rule. For richer conflict resolution
          // (per-field timestamps), expand later.
          const localActive = initial?.streak.lastActiveDate ?? "";
          const remoteActive = merged.streak.lastActiveDate ?? "";
          if (!initial || remoteActive > localActive) {
            setState(merged);
            // Cache remote to local so subsequent cold starts are instant.
            try {
              await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                  ...merged,
                  goodDeeds: pruneGoodDeeds(merged.goodDeeds),
                })
              );
            } catch {
              /* ignore */
            }
          }
        }
      } catch {
        // Remote sync is best-effort. Never block on it.
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
      // Fire-and-forget remote sync. No-op when Supabase env vars are unset.
      // Errors are swallowed inside syncRemoteState so a failed write never
      // breaks the local-write path the user can see.
      void syncRemoteState(persisted);
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

  // Memoised Set for O(1) lookups. After a few hundred bookmarks, the
  // previous .includes() scan would do a linear walk on every render.
  const bookmarkSet = useMemo(() => new Set(state.bookmarks), [state.bookmarks]);
  const isBookmarked = useCallback(
    (ayahId: number) => bookmarkSet.has(ayahId),
    [bookmarkSet]
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

  const hadithBookmarkSet = useMemo(
    () => new Set(state.hadithBookmarks),
    [state.hadithBookmarks]
  );
  const isHadithBookmarked = useCallback(
    (hadithId: string) => hadithBookmarkSet.has(hadithId),
    [hadithBookmarkSet]
  );

  const readAyatSet = useMemo(() => new Set(state.readAyatIds), [state.readAyatIds]);
  const markAyahRead = useCallback(
    (ayahId: number) => {
      updateState((prev) => {
        // O(1) duplicate check using the same Set membership semantics.
        if (prev.readAyatIds.includes(ayahId)) return prev;
        return { ...prev, readAyatIds: [...prev.readAyatIds, ayahId] };
      });
    },
    [updateState]
  );
  // Suppress unused-var warning while exposing readAyatSet for future
  // home-screen "you've read N ayahs" UIs.
  void readAyatSet;

  // Real consecutive-day streak with freeze grace days. Forgiving but
  // truthful: 1-day gap continues normally, 2-day gap costs 1 freeze, 3-day
  // gap costs 2 freezes, beyond that the streak resets to 1. Two freezes
  // refill every Sunday. See applyStreakActivity for full logic.
  const recordActivity = useCallback(() => {
    const today = getTodayKey();
    updateState((prev) => {
      const next = applyStreakActivity(prev.streak, today);
      if (next === prev.streak) return prev; // idempotent same-day no-op
      return { ...prev, streak: next };
    });
  }, [updateState]);

  // Acknowledge the "We saved your streak" celebration so it doesn't show
  // again on the same rescue. Idempotent.
  const acknowledgeFreezeCelebration = useCallback(() => {
    updateState((prev) => {
      const today = getTodayKey();
      if (
        !prev.streak.savedByFreezeOn ||
        prev.streak.freezeCelebrationAcknowledgedOn === today
      ) {
        return prev;
      }
      return {
        ...prev,
        streak: {
          ...prev.streak,
          freezeCelebrationAcknowledgedOn: today,
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

        const newState: AppState = {
          ...prev,
          goodDeeds: { ...prev.goodDeeds, [today]: newDeeds },
        };

        // Adding (not removing) a deed counts as activity for streak purposes.
        if (!todayDeeds.includes(deedId)) {
          newState.streak = applyStreakActivity(prev.streak, today);
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
          streak: applyStreakActivity(prev.streak, today),
        };
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

  const setWelcomeSeen = useCallback(() => {
    updateState((prev) => (prev.welcomeSeen ? prev : { ...prev, welcomeSeen: true }));
  }, [updateState]);

  const dismissHomeTip = useCallback(() => {
    updateState((prev) =>
      prev.homeTipDismissed ? prev : { ...prev, homeTipDismissed: true }
    );
  }, [updateState]);

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
        recordActivity,
        acknowledgeFreezeCelebration,
        setLastReadPosition,
        setWelcomeSeen,
        dismissHomeTip,
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
