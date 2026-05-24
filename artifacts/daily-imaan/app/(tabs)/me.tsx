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
import { a11yButton, a11yChecked, a11yDecorative, a11yLink } from "@/components/a11y";

const GOOD_DEEDS = [
  { id: "fajr", label: "Fajr Prayer", icon: "sunny-outline" as const, time: "Dawn" },
  { id: "dhuhr", label: "Dhuhr Prayer", icon: "partly-sunny-outline" as const, time: "Midday" },
  { id: "asr", label: "Asr Prayer", icon: "sunny-outline" as const, time: "Afternoon" },
  { id: "maghrib", label: "Maghrib Prayer", icon: "moon-outline" as const, time: "Sunset" },
  { id: "isha", label: "Isha Prayer", icon: "star-outline" as const, time: "Night" },
  { id: "quran", label: "Read Quran", icon: "book-outline" as const, time: "Daily" },
  { id: "dua", label: "Made Dua", icon: "chatbubble-ellipses-outline" as const, time: "Anytime" },
  { id: "sadaqah", label: "Gave Sadaqah", icon: "heart-outline" as const, time: "Daily" },
  { id: "parents", label: "Called a Loved One", icon: "call-outline" as const, time: "Daily" },
  { id: "dhikr", label: "Completed Dhikr", icon: "refresh-outline" as const, time: "Daily" },
  // Catch-all row so users can mark any good deed not covered above
  // (a kind word, helping a stranger, holding back anger, etc.). Kept
  // deliberately unlabelled beyond "Other" — the point is quiet
  // accountability with the self, not journaling.
  { id: "other", label: "Other", icon: "ellipsis-horizontal-outline" as const, time: "Anytime" },
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
          {...a11yButton("Settings", "Opens app settings")}
          style={({ pressed }) => [styles.settingsBtn, { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons name="settings-outline" size={20} color={C.mutedForeground} {...a11yDecorative} />
        </Pressable>
      </View>

      {/* Stats Row — three equal-width cards. We previously gave the
          Streak card a hero treatment (flex 1.4, larger icon, larger
          number), but on-device the size jump was small enough to read
          as inconsistency rather than emphasis. All three cards are now
          uniform: same width, same icon size, same number size, same
          padding. Visual hierarchy comes from order (Streak first) and
          the streak note immediately below this row. */}
      <View style={styles.statsRow}>
        <View
          accessible
          accessibilityLabel={`${streak.count} day streak`}
          style={[
            styles.statCard,
            { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" },
          ]}
        >
          <Ionicons name="leaf" size={26} color={C.primary} {...a11yDecorative} />
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.statNumber, { color: C.foreground, fontFamily: "Inter_700Bold" }]}
          >
            {Math.max(1, streak.count)}
          </Text>
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.statLabel, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
          >
            Streak
          </Text>
        </View>

        <View
          accessible
          accessibilityLabel={`${readAyatIds.length} verses read`}
          style={[styles.statCard, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}
        >
          <Ionicons name="book-outline" size={26} color="#C8933C" {...a11yDecorative} />
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.statNumber, { color: C.foreground, fontFamily: "Inter_700Bold" }]}
          >
            {readAyatIds.length}
          </Text>
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.statLabel, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
          >
            Verses Read
          </Text>
        </View>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/bookmarks" as never);
          }}
          {...a11yButton(
            `${bookmarks.length} saved verses`,
            "Opens your bookmarked ayat",
          )}
          style={({ pressed }) => [
            styles.statCard,
            { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000", opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Ionicons name="bookmark" size={26} color={C.primary} {...a11yDecorative} />
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.statNumber, { color: C.foreground, fontFamily: "Inter_700Bold" }]}
          >
            {bookmarks.length}
          </Text>
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.statLabel, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
          >
            Saved
          </Text>
        </Pressable>
      </View>
      <Text style={[styles.streakNote, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
        Two streak freezes per week, refilled every Sunday — they auto-apply when life gets in the way.{streak.longestStreak > 1 ? ` Longest streak so far: ${streak.longestStreak}.` : ""}
      </Text>

      {/* Daily Deeds — moved above Khatam so the daily habit loop is the
          first thing users see after the stats. Khatam is a long-horizon
          goal; Intentions are what drive tomorrow's streak. */}
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

        {checked === GOOD_DEEDS.length && (
          <View style={[styles.completionBanner, { backgroundColor: isDark ? "rgba(45,191,127,0.10)" : "rgba(26,107,74,0.07)", borderColor: C.primary + "30" }]}>
            <Text style={{ fontSize: 18 }}>🌿</Text>
            <Text style={[styles.completionText, { color: C.primary, fontFamily: "Inter_500Medium" }]}>
              MashaAllah — may Allah accept your deeds today.
            </Text>
          </View>
        )}

        <View style={[styles.deedsList, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          {GOOD_DEEDS.map((deed, i) => {
            const isChecked = isDeedChecked(deed.id);
            return (
              <Pressable
                key={deed.id}
                onPress={() => handleToggle(deed.id)}
                {...a11yChecked(deed.label, isChecked, "Toggles today's intention")}
                style={({ pressed }) => [
                  styles.deedRow,
                  i < GOOD_DEEDS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border },
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View
                  {...a11yDecorative}
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
                  {...a11yDecorative}
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

      {/* Khatam progress — surfaces overall Quran reading progress as a
          gentle "you are X% through the Qur'an" gauge. The reading is
          tracked passively by `markAyahRead` calls scattered through the
          app (audio play, opening surahs, tapping notification, etc.),
          so the number grows organically without any explicit "I read
          this" gesture. 6,236 is the canonical ayah count. */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push("/quran" as never);
        }}
        {...a11yLink(
          `${Math.round((readAyatIds.length / 6236) * 100)} percent of the Qur'an read`,
          "Opens the Qur'an tab",
        )}
        style={({ pressed }) => [
          styles.khatamCard,
          {
            backgroundColor: C.card,
            borderColor: C.border,
            shadowColor: isDark ? "#000" : "#000",
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <View style={styles.khatamRow}>
          <View style={[styles.khatamIcon, { backgroundColor: C.secondary }]}>
            <Ionicons name="book-outline" size={18} color={C.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              maxFontSizeMultiplier={1.5}
              style={[styles.khatamTitle, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}
            >
              Qur'an progress
            </Text>
            <Text
              maxFontSizeMultiplier={1.5}
              style={[styles.khatamSub, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
            >
              {readAyatIds.length.toLocaleString()} of 6,236 ayat ·{" "}
              {((readAyatIds.length / 6236) * 100).toFixed(1)}%
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={C.mutedForeground} />
        </View>
        <View style={[styles.khatamBarBg, { backgroundColor: C.muted }]}>
          <View
            style={[
              styles.khatamBarFill,
              {
                backgroundColor: C.primary,
                width: `${Math.min(100, Math.max(1, (readAyatIds.length / 6236) * 100))}%` as DimensionValue,
              },
            ]}
          />
        </View>
      </Pressable>

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: C.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 10 }]}>
          More
        </Text>
        <View style={[styles.linksList, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          <Pressable
            onPress={() => router.push("/settings" as never)}
            {...a11yLink("Settings", "Opens app settings")}
            style={({ pressed }) => [styles.linkRow, { borderBottomColor: C.border, opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="settings-outline" size={20} color={C.primary} {...a11yDecorative} />
            <Text
              maxFontSizeMultiplier={1.5}
              style={[styles.linkText, { color: C.foreground, fontFamily: "Inter_500Medium" }]}
            >
              Settings
            </Text>
            <Ionicons name="chevron-forward" size={16} color={C.mutedForeground} style={{ marginLeft: "auto" }} {...a11yDecorative} />
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/bookmarks" as never);
            }}
            {...a11yLink(
              `Bookmarked Ayat, ${bookmarks.length} saved`,
              "Opens your bookmarked ayat",
            )}
            style={({ pressed }) => [styles.linkRow, { borderBottomColor: C.border, opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="bookmark-outline" size={20} color={C.primary} {...a11yDecorative} />
            <Text
              maxFontSizeMultiplier={1.5}
              style={[styles.linkText, { color: C.foreground, fontFamily: "Inter_500Medium" }]}
            >
              Bookmarked Ayat ({bookmarks.length})
            </Text>
            <Ionicons name="chevron-forward" size={16} color={C.mutedForeground} style={{ marginLeft: "auto" }} {...a11yDecorative} />
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/asma" as never);
            }}
            {...a11yLink("99 Names of Allah", "Opens the Asma ul Husna list")}
            style={({ pressed }) => [styles.linkRow, { borderBottomColor: C.border, opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="sparkles-outline" size={20} color={C.primary} {...a11yDecorative} />
            <Text maxFontSizeMultiplier={1.5} style={[styles.linkText, { color: C.foreground, fontFamily: "Inter_500Medium" }]}>
              99 Names of Allah
            </Text>
            <Ionicons name="chevron-forward" size={16} color={C.mutedForeground} style={{ marginLeft: "auto" }} {...a11yDecorative} />
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/fasting" as never);
            }}
            {...a11yLink("Fasting Tracker", "Track fasts and qada")}
            style={({ pressed }) => [styles.linkRow, { borderBottomColor: C.border, borderBottomWidth: 0, opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="moon-outline" size={20} color={C.primary} {...a11yDecorative} />
            <Text maxFontSizeMultiplier={1.5} style={[styles.linkText, { color: C.foreground, fontFamily: "Inter_500Medium" }]}>
              Fasting Tracker
            </Text>
            <Ionicons name="chevron-forward" size={16} color={C.mutedForeground} style={{ marginLeft: "auto" }} {...a11yDecorative} />
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
    flex: 1, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 12,
    alignItems: "center", gap: 6,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  statNumber: { fontSize: 28, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, textAlign: "center" },
  streakNote: { fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: -14, paddingHorizontal: 16, fontStyle: "italic" },
  khatamCard: {
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  khatamRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  khatamIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  khatamTitle: { fontSize: 14 },
  khatamSub: { fontSize: 12, marginTop: 1 },
  khatamBarBg: { height: 6, borderRadius: 3, overflow: "hidden" },
  khatamBarFill: { height: "100%", borderRadius: 3 },
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
});
