import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/constants/colors";
import { ARABIC_FONT_REGULAR } from "@/constants/fonts";
import { DUAS } from "@/data/duasData";
import { a11yButton, a11yDecorative } from "@/components/a11y";

/**
 * Morning / Evening Adhkar list.
 *
 * Pulls verbatim from data/duasData.ts — every entry whose id starts with
 * "morning-" or "evening-" is sourced from sunnah-attested du'as with the
 * primary collection cited per item. Zero AI commentary is added; this
 * screen is a presentation surface only.
 *
 * The route is `/adhkar?period=morning` or `/adhkar?period=evening`.
 * Anything other than "evening" falls back to morning so a malformed deep
 * link never lands on an empty screen.
 */
export default function AdhkarScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams<{ period?: string }>();
  const period = params.period === "evening" ? "evening" : "morning";

  const items = useMemo(
    () =>
      DUAS.filter((d) =>
        period === "morning"
          ? d.id.startsWith("morning-") || d.id.startsWith("morning-evening-")
          : d.id.startsWith("evening-") || d.id.startsWith("morning-evening-"),
      ),
    [period],
  );

  const title = period === "morning" ? "Morning Adhkar" : "Evening Adhkar";
  const subtitle =
    period === "morning"
      ? "Sunnah remembrances for the morning — best read before Asr."
      : "Sunnah remembrances for the evening — best read after Asr.";

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          {...a11yButton("Back")}
          style={({ pressed }) => [
            styles.backBtn,
            { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="arrow-back" size={20} color={C.foreground} {...a11yDecorative} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text
            maxFontSizeMultiplier={1.6}
            style={[styles.title, { color: C.foreground, fontFamily: "Inter_700Bold" }]}
          >
            {title}
          </Text>
          <Text
            maxFontSizeMultiplier={1.6}
            style={[styles.subtitle, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <View style={[styles.card, { backgroundColor: C.card }]}>
            <Text style={[styles.empty, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              No adhkar found for this period.
            </Text>
          </View>
        ) : (
          items.map((dua, i) => (
            <View key={dua.id} style={[styles.card, { backgroundColor: C.card }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.indexBadge, { backgroundColor: C.secondary }]}>
                  <Text style={[styles.indexText, { color: C.primary, fontFamily: "Inter_700Bold" }]}>
                    {i + 1}
                  </Text>
                </View>
                <Text
                  style={[styles.occasion, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}
                >
                  {dua.occasion}
                </Text>
              </View>
              <Text style={[styles.arabic, { color: C.foreground }]}>{dua.arabicText}</Text>
              <Text
                style={[styles.translit, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
              >
                {dua.transliteration}
              </Text>
              <Text style={[styles.english, { color: C.foreground, fontFamily: "Inter_400Regular" }]}>
                {dua.englishText}
              </Text>
              {dua.source ? (
                <Text style={[styles.source, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>
                  — {dua.source}
                </Text>
              ) : null}
            </View>
          ))
        )}
        <Text style={[styles.footer, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          Verbatim from sunnah-attested du'as. Source collection cited under each.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, letterSpacing: -0.4 },
  subtitle: { fontSize: 13, lineHeight: 18, marginTop: 2 },
  list: { paddingHorizontal: 16, gap: 14 },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  indexText: { fontSize: 13 },
  occasion: { flex: 1, fontSize: 13 },
  arabic: {
    fontSize: 22,
    lineHeight: 44,
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: ARABIC_FONT_REGULAR,
  },
  translit: { fontSize: 13, lineHeight: 20, fontStyle: "italic" },
  english: { fontSize: 14, lineHeight: 22 },
  source: { fontSize: 12, marginTop: 2 },
  empty: { fontSize: 14, textAlign: "center", paddingVertical: 16 },
  footer: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 8,
  },
});
