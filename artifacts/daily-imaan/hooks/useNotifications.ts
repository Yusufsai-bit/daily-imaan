import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { PrayerTimes } from "@/hooks/usePrayerTimes";
import type { PrayerSoundSettings } from "@/context/AppContext";

const AYAT_NOTIF_IDS_KEY = "@daily_imaan_ayat_notif_ids";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    // Per-prayer sound is decided at scheduling time via the
    // `sound` field on each NotificationContent. The handler simply respects
    // whatever the scheduled notification specified.
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

/**
 * Read the stored ayat notification IDs from AsyncStorage.
 */
async function loadAyatNotifIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(AYAT_NOTIF_IDS_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    // ignore
  }
  return [];
}

/**
 * Persist the given notification IDs to AsyncStorage so they can be
 * individually cancelled the next time the user updates their schedule.
 */
async function saveAyatNotifIds(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(AYAT_NOTIF_IDS_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

/**
 * Schedule daily ayat reminders at the given times. Body is a generic prompt
 * (DAILY-trigger payloads can't be updated without app launch, so embedding
 * verse text would go stale). Today's verse is shown when the user opens the
 * app from the notification.
 */
export async function scheduleAyatNotifications(times: string[]): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.setNotificationCategoryAsync("daily_ayat", [
      {
        identifier: "read",
        buttonTitle: "Mark as Read",
        options: { opensAppToForeground: false },
      },
    ]);

    const storedIds = await loadAyatNotifIds();
    for (const id of storedIds) {
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch {
        /* already fired or cleared */
      }
    }

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of scheduled) {
      if (n.content.categoryIdentifier === "daily_ayat") {
        try {
          await Notifications.cancelScheduledNotificationAsync(n.identifier);
        } catch {
          /* ignore */
        }
      }
    }

    if (times.length === 0) {
      await saveAyatNotifIds([]);
      return;
    }

    // Lazily request permission only when the user has actually opted in to a
    // reminder — never at app launch, per Apple HIG and Play Store guidance.
    const granted = await requestNotificationPermission();
    if (!granted) {
      await saveAyatNotifIds([]);
      return;
    }

    const body = "Your verse for today is ready. Tap to read.";
    const newIds: string[] = [];
    for (const time of times) {
      const parts = time.split(":");
      const hour = parseInt(parts[0] ?? "7");
      const minute = parseInt(parts[1] ?? "0");
      const id = await Notifications.scheduleNotificationAsync({
        content: { title: "Daily Imaan", body, categoryIdentifier: "daily_ayat" },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
      newIds.push(id);
    }
    await saveAyatNotifIds(newIds);
  } catch (err) {
    if (__DEV__) console.warn("[DailyImaan] scheduleAyatNotifications failed:", err);
  }
}


/** Default fallback if no settings are passed (matches AppContext defaults). */
const DEFAULT_PRAYER_SOUND_ENABLED: PrayerSoundSettings = {
  Fajr: false,
  Dhuhr: true,
  Asr: true,
  Maghrib: true,
  Isha: true,
};

export async function schedulePrayerNotifications(
  prayerTimes: PrayerTimes,
  prayerSoundEnabled: PrayerSoundSettings = DEFAULT_PRAYER_SOUND_ENABLED
): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.setNotificationCategoryAsync("prayer_time", [
      {
        identifier: "open",
        buttonTitle: "Open App",
        options: { opensAppToForeground: true },
      },
    ]);

    // Cancel existing prayer notifications
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of scheduled) {
      if (n.content.categoryIdentifier === "prayer_time") {
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
      }
    }

    const prayerList: { name: keyof PrayerSoundSettings; timeStr: string }[] = [
      { name: "Fajr", timeStr: prayerTimes.Fajr },
      { name: "Dhuhr", timeStr: prayerTimes.Dhuhr },
      { name: "Asr", timeStr: prayerTimes.Asr },
      { name: "Maghrib", timeStr: prayerTimes.Maghrib },
      { name: "Isha", timeStr: prayerTimes.Isha },
    ];

    for (const prayer of prayerList) {
      const parts = prayer.timeStr.split(":");
      const hour = parseInt(parts[0] ?? "0");
      // Strip AM/PM suffixes the Aladhan API may append
      const rawMin = (parts[1] ?? "00").split(" ")[0] ?? "00";
      const minute = parseInt(rawMin);

      const soundOn = prayerSoundEnabled[prayer.name];

      // Use DAILY trigger so the reminder fires every day at the same time.
      // Prayer times shift only ~1 min/day; the app reschedules on each foreground
      // refresh with updated exact times (via usePrayerTimes + AppState listener).
      // `sound: true` plays the system default notification sound; `false` is
      // a silent reminder. A bundled adhan recitation would require shipping
      // a licensed .caf/.mp3 asset and referencing its filename here instead.
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${prayer.name} Time`,
          body: `It's time for ${prayer.name} prayer.`,
          categoryIdentifier: "prayer_time",
          sound: soundOn,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
    }
  } catch {
    // Notifications may not work in all environments
  }
}

/**
 * Schedule (or cancel) the once-daily hadith reminder. When `enabled` is
 * false, any existing daily_hadith notifications are cancelled and no new
 * one is scheduled. Otherwise a single DAILY trigger is created at the
 * provided HH:MM. Body is generic — today's hadith is shown when the user
 * opens the app from the notification (DAILY-trigger payloads can't be
 * updated without an app launch, so embedding the text would go stale).
 */
export async function scheduleHadithNotification(
  enabled: boolean,
  time: string
): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.setNotificationCategoryAsync("daily_hadith", [
      {
        identifier: "open",
        buttonTitle: "Open App",
        options: { opensAppToForeground: true },
      },
    ]);

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of scheduled) {
      if (n.content.categoryIdentifier === "daily_hadith") {
        try {
          await Notifications.cancelScheduledNotificationAsync(n.identifier);
        } catch {
          /* already fired or cleared */
        }
      }
    }

    if (!enabled) return;

    // Lazy permission request — only when the user has actually enabled the
    // hadith reminder. Silently no-op if denied so the toggle still appears
    // ON in Settings (the user can re-enable in iOS/Android system settings).
    const granted = await requestNotificationPermission();
    if (!granted) return;

    const parts = time.split(":");
    const hour = parseInt(parts[0] ?? "20");
    const minute = parseInt(parts[1] ?? "0");
    if (Number.isNaN(hour) || Number.isNaN(minute)) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Imaan",
        body: "Your hadith for today is ready. Tap to read.",
        categoryIdentifier: "daily_hadith",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch (err) {
    if (__DEV__) console.warn("[DailyImaan] scheduleHadithNotification failed:", err);
  }
}

/**
 * Schedule (or cancel) the morning + evening adhkar reminders. When `enabled`
 * is false, any existing daily_adhkar notifications are cancelled. Otherwise
 * two DAILY triggers are created at sensible defaults (07:00 morning, 17:30
 * evening). Body is generic — when the user opens the app they go to the
 * adhkar list. Future enhancement: tie times to actual Fajr/Asr.
 */
export async function scheduleAdhkarNotifications(enabled: boolean): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.setNotificationCategoryAsync("daily_adhkar", [
      {
        identifier: "open",
        buttonTitle: "Open Adhkar",
        options: { opensAppToForeground: true },
      },
    ]);

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of scheduled) {
      if (n.content.categoryIdentifier === "daily_adhkar") {
        try {
          await Notifications.cancelScheduledNotificationAsync(n.identifier);
        } catch {
          /* already fired or cleared */
        }
      }
    }

    if (!enabled) return;

    const granted = await requestNotificationPermission();
    if (!granted) return;

    // Morning adhkar — 07:00 local
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Morning Adhkar",
        body: "Begin your day in Allah's protection.",
        categoryIdentifier: "daily_adhkar",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 7,
        minute: 0,
      },
    });

    // Evening adhkar — 17:30 local
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Evening Adhkar",
        body: "Take refuge until Fajr — a few minutes of dhikr.",
        categoryIdentifier: "daily_adhkar",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 17,
        minute: 30,
      },
    });
  } catch (err) {
    if (__DEV__) console.warn("[DailyImaan] scheduleAdhkarNotifications failed:", err);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await saveAyatNotifIds([]);
  } catch {
    // ignore
  }
}
