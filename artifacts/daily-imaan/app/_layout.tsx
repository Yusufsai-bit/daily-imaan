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
import React, { useEffect } from "react";
import { Appearance, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider, useApp } from "@/context/AppContext";
import { getTodayAyah } from "@/data/featuredAyat";
import {
  requestNotificationPermission,
  scheduleAyatNotifications,
} from "@/hooks/useNotifications";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function AppEffects() {
  const { state, incrementStreak } = useApp();

  // Request notification permission at startup so default reminders can fire
  useEffect(() => {
    if (Platform.OS === "web") return;
    requestNotificationPermission();
  }, []);

  // Handle notification tap or "Read" action
  useEffect(() => {
    if (Platform.OS === "web") return;
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
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
  }, [incrementStreak]);

  // Re-schedule ayat notifications whenever the time list or ayat order changes
  useEffect(() => {
    const { notificationTimes, ayatOrder } = state.settings;
    const todayAyah = getTodayAyah(ayatOrder);
    const body = `"${todayAyah.englishText.slice(0, 120)}${todayAyah.englishText.length > 120 ? "…" : ""}" — ${todayAyah.surahNameEnglish} ${todayAyah.surahId}:${todayAyah.ayahNumber}`;
    scheduleAyatNotifications(notificationTimes, body);
  }, [state.settings.notificationTimes, state.settings.ayatOrder]);

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
