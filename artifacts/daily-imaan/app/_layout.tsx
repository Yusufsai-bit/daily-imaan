import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import * as Notifications from "expo-notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useRef } from "react";
import { AppState, Appearance, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider, useApp } from "@/context/AppContext";
import { getTodayAyah } from "@/data/featuredAyat";
import { SURAHS } from "@/data/surahsData";
import {
  requestNotificationPermission,
  scheduleAyatNotifications,
} from "@/hooks/useNotifications";

function getGlobalId(surahId: number, ayahNumber: number): number {
  const surah = SURAHS.find((s) => s.id === surahId);
  return (surah?.startingAyah ?? 1) + ayahNumber - 1;
}

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function AppEffects() {
  const { state, loaded, incrementStreak, markAyahRead } = useApp();

  // Request notification permission at startup so default reminders can fire
  useEffect(() => {
    if (Platform.OS === "web") return;
    requestNotificationPermission();
  }, []);

  // Handle notification tap or "Read" action.
  // Guarded by `loaded` so streak/read-count mutations only run against
  // fully-restored state and never race with the AsyncStorage hydration.
  useEffect(() => {
    if (Platform.OS === "web") return;
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      if (!loaded) return;
      const data = response.notification.request.content.data as { ayahId?: number } | null;
      if (data?.ayahId) {
        markAyahRead(data.ayahId);
      }
      incrementStreak();
      const action = response.actionIdentifier;
      if (
        action === "read" ||
        action === Notifications.DEFAULT_ACTION_IDENTIFIER
      ) {
        router.navigate("/");
      }
    });
    return () => sub.remove();
  }, [loaded, incrementStreak, markAyahRead]);

  // Helper: schedule notifications for today's ayah using the current settings.
  // Extracted so it can be called both on settings change and on foreground resume.
  const rescheduleAyatNotifs = useCallback(() => {
    if (Platform.OS === "web") return;
    const { notificationTimes, ayatOrder } = state.settings;
    const todayAyah = getTodayAyah(ayatOrder);
    const surahRef = `${todayAyah.surahNameEnglish} ${todayAyah.surahId}:${todayAyah.ayahNumber}`;
    const ayahId = getGlobalId(todayAyah.surahId, todayAyah.ayahNumber);
    scheduleAyatNotifications(
      notificationTimes,
      todayAyah.arabicText,
      todayAyah.englishText,
      surahRef,
      ayahId
    );
  }, [state.settings]);

  // Re-schedule ayat notifications whenever the time list or ayat order changes.
  // The body includes both Arabic text and an English snippet so the user can
  // read the ayah from the lock screen without opening the app.
  // ayahId is embedded in the notification payload so "Read" taps can persist it.
  useEffect(() => {
    rescheduleAyatNotifs();
  }, [state.settings.notificationTimes, state.settings.ayatOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  // When the app returns to the foreground, reschedule with today's ayah.
  // Without this, a user who doesn't change settings would continue receiving
  // the body text from whenever the notifications were last scheduled
  // (potentially from a previous day).
  const lastRescheduleDateRef = useRef<string>("");
  useEffect(() => {
    if (Platform.OS === "web") return;
    const sub = AppState.addEventListener("change", (nextState) => {
      if (nextState !== "active") return;
      const today = new Date().toISOString().slice(0, 10);
      if (lastRescheduleDateRef.current === today) return;
      lastRescheduleDateRef.current = today;
      rescheduleAyatNotifs();
    });
    return () => sub.remove();
  }, [rescheduleAyatNotifs]);

  // Sync manual dark mode override with the OS Appearance API
  useEffect(() => {
    if (Platform.OS === "web") return;
    Appearance.setColorScheme(state.settings.darkMode ? "dark" : "light");
  }, [state.settings.darkMode]);

  return null;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="surah/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="feeling" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="qibla" options={{ headerShown: false, presentation: "card" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <AppProvider>
                <AppEffects />
                <RootLayoutNav />
              </AppProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
