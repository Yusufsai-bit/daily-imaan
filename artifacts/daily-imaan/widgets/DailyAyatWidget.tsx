/**
 * Daily Imaan — Home Screen Widget
 *
 * Renders the Ayat of the Day on the iOS home screen (WidgetKit) and
 * the Android home screen (Glance API).
 *
 * REQUIRES A DEVELOPMENT BUILD — this file is not active in Expo Go.
 * To enable:
 *   1. Run `expo prebuild` to generate native directories.
 *   2. Add the widget plugin to app.json (see widgets/plugin/README.md).
 *   3. Build with `eas build --profile development`.
 *
 * The widget reads the shared AsyncStorage key "@widget_ayat" written
 * by the main app every time a new Ayat of the Day is displayed.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface WidgetAyatPayload {
  arabicText: string;
  englishText: string;
  surahRef: string;
}

interface DailyAyatWidgetProps {
  payload: WidgetAyatPayload;
}

export default function DailyAyatWidget({ payload }: DailyAyatWidgetProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Daily Imaan</Text>
        <Text style={styles.surahRef}>{payload.surahRef}</Text>
      </View>

      <Text style={styles.arabic} numberOfLines={3}>
        {payload.arabicText}
      </Text>

      <Text style={styles.english} numberOfLines={3}>
        "{payload.englishText}"
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B12",
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appName: {
    color: "#2DBF7F",
    fontSize: 13,
    fontWeight: "700",
  },
  surahRef: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
  },
  arabic: {
    color: "#FAFAF8",
    fontSize: 18,
    lineHeight: 34,
    textAlign: "right",
  },
  english: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    lineHeight: 18,
    fontStyle: "italic",
  },
});
