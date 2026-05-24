import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { PrayerTimes } from "@/hooks/usePrayerTimes";
import type { PrayerSoundSettings } from "@/context/AppContext";

const AYAT_NOTIF_IDS_KEY = "@daily_imaan_ayat_notif_ids";

/**
 * Per-category serialized queue (tail-chained).
 *
 * Each scheduler in this file follows a "cancel everything in category X,
 * then schedule N fresh entries" pattern. That sequence has multiple `await`
 * points, so two concurrent invocations on the same category can interleave:
 * caller A finishes its cancel and starts scheduling, caller B starts after
 * A's cancel (sees nothing to cancel) and schedules a second full set on top.
 * Result: the user sees every notification twice.
 *
 * `withCategoryLock` chains each new call onto the *current tail* of that
 * category's queue, so any number of concurrent callers run strictly in
 * sequence (A → B → C → …). Cross-category calls (e.g. `daily_ayat` and
 * `prayer_time`) still run in parallel — only same-category calls queue.
 *
 * Note: a naive "await previous; then run" implementation does NOT queue
 * correctly — if B and C both await the same `previous` they will then run
 * concurrently after `previous` resolves. The fix is to chain the new
 * promise onto the previous one immediately and store *that* as the new
 * tail, so the next arriving caller chains onto it (not onto `previous`).
 */
const queueTailByCategory = new Map<string, Promise<void>>();
async function withCategoryLock(
  categoryId: string,
  fn: () => Promise<void>
): Promise<void> {
  const previous = queueTailByCategory.get(categoryId) ?? Promise.resolve();
  // Swallow upstream errors so one failed scheduler doesn't break the chain
  // for everyone behind it.
  const next: Promise<void> = previous
    .catch(() => undefined)
    .then(() => fn());
  queueTailByCategory.set(categoryId, next);
  try {
    await next;
  } finally {
    // Only clear if the current promise is still the tail — a later caller
    // may have already chained onto us and become the new tail.
    if (queueTailByCategory.get(categoryId) === next) {
      queueTailByCategory.delete(categoryId);
    }
  }
}

/**
 * Dev-only audit: log how many entries are currently scheduled for the given
 * category. Useful for spotting duplicates after toggles / foregrounding.
 */
async function auditCategoryCount(categoryId: string): Promise<void> {
  if (!__DEV__) return;
  try {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    const count = all.filter(
      (n) => n.content.categoryIdentifier === categoryId
    ).length;
    console.log(`[DailyImaan] scheduled ${categoryId}: ${count}`);
  } catch {
    /* ignore audit-only errors */
  }
}

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
  // Serialize concurrent callers (settings effect + AppState foreground +
  // settings-toggle bursts) — see `withCategoryLock` docs above.
  await withCategoryLock("daily_ayat", async () => {
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
        await auditCategoryCount("daily_ayat");
        return;
      }

      // Lazily request permission only when the user has actually opted in to a
      // reminder — never at app launch, per Apple HIG and Play Store guidance.
      const granted = await requestNotificationPermission();
      if (!granted) {
        await saveAyatNotifIds([]);
        return;
      }

      const body = pickRotatedBody(AYAT_BODY_POOL);
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
      await auditCategoryCount("daily_ayat");
    } catch (err) {
      if (__DEV__) console.warn("[DailyImaan] scheduleAyatNotifications failed:", err);
    }
  });
}


/**
 * Default fallback if no settings are passed. **Must match AppContext's
 * `prayerSoundEnabled` default exactly** — a previous mismatch (Fajr: false
 * here, Fajr: true in AppContext) meant whichever path hit first decided
 * whether Fajr made a sound, invisibly to QA.
 */
const DEFAULT_PRAYER_SOUND_ENABLED: PrayerSoundSettings = {
  Fajr: true,
  Dhuhr: true,
  Asr: true,
  Maghrib: true,
  Isha: true,
};

/**
 * Warmer notification copy rotated by day so a daily user doesn't see the
 * same string for weeks. Picked deterministically from the local calendar
 * day so push schedulers don't accidentally shuffle copy mid-day.
 */
function pickRotatedBody(pool: string[]): string {
  if (pool.length === 0) return "";
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return pool[seed % pool.length] ?? pool[0]!;
}

const AYAT_BODY_POOL = [
  "A verse for your heart today.",
  "A small light for today.",
  "Your ayah is here.",
  "A reminder, when you're ready.",
];

const HADITH_BODY_POOL = [
  "A hadith for today — short and good.",
  "A word from the Prophet ﷺ for today.",
  "A small saying, a big reminder.",
];

const ADHKAR_MORNING_POOL = [
  "Begin in His protection.",
  "A few minutes to start the day.",
  "Morning adhkar — soft start.",
];

const ADHKAR_EVENING_POOL = [
  "A few minutes of peace before sleep.",
  "Take refuge until Fajr.",
  "Evening adhkar — close out the day.",
];

/**
 * Resolve the chosen adhan key to the exact filename `expo-notifications`
 * looks up against the `sounds[]` array registered in `app.json` (under the
 * expo-notifications plugin). Returns `true` for the device's default sound,
 * a string filename for a bundled adhan, or `false` for silent.
 *
 * Filename convention: register `.mp3` in app.json. expo-notifications copies
 * the file into the platform-specific notification-sound location at build
 * time; iOS converts to .caf internally, Android registers the raw resource
 * onto the channel created by `setupAndroidPrayerChannel()`. The string we
 * return here MUST match the basename + extension as registered in app.json
 * exactly — any mismatch silently falls back to the system sound.
 *
 * IMPORTANT: any filename returned here (e.g. `adhan-makkah.mp3`,
 * `adhan_madinah.mp3`) must also appear, byte-identical, in the
 * `expo-notifications` plugin's `sounds[]` array in `artifacts/daily-imaan/app.json`
 * AND as a real file under `assets/sounds/`. The plugin only bundles assets
 * it finds in that array at prebuild time — anything missing or mistyped
 * silently falls back to the device's default notification sound on both
 * iOS (the `sound` field can't resolve the resource) and Android (the
 * per-channel sound URI doesn't resolve). The Settings UI will still show
 * the choice as active, so the failure is invisible. Keep these three
 * places in sync whenever you add/rename an adhan option.
 */
function resolveAdhanSound(
  enabled: boolean,
  adhanSound: "default" | "madinah" | "makkah"
): boolean | string {
  if (!enabled) return false;
  if (adhanSound === "madinah") return "adhan_madinah.mp3";
  if (adhanSound === "makkah") return "adhan_makkah.mp3";
  return true; // device default
}

/**
 * Android 8+ requires a NotificationChannel with the custom sound URI baked
 * in at channel-creation time — `content.sound` on individual notifications
 * is *ignored* on Android once channels exist. We create one channel per
 * adhan choice and route each prayer notification through the matching
 * channel. Channels are idempotent (safe to call repeatedly) and the sound
 * cannot be changed after creation, which is why we use one channel per
 * sound option rather than mutating a single channel.
 *
 * The "default" channel uses the system sound (sound: undefined). Channels
 * for missing audio files fall back gracefully — Android plays the default
 * sound when the named resource isn't found in the APK.
 */
async function setupAndroidPrayerChannels(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("prayer-default", {
    name: "Prayer reminders",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
  });
  await Notifications.setNotificationChannelAsync("prayer-madinah", {
    name: "Prayer reminders — Adhan (Madinah)",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "adhan_madinah.mp3",
  });
  await Notifications.setNotificationChannelAsync("prayer-makkah", {
    name: "Prayer reminders — Adhan (Makkah)",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "adhan_makkah.mp3",
  });
  await Notifications.setNotificationChannelAsync("prayer-silent", {
    name: "Prayer reminders (silent)",
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: null,
  });
}

function androidChannelFor(
  enabled: boolean,
  adhanSound: "default" | "madinah" | "makkah"
): string {
  if (!enabled) return "prayer-silent";
  if (adhanSound === "madinah") return "prayer-madinah";
  if (adhanSound === "makkah") return "prayer-makkah";
  return "prayer-default";
}

export async function schedulePrayerNotifications(
  prayerTimes: PrayerTimes,
  prayerSoundEnabled: PrayerSoundSettings = DEFAULT_PRAYER_SOUND_ENABLED,
  adhanSound: "default" | "madinah" | "makkah" = "default"
): Promise<void> {
  if (Platform.OS === "web") return;
  // Serialize concurrent callers — without this, a `prayerTimes` refresh that
  // overlaps a sound-setting toggle can leave duplicate prayer schedules.
  await withCategoryLock("prayer_time", async () => {
    try {
      await Notifications.setNotificationCategoryAsync("prayer_time", [
        {
          identifier: "open",
          buttonTitle: "Open App",
          options: { opensAppToForeground: true },
        },
      ]);

      // Android 8+ binds sound to the channel, not the notification — set up
      // one channel per adhan choice (default / makkah / madinah / silent) so
      // switching sounds in Settings just routes to a different channel rather
      // than trying to mutate channel sound (which Android forbids).
      await setupAndroidPrayerChannels();

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

        const enabled = prayerSoundEnabled[prayer.name];
        const sound = resolveAdhanSound(enabled, adhanSound);
        const channelId = androidChannelFor(enabled, adhanSound);

        // Use DAILY trigger so the reminder fires every day at the same time.
        // Prayer times shift only ~1 min/day; the home screen effect reruns
        // when the HH:MM key changes (see app/(tabs)/index.tsx). On iOS the
        // `sound` field on content does the routing; on Android `sound` is
        // ignored and the channelId determines which sound plays — both are
        // passed for correctness on either OS.
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${prayer.name} Time`,
            body: `It's time for ${prayer.name} prayer.`,
            categoryIdentifier: "prayer_time",
            sound,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
            channelId,
          },
        });
      }
      await auditCategoryCount("prayer_time");
    } catch {
      // Notifications may not work in all environments
    }
  });
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
  // Serialize concurrent callers — see `withCategoryLock` docs above.
  await withCategoryLock("daily_hadith", async () => {
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

      if (!enabled) {
        await auditCategoryCount("daily_hadith");
        return;
      }

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
          body: pickRotatedBody(HADITH_BODY_POOL),
          categoryIdentifier: "daily_hadith",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
      await auditCategoryCount("daily_hadith");
    } catch (err) {
      if (__DEV__) console.warn("[DailyImaan] scheduleHadithNotification failed:", err);
    }
  });
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
  // Serialize concurrent callers — see `withCategoryLock` docs above.
  await withCategoryLock("daily_adhkar", async () => {
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

      if (!enabled) {
        await auditCategoryCount("daily_adhkar");
        return;
      }

      const granted = await requestNotificationPermission();
      if (!granted) return;

      // Morning adhkar — 07:00 local
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Morning Adhkar",
          body: pickRotatedBody(ADHKAR_MORNING_POOL),
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
          body: pickRotatedBody(ADHKAR_EVENING_POOL),
          categoryIdentifier: "daily_adhkar",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 17,
          minute: 30,
        },
      });
      await auditCategoryCount("daily_adhkar");
    } catch (err) {
      if (__DEV__) console.warn("[DailyImaan] scheduleAdhkarNotifications failed:", err);
    }
  });
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

/**
 * Fire a one-shot test notification ~10 seconds out so the user can
 * confirm system-level delivery is actually working. Catches the #1
 * silent-fail in the category: Android battery optimisations / OEM
 * background-killing / iOS Focus modes that block notifications without
 * any in-app indication.
 *
 * Returns:
 *   - "scheduled" when the OS accepted the schedule
 *   - "permission_denied" when the user denied the prompt
 *   - "error" when something else went wrong
 *
 * The Settings screen surfaces a "didn't get it?" help link if the user
 * reports it never arrived, deep-linking to the OS notification settings.
 */
export async function sendTestNotification(): Promise<
  "scheduled" | "permission_denied" | "error"
> {
  if (Platform.OS === "web") return "error";
  try {
    const granted = await requestNotificationPermission();
    if (!granted) return "permission_denied";
    await Notifications.setNotificationCategoryAsync("test_notification", []);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Imaan — test",
        body: "If you can read this, notifications are working. ✓",
        categoryIdentifier: "test_notification",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
        repeats: false,
      },
    });
    return "scheduled";
  } catch {
    return "error";
  }
}
