import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/constants/colors";
import { a11yButton, a11yDecorative } from "@/components/a11y";

const EFFECTIVE_DATE = "July 7, 2026";

export default function PrivacyPolicyScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          {...a11yButton("Back", "Returns to the previous screen")}
          style={({ pressed }) => [
            styles.backBtn,
            { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="arrow-back" size={20} color={C.foreground} {...a11yDecorative} />
        </Pressable>
        <Text
          maxFontSizeMultiplier={1.6}
          style={[styles.title, { color: C.foreground, fontFamily: "Inter_700Bold" }]}
        >
          Privacy Policy
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <Text
        maxFontSizeMultiplier={1.6}
        style={[styles.effective, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
      >
        Effective {EFFECTIVE_DATE}
      </Text>

      <P C={C}>
        Daily Imaan is built to respect your privacy. We do not require an
        account, do not collect personal information, and do not use any
        third-party advertising or analytics services. This page explains
        exactly what data the app uses and where it goes.
      </P>

      <H C={C}>1. Information stored on your device</H>
      <P C={C}>
        The app stores the following data locally on your device. This is the
        canonical copy of your data. An optional anonymous cloud mirror is
        described in section 2 below — the cloud copy is never created
        unless this app build was configured with cloud-sync credentials.
      </P>
      <Bullet C={C}>Your bookmarks (which ayat you've saved).</Bullet>
      <Bullet C={C}>Your reading progress and streak counter.</Bullet>
      <Bullet C={C}>Your daily intentions / good-deed checkmarks.</Bullet>
      <Bullet C={C}>
        Your settings (dark mode, reciter, prayer calculation method, juristic
        school, daily reminder times).
      </Bullet>
      <Bullet C={C}>
        Cached tafsir text (Ibn Kathir, Abridged) for offline reading.
      </Bullet>
      <Bullet C={C}>
        Cached prayer times for your area, including the rounded coordinates
        used for the calculation.
      </Bullet>

      <H C={C}>2. Optional anonymous cloud sync</H>
      <P C={C}>
        To prevent loss of your streak and bookmarks if you reinstall or
        change phones, the app may mirror the data above to a backend
        service (Supabase). When active, the app silently creates an
        anonymous session on first launch — no email, name, or login is
        ever requested. Your identity is a randomly-generated UUID stored
        securely on your device. The mirrored row is protected by
        row-level security so only your anonymous session can read or
        write it. You can turn this off any time in Settings → Privacy
        &amp; Legal → Cloud backup — turning it off also deletes the
        server copy. If this build was not configured with cloud-sync
        credentials, no data is ever uploaded.
      </P>
      <P C={C}>
        For the full text of this policy, including your rights and how
        to exercise them, visit dailyimaan.com/privacy.
      </P>

      <H C={C}>3. Location</H>
      <P C={C}>
        If you grant location permission, the app uses your current
        coordinates only to calculate accurate prayer times and to point the
        Qibla compass towards Makkah. Coordinates are sent to AlAdhan
        (api.aladhan.com) when fetching prayer times. Coordinates are not
        stored beyond the local cache and are never sold, shared with
        advertisers, or associated with an identity.
      </P>
      <P C={C}>
        You can revoke location access at any time from your device's system
        settings; the app will fall back to a default location or ask you to
        re-enable permission.
      </P>

      <H C={C}>4. Notifications</H>
      <P C={C}>
        Daily reminders and prayer-time alerts are scheduled locally on your
        device using Expo Notifications. The text of each reminder (the ayah
        of the day) is generated on-device from a fixed library bundled with
        the app. We cannot see whether or when a notification fires.
      </P>

      <H C={C}>5. Third-party services</H>
      <P C={C}>
        The app makes outbound network requests to the following services to
        deliver Quranic content. We do not control these third parties; please
        refer to their respective privacy policies for details.
      </P>
      <Bullet C={C}>
        AlAdhan (api.aladhan.com) — receives your coordinates and chosen
        calculation method to return prayer times and Hijri dates.
      </Bullet>
      <Bullet C={C}>
        Quran.com Foundation (api.qurancdn.com) — receives a verse reference
        to return the Saheeh International translation, the Uthmani Arabic
        text, and the Ibn Kathir tafsir.
      </Bullet>
      <Bullet C={C}>
        Alquran.cloud (cdn.alquran.cloud) — receives a surah/ayah/reciter
        reference to return the audio recitation MP3.
      </Bullet>
      <P C={C}>
        None of these services receive any account identifier, device
        identifier, or personal information from us beyond what is required
        for the request itself.
      </P>

      <H C={C}>6. Crash reporting</H>
      <P C={C}>
        If the app crashes, anonymized diagnostic information (the error
        message, stack trace, and approximate app version) may be sent to our
        crash-reporting service (Sentry) to help us fix the bug. This report
        does not include your bookmarks, location, settings, or any
        personally-identifying data. If crash reporting is not configured for
        a given build, no reports are sent.
      </P>

      <H C={C}>7. Children's privacy</H>
      <P C={C}>
        Daily Imaan is suitable for all ages and does not knowingly collect
        information from children. There is no chat, no user-generated
        content, and no advertising.
      </P>

      <H C={C}>8. Your rights</H>
      <P C={C}>
        The canonical copy of your data lives on your device — uninstalling
        the app or clearing its data from system settings erases it. If
        cloud backup (section 2) is on, an anonymous mirror also exists on
        the server; to delete it, turn off Cloud backup in Settings →
        Privacy &amp; Legal before uninstalling. Uninstalling alone does
        not delete a previously synced copy — that copy is what lets your
        streak survive a reinstall.
      </P>

      <H C={C}>9. Changes to this policy</H>
      <P C={C}>
        If we change this policy, we will update the "Effective" date at the
        top and, where the change is material, surface a notice in the app on
        next launch.
      </P>

      <H C={C}>10. Contact</H>
      <P C={C}>
        Questions or concerns: please reach out to the support email listed on
        our App Store / Play Store listing.
      </P>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

function H({ children, C }: { children: React.ReactNode; C: (typeof colors)["light"] }) {
  return (
    <Text
      maxFontSizeMultiplier={1.5}
      style={[styles.heading, { color: C.foreground, fontFamily: "Inter_700Bold" }]}
    >
      {children}
    </Text>
  );
}

function P({ children, C }: { children: React.ReactNode; C: (typeof colors)["light"] }) {
  return (
    <Text
      maxFontSizeMultiplier={1.6}
      style={[styles.paragraph, { color: C.foreground, fontFamily: "Inter_400Regular" }]}
    >
      {children}
    </Text>
  );
}

function Bullet({ children, C }: { children: React.ReactNode; C: (typeof colors)["light"] }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={[styles.bulletDot, { color: C.primary }]}>•</Text>
      <Text
        maxFontSizeMultiplier={1.6}
        style={[styles.bulletText, { color: C.foreground, fontFamily: "Inter_400Regular" }]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 12 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20 },
  effective: { fontSize: 12, fontStyle: "italic", marginBottom: 8 },
  heading: { fontSize: 16, marginTop: 14, marginBottom: 4 },
  paragraph: { fontSize: 14, lineHeight: 22 },
  bulletRow: { flexDirection: "row", gap: 8, paddingLeft: 4 },
  bulletDot: { fontSize: 14, lineHeight: 22, width: 12 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 22 },
});
