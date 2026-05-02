import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

import colors from "@/constants/colors";
import { SURAHS, Surah } from "@/data/surahsData";

export default function QuranScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return SURAHS;
    const q = query.toLowerCase();
    return SURAHS.filter(
      (s) =>
        s.nameEnglish.toLowerCase().includes(q) ||
        s.nameTranslation.toLowerCase().includes(q) ||
        String(s.id).includes(q)
    );
  }, [query]);

  const renderItem = ({ item }: { item: Surah }) => (
    <Pressable
      onPress={() => router.push(`/surah/${item.id}` as never)}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: C.card,
          borderBottomColor: C.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={[styles.numberBadge, { backgroundColor: C.secondary }]}>
        <Text style={[styles.numberText, { color: C.primary, fontFamily: "Inter_600SemiBold" }]}>
          {item.id}
        </Text>
      </View>

      <View style={styles.rowContent}>
        <View style={styles.rowMain}>
          <Text style={[styles.englishName, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}>
            {item.nameEnglish}
          </Text>
          <Text style={[styles.arabicName, { color: C.primary }]}>
            {item.name}
          </Text>
        </View>
        <View style={styles.rowMeta}>
          <Text style={[styles.translation, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            {item.nameTranslation}
          </Text>
          <View style={styles.metaRight}>
            <View style={[styles.chip, { backgroundColor: C.secondary }]}>
              <Text style={[styles.chipText, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>
                {item.ayahCount} ayat
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: item.revelationType === "Meccan" ? (isDark ? "rgba(200,147,60,0.15)" : "rgba(200,147,60,0.12)") : (isDark ? "rgba(45,191,127,0.15)" : "rgba(26,107,74,0.08)") }]}>
              <Text style={[styles.chipText, { color: item.revelationType === "Meccan" ? C.accent : C.primary, fontFamily: "Inter_500Medium" }]}>
                {item.revelationType}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color={C.mutedForeground} />
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: C.background, borderBottomColor: C.border }]}>
        <Text style={[styles.title, { color: C.foreground, fontFamily: "Inter_700Bold" }]}>
          Quran
        </Text>
        <Text style={[styles.subtitle, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          114 Surahs
        </Text>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: C.background, paddingBottom: 8 }]}>
        <View style={[styles.searchBar, { backgroundColor: C.muted, borderColor: C.border }]}>
          <Ionicons name="search" size={18} color={C.mutedForeground} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search surah name or number..."
            placeholderTextColor={C.mutedForeground}
            style={[styles.searchInput, { color: C.foreground, fontFamily: "Inter_400Regular" }]}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color={C.mutedForeground} />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: C.border }]} />}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={C.mutedForeground} />
            <Text style={[styles.emptyText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              No surahs found
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontSize: 28, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 2 },
  searchContainer: { paddingHorizontal: 16, paddingTop: 12 },
  searchBar: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  list: { paddingTop: 4 },
  row: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  numberBadge: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  numberText: { fontSize: 14 },
  rowContent: { flex: 1, gap: 3 },
  rowMain: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  englishName: { fontSize: 16 },
  arabicName: { fontSize: 18 },
  rowMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  translation: { fontSize: 13 },
  metaRight: { flexDirection: "row", gap: 6 },
  chip: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  chipText: { fontSize: 11 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 68 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15 },
});
