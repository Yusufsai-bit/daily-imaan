import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { DUA_CATEGORIES, DUAS, Dua } from "@/data/duasData";

/**
 * Per-category icon mapping. Keep keys in sync with DUA_CATEGORIES — any
 * unknown category falls back to a generic bookmark icon. We deliberately
 * use Ionicons "outline" variants to match the rest of the app.
 */
const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  "Morning & Evening": "sunny-outline",
  Prayer: "moon-outline",
  "Eating & Drinking": "restaurant-outline",
  Commuting: "car-outline",
  Home: "home-outline",
  "Work & Study": "briefcase-outline",
  Hardship: "heart-outline",
  Sleep: "bed-outline",
};

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

  // null = landing (category grid). A string = drilled into one category.
  // Search overrides both: typing a query shows cross-category results
  // regardless of which category the user is in.
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const isSearching = query.trim().length > 0;
  const showCategoryGrid = selectedCategory === null && !isSearching;

  // Categories with live counts so the grid tiles can show "12 du'as"
  // subtitles. We strip the legacy "All" sentinel from DUA_CATEGORIES —
  // categorical browsing is now the default; the old "All" pill caused
  // the overwhelming wall-of-cards problem this screen used to have.
  const categoryTiles = useMemo(
    () =>
      DUA_CATEGORIES.filter((c) => c !== "All").map((cat) => ({
        name: cat,
        count: DUAS.filter((d) => d.category === cat).length,
        icon: CATEGORY_ICONS[cat] ?? ("bookmark-outline" as const),
      })),
    [],
  );

  const filtered = useMemo(() => {
    if (isSearching) {
      const q = query.toLowerCase();
      return DUAS.filter(
        (d) =>
          d.occasion.toLowerCase().includes(q) ||
          d.englishText.toLowerCase().includes(q) ||
          d.transliteration.toLowerCase().includes(q),
      );
    }
    if (selectedCategory) {
      return DUAS.filter((d) => d.category === selectedCategory);
    }
    return [];
  }, [selectedCategory, query, isSearching]);

  const handleCategoryTap = (cat: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(cat);
  };

  const handleBackToCategories = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(null);
    setQuery("");
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: C.background, borderBottomColor: C.border }]}>
        <Text style={[styles.title, { color: C.foreground, fontFamily: "Inter_700Bold" }]}>
          Duas
        </Text>
        <Text style={[styles.subtitle, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          {showCategoryGrid
            ? `${categoryTiles.length} categories`
            : isSearching
            ? `${filtered.length} ${filtered.length === 1 ? "result" : "results"}`
            : `${filtered.length} ${filtered.length === 1 ? "du'a" : "du'as"}`}
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

      {/* Breadcrumb back-to-categories pill — only when drilled in and
          not actively searching across all categories. */}
      {selectedCategory && !isSearching && (
        <View style={styles.crumbRow}>
          <Pressable
            onPress={handleBackToCategories}
            accessibilityRole="button"
            accessibilityLabel="Back to categories"
            style={({ pressed }) => [
              styles.crumbPill,
              { backgroundColor: C.muted, borderColor: C.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="chevron-back" size={14} color={C.mutedForeground} />
            <Text style={[styles.crumbText, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              Categories
            </Text>
          </Pressable>
          <Text
            style={[styles.crumbCurrent, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}
            numberOfLines={1}
          >
            {selectedCategory}
          </Text>
        </View>
      )}

      {/* Body — either the 2-column category grid, or the drilled-in
          dua list, or cross-category search results. */}
      {showCategoryGrid ? (
        <FlatList
          data={categoryTiles}
          keyExtractor={(item) => item.name}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleCategoryTap(item.name)}
              accessibilityRole="button"
              accessibilityLabel={`${item.name}, ${item.count} du'as`}
              style={({ pressed }) => [
                styles.categoryTile,
                {
                  backgroundColor: C.card,
                  borderColor: C.border,
                  opacity: pressed ? 0.85 : 1,
                  shadowColor: "#000",
                },
              ]}
            >
              <View style={[styles.categoryIconWrap, { backgroundColor: C.secondary }]}>
                <Ionicons name={item.icon} size={22} color={C.primary} />
              </View>
              <Text
                style={[styles.categoryName, { color: C.foreground, fontFamily: "Inter_600SemiBold" }]}
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <Text
                style={[styles.categoryCount, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}
              >
                {item.count} {item.count === 1 ? "du'a" : "du'as"}
              </Text>
            </Pressable>
          )}
        />
      ) : (
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
      )}
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
  crumbRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  crumbPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  crumbText: { fontSize: 12 },
  crumbCurrent: { flex: 1, fontSize: 14 },
  grid: { paddingHorizontal: 16, paddingTop: 12, gap: 12 },
  gridRow: { gap: 12 },
  categoryTile: {
    flex: 1,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 18,
    paddingHorizontal: 14,
    gap: 10,
    minHeight: 130,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  categoryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: { fontSize: 15, lineHeight: 20 },
  categoryCount: { fontSize: 12 },
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
