import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import type { DimensionValue } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { ARABIC_FONT_REGULAR } from "@/constants/fonts";
import { a11yButton } from "@/components/a11y";
import { useReduceMotion } from "@/hooks/useReduceMotion";

interface DhikrState {
  subhanAllah: number;
  alhamdulillah: number;
  allahuAkbar: number;
  astaghfirullah: number;
  laHawla: number;
  salawat: number;
}

/**
 * Per-dhikr static config. Targets are locked to the post-salah Sunnah
 * pattern (33 / 33 / 34, total 100) per Sahih Muslim 597 — the previous
 * Sunnah/Extended toggle was removed in favour of a cleaner, single-mode
 * screen. The `dhikrPreset` setting in AppContext is now unused; we leave
 * it in state so we don't break persisted prefs from earlier installs.
 *
 * Counter behaviour: counts climb freely past their Sunnah target. When
 * a count first lands on `max` we fire a one-shot celebration (haptic +
 * fade-in/out completion badge) and mark the dhikr intention as done.
 * After that the user can keep tapping — the count keeps incrementing
 * (34, 35, …), the green "complete" border stays on, and the progress
 * bar caps visually at 100%. Only the Reset button drops the counts
 * back to zero.
 */
const DHIKR_CONFIG = [
  {
    key: "subhanAllah" as keyof DhikrState,
    arabic: "سُبْحَانَ اللَّهِ",
    english: "SubhanAllah",
    meaning: "Glory be to Allah",
    color: "#1A6B4A",
    darkColor: "#2DBF7F",
  },
  {
    key: "alhamdulillah" as keyof DhikrState,
    arabic: "الْحَمْدُ لِلَّهِ",
    english: "Alhamdulillah",
    meaning: "Praise be to Allah",
    color: "#C8933C",
    darkColor: "#E0A84A",
  },
  {
    key: "allahuAkbar" as keyof DhikrState,
    arabic: "اللَّهُ أَكْبَرُ",
    english: "Allahu Akbar",
    meaning: "Allah is the Greatest",
    color: "#4A6B1A",
    darkColor: "#7FBF2D",
  },
  {
    key: "astaghfirullah" as keyof DhikrState,
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    english: "Astaghfirullah",
    meaning: "I seek Allah's forgiveness",
    color: "#1A3D6B",
    darkColor: "#5B8FD4",
  },
  {
    key: "laHawla" as keyof DhikrState,
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    english: "La Hawla wa la Quwwata",
    meaning: "No power except with Allah",
    color: "#5B1A6B",
    darkColor: "#B06BD4",
  },
  {
    key: "salawat" as keyof DhikrState,
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
    english: "Allahumma Salli 'ala Muhammad",
    meaning: "Blessings on the Prophet ﷺ",
    color: "#6B3A1A",
    darkColor: "#D4895B",
  },
];

// Sunnah post-salah pattern (Sahih Muslim 597): 33 + 33 + 34 = 100 (the
// final La ilaha illa Allah completes the hundred). Hardcoded — no longer
// user-selectable.
const DHIKR_TARGETS: Record<keyof DhikrState, number> = {
  subhanAllah: 33,
  alhamdulillah: 33,
  allahuAkbar: 34,
  astaghfirullah: 100,
  laHawla: 100,
  salawat: 100,
};

export default function DhikrScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();
  const { markDeedDone } = useApp();

  const [counts, setCounts] = useState<DhikrState>({
    subhanAllah: 0,
    alhamdulillah: 0,
    allahuAkbar: 0,
    astaghfirullah: 0,
    laHawla: 0,
    salawat: 0,
  });
  const [sessionTotal, setSessionTotal] = useState(0);

  const scaleAnims = useRef(DHIKR_CONFIG.map(() => new Animated.Value(1))).current;
  const completionAnims = useRef(DHIKR_CONFIG.map(() => new Animated.Value(0))).current;
  const reduceMotion = useReduceMotion();

  const handlePress = useCallback(
    (key: keyof DhikrState, index: number, max: number) => {
      const newCount = counts[key] + 1;
      const useND = Platform.OS !== "web";

      // Tap-bounce. Plays on every increment regardless of whether we're
      // pre- or post-target. Decorative — skipped under Reduce Motion (the
      // haptic and count change still confirm the tap).
      if (!reduceMotion) {
        Animated.sequence([
          Animated.timing(scaleAnims[index]!, { toValue: 0.93, duration: 80, useNativeDriver: useND }),
          Animated.spring(scaleAnims[index]!, { toValue: 1, tension: 200, friction: 8, useNativeDriver: useND }),
        ]).start();
      }

      if (newCount === max) {
        // First time hitting the Sunnah target — celebrate once. The count
        // is NOT reset; subsequent taps continue to 34, 35, … so users who
        // want longer dhikr sessions can keep going. markDeedDone is
        // idempotent and never undoes a manual check.
        markDeedDone("dhikr");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (reduceMotion) {
          // Show the badge without fading — visible confirmation, no motion.
          completionAnims[index]!.setValue(1);
          setTimeout(() => completionAnims[index]!.setValue(0), 950);
        } else {
          Animated.sequence([
            Animated.timing(completionAnims[index]!, { toValue: 1, duration: 250, useNativeDriver: useND }),
            Animated.delay(700),
            Animated.timing(completionAnims[index]!, { toValue: 0, duration: 300, useNativeDriver: useND }),
          ]).start();
        }
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      setCounts((prev) => ({ ...prev, [key]: newCount }));
      setSessionTotal((t) => t + 1);
    },
    [counts, scaleAnims, completionAnims, markDeedDone, reduceMotion]
  );

  const handleReset = useCallback(() => {
    Alert.alert("Reset All", "Reset all dhikr counters to zero?", [
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          setCounts({ subhanAllah: 0, alhamdulillah: 0, allahuAkbar: 0, astaghfirullah: 0, laHawla: 0, salawat: 0 });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: C.background, paddingTop: insets.top + 12 }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: C.foreground, fontFamily: "Inter_700Bold" }]}>
            Dhikr
          </Text>
          <Text style={[styles.subtitle, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Session total: {sessionTotal}
          </Text>
        </View>
        <Pressable
          onPress={handleReset}
          {...a11yButton("Reset all dhikr counters", "Sets every counter back to zero")}
          style={({ pressed }) => [styles.resetBtn, { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons name="refresh" size={16} color={C.mutedForeground} />
          <Text style={[styles.resetText, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>
            Reset
          </Text>
        </Pressable>
      </View>

      {/* Dhikr Buttons */}
      <ScrollView
        contentContainerStyle={[styles.dhikrGrid, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {DHIKR_CONFIG.map((dhikr, i) => {
          const count = counts[dhikr.key];
          const max = DHIKR_TARGETS[dhikr.key];
          // Cap the visual progress bar at 100% — counts can exceed `max`
          // (users may continue past the Sunnah target), but the bar
          // shouldn't overflow the container.
          const progressPct = Math.min(Math.round((count / max) * 100), 100);
          const isComplete = count >= max;
          const btnColor = isDark ? dhikr.darkColor : dhikr.color;

          return (
            <Animated.View
              key={dhikr.key}
              style={[{ transform: [{ scale: scaleAnims[i]! }] }, styles.dhikrItem]}
            >
              <Pressable
                onPress={() => handlePress(dhikr.key, i, max)}
                {...a11yButton(
                  `${dhikr.english}, ${dhikr.meaning}`,
                  `Currently ${count} of ${max}. Tap to increment.`,
                )}
                style={[
                  styles.dhikrBtn,
                  {
                    backgroundColor: C.card,
                    borderColor: isComplete ? btnColor : C.border,
                    borderWidth: isComplete ? 2 : 1,
                    shadowColor: isComplete ? btnColor : "#000",
                  },
                ]}
              >
                {/* Progress arc indicator. numberOfLines={1} guards the
                    layout when counts grow into 3+ digits past the Sunnah
                    target — the row stays on one line and Text shrinks the
                    glyphs rather than wrapping. */}
                <View style={styles.progressContainer}>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={[styles.dhikrCount, { color: isComplete ? btnColor : C.foreground, fontFamily: "Inter_700Bold" }]}
                  >
                    {count}
                  </Text>
                  <Text style={[styles.dhikrMax, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                    /{max}
                  </Text>
                </View>

                <Text style={[styles.dhikrArabic, { color: btnColor, fontFamily: ARABIC_FONT_REGULAR }]}>
                  {dhikr.arabic}
                </Text>
                <Text style={[styles.dhikrEnglish, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
                  {dhikr.english}
                </Text>
                <Text style={[styles.dhikrMeaning, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                  {dhikr.meaning}
                </Text>

                {/* Progress bar — visually clamped at 100% once `count`
                    crosses `max`, so post-target taps don't overflow. */}
                <View style={[styles.progressBarBg, { backgroundColor: C.muted }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        backgroundColor: btnColor,
                        width: `${progressPct}%` as DimensionValue,
                      },
                    ]}
                  />
                </View>

                <Animated.View
                  style={[
                    styles.completeBadge,
                    {
                      backgroundColor: btnColor,
                      opacity: completionAnims[i],
                    },
                  ]}
                >
                  <Ionicons name="checkmark" size={12} color="#fff" />
                  <Text style={[styles.completeBadgeText, { fontFamily: "Inter_600SemiBold" }]}>{max} ✓</Text>
                </Animated.View>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 },
  title: { fontSize: 28, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 2 },
  resetBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  resetText: { fontSize: 14 },
  dhikrGrid: { gap: 12 },
  dhikrItem: {},
  dhikrBtn: {
    borderRadius: 16, padding: 20, alignItems: "center", gap: 6, justifyContent: "center",
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4,
  },
  progressContainer: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  dhikrCount: { fontSize: 48, letterSpacing: -2 },
  dhikrMax: { fontSize: 20 },
  dhikrArabic: { fontSize: 24, lineHeight: 44, marginTop: 4 },
  dhikrEnglish: { fontSize: 18 },
  dhikrMeaning: { fontSize: 13 },
  progressBarBg: { width: "100%", height: 4, borderRadius: 2, overflow: "hidden", marginTop: 8 },
  progressBarFill: { height: "100%", borderRadius: 2 },
  completeBadge: {
    position: "absolute", top: 12, right: 12,
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  completeBadgeText: { color: "#fff", fontSize: 11 },
});
