import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import * as Sharing from "expo-sharing";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { captureRef } from "react-native-view-shot";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
} from "react-native-track-player";

import colors from "@/constants/colors";
import { ARABIC_FONT_REGULAR } from "@/constants/fonts";
import { useApp } from "@/context/AppContext";
import ShareAyahCard from "@/components/ShareAyahCard";
import { SURAHS, getSurahById } from "@/data/surahsData";
import { getQuranSurah, QURAN_TRANSLATION_LABEL } from "@/data/quranFull";
import { isSajdahVerse } from "@/data/sajdahData";
import { useTafsir } from "@/hooks/useTafsir";
import { playSurah, playSingleAyah, parseTrackId } from "@/lib/trackPlayer";

interface ParsedAyah {
  number: number;
  numberInSurah: number;
  arabic: string;
  english: string;
}

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

  const { state, toggleBookmark, isBookmarked, setLastReadPosition, markDeedDone, markAyahRead, updateSettings, setAyahNote } = useApp();
  const mushafMode = state.settings.mushafMode;
  const fontSize = state.settings.arabicFontSize;
  const continuousPlay = state.settings.continuousPlay;
  const reciter = state.settings.reciter;

  const arabicSize = fontSize === "small" ? 20 : fontSize === "large" ? 30 : 24;
  const arabicLine = fontSize === "small" ? 40 : fontSize === "large" ? 56 : 48;

  const [ayat, setAyat] = useState<ParsedAyah[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTafsir, setOpenTafsir] = useState<number | null>(null);
  const [copiedFor, setCopiedFor] = useState<number | null>(null);
  const [sharingAyah, setSharingAyah] = useState<ParsedAyah | null>(null);
  const shareCardRef = useRef<View>(null);

  // A-B loop: how many times to repeat a single ayah. 0 = off.
  const REPEAT_OPTIONS: { label: string; value: number }[] = [
    { label: "×1", value: 1 },
    { label: "×3", value: 3 },
    { label: "×5", value: 5 },
    { label: "×10", value: 10 },
    { label: "∞", value: Infinity },
  ];
  const [repeatIdx, setRepeatIdx] = useState(0); // index into REPEAT_OPTIONS
  const repeatCount = REPEAT_OPTIONS[repeatIdx]?.value ?? 1;

  // Verse notes modal
  const [noteModal, setNoteModal] = useState<{ ayahId: number; globalId: number; draft: string } | null>(null);

  // RNTP state — which ayah is highlighted on THIS surah screen
  const activeTrack = useActiveTrack();
  const { state: playbackState } = usePlaybackState();
  const isRNTPPlaying = playbackState === State.Playing || playbackState === State.Buffering;
  const activeParsed = parseTrackId(activeTrack?.id);
  const activeAyahOnThisSurah =
    activeParsed?.surahId === surahId ? activeParsed.ayahN : null;

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

  const handleCopy = useCallback(
    async (ayah: ParsedAyah) => {
      Haptics.selectionAsync();
      try {
        const text = `${ayah.arabic}\n\n"${ayah.english}"\n— Qur'an ${surahId}:${ayah.numberInSurah}`;
        await Clipboard.setStringAsync(text);
        setCopiedFor(ayah.numberInSurah);
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

  const handleShareAsImage = useCallback(
    async (ayah: ParsedAyah) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSharingAyah(ayah);
      // Give one frame for the off-screen card to render before capturing
      await new Promise((r) => setTimeout(r, 80));
      try {
        const uri = await captureRef(shareCardRef, {
          format: "jpg",
          quality: 0.95,
          result: "tmpfile",
        });
        await Sharing.shareAsync(uri, { mimeType: "image/jpeg" });
      } catch {
        Alert.alert("Couldn't create image", "Please try again.");
      } finally {
        setSharingAyah(null);
      }
    },
    [],
  );

  // Tap "Listen" on an individual ayah
  const handleAyahListen = useCallback(
    async (ayah: ParsedAyah) => {
      if (Platform.OS === "web") {
        Alert.alert("Audio", "Audio is available on the mobile app.");
        return;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      try {
        // If this ayah is already playing, toggle pause/play
        if (activeAyahOnThisSurah === ayah.numberInSurah) {
          if (isRNTPPlaying) {
            await TrackPlayer.pause();
          } else {
            await TrackPlayer.play();
          }
          return;
        }
        // If continuousPlay is on, load the surah from this ayah and run through
        if (continuousPlay) {
          await playSurah(surahId, reciter, ayah.numberInSurah);
        } else {
          await playSingleAyah(surahId, ayah.numberInSurah, reciter, repeatCount);
        }
        markAyahRead(ayah.number);
        markDeedDone("quran");
      } catch {
        Alert.alert("Audio Error", "Could not load audio. Check your connection.");
      }
    },
    [activeAyahOnThisSurah, isRNTPPlaying, continuousPlay, surahId, reciter, repeatCount, markAyahRead, markDeedDone],
  );

  // "Play Surah" — loads all ayahs from the beginning
  const handlePlaySurah = useCallback(async () => {
    if (Platform.OS === "web") return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      if (activeParsed?.surahId === surahId && isRNTPPlaying) {
        await TrackPlayer.pause();
      } else {
        await playSurah(surahId, reciter, 1);
        markDeedDone("quran");
      }
    } catch {
      Alert.alert("Audio Error", "Could not load audio. Check your connection.");
    }
  }, [activeParsed, surahId, isRNTPPlaying, reciter, markDeedDone]);

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
        // Lazy load failed — show empty UI rather than infinite spinner.
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
        setLastReadPosition({
          surahId,
          ayahNumber: 1,
          surahName: surah.nameEnglish,
          updatedAt: Date.now(),
        });
        markDeedDone("quran");
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [surahId, surah, setLastReadPosition, markDeedDone]);

  const renderAyah = ({ item }: { item: ParsedAyah }) => {
    const isPlaying = activeAyahOnThisSurah === item.numberInSurah && isRNTPPlaying;
    const isActive = activeAyahOnThisSurah === item.numberInSurah;
    const bookmarked = isBookmarked(item.number);
    const tafsirOpen = openTafsir === item.numberInSurah;
    const isSajdah = isSajdahVerse(surahId, item.numberInSurah);
    const hasNote = !!state.ayahNotes[item.number];

    return (
      <View
        style={[
          styles.ayahRow,
          { borderBottomColor: C.border },
          bookmarked && { backgroundColor: isDark ? "rgba(45,191,127,0.06)" : "rgba(26,107,74,0.04)" },
          isActive && !isPlaying && { backgroundColor: isDark ? "rgba(45,191,127,0.04)" : "rgba(26,107,74,0.02)" },
        ]}
      >
        <View style={[styles.ayahBadge, { backgroundColor: bookmarked ? C.primary : isActive ? C.primary : C.secondary }]}>
          <Text
            style={[
              styles.ayahNumber,
              { color: bookmarked || isActive ? "#fff" : C.primary, fontFamily: "Inter_600SemiBold" },
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
              <Text style={[styles.sajdahBadgeText, { color: C.accent, fontFamily: "Inter_600SemiBold" }]}>
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
            {/* Listen — always visible, works in mushaf mode too */}
            {Platform.OS !== "web" && (
              <Pressable
                onPress={() => handleAyahListen(item)}
                accessibilityLabel={isPlaying ? "Pause recitation" : "Play recitation"}
                style={({ pressed }) => [
                  styles.iconBtn,
                  { backgroundColor: isPlaying ? C.primary : C.muted, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Ionicons
                  name={isPlaying ? "pause" : isActive && !isRNTPPlaying ? "play" : "play"}
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

            {/* Copy — always visible */}
            <Pressable
              onPress={() => handleCopy(item)}
              accessibilityLabel="Copy ayah text"
              style={({ pressed }) => [
                styles.iconBtn,
                {
                  backgroundColor: copiedFor === item.numberInSurah ? C.secondary : C.muted,
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
                    color: copiedFor === item.numberInSurah ? C.primary : C.mutedForeground,
                    fontFamily: "Inter_500Medium",
                  },
                ]}
              >
                {copiedFor === item.numberInSurah ? "Copied" : "Copy"}
              </Text>
            </Pressable>

            {/* Share as image */}
            {Platform.OS !== "web" && (
              <Pressable
                onPress={() => handleShareAsImage(item)}
                accessibilityLabel="Share ayah as image"
                style={({ pressed }) => [
                  styles.iconBtn,
                  { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Ionicons name="image-outline" size={12} color={C.mutedForeground} />
                <Text style={[styles.iconBtnText, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>
                  Share
                </Text>
              </Pressable>
            )}

            {/* Tafsir — hidden in mushaf mode */}
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

            {/* Note */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setNoteModal({ ayahId: item.numberInSurah, globalId: item.number, draft: state.ayahNotes[item.number] ?? "" });
              }}
              accessibilityLabel={hasNote ? "Edit note" : "Add note"}
              style={({ pressed }) => [
                styles.bookmarkBtn,
                { backgroundColor: hasNote ? "rgba(45,191,127,0.18)" : C.muted, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name={hasNote ? "document-text" : "document-text-outline"} size={14} color={hasNote ? C.primary : C.mutedForeground} />
            </Pressable>

            {/* Bookmark */}
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

  const surahIsPlaying = activeParsed?.surahId === surahId && isRNTPPlaying;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Off-screen card used for image capture — never visible to the user */}
      {sharingAyah && (
        <View style={styles.offScreen} pointerEvents="none">
          <ShareAyahCard
            ref={shareCardRef}
            arabic={sharingAyah.arabic}
            english={sharingAyah.english}
            reference={`${surah?.nameEnglish ?? ""} ${surahId}:${sharingAyah.numberInSurah}`}
          />
        </View>
      )}

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

        {/* Font size */}
        <Pressable
          onPress={cycleFontSize}
          accessibilityLabel={`Arabic font size — ${fontSize}. Tap to cycle.`}
          style={({ pressed }) => [
            styles.toolBtn,
            { backgroundColor: "rgba(255,255,255,0.12)", opacity: pressed ? 0.7 : 1 },
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

        {/* Play Surah — new button */}
        {Platform.OS !== "web" && (
          <Pressable
            onPress={handlePlaySurah}
            accessibilityLabel={surahIsPlaying ? "Pause surah recitation" : "Play full surah"}
            style={({ pressed }) => [
              styles.toolBtn,
              {
                backgroundColor: surahIsPlaying ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.12)",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons
              name={surahIsPlaying ? "pause" : "play"}
              size={16}
              color="#fff"
            />
          </Pressable>
        )}

        {/* Auto (continuous play) — now labelled */}
        {Platform.OS !== "web" && (
          <Pressable
            onPress={toggleContinuousPlay}
            accessibilityRole="switch"
            accessibilityLabel="Auto-advance: when on, tapping Listen continues to the next ayah automatically"
            accessibilityState={{ checked: continuousPlay }}
            style={({ pressed }) => [
              styles.toolBtnTall,
              {
                backgroundColor: continuousPlay ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.12)",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons name="infinite" size={14} color="#fff" />
            <Text style={styles.toolBtnLabel}>Auto</Text>
          </Pressable>
        )}

        {/* Repeat (A-B loop) — cycles Off → ×3 → ×5 → ×10 → ∞ → Off */}
        {Platform.OS !== "web" && (
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              setRepeatIdx((i) => (i + 1) % REPEAT_OPTIONS.length);
            }}
            accessibilityLabel={`Repeat mode: ${REPEAT_OPTIONS[repeatIdx]?.label}. Tap to cycle.`}
            style={({ pressed }) => [
              styles.toolBtnTall,
              {
                backgroundColor: repeatIdx > 0 ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.12)",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons name="repeat" size={13} color="#fff" />
            <Text style={styles.toolBtnLabel}>{REPEAT_OPTIONS[repeatIdx]?.label}</Text>
          </Pressable>
        )}

        {/* Mushaf mode */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            updateSettings({ mushafMode: !mushafMode });
          }}
          accessibilityRole="switch"
          accessibilityLabel="Mushaf mode — hides translation and shows Arabic only"
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
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 120 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={styles.listHeader}>
              {/* No bismillah header for At-Tawbah (9, revealed without it)
                  or Al-Fatihah (1, where the bismillah IS verse 1 — showing
                  the header too would display it twice). */}
              {surahId !== 9 && surahId !== 1 && (
                <View style={[styles.bismillah, { backgroundColor: C.card }]}>
                  <Text style={[styles.bismillahText, { color: C.primary, fontFamily: ARABIC_FONT_REGULAR }]}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </Text>
                </View>
              )}
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

      {/* Verse note modal */}
      <Modal
        visible={noteModal !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setNoteModal(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setNoteModal(null)}>
          <Pressable style={[styles.modalSheet, { backgroundColor: C.card, borderColor: C.border }]} onPress={() => {}}>
            <Text style={[styles.modalTitle, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
              {surah?.nameEnglish} {noteModal?.ayahId ? `· Ayah ${noteModal.ayahId}` : ""}
            </Text>
            <TextInput
              value={noteModal?.draft ?? ""}
              onChangeText={(t) => setNoteModal((m) => m ? { ...m, draft: t } : m)}
              placeholder="Write your reflection…"
              placeholderTextColor={C.mutedForeground}
              multiline
              autoFocus
              style={[styles.noteInput, { color: C.foreground, borderColor: C.border, fontFamily: "Inter_400Regular" }]}
            />
            <View style={styles.modalBtns}>
              {noteModal && state.ayahNotes[noteModal.globalId] && (
                <Pressable
                  onPress={() => { setAyahNote(noteModal.globalId, ""); setNoteModal(null); }}
                  style={[styles.modalBtn, { backgroundColor: C.muted }]}
                >
                  <Text style={[styles.modalBtnText, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>Delete</Text>
                </Pressable>
              )}
              <Pressable
                onPress={() => { if (noteModal) { setAyahNote(noteModal.globalId, noteModal.draft); } setNoteModal(null); }}
                style={[styles.modalBtn, { backgroundColor: C.primary, flex: 1 }]}
              >
                <Text style={[styles.modalBtnText, { color: "#fff", fontFamily: "Inter_600SemiBold" }]}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  offScreen: { position: "absolute", top: -9999, left: -9999 },
  header: { paddingBottom: 16, paddingHorizontal: 16, flexDirection: "row", alignItems: "center" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  toolBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  // Taller variant for the "Auto" button which has icon + text label
  toolBtnTall: {
    width: 38,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
    gap: 1,
  },
  toolBtnLabel: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 8,
    letterSpacing: 0.4,
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
  mushafToggle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    gap: 14,
  },
  modalTitle: { fontSize: 15 },
  noteInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalBtns: { flexDirection: "row", gap: 10 },
  modalBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  modalBtnText: { fontSize: 14 },
});
