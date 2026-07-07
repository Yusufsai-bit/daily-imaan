import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { useReduceMotion } from "@/hooks/useReduceMotion";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

/**
 * Great-circle bearing from (lat,lng) to the Kaaba in Mecca.
 * Returns 0–360° measured clockwise from True North.
 */
function calculateQiblaBearing(lat: number, lng: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA_LAT);
  const deltaLng = toRad(KAABA_LNG - lng);

  const y = Math.sin(deltaLng) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLng);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function formatBearing(deg: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const idx = Math.round(deg / 45) % 8;
  return `${Math.round(deg)}° ${directions[idx]}`;
}

export default function QiblaScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  /**
   * True when the most recent heading reading is from `trueHeading`
   * (magnetic + declination) rather than raw `magHeading`. The Qibla
   * bearing is calculated as a true (geographic-north) bearing, so
   * comparing it against a magnetic heading produces a 10–15° error in
   * places with non-zero magnetic declination (e.g. ~12°E in eastern
   * Australia, ~10°W in the UK). When this flag is false we surface a
   * "compass calibration" banner so the user knows the direction is
   * approximate until they calibrate.
   */
  const [headingIsTrue, setHeadingIsTrue] = useState(false);
  /**
   * Compass accuracy band from the OS: 0 = unreliable, 1 = low,
   * 2 = medium, 3 = high. Used to show the calibration banner.
   */
  const [accuracy, setAccuracy] = useState<number>(0);

  const rotation = useRef(new Animated.Value(0)).current;
  const previousAngleRef = useRef(0);
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (Platform.OS === "web") {
      setError("Qibla compass requires a phone with a magnetometer.");
      setLoading(false);
      return;
    }

    // Track unmount so an in-flight subscription created after unmount
    // is still cleaned up (no leak), and so we don't setState on unmounted.
    let cancelled = false;
    let headingSub: Location.LocationSubscription | null = null;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;
        if (status !== "granted") {
          setError("Location permission is needed to point you toward the Kaaba.");
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (cancelled) return;
        const bearing = calculateQiblaBearing(
          loc.coords.latitude,
          loc.coords.longitude
        );
        setQiblaBearing(bearing);

        try {
          const places = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
          if (cancelled) return;
          const place = places[0];
          if (place) {
            setCity(place.city || place.subregion || place.region || null);
            setCountry(place.country || null);
          }
        } catch {
          // best-effort
        }

        const sub = await Location.watchHeadingAsync((h) => {
          // The Qibla bearing is computed as a TRUE (geographic-north)
          // bearing. Comparing it against `magHeading` (raw magnetic
          // north, no declination correction) is mathematically wrong —
          // the result is off by the local magnetic declination, which
          // can be 10°+ in many populated regions (~12°E in Sydney,
          // ~10°W in London). This was the bug behind "qibla shows the
          // wrong direction".
          //
          // Resolution: prefer `trueHeading` whenever the OS provides
          // it (>= 0). Only fall back to `magHeading` when trueHeading
          // is unavailable, AND in that case we mark the reading as
          // approximate so the UI can warn the user.
          //
          // Accuracy band: 0 = unreliable, 1 = low, 2 = medium, 3 = high.
          // We accept any non-negative trueHeading regardless of band
          // (when present, the OS has already done the math). For
          // magHeading we require >= 2 — anything lower means the
          // compass needs calibration.
          const hasTrue = typeof h.trueHeading === "number" && h.trueHeading >= 0;
          if (hasTrue) {
            setHeading(h.trueHeading);
            setHeadingIsTrue(true);
          } else if (h.accuracy >= 2 && typeof h.magHeading === "number" && h.magHeading >= 0) {
            setHeading(h.magHeading);
            setHeadingIsTrue(false);
          }
          // If accuracy is too low to trust either reading, leave
          // `heading` at its previous value rather than flickering to
          // a bad number. The calibration banner will keep showing.
          setAccuracy(h.accuracy ?? 0);
        });

        if (cancelled) {
          // Component unmounted while we were awaiting — release immediately.
          sub.remove();
          return;
        }
        headingSub = sub;
        setLoading(false);
      } catch {
        if (!cancelled) {
          setError("Could not read compass. Please try again outdoors.");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (headingSub) headingSub.remove();
    };
  }, []);

  // Pointer angle = qiblaBearing - heading. Animate smoothly via shortest arc.
  const targetAngle = useMemo(() => {
    if (qiblaBearing === null || heading === null) return 0;
    const diff = qiblaBearing - heading;
    // Normalize to (-180, 180]
    return ((((diff + 180) % 360) + 360) % 360) - 180;
  }, [qiblaBearing, heading]);

  useEffect(() => {
    // Take the shortest rotational path so we never spin the long way around.
    const previous = previousAngleRef.current;
    let delta = targetAngle - previous;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const next = previous + delta;
    previousAngleRef.current = next;

    // Reduce Motion: the needle must still point correctly (it's content,
    // not decoration) — but jump instead of easing through the arc.
    if (reduceMotion) {
      rotation.setValue(next);
      return;
    }
    Animated.timing(rotation, {
      toValue: next,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [targetAngle, rotation, reduceMotion]);

  // Haptic ping when within 5° of Qibla
  const wasAlignedRef = useRef(false);
  useEffect(() => {
    const isAligned = Math.abs(targetAngle) < 5;
    if (isAligned && !wasAlignedRef.current && qiblaBearing !== null && heading !== null) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    wasAlignedRef.current = isAligned;
  }, [targetAngle, qiblaBearing, heading]);

  const aligned = qiblaBearing !== null && heading !== null && Math.abs(targetAngle) < 5;

  const rotateInterp = rotation.interpolate({
    inputRange: [-360, 360],
    outputRange: ["-360deg", "360deg"],
  });

  return (
    <View style={[styles.container, { backgroundColor: C.background, paddingTop: insets.top + 8 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backBtn,
            { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 },
          ]}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={20} color={C.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: C.foreground, fontFamily: "Inter_700Bold" }]}>
          Qibla
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator size="large" color={C.primary} />
        ) : error ? (
          <View style={styles.errorBox}>
            <Ionicons name="information-circle-outline" size={32} color={C.mutedForeground} />
            <Text style={[styles.errorText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              {error}
            </Text>
          </View>
        ) : (
          <>
            {/* Compass */}
            <View style={[styles.compassOuter, { borderColor: C.border, backgroundColor: C.card }]}>
              {/* Cardinal markers (rotate with heading so N always points to actual north) */}
              <Animated.View
                style={[
                  styles.cardinalLayer,
                  {
                    transform: [
                      {
                        rotate: heading !== null
                          ? `${-heading}deg`
                          : "0deg",
                      },
                    ],
                  },
                ]}
              >
                {(["N", "E", "S", "W"] as const).map((label, i) => (
                  <View
                    key={label}
                    style={[
                      styles.cardinal,
                      { transform: [{ rotate: `${i * 90}deg` }] },
                    ]}
                  >
                    <Text
                      style={[
                        styles.cardinalText,
                        {
                          color: label === "N" ? "#E8553E" : C.mutedForeground,
                          fontFamily: "Inter_700Bold",
                          transform: [{ rotate: `${-i * 90}deg` }],
                        },
                      ]}
                    >
                      {label}
                    </Text>
                  </View>
                ))}
              </Animated.View>

              {/* Qibla pointer */}
              <Animated.View
                style={[
                  styles.pointer,
                  { transform: [{ rotate: rotateInterp }] },
                ]}
              >
                <View
                  style={[
                    styles.pointerArrow,
                    { borderBottomColor: aligned ? C.primary : C.accent },
                  ]}
                />
                <View style={[styles.pointerStem, { backgroundColor: aligned ? C.primary : C.accent }]} />
                <View style={styles.kaabaLabelWrap}>
                  <Text style={{ fontSize: 22 }}>🕋</Text>
                </View>
              </Animated.View>

              {/* Center dot */}
              <View style={[styles.centerDot, { backgroundColor: aligned ? C.primary : C.foreground }]} />
            </View>

            {/* Calibration warning. Surfaces when the OS gave us only a
                magnetic heading (not declination-corrected) OR when the
                accuracy band is below "medium". Without this, users in
                regions with high declination (eastern Australia, UK,
                US west coast, etc.) saw the qibla pointing 10–15° off
                and silently. The fix asks them to wave their phone in
                a figure-8 — the standard iOS/Android calibration ritual. */}
            {(!headingIsTrue || accuracy < 2) && qiblaBearing !== null && (
              <View
                style={[
                  styles.calibrateBanner,
                  { backgroundColor: C.secondary, borderColor: C.accent },
                ]}
              >
                <Ionicons name="warning-outline" size={14} color={C.accent} />
                <Text
                  maxFontSizeMultiplier={1.4}
                  style={[
                    styles.calibrateText,
                    { color: C.foreground, fontFamily: "Inter_500Medium" },
                  ]}
                >
                  {!headingIsTrue
                    ? "Direction is approximate — wave your phone in a figure-8 to calibrate."
                    : "Compass calibration low — wave your phone in a figure-8."}
                </Text>
              </View>
            )}

            {/* Status */}
            <View style={styles.statusBlock}>
              {aligned ? (
                <Text style={[styles.alignedText, { color: C.primary, fontFamily: "Inter_700Bold" }]}>
                  Facing the Qibla
                </Text>
              ) : (
                <Text style={[styles.alignText, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>
                  Turn until 🕋 points up
                </Text>
              )}
              {qiblaBearing !== null && (
                <Text style={[styles.bearingText, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
                  Qibla bearing: {formatBearing(qiblaBearing)}
                </Text>
              )}
              {(city || country) && (
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={12} color={C.mutedForeground} />
                  <Text style={[styles.locationText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                    {[city, country].filter(Boolean).join(", ")}
                  </Text>
                </View>
              )}
            </View>

            {/* Honest note */}
            <Text style={[styles.note, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Hold your phone flat. Move it in a figure-8 to calibrate the compass.
              Phone magnetometers can drift — confirm with a known Qibla when possible.
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, letterSpacing: -0.3 },
  body: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, gap: 28 },
  compassOuter: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardinalLayer: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  cardinal: {
    position: "absolute",
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 12,
  },
  cardinalText: { fontSize: 14, letterSpacing: 1 },
  pointer: {
    position: "absolute",
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  pointerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 22,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: 36,
  },
  pointerStem: {
    width: 4,
    height: 88,
    borderRadius: 2,
    marginTop: 0,
  },
  kaabaLabelWrap: {
    position: "absolute",
    top: 8,
  },
  centerDot: { width: 14, height: 14, borderRadius: 7 },
  calibrateBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 8,
  },
  calibrateText: { flex: 1, fontSize: 12, lineHeight: 16 },
  statusBlock: { alignItems: "center", gap: 8 },
  alignedText: { fontSize: 18, letterSpacing: -0.3 },
  alignText: { fontSize: 14 },
  bearingText: { fontSize: 14 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  locationText: { fontSize: 12 },
  note: { fontSize: 11, lineHeight: 17, textAlign: "center", paddingHorizontal: 12 },
  errorBox: { alignItems: "center", gap: 12, paddingHorizontal: 24 },
  errorText: { fontSize: 14, lineHeight: 21, textAlign: "center" },
});
