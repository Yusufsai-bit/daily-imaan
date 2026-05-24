import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  State,
  useActiveTrack,
  usePlaybackState,
} from "react-native-track-player";
import TrackPlayer from "react-native-track-player";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import { parseTrackId } from "@/lib/trackPlayer";

/**
 * Floating mini-player that appears at the bottom of every screen when Quran
 * audio is active. Tapping the title area navigates back to the surah.
 * Play/pause and stop are handled inline; prev/next are on the lock screen.
 */
export function QuranMiniPlayer() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const track = useActiveTrack();
  const { state } = usePlaybackState();
  const slideAnim = useRef(new Animated.Value(100)).current;

  // Sleep timer — auto-pauses after the chosen number of minutes.
  // null = off, otherwise countdown in whole minutes (updated every 30s).
  const [sleepMinutes, setSleepMinutes] = useState<number | null>(null);
  const sleepEndRef = useRef<number | null>(null);
  const sleepTickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSleepTimer = (minutes: number) => {
    if (sleepTickRef.current) clearInterval(sleepTickRef.current);
    const end = Date.now() + minutes * 60 * 1000;
    sleepEndRef.current = end;
    setSleepMinutes(minutes);
    sleepTickRef.current = setInterval(() => {
      const remaining = Math.ceil((end - Date.now()) / 60000);
      if (remaining <= 0) {
        clearInterval(sleepTickRef.current!);
        sleepTickRef.current = null;
        sleepEndRef.current = null;
        setSleepMinutes(null);
        TrackPlayer.pause();
      } else {
        setSleepMinutes(remaining);
      }
    }, 30000);
  };

  const cancelSleepTimer = () => {
    if (sleepTickRef.current) clearInterval(sleepTickRef.current);
    sleepTickRef.current = null;
    sleepEndRef.current = null;
    setSleepMinutes(null);
  };

  const cycleSleepTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (sleepMinutes !== null) { cancelSleepTimer(); return; }
    startSleepTimer(15);
  };

  const isPlaying = state === State.Playing || state === State.Buffering;
  const hasTrack = !!track;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: hasTrack ? 0 : 100,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
    if (!hasTrack) cancelSleepTimer();
  }, [hasTrack, slideAnim]);

  // Cleanup timer on unmount
  useEffect(() => () => { if (sleepTickRef.current) clearInterval(sleepTickRef.current); }, []);

  if (!hasTrack) return null;

  const parsed = parseTrackId(track.id);

  const handlePlayPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isPlaying) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  };

  const handleStop = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    TrackPlayer.reset();
  };

  const handleTitlePress = () => {
    if (parsed) {
      router.push(`/surah/${parsed.surahId}` as never);
    }
  };

  // Tab bar is ~49pt + safe area on most devices. We sit just above it.
  const bottomOffset = insets.bottom + 49;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#1A2E22" : "#fff",
          borderColor: C.border,
          bottom: bottomOffset,
          shadowColor: isDark ? "#000" : "#1A6B4A",
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Progress bar — thin line at top of player */}
      <View style={[styles.progressTrack, { backgroundColor: C.border }]}>
        {isPlaying && (
          <Animated.View
            style={[styles.progressFill, { backgroundColor: C.primary }]}
          />
        )}
      </View>

      <View style={styles.row}>
        {/* Quran icon */}
        <View style={[styles.iconWrap, { backgroundColor: C.secondary }]}>
          <Ionicons name="book" size={18} color={C.primary} />
        </View>

        {/* Track title — tappable to navigate back to surah */}
        <Pressable style={styles.titleWrap} onPress={handleTitlePress}>
          <Text
            numberOfLines={1}
            style={[styles.title, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}
          >
            {track.title ?? "Quran"}
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.artist, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
          >
            {track.artist ?? ""}
            {parsed ? "" : ""}
          </Text>
        </Pressable>

        {/* Controls */}
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); TrackPlayer.skipToPrevious().catch(() => {}); }}
          hitSlop={8}
          style={styles.ctrlBtn}
          accessibilityLabel="Previous ayah"
        >
          <Ionicons name="play-skip-back" size={20} color={C.mutedForeground} />
        </Pressable>

        <Pressable
          onPress={handlePlayPause}
          hitSlop={8}
          style={[styles.playBtn, { backgroundColor: C.primary }]}
          accessibilityLabel={isPlaying ? "Pause" : "Play"}
        >
          <Ionicons
            name={state === State.Buffering ? "hourglass-outline" : isPlaying ? "pause" : "play"}
            size={18}
            color="#fff"
          />
        </Pressable>

        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); TrackPlayer.skipToNext().catch(() => {}); }}
          hitSlop={8}
          style={styles.ctrlBtn}
          accessibilityLabel="Next ayah"
        >
          <Ionicons name="play-skip-forward" size={20} color={C.mutedForeground} />
        </Pressable>

        {/* Sleep timer — tap to set 15 min, tap again to cancel */}
        <Pressable
          onPress={cycleSleepTimer}
          hitSlop={8}
          style={styles.ctrlBtn}
          accessibilityLabel={sleepMinutes ? `Sleep timer: ${sleepMinutes} min remaining — tap to cancel` : "Set sleep timer (15 min)"}
        >
          {sleepMinutes !== null ? (
            <Text style={[styles.sleepLabel, { color: C.primary, fontFamily: "Inter_600SemiBold" }]}>
              {sleepMinutes}m
            </Text>
          ) : (
            <Ionicons name="moon-outline" size={18} color={C.mutedForeground} />
          )}
        </Pressable>

        <Pressable
          onPress={handleStop}
          hitSlop={8}
          style={styles.ctrlBtn}
          accessibilityLabel="Stop playback"
        >
          <Ionicons name="close" size={20} color={C.mutedForeground} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 12,
    right: 12,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 999,
    overflow: "hidden",
  },
  progressTrack: {
    height: 2,
    width: "100%",
  },
  progressFill: {
    height: "100%",
    width: "30%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    flex: 1,
    gap: 1,
  },
  title: {
    fontSize: 13,
  },
  artist: {
    fontSize: 11,
  },
  ctrlBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sleepLabel: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
});
