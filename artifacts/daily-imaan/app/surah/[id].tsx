import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { SURAHS, getSurahById } from "@/data/surahsData";
import { getQuranSurah, QURAN_TRANSLATION_LABEL } from "@/data/quranFull";
import { useTafsir } from "@/hooks/useTafsir";

interface ParsedAyah {
  number: number;
  numberInSurah: number;
  arabic: string;
  english: string;
}

/**
 * Inline tafsir row for a single ayah. Hosting the hook in a child component
 * keeps the network request scoped to the ayah the user actually expanded —
 * we never issue 286 fetches when scrolling Al-Baqarah.
 */
function AyahTafsir({
  surahId,
  ayahNumber,
  C,
  isDark,
}: {
  surahId: number;
  ayahNumber: number;
  C: (typeof colors)["light"];
  isDark: boolean;
}) {
  const tafsir = useTafsir(surahId, ayahNumber, true);
  return (
    <View
      style={[
        styles.tafsirBox,
        {
          backgroundColor: isDark ? "rgba(45,191,127,0.08)" : "rgba(26,107,74,0.06)",
          borderLeftColor: C.primary,
        },
      ]}
    >
      {tafsir.loading && (
        <View style={styles.tafsirLoading}>
          <ActivityIndicator color={C.primary} size="small" />
          <Text style={[styles.tafsirLoadingText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Loading tafsir…
          </Text>
        </View>
      )}
      {tafsir.error && !tafsir.loading && (
        <Pressable
          onPress={() => {
            const url = `https://quran.com/${surahId}/${ayahNumber}/tafsirs`;
            Linking.openURL(url).catch(() => undefined);
          }}
        >
          <Text style={[styles.tafsirErrorText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Couldn't load tafsir. Tap to read it on Quran.com.
          </Text>
        </Pressable>
      )}
      {tafsir.text && !tafsir.loading && (
        <>
          <Text style={[styles.tafsirText, { color: C.foreground, fontFamily: "Inter_400Regular" }]}>
            {tafsir.text}
          </Text>
          <Pressable
            onPress={() => {
              const url = `https://quran.com/${surahId}/${ayahNumber}/tafsirs`;
              Linking.openURL(url).catch(() => undefined);
            }}
            style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}
          >
            <Text style={[styles.tafsirSourceText, { color: C.primary, fontFamily: "Inter_500Medium" }]}>
              {tafsir.source}
            </Text>
            <Ionicons name="open-outline" size={11} color={C.primary} />
          </Pressable>
        </>
      )}
    </View>
  );
}

export default function SurahDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surahId = parseInt(id ?? "1");
  const surah = getSurahById(surahId);

  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const { state, toggleBookmark, isBookmarked, setLastReadPosition, markDeedDone, markAyahRead } = useApp();

  const [ayat, setAyat] = useState<ParsedAyah[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [openTafsir, setOpenTafsir] = useState<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const reciter = state.settings.reciter;

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  // Load surah from bundled data and update Continue Reading + intentions.
  // The full Saheeh International + Uthmani text lives in quranFullData.ts
  // and is loaded lazily via dynamic import (see data/quranFull.ts) so the
  // 2.3 MB payload doesn't parse during cold start of unrelated screens.
  // First call into this surah pays the parse cost once; subsequent calls
  // hit the in-memory index.
  useEffect(() => {
    if (!surahId || !surah) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      let localData: Awaited<ReturnType<typeof getQuranSurah>> = undefined;
      try {
        localData = await getQuranSurah(surahId);
      } catch {
        // Lazy module load failed — treat as missing surah and stop the
        // spinner rather than leaving the screen in a perpetual loading
        // state. The user sees the standard "Surah not found" empty UI.
      }
      if (cancelled) return;
      if (localData) {
        const parsed = localData.ayahs.map((a) => ({
          number: surah.startingAyah + a.n - 1,
          numberInSurah: a.n,
          arabic: a.a,
          english: a.e,
        }));
        setAyat(parsed);
        // Update "Continue reading" position to the start of this surah on
        // mount. Tracking actual scroll offset would add a lot of complexity
        // for marginal benefit — first-ayah of the most recent surah is a
        // sensible resume point.
        setLastReadPosition({
          surahId,
          ayahNumber: 1,
          surahName: surah.nameEnglish,
          updatedAt: Date.now(),
        });
        // Auto-link the "Read Quran" intention. markDeedDone is idempotent —
        // it never undoes a manual check.
        markDeedDone("quran");
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [surahId, surah, setLastReadPosition, markDeedDone]);

  const playAyah = useCallback(
    async (ayah: ParsedAyah) => {
      if (Platform.OS === "web") {
        Alert.alert("Audio", "Audio is available on the mobile app.");
        return;
      }
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        if (playingAyah === ayah.numberInSurah) {
          setPlayingAyah(null);
          return;
        }
        setPlayingAyah(ayah.numberInSurah);
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const surahData = SURAHS.find((s) => s.id === surahId);
        const globalNum = (surahData?.startingAyah ?? 1) + ayah.numberInSurah - 1;
        const { sound } = await Audio.Sound.createAsync(
          { uri: `https://cdn.alquran.cloud/media/audio/ayah/${reciter}/${globalNum}` },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setPlayingAyah(null);
          }
        });
        // Mark the ayah as "read" the moment the user actively engages with
        // it via audio — explicit signal, less aggressive than marking on
        // scroll into view.
        markAyahRead(ayah.number);
      } catch {
        setPlayingAyah(null);
        Alert.alert("Audio Error", "Could not load audio.");
      }
    },
    [playingAyah, surahId, reciter, markAyahRead]
  );

  const renderAyah = ({ item }: { item: ParsedAyah }) => {
    const isPlaying = playingAyah === item.numberInSurah;
    const bookmarked = isBookmarked(item.number);
    const tafsirOpen = openTafsir === item.numberInSurah;
    return (
      <View
        style={[
          styles.ayahRow,
          { borderBottomColor: C.border },
          bookmarked && { backgroundColor: isDark ? "rgba(45,191,127,0.06)" : "rgba(26,107,74,0.04)" },
        ]}
      >
        <View style={[styles.ayahBadge, { backgroundColor: bookmarked ? C.primary : C.secondary }]}>
          <Text
            style={[
              styles.ayahNumber,
              { color: bookmarked ? "#fff" : C.primary, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            {item.numberInSurah}
          </Text>
        </View>

        <View style={styles.ayahContent}>
          <Text style={[styles.arabicAyah, { color: C.foreground }]}>{item.arabic}</Text>
          <Text style={[styles.englishAyah, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            {item.english}
          </Text>

          <View style={styles.ayahActions}>
            {Platform.OS !== "web" && (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  playAyah(item);
                }}
                accessibilityLabel={isPlaying ? "Pause recitation" : "Play recitation"}
                style={({ pressed }) => [
                  styles.iconBtn,
                  { backgroundColor: isPlaying ? C.primary : C.muted, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={12}
                  color={isPlaying ? "#fff" : C.mutedForeground}
                />
                <Text
                  style={[
                    styles.iconBtnText,
                    { color: isPlaying ? "#fff" : C.mutedForeground, fontFamily: "Inter_500Medium" },
                  ]}
                >
                  {isPlaying ? "Pause" : "Listen"}
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setOpenTafsir(tafsirOpen ? null : item.numberInSurah);
              }}
              accessibilityLabel={tafsirOpen ? "Hide tafsir" : "Show tafsir"}
              style={({ pressed }) => [
                styles.iconBtn,
                { backgroundColor: tafsirOpen ? C.secondary : C.muted, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons
                name={tafsirOpen ? "chevron-up" : "book-outline"}
                size={12}
                color={tafsirOpen ? C.primary : C.mutedForeground}
              />
              <Text
                style={[
                  styles.iconBtnText,
                  { color: tafsirOpen ? C.primary : C.mutedForeground, fontFamily: "Inter_500Medium" },
                ]}
              >
                Tafsir
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleBookmark(item.number);
              }}
              accessibilityLabel={bookmarked ? "Remove bookmark" : "Bookmark this ayah"}
              style={({ pressed }) => [
                styles.bookmarkBtn,
                { backgroundColor: bookmarked ? "#C8933C20" : C.muted, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons
                name={bookmarked ? "bookmark" : "bookmark-outline"}
                size={14}
                color={bookmarked ? "#C8933C" : C.mutedForeground}
              />
            </Pressable>
          </View>

          {tafsirOpen && (
            <AyahTafsir
              surahId={surahId}
              ayahNumber={item.numberInSurah}
              C={C}
              isDark={isDark}
            />
          )}
        </View>
      </View>
    );
  };

  if (!surah) {
    return (
      <View style={[styles.center, { backgroundColor: C.background }]}>
        <Text style={[styles.errorText, { color: C.foreground, fontFamily: "Inter_400Regular" }]}>
          Surah not found
        </Text>
      </View>
    );
  }

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
          <Text style={[styles.surahName, { fontFamily: "Inter_700Bold" }]}>{surah.nameEnglish}</Text>
          <Text style={styles.surahArabic}>{surah.name}</Text>
          <Text style={[styles.surahMeta, { fontFamily: "Inter_400Regular" }]}>
            {surah.nameTranslation} · {surah.ayahCount} Ayat · {surah.revelationType}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={C.primary} />
          <Text style={[styles.loadingText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Loading surah…
          </Text>
        </View>
      ) : ayat.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={48} color={C.mutedForeground} />
          <Text style={[styles.errorText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Could not load this surah.
          </Text>
        </View>
      ) : (
        <FlatList
          data={ayat}
          keyExtractor={(item) => String(item.numberInSurah)}
          renderItem={renderAyah}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={styles.listHeader}>
              {surahId !== 9 && (
                <View style={[styles.bismillah, { backgroundColor: C.card }]}>
                  <Text style={[styles.bismillahText, { color: C.primary }]}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </Text>
                </View>
              )}
              {/* Translator attribution. The English text on every ayah row
                  is verbatim from this translation, served by the Quran.com
                  Foundation API. */}
              <View style={[styles.translatorBadge, { backgroundColor: C.muted }]}>
                <Ionicons name="language-outline" size={12} color={C.mutedForeground} />
                <Text style={[styles.translatorText, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>
                  Translation: {QURAN_TRANSLATION_LABEL}
                </Text>
              </View>
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
  surahName: { color: "#fff", fontSize: 18 },
  surahArabic: { color: "rgba(255,255,255,0.9)", fontSize: 20 },
  surahMeta: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  bismillah: { padding: 20, alignItems: "center", marginBottom: 4 },
  bismillahText: { fontSize: 24, lineHeight: 44 },
  list: { paddingTop: 8 },
  ayahRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  ayahBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 6,
  },
  ayahNumber: { fontSize: 12 },
  ayahContent: { flex: 1, gap: 10 },
  arabicAyah: { fontSize: 22, lineHeight: 42, textAlign: "right", writingDirection: "rtl" },
  englishAyah: { fontSize: 14, lineHeight: 22 },
  ayahActions: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  iconBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  iconBtnText: { fontSize: 12 },
  bookmarkBtn: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  listHeader: { gap: 8 },
  translatorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  translatorText: { fontSize: 11 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  loadingText: { fontSize: 15 },
  errorText: { fontSize: 15, textAlign: "center", paddingHorizontal: 32 },
  tafsirBox: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 10,
    borderRadius: 4,
    gap: 8,
    marginTop: 4,
  },
  tafsirText: { fontSize: 13, lineHeight: 21 },
  tafsirSourceText: { fontSize: 11, letterSpacing: 0.2 },
  tafsirLoading: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
  tafsirLoadingText: { fontSize: 13 },
  tafsirErrorText: { fontSize: 13, lineHeight: 20 },
});
