import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
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
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import type { DimensionValue } from "react-native";

import colors from "@/constants/colors";
import { RECITERS } from "@/constants/reciters";
import { useApp, type PrayerSoundSettings } from "@/context/AppContext";
import { requestNotificationPermission, sendTestNotification } from "@/hooks/useNotifications";
import {
  a11yButton,
  a11yChecked,
  a11yDecorative,
  a11ySelectable,
  a11yToggle,
} from "@/components/a11y";

// AlAdhan API method IDs. The list intentionally covers the major regional
// authorities so users worldwide can pick the convention their local masjid
// follows. For Australia/NZ, MWL is the most widely used. Adding a country-
// specific Australian method isn't possible — no AlAdhan ID exists for it.
const PRAYER_METHODS = [
  { id: 1, label: "Muslim World League", hint: "Common default — Australia, NZ, UK, Europe, Africa" },
  { id: 2, label: "ISNA (North America)", hint: "USA & Canada" },
  { id: 3, label: "Egyptian General Authority", hint: "Egypt, parts of Africa, Levant" },
  { id: 4, label: "Umm Al-Qura (Makkah)", hint: "Saudi Arabia" },
  { id: 5, label: "University of Islamic Sciences, Karachi", hint: "Pakistan, Bangladesh, India, Afghanistan" },
  { id: 8, label: "Gulf Region", hint: "UAE, Bahrain, Oman" },
  { id: 9, label: "Kuwait", hint: "Kuwait" },
  { id: 10, label: "Qatar", hint: "Qatar" },
  { id: 11, label: "Singapore (MUIS)", hint: "Singapore" },
  { id: 13, label: "Diyanet (Turkey)", hint: "Türkiye" },
  { id: 15, label: "Moonsighting Committee", hint: "Global, Shawwal-corrected" },
  { id: 17, label: "JAKIM (Malaysia)", hint: "Malaysia, parts of SE Asia" },
  { id: 18, label: "Tunisia", hint: "Tunisia" },
  { id: 19, label: "Algeria", hint: "Algeria" },
  { id: 20, label: "KEMENAG (Indonesia)", hint: "Indonesia" },
  { id: 21, label: "Morocco", hint: "Morocco" },
  { id: 22, label: "Portugal (Comunidade Islâmica de Lisboa)", hint: "Portugal" },
  { id: 23, label: "Jordan (Awqaf)", hint: "Jordan" },
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
      <View
        style={[styles.settingIcon, { backgroundColor: C.secondary }]}
        {...a11yDecorative}
      >
        <Ionicons name={icon as never} size={16} color={C.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text
          maxFontSizeMultiplier={1.6}
          style={[styles.settingTitle, { color: C.foreground, fontFamily: "Inter_500Medium" }]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            maxFontSizeMultiplier={1.6}
            style={[styles.settingSubtitle, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
          >
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

  // Web fallback: keep the manual HH:MM input since the native picker
  // does not support web. On native we use DateTimePicker.
  const [newTime, setNewTime] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerValue, setPickerValue] = useState<Date>(() => {
    const d = new Date();
    d.setSeconds(0, 0);
    return d;
  });

  // Independent picker state for the daily hadith reminder time. Kept
  // separate from the ayah-reminder picker above so opening one does not
  // accidentally commit to the other.
  const [hadithPickerVisible, setHadithPickerVisible] = useState(false);
  const [hadithPickerValue, setHadithPickerValue] = useState<Date>(() => {
    const d = new Date();
    const [hStr, mStr] = (settings.hadithReminderTime || "20:00").split(":");
    d.setHours(parseInt(hStr ?? "20", 10), parseInt(mStr ?? "0", 10), 0, 0);
    return d;
  });

  const commitHadithReminderTime = useCallback(
    (date: Date) => {
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      updateSettings({ hadithReminderTime: `${hh}:${mm}` });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    [updateSettings],
  );

  const handleHadithPickerChange = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      // Mirrors the ayah picker behavior — commit immediately on Android,
      // stage on iOS so the spinner doesn't fire on every wheel movement.
      if (Platform.OS === "android") {
        setHadithPickerVisible(false);
        if (event.type !== "set" || !date) return;
        commitHadithReminderTime(date);
        return;
      }
      if (date) setHadithPickerValue(date);
    },
    [commitHadithReminderTime],
  );

  const handleHadithPickerDone = useCallback(() => {
    setHadithPickerVisible(false);
    commitHadithReminderTime(hadithPickerValue);
  }, [commitHadithReminderTime, hadithPickerValue]);

  const handleCrashReportsToggle = useCallback(
    (val: boolean) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      updateSettings({ crashReportsEnabled: val });
    },
    [updateSettings],
  );

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

  // Shared add path used by both native picker and web text input.
  const commitNewTime = useCallback(
    async (time: string) => {
      if (settings.notificationTimes.includes(time)) {
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
      updateSettings({ notificationTimes: [...settings.notificationTimes, time].sort() });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    [settings.notificationTimes, updateSettings]
  );

  const handleAddTimeWeb = useCallback(async () => {
    const trimmed = newTime.trim();
    const valid = /^([01]?\d|2[0-3]):([0-5]\d)$/.test(trimmed);
    if (!valid) {
      Alert.alert("Invalid Time", "Please enter time in HH:MM format (e.g. 07:00)");
      return;
    }
    await commitNewTime(trimmed);
    setNewTime("");
  }, [newTime, commitNewTime]);

  const handlePickerChange = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      // Android: the dialog is modal — it auto-dismisses after any interaction
      // and only fires once with the final value, so commit immediately on "set".
      // iOS: spinner mode fires onChange on every wheel movement; we MUST NOT
      // commit here, otherwise users would silently add multiple reminders just
      // by scrolling. We only update the staged value; commit happens on "Done".
      if (Platform.OS === "android") {
        setPickerVisible(false);
        if (event.type !== "set" || !date) return;
        const hh = String(date.getHours()).padStart(2, "0");
        const mm = String(date.getMinutes()).padStart(2, "0");
        void commitNewTime(`${hh}:${mm}`);
        return;
      }
      // iOS: just stage the value; do not commit.
      if (date) setPickerValue(date);
    },
    [commitNewTime]
  );

  const handleIosPickerDone = useCallback(() => {
    const hh = String(pickerValue.getHours()).padStart(2, "0");
    const mm = String(pickerValue.getMinutes()).padStart(2, "0");
    setPickerVisible(false);
    void commitNewTime(`${hh}:${mm}`);
  }, [pickerValue, commitNewTime]);

  const openPicker = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPickerVisible(true);
  }, []);

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

  const handlePrayerSoundToggle = useCallback(
    (prayer: keyof PrayerSoundSettings, val: boolean) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      updateSettings({
        prayerSoundEnabled: { ...settings.prayerSoundEnabled, [prayer]: val },
      });
    },
    [settings.prayerSoundEnabled, updateSettings]
  );

  const handleReciterSelect = useCallback(
    (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      updateSettings({ reciter: id });
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
          Settings
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text
          maxFontSizeMultiplier={1.4}
          style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}
        >
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
                {...a11yToggle("Dark mode", settings.darkMode, "Overrides the system appearance setting")}
              />
            }
          />
        </View>
      </View>

      {/* Ayat Order */}
      <View style={styles.section}>
        <Text
          maxFontSizeMultiplier={1.4}
          style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}
        >
          AYAT OF THE DAY
        </Text>
        <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              updateSettings({ ayatOrder: "sequential" });
            }}
            {...a11ySelectable(
              "Sequential — one ayah per day in fixed order",
              settings.ayatOrder === "sequential",
            )}
            style={({ pressed }) => [
              styles.optionRow,
              { borderBottomColor: C.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.optionContent}>
              <Text
                maxFontSizeMultiplier={1.6}
                style={[styles.optionTitle, { color: C.foreground, fontFamily: "Inter_500Medium" }]}
              >
                Sequential
              </Text>
              <Text
                maxFontSizeMultiplier={1.6}
                style={[styles.optionDesc, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
              >
                One ayah per day in fixed order
              </Text>
            </View>
            {settings.ayatOrder === "sequential" && (
              <Ionicons name="checkmark-circle" size={22} color={C.primary} {...a11yDecorative} />
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              updateSettings({ ayatOrder: "random" });
            }}
            {...a11ySelectable(
              "Random — different each day, date-seeded",
              settings.ayatOrder === "random",
            )}
            style={({ pressed }) => [styles.optionRow, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={styles.optionContent}>
              <Text
                maxFontSizeMultiplier={1.6}
                style={[styles.optionTitle, { color: C.foreground, fontFamily: "Inter_500Medium" }]}
              >
                Random
              </Text>
              <Text
                maxFontSizeMultiplier={1.6}
                style={[styles.optionDesc, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
              >
                Different each day (date-seeded, consistent)
              </Text>
            </View>
            {settings.ayatOrder === "random" && (
              <Ionicons name="checkmark-circle" size={22} color={C.primary} {...a11yDecorative} />
            )}
          </Pressable>
        </View>
      </View>

      {/* REMINDERS — single grouped section containing all opt-in nudges:
          Daily Hadith reminder, Daily Ayah reminder, Morning/Evening Adhkar
          reminder. Each is a sub-card with its own controls. The hadith
          shortcut on the home screen is permanent and no longer toggleable. */}
      <View style={styles.section}>
        <View style={{ gap: 2, marginBottom: 8 }}>
          <Text
            maxFontSizeMultiplier={1.4}
            style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}
          >
            REMINDERS
          </Text>
          <Text
            maxFontSizeMultiplier={1.6}
            style={[styles.sectionDesc, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
          >
            Gentle nudges — turn on what helps you, leave the rest off
          </Text>
        </View>

        {/* Notification self-test — fires a one-shot in 10 seconds so the
            user can verify system delivery is working. Catches the silent
            fail caused by Android battery-savers, OEM background killers,
            and iOS Focus modes. If it doesn't arrive, "Open system settings"
            link below jumps to the OS notification permissions page. */}
        <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000", marginBottom: 12 }]}>
          <View style={styles.methodRow}>
            <View style={{ flex: 1 }}>
              <Text
                maxFontSizeMultiplier={1.6}
                style={[styles.methodLabel, { color: C.foreground, fontFamily: "Inter_500Medium" }]}
              >
                Test notifications
              </Text>
              <Text
                maxFontSizeMultiplier={1.6}
                style={{ color: C.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 12 }}
              >
                Fires a notification in 10 seconds so you can confirm delivery.
              </Text>
            </View>
            <Pressable
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                const result = await sendTestNotification();
                if (result === "scheduled") {
                  Alert.alert(
                    "Test notification sent",
                    "Lock or background the app. You should see it in 10 seconds. If it doesn't arrive, open your device settings and check Daily Imaan's notification permission.",
                    [
                      { text: "OK", style: "default" },
                      {
                        text: "Open system settings",
                        onPress: () => Linking.openSettings(),
                      },
                    ],
                  );
                } else if (result === "permission_denied") {
                  Alert.alert(
                    "Notifications blocked",
                    "Enable notifications for Daily Imaan in your device settings.",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Open settings", onPress: () => Linking.openSettings() },
                    ],
                  );
                } else {
                  Alert.alert("Could not send", "Try again from a fresh app launch.");
                }
              }}
              {...a11yButton("Send test notification", "Schedules a notification 10 seconds from now")}
              style={({ pressed }) => [
                {
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: C.primary,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={{ color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 13 }}>
                Test
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          <SettingRow
            icon="notifications-outline"
            title="Daily Hadith reminder"
            subtitle={`A gentle nudge once a day at ${settings.hadithReminderTime}`}
            C={C}
            last
            right={
              <Switch
                value={settings.dailyHadithReminderEnabled}
                onValueChange={async (val) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  // Opt-in flow: if the user is enabling and the OS denies
                  // permission, don't flip state — otherwise the UI would
                  // claim reminders are on while nothing is delivered.
                  if (val && Platform.OS !== "web") {
                    const granted = await requestNotificationPermission();
                    if (!granted) {
                      Alert.alert(
                        "Notifications blocked",
                        "Enable notifications for Daily Imaan in your device settings to receive the daily hadith reminder."
                      );
                      return;
                    }
                  }
                  updateSettings({ dailyHadithReminderEnabled: val });
                }}
                trackColor={{ false: C.border, true: C.primary }}
                thumbColor="#fff"
                {...a11yToggle(
                  "Daily Hadith reminder",
                  settings.dailyHadithReminderEnabled,
                  "Sends a once-a-day reminder to read the daily hadith",
                )}
              />
            }
          />
          {/* Reminder time row — only useful (and only legible) when the
              reminder switch above is on. Web stays read-only since the
              native picker is unavailable there. */}
          {settings.dailyHadithReminderEnabled && Platform.OS !== "web" && (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setHadithPickerVisible(true);
              }}
              {...a11yButton(
                `Hadith reminder time, currently ${settings.hadithReminderTime}`,
                "Opens a time picker to change when the daily hadith reminder fires",
              )}
              style={({ pressed }) => [
                styles.settingRow,
                {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: C.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View style={[styles.settingIcon, { backgroundColor: C.secondary }]} {...a11yDecorative}>
                <Ionicons name="time-outline" size={16} color={C.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text
                  maxFontSizeMultiplier={1.6}
                  style={[styles.settingTitle, { color: C.foreground, fontFamily: "Inter_500Medium" }]}
                >
                  Reminder time
                </Text>
                <Text
                  maxFontSizeMultiplier={1.6}
                  style={[styles.settingSubtitle, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
                >
                  Tap to change
                </Text>
              </View>
              <Text
                maxFontSizeMultiplier={1.4}
                style={[styles.timeValue, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}
              >
                {settings.hadithReminderTime}
              </Text>
            </Pressable>
          )}
        </View>

        {hadithPickerVisible && Platform.OS !== "web" && (
          <DateTimePicker
            value={hadithPickerValue}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleHadithPickerChange}
          />
        )}

        {Platform.OS === "ios" && hadithPickerVisible && (
          <View style={styles.iosPickerActions}>
            <Pressable
              onPress={() => setHadithPickerVisible(false)}
              {...a11yButton("Cancel time picker")}
              style={({ pressed }) => [
                styles.iosPickerBtn,
                { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text
                maxFontSizeMultiplier={1.4}
                style={[styles.iosPickerBtnText, { color: C.foreground, fontFamily: "Inter_500Medium" }]}
              >
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleHadithPickerDone}
              {...a11yButton("Save hadith reminder time")}
              style={({ pressed }) => [
                styles.iosPickerBtn,
                { backgroundColor: C.primary, opacity: pressed ? 0.7 : 1, marginLeft: 8 },
              ]}
            >
              <Text
                maxFontSizeMultiplier={1.4}
                style={[styles.iosPickerBtnText, { color: "#fff", fontFamily: "Inter_600SemiBold" }]}
              >
                Done
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Daily Ayah reminders — master toggle gates the times list below.
          Lives under the unified REMINDERS section above. Negative marginTop
          collapses the parent ScrollView gap so all 3 reminder cards visually
          flow as one block. */}
      <View style={[styles.section, { marginTop: -14 }]}>
        <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000", marginBottom: 12 }]}>
          <SettingRow
            icon="notifications-outline"
            title="Daily Ayah reminder"
            subtitle={
              settings.dailyAyahReminderEnabled
                ? "Pick the times for your daily ayah nudges below"
                : "Off — turn on to schedule daily ayah nudges"
            }
            C={C}
            last
            right={
              <Switch
                value={settings.dailyAyahReminderEnabled}
                onValueChange={async (val) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (val && Platform.OS !== "web") {
                    const granted = await requestNotificationPermission();
                    if (!granted) {
                      Alert.alert(
                        "Notifications blocked",
                        "Enable notifications for Daily Imaan in your device settings to receive daily ayah reminders."
                      );
                      return;
                    }
                  }
                  updateSettings({ dailyAyahReminderEnabled: val });
                }}
                trackColor={{ false: C.border, true: C.primary }}
                thumbColor="#fff"
                {...a11yToggle(
                  "Daily Ayah reminder",
                  settings.dailyAyahReminderEnabled,
                  "Master switch for daily ayah notifications",
                )}
              />
            }
          />
        </View>
        {settings.dailyAyahReminderEnabled ? (
          <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          {settings.notificationTimes.length === 0 ? (
            <View style={styles.emptyRow}>
              <Text
                maxFontSizeMultiplier={1.6}
                style={[styles.emptyText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
              >
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
                <Ionicons name="notifications-outline" size={18} color={C.primary} {...a11yDecorative} />
                <Text
                  maxFontSizeMultiplier={1.6}
                  style={[styles.timeText, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}
                >
                  {time}
                </Text>
                <Pressable
                  onPress={() => handleRemoveTime(time)}
                  {...a11yButton(`Remove reminder at ${time}`)}
                  style={({ pressed }) => [
                    styles.removeBtn,
                    { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Ionicons name="close" size={14} color={C.mutedForeground} {...a11yDecorative} />
                </Pressable>
              </View>
            ))
          )}

          {Platform.OS === "web" ? (
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
                onSubmitEditing={handleAddTimeWeb}
                accessibilityLabel="Reminder time in HH:MM format"
              />
              <Pressable
                onPress={handleAddTimeWeb}
                {...a11yButton("Add reminder time")}
                style={({ pressed }) => [
                  styles.addBtn,
                  { backgroundColor: C.primary, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Ionicons name="add" size={18} color="#fff" {...a11yDecorative} />
                <Text
                  maxFontSizeMultiplier={1.4}
                  style={[styles.addBtnText, { fontFamily: "Inter_600SemiBold" }]}
                >
                  Add
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={openPicker}
              {...a11yButton(
                "Add reminder time",
                "Opens a time picker to add a new daily reminder",
              )}
              style={({ pressed }) => [
                styles.addPickerRow,
                settings.notificationTimes.length > 0 && {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: C.border,
                },
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={[styles.addPickerIcon, { backgroundColor: C.primary }]}>
                <Ionicons name="add" size={18} color="#fff" {...a11yDecorative} />
              </View>
              <Text
                maxFontSizeMultiplier={1.4}
                style={[styles.addPickerLabel, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}
              >
                Add Reminder Time
              </Text>
              <Ionicons name="time-outline" size={18} color={C.mutedForeground} {...a11yDecorative} />
            </Pressable>
          )}
          </View>
        ) : null}

        {pickerVisible && Platform.OS !== "web" && (
          <DateTimePicker
            value={pickerValue}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handlePickerChange}
          />
        )}

        {Platform.OS === "ios" && pickerVisible && (
          <View style={styles.iosPickerActions}>
            <Pressable
              onPress={() => setPickerVisible(false)}
              {...a11yButton("Cancel time picker")}
              style={({ pressed }) => [
                styles.iosPickerBtn,
                { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text
                maxFontSizeMultiplier={1.4}
                style={[styles.iosPickerBtnText, { color: C.foreground, fontFamily: "Inter_500Medium" }]}
              >
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleIosPickerDone}
              {...a11yButton("Add reminder at selected time")}
              style={({ pressed }) => [
                styles.iosPickerBtn,
                { backgroundColor: C.primary, opacity: pressed ? 0.7 : 1, marginLeft: 8 },
              ]}
            >
              <Text
                maxFontSizeMultiplier={1.4}
                style={[styles.iosPickerBtnText, { color: "#fff", fontFamily: "Inter_600SemiBold" }]}
              >
                Done
              </Text>
            </Pressable>
          </View>
        )}

      </View>

      {/* Adhkar reminder — single toggle that schedules two daily nudges
          (morning 07:00, evening 17:30). Lives under REMINDERS. Negative
          marginTop collapses the parent ScrollView gap. */}
      <View style={[styles.section, { marginTop: -14 }]}>
        <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          <SettingRow
            icon="leaf-outline"
            title="Morning & Evening Adhkar reminder"
            subtitle={
              settings.adhkarReminderEnabled
                ? "Two daily nudges — 7:00 AM and 5:30 PM"
                : "Off — turn on for morning and evening adhkar reminders"
            }
            C={C}
            last
            right={
              <Switch
                value={settings.adhkarReminderEnabled}
                onValueChange={async (val) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (val && Platform.OS !== "web") {
                    const granted = await requestNotificationPermission();
                    if (!granted) {
                      Alert.alert(
                        "Notifications blocked",
                        "Enable notifications for Daily Imaan in your device settings to receive adhkar reminders."
                      );
                      return;
                    }
                  }
                  updateSettings({ adhkarReminderEnabled: val });
                }}
                trackColor={{ false: C.border, true: C.primary }}
                thumbColor="#fff"
                {...a11yToggle(
                  "Morning and Evening Adhkar reminder",
                  settings.adhkarReminderEnabled,
                  "Schedules a morning nudge at 7am and an evening nudge at 5:30pm",
                )}
              />
            }
          />
        </View>
      </View>

      {/* Prayer Method */}
      <View style={styles.section}>
        <View style={{ gap: 2, marginBottom: 8 }}>
          <Text
            maxFontSizeMultiplier={1.4}
            style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}
          >
            PRAYER CALCULATION METHOD
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          {PRAYER_METHODS.map((method, i) => (
            <Pressable
              key={method.id}
              onPress={() => handleMethodSelect(method.id)}
              {...a11ySelectable(`${method.label}. ${method.hint}`, settings.prayerMethod === method.id)}
              style={({ pressed }) => [
                styles.methodRow,
                i < PRAYER_METHODS.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: C.border,
                },
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={{ flex: 1, gap: 2 }}>
                <Text
                  maxFontSizeMultiplier={1.6}
                  style={[styles.methodLabel, { color: C.foreground, fontFamily: "Inter_500Medium" }]}
                >
                  {method.label}
                </Text>
                <Text
                  maxFontSizeMultiplier={1.6}
                  style={{ color: C.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 12 }}
                >
                  {method.hint}
                </Text>
              </View>
              {settings.prayerMethod === method.id && (
                <Ionicons name="checkmark-circle" size={20} color={C.primary} {...a11yDecorative} />
              )}
            </Pressable>
          ))}
        </View>
      </View>

      {/* Prayer time offsets — manual minutes adjustment per prayer.
          Lets users match their local mosque exactly when calculation
          methods produce a slightly different time. ±15 min cap, step 1.
          Most-requested feature in negative reviews of every prayer app
          (see COMPETITIVE_BRIEF.md). */}
      <View style={styles.section}>
        <View style={{ gap: 2, marginBottom: 8 }}>
          <Text
            maxFontSizeMultiplier={1.4}
            style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}
          >
            ADJUST PRAYER TIMES
          </Text>
          <Text
            maxFontSizeMultiplier={1.6}
            style={[styles.sectionDesc, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
          >
            Nudge any prayer up to 15 minutes earlier or later to match your local mosque.
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          {(["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const).map((prayer, i, arr) => {
            const value = settings.prayerOffsets[prayer];
            const adjust = (delta: number) => {
              const next = Math.max(-15, Math.min(15, value + delta));
              if (next === value) return;
              Haptics.selectionAsync();
              updateSettings({
                prayerOffsets: { ...settings.prayerOffsets, [prayer]: next },
              });
            };
            const display = value === 0 ? "0 min" : value > 0 ? `+${value} min` : `${value} min`;
            return (
              <View
                key={prayer}
                style={[
                  styles.methodRow,
                  i < arr.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: C.border,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    maxFontSizeMultiplier={1.6}
                    style={[styles.methodLabel, { color: C.foreground, fontFamily: "Inter_500Medium" }]}
                  >
                    {prayer}
                  </Text>
                  <Text
                    maxFontSizeMultiplier={1.6}
                    style={{
                      color: value === 0 ? C.mutedForeground : C.primary,
                      fontFamily: "Inter_400Regular",
                      fontSize: 12,
                    }}
                  >
                    {display}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Pressable
                    onPress={() => adjust(-1)}
                    {...a11yButton(`Decrease ${prayer} offset by 1 minute`)}
                    disabled={value <= -15}
                    hitSlop={6}
                    style={({ pressed }) => [
                      styles.offsetBtn,
                      {
                        backgroundColor: C.muted,
                        opacity: value <= -15 ? 0.3 : pressed ? 0.6 : 1,
                      },
                    ]}
                  >
                    <Ionicons name="remove" size={18} color={C.foreground} {...a11yDecorative} />
                  </Pressable>
                  <Pressable
                    onPress={() => adjust(1)}
                    {...a11yButton(`Increase ${prayer} offset by 1 minute`)}
                    disabled={value >= 15}
                    hitSlop={6}
                    style={({ pressed }) => [
                      styles.offsetBtn,
                      {
                        backgroundColor: C.muted,
                        opacity: value >= 15 ? 0.3 : pressed ? 0.6 : 1,
                      },
                    ]}
                  >
                    <Ionicons name="add" size={18} color={C.foreground} {...a11yDecorative} />
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Prayer Sound (Adhan with quiet hours) */}
      <View style={styles.section}>
        <View style={{ gap: 2, marginBottom: 8 }}>
          <Text
            maxFontSizeMultiplier={1.4}
            style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}
          >
            PRAYER SOUND
          </Text>
          <Text
            maxFontSizeMultiplier={1.6}
            style={[styles.sectionDesc, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
          >
            All prayer reminders make sound by default. Turn off any prayer you'd like to receive silently.
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          {(["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const).map((prayer, i, arr) => (
            <SettingRow
              key={prayer}
              icon={prayer === "Fajr" ? "moon-outline" : prayer === "Isha" ? "moon-outline" : "sunny-outline"}
              title={prayer}
              subtitle={
                settings.prayerSoundEnabled[prayer]
                  ? "Sound on"
                  : prayer === "Fajr"
                  ? "Silent — quiet hours"
                  : "Silent reminder"
              }
              C={C}
              last={i === arr.length - 1}
              right={
                <Switch
                  value={settings.prayerSoundEnabled[prayer]}
                  onValueChange={(val) => handlePrayerSoundToggle(prayer, val)}
                  trackColor={{ false: C.border, true: C.primary }}
                  thumbColor="#fff"
                  {...a11yToggle(
                    `${prayer} prayer sound`,
                    settings.prayerSoundEnabled[prayer],
                  )}
                />
              }
            />
          ))}
        </View>
      </View>

      {/* Adhan Sound — which audio file plays for prayer-time reminders. */}
      <View style={styles.section}>
        <View style={{ gap: 2, marginBottom: 8 }}>
          <Text
            maxFontSizeMultiplier={1.4}
            style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}
          >
            ADHAN SOUND
          </Text>
          <Text
            maxFontSizeMultiplier={1.6}
            style={[styles.sectionDesc, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
          >
            Pick what plays at prayer time when sound is on above. Bundled adhans fall back to the device default if not yet shipped.
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          {([
            { id: "default" as const, title: "Device default", subtitle: "System notification sound — always available" },
            { id: "madinah" as const, title: "Adhan — Madinah", subtitle: "Bundled recitation, Masjid an-Nabawi style" },
            { id: "makkah" as const, title: "Adhan", subtitle: "Full adhan recitation — Aaqib Azeez (CC BY-SA 4.0)" },
          ] as const).map((opt, i, arr) => (
            <Pressable
              key={opt.id}
              onPress={() => updateSettings({ adhanSound: opt.id })}
              {...a11ySelectable(`${opt.title}. ${opt.subtitle}`, settings.adhanSound === opt.id)}
              style={({ pressed }) => [
                styles.methodRow,
                i < arr.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: C.border,
                },
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={{ flex: 1, gap: 2 }}>
                <Text
                  maxFontSizeMultiplier={1.6}
                  style={[styles.methodLabel, { color: C.foreground, fontFamily: "Inter_500Medium" }]}
                >
                  {opt.title}
                </Text>
                <Text
                  maxFontSizeMultiplier={1.6}
                  style={{ color: C.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 12 }}
                >
                  {opt.subtitle}
                </Text>
              </View>
              {settings.adhanSound === opt.id && (
                <Ionicons name="checkmark-circle" size={20} color={C.primary} {...a11yDecorative} />
              )}
            </Pressable>
          ))}
        </View>
        <Text
          maxFontSizeMultiplier={1.6}
          style={[styles.hint, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
        >
          Both adhans are bundled with the app and play offline.
        </Text>
      </View>

      {/* Reciter — chooses the qari for ayah audio playback throughout the app */}
      <View style={styles.section}>
        <View style={{ gap: 2, marginBottom: 8 }}>
          <Text
            maxFontSizeMultiplier={1.4}
            style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}
          >
            RECITER
          </Text>
          <Text
            maxFontSizeMultiplier={1.6}
            style={[styles.sectionDesc, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
          >
            Choose the qari for Quran audio. Used everywhere ayat are played.
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          {RECITERS.map((reciter, i) => (
            <Pressable
              key={reciter.id}
              onPress={() => handleReciterSelect(reciter.id)}
              {...a11ySelectable(
                `${reciter.name}, ${reciter.country}, ${reciter.style}`,
                settings.reciter === reciter.id,
              )}
              style={({ pressed }) => [
                styles.optionRow,
                i < RECITERS.length - 1
                  ? { borderBottomColor: C.border }
                  : { borderBottomWidth: 0 },
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={styles.optionContent}>
                <Text
                  maxFontSizeMultiplier={1.6}
                  style={[styles.optionTitle, { color: C.foreground, fontFamily: "Inter_500Medium" }]}
                >
                  {reciter.name}
                </Text>
                <Text
                  maxFontSizeMultiplier={1.6}
                  style={[styles.optionDesc, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
                >
                  {reciter.country} · {reciter.style}
                </Text>
              </View>
              {settings.reciter === reciter.id && (
                <Ionicons name="checkmark-circle" size={20} color={C.primary} {...a11yDecorative} />
              )}
            </Pressable>
          ))}
        </View>
      </View>

      {/* Privacy & Legal */}
      <View style={styles.section}>
        <Text
          maxFontSizeMultiplier={1.4}
          style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}
        >
          PRIVACY & LEGAL
        </Text>
        <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" }]}>
          {/* Anonymized crash reports — opt-out. We never collect personal
              data; only stack traces and anonymized device info to help us
              fix bugs. The toggle takes effect immediately via
              setCrashReportsEnabled in lib/sentry.ts. */}
          <SettingRow
            icon="bug-outline"
            title="Send crash reports"
            subtitle="Anonymized stack traces help us fix bugs"
            C={C}
            right={
              <Switch
                value={settings.crashReportsEnabled}
                onValueChange={handleCrashReportsToggle}
                trackColor={{ false: C.border, true: C.primary }}
                thumbColor="#fff"
                {...a11yToggle(
                  "Send crash reports",
                  settings.crashReportsEnabled,
                  "Anonymized crash reports help us fix bugs",
                )}
              />
            }
          />
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/about" as never);
            }}
            {...a11yButton("About Daily Imaan", "Opens the welcome and sources screen")}
            style={({ pressed }) => [
              styles.optionRow,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.optionContent}>
              <Text
                maxFontSizeMultiplier={1.6}
                style={[styles.optionTitle, { color: C.foreground, fontFamily: "Inter_500Medium" }]}
              >
                About Daily Imaan
              </Text>
              <Text
                maxFontSizeMultiplier={1.6}
                style={[styles.optionDesc, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
              >
                Why this app exists and where the words come from
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.mutedForeground} {...a11yDecorative} />
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/privacy" as never);
            }}
            {...a11yButton("Privacy Policy", "Opens the in-app privacy policy")}
            style={({ pressed }) => [
              styles.optionRow,
              { borderBottomWidth: 0, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.optionContent}>
              <Text
                maxFontSizeMultiplier={1.6}
                style={[styles.optionTitle, { color: C.foreground, fontFamily: "Inter_500Medium" }]}
              >
                Privacy Policy
              </Text>
              <Text
                maxFontSizeMultiplier={1.6}
                style={[styles.optionDesc, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
              >
                What data the app uses and where it goes
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.mutedForeground} {...a11yDecorative} />
          </Pressable>
        </View>
      </View>

      {/* About — Sources */}
      <View style={styles.section}>
        <Text
          maxFontSizeMultiplier={1.4}
          style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}
        >
          SOURCES & ATTRIBUTION
        </Text>
        <View style={[styles.card, { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000", padding: 16 }]}>
          <Text
            maxFontSizeMultiplier={1.6}
            style={[styles.aboutText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
          >
            English translation: Saheeh International. Every featured ayah and the verses behind each "I am feeling…" prompt are audited verbatim against the Saheeh International edition served by the Quran.com Foundation API.
            {"\n"}
            Arabic text: text_uthmani via the Quran.com Foundation API — true Uthmani script.
            {"\n"}
            Tafsir: Tafsīr Ibn Kathīr (Abridged), fetched on demand from Quran.com and cached on your device. The words are verbatim from the cited scholar.
            {"\n"}
            Surah info: linked out to Quran.com from each surah page.
            {"\n"}
            Du'as: sunnah-attested, with the primary hadith collection cited under each one (Bukhari, Muslim, Abu Dawud, Tirmidhi, etc.).
            {"\n"}
            Audio recitation: chosen reciter via alquran.cloud (catalogue includes Al-Afasy, Al-Husary, Al-Minshawi, Al-Sudais, Al-Shatri, Al-Ghamdi).
            {"\n"}
            Prayer times: Aladhan API.
            {"\n\n"}
            This app does not generate or paraphrase any commentary, summaries, or "reminders" about Qur'anic verses, hadith, or Islamic teachings. For questions about meaning or rulings, please consult a qualified scholar.
          </Text>
        </View>
      </View>

      <View style={styles.appInfo}>
        <Text
          maxFontSizeMultiplier={1.4}
          style={[styles.appInfoText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
        >
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
  addPickerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  addPickerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  addPickerLabel: { flex: 1, fontSize: 15 },
  iosPickerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  iosPickerBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  iosPickerBtnText: { fontSize: 14 },
  hint: { fontSize: 12, lineHeight: 18 },
  timeValue: { fontSize: 16 },
  methodRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13 },
  methodLabel: { flex: 1, fontSize: 15 },
  offsetBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  aboutText: { fontSize: 13, lineHeight: 20 },
  appInfo: { alignItems: "center", marginTop: 12 },
  appInfoText: { fontSize: 12, textAlign: "center", lineHeight: 18 },
});
