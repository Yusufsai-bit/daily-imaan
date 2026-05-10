import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import {
  FlatList,
  Pressable,
  Share,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import colors from "@/constants/colors";
import { ARABIC_FONT_REGULAR } from "@/constants/fonts";
import { ASMA_UL_HUSNA, type DivineName } from "@/data/asmaUlHusnaData";
import { a11yButton, a11yDecorative } from "@/components/a11y";

/**
 * Asma ul Husna — the 99 Beautiful Names of Allah.
 *
 * A simple scrollable list of all 99 names with Arabic, transliteration,
 * and a concise English meaning. The list is bundled (no network) and
 * fully renders offline. Each name is shareable via the platform sheet so
 * users can quickly send a single name to family or paste into a journal.
 *
 * Source: the canonical hadith of Abu Hurayrah (Sunan at-Tirmidhi 3506).
 * See data/asmaUlHusnaData.ts for the verbatim meanings + attribution.
 *
 * Route: `/asma` — reached from the Me tab → More section.
 */
export default function AsmaScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const handleShare = async (name: DivineName) => {
    Haptics.selectionAsync();
    try {
      await Share.share({
        message: `${name.arabic}\n\n${name.id}. ${name.transliteration} — ${name.meaning}\n\nFrom the 99 Names of Allah · shared via Daily Imaan`,
      });
    } catch {
      // ignore — Share.share rejects on user cancel; not worth surfacing
    }
  };

  const renderItem = ({ item }: { item: DivineName }) => (
    <Pressable
      onPress={() => handleShare(item)}
      {...a11yButton(
        `${item.transliteration}, ${item.meaning}`,
        "Tap to share this name",
      )}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: C.card,
          borderColor: C.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.numberBadge, { backgroundColor: C.secondary }]}>
        <Text
          maxFontSizeMultiplier={1.4}
          style={[styles.numberText, { color: C.primary, fontFamily: "Inter_700Bold" }]}
        >
          {item.id}
        </Text>
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text
          style={[styles.arabic, { color: C.foreground, fontFamily: ARABIC_FONT_REGULAR }]}
        >
          {item.arabic}
        </Text>
        <View style={styles.nameRow}>
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.transliteration, { color: C.primary, fontFamily: "Inter_600SemiBold" }]}
          >
            {item.transliteration}
          </Text>
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.meaning, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
          >
            {item.meaning}
          </Text>
        </View>
      </View>
      <Ionicons name="share-outline" size={16} color={C.mutedForeground} {...a11yDecorative} />
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: C.primary }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.title, { fontFamily: "Inter_700Bold" }]}>
            99 Names of Allah
          </Text>
          <Text style={[styles.subtitle, { fontFamily: "Inter_400Regular" }]}>
            Asma ul Husna · Sunan at-Tirmidhi 3506
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={ASMA_UL_HUSNA}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        windowSize={9}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerCenter: { flex: 1, alignItems: "center", gap: 2 },
  title: { color: "#fff", fontSize: 18 },
  subtitle: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
  list: { padding: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: { fontSize: 13 },
  arabic: {
    fontSize: 26,
    lineHeight: 44,
    textAlign: "right",
    writingDirection: "rtl",
  },
  nameRow: { flexDirection: "row", alignItems: "baseline", gap: 8, flexWrap: "wrap" },
  transliteration: { fontSize: 14 },
  meaning: { fontSize: 13, flexShrink: 1 },
});
