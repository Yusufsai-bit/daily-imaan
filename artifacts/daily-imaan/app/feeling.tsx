import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/constants/colors";
import { FEELINGS } from "@/data/feelingsData";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FeelingScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const [openKey, setOpenKey] = useState<string | null>(null);

  const handleToggle = (key: string) => {
    Haptics.selectionAsync();
    LayoutAnimation.configureNext(
      LayoutAnimation.create(220, "easeInEaseOut", "opacity")
    );
    setOpenKey(openKey === key ? null : key);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 60 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backBtn,
            { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 },
          ]}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={20} color={C.foreground} />
        </Pressable>
      </View>

      {/* Title */}
      <View style={styles.titleBlock}>
        <Text
          style={[
            styles.title,
            { color: C.foreground, fontFamily: "Inter_700Bold" },
          ]}
        >
          What is in your heart?
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: C.mutedForeground, fontFamily: "Inter_400Regular" },
          ]}
        >
          A few words from the Quran and Sunnah for whatever you are carrying.
        </Text>
      </View>

      {/* Feelings list */}
      <View style={{ gap: 10 }}>
        {FEELINGS.map((f) => {
          const isOpen = openKey === f.key;
          return (
            <View
              key={f.key}
              style={[
                styles.card,
                {
                  backgroundColor: C.card,
                  borderColor: isOpen ? C.primary + "40" : "transparent",
                  shadowColor: isDark ? "#000" : "#000",
                },
              ]}
            >
              <Pressable
                onPress={() => handleToggle(f.key)}
                style={({ pressed }) => [
                  styles.cardHeader,
                  { opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.cardTitle,
                      {
                        color: C.foreground,
                        fontFamily: "Inter_600SemiBold",
                      },
                    ]}
                  >
                    {f.label}
                  </Text>
                  <Text
                    style={[
                      styles.cardSub,
                      {
                        color: C.mutedForeground,
                        fontFamily: "Inter_400Regular",
                      },
                    ]}
                  >
                    {f.subtitle}
                  </Text>
                </View>
                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={C.mutedForeground}
                />
              </Pressable>

              {isOpen && (
                <View style={styles.cardBody}>
                  {/* Ayah */}
                  <View style={styles.block}>
                    <Text
                      style={[
                        styles.blockLabel,
                        {
                          color: C.primary,
                          fontFamily: "Inter_600SemiBold",
                        },
                      ]}
                    >
                      FROM THE QURAN
                    </Text>
                    <Text
                      style={[
                        styles.arabic,
                        { color: C.foreground },
                      ]}
                    >
                      {f.ayah.arabic}
                    </Text>
                    <Text
                      style={[
                        styles.english,
                        {
                          color: C.foreground,
                          fontFamily: "Inter_400Regular",
                        },
                      ]}
                    >
                      "{f.ayah.english}"
                    </Text>
                    <Text
                      style={[
                        styles.ref,
                        {
                          color: C.mutedForeground,
                          fontFamily: "Inter_500Medium",
                        },
                      ]}
                    >
                      — {f.ayah.reference}
                    </Text>
                  </View>

                  {/* Divider */}
                  <View
                    style={[styles.divider, { backgroundColor: C.border }]}
                  />

                  {/* Dua */}
                  <View style={styles.block}>
                    <Text
                      style={[
                        styles.blockLabel,
                        {
                          color: C.accent,
                          fontFamily: "Inter_600SemiBold",
                        },
                      ]}
                    >
                      A DUA TO MAKE
                    </Text>
                    <Text
                      style={[
                        styles.arabic,
                        { color: C.foreground },
                      ]}
                    >
                      {f.dua.arabic}
                    </Text>
                    <Text
                      style={[
                        styles.translit,
                        {
                          color: C.mutedForeground,
                          fontFamily: "Inter_400Regular",
                        },
                      ]}
                    >
                      {f.dua.transliteration}
                    </Text>
                    <Text
                      style={[
                        styles.english,
                        {
                          color: C.foreground,
                          fontFamily: "Inter_400Regular",
                        },
                      ]}
                    >
                      "{f.dua.english}"
                    </Text>
                    <Text
                      style={[
                        styles.ref,
                        {
                          color: C.mutedForeground,
                          fontFamily: "Inter_500Medium",
                        },
                      ]}
                    >
                      — {f.dua.source}
                    </Text>
                  </View>

                  {/* Gentle reminder */}
                  <View
                    style={[
                      styles.reminder,
                      {
                        backgroundColor: isDark
                          ? "rgba(45,191,127,0.10)"
                          : "rgba(26,107,74,0.06)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.reminderText,
                        {
                          color: C.primary,
                          fontFamily: "Inter_500Medium",
                        },
                      ]}
                    >
                      {f.reminder}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Footer note */}
      <Text
        style={[
          styles.footer,
          { color: C.mutedForeground, fontFamily: "Inter_400Regular" },
        ]}
      >
        Every verse and dua here is from the Quran or authentic Sunnah.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 18 },
  header: { flexDirection: "row", alignItems: "center" },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: { gap: 6, marginTop: 4 },
  title: { fontSize: 26, letterSpacing: -0.5, lineHeight: 32 },
  subtitle: { fontSize: 14, lineHeight: 20 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardTitle: { fontSize: 16 },
  cardSub: { fontSize: 12, marginTop: 2 },
  cardBody: { paddingHorizontal: 18, paddingBottom: 18, gap: 14 },
  block: { gap: 8 },
  blockLabel: { fontSize: 11, letterSpacing: 1.2 },
  arabic: {
    fontSize: 22,
    lineHeight: 42,
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: 2,
  },
  translit: { fontSize: 13, lineHeight: 20, fontStyle: "italic" },
  english: { fontSize: 14, lineHeight: 22 },
  ref: { fontSize: 12, marginTop: 2 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 2 },
  reminder: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 2,
  },
  reminderText: { fontSize: 13, lineHeight: 19, textAlign: "center" },
  footer: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 8,
  },
});
