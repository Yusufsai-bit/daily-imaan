import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { SURAHS } from "@/data/surahsData";
import { getQuranSurah } from "@/data/quranFull";
import { DAILY_HADITH, type DailyHadith } from "@/data/hadithData";

interface BookmarkRow {
  globalId: number;
  surahId: number;
  surahName: string;
  surahNameEnglish: string;
  ayahNumber: number;
  arabic: string;
  english: string;
}

/**
 * Resolves stored bookmark IDs into surah + ayah info using bundled data.
 * Defensive de-dup in case earlier client versions persisted duplicates.
 * Sort by surah then ayah for stable display order.
 *
 * The bundled Quran text now lives in a separate ~2.3 MB module that is
 * loaded lazily via dynamic import (see data/quranFull.ts), so this
 * function is async. Each surah is fetched at most once per build via
 * de-duped Promise.all.
 */
async function buildRows(globalIds: number[]): Promise<BookmarkRow[]> {
  const unique = Array.from(new Set(globalIds));
  const resolved = unique
    .map((globalId) => {
      const surah = SURAHS.find(
        (s) => globalId >= s.startingAyah && globalId < s.startingAyah + s.ayahCount
      );
      if (!surah) return null;
      return { globalId, surah, ayahNumber: globalId - surah.startingAyah + 1 };
    })
    .filter(
      (
        x,
      ): x is {
        globalId: number;
        surah: (typeof SURAHS)[number];
        ayahNumber: number;
      } => x !== null,
    );

  const surahIds = Array.from(new Set(resolved.map((r) => r.surah.id)));
  const surahDataEntries = await Promise.all(
    surahIds.map(async (id) => [id, await getQuranSurah(id)] as const),
  );
  const surahDataMap = new Map(surahDataEntries);

  const rows: BookmarkRow[] = resolved.map(({ globalId, surah, ayahNumber }) => {
    const surahData = surahDataMap.get(surah.id);
    const ayah = surahData?.ayahs.find((a) => a.n === ayahNumber);
    return {
      globalId,
      surahId: surah.id,
      surahName: surah.name,
      surahNameEnglish: surah.nameEnglish,
      ayahNumber,
      arabic: ayah?.a ?? "",
      english: ayah?.e ?? "",
    };
  });
  rows.sort((a, b) =>
    a.surahId !== b.surahId ? a.surahId - b.surahId : a.ayahNumber - b.ayahNumber,
  );
  return rows;
}

export default function BookmarksScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const { state, toggleBookmark, toggleHadithBookmark } = useApp();
  const [rows, setRows] = useState<BookmarkRow[]>([]);
  const [loading, setLoading] = useState(true);
  // Two tabs: ayat (existing default) and hadith. Defaults to ayat so
  // existing users land where they expect; only flips when the user taps
  // the Hadith tab. State is screen-local because hadith bookmarks are
  // already kept separately in AppContext.
  const [tab, setTab] = useState<"ayat" | "hadith">("ayat");

  // Resolve hadith bookmarks against the bundled DAILY_HADITH dataset.
  // Stable Map lookup so a 700-entry dataset still resolves N bookmarks
  // in O(1) per bookmark instead of N*M.
  const hadithById = useMemo(() => {
    const m = new Map<string, DailyHadith>();
    for (const h of DAILY_HADITH) m.set(h.id, h);
    return m;
  }, []);
  const hadithRows = useMemo(
    () =>
      state.hadithBookmarks
        .map((id) => hadithById.get(id))
        .filter((h): h is DailyHadith => Boolean(h)),
    [state.hadithBookmarks, hadithById],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    buildRows(state.bookmarks)
      .then((next) => {
        if (cancelled) return;
        setRows(next);
        setLoading(false);
      })
      .catch(() => {
        // If the lazy quranFullData import ever rejects (offline first
        // launch + corrupted bundle is the only realistic case), fall
        // back to an empty list rather than spinning forever.
        if (cancelled) return;
        setRows([]);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [state.bookmarks]);

  const renderItem = ({ item: row }: { item: BookmarkRow }) => (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/surah/${row.surahId}` as never);
      }}
      accessibilityLabel={`Open ${row.surahNameEnglish} verse ${row.ayahNumber}`}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: C.card, borderColor: C.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={styles.rowHeader}>
        <View style={[styles.surahBadge, { backgroundColor: C.secondary }]}>
          <Text style={[styles.surahBadgeText, { color: C.primary, fontFamily: "Inter_600SemiBold" }]}>
            {row.surahNameEnglish} · {row.surahId}:{row.ayahNumber}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            toggleBookmark(row.globalId);
          }}
          hitSlop={10}
          accessibilityLabel="Remove bookmark"
          style={({ pressed }) => [styles.removeBtn, { opacity: pressed ? 0.5 : 1 }]}
        >
          <Ionicons name="bookmark" size={18} color="#C8933C" />
        </Pressable>
      </View>
      {row.arabic ? (
        <Text style={[styles.arabic, { color: C.foreground }]} numberOfLines={3}>
          {row.arabic}
        </Text>
      ) : null}
      {row.english ? (
        <Text
          style={[styles.english, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
          numberOfLines={3}
        >
          {row.english}
        </Text>
      ) : null}
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: C.primary }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.title, { fontFamily: "Inter_700Bold" }]}>Saved</Text>
          <Text style={[styles.subtitle, { fontFamily: "Inter_400Regular" }]}>
            {tab === "ayat"
              ? `${rows.length} ${rows.length === 1 ? "verse" : "verses"} bookmarked`
              : `${hadithRows.length} ${hadithRows.length === 1 ? "hadith" : "hadith"} bookmarked`}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab bar — Ayat / Hadith. The ayat list was the only thing on this
          screen in v1-beta, so the tabs default to it. Hadith bookmarks
          live in their own AppContext field (hadithBookmarks) keyed by
          sunnah.com reference, so the two lists never conflict. */}
      <View style={[styles.tabBar, { borderBottomColor: C.border }]}>
        {(["ayat", "hadith"] as const).map((t) => {
          const active = tab === t;
          return (
            <Pressable
              key={t}
              onPress={() => {
                Haptics.selectionAsync();
                setTab(t);
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={t === "ayat" ? "Ayat tab" : "Hadith tab"}
              style={({ pressed }) => [
                styles.tabBtn,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text
                maxFontSizeMultiplier={1.4}
                style={[
                  styles.tabLabel,
                  {
                    color: active ? C.primary : C.mutedForeground,
                    fontFamily: active ? "Inter_700Bold" : "Inter_500Medium",
                  },
                ]}
              >
                {t === "ayat" ? `Ayat (${rows.length})` : `Hadith (${hadithRows.length})`}
              </Text>
              {active && <View style={[styles.tabUnderline, { backgroundColor: C.primary }]} />}
            </Pressable>
          );
        })}
      </View>

      {tab === "ayat" ? (
        loading && state.bookmarks.length > 0 ? (
          <View style={styles.empty}>
            <ActivityIndicator color={C.primary} />
          </View>
        ) : rows.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="bookmark-outline" size={56} color={C.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
              Nothing saved yet
            </Text>
            <Text style={[styles.emptyText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Tap the bookmark icon next to any ayah to keep it here for later.
            </Text>
          </View>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(row) => String(row.globalId)}
            renderItem={renderItem}
            contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 20 }]}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            windowSize={9}
            removeClippedSubviews
          />
        )
      ) : hadithRows.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="bookmark-outline" size={56} color={C.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
            No hadith saved yet
          </Text>
          <Text style={[styles.emptyText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Tap the bookmark icon on any hadith to keep it here for later.
          </Text>
        </View>
      ) : (
        <FlatList
          data={hadithRows}
          keyExtractor={(h) => h.id}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 20 }]}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          windowSize={7}
          removeClippedSubviews
          renderItem={({ item }) => (
            <View
              style={[styles.row, { backgroundColor: C.card, borderColor: C.border }]}
            >
              <View style={styles.rowHeader}>
                <View
                  style={[
                    styles.surahBadge,
                    {
                      backgroundColor: isDark
                        ? "rgba(200,147,60,0.18)"
                        : "rgba(200,147,60,0.14)",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.surahBadgeText,
                      { color: "#A07418", fontFamily: "Inter_600SemiBold" },
                    ]}
                  >
                    {item.collection} #{item.reference}
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    toggleHadithBookmark(item.id);
                  }}
                  hitSlop={10}
                  accessibilityLabel="Remove hadith bookmark"
                  style={({ pressed }) => [styles.removeBtn, { opacity: pressed ? 0.5 : 1 }]}
                >
                  <Ionicons name="bookmark" size={18} color="#C8933C" />
                </Pressable>
              </View>
              <Text
                style={[styles.arabic, { color: C.foreground }]}
                numberOfLines={3}
              >
                {item.arabicText}
              </Text>
              <Text
                style={[
                  styles.english,
                  { color: C.mutedForeground, fontFamily: "Inter_400Regular" },
                ]}
                numberOfLines={4}
              >
                {item.englishText}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingBottom: 16, paddingHorizontal: 16, flexDirection: "row", alignItems: "center" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerCenter: { flex: 1, alignItems: "center", gap: 2 },
  title: { color: "#fff", fontSize: 18 },
  subtitle: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 17 },
  emptyText: { fontSize: 14, lineHeight: 20, textAlign: "center" },
  list: { padding: 16 },
  row: { borderRadius: 14, padding: 14, gap: 10, borderWidth: StyleSheet.hairlineWidth },
  rowHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  surahBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  surahBadgeText: { fontSize: 12 },
  removeBtn: { padding: 4 },
  arabic: { fontSize: 22, lineHeight: 42, textAlign: "right", writingDirection: "rtl", fontFamily: "NotoNaskhArabic_400Regular" },
  english: { fontSize: 14, lineHeight: 22 },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: { fontSize: 13, letterSpacing: 0.3 },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    height: 2,
    width: 64,
    borderRadius: 2,
  },
});
