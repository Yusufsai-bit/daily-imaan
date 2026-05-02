import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Appearance,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { DimensionValue } from "react-native";

import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { requestNotificationPermission } from "@/hooks/useNotifications";

const PRAYER_METHODS = [
  { id: 2, label: "ISNA (North America)" },
  { id: 1, label: "Muslim World League" },
  { id: 3, label: "Egyptian General Authority" },
  { id: 4, label: "Umm Al-Qura (Makkah)" },
  { id: 5, label: "University of Islamic Sciences" },
];

function SettingRow({
  icon,
  title,
  subtitle,
  right,
  last = false,
  C,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  right: React.ReactNode;
  last?: boolean;
  C: (typeof colors)["light"];
}) {
  return (
    <View
      style={[
        styles.settingRow,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border },
      ]}
    >
      <View style={[styles.settingIcon, { backgroundColor: C.secondary }]}>
        <Ionicons name={icon as never} size={16} color={C.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: C.foreground, fontFamily: "Inter_500Medium" }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.settingSubtitle, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

export default function SettingsScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const { state, updateSettings } = useApp();
  const { settings } = state;

  const [newTime, setNewTime] = useState("");

  const handleDarkModeToggle = useCallback(
    (val: boolean) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      updateSettings({ darkMode: val });
      if (Platform.OS !== "web") {
        Appearance.setColorScheme(val ? "dark" : "light");
      }
    },
    [updateSettings]
  );

  const handleAddTime = useCallback(async () => {
    const trimmed = newTime.trim();
    const valid = /^([01]?\d|2[0-3]):([0-5]\d)$/.test(trimmed);
    if (!valid) {
      Alert.alert("Invalid Time", "Please enter time in HH:MM format (e.g. 07:00)");
      return;
    }
    if (settings.notificationTimes.includes(trimmed)) {
      Alert.alert("Duplicate", "This time is already added.");
      return;
    }

    if (Platform.OS !== "web") {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(
          "Permission Required",
          "Please enable notifications in your device settings to receive daily reminders."
        );
        return;
      }
    }

    updateSettings({ notificationTimes: [...settings.notificationTimes, trimmed].sort() });
    setNewTime("");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [newTime, settings.notificationTimes, updateSettings]);

  const handleRemoveTime = useCallback(
    (time: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      updateSettings({ notificationTimes: settings.notificationTimes.filter((t) => t !== time) });
    },
    [settings.notificationTimes, updateSettings]
  );

  const handleMethodSelect = useCallback(
    (id: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      updateSettings({ prayerMethod: id });
    },
    [updateSettings]
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backBtn,
            { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="arrow-back" size={20} color={C.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: C.foreground, fontFamily: "Inter_700Bold" }]}>
          Settings
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
          APPEARANCE
        </Text>
        <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          <SettingRow
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Override system appearance"
            C={C}
            last
            right={
              <Switch
                value={settings.darkMode}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: C.border, true: C.primary }}
                thumbColor="#fff"
              />
            }
          />
        </View>
      </View>

      {/* Ayat Order */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
          AYAT OF THE DAY
        </Text>
        <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              updateSettings({ ayatOrder: "sequential" });
            }}
            style={({ pressed }) => [
              styles.optionRow,
              { borderBottomColor: C.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: C.foreground, fontFamily: "Inter_500Medium" }]}>
                Sequential
              </Text>
              <Text style={[styles.optionDesc, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                One ayah per day in fixed order
              </Text>
            </View>
            {settings.ayatOrder === "sequential" && (
              <Ionicons name="checkmark-circle" size={22} color={C.primary} />
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              updateSettings({ ayatOrder: "random" });
            }}
            style={({ pressed }) => [styles.optionRow, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: C.foreground, fontFamily: "Inter_500Medium" }]}>
                Random
              </Text>
              <Text style={[styles.optionDesc, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                Different each day (date-seeded, consistent)
              </Text>
            </View>
            {settings.ayatOrder === "random" && (
              <Ionicons name="checkmark-circle" size={22} color={C.primary} />
            )}
          </Pressable>
        </View>
      </View>

      {/* Notification Times */}
      <View style={styles.section}>
        <View style={{ gap: 2, marginBottom: 8 }}>
          <Text style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
            DAILY REMINDERS
          </Text>
          <Text style={[styles.sectionDesc, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Gentle nudges — no guilt, just a moment with Allah
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          {settings.notificationTimes.length === 0 ? (
            <View style={styles.emptyRow}>
              <Text style={[styles.emptyText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                No reminders set
              </Text>
            </View>
          ) : (
            settings.notificationTimes.map((time, i) => (
              <View
                key={time}
                style={[
                  styles.timeRow,
                  i < settings.notificationTimes.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: C.border,
                  },
                ]}
              >
                <Ionicons name="notifications-outline" size={18} color={C.primary} />
                <Text style={[styles.timeText, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
                  {time}
                </Text>
                <Pressable
                  onPress={() => handleRemoveTime(time)}
                  style={({ pressed }) => [
                    styles.removeBtn,
                    { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Ionicons name="close" size={14} color={C.mutedForeground} />
                </Pressable>
              </View>
            ))
          )}

          <View
            style={[
              styles.addTimeRow,
              settings.notificationTimes.length > 0 && {
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: C.border,
              },
            ]}
          >
            <TextInput
              value={newTime}
              onChangeText={setNewTime}
              placeholder="HH:MM (e.g. 07:00)"
              placeholderTextColor={C.mutedForeground}
              style={[
                styles.timeInput,
                { color: C.foreground, backgroundColor: C.muted, fontFamily: "Inter_400Regular" },
              ]}
              keyboardType="numbers-and-punctuation"
              returnKeyType="done"
              onSubmitEditing={handleAddTime}
            />
            <Pressable
              onPress={handleAddTime}
              style={({ pressed }) => [
                styles.addBtn,
                { backgroundColor: C.primary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={[styles.addBtnText, { fontFamily: "Inter_600SemiBold" }]}>Add</Text>
            </Pressable>
          </View>
        </View>
        <Text style={[styles.hint, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          You'll receive the Ayat of the Day at each time with a "Read" button to open the app.
          {Platform.OS !== "web" ? " Requires notification permissions." : ""}
        </Text>
      </View>

      {/* Prayer Method */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
          PRAYER CALCULATION METHOD
        </Text>
        <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          {PRAYER_METHODS.map((method, i) => (
            <Pressable
              key={method.id}
              onPress={() => handleMethodSelect(method.id)}
              style={({ pressed }) => [
                styles.methodRow,
                i < PRAYER_METHODS.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: C.border,
                },
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.methodLabel, { color: C.foreground, fontFamily: "Inter_400Regular" }]}>
                {method.label}
              </Text>
              {settings.prayerMethod === method.id && (
                <Ionicons name="checkmark-circle" size={20} color={C.primary} />
              )}
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.appInfo}>
        <Text style={[styles.appInfoText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          Daily Imaan v1.0.0{"\n"}May Allah accept from all of us. آمين
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 24 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20 },
  section: { gap: 10 },
  sectionLabel: { fontSize: 11, letterSpacing: 1 },
  sectionDesc: { fontSize: 12, lineHeight: 18, marginTop: 2 },
  card: {
    borderRadius: 14, overflow: "hidden",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  settingRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  settingIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  settingContent: { flex: 1 },
  settingTitle: { fontSize: 15 },
  settingSubtitle: { fontSize: 12, marginTop: 1 },
  optionRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionContent: { flex: 1 },
  optionTitle: { fontSize: 15 },
  optionDesc: { fontSize: 12, marginTop: 2 },
  emptyRow: { paddingHorizontal: 16, paddingVertical: 14 },
  emptyText: { fontSize: 14 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 13 },
  timeText: { flex: 1, fontSize: 16 },
  removeBtn: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  addTimeRow: { flexDirection: "row", gap: 10, padding: 12, alignItems: "center" },
  timeInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, fontSize: 15 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  addBtnText: { color: "#fff", fontSize: 14 },
  hint: { fontSize: 12, lineHeight: 18 },
  methodRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13 },
  methodLabel: { flex: 1, fontSize: 15 },
  appInfo: { alignItems: "center", paddingVertical: 10 },
  appInfoText: { fontSize: 13, textAlign: "center", lineHeight: 22 },
});
