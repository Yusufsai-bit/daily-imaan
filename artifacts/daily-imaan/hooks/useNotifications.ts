import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { PrayerTimes } from "@/hooks/usePrayerTimes";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
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

export async function scheduleAyatNotifications(
  times: string[],
  todayAyatText: string,
  ayahId: number
): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.setNotificationCategoryAsync("daily_ayat", [
      {
        identifier: "read",
        buttonTitle: "Read",
        options: { opensAppToForeground: true },
      },
    ]);

    // Cancel only existing ayat notifications before re-scheduling
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of scheduled) {
      if (n.content.categoryIdentifier === "daily_ayat") {
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
      }
    }

    for (const time of times) {
      const parts = time.split(":");
      const hour = parseInt(parts[0] ?? "7");
      const minute = parseInt(parts[1] ?? "0");
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Daily Imaan",
          body: todayAyatText,
          categoryIdentifier: "daily_ayat",
          // ayahId is stored so tapping "Read" can mark the correct ayah as read
          data: { ayahId },
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

export async function schedulePrayerNotifications(
  prayerTimes: PrayerTimes
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

    const prayerList: { name: string; timeStr: string }[] = [
      { name: "Fajr", timeStr: prayerTimes.Fajr },
      { name: "Dhuhr", timeStr: prayerTimes.Dhuhr },
      { name: "Asr", timeStr: prayerTimes.Asr },
      { name: "Maghrib", timeStr: prayerTimes.Maghrib },
      { name: "Isha", timeStr: prayerTimes.Isha },
    ];

    const now = new Date();

    for (const prayer of prayerList) {
      const parts = prayer.timeStr.split(":");
      const hour = parseInt(parts[0] ?? "0");
      // Strip AM/PM suffixes the Aladhan API may append
      const rawMin = (parts[1] ?? "00").split(" ")[0] ?? "00";
      const minute = parseInt(rawMin);

      const prayerDate = new Date(now);
      prayerDate.setHours(hour, minute, 0, 0);

      // Use DAILY trigger so the reminder fires every day at the same time.
      // Prayer times shift only ~1 min/day; the app reschedules on each foreground
      // refresh with updated exact times (via usePrayerTimes + AppState listener).
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${prayer.name} Time`,
          body: `It's time for ${prayer.name} prayer.`,
          categoryIdentifier: "prayer_time",
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
  } catch {
    // ignore
  }
}
