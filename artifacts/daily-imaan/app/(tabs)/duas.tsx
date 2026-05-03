import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { DUA_CATEGORIES, DUAS, Dua } from "@/data/duasData";

function DuaCard({ dua, isDark, C }: { dua: Dua; isDark: boolean; C: (typeof colors)["light"] }) {
  const [expanded, setExpanded] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { markDeedDone } = useApp();

  const toggle = () => {
    const useND = Platform.OS !== "web";
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.98, duration: 80, useNativeDriver: useND }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: useND }),
    ]).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Auto-link "Made Dua" intention the first time the user opens any
    // dua. markDeedDone is idempotent — never undoes a manual uncheck.
    if (!expanded) markDeedDone("dua");
    setExpanded(!expanded);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={toggle}
        style={[
          styles.duaCard,
          { backgroundColor: C.card, shadowColor: isDark ? "#000" : "#000" },
        ]}
      >
        {/* Occasion header */}
        <View style={styles.duaHeader}>
          <View style={[styles.occasionBadge, { backgroundColor: C.secondary }]}>
            <Ionicons name="moon-outline" size={12} color={C.primary} />
            <Text style={[styles.occasionText, { color: C.primary, fontFamily: "Inter_500Medium" }]}>
              {dua.occasion}
            </Text>
          </View>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={C.mutedForeground}
          />
        </View>

        {/* Arabic */}
        <Text style={[styles.duaArabic, { color: C.foreground }]}>
          {dua.arabicText}
        </Text>

        {/* Expanded content */}
        {expanded && (
          <View style={styles.expandedContent}>
            <View style={[styles.divider, { backgroundColor: C.border }]} />
            <Text style={[styles.transliteration, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              {dua.transliteration}
            </Text>
            <Text style={[styles.englishDua, { color: C.foreground, fontFamily: "Inter_400Regular" }]}>
              "{dua.englishText}"
            </Text>
            {dua.source && (
              <View style={[styles.sourceBadge, { backgroundColor: isDark ? "rgba(200,147,60,0.12)" : "rgba(200,147,60,0.1)" }]}>
                <Text style={[styles.sourceText, { color: C.accent, fontFamily: "Inter_600SemiBold" }]}>
                  Source: {dua.source}
                </Text>
              </View>
            )}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

export default function DuasScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = DUAS;
    if (selectedCategory !== "All") {
      list = list.filter((d) => d.category === selectedCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (d) =>
          d.occasion.toLowerCase().includes(q) ||
          d.englishText.toLowerCase().includes(q) ||
          d.transliteration.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, query]);

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: C.background, borderBottomColor: C.border }]}>
        <Text style={[styles.title, { color: C.foreground, fontFamily: "Inter_700Bold" }]}>
          Duas
        </Text>
        <Text style={[styles.subtitle, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          {filtered.length} du'as
        </Text>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: C.background }]}>
        <View style={[styles.searchBar, { backgroundColor: C.muted, borderColor: C.border }]}>
          <Ionicons name="search" size={18} color={C.mutedForeground} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search occasion or meaning..."
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

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.pillScroll, { backgroundColor: C.background }]}
        contentContainerStyle={styles.pillContent}
      >
        {DUA_CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedCategory(cat);
            }}
            style={[
              styles.pill,
              {
                backgroundColor: selectedCategory === cat ? C.primary : C.muted,
                borderColor: selectedCategory === cat ? C.primary : C.border,
              },
            ]}
          >
            <Text
              style={[
                styles.pillText,
                {
                  color: selectedCategory === cat ? "#fff" : C.mutedForeground,
                  fontFamily: selectedCategory === cat ? "Inter_600SemiBold" : "Inter_400Regular",
                },
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Duas List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DuaCard dua={item} isDark={isDark} C={C} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={C.mutedForeground} />
            <Text style={[styles.emptyText, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              No duas found
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
  searchContainer: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  searchBar: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  pillScroll: { flexGrow: 0 },
  pillContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  pillText: { fontSize: 13 },
  list: { paddingHorizontal: 16, paddingTop: 8, gap: 10 },
  duaCard: {
    borderRadius: 14, padding: 16, gap: 12,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  duaHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  occasionBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  occasionText: { fontSize: 12 },
  duaArabic: { fontSize: 22, lineHeight: 44, textAlign: "right", writingDirection: "rtl", fontFamily: "Amiri_400Regular" },
  expandedContent: { gap: 10 },
  divider: { height: StyleSheet.hairlineWidth },
  transliteration: { fontSize: 13, lineHeight: 20, fontStyle: "italic" },
  englishDua: { fontSize: 15, lineHeight: 24 },
  sourceBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  sourceText: { fontSize: 12 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15 },
});
