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
import { initSentry, reportRenderError, wrapRoot } from "@/lib/sentry";

initSentry();

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

  // Compute today's ayah fresh on interaction (DAILY-trigger payloads go stale
  // across days). Default tap opens the app; "Mark as Read" is dismiss-only.
  useEffect(() => {
    if (Platform.OS === "web") return;
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      if (!loaded) return;
      const todayAyah = getTodayAyah(state.settings.ayatOrder);
      const ayahId = getGlobalId(todayAyah.surahId, todayAyah.ayahNumber);
      markAyahRead(ayahId);
      incrementStreak();
      if (response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        router.navigate("/");
      }
    });
    return () => sub.remove();
  }, [loaded, incrementStreak, markAyahRead, state.settings.ayatOrder]);

  const rescheduleAyatNotifs = useCallback(() => {
    if (Platform.OS === "web") return;
    scheduleAyatNotifications(state.settings.notificationTimes);
  }, [state.settings.notificationTimes]);

  useEffect(() => {
    rescheduleAyatNotifs();
  }, [state.settings.notificationTimes]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reschedule on foreground in case the user revisits after a long absence.
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
      <Stack.Screen name="bookmarks" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="feeling" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="qibla" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="privacy" options={{ headerShown: false, presentation: "card" }} />
    </Stack>
  );
}

function RootLayout() {
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
      <ErrorBoundary onError={reportRenderError}>
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

// Wrapped with Sentry for navigation/transaction tracking when DSN is set;
// no-op otherwise.
export default wrapRoot(RootLayout);
