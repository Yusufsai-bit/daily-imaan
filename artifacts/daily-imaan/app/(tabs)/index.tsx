import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  AppState,
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
import { SURAHS } from "@/data/surahsData";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { schedulePrayerNotifications } from "@/hooks/useNotifications";
import colors from "@/constants/colors";

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

  const { state, toggleBookmark, isBookmarked, incrementStreak } = useApp();
  const { nextPrayer, prayerTimes } = usePrayerTimes(state.settings.prayerMethod);

  const [ayah, setAyah] = useState<FeaturedAyah>(() =>
    getTodayAyah(state.settings.ayatOrder)
  );
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    const useND = Platform.OS !== "web";
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: useND }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: useND }),
    ]).start();
    incrementStreak();
  }, [ayah.id]);

  // Schedule prayer-time notifications whenever today's prayer times load/change
  useEffect(() => {
    if (prayerTimes) {
      schedulePrayerNotifications(prayerTimes);
    }
  }, [prayerTimes]);

  // Refresh ayah when app returns to foreground (e.g. after midnight)
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        setAyah(getTodayAyah(state.settings.ayatOrder));
      }
    });
    return () => sub.remove();
  }, [state.settings.ayatOrder]);

  // Write widget payload to shared storage whenever ayah changes
  useEffect(() => {
    if (Platform.OS === "web") return;
    const payload = JSON.stringify({
      arabicText: ayah.arabicText,
      englishText: ayah.englishText.slice(0, 140),
      surahRef: `${ayah.surahNameEnglish} ${ayah.surahId}:${ayah.ayahNumber}`,
    });
    import("@react-native-async-storage/async-storage").then(({ default: AS }) => {
      AS.setItem("@widget_ayat", payload).catch(() => undefined);
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
      const url = `https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/${globalNum}`;
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
  }, [isPlaying, sound, ayah]);

  const handleBookmark = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleBookmark(ayah.id);
  }, [ayah.id, toggleBookmark]);

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
    setShowExplanation(false);
    setAyah(FEATURED_AYAT[randomIndex]!);
  }, [sound, fadeAnim, scaleAnim]);

  const bookmarked = isBookmarked(ayah.id);

  const prayerNames = prayerTimes
    ? Object.entries(prayerTimes).filter(([k]) => k !== "Sunrise")
    : [];

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
        </View>
        <View style={[styles.streakBadge, { backgroundColor: C.secondary }]}>
          <Ionicons name="flame" size={18} color="#E8553E" />
          <Text style={[styles.streakText, { color: C.foreground, fontFamily: "Inter_700Bold" }]}>
            {state.streak.count}
          </Text>
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

          {/* Explanation toggle */}
          <Pressable
            onPress={() => setShowExplanation(!showExplanation)}
            style={[styles.explanationToggle, { backgroundColor: C.secondary }]}
          >
            <Ionicons
              name={showExplanation ? "chevron-up" : "bulb-outline"}
              size={14}
              color={C.primary}
            />
            <Text style={[styles.explanationToggleText, { color: C.primary, fontFamily: "Inter_500Medium" }]}>
              {showExplanation ? "Hide" : "Reflection"}
            </Text>
          </Pressable>

          {showExplanation && (
            <View style={[styles.explanationBox, { backgroundColor: isDark ? "rgba(45,191,127,0.08)" : "rgba(26,107,74,0.06)", borderLeftColor: C.primary }]}>
              <Text style={[styles.explanationText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {ayah.explanation}
              </Text>
            </View>
          )}

          {/* Action row */}
          <View style={styles.actionRow}>
            <Pressable
              onPress={handleAudio}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: isPlaying ? C.primary : C.secondary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              {audioLoading ? (
                <ActivityIndicator size="small" color={isPlaying ? "#fff" : C.primary} />
              ) : (
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={18}
                  color={isPlaying ? "#fff" : C.primary}
                />
              )}
              <Text style={[styles.actionBtnText, { color: isPlaying ? "#fff" : C.primary, fontFamily: "Inter_500Medium" }]}>
                {isPlaying ? "Pause" : "Listen"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleBookmark}
              style={({ pressed }) => [
                styles.actionBtnSmall,
                { backgroundColor: bookmarked ? "#C8933C" : C.secondary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons
                name={bookmarked ? "bookmark" : "bookmark-outline"}
                size={18}
                color={bookmarked ? "#fff" : C.accent}
              />
            </Pressable>

            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [
                styles.actionBtnSmall,
                { backgroundColor: C.secondary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name="share-outline" size={18} color={C.mutedForeground} />
            </Pressable>

            <Pressable
              onPress={handleRefresh}
              style={({ pressed }) => [
                styles.actionBtnSmall,
                { backgroundColor: C.secondary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name="shuffle-outline" size={18} color={C.mutedForeground} />
            </Pressable>
          </View>
        </View>
      </Animated.View>

      {/* Prayer Times Grid */}
      {prayerTimes && (
        <View style={styles.prayerSection}>
          <Text style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
            TODAY'S PRAYERS
          </Text>
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
  streakBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  streakText: { fontSize: 16 },
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
  explanationToggle: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  explanationToggleText: { fontSize: 13 },
  explanationBox: { borderLeftWidth: 3, paddingLeft: 12, paddingVertical: 8, borderRadius: 4 },
  explanationText: { fontSize: 14, lineHeight: 22, fontStyle: "italic" },
  actionRow: { flexDirection: "row", gap: 8, alignItems: "center", marginTop: 4 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderRadius: 10 },
  actionBtnText: { fontSize: 14 },
  actionBtnSmall: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 10 },
  prayerSection: { gap: 10 },
  prayerGrid: {
    borderRadius: 14, overflow: "hidden",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  prayerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13 },
  prayerName: { flex: 1, fontSize: 15 },
  prayerTime: { fontSize: 15 },
  nextBadge: { marginLeft: 8, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  nextBadgeText: { color: "#fff", fontSize: 11 },
});
