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
import { Ionicons } from "@expo/vector-icons";

import colors from "@/constants/colors";

interface DhikrState {
  subhanAllah: number;
  alhamdulillah: number;
  allahuAkbar: number;
}

const MAX_COUNT = 33;

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
];

export default function DhikrScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const [counts, setCounts] = useState<DhikrState>({
    subhanAllah: 0,
    alhamdulillah: 0,
    allahuAkbar: 0,
  });
  const [sessionTotal, setSessionTotal] = useState(0);

  const scaleAnims = useRef(DHIKR_CONFIG.map(() => new Animated.Value(1))).current;
  const completionAnims = useRef(DHIKR_CONFIG.map(() => new Animated.Value(0))).current;

  const handlePress = useCallback(
    (key: keyof DhikrState, index: number) => {
      const current = counts[key];

      if (current >= MAX_COUNT) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
          "Dhikr Complete",
          `You have completed ${MAX_COUNT} ${key === "subhanAllah" ? "SubhanAllah" : key === "alhamdulillah" ? "Alhamdulillah" : "Allahu Akbar"}.\n\nTap Reset to start again.`,
          [
            { text: "Reset This", onPress: () => setCounts((prev) => ({ ...prev, [key]: 0 })) },
            { text: "Keep Going", style: "cancel" },
          ]
        );
        return;
      }

      const newCount = current + 1;

      const useND = Platform.OS !== "web";
      Animated.sequence([
        Animated.timing(scaleAnims[index]!, { toValue: 0.93, duration: 80, useNativeDriver: useND }),
        Animated.spring(scaleAnims[index]!, { toValue: 1, tension: 200, friction: 8, useNativeDriver: useND }),
      ]).start();

      if (newCount === MAX_COUNT) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Animated.sequence([
          Animated.timing(completionAnims[index]!, { toValue: 1, duration: 300, useNativeDriver: useND }),
          Animated.delay(1500),
          Animated.timing(completionAnims[index]!, { toValue: 0, duration: 300, useNativeDriver: useND }),
        ]).start();
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      setCounts((prev) => ({ ...prev, [key]: newCount }));
      setSessionTotal((t) => t + 1);
    },
    [counts, scaleAnims, completionAnims]
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

      {/* Info card */}
      <View style={[styles.infoCard, { backgroundColor: C.card, borderColor: C.border }]}>
        <Ionicons name="information-circle-outline" size={16} color={C.mutedForeground} />
        <Text style={[styles.infoText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          The Prophet ﷺ said: "Whoever says SubhanAllah 33 times, Alhamdulillah 33 times, and Allahu Akbar 34 times after prayer..." (Muslim)
        </Text>
      </View>

      {/* Dhikr Buttons */}
      <View style={[styles.dhikrGrid, { paddingBottom: insets.bottom + 100 }]}>
        {DHIKR_CONFIG.map((dhikr, i) => {
          const count = counts[dhikr.key];
          const progress = count / MAX_COUNT;
          const isComplete = count >= MAX_COUNT;
          const btnColor = isDark ? dhikr.darkColor : dhikr.color;

          return (
            <Animated.View
              key={dhikr.key}
              style={[{ transform: [{ scale: scaleAnims[i]! }] }, styles.dhikrItem]}
            >
              <Pressable
                onPress={() => handlePress(dhikr.key, i)}
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
                    /{MAX_COUNT}
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
                        width: `${progress * 100}%` as any,
                      },
                    ]}
                  />
                </View>

                {isComplete && (
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
                    <Text style={[styles.completeBadgeText, { fontFamily: "Inter_600SemiBold" }]}>Complete</Text>
                  </Animated.View>
                )}
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
