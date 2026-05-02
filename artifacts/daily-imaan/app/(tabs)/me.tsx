import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useCallback } from "react";
import {
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

const GOOD_DEEDS = [
  { id: "fajr", label: "Fajr Prayer", icon: "sunny-outline" as const, time: "Dawn" },
  { id: "dhuhr", label: "Dhuhr Prayer", icon: "partly-sunny-outline" as const, time: "Midday" },
  { id: "asr", label: "Asr Prayer", icon: "sunny-outline" as const, time: "Afternoon" },
  { id: "maghrib", label: "Maghrib Prayer", icon: "moon-outline" as const, time: "Sunset" },
  { id: "isha", label: "Isha Prayer", icon: "star-outline" as const, time: "Night" },
  { id: "quran", label: "Read Quran", icon: "book-outline" as const, time: "Daily" },
  { id: "dua", label: "Made Dua", icon: "chatbubble-ellipses-outline" as const, time: "Anytime" },
  { id: "sadaqah", label: "Gave Sadaqah", icon: "heart-outline" as const, time: "Daily" },
  { id: "parents", label: "Called Parents", icon: "call-outline" as const, time: "Daily" },
  { id: "dhikr", label: "Completed Dhikr", icon: "refresh-outline" as const, time: "Daily" },
];

export default function MeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const { state, toggleDeed, isDeedChecked } = useApp();
  const { streak, bookmarks, readAyatIds } = state;

  const checked = GOOD_DEEDS.filter((d) => isDeedChecked(d.id)).length;
  const progress = checked / GOOD_DEEDS.length;

  const handleToggle = useCallback(
    (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleDeed(id);
    },
    [toggleDeed]
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: C.foreground, fontFamily: "Inter_700Bold" }]}>
          My Imaan
        </Text>
        <Pressable
          onPress={() => router.push("/settings" as never)}
          style={({ pressed }) => [styles.settingsBtn, { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons name="settings-outline" size={20} color={C.mutedForeground} />
        </Pressable>
      </View>

      {/* Stats Row — soft, gain-only metrics. No "best" or "broken" framing.
          The hero metric ("Days with Allah") gets a wider card and larger
          number so the soft streak feels primary; secondary stats are
          tappable to take the user to their full lists. */}
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            styles.statCardHero,
            { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" },
          ]}
        >
          <Ionicons name="leaf" size={30} color={C.primary} />
          <Text
            style={[
              styles.statNumberHero,
              { color: C.foreground, fontFamily: "Inter_700Bold" },
            ]}
          >
            {streak.count}
          </Text>
          <Text style={[styles.statLabel, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Days with Allah
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          <Ionicons name="book-outline" size={26} color="#C8933C" />
          <Text style={[styles.statNumber, { color: C.foreground, fontFamily: "Inter_700Bold" }]}>
            {readAyatIds.length}
          </Text>
          <Text style={[styles.statLabel, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Verses Read
          </Text>
        </View>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/bookmarks" as never);
          }}
          accessibilityLabel={`View ${bookmarks.length} saved verses`}
          style={({ pressed }) => [
            styles.statCard,
            { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000", opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Ionicons name="bookmark" size={26} color={C.primary} />
          <Text style={[styles.statNumber, { color: C.foreground, fontFamily: "Inter_700Bold" }]}>
            {bookmarks.length}
          </Text>
          <Text style={[styles.statLabel, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Saved
          </Text>
        </Pressable>
      </View>
      <Text style={[styles.streakNote, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
        Days with Allah only ever goes up. Periods, illness, travel, and rest never break it.
      </Text>

      {/* I am feeling... — gentle entry to Quran/Sunnah comfort */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push("/feeling" as never);
        }}
        style={({ pressed }) => [
          styles.feelingCard,
          {
            backgroundColor: C.card,
            shadowColor: isDark ? "#000" : "#1A6B4A",
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.feelingIcon,
            {
              backgroundColor: isDark
                ? "rgba(45,191,127,0.15)"
                : "rgba(26,107,74,0.08)",
            },
          ]}
        >
          <Ionicons name="heart-outline" size={20} color={C.primary} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[styles.feelingTitle, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
            I am feeling...
          </Text>
          <Text style={[styles.feelingSub, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Find a verse or dua for your heart
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={C.mutedForeground} />
      </Pressable>

      {/* Daily Deeds */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={{ gap: 2 }}>
            <Text style={[styles.sectionTitle, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
              Today's Intentions
            </Text>
            <Text style={[styles.sectionSub, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Quiet accountability · resets each day
            </Text>
          </View>
          {checked > 0 && (
            <Text style={[styles.sectionCount, { color: C.primary, fontFamily: "Inter_600SemiBold" }]}>
              {checked}/{GOOD_DEEDS.length}
            </Text>
          )}
        </View>

        {/* Progress bar — only shown once something is checked */}
        {checked > 0 && (
          <View style={[styles.progressBg, { backgroundColor: C.muted }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: C.primary,
                  width: `${Math.round(progress * 100)}%` as DimensionValue,
                },
              ]}
            />
          </View>
        )}

        {/* Gentle completion message — only when all done */}
        {checked === GOOD_DEEDS.length && (
          <View style={[styles.completionBanner, { backgroundColor: isDark ? "rgba(45,191,127,0.10)" : "rgba(26,107,74,0.07)", borderColor: C.primary + "30" }]}>
            <Text style={{ fontSize: 18 }}>🌿</Text>
            <Text style={[styles.completionText, { color: C.primary, fontFamily: "Inter_500Medium" }]}>
              MashaAllah — may Allah accept your deeds today.
            </Text>
          </View>
        )}

        {/* Deeds List */}
        <View style={[styles.deedsList, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          {GOOD_DEEDS.map((deed, i) => {
            const isChecked = isDeedChecked(deed.id);
            return (
              <Pressable
                key={deed.id}
                onPress={() => handleToggle(deed.id)}
                style={({ pressed }) => [
                  styles.deedRow,
                  i < GOOD_DEEDS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border },
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View
                  style={[
                    styles.deedCheck,
                    {
                      backgroundColor: isChecked ? C.primary : "transparent",
                      borderColor: isChecked ? C.primary : C.border,
                    },
                  ]}
                >
                  {isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>

                <Ionicons
                  name={deed.icon}
                  size={18}
                  color={isChecked ? C.primary : C.mutedForeground}
                />

                <Text
                  style={[
                    styles.deedLabel,
                    {
                      color: isChecked ? C.foreground : C.mutedForeground,
                      fontFamily: isChecked ? "Inter_600SemiBold" : "Inter_400Regular",
                      textDecorationLine: isChecked ? "none" : "none",
                    },
                  ]}
                >
                  {deed.label}
                </Text>

                <Text style={[styles.deedTime, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                  {deed.time}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: C.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 10 }]}>
          More
        </Text>
        <View style={[styles.linksList, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/qibla" as never);
            }}
            style={({ pressed }) => [styles.linkRow, { borderBottomColor: C.border, opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="compass-outline" size={20} color={C.primary} />
            <Text style={[styles.linkText, { color: C.foreground, fontFamily: "Inter_500Medium" }]}>
              Qibla Compass
            </Text>
            <Ionicons name="chevron-forward" size={16} color={C.mutedForeground} style={{ marginLeft: "auto" }} />
          </Pressable>

          <Pressable
            onPress={() => router.push("/settings" as never)}
            style={({ pressed }) => [styles.linkRow, { borderBottomColor: C.border, opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="settings-outline" size={20} color={C.primary} />
            <Text style={[styles.linkText, { color: C.foreground, fontFamily: "Inter_500Medium" }]}>
              Settings
            </Text>
            <Ionicons name="chevron-forward" size={16} color={C.mutedForeground} style={{ marginLeft: "auto" }} />
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/bookmarks" as never);
            }}
            style={({ pressed }) => [styles.linkRow, { borderBottomColor: C.border, borderBottomWidth: 0, opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="bookmark-outline" size={20} color={C.primary} />
            <Text style={[styles.linkText, { color: C.foreground, fontFamily: "Inter_500Medium" }]}>
              Bookmarked Ayat ({bookmarks.length})
            </Text>
            <Ionicons name="chevron-forward" size={16} color={C.mutedForeground} style={{ marginLeft: "auto" }} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 24 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 28, letterSpacing: -0.5 },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1, borderRadius: 14, padding: 14, alignItems: "center", gap: 4,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  // Wider hero card for the primary "Days with Allah" metric — communicates
  // importance without changing colour weight.
  statCardHero: { flex: 1.4, paddingVertical: 18 },
  statNumber: { fontSize: 24, letterSpacing: -0.5 },
  statNumberHero: { fontSize: 36, letterSpacing: -1 },
  statLabel: { fontSize: 11, textAlign: "center" },
  streakNote: { fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: -14, paddingHorizontal: 16, fontStyle: "italic" },
  section: { gap: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  sectionTitle: { fontSize: 17 },
  sectionSub: { fontSize: 12 },
  sectionCount: { fontSize: 15, marginTop: 2 },
  completionBanner: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  completionText: { flex: 1, fontSize: 14, lineHeight: 20 },
  progressBg: { height: 5, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  deedsList: {
    borderRadius: 14, overflow: "hidden",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  deedRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 13 },
  deedCheck: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  deedLabel: { flex: 1, fontSize: 15 },
  deedTime: { fontSize: 12 },
  linksList: {
    borderRadius: 14, overflow: "hidden",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  linkText: { fontSize: 15 },
  feelingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  feelingIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  feelingTitle: { fontSize: 15 },
  feelingSub: { fontSize: 12, lineHeight: 17 },
});
