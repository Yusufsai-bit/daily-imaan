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
 * Schedule daily Ayat-of-the-Day notifications at the given times.
 *
 * The body is a generic prompt — never the verse text itself — so the
 * notification never goes stale across days. (A DAILY trigger fires the
 * same body forever; embedding ayah text here would show yesterday's ayah
 * if the user did not foreground the app to trigger a reschedule.)
 *
 * The user reads today's actual verse by opening the app from the
 * notification; the verse is computed fresh at that point.
 *
 * Notification IDs are persisted to AsyncStorage so they can be
 * individually cancelled when the user updates the reminder schedule.
 */
export async function scheduleAyatNotifications(
  times: string[]
): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    // Read action is dismiss-only (does not foreground the app). Tapping
    // the notification body itself still opens the app via the OS default.
    await Notifications.setNotificationCategoryAsync("daily_ayat", [
      {
        identifier: "read",
        buttonTitle: "Mark as Read",
        options: { opensAppToForeground: false },
      },
    ]);

    // Cancel previously scheduled ayat notifications using their stored IDs.
    const storedIds = await loadAyatNotifIds();
    for (const id of storedIds) {
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch {
        // Notification may have already fired or been cleared; continue.
      }
    }

    // Fallback: also cancel any remaining ayat notifications by category,
    // in case IDs were lost (e.g. app data cleared).
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of scheduled) {
      if (n.content.categoryIdentifier === "daily_ayat") {
        try {
          await Notifications.cancelScheduledNotificationAsync(n.identifier);
        } catch {
          // ignore
        }
      }
    }

    if (times.length === 0) {
      await saveAyatNotifIds([]);
      return;
    }

    // Generic, evergreen body — never goes stale.
    const body = "Your verse for today is ready. Tap to read.";

    // Schedule a notification for each configured time and collect the IDs.
    const newIds: string[] = [];
    for (const time of times) {
      const parts = time.split(":");
      const hour = parseInt(parts[0] ?? "7");
      const minute = parseInt(parts[1] ?? "0");
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Daily Imaan",
          body,
          categoryIdentifier: "daily_ayat",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
      newIds.push(id);
    }

    // Persist the new IDs so they can be cancelled on the next reschedule.
    await saveAyatNotifIds(newIds);
  } catch (err) {
    // Notifications may not work in all environments (e.g. Expo Go simulator).
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

export async function cancelAllNotifications(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await saveAyatNotifIds([]);
  } catch {
    // ignore
  }
}
