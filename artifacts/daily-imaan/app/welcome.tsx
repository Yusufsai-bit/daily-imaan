import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { AboutContent } from "@/components/AboutContent";
import { a11yButton } from "@/components/a11y";

/**
 * First-launch welcome modal. Routed to from app/_layout.tsx whenever
 * `state.welcomeSeen` is false. The "Begin" button persists the flag and
 * replaces the route with home, so the modal never reappears unless the
 * user clears app data.
 */
export default function WelcomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();
  const { setWelcomeSeen } = useApp();

  const handleBegin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setWelcomeSeen();
    router.replace("/");
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text
          maxFontSizeMultiplier={1.4}
          style={[styles.eyebrow, { color: C.primary, fontFamily: "Inter_600SemiBold" }]}
        >
          ASSALĀMU 'ALAYKUM
        </Text>
        <Text
          maxFontSizeMultiplier={1.4}
          style={[styles.title, { color: C.foreground, fontFamily: "Inter_700Bold" }]}
        >
          Welcome to Daily Imaan
        </Text>

        <View style={{ height: 20 }} />
        <AboutContent C={C} />
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: C.background,
            borderTopColor: C.border,
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        <Pressable
          onPress={handleBegin}
          {...a11yButton("Begin", "Closes the welcome screen and opens the app")}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: C.primary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text
            maxFontSizeMultiplier={1.4}
            style={[styles.ctaText, { color: "#fff", fontFamily: "Inter_700Bold" }]}
          >
            Begin
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.4,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: "center",
    marginTop: 8,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  cta: {
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { fontSize: 17, letterSpacing: 0.3 },
});
