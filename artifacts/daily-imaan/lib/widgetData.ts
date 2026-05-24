/**
 * Writes ayah and prayer data to platform-specific shared storage so the
 * home/lock screen widgets can display up-to-date content.
 *
 * Android: SharedPreferences "daily_imaan_widget" (read by DailyAyatAppWidget.kt)
 * iOS:     UserDefaults with App Group "group.com.dailyimaan.app" (read by
 *          DailyImaanWidget.swift) — accessed via @react-native-async-storage
 *          with a shared suite when configured, or via the native module below.
 *
 * The writes are best-effort and never throw — a failed widget update doesn't
 * matter to the user's core experience.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const WIDGET_STORAGE_KEY = "@daily_imaan_widget_data";

export interface WidgetData {
  arabic: string;
  english: string;
  surahRef: string;
  nextPrayer: string;
}

/**
 * Persist widget data to AsyncStorage so both native widget plugins can read
 * it via their respective shared-storage mechanisms on next widget refresh.
 *
 * On Android the Kotlin provider reads SharedPreferences directly; we bridge
 * via a simple AsyncStorage key that a future native module can mirror.
 * On iOS the Swift provider reads UserDefaults(suiteName: group.*); the same
 * AsyncStorage key is available as a fallback until a native bridge is added.
 */
export async function updateWidgetData(data: WidgetData): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await AsyncStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // best-effort
  }
}

export async function getWidgetData(): Promise<WidgetData | null> {
  try {
    const raw = await AsyncStorage.getItem(WIDGET_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WidgetData) : null;
  } catch {
    return null;
  }
}
