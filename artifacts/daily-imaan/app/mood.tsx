import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/constants/colors";
import { MOODS, type Mood } from "@/data/moodData";

export default function MoodScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const [selected, setSelected] = useState<Mood | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  function pickMood(mood: Mood) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    setSelected(mood);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 9, useNativeDriver: true }),
    ]).start();
  }

  function resetMood() {
    Haptics.selectionAsync();
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setSelected(null);
    });
  }

  const moodBg = selected
    ? isDark
      ? selected.darkColor
      : selected.color
    : "transparent";

  return (
    <View style={[styles.root, { backgroundColor: C.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="chevron-back" size={24} color={C.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: C.foreground, fontFamily: "Inter_700Bold" }]}>
          Pick My Mood
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Mood grid */}
        <Text style={[styles.prompt, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          How are you feeling right now?
        </Text>

        <View style={styles.moodGrid}>
          {MOODS.map((mood) => {
            const isActive = selected?.id === mood.id;
            return (
              <Pressable
                key={mood.id}
                onPress={() => pickMood(mood)}
                style={({ pressed }) => [
                  styles.moodPill,
                  {
                    backgroundColor: isActive
                      ? isDark ? mood.darkColor : mood.color
                      : C.card,
                    borderColor: isActive ? mood.textColor : C.border,
                    borderWidth: isActive ? 1.5 : 1,
                    opacity: pressed ? 0.75 : 1,
                    transform: [{ scale: isActive ? 1.02 : 1 }],
                  },
                ]}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    {
                      color: isActive ? mood.textColor : C.foreground,
                      fontFamily: isActive ? "Inter_600SemiBold" : "Inter_400Regular",
                    },
                  ]}
                >
                  {mood.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Result card */}
        {selected && (
          <Animated.View
            style={[
              styles.resultCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                backgroundColor: isDark ? selected.darkColor : selected.color,
                borderColor: selected.textColor + "40",
              },
            ]}
          >
            {/* Comfort line */}
            <View style={[styles.comfortRow, { borderBottomColor: selected.textColor + "25" }]}>
              <Text style={styles.comfortEmoji}>{selected.emoji}</Text>
              <Text
                style={[
                  styles.comfortText,
                  { color: selected.textColor, fontFamily: "Inter_500Medium" },
                ]}
              >
                {selected.comfort}
              </Text>
            </View>

            {/* Ayah section */}
            <View style={styles.section}>
              <View style={[styles.sectionBadge, { backgroundColor: selected.textColor + "18" }]}>
                <Text style={[styles.sectionBadgeText, { color: selected.textColor, fontFamily: "Inter_600SemiBold" }]}>
                  AYAH
                </Text>
              </View>
              <Text style={[styles.arabicText, { color: isDark ? "#FAFAF8" : "#111827" }]}>
                {selected.ayah.arabic}
              </Text>
              <Text style={[styles.englishText, { color: isDark ? "#D1FAE5" : "#374151", fontFamily: "Inter_400Regular" }]}>
                "{selected.ayah.english}"
              </Text>
              <Text style={[styles.refText, { color: selected.textColor, fontFamily: "Inter_600SemiBold" }]}>
                — {selected.ayah.surahRef}
              </Text>
            </View>

            {/* Dua section */}
            <View style={[styles.section, styles.duaSection, { borderTopColor: selected.textColor + "20" }]}>
              <View style={[styles.sectionBadge, { backgroundColor: selected.textColor + "18" }]}>
                <Text style={[styles.sectionBadgeText, { color: selected.textColor, fontFamily: "Inter_600SemiBold" }]}>
                  DUA
                </Text>
              </View>
              <Text style={[styles.arabicDua, { color: isDark ? "#FAFAF8" : "#111827" }]}>
                {selected.dua.arabic}
              </Text>
              <Text style={[styles.translitText, { color: selected.textColor, fontFamily: "Inter_500Medium" }]}>
                {selected.dua.transliteration}
              </Text>
              <Text style={[styles.englishText, { color: isDark ? "#D1FAE5" : "#374151", fontFamily: "Inter_400Regular" }]}>
                "{selected.dua.english}"
              </Text>
              <Text style={[styles.sourceText, { color: selected.textColor + "AA", fontFamily: "Inter_400Regular" }]}>
                Source: {selected.dua.source}
              </Text>
            </View>

            {/* Pick another */}
            <Pressable
              onPress={resetMood}
              style={({ pressed }) => [
                styles.resetBtn,
                { backgroundColor: selected.textColor + "18", opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name="refresh" size={14} color={selected.textColor} />
              <Text style={[styles.resetText, { color: selected.textColor, fontFamily: "Inter_500Medium" }]}>
                Pick another mood
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20 },
  content: { paddingHorizontal: 20, gap: 20 },
  prompt: { fontSize: 15, textAlign: "center", marginTop: 4 },
  moodGrid: { gap: 10 },
  moodPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
  },
  moodEmoji: { fontSize: 24 },
  moodLabel: { fontSize: 16 },
  resultCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    gap: 0,
  },
  comfortRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  comfortEmoji: { fontSize: 20, marginTop: 2 },
  comfortText: { flex: 1, fontSize: 14, lineHeight: 22 },
  section: { paddingHorizontal: 18, paddingVertical: 16, gap: 10 },
  duaSection: { borderTopWidth: 1 },
  sectionBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sectionBadgeText: { fontSize: 10, letterSpacing: 1.2 },
  arabicText: { fontSize: 22, lineHeight: 42, textAlign: "right", writingDirection: "rtl" },
  arabicDua: { fontSize: 18, lineHeight: 36, textAlign: "right", writingDirection: "rtl" },
  englishText: { fontSize: 14, lineHeight: 22, fontStyle: "italic" },
  translitText: { fontSize: 13, lineHeight: 20 },
  refText: { fontSize: 12, letterSpacing: 0.3 },
  sourceText: { fontSize: 12 },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    margin: 16,
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetText: { fontSize: 14 },
});
