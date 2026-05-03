import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  AppState,
  InteractionManager,
  Modal,
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
import { DAILY_HADITH, DailyHadith, getTodayHadith } from "@/data/hadithData";
import { SURAHS } from "@/data/surahsData";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { schedulePrayerNotifications } from "@/hooks/useNotifications";
import { useTafsir, prewarmTafsir } from "@/hooks/useTafsir";
import colors from "@/constants/colors";
import { ARABIC_FONT_REGULAR } from "@/constants/fonts";
import { a11yButton, a11yDecorative, a11yLink } from "@/components/a11y";

/**
 * Home screen — graduated from the canvas mockup
 * `artifacts/mockup-sandbox/.../daily-imaan-home/FeatureAndTiles.tsx`.
 *
 * Layout: Header → Prayer + Qibla pill row → Resume Qur'an tile →
 * (Morning|Evening) Adhkar tile → Ayat of the Day card → Hadith of the Day
 * card → "How is your heart today?" feeling hero.
 *
 * Design rules (mirrored from the mockup's header doc-block):
 *  - Adhkar label is time-aware off `nextPrayer.name` (Fajr→Asr = morning,
 *    otherwise evening).
 *  - Resume Qur'an reverts to "Start the Qur'an / Begin with Al-Fatiha"
 *    when there is no last-read position.
 *  - Streak chip displays at least "1 day streak" (never 0).
 *  - Prayer pill: tap refreshes prayer times today (a future schedule
 *    screen would replace this behavior).
 *  - Hadith is deterministic per local calendar date (see getTodayHadith).
 *  - Bookmark icons fill `--accent` only when actually saved.
 *  - The feeling hero gets pb-100 wrapper clearance for the tab bar.
 */

function getGlobalAyahNumber(surahId: number, ayahNumber: number): number {
  const surah = SURAHS.find((s) => s.id === surahId);
  if (!surah) return ayahNumber;
  return surah.startingAyah + ayahNumber - 1;
}

function formatDate(): string {
  const d = new Date();
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

/** "16:42" or "16:42 (EST)" → "4:42 PM". Returns the raw string if unparseable. */
function formatTime12h(raw: string): string {
  if (!raw) return "";
  const head = raw.split(" ")[0] ?? raw;
  const [hStr, mStr] = head.split(":");
  const h = parseInt(hStr ?? "", 10);
  const m = parseInt(mStr ?? "", 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return raw;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = ((h + 11) % 12) + 1;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * Minutes until "HH:MM" today; wraps past midnight if the target has already
 * occurred (so next-day Fajr returns a positive value rather than negative).
 */
function minutesUntil(targetRaw: string): number {
  if (!targetRaw) return 0;
  const head = targetRaw.split(" ")[0] ?? targetRaw;
  const [hStr, mStr] = head.split(":");
  const h = parseInt(hStr ?? "", 10);
  const m = parseInt(mStr ?? "", 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  const now = new Date();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  let diff = Math.round((target.getTime() - now.getTime()) / 60000);
  if (diff < 0) diff += 24 * 60;
  return diff;
}

/** "1h 23m" / "12h 45m" / "8m". */
function formatCountdown(mins: number): string {
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** Morning adhkar window = between Fajr and Asr, i.e. next prayer is Dhuhr or Asr. */
function isMorningAdhkarWindow(nextPrayerName: string | undefined): boolean {
  return nextPrayerName === "Dhuhr" || nextPrayerName === "Asr";
}

export default function HomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const {
    state, loaded,
    toggleBookmark, isBookmarked,
    toggleHadithBookmark, isHadithBookmarked,
    incrementStreak, markAyahRead,
  } = useApp();
  const {
    nextPrayer, prayerTimes, hijri, refresh: refreshPrayerTimes, loading: prayerLoading,
  } = usePrayerTimes(state.settings.prayerMethod, state.settings.prayerSchool);

  const [ayah, setAyah] = useState<FeaturedAyah>(() => getTodayAyah(state.settings.ayatOrder));
  const [hadith, setHadith] = useState<DailyHadith>(() => getTodayHadith());
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [showTafsir, setShowTafsir] = useState(false);
  const tafsir = useTafsir(ayah.surahId, ayah.ayahNumber, showTafsir);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  // Entrance animation + first-mount streak/read bookkeeping. Gated on
  // `loaded` so we never race AsyncStorage hydration on cold launch.
  useEffect(() => {
    const useND = Platform.OS !== "web";
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: useND }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: useND }),
    ]).start();
    if (!loaded) return;
    incrementStreak();
    markAyahRead(getGlobalAyahNumber(ayah.surahId, ayah.ayahNumber));
  }, [ayah.id, loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Schedule prayer-time notifications whenever prayer times or per-prayer
  // sound settings change. Deferred via InteractionManager to avoid blocking
  // the cold-start render with ~5 native bridge calls.
  useEffect(() => {
    if (!prayerTimes) return;
    const handle = InteractionManager.runAfterInteractions(() => {
      schedulePrayerNotifications(prayerTimes, state.settings.prayerSoundEnabled);
    });
    return () => handle.cancel();
  }, [prayerTimes, state.settings.prayerSoundEnabled]);

  // Pre-warm the tafsir cache for the currently displayed ayah after the
  // first interaction frame so the "Show tafsir" tap renders instantly.
  useEffect(() => {
    if (Platform.OS === "web") return;
    const handle = InteractionManager.runAfterInteractions(() => {
      prewarmTafsir(ayah.surahId, ayah.ayahNumber);
    });
    return () => handle.cancel();
  }, [ayah.surahId, ayah.ayahNumber]);

  // Refresh ayah + hadith when app returns to foreground (e.g. across midnight).
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        setAyah(getTodayAyah(state.settings.ayatOrder));
        setHadith(getTodayHadith());
      }
    });
    return () => sub.remove();
  }, [state.settings.ayatOrder]);

  // Sync ayah data to the native widget bridge whenever it changes.
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
      const url = `https://cdn.alquran.cloud/media/audio/ayah/${state.settings.reciter}/${globalNum}`;
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) setIsPlaying(false);
      });
      setSound(newSound);
      setIsPlaying(true);
    } catch {
      Alert.alert("Audio Error", "Could not load audio. Check your connection.");
    } finally {
      setAudioLoading(false);
    }
  }, [isPlaying, sound, ayah, state.settings.reciter]);

  // IMPORTANT: featuredAyat[].id is a list-local index, NOT a global Quran
  // ayah number. Bookmarks must use the global number so they resolve
  // consistently in Bookmarks and the Surah screen.
  const globalAyahId = getGlobalAyahNumber(ayah.surahId, ayah.ayahNumber);

  const handleAyatBookmark = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleBookmark(globalAyahId);
  }, [globalAyahId, toggleBookmark]);

  const handleAyatShare = useCallback(async () => {
    try {
      await Share.share({
        message: `${ayah.arabicText}\n\n"${ayah.englishText}"\n— Quran ${ayah.surahNameEnglish} ${ayah.surahId}:${ayah.ayahNumber}\n\nShared via Daily Imaan`,
      });
    } catch {
      // ignore
    }
  }, [ayah]);

  const handleAyatShuffle = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
    const idx = Math.floor(Math.random() * FEATURED_AYAT.length);
    const useND = Platform.OS !== "web";
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.96);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: useND }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: useND }),
    ]).start();
    setAyah(FEATURED_AYAT[idx]!);
  }, [sound, fadeAnim, scaleAnim]);

  const handleHadithBookmark = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleHadithBookmark(hadith.id);
  }, [hadith.id, toggleHadithBookmark]);

  const handleHadithShare = useCallback(async () => {
    try {
      await Share.share({
        message: `${hadith.arabicText}\n\n${hadith.englishText}\n— ${hadith.collection} #${hadith.reference}\n${hadith.sourceUrl}\n\nShared via Daily Imaan`,
      });
    } catch {
      // ignore
    }
  }, [hadith]);

  const handleHadithShuffle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const idx = Math.floor(Math.random() * DAILY_HADITH.length);
    setHadith(DAILY_HADITH[idx]!);
  }, []);

  const [scheduleVisible, setScheduleVisible] = useState(false);

  const handlePrayerPillPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setScheduleVisible(true);
  }, []);

  const handleSchedulePullToRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    refreshPrayerTimes();
  }, [refreshPrayerTimes]);

  const ayatBookmarked = isBookmarked(globalAyahId);
  const hadithBookmarked = isHadithBookmarked(hadith.id);

  // Resume Qur'an tile values — first-run shows "Start the Qur'an".
  const hasLastRead = !!state.lastReadPosition;
  const resumeTitle = hasLastRead ? "Resume Qur'an" : "Start the Qur'an";
  const resumeSubtitle = hasLastRead
    ? `${state.lastReadPosition!.surahName} ${state.lastReadPosition!.surahId}:${state.lastReadPosition!.ayahNumber}`
    : "Begin with Al-Fatiha";
  const resumeRoute = hasLastRead
    ? `/surah/${state.lastReadPosition!.surahId}`
    : "/surah/1";

  // Adhkar tile values — time-aware label per the mockup design rule.
  const morning = isMorningAdhkarWindow(nextPrayer?.name);
  const adhkarTitle = morning ? "Morning Adhkar" : "Evening Adhkar";
  const adhkarSubtitle = morning
    ? "Sunnah remembrances · best before Asr"
    : "Sunnah remembrances · best after Asr";
  const adhkarIcon = (morning ? "sunny-outline" : "moon-outline") as keyof typeof Ionicons.glyphMap;
  const adhkarRoute = morning ? "/adhkar?period=morning" : "/adhkar?period=evening";

  // Prayer pill content. Falls back to a status hint until prayer times resolve.
  const prayerPillTitle = nextPrayer
    ? `${nextPrayer.name} in ${formatCountdown(minutesUntil(nextPrayer.time))}`
    : prayerLoading
      ? "Loading prayer times…"
      : "Set location for prayers";
  const prayerPillTime = nextPrayer ? formatTime12h(nextPrayer.time) : "";

  // Streak chip never reads "0 day streak" — first-run shows "1".
  const displayStreak = state.streak.count > 0 ? state.streak.count : 1;

  // Hadith credit — strip the Arabic half of bookTitle for a clean English line.
  const hadithBookTitleEn = hadith.bookTitle.split("كتاب")[0]?.trim() ?? "";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header — wordmark in ink, hijri muted, streak chip on the right. */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.appTitle, { color: C.foreground, fontFamily: "Inter_700Bold" }]}>
            Daily Imaan
          </Text>
          <Text style={[styles.dateText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            {formatDate()}
          </Text>
          {hijri && (
            <Text style={[styles.hijriText, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              {hijri.formatted}
            </Text>
          )}
        </View>
        <View
          accessible
          accessibilityLabel={`${displayStreak} day streak`}
          style={[styles.streakBadge, { backgroundColor: C.secondary }]}
        >
          <Ionicons name="leaf" size={14} color={C.primary} {...a11yDecorative} />
          <Text style={[styles.streakText, { color: C.foreground, fontFamily: "Inter_500Medium" }]}>
            {displayStreak} day streak
          </Text>
        </View>
      </View>

      {/* Prayer + Qibla pair — two primary-green pills, prayer takes the
          flex share, Qibla a fixed-width pill on the right. */}
      <View style={styles.pillRow}>
        <Pressable
          onPress={handlePrayerPillPress}
          {...a11yButton(prayerPillTitle, "Refresh prayer times")}
          style={({ pressed }) => [
            styles.prayerPill,
            { backgroundColor: C.primary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.85)" {...a11yDecorative} />
          <Text numberOfLines={1} style={[styles.pillTitle, { fontFamily: "Inter_500Medium" }]}>
            {prayerPillTitle}
          </Text>
          {prayerPillTime ? (
            <Text numberOfLines={1} style={[styles.pillTime, { fontFamily: "Inter_400Regular" }]}>
              · {prayerPillTime}
            </Text>
          ) : null}
        </Pressable>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/qibla" as never);
          }}
          {...a11yLink("Qibla compass", "Opens the Qibla compass")}
          style={({ pressed }) => [
            styles.qiblaPill,
            { backgroundColor: C.primary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Ionicons name="compass-outline" size={16} color="rgba(255,255,255,0.85)" {...a11yDecorative} />
          <Text style={[styles.pillTitle, { fontFamily: "Inter_500Medium" }]}>Qibla</Text>
        </Pressable>
      </View>

      {/* Resume Qur'an tile (first-run: "Start the Qur'an" / Begin with Al-Fatiha). */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push(resumeRoute as never);
        }}
        {...a11yLink(resumeTitle, resumeSubtitle)}
        style={({ pressed }) => [
          styles.tile,
          { backgroundColor: C.card, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <View style={[styles.tileIcon, { backgroundColor: C.secondary }]}>
          <Feather name="book-open" size={16} color={C.primary} {...a11yDecorative} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text numberOfLines={1} style={[styles.tileTitle, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
            {resumeTitle}
          </Text>
          <Text numberOfLines={1} style={[styles.tileSub, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            {resumeSubtitle}
          </Text>
        </View>
      </Pressable>

      {/* Adhkar tile — time-aware label, routes to the dhikr counter for now.
          A dedicated Morning/Evening adhkar list (Hisn al-Muslim) is a
          future addition; the routing target will swap when it ships. */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push(adhkarRoute as never);
        }}
        {...a11yLink(adhkarTitle, adhkarSubtitle)}
        style={({ pressed }) => [
          styles.tile,
          { backgroundColor: C.card, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <View style={[styles.tileIcon, { backgroundColor: C.secondary }]}>
          <Ionicons name={adhkarIcon} size={16} color={C.primary} {...a11yDecorative} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text numberOfLines={1} style={[styles.tileTitle, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
            {adhkarTitle}
          </Text>
          <Text numberOfLines={1} style={[styles.tileSub, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            {adhkarSubtitle}
          </Text>
        </View>
      </Pressable>

      {/* AYAT OF THE DAY */}
      <Text style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
        AYAT OF THE DAY
      </Text>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <View style={[styles.contentCard, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#1A6B4A" }]}>
          <View style={[styles.surahBadge, { backgroundColor: C.secondary }]}>
            <Text style={[styles.surahBadgeText, { color: C.primary, fontFamily: "Inter_600SemiBold" }]}>
              {ayah.surahNameEnglish} · {ayah.surahId}:{ayah.ayahNumber}
            </Text>
          </View>
          <Text style={[styles.arabicText, { color: C.foreground }]}>{ayah.arabicText}</Text>
          <View style={[styles.divider, { backgroundColor: C.border }]} />
          <Text style={[styles.englishText, { color: C.foreground, fontFamily: "Inter_400Regular" }]}>
            &ldquo;{ayah.englishText}&rdquo;
          </Text>
          <Text style={[styles.credit, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Translation: Saheeh International
          </Text>

          {/* Action row: Listen primary + bookmark / share / shuffle muted. */}
          <View style={styles.actionRow}>
            <Pressable
              onPress={handleAudio}
              {...a11yButton(isPlaying ? "Pause recitation" : "Listen to recitation")}
              style={({ pressed }) => [
                styles.listenBtn,
                { backgroundColor: C.primary, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              {audioLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name={isPlaying ? "pause" : "play"} size={16} color="#fff" {...a11yDecorative} />
              )}
              <Text style={[styles.listenBtnText, { fontFamily: "Inter_500Medium" }]}>
                {isPlaying ? "Pause" : "Listen"}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleAyatBookmark}
              {...a11yButton(ayatBookmarked ? "Remove bookmark" : "Bookmark this ayah")}
              style={({ pressed }) => [
                styles.iconBtn,
                { backgroundColor: ayatBookmarked ? C.accent : C.secondary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons
                name={ayatBookmarked ? "bookmark" : "bookmark-outline"}
                size={16}
                color={ayatBookmarked ? "#fff" : C.mutedForeground}
                {...a11yDecorative}
              />
            </Pressable>
            <Pressable
              onPress={handleAyatShare}
              {...a11yButton("Share this ayah")}
              style={({ pressed }) => [
                styles.iconBtn,
                { backgroundColor: C.secondary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name="share-outline" size={16} color={C.mutedForeground} {...a11yDecorative} />
            </Pressable>
            <Pressable
              onPress={handleAyatShuffle}
              {...a11yButton("Show a different ayah")}
              style={({ pressed }) => [
                styles.iconBtn,
                { backgroundColor: C.secondary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name="shuffle-outline" size={16} color={C.mutedForeground} {...a11yDecorative} />
            </Pressable>
          </View>

          {/* Show tafsir — small inline toggle; preserves the Ibn Kathir
              tafsir UX inside the card without competing with Listen. */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowTafsir(!showTafsir);
            }}
            {...a11yButton(showTafsir ? "Hide tafsir" : "Show tafsir")}
            style={[styles.tafsirToggle, { backgroundColor: C.secondary }]}
          >
            <Ionicons
              name={showTafsir ? "chevron-up" : "book-outline"}
              size={12}
              color={C.primary}
              {...a11yDecorative}
            />
            <Text style={[styles.tafsirToggleText, { color: C.primary, fontFamily: "Inter_500Medium" }]}>
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

          {/* Bottom CTA — Read in {Surah} */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/surah/${ayah.surahId}` as never);
            }}
            {...a11yLink(`Read in ${ayah.surahNameEnglish}`)}
            style={[styles.cardCta, { borderTopColor: C.border }]}
          >
            <Text style={[styles.cardCtaText, { color: C.primary, fontFamily: "Inter_500Medium" }]}>
              Read in {ayah.surahNameEnglish}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={C.primary} {...a11yDecorative} />
          </Pressable>
        </View>
      </Animated.View>

      {/* HADITH OF THE DAY — same secondary action vocabulary as the Ayat
          card. No Listen button (no audio recitation in the app yet). */}
      {state.settings.dailyHadithEnabled && (
        <>
          <Text style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
            HADITH OF THE DAY
          </Text>
          <View style={[styles.contentCard, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#1A6B4A" }]}>
            <View style={styles.hadithHeaderRow}>
              <View
                style={[
                  styles.hadithBadge,
                  { backgroundColor: isDark ? "rgba(200,147,60,0.18)" : "rgba(200,147,60,0.14)" },
                ]}
              >
                <Text style={[styles.hadithBadgeText, { fontFamily: "Inter_600SemiBold" }]}>
                  {hadith.collection}
                </Text>
              </View>
              <Text style={[styles.hadithRef, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                Hadith {hadith.reference}
              </Text>
            </View>
            <Text style={[styles.arabicText, { color: C.foreground }]}>{hadith.arabicText}</Text>
            <View style={[styles.divider, { backgroundColor: C.border }]} />
            <Text style={[styles.englishText, { color: C.foreground, fontFamily: "Inter_400Regular" }]}>
              &ldquo;{hadith.englishText}&rdquo;
            </Text>
            <Text style={[styles.credit, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              {hadithBookTitleEn ? `From ${hadithBookTitleEn}` : "Riyad as-Salihin"} · sunnah.com
            </Text>
            <View style={styles.hadithActionRow}>
              <Pressable
                onPress={handleHadithBookmark}
                {...a11yButton(hadithBookmarked ? "Remove hadith bookmark" : "Bookmark this hadith")}
                style={({ pressed }) => [
                  styles.iconBtn,
                  { backgroundColor: hadithBookmarked ? C.accent : C.secondary, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Ionicons
                  name={hadithBookmarked ? "bookmark" : "bookmark-outline"}
                  size={16}
                  color={hadithBookmarked ? "#fff" : C.mutedForeground}
                  {...a11yDecorative}
                />
              </Pressable>
              <Pressable
                onPress={handleHadithShare}
                {...a11yButton("Share this hadith")}
                style={({ pressed }) => [
                  styles.iconBtn,
                  { backgroundColor: C.secondary, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Ionicons name="share-outline" size={16} color={C.mutedForeground} {...a11yDecorative} />
              </Pressable>
              <Pressable
                onPress={handleHadithShuffle}
                {...a11yButton("Show a different hadith")}
                style={({ pressed }) => [
                  styles.iconBtn,
                  { backgroundColor: C.secondary, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Ionicons name="shuffle-outline" size={16} color={C.mutedForeground} {...a11yDecorative} />
              </Pressable>
            </View>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/hadith" as never);
              }}
              {...a11yLink("Read full hadith", "Opens the daily hadith collection")}
              style={[styles.cardCta, { borderTopColor: C.border }]}
            >
              <Text style={[styles.cardCtaText, { color: C.primary, fontFamily: "Inter_500Medium" }]}>
                Read full hadith
              </Text>
              <Ionicons name="chevron-forward" size={16} color={C.primary} {...a11yDecorative} />
            </Pressable>
          </View>
        </>
      )}

      {/* Feeling hero — soft horizontal gradient, full-opacity chevron. */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push("/feeling" as never);
        }}
        {...a11yLink("How is your heart today?", "Opens a list of feelings to find a verse or dua")}
        style={({ pressed }) => [styles.feelingWrap, { opacity: pressed ? 0.9 : 1 }]}
      >
        <LinearGradient
          colors={
            isDark
              ? ["rgba(45,191,127,0.12)", "rgba(200,147,60,0.10)"]
              : ["rgba(26,107,74,0.10)", "rgba(200,147,60,0.10)"]
          }
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.feelingHero}
        >
          <View style={[styles.feelingIconWrap, { backgroundColor: C.card }]}>
            <Ionicons name="heart-outline" size={20} color={C.primary} {...a11yDecorative} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.feelingTitle, { color: C.primary, fontFamily: "Inter_600SemiBold" }]}>
              How is your heart today?
            </Text>
            <Text style={[styles.feelingSub, { color: C.foreground, fontFamily: "Inter_400Regular" }]}>
              Find a verse or du&apos;a for what&apos;s on your heart today.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={C.primary} {...a11yDecorative} />
        </LinearGradient>
      </Pressable>
      {/* Prayer schedule sheet — opens when the user taps the prayer pill at
          the top of the home screen. Lists every prayer for today (plus
          sunrise) in chronological order, with the next prayer highlighted.
          Pull from `prayerTimes` so values stay in sync with the user's
          chosen calculation method/school. */}
      <Modal
        visible={scheduleVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setScheduleVisible(false)}
      >
        <Pressable
          onPress={() => setScheduleVisible(false)}
          accessibilityLabel="Close prayer schedule"
          style={styles.scheduleBackdrop}
        >
          <Pressable
            onPress={() => undefined}
            style={[styles.scheduleSheet, { backgroundColor: C.card, paddingBottom: insets.bottom + 16 }]}
          >
            <View style={styles.scheduleHandle}>
              <View style={[styles.scheduleHandleBar, { backgroundColor: C.border }]} />
            </View>
            <View style={styles.scheduleHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.scheduleTitle, { color: C.foreground, fontFamily: "Inter_700Bold" }]}>
                  Today's Prayers
                </Text>
                {hijri ? (
                  <Text style={[styles.scheduleSubtitle, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                    {hijri.day} {hijri.monthEn} {hijri.year} AH
                  </Text>
                ) : null}
              </View>
              <Pressable
                onPress={handleSchedulePullToRefresh}
                {...a11yButton("Refresh prayer times")}
                style={({ pressed }) => [
                  styles.scheduleRefresh,
                  { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Ionicons name="refresh" size={16} color={C.mutedForeground} {...a11yDecorative} />
              </Pressable>
            </View>
            {prayerTimes ? (
              <View style={styles.scheduleList}>
                {(
                  [
                    { name: "Fajr", time: prayerTimes.Fajr, icon: "moon-outline" as const },
                    { name: "Sunrise", time: prayerTimes.Sunrise, icon: "sunny-outline" as const, muted: true },
                    { name: "Dhuhr", time: prayerTimes.Dhuhr, icon: "sunny-outline" as const },
                    { name: "Asr", time: prayerTimes.Asr, icon: "partly-sunny-outline" as const },
                    { name: "Maghrib", time: prayerTimes.Maghrib, icon: "moon-outline" as const },
                    { name: "Isha", time: prayerTimes.Isha, icon: "moon-outline" as const },
                  ] as const
                ).map((row, i, arr) => {
                  const isNext = nextPrayer?.name === row.name;
                  return (
                    <View
                      key={row.name}
                      accessible
                      accessibilityLabel={`${row.name} ${formatTime12h(row.time)}${isNext ? ", next" : ""}`}
                      style={[
                        styles.scheduleRow,
                        i < arr.length - 1 && {
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          borderBottomColor: C.border,
                        },
                        isNext && { backgroundColor: C.secondary },
                      ]}
                    >
                      <Ionicons
                        name={row.icon}
                        size={18}
                        color={isNext ? C.primary : "muted" in row && row.muted ? C.mutedForeground : C.foreground}
                        {...a11yDecorative}
                      />
                      <Text
                        style={[
                          styles.scheduleName,
                          {
                            color: isNext ? C.primary : "muted" in row && row.muted ? C.mutedForeground : C.foreground,
                            fontFamily: isNext ? "Inter_700Bold" : "Inter_500Medium",
                          },
                        ]}
                      >
                        {row.name}
                      </Text>
                      <Text
                        style={[
                          styles.scheduleTime,
                          {
                            color: isNext ? C.primary : "muted" in row && row.muted ? C.mutedForeground : C.foreground,
                            fontFamily: isNext ? "Inter_700Bold" : "Inter_400Regular",
                          },
                        ]}
                      >
                        {formatTime12h(row.time)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.scheduleEmpty}>
                <ActivityIndicator color={C.primary} />
                <Text style={[styles.scheduleEmptyText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                  Loading today's prayer times…
                </Text>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 14 },

  header: {
    flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
  },
  appTitle: { fontSize: 28, letterSpacing: -0.5, lineHeight: 32 },
  dateText: { fontSize: 13, marginTop: 4 },
  hijriText: { fontSize: 12, marginTop: 2, letterSpacing: 0.2 },
  streakBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
    marginTop: 4,
  },
  streakText: { fontSize: 13 },

  pillRow: { flexDirection: "row", gap: 10 },
  prayerPill: {
    flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 14, paddingVertical: 11, borderRadius: 10,
  },
  qiblaPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 11, borderRadius: 10,
  },
  pillTitle: { color: "#fff", fontSize: 13 },
  pillTime: { color: "rgba(255,255,255,0.75)", fontSize: 12, flexShrink: 1 },

  tile: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingVertical: 12, paddingHorizontal: 12, borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  tileIcon: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
  },
  tileTitle: { fontSize: 14 },
  tileSub: { fontSize: 12, lineHeight: 14 },

  sectionLabel: { fontSize: 11, letterSpacing: 1.2, marginBottom: -6, marginTop: 6 },

  contentCard: {
    borderRadius: 16, padding: 18, gap: 12,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
  },
  surahBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  surahBadgeText: { fontSize: 12 },
  arabicText: { fontSize: 26, lineHeight: 50, textAlign: "right", writingDirection: "rtl", fontFamily: ARABIC_FONT_REGULAR },
  scheduleBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  scheduleSheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 8, paddingHorizontal: 16 },
  scheduleHandle: { alignItems: "center", paddingVertical: 6 },
  scheduleHandleBar: { width: 36, height: 4, borderRadius: 2 },
  scheduleHeader: { flexDirection: "row", alignItems: "center", paddingVertical: 8, gap: 12 },
  scheduleTitle: { fontSize: 18, letterSpacing: -0.3 },
  scheduleSubtitle: { fontSize: 12, marginTop: 2 },
  scheduleRefresh: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  scheduleList: { marginTop: 4, borderRadius: 12, overflow: "hidden" },
  scheduleRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 14 },
  scheduleName: { flex: 1, fontSize: 15 },
  scheduleTime: { fontSize: 15 },
  scheduleEmpty: { alignItems: "center", padding: 24, gap: 12 },
  scheduleEmptyText: { fontSize: 13 },
  divider: { height: 1 },
  englishText: { fontSize: 15, lineHeight: 24 },
  credit: { fontSize: 11, letterSpacing: 0.2, marginTop: -4 },

  actionRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  listenBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    paddingVertical: 10, borderRadius: 10,
  },
  listenBtnText: { color: "#fff", fontSize: 14 },
  iconBtn: {
    width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 10,
  },

  tafsirToggle: {
    alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
  },
  tafsirToggleText: { fontSize: 12 },
  tafsirBox: { borderLeftWidth: 3, paddingLeft: 12, paddingRight: 4, paddingVertical: 10, borderRadius: 4, gap: 8 },
  tafsirText: { fontSize: 14, lineHeight: 22 },
  tafsirSourceText: { fontSize: 11, letterSpacing: 0.2 },
  tafsirLoading: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
  tafsirLoadingText: { fontSize: 13 },
  tafsirErrorText: { fontSize: 13, lineHeight: 20 },

  cardCta: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth,
  },
  cardCtaText: { fontSize: 13 },

  hadithHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  hadithBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  hadithBadgeText: { fontSize: 12, color: "#A07418" },
  hadithRef: { fontSize: 11 },
  hadithActionRow: { flexDirection: "row", gap: 8, justifyContent: "flex-end" },

  feelingWrap: { borderRadius: 16, overflow: "hidden", marginTop: 6 },
  feelingHero: {
    flexDirection: "row", alignItems: "center", gap: 14,
    paddingHorizontal: 18, paddingVertical: 18,
  },
  feelingIconWrap: {
    width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center",
  },
  feelingTitle: { fontSize: 18, lineHeight: 22 },
  feelingSub: { fontSize: 13, lineHeight: 18, marginTop: 4 },
});
