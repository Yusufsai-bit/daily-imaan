import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/constants/colors";
import { useApp, type QadaFast } from "@/context/AppContext";

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateKey(key: string): string {
  const d = new Date(key + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export default function FastingScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const { state, toggleFastingDay, addQadaFast, markQadaMadeUp, deleteQadaFast } = useApp();
  const { fasting } = state;

  const todayKey = getTodayKey();
  const fastingToday = fasting.days[todayKey] ?? false;

  const pendingQada = fasting.qada.filter((q) => !q.madeUp);
  const completedQada = fasting.qada.filter((q) => q.madeUp);

  // Add qada modal
  const [addModal, setAddModal] = useState(false);
  const [qadaDate, setQadaDate] = useState("");
  const [qadaReason, setQadaReason] = useState("");

  const handleAddQada = () => {
    if (!qadaDate.trim()) {
      Alert.alert("Date required", "Enter the date the fast was missed (e.g. 2024-03-15).");
      return;
    }
    addQadaFast({ date: qadaDate.trim(), reason: qadaReason.trim() || "Not specified", madeUp: false });
    setAddModal(false);
    setQadaDate("");
    setQadaReason("");
  };

  const renderQada = ({ item }: { item: QadaFast }) => (
    <View style={[styles.qadaRow, { borderBottomColor: C.border }]}>
      <Pressable
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); markQadaMadeUp(item.id); }}
        style={[styles.qadaCheck, { borderColor: item.madeUp ? C.primary : C.border, backgroundColor: item.madeUp ? C.primary : "transparent" }]}
      >
        {item.madeUp && <Ionicons name="checkmark" size={14} color="#fff" />}
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={[styles.qadaDate, { color: C.foreground, fontFamily: "Inter_600SemiBold", textDecorationLine: item.madeUp ? "line-through" : "none" }]}>
          {formatDateKey(item.date)}
        </Text>
        <Text style={[styles.qadaReason, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          {item.reason}
        </Text>
      </View>
      <Pressable
        onPress={() => Alert.alert("Delete", "Remove this qada entry?", [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: () => deleteQadaFast(item.id) },
        ])}
        hitSlop={8}
        style={styles.deleteBtn}
      >
        <Ionicons name="trash-outline" size={16} color={C.mutedForeground} />
      </Pressable>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: C.primary }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Text style={[styles.headerTitle, { fontFamily: "Inter_700Bold" }]}>Fasting</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>

        {/* Today's fasting */}
        <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
          <Text style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>TODAY</Text>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); toggleFastingDay(todayKey); }}
            style={[styles.todayRow, { borderTopColor: C.border }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.todayTitle, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
                {fastingToday ? "Fasting today" : "Not fasting today"}
              </Text>
              <Text style={[styles.todaySubtitle, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {fastingToday ? "MashaAllah! May Allah accept your fast." : "Tap to mark today as a fast day."}
              </Text>
            </View>
            <View style={[styles.fastToggle, { backgroundColor: fastingToday ? C.primary : C.muted }]}>
              <Ionicons name={fastingToday ? "checkmark-circle" : "moon-outline"} size={28} color={fastingToday ? "#fff" : C.mutedForeground} />
            </View>
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: "Days fasted", value: Object.values(fasting.days).filter(Boolean).length },
            { label: "Qada remaining", value: pendingQada.length },
            { label: "Qada made up", value: completedQada.length },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: C.card, borderColor: C.border }]}>
              <Text style={[styles.statValue, { color: C.primary, fontFamily: "Inter_700Bold" }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Qada section */}
        <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: C.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>QADA FASTS</Text>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setAddModal(true); }}
              style={[styles.addBtn, { backgroundColor: C.secondary }]}
            >
              <Ionicons name="add" size={16} color={C.primary} />
              <Text style={[styles.addBtnText, { color: C.primary, fontFamily: "Inter_600SemiBold" }]}>Add</Text>
            </Pressable>
          </View>

          {fasting.qada.length === 0 ? (
            <View style={[styles.emptyState, { borderTopColor: C.border }]}>
              <Text style={[styles.emptyText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                No qada fasts logged. Tap Add to record a missed fast.
              </Text>
            </View>
          ) : (
            <FlatList
              data={fasting.qada}
              keyExtractor={(item) => item.id}
              renderItem={renderQada}
              scrollEnabled={false}
              style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border }}
            />
          )}
        </View>

        <Text style={[styles.hint, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          Qada fasts are missed obligatory fasts (Ramadan or other) that need to be made up. Tap the checkbox when you've completed one.
        </Text>
      </ScrollView>

      {/* Add Qada Modal */}
      <Modal visible={addModal} transparent animationType="slide" onRequestClose={() => setAddModal(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setAddModal(false)}>
          <Pressable style={[styles.modalSheet, { backgroundColor: C.card, borderColor: C.border }]} onPress={() => {}}>
            <Text style={[styles.modalTitle, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>Add Qada Fast</Text>
            <TextInput
              value={qadaDate}
              onChangeText={setQadaDate}
              placeholder="Date missed (YYYY-MM-DD)"
              placeholderTextColor={C.mutedForeground}
              style={[styles.input, { color: C.foreground, borderColor: C.border, fontFamily: "Inter_400Regular" }]}
            />
            <TextInput
              value={qadaReason}
              onChangeText={setQadaReason}
              placeholder="Reason (optional)"
              placeholderTextColor={C.mutedForeground}
              style={[styles.input, { color: C.foreground, borderColor: C.border, fontFamily: "Inter_400Regular" }]}
            />
            <View style={styles.modalBtns}>
              <Pressable onPress={() => setAddModal(false)} style={[styles.modalBtn, { backgroundColor: C.muted }]}>
                <Text style={[styles.modalBtnText, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleAddQada} style={[styles.modalBtn, { backgroundColor: C.primary, flex: 1 }]}>
                <Text style={[styles.modalBtnText, { color: "#fff", fontFamily: "Inter_600SemiBold" }]}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, textAlign: "center", color: "#fff", fontSize: 18 },
  content: { padding: 16, gap: 14 },
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  sectionLabel: { fontSize: 11, letterSpacing: 0.8, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingRight: 12 },
  todayRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderTopWidth: StyleSheet.hairlineWidth },
  todayTitle: { fontSize: 16 },
  todaySubtitle: { fontSize: 13, marginTop: 2 },
  fastToggle: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, padding: 14, alignItems: "center", gap: 4 },
  statValue: { fontSize: 24 },
  statLabel: { fontSize: 11, textAlign: "center" },
  qadaRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  qadaCheck: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  qadaDate: { fontSize: 14 },
  qadaReason: { fontSize: 12, marginTop: 2 },
  deleteBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 4 },
  addBtnText: { fontSize: 13 },
  emptyState: { borderTopWidth: StyleSheet.hairlineWidth, padding: 20, alignItems: "center" },
  emptyText: { fontSize: 13, textAlign: "center" },
  hint: { fontSize: 12, lineHeight: 18, textAlign: "center", paddingHorizontal: 16 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  modalSheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: StyleSheet.hairlineWidth, padding: 20, gap: 14 },
  modalTitle: { fontSize: 16 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  modalBtns: { flexDirection: "row", gap: 10 },
  modalBtn: { paddingVertical: 12, borderRadius: 10, alignItems: "center", justifyContent: "center", paddingHorizontal: 18 },
  modalBtnText: { fontSize: 14 },
});
