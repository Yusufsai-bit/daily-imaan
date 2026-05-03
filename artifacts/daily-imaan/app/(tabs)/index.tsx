import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  AppState,
  InteractionManager,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { useApp } from "@/context/AppContext";
import { FEATURED_AYAT, FeaturedAyah, getTodayAyah } from "@/data/featuredAyat";
import { getTodayHadith } from "@/data/hadithData";
import { SURAHS } from "@/data/surahsData";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { schedulePrayerNotifications } from "@/hooks/useNotifications";
import { useTafsir, prewarmTafsir } from "@/hooks/useTafsir";
import colors from "@/constants/colors";
import { a11yButton, a11yDecorative, a11yLink } from "@/components/a11y";

function getGlobalAyahNumber(surahId: number, ayahNumber: number): number {
  const surah = SURAHS.find((s) => s.id === surahId);
  if (!surah) return ayahNumber;
  return surah.startingAyah + ayahNumber - 1;
}

function formatDate(): string {
  const d = new Date();
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export default function HomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const { state, loaded, toggleBookmark, isBookmarked, incrementStreak, markAyahRead } = useApp();
  const { nextPrayer, prayerTimes, location, hijri, source, refresh: refreshPrayerTimes, loading: prayerLoading } =
    usePrayerTimes(state.settings.prayerMethod, state.settings.prayerSchool);

  const [ayah, setAyah] = useState<FeaturedAyah>(() =>
    getTodayAyah(state.settings.ayatOrder)
  );
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [showTafsir, setShowTafsir] = useState(false);
  const tafsir = useTafsir(ayah.surahId, ayah.ayahNumber, showTafsir);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    const useND = Platform.OS !== "web";
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: useND }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: useND }),
    ]).start();
    // Gate streak increment and read-marking on loaded so they never race with
    // AsyncStorage hydration on cold launch.
    if (!loaded) return;
    incrementStreak();
    markAyahRead(getGlobalAyahNumber(ayah.surahId, ayah.ayahNumber));
  }, [ayah.id, loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Schedule prayer-time notifications whenever prayer times OR per-prayer
  // sound settings change. Each prayer fires with sound on/off per the user's
  // choice (Fajr defaults to silent for quiet hours). Deferred via
  // InteractionManager so the cold-start render is not blocked by scheduling
  // ~5 notifications through the native bridge.
  useEffect(() => {
    if (!prayerTimes) return;
    const handle = InteractionManager.runAfterInteractions(() => {
      schedulePrayerNotifications(prayerTimes, state.settings.prayerSoundEnabled);
    });
    return () => handle.cancel();
  }, [prayerTimes, state.settings.prayerSoundEnabled]);

  // Pre-warm the tafsir cache for the currently displayed featured ayah
  // after the first interaction frame settles. When the user later taps
  // "Show tafsir", the result is already in AsyncStorage and renders
  // instantly. Best-effort and silent on failure. Skipped on web where the
  // tafsir UI shows a "Open on Quran.com" CTA instead.
  useEffect(() => {
    if (Platform.OS === "web") return;
    const handle = InteractionManager.runAfterInteractions(() => {
      prewarmTafsir(ayah.surahId, ayah.ayahNumber);
    });
    return () => handle.cancel();
  }, [ayah.surahId, ayah.ayahNumber]);

  // Refresh ayah when app returns to foreground (e.g. after midnight)
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        setAyah(getTodayAyah(state.settings.ayatOrder));
      }
    });
    return () => sub.remove();
  }, [state.settings.ayatOrder]);

  // Sync ayah data to the native widget bridge whenever the displayed ayah changes.
  // On iOS this writes to App Group UserDefaults and calls WidgetCenter.reloadAllTimelines().
  // On Android this writes to SharedPreferences and broadcasts ACTION_APPWIDGET_UPDATE.
  // Falls back silently in Expo Go (native module not present).
  useEffect(() => {
    if (Platform.OS === "web") return;
    const surahRef = `${ayah.surahNameEnglish} ${ayah.surahId}:${ayah.ayahNumber}`;
    const englishShort = ayah.englishText.length > 140
      ? ayah.englishText.slice(0, 137) + "…"
      : ayah.englishText;
    import("@/modules/DailyImaanWidget").then(({ setWidgetData }) => {
      setWidgetData(ayah.arabicText, englishShort, surahRef).catch(() => undefined);
    });
  }, [ayah]);

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const handleAudio = useCallback(async () => {
    if (Platform.OS === "web") {
      Alert.alert("Audio", "Audio playback is available on the mobile app.");
      return;
    }
    try {
      if (isPlaying && sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
        return;
      }
      if (sound) {
        await sound.playAsync();
        setIsPlaying(true);
        return;
      }
      setAudioLoading(true);
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const globalNum = getGlobalAyahNumber(ayah.surahId, ayah.ayahNumber);
      // Use the reciter the user picked in Settings (catalogue lives in
      // constants/reciters.ts). Defaults to Al-Afasy on a fresh install.
      const url = `https://cdn.alquran.cloud/media/audio/ayah/${state.settings.reciter}/${globalNum}`;
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
      setSound(newSound);
      setIsPlaying(true);
    } catch {
      Alert.alert("Audio Error", "Could not load audio. Check your connection.");
    } finally {
      setAudioLoading(false);
    }
  }, [isPlaying, sound, ayah, state.settings.reciter]);

  // IMPORTANT: featuredAyat[].id is a list-local index (1..N over the
  // curated list), NOT a global Quran ayah number. Bookmarks must use the
  // global ayah number so they resolve consistently in Bookmarks and the
  // Surah screen. See data/featuredAyat.ts for the curated entries.
  const globalAyahId = getGlobalAyahNumber(ayah.surahId, ayah.ayahNumber);

  const handleBookmark = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleBookmark(globalAyahId);
  }, [globalAyahId, toggleBookmark]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `${ayah.arabicText}\n\n"${ayah.englishText}"\n— Quran ${ayah.surahNameEnglish} ${ayah.surahId}:${ayah.ayahNumber}\n\nShared via Daily Imaan`,
      });
    } catch {
      // ignore
    }
  }, [ayah]);

  const handleRefresh = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
    const total = FEATURED_AYAT.length;
    const randomIndex = Math.floor(Math.random() * total);
    const useND = Platform.OS !== "web";
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.96);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: useND }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: useND }),
    ]).start();
    setAyah(FEATURED_AYAT[randomIndex]!);
  }, [sound, fadeAnim, scaleAnim]);

  const bookmarked = isBookmarked(globalAyahId);

  const prayerNames = useMemo(
    () =>
      prayerTimes
        ? Object.entries(prayerTimes).filter(([k]) => k !== "Sunrise")
        : [],
    [prayerTimes],
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.appTitle, { color: C.primary, fontFamily: "Inter_700Bold" }]}>
            Daily Imaan
          </Text>
          <Text style={[styles.dateText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            {formatDate()}
          </Text>
          {hijri && (
            <Text style={[styles.hijriText, { color: C.primary, fontFamily: "Inter_500Medium" }]}>
              {hijri.formatted}
            </Text>
          )}
        </View>
        <View style={styles.headerActions}>
          {/* Qibla quick action — small icon button so the most-used tool is
              always one tap away from the home screen. */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/qibla" as never);
            }}
            {...a11yButton("Qibla compass", "Opens the Qibla compass")}
            style={({ pressed }) => [
              styles.qiblaQuick,
              { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="compass-outline" size={18} color={C.primary} {...a11yDecorative} />
          </Pressable>
          <View
            accessible
            accessibilityLabel={`${state.streak.count} days with Allah`}
            style={[styles.streakBadge, { backgroundColor: C.secondary }]}
          >
            <Ionicons name="leaf" size={16} color={C.primary} {...a11yDecorative} />
            <Text
              maxFontSizeMultiplier={1.5}
              style={[styles.streakText, { color: C.foreground, fontFamily: "Inter_700Bold" }]}
            >
              {state.streak.count}
            </Text>
          </View>
        </View>
      </View>

      {/* Next Prayer */}
      {nextPrayer && (
        <View style={[styles.prayerBanner, { backgroundColor: C.primary }]}>
          <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.8)" />
          <Text style={[styles.prayerBannerText, { fontFamily: "Inter_500Medium" }]}>
            Next: {nextPrayer.name} · {nextPrayer.time}
          </Text>
        </View>
      )}

      {/* Continue reading — surfaces only after the user has opened a surah,
          so first-time users aren't shown an empty card. Tracks the last
          surah opened (see context/AppContext.tsx → setLastReadPosition). */}
      {state.lastReadPosition && (
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/surah/${state.lastReadPosition!.surahId}` as never);
          }}
          {...a11yLink(
            `Continue reading ${state.lastReadPosition.surahName}`,
            "Resumes the last surah you opened",
          )}
          style={({ pressed }) => [
            styles.continueCard,
            { backgroundColor: C.card, borderColor: C.border, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <View style={[styles.continueIcon, { backgroundColor: C.secondary }]}>
            <Feather name="book-open" size={18} color={C.primary} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[styles.continueLabel, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              Continue reading
            </Text>
            <Text style={[styles.continueTitle, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
              {state.lastReadPosition.surahName}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.mutedForeground} />
        </Pressable>
      )}

      {/* Section label */}
      <Text style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
        AYAT OF THE DAY
      </Text>

      {/* Ayat Card */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <View style={[styles.ayatCard, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#1A6B4A" }]}>
          {/* Surah badge */}
          <View style={[styles.surahBadge, { backgroundColor: C.secondary }]}>
            <Text style={[styles.surahBadgeText, { color: C.primary, fontFamily: "Inter_600SemiBold" }]}>
              {ayah.surahNameEnglish} · {ayah.surahId}:{ayah.ayahNumber}
            </Text>
          </View>

          {/* Arabic text */}
          <Text style={[styles.arabicText, { color: C.foreground }]}>
            {ayah.arabicText}
          </Text>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: C.border }]} />

          {/* English translation */}
          <Text style={[styles.englishText, { color: C.foreground, fontFamily: "Inter_400Regular" }]}>
            "{ayah.englishText}"
          </Text>
          <Text style={[styles.translationCredit, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Translation: Saheeh International
          </Text>

          {/* Inline tafsir — fetched verbatim from Quran.com (Ibn Kathir Abridged).
              No AI commentary; the words are those of the cited classical scholar. */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowTafsir(!showTafsir);
            }}
            {...a11yButton(
              showTafsir ? "Hide tafsir" : "Show tafsir",
              "Shows or hides the Ibn Kathir tafsir for this ayah",
            )}
            style={[styles.explanationToggle, { backgroundColor: C.secondary }]}
          >
            <Ionicons
              {...a11yDecorative}
              name={showTafsir ? "chevron-up" : "book-outline"}
              size={14}
              color={C.primary}
            />
            <Text
              maxFontSizeMultiplier={1.5}
              style={[styles.explanationToggleText, { color: C.primary, fontFamily: "Inter_500Medium" }]}
            >
              {showTafsir ? "Hide tafsir" : "Show tafsir"}
            </Text>
          </Pressable>

          {showTafsir && (
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
                <View style={{ gap: 8 }}>
                  <Text style={[styles.tafsirErrorText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                    Could not load tafsir. Check your connection or open it on Quran.com.
                  </Text>
                  <Pressable
                    onPress={() => {
                      const url = `https://quran.com/${ayah.surahId}/${ayah.ayahNumber}/tafsirs`;
                      Linking.openURL(url).catch(() => {
                        Alert.alert("Could not open browser", "Please visit quran.com to read tafsir.");
                      });
                    }}
                    style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                  >
                    <Text style={[styles.tafsirSourceText, { color: C.primary, fontFamily: "Inter_500Medium" }]}>
                      Open on Quran.com
                    </Text>
                    <Ionicons name="open-outline" size={12} color={C.primary} />
                  </Pressable>
                </View>
              )}

              {tafsir.text && !tafsir.loading && (
                <>
                  <Text style={[styles.tafsirText, { color: C.foreground, fontFamily: "Inter_400Regular" }]}>
                    {tafsir.text}
                  </Text>
                  <Pressable
                    onPress={() => {
                      const url = `https://quran.com/${ayah.surahId}/${ayah.ayahNumber}/tafsirs`;
                      Linking.openURL(url).catch(() => {
                        Alert.alert("Could not open browser", "Please visit quran.com to read tafsir.");
                      });
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
          )}

          {/* Action row */}
          <View style={styles.actionRow}>
            <Pressable
              onPress={handleAudio}
              {...a11yButton(
                isPlaying ? "Pause recitation" : "Listen to recitation",
              )}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: isPlaying ? C.primary : C.secondary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              {audioLoading ? (
                <ActivityIndicator size="small" color={isPlaying ? "#fff" : C.primary} />
              ) : (
                <Ionicons
                  {...a11yDecorative}
                  name={isPlaying ? "pause" : "play"}
                  size={18}
                  color={isPlaying ? "#fff" : C.primary}
                />
              )}
              <Text
                maxFontSizeMultiplier={1.5}
                style={[styles.actionBtnText, { color: isPlaying ? "#fff" : C.primary, fontFamily: "Inter_500Medium" }]}
              >
                {isPlaying ? "Pause" : "Listen"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleBookmark}
              {...a11yButton(bookmarked ? "Remove bookmark" : "Bookmark this ayah")}
              style={({ pressed }) => [
                styles.actionBtnSmall,
                { backgroundColor: bookmarked ? "#C8933C" : C.secondary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons
                {...a11yDecorative}
                name={bookmarked ? "bookmark" : "bookmark-outline"}
                size={18}
                color={bookmarked ? "#fff" : C.accent}
              />
            </Pressable>

            <Pressable
              onPress={handleShare}
              {...a11yButton("Share this ayah")}
              style={({ pressed }) => [
                styles.actionBtnSmall,
                { backgroundColor: C.secondary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name="share-outline" size={18} color={C.mutedForeground} {...a11yDecorative} />
            </Pressable>

            <Pressable
              onPress={handleRefresh}
              {...a11yButton("Show a different ayah")}
              style={({ pressed }) => [
                styles.actionBtnSmall,
                { backgroundColor: C.secondary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name="shuffle-outline" size={18} color={C.mutedForeground} {...a11yDecorative} />
            </Pressable>
          </View>
        </View>
      </Animated.View>

      {/* Shortcuts — quick entries to the gentle, non-Quran tools.
          Daily Hadith is conditionally rendered per the user's setting
          (settings.dailyHadithEnabled, default true) so users who want a
          Quran-only home screen can hide it from Settings → Daily Hadith. */}
      <View style={styles.shortcutsSection}>
        <Text style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
          SHORTCUTS
        </Text>
        <View style={[styles.shortcutsList, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/feeling" as never);
            }}
            {...a11yLink(
              "I am feeling",
              "Opens a list of feelings to find a verse or dua",
            )}
            style={({ pressed }) => [
              styles.shortcutRow,
              { borderBottomColor: C.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View
              {...a11yDecorative}
              style={[
                styles.shortcutIcon,
                {
                  backgroundColor: isDark
                    ? "rgba(45,191,127,0.15)"
                    : "rgba(26,107,74,0.08)",
                },
              ]}
            >
              <Ionicons name="heart-outline" size={18} color={C.primary} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.shortcutTitle, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
                I am feeling...
              </Text>
              <Text style={[styles.shortcutSub, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                Find a verse or dua for your heart
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.mutedForeground} {...a11yDecorative} />
          </Pressable>

          {state.settings.dailyHadithEnabled && (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/hadith" as never);
              }}
              {...a11yLink(
                "Daily Hadith",
                "Opens today's authentic hadith from sunnah.com",
              )}
              style={({ pressed }) => [
                styles.shortcutRow,
                { borderBottomColor: C.border, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View
                {...a11yDecorative}
                style={[
                  styles.shortcutIcon,
                  {
                    backgroundColor: isDark
                      ? "rgba(200,147,60,0.18)"
                      : "rgba(200,147,60,0.12)",
                  },
                ]}
              >
                <Ionicons name="book-outline" size={18} color="#C8933C" />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[styles.shortcutTitle, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
                  Daily Hadith
                </Text>
                <Text
                  numberOfLines={1}
                  style={[styles.shortcutSub, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
                >
                  {getTodayHadith().collection} · sahih
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={C.mutedForeground} {...a11yDecorative} />
            </Pressable>
          )}

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/qibla" as never);
            }}
            {...a11yLink("Qibla Compass", "Opens the Qibla compass")}
            style={({ pressed }) => [
              styles.shortcutRow,
              styles.shortcutRowLast,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View
              {...a11yDecorative}
              style={[
                styles.shortcutIcon,
                {
                  backgroundColor: isDark
                    ? "rgba(45,191,127,0.15)"
                    : "rgba(26,107,74,0.08)",
                },
              ]}
            >
              <Ionicons name="compass-outline" size={18} color={C.primary} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.shortcutTitle, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
                Qibla Compass
              </Text>
              <Text style={[styles.shortcutSub, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                Point towards Makkah from where you are
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.mutedForeground} {...a11yDecorative} />
          </Pressable>
        </View>
      </View>

      {/* Prayer Times Grid */}
      {prayerTimes && (
        <View style={styles.prayerSection}>
          <View style={styles.prayerHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
                TODAY'S PRAYERS
              </Text>
              {(location?.city || location?.country) && (
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={11} color={C.mutedForeground} />
                  <Text style={[styles.locationText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                    {[location.city, location.country].filter(Boolean).join(", ")}
                  </Text>
                </View>
              )}
            </View>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                refreshPrayerTimes();
              }}
              hitSlop={10}
              disabled={prayerLoading}
              {...a11yButton("Refresh prayer times")}
              style={({ pressed }) => [
                styles.refreshBtn,
                { backgroundColor: C.muted, opacity: pressed || prayerLoading ? 0.5 : 1 },
              ]}
            >
              {prayerLoading ? (
                <ActivityIndicator size="small" color={C.mutedForeground} />
              ) : (
                <Ionicons name="refresh" size={14} color={C.mutedForeground} {...a11yDecorative} />
              )}
            </Pressable>
          </View>
          <View style={[styles.prayerGrid, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
            {prayerNames.map(([name, time], i) => (
              <View
                key={name}
                style={[
                  styles.prayerRow,
                  i < prayerNames.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.border },
                  nextPrayer?.name === name && { backgroundColor: isDark ? "rgba(45,191,127,0.08)" : "rgba(26,107,74,0.05)" },
                ]}
              >
                <Text style={[styles.prayerName, { color: nextPrayer?.name === name ? C.primary : C.foreground, fontFamily: "Inter_500Medium" }]}>
                  {name}
                </Text>
                <Text style={[styles.prayerTime, { color: nextPrayer?.name === name ? C.primary : C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
                  {time}
                </Text>
                {nextPrayer?.name === name && (
                  <View style={[styles.nextBadge, { backgroundColor: C.primary }]}>
                    <Text style={[styles.nextBadgeText, { fontFamily: "Inter_600SemiBold" }]}>Next</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
          <Text style={[styles.prayerSource, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Calculated locally for your location · Source: {source}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  appTitle: { fontSize: 26, letterSpacing: -0.5 },
  dateText: { fontSize: 13, marginTop: 2 },
  hijriText: { fontSize: 12, marginTop: 2, letterSpacing: 0.2 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  qiblaQuick: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  streakBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  streakText: { fontSize: 16 },
  continueCard: {
    flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  continueIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  continueLabel: { fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" },
  continueTitle: { fontSize: 15 },
  prayerBanner: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  prayerBannerText: { color: "#fff", fontSize: 13 },
  sectionLabel: { fontSize: 11, letterSpacing: 1.2, marginBottom: -4 },
  ayatCard: {
    borderRadius: 16, padding: 20, gap: 14,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
  },
  surahBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  surahBadgeText: { fontSize: 12 },
  arabicText: { fontSize: 28, lineHeight: 52, textAlign: "right", writingDirection: "rtl" },
  divider: { height: 1, marginVertical: 2 },
  englishText: { fontSize: 16, lineHeight: 26, color: "#374151" },
  translationCredit: { fontSize: 10, letterSpacing: 0.3, marginTop: -6 },
  explanationToggle: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  explanationToggleText: { fontSize: 13 },
  tafsirBox: { borderLeftWidth: 3, paddingLeft: 12, paddingRight: 4, paddingVertical: 10, borderRadius: 4, gap: 8 },
  tafsirText: { fontSize: 14, lineHeight: 22 },
  tafsirSourceText: { fontSize: 11, letterSpacing: 0.2 },
  tafsirLoading: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
  tafsirLoadingText: { fontSize: 13 },
  tafsirErrorText: { fontSize: 13, lineHeight: 20 },
  actionRow: { flexDirection: "row", gap: 8, alignItems: "center", marginTop: 4 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderRadius: 10 },
  actionBtnText: { fontSize: 14 },
  actionBtnSmall: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 10 },
  prayerSection: { gap: 10 },
  prayerHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  locationText: { fontSize: 12 },
  refreshBtn: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  prayerGrid: {
    borderRadius: 14, overflow: "hidden",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  prayerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13 },
  prayerName: { flex: 1, fontSize: 15 },
  prayerTime: { fontSize: 15 },
  nextBadge: { marginLeft: 8, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  nextBadgeText: { color: "#fff", fontSize: 11 },
  prayerSource: { fontSize: 11, textAlign: "center", lineHeight: 16, marginTop: 2 },
  shortcutsSection: { gap: 10 },
  shortcutsList: {
    borderRadius: 14, overflow: "hidden",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  shortcutRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 14, paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  shortcutRowLast: { borderBottomWidth: 0 },
  shortcutIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  shortcutTitle: { fontSize: 15 },
  shortcutSub: { fontSize: 12, lineHeight: 16 },
});
