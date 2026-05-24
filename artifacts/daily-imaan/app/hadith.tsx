import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/constants/colors";
import { ARABIC_FONT_REGULAR } from "@/constants/fonts";
import {
  DAILY_HADITH,
  DailyHadith,
  getTodayHadith,
} from "@/data/hadithData";
import { a11yButton, a11yDecorative } from "@/components/a11y";

export default function HadithScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  // Today's hadith is the seeded daily rotation; "shuffle" lets the user
  // browse the corpus without changing what tomorrow surfaces.
  const todays = useMemo(() => getTodayHadith(), []);
  const [hadith, setHadith] = useState<DailyHadith>(todays);
  const [copied, setCopied] = useState(false);

  const handleShuffle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const idx = Math.floor(Math.random() * DAILY_HADITH.length);
    setHadith(DAILY_HADITH[idx]!);
  }, []);

  const handleOpenSource = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(hadith.sourceUrl).catch(() => {
      Alert.alert(
        "Could not open browser",
        "Please visit sunnah.com to read the full chain of narrators.",
      );
    });
  }, [hadith.sourceUrl]);

  const handleCopy = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(
      `"${hadith.englishText}"\n\n— ${hadith.collection} ${hadith.reference}${hadith.grade ? ` · ${hadith.grade}` : ""}\n\nvia Daily Imaan`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [hadith]);

  const handleShare = useCallback(async () => {
    try {
      // Concise share format — drops the Arabic block and book-chapter
      // line that were making the share preview feel like a wall of
      // text. English meaning + a single attribution line + source URL
      // is enough; the recipient can tap through to sunnah.com for the
      // full chain of narrators if they want depth.
      await Share.share({
        message: `"${hadith.englishText}"\n\n— ${hadith.collection} ${hadith.reference}${hadith.grade ? ` · ${hadith.grade}` : ""}\n${hadith.sourceUrl}\n\nvia Daily Imaan`,
      });
    } catch {
      // ignore
    }
  }, [hadith]);

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
          {...a11yButton("Back", "Returns to the previous screen")}
          hitSlop={8}
          style={({ pressed }) => [
            styles.backBtn,
            { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="chevron-back" size={20} color={C.foreground} {...a11yDecorative} />
        </Pressable>
      </View>

      {/* Title */}
      <View style={styles.titleBlock}>
        <Text
          maxFontSizeMultiplier={1.6}
          style={[styles.title, { color: C.foreground, fontFamily: "Inter_700Bold" }]}
        >
          Hadith of the Day
        </Text>
        <Text
          maxFontSizeMultiplier={1.4}
          style={[styles.subtitle, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
        >
          One hadith a day from Riyad as-Salihin — verbatim from sunnah.com.
        </Text>
      </View>

      {/* Hadith card */}
      <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#1A6B4A" }]}>
        {/* Collection badge */}
        <View style={[styles.badge, { backgroundColor: C.secondary }]}>
          <Text
            maxFontSizeMultiplier={1.4}
            style={[styles.badgeText, { color: C.primary, fontFamily: "Inter_600SemiBold" }]}
          >
            {hadith.collection} · {hadith.reference}
          </Text>
        </View>

        {/* Arabic */}
        <Text style={[styles.arabicText, { color: C.foreground }]}>
          {hadith.arabicText}
        </Text>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: C.border }]} />

        {/* English */}
        <Text
          maxFontSizeMultiplier={1.6}
          style={[styles.englishText, { color: C.foreground, fontFamily: "Inter_400Regular" }]}
        >
          "{hadith.englishText}"
        </Text>

        {/* Chapter / book context within Riyad as-Salihin */}
        <Text
          maxFontSizeMultiplier={1.4}
          style={[styles.narrator, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}
        >
          {hadith.bookTitle}
        </Text>

        {/* Grade chip — only when sunnah.com publishes a grading for this hadith */}
        {hadith.grade ? (
          <View style={[styles.gradeChip, { backgroundColor: isDark ? "rgba(45,191,127,0.12)" : "rgba(26,107,74,0.07)" }]}>
            <Ionicons name="shield-checkmark-outline" size={12} color={C.primary} {...a11yDecorative} />
            <Text
              maxFontSizeMultiplier={1.3}
              style={[styles.gradeText, { color: C.primary, fontFamily: "Inter_500Medium" }]}
            >
              Grade: {hadith.grade}
            </Text>
          </View>
        ) : null}

        {/* Source CTA — opens sunnah.com so the user can read the full
            isnad and footnotes. We never paraphrase the hadith ourselves. */}
        <Pressable
          onPress={handleOpenSource}
          {...a11yButton(
            `Open ${hadith.collection} ${hadith.reference} on sunnah.com`,
          )}
          style={({ pressed }) => [
            styles.sourceRow,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text
            maxFontSizeMultiplier={1.3}
            style={[styles.sourceText, { color: C.primary, fontFamily: "Inter_500Medium" }]}
          >
            Read full hadith on Sunnah.com
          </Text>
          <Ionicons name="open-outline" size={12} color={C.primary} {...a11yDecorative} />
        </Pressable>

        {/* Action row */}
        <View style={styles.actionRow}>
          <Pressable
            onPress={handleCopy}
            {...a11yButton("Copy this hadith")}
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: C.secondary, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name={copied ? "checkmark" : "copy-outline"} size={18} color={C.primary} {...a11yDecorative} />
            <Text
              maxFontSizeMultiplier={1.4}
              style={[styles.actionBtnText, { color: C.primary, fontFamily: "Inter_500Medium" }]}
            >
              {copied ? "Copied!" : "Copy"}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleShare}
            {...a11yButton("Share this hadith")}
            style={({ pressed }) => [
              styles.actionBtnSmall,
              { backgroundColor: C.secondary, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="share-outline" size={18} color={C.mutedForeground} {...a11yDecorative} />
          </Pressable>

          <Pressable
            onPress={handleShuffle}
            {...a11yButton("Show a different hadith")}
            style={({ pressed }) => [
              styles.actionBtnSmall,
              { backgroundColor: C.secondary, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="shuffle-outline" size={18} color={C.mutedForeground} {...a11yDecorative} />
          </Pressable>
        </View>
      </View>

      {/* Source-attribution footnote — same pattern as the tafsir attribution. */}
      <Text
        maxFontSizeMultiplier={1.3}
        style={[styles.footnote, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
      >
        Hadith text and English translations sourced verbatim from sunnah.com.
        Daily Imaan does not paraphrase or comment on hadith.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  header: { flexDirection: "row", alignItems: "center" },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  titleBlock: { gap: 6, marginBottom: 4 },
  title: { fontSize: 24, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, lineHeight: 18 },
  card: {
    borderRadius: 16,
    padding: 18,
    gap: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  badgeText: { fontSize: 11 },
  arabicText: {
    fontFamily: ARABIC_FONT_REGULAR,
    fontSize: 24,
    lineHeight: 46,
    textAlign: "right",
    writingDirection: "rtl",
  },
  divider: { height: 1, opacity: 0.6 },
  englishText: { fontSize: 16, lineHeight: 26 },
  narrator: { fontSize: 12 },
  gradeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  gradeText: { fontSize: 11 },
  sourceRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  sourceText: { fontSize: 13 },
  actionRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionBtnText: { fontSize: 14 },
  actionBtnSmall: { width: 44, height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  footnote: { fontSize: 11, lineHeight: 16, textAlign: "center", paddingHorizontal: 12, fontStyle: "italic", marginTop: 4 },
});
