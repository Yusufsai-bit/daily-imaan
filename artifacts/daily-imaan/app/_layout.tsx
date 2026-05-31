import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  AmiriQuran_400Regular,
} from "@expo-google-fonts/amiri-quran";
import * as Notifications from "expo-notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Appearance, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider, useApp } from "@/context/AppContext";
import { QuranMiniPlayer } from "@/components/QuranMiniPlayer";
import { PlaybackService } from "../service";
import { setupPlayer } from "@/lib/trackPlayer";
import { getTodayAyah } from "@/data/featuredAyat";
import { SURAHS } from "@/data/surahsData";
import {
  scheduleAyatNotifications,
  scheduleHadithNotification,
  scheduleAdhkarNotifications,
  scheduleWuduNotifications,
} from "@/hooks/useNotifications";
import {
  initSentry,
  reportRenderError,
  setCrashReportsEnabled,
  wrapRoot,
} from "@/lib/sentry";

initSentry();

// Register RNTP background service once at module load. Must happen before
// any setupPlayer() call so the service is ready before audio starts.
if (Platform.OS !== "web") {
  TrackPlayer.registerPlaybackService(() => PlaybackService);
}

function getGlobalId(surahId: number, ayahNumber: number): number {
  const surah = SURAHS.find((s) => s.id === surahId);
  return (surah?.startingAyah ?? 1) + ayahNumber - 1;
}

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function AppEffects() {
  const { state, loaded, recordActivity, markAyahRead } = useApp();

  // Wudu reminder — reschedule whenever enabled/offset/prayer times change.
  // Prayer times aren't available in AppEffects (they live in usePrayerTimes
  // on the home tab), so we store the last known prayer times in AsyncStorage
  // and read them here. This is a best-effort reminder: if no prayer times are
  // cached yet, no wudu notifications are scheduled until the home tab loads.
  useEffect(() => {
    if (Platform.OS === "web") return;
    import("@react-native-async-storage/async-storage").then(({ default: AS }) =>
      AS.getItem("@daily_imaan_prayer_cache").then((raw) => {
        try {
          const cached = raw ? JSON.parse(raw) : null;
          const pt = cached?.prayerTimes ?? null;
          scheduleWuduNotifications(
            state.settings.wuduReminderEnabled,
            state.settings.wuduReminderMinutes,
            pt
          );
        } catch {
          scheduleWuduNotifications(state.settings.wuduReminderEnabled, state.settings.wuduReminderMinutes, null);
        }
      })
    );
  }, [state.settings.wuduReminderEnabled, state.settings.wuduReminderMinutes]);
  const segments = useSegments();

  // Notification permission is requested LAZILY — only when the user actually
  // enables a reminder toggle. The schedule* functions in useNotifications.ts
  // call requestNotificationPermission() themselves before scheduling. This
  // avoids the App Store rejection risk of a permission prompt on first launch.

  // First-launch welcome routing. Once AppContext has hydrated, send the user
  // to the welcome screen if they have not yet seen it. The redirect only
  // fires from the home tab group so a deep-link (e.g. tapping a notification
  // that opens /surah/2/255) is not hijacked into the welcome modal — those
  // routes will surface welcome the next time the user returns to home.
  useEffect(() => {
    if (!loaded) return;
    if (state.welcomeSeen) return;
    // Only auto-redirect from the home tab group or the bare root; never
    // override other top-level routes (welcome, about, privacy, surah, etc.)
    // so a deep-link from a tapped notification isn't hijacked.
    const root = segments[0];
    const onHome = root === undefined || root === "(tabs)";
    if (!onHome) return;
    router.replace("/welcome");
  }, [loaded, state.welcomeSeen, segments]);

  // Deep-link routing on notification tap. Routes to the screen that matches
  // the notification category so tapping a hadith nudge opens /hadith, an
  // adhkar nudge opens /adhkar, etc. Ayah taps also mark the verse as read
  // and record activity for streak purposes.
  useEffect(() => {
    if (Platform.OS === "web") return;
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      if (!loaded) return;
      if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;
      const category = response.notification.request.content.categoryIdentifier;
      if (category === "daily_ayat") {
        const todayAyah = getTodayAyah(state.settings.ayatOrder);
        markAyahRead(getGlobalId(todayAyah.surahId, todayAyah.ayahNumber));
        recordActivity();
        router.navigate("/");
      } else if (category === "daily_hadith") {
        recordActivity();
        router.navigate("/hadith");
      } else if (category === "daily_adhkar") {
        router.navigate("/adhkar");
      } else {
        // prayer_time, wudu_reminder → home
        router.navigate("/");
      }
    });
    return () => sub.remove();
  }, [loaded, recordActivity, markAyahRead, state.settings.ayatOrder]);

  // Daily ayah reminders are gated on the master toggle (default OFF).
  // When the toggle is off we schedule [] which clears any prior pushes.
  // DAILY triggers persist across days on both iOS and Android, so we don't
  // need a foreground-AppState reschedule — the settings effect alone covers
  // every legitimate change. Removing the AppState path also removes a
  // race condition where it could fire concurrently with this effect on
  // cold launch and produce duplicate scheduled notifications.
  useEffect(() => {
    if (Platform.OS === "web") return;
    const times = state.settings.dailyAyahReminderEnabled
      ? state.settings.notificationTimes
      : [];
    scheduleAyatNotifications(times);
  }, [state.settings.dailyAyahReminderEnabled, state.settings.notificationTimes]);

  // Daily hadith reminder — single optional nudge, also default OFF.
  useEffect(() => {
    if (Platform.OS === "web") return;
    scheduleHadithNotification(
      state.settings.dailyHadithReminderEnabled,
      state.settings.hadithReminderTime
    );
  }, [state.settings.dailyHadithReminderEnabled, state.settings.hadithReminderTime]);

  // Morning + evening adhkar reminders — two daily nudges, default OFF.
  useEffect(() => {
    if (Platform.OS === "web") return;
    scheduleAdhkarNotifications(state.settings.adhkarReminderEnabled);
  }, [state.settings.adhkarReminderEnabled]);

  // Sync manual dark mode override with the OS Appearance API
  useEffect(() => {
    if (Platform.OS === "web") return;
    Appearance.setColorScheme(state.settings.darkMode ? "dark" : "light");
  }, [state.settings.darkMode]);

  // Honor the user's crash-reporting opt-out. Sentry is initialized at module
  // load to catch very early crashes; this effect runs as soon as AppContext
  // hydrates so a returning user's "off" preference takes effect immediately.
  useEffect(() => {
    setCrashReportsEnabled(state.settings.crashReportsEnabled);
  }, [state.settings.crashReportsEnabled]);

  return null;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="surah/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="bookmarks" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="feeling" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="qibla" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="hadith" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="privacy" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="adhkar" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="asma" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="about" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="fasting" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="welcome" options={{ headerShown: false, presentation: "fullScreenModal", gestureEnabled: false }} />
    </Stack>
  );
}

function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    // Amiri Quran — Mushaf-style Quranic typeface used everywhere we render
    // Arabic (ayat, ahadith, du'a, dhikr, asma ul husna). It renders the
    // Uthmani waqf signs and Quranic markings in proper Quranic form, which
    // Noto Naskh Arabic flattened into generic naskh shapes. Amiri Quran is
    // a specialised sibling of regular Amiri — its body strokes are tuned
    // for screen reading at ayah sizes, addressing the readability issue
    // that pushed us off plain Amiri previously.
    AmiriQuran_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      setupPlayer();
    }
  }, []);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary onError={reportRenderError}>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <AppProvider>
                <AppEffects />
                <RootLayoutNav />
                {Platform.OS !== "web" && <QuranMiniPlayer />}
              </AppProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

// Wrapped with Sentry for navigation/transaction tracking when DSN is set;
// no-op otherwise.
export default wrapRoot(RootLayout);
