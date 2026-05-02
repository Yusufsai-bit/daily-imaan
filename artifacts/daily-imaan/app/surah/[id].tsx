import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
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
import { SURAHS, getSurahById } from "@/data/surahsData";

interface AyahData {
  number: number;
  numberInSurah: number;
  text: string;
}

interface SurahResponse {
  ayahs: AyahData[];
}

interface ParsedAyah {
  number: number;
  numberInSurah: number;
  arabic: string;
  english: string;
}

function parseResponse(data: SurahResponse[]): ParsedAyah[] {
  const arabic = data[0]?.ayahs ?? [];
  const english = data[1]?.ayahs ?? [];
  return arabic.map((a, i) => ({
    number: a.number,
    numberInSurah: a.numberInSurah,
    arabic: a.text,
    english: english[i]?.text ?? "",
  }));
}

const CACHE_PREFIX = "@surah_cache_";

export default function SurahDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surahId = parseInt(id ?? "1");
  const surah = getSurahById(surahId);

  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const [ayat, setAyat] = useState<ParsedAyah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (!surahId) return;
    fetchSurah();
  }, [surahId]);

  const fetchSurah = useCallback(async () => {
    setLoading(true);
    setError(null);
    const cacheKey = `${CACHE_PREFIX}${surahId}`;
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        setAyat(JSON.parse(cached));
        setLoading(false);
        return;
      }
      const res = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,en.asad`
      );
      const json = await res.json() as { code: number; data: SurahResponse[] };
      if (json.code !== 200 || !json.data) throw new Error("API error");
      const parsed = parseResponse(json.data);
      setAyat(parsed);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(parsed));
    } catch {
      setError("Could not load surah. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [surahId]);

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
          { uri: `https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/${globalNum}` },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setPlayingAyah(null);
          }
        });
      } catch {
        setPlayingAyah(null);
        Alert.alert("Audio Error", "Could not load audio.");
      }
    },
    [playingAyah, surahId]
  );

  const renderAyah = ({ item }: { item: ParsedAyah }) => {
    const isPlaying = playingAyah === item.numberInSurah;
    return (
      <View style={[styles.ayahRow, { borderBottomColor: C.border }]}>
        <View style={[styles.ayahBadge, { backgroundColor: C.secondary }]}>
          <Text style={[styles.ayahNumber, { color: C.primary, fontFamily: "Inter_600SemiBold" }]}>
            {item.numberInSurah}
          </Text>
        </View>

        <View style={styles.ayahContent}>
          <Text style={[styles.arabicAyah, { color: C.foreground }]}>
            {item.arabic}
          </Text>
          <Text style={[styles.englishAyah, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            {item.english}
          </Text>

          {Platform.OS !== "web" && (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                playAyah(item);
              }}
              style={({ pressed }) => [
                styles.playBtn,
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
                  styles.playBtnText,
                  { color: isPlaying ? "#fff" : C.mutedForeground, fontFamily: "Inter_500Medium" },
                ]}
              >
                {isPlaying ? "Pause" : "Listen"}
              </Text>
            </Pressable>
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
      {/* Custom header */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: C.primary }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.surahName, { fontFamily: "Inter_700Bold" }]}>{surah.nameEnglish}</Text>
          <Text style={[styles.surahArabic]}>{surah.name}</Text>
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
            Loading surah...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={48} color={C.mutedForeground} />
          <Text style={[styles.errorText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            {error}
          </Text>
          <Pressable
            onPress={fetchSurah}
            style={[styles.retryBtn, { backgroundColor: C.primary }]}
          >
            <Text style={[styles.retryText, { fontFamily: "Inter_600SemiBold" }]}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={ayat}
          keyExtractor={(item) => String(item.numberInSurah)}
          renderItem={renderAyah}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() =>
            surahId !== 9 ? (
              <View style={[styles.bismillah, { backgroundColor: C.card }]}>
                <Text style={[styles.bismillahText, { color: C.primary }]}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </Text>
              </View>
            ) : null
          }
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
  ayahRow: { flexDirection: "row", gap: 12, paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  ayahBadge: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 6 },
  ayahNumber: { fontSize: 12 },
  ayahContent: { flex: 1, gap: 10 },
  arabicAyah: { fontSize: 22, lineHeight: 42, textAlign: "right", writingDirection: "rtl" },
  englishAyah: { fontSize: 14, lineHeight: 22 },
  playBtn: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  playBtnText: { fontSize: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  loadingText: { fontSize: 15 },
  errorText: { fontSize: 15, textAlign: "center", paddingHorizontal: 32 },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: "#fff", fontSize: 15 },
});
