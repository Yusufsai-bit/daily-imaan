import { Audio } from "expo-av";
import * as Clipboard from "expo-clipboard";
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
import { ARABIC_FONT_REGULAR } from "@/constants/fonts";
import { useApp } from "@/context/AppContext";
import { SURAHS, getSurahById } from "@/data/surahsData";
import { getQuranSurah, QURAN_TRANSLATION_LABEL } from "@/data/quranFull";
import { isSajdahVerse } from "@/data/sajdahData";
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

  const { state, toggleBookmark, isBookmarked, setLastReadPosition, markDeedDone, markAyahRead, updateSettings } = useApp();
  const mushafMode = state.settings.mushafMode;
  const fontSize = state.settings.arabicFontSize;
  const continuousPlay = state.settings.continuousPlay;

  // Arabic line-height + size for the chosen preset. Values picked to keep
  // the diacritic baseline readable at every step. Small accommodates more
  // ayat per screen for fast scrollers; Large is for older readers and
  // matches Muslim Pro's max comfortably.
  const arabicSize = fontSize === "small" ? 20 : fontSize === "large" ? 30 : 24;
  const arabicLine = fontSize === "small" ? 40 : fontSize === "large" ? 56 : 48;

  const [ayat, setAyat] = useState<ParsedAyah[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [openTafsir, setOpenTafsir] = useState<number | null>(null);
  // Repeat-count picker state. Per ayah memorisation aid: tap "×N" to set
  // 1 / 3 / 5 / 7 / 10 — when audio finishes, replay until count exhausted.
  // Stored per-surah-mount, not persisted globally.
  const [repeatTarget, setRepeatTarget] = useState<number>(1);
  const [repeatRemaining, setRepeatRemaining] = useState<number>(0);
  const [copiedFor, setCopiedFor] = useState<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const cycleRepeat = useCallback(() => {
    Haptics.selectionAsync();
    const order = [1, 3, 5, 7, 10];
    setRepeatTarget((prev) => {
      const i = order.indexOf(prev);
      return order[(i + 1) % order.length] ?? 1;
    });
  }, []);

  const handleCopy = useCallback(
    async (ayah: ParsedAyah) => {
      Haptics.selectionAsync();
      try {
        const text = `${ayah.arabic}\n\n"${ayah.english}"\n— Qur'an ${surahId}:${ayah.numberInSurah}`;
        await Clipboard.setStringAsync(text);
        setCopiedFor(ayah.numberInSurah);
        // Auto-clear the "Copied" pill after a short window so the row
        // doesn't sit in a stale "Copied" state for the rest of the
        // session.
        setTimeout(() => {
          setCopiedFor((current) =>
            current === ayah.numberInSurah ? null : current,
          );
        }, 1500);
      } catch {
        Alert.alert("Couldn't copy", "Try again or share instead.");
      }
    },
    [surahId],
  );
  const reciter = state.settings.reciter;

  const cycleFontSize = useCallback(() => {
    Haptics.selectionAsync();
    const order: ("small" | "medium" | "large")[] = ["small", "medium", "large"];
    const next = order[(order.indexOf(fontSize) + 1) % order.length] ?? "medium";
    updateSettings({ arabicFontSize: next });
  }, [fontSize, updateSettings]);

  const toggleContinuousPlay = useCallback(() => {
    Haptics.selectionAsync();
    updateSettings({ continuousPlay: !continuousPlay });
  }, [continuousPlay, updateSettings]);

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

  // Stash the latest ayat list in a ref so the audio finish-handler can
  // look up the next ayah without recreating playAyah on every list change.
  const ayatRef = useRef<ParsedAyah[]>([]);
  useEffect(() => {
    ayatRef.current = ayat;
  }, [ayat]);

  // Reference to playAyah for use inside the audio finish-callback. We
  // assign after definition so the recursive auto-play works without
  // stale closures.
  const playAyahRef = useRef<((a: ParsedAyah) => Promise<void>) | null>(null);

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
            // Repeat-N takes priority over continuous play: if the user
            // asked for N repeats of THIS ayah, finish all N before
            // moving on. Once exhausted, fall through to the continuous-
            // play branch below if enabled.
            setRepeatRemaining((remaining) => {
              if (remaining > 1) {
                setTimeout(() => {
                  void playAyahRef.current?.(ayah);
                }, 60);
                return remaining - 1;
              }
              // Repeat exhausted (or 1-shot). Optional auto-advance.
              if (continuousPlay) {
                const list = ayatRef.current;
                const idx = list.findIndex(
                  (a) => a.numberInSurah === ayah.numberInSurah,
                );
                const next = idx >= 0 ? list[idx + 1] : undefined;
                if (next) {
                  setTimeout(() => {
                    void playAyahRef.current?.(next);
                  }, 60);
                }
              }
              return 0;
            });
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
    [playingAyah, surahId, reciter, markAyahRead, continuousPlay]
  );

  useEffect(() => {
    playAyahRef.current = playAyah;
  }, [playAyah]);

  const renderAyah = ({ item }: { item: ParsedAyah }) => {
    const isPlaying = playingAyah === item.numberInSurah;
    const bookmarked = isBookmarked(item.number);
    const tafsirOpen = openTafsir === item.numberInSurah;
    // Sajdah badge — flagged on the 14–15 prostration verses of the Qur'an.
    // Surfaced as a small caption above the Arabic so the reader knows to
    // perform sajdah at-tilāwah on encountering it.
    const isSajdah = isSajdahVerse(surahId, item.numberInSurah);
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
          {isSajdah && (
            <View
              style={[
                styles.sajdahBadge,
                {
                  backgroundColor: isDark ? "rgba(200,147,60,0.18)" : "rgba(200,147,60,0.14)",
                  borderColor: C.accent,
                },
              ]}
              accessible
              accessibilityLabel="Sajdah verse — prostration is performed when this verse is recited"
            >
              <Ionicons name="star" size={12} color={C.accent} />
              <Text
                style={[
                  styles.sajdahBadgeText,
                  { color: C.accent, fontFamily: "Inter_600SemiBold" },
                ]}
              >
                Sajdah · prostration verse
              </Text>
            </View>
          )}
          <Text
            style={[
              styles.arabicAyah,
              {
                color: C.foreground,
                fontFamily: ARABIC_FONT_REGULAR,
                fontSize: arabicSize,
                lineHeight: arabicLine,
              },
            ]}
          >
            {item.arabic}
          </Text>
          {!mushafMode && (
            <Text style={[styles.englishAyah, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              {item.english}
            </Text>
          )}

          <View style={styles.ayahActions}>
            {!mushafMode && Platform.OS !== "web" && (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  // Fresh play (not pause): seed the repeat counter so the
                  // finish handler knows how many times to loop.
                  if (!isPlaying) {
                    setRepeatRemaining(repeatTarget);
                  }
                  playAyah(item);
                }}
                accessibilityLabel={isPlaying ? "Pause recitation" : "Play recitation"}
                accessibilityHint={
                  repeatTarget > 1
                    ? `Will repeat ${repeatTarget} times`
                    : undefined
                }
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
                  {isPlaying
                    ? repeatRemaining > 1
                      ? `Pause · ${repeatRemaining}×`
                      : "Pause"
                    : repeatTarget > 1
                      ? `Listen · ${repeatTarget}×`
                      : "Listen"}
                </Text>
              </Pressable>
            )}

            {/* Repeat-N picker — shows only on the playing ayah's row to
                keep the action row uncluttered for ayahs the user isn't
                interacting with. Tap to cycle through 1 / 3 / 5 / 7 / 10.
                Helps with memorisation without the full memorisation
                tracker shipping in v1.1. */}
            {!mushafMode && Platform.OS !== "web" && (
              <Pressable
                onPress={cycleRepeat}
                accessibilityLabel={`Repeat target: ${repeatTarget} time${repeatTarget === 1 ? "" : "s"}`}
                accessibilityHint="Tap to cycle through repeat counts: 1, 3, 5, 7, 10"
                style={({ pressed }) => [
                  styles.iconBtn,
                  { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Ionicons name="repeat" size={12} color={C.mutedForeground} />
                <Text
                  style={[
                    styles.iconBtnText,
                    { color: C.mutedForeground, fontFamily: "Inter_500Medium" },
                  ]}
                >
                  ×{repeatTarget}
                </Text>
              </Pressable>
            )}

            {/* Copy text — Arabic + English + reference. Cheap memorisation
                helper for users who want to paste an ayah into a journal,
                a chat, or a screensaver. */}
            <Pressable
              onPress={() => handleCopy(item)}
              accessibilityLabel="Copy ayah text"
              style={({ pressed }) => [
                styles.iconBtn,
                {
                  backgroundColor:
                    copiedFor === item.numberInSurah ? C.secondary : C.muted,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons
                name={copiedFor === item.numberInSurah ? "checkmark" : "copy-outline"}
                size={12}
                color={copiedFor === item.numberInSurah ? C.primary : C.mutedForeground}
              />
              <Text
                style={[
                  styles.iconBtnText,
                  {
                    color:
                      copiedFor === item.numberInSurah ? C.primary : C.mutedForeground,
                    fontFamily: "Inter_500Medium",
                  },
                ]}
              >
                {copiedFor === item.numberInSurah ? "Copied" : "Copy"}
              </Text>
            </Pressable>

            {!mushafMode && (
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
            )}

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

          {!mushafMode && tafsirOpen && (
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
          <Text style={[styles.surahArabic, { fontFamily: ARABIC_FONT_REGULAR }]}>{surah.name}</Text>
          <Text style={[styles.surahMeta, { fontFamily: "Inter_400Regular" }]}>
            {surah.nameTranslation} · {surah.ayahCount} Ayat · {surah.revelationType}
          </Text>
        </View>
        {/* Reading tools — font size cycle, continuous play, mushaf mode.
            Three compact icon buttons. Each persists its setting to
            AppContext so the user's preferred reading mode survives
            across surahs and sessions. */}
        <Pressable
          onPress={cycleFontSize}
          accessibilityRole="button"
          accessibilityLabel={`Arabic font size — ${fontSize}. Tap to cycle.`}
          style={({ pressed }) => [
            styles.toolBtn,
            {
              backgroundColor: "rgba(255,255,255,0.12)",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "Inter_700Bold",
              fontSize: fontSize === "small" ? 11 : fontSize === "large" ? 17 : 14,
            }}
          >
            Aa
          </Text>
        </Pressable>
        <Pressable
          onPress={toggleContinuousPlay}
          accessibilityRole="switch"
          accessibilityLabel="Continuous play"
          accessibilityHint="When on, audio auto-advances to the next ayah after the current one finishes"
          accessibilityState={{ checked: continuousPlay }}
          style={({ pressed }) => [
            styles.toolBtn,
            {
              backgroundColor: continuousPlay ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.12)",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons name={continuousPlay ? "infinite" : "infinite-outline"} size={16} color="#fff" />
        </Pressable>
        {/* Mushaf-mode toggle. When ON the English translation and the
            Tafsir/Listen actions are hidden so the page reads like a printed
            mushaf — Arabic only. Setting persists across screens via
            AppContext. */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            updateSettings({ mushafMode: !mushafMode });
          }}
          accessibilityRole="switch"
          accessibilityLabel="Mushaf mode"
          accessibilityHint="Hides the English translation and shows Arabic only"
          accessibilityState={{ checked: mushafMode }}
          style={({ pressed }) => [
            styles.toolBtn,
            {
              backgroundColor: mushafMode ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.12)",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons name={mushafMode ? "language" : "language-outline"} size={16} color="#fff" />
        </Pressable>
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
                  <Text style={[styles.bismillahText, { color: C.primary, fontFamily: ARABIC_FONT_REGULAR }]}>
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
  mushafToggle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  toolBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
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
  sajdahBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  sajdahBadgeText: { fontSize: 11, letterSpacing: 0.3 },
  arabicAyah: { fontSize: 24, lineHeight: 48, textAlign: "right", writingDirection: "rtl" },
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
