import React from "react";
import { StyleSheet, Text, View } from "react-native";

import colors from "@/constants/colors";
import { ARABIC_FONT_REGULAR } from "@/constants/fonts";

type C = typeof colors.light;

interface Props {
  C: C;
}

/**
 * Shared welcome / about copy. Used on the first-launch /welcome modal and
 * the /about screen reachable from Settings → About Daily Imaan. Single
 * source of truth so the wording cannot drift between the two.
 *
 * The source attributions below are factual and verifiable:
 *  - Qur'an translation: Saheeh International (served verbatim by Quran.com).
 *  - Tafsir: Tafsīr Ibn Kathīr (Abridged), the standard Darussalam English
 *    edition, fetched on demand from the Quran.com Foundation API.
 *  - Hadith: Riyāḍ aṣ-Ṣāliḥīn — compiled by Imām Yaḥyā ibn Sharaf
 *    an-Nawawī (d. 676 AH / 1277 CE). English translation by Ḥāfiẓ
 *    Ṣalāhuddīn Yūsuf (Darussalam edition). Bundled in-app from an open
 *    mirror of sunnah.com.
 *  - Adhan audio: two recordings sourced from Wikimedia Commons under
 *    CC BY 3.0 (Makkah, by Seyfula Islam) and CC0 / public-domain
 *    dedication (Madinah, by Adam-synagda). Attribution is required for
 *    the Makkah file and shown in the "Adhan audio" source card below;
 *    the Madinah file requires no attribution but is listed for
 *    transparency. Full license paper trail lives in
 *    `assets/sounds/README.md`.
 */
export function AboutContent({ C }: Props) {
  return (
    <View style={styles.container}>
      <Text
        maxFontSizeMultiplier={1.4}
        style={[styles.bismillah, { color: C.primary, fontFamily: ARABIC_FONT_REGULAR }]}
      >
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </Text>

      <Text
        maxFontSizeMultiplier={1.6}
        style={[styles.body, { color: C.foreground, fontFamily: "Inter_400Regular" }]}
      >
        Daily Imaan is a free app, made to help you stay close to Allah and accountable in your daily worship — your prayers, your Qur'an, and your remembrance.
      </Text>

      <Text
        maxFontSizeMultiplier={1.4}
        style={[styles.sectionTitle, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}
      >
        SOURCES YOU CAN TRUST
      </Text>

      <View style={[styles.sourceCard, { backgroundColor: C.muted }]}>
        <Text maxFontSizeMultiplier={1.6} style={[styles.sourceLabel, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>
          Qur'an translation
        </Text>
        <Text maxFontSizeMultiplier={1.6} style={[styles.sourceValue, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
          Saheeh International
        </Text>
        <Text maxFontSizeMultiplier={1.6} style={[styles.sourceNote, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          Arabic in true Uthmani script, English audited verbatim against the Quran.com Foundation API.
        </Text>
      </View>

      <View style={[styles.sourceCard, { backgroundColor: C.muted }]}>
        <Text maxFontSizeMultiplier={1.6} style={[styles.sourceLabel, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>
          Tafsir
        </Text>
        <Text maxFontSizeMultiplier={1.6} style={[styles.sourceValue, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
          Tafsīr Ibn Kathīr (Abridged)
        </Text>
        <Text maxFontSizeMultiplier={1.6} style={[styles.sourceNote, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          The standard English abridgement, fetched verbatim on demand and cached on your device.
        </Text>
      </View>

      <View style={[styles.sourceCard, { backgroundColor: C.muted }]}>
        <Text maxFontSizeMultiplier={1.6} style={[styles.sourceLabel, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>
          Hadith
        </Text>
        <Text maxFontSizeMultiplier={1.6} style={[styles.sourceValue, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
          Riyāḍ aṣ-Ṣāliḥīn — Imam an-Nawawī
        </Text>
        <Text maxFontSizeMultiplier={1.6} style={[styles.sourceNote, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          English translation by Ḥāfiẓ Ṣalāhuddīn Yūsuf. Each hadith cites its primary source (Bukhārī, Muslim, etc.).
        </Text>
      </View>

      <View style={[styles.sourceCard, { backgroundColor: C.muted }]}>
        <Text maxFontSizeMultiplier={1.6} style={[styles.sourceLabel, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>
          Adhan audio
        </Text>
        <Text maxFontSizeMultiplier={1.6} style={[styles.sourceValue, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
          Wikimedia Commons (CC BY 3.0 / CC0)
        </Text>
        <Text maxFontSizeMultiplier={1.6} style={[styles.sourceNote, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          Adhan (Makkah): "Adhan, Great Mosque of Mecca" by Seyfula Islam, CC BY 3.0. Adhan (Madinah): "Beautiful adhan" by Adam-synagda, released under CC0 (public domain). Both via Wikimedia Commons, trimmed and loudness-normalised for notification use.
        </Text>
      </View>

      <Text
        maxFontSizeMultiplier={1.4}
        style={[styles.sectionTitle, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}
      >
        WHAT WE DON'T DO
      </Text>

      <View style={styles.bullets}>
        <Bullet C={C} text="No ads. Ever." />
        <Bullet C={C} text="No paywall. Every feature is free." />
        <Bullet C={C} text="No accounts. Nothing to sign up for." />
        <Bullet C={C} text="No AI commentary. Only verbatim sources, attributed." />
        <Bullet C={C} text="No tracking. Your data stays on your device." />
      </View>

      <Text
        maxFontSizeMultiplier={1.6}
        style={[styles.closing, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
      >
        May Allah accept it from you, and from us.
      </Text>
    </View>
  );
}

function Bullet({ C, text }: { C: C; text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={[styles.bulletDot, { color: C.primary, fontFamily: "Inter_700Bold" }]}>•</Text>
      <Text
        maxFontSizeMultiplier={1.6}
        style={[styles.bulletText, { color: C.foreground, fontFamily: "Inter_400Regular" }]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  bismillah: {
    fontSize: 26,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 4,
    lineHeight: 44,
  },
  body: { fontSize: 16, lineHeight: 25 },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: 1.2,
    marginTop: 12,
    marginBottom: 4,
  },
  sourceCard: { borderRadius: 14, padding: 14, gap: 4 },
  sourceLabel: { fontSize: 11, letterSpacing: 0.6, textTransform: "uppercase" },
  sourceValue: { fontSize: 16, lineHeight: 22 },
  sourceNote: { fontSize: 13, lineHeight: 19, marginTop: 2 },
  bullets: { gap: 8 },
  bulletRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  bulletDot: { fontSize: 18, lineHeight: 22 },
  bulletText: { flex: 1, fontSize: 15, lineHeight: 22 },
  closing: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 12,
  },
});
