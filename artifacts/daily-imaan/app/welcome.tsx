import React from "react";
import {
  Pressable,
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
import { ARABIC_FONT_REGULAR } from "@/constants/fonts";
import { getTodayAyah } from "@/data/featuredAyat";
import { a11yButton, a11yLink } from "@/components/a11y";

/**
 * First-launch welcome — intentionally minimal.
 *
 * Lapsed audience tolerates seconds of friction, not scroll-pages of
 * credibility text. This screen surfaces:
 *   - Salām + app name + one-line value prop
 *   - A soft preview of today's ayah (Arabic only, body sized) so the user
 *     leaves with a taste of what they'll get every day
 *   - A single primary CTA ("Begin")
 *   - A small secondary link to /about for users who want sources/legal
 *
 * The full credibility / sources / "what we don't do" content lives at
 * /about, reachable from Settings → About Daily Imaan and from this link.
 */
export default function WelcomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();
  const { setWelcomeSeen, state } = useApp();

  // A taste of the daily content — same picker the home screen uses, so the
  // user sees exactly what they're signing up for. Ordered defaults to
  // sequential which matches AppContext's first-run state.
  const previewAyah = React.useMemo(
    () => getTodayAyah(state.settings.ayatOrder),
    [state.settings.ayatOrder],
  );

  const handleBegin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setWelcomeSeen();
    router.replace("/");
  };

  const handleAbout = () => {
    Haptics.selectionAsync();
    router.push("/about" as never);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: C.background,
          paddingTop: insets.top + 48,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={styles.body}>
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
          Daily Imaan
        </Text>
        <Text
          maxFontSizeMultiplier={1.4}
          style={[styles.tagline, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
        >
          Your daily ayah, hadith, and du'a — no ads, no accounts.
        </Text>

        {/* Soft preview card — gives the user a taste before the Begin tap.
            Intentionally Arabic-led with English underneath; matches the
            visual rhythm of the home screen's Ayat of the Day card so the
            transition into the app feels familiar, not jarring. */}
        <View style={[styles.previewCard, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#1A6B4A" }]}>
          <Text
            maxFontSizeMultiplier={1.3}
            style={[styles.previewLabel, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}
          >
            TODAY
          </Text>
          <Text style={[styles.previewArabic, { color: C.foreground }]}>{previewAyah.arabicText}</Text>
          <Text
            maxFontSizeMultiplier={1.6}
            style={[styles.previewEnglish, { color: C.foreground, fontFamily: "Inter_400Regular" }]}
          >
            "{previewAyah.englishText}"
          </Text>
          <Text
            maxFontSizeMultiplier={1.4}
            style={[styles.previewCite, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
          >
            {previewAyah.surahNameEnglish} {previewAyah.surahId}:{previewAyah.ayahNumber} · Saheeh International
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
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
        <Pressable
          onPress={handleAbout}
          {...a11yLink("About & sources", "Opens the about screen with attribution and privacy details")}
          hitSlop={8}
          style={({ pressed }) => [styles.aboutLinkWrap, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text
            maxFontSizeMultiplier={1.4}
            style={[styles.aboutLink, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}
          >
            About & sources
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  body: { flex: 1, justifyContent: "center" },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.4,
    textAlign: "center",
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    textAlign: "center",
    marginTop: 8,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 28,
  },
  previewCard: {
    borderRadius: 16,
    padding: 18,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  previewLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
  },
  previewArabic: {
    fontSize: 22,
    lineHeight: 42,
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: ARABIC_FONT_REGULAR,
  },
  previewEnglish: { fontSize: 14, lineHeight: 22 },
  previewCite: { fontSize: 11, letterSpacing: 0.2, marginTop: 2 },
  footer: { gap: 12, alignItems: "center" },
  cta: {
    height: 54,
    width: "100%",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { fontSize: 17, letterSpacing: 0.3 },
  aboutLinkWrap: { paddingVertical: 4 },
  aboutLink: { fontSize: 13, letterSpacing: 0.2 },
});
