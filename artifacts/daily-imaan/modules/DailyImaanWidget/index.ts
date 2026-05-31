import { Platform } from "react-native";

// On a development build this calls the native module which writes to:
//   iOS: App Group UserDefaults (group.com.dailyimaan.app) and reloads WidgetKit
//   Android: SharedPreferences (daily_imaan_widget) and broadcasts an update
// In Expo Go the native module is absent; falls back silently.

let nativeModule: { setWidgetData: (a: string, e: string, s: string, n: string) => Promise<void> } | null =
  null;

try {
  const { requireNativeModule } = require("expo-modules-core");
  nativeModule = requireNativeModule("DailyImaanWidget");
} catch {
  // Native module not available in Expo Go — no-op
}

export async function setWidgetData(
  arabic: string,
  english: string,
  surahRef: string,
  nextPrayer: string
): Promise<void> {
  if (Platform.OS === "web" || !nativeModule) return;
  try {
    await nativeModule.setWidgetData(arabic, english, surahRef, nextPrayer);
  } catch {
    // ignore errors in environments without the module
  }
}
