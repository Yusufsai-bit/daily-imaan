import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import type { DimensionValue } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

interface DhikrState {
  subhanAllah: number;
  alhamdulillah: number;
  allahuAkbar: number;
}

const DHIKR_CONFIG = [
  {
    key: "subhanAllah" as keyof DhikrState,
    arabic: "سُبْحَانَ اللَّهِ",
    english: "SubhanAllah",
    meaning: "Glory be to Allah",
    max: 33,
    color: "#1A6B4A",
    darkColor: "#2DBF7F",
  },
  {
    key: "alhamdulillah" as keyof DhikrState,
    arabic: "الْحَمْدُ لِلَّهِ",
    english: "Alhamdulillah",
    meaning: "Praise be to Allah",
    max: 33,
    color: "#C8933C",
    darkColor: "#E0A84A",
  },
  {
    key: "allahuAkbar" as keyof DhikrState,
    arabic: "اللَّهُ أَكْبَرُ",
    english: "Allahu Akbar",
    meaning: "Allah is the Greatest",
    max: 34,
    color: "#4A6B1A",
    darkColor: "#7FBF2D",
  },
];

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
  });
  const [sessionTotal, setSessionTotal] = useState(0);

  const scaleAnims = useRef(DHIKR_CONFIG.map(() => new Animated.Value(1))).current;
  const completionAnims = useRef(DHIKR_CONFIG.map(() => new Animated.Value(0))).current;
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const handlePress = useCallback(
    (key: keyof DhikrState, index: number, max: number) => {
      const current = counts[key];
      const newCount = current + 1;
      const useND = Platform.OS !== "web";

      Animated.sequence([
        Animated.timing(scaleAnims[index]!, { toValue: 0.93, duration: 80, useNativeDriver: useND }),
        Animated.spring(scaleAnims[index]!, { toValue: 1, tension: 200, friction: 8, useNativeDriver: useND }),
      ]).start();

      if (newCount === max) {
        // Auto-reset at the dhikr's target count, then roll back to 0.
        // Auto-link the "Completed Dhikr" intention — markDeedDone is
        // idempotent and never undoes a manual check.
        markDeedDone("dhikr");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Animated.sequence([
          Animated.timing(completionAnims[index]!, { toValue: 1, duration: 250, useNativeDriver: useND }),
          Animated.delay(700),
          Animated.timing(completionAnims[index]!, { toValue: 0, duration: 300, useNativeDriver: useND }),
        ]).start();
        setCounts((prev) => ({ ...prev, [key]: max }));
        const timer = setTimeout(() => {
          setCounts((prev) => ({ ...prev, [key]: 0 }));
        }, 950);
        timersRef.current.push(timer);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCounts((prev) => ({ ...prev, [key]: newCount }));
      }
      setSessionTotal((t) => t + 1);
    },
    [counts, scaleAnims, completionAnims, markDeedDone]
  );

  const handleReset = useCallback(() => {
    Alert.alert("Reset All", "Reset all dhikr counters to zero?", [
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          setCounts({ subhanAllah: 0, alhamdulillah: 0, allahuAkbar: 0 });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  }, []);

  const totalAll = counts.subhanAllah + counts.alhamdulillah + counts.allahuAkbar;

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
          style={({ pressed }) => [styles.resetBtn, { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons name="refresh" size={16} color={C.mutedForeground} />
          <Text style={[styles.resetText, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>
            Reset
          </Text>
        </Pressable>
      </View>

      {/* Info card — full hadith text, no truncation. Source: Sahih Muslim 597,
          Book 5 (The Book of the Mosques and Places of Prayer), Chapter on
          remembrance after prayer. */}
      <View style={[styles.infoCard, { backgroundColor: C.card, borderColor: C.border }]}>
        <Ionicons name="information-circle-outline" size={16} color={C.mutedForeground} />
        <Text style={[styles.infoText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          Abu Hurayrah (raḍiy Allāhu ʿanhu) reported that the Messenger of Allah ﷺ said: "Whoever glorifies Allah (SubhanAllah) thirty-three times after every prayer, and praises Allah (Alhamdulillah) thirty-three times, and magnifies Allah (Allahu Akbar) thirty-three times — that is ninety-nine — and completes the hundred by saying 'La ilaha illa Allah, wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa ʿala kulli shay'in qadeer' — his sins will be forgiven even if they are like the foam of the sea." (Sahih Muslim 597)
        </Text>
      </View>

      {/* Dhikr Buttons */}
      <View style={[styles.dhikrGrid, { paddingBottom: insets.bottom + 100 }]}>
        {DHIKR_CONFIG.map((dhikr, i) => {
          const count = counts[dhikr.key];
          const progress = count / dhikr.max;
          const isComplete = count >= dhikr.max;
          const btnColor = isDark ? dhikr.darkColor : dhikr.color;

          return (
            <Animated.View
              key={dhikr.key}
              style={[{ transform: [{ scale: scaleAnims[i]! }] }, styles.dhikrItem]}
            >
              <Pressable
                onPress={() => handlePress(dhikr.key, i, dhikr.max)}
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
                {/* Progress arc indicator */}
                <View style={styles.progressContainer}>
                  <Text style={[styles.dhikrCount, { color: isComplete ? btnColor : C.foreground, fontFamily: "Inter_700Bold" }]}>
                    {count}
                  </Text>
                  <Text style={[styles.dhikrMax, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                    /{dhikr.max}
                  </Text>
                </View>

                <Text style={[styles.dhikrArabic, { color: btnColor }]}>
                  {dhikr.arabic}
                </Text>
                <Text style={[styles.dhikrEnglish, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
                  {dhikr.english}
                </Text>
                <Text style={[styles.dhikrMeaning, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                  {dhikr.meaning}
                </Text>

                {/* Progress bar */}
                <View style={[styles.progressBarBg, { backgroundColor: C.muted }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        backgroundColor: btnColor,
                        width: `${Math.round(progress * 100)}%` as DimensionValue,
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
                  <Text style={[styles.completeBadgeText, { fontFamily: "Inter_600SemiBold" }]}>{dhikr.max} ✓</Text>
                </Animated.View>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
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
  infoCard: {
    flexDirection: "row", gap: 10, padding: 12, borderRadius: 12,
    borderWidth: 1, marginBottom: 20, alignItems: "flex-start",
  },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18 },
  dhikrGrid: { flex: 1, gap: 12 },
  dhikrItem: { flex: 1 },
  dhikrBtn: {
    flex: 1, borderRadius: 16, padding: 20, alignItems: "center", gap: 6, justifyContent: "center",
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
