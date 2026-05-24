import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect, useMemo, useState } from "react";
import {
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
import { ARABIC_FONT_REGULAR } from "@/constants/fonts";
import { useApp } from "@/context/AppContext";
import { DUA_CATEGORIES, DUAS, Dua } from "@/data/duasData";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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

/**
 * Per-card fallback. Keeps a single broken Dua entry from taking the whole
 * tab down. Shown in place of the card so the user can still scroll the
 * rest of the list. The full error surfaces via the inline message in
 * components/ErrorFallback.tsx (TEMP block) while we diagnose the
 * intermittent expand-crash a tester reported in 1.0.0 (4).
 */
function DuaCardErrorFallback({ error }: { error: Error; resetError: () => void }) {
  return (
    <View style={{
      padding: 14, borderRadius: 14, marginBottom: 4,
      backgroundColor: "rgba(239,68,68,0.06)", borderWidth: 1, borderColor: "rgba(239,68,68,0.3)",
    }}>
      <Text style={{ fontSize: 13, color: "#B91C1C", fontFamily: "Inter_600SemiBold" }}>
        This du'a couldn't be displayed
      </Text>
      <Text selectable style={{ fontSize: 11, color: "#B91C1C", marginTop: 4, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" }}>
        {String(error?.message ?? "unknown error")}
      </Text>
    </View>
  );
}

function DuaCardInner({ dua, isDark, C }: { dua: Dua; isDark: boolean; C: (typeof colors)["light"] }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { markDeedDone } = useApp();

  const handleCopy = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const parts = [dua.arabicText, dua.transliteration, `"${dua.englishText}"`];
    if (dua.source) parts.push(`— ${dua.source}`);
    await Clipboard.setStringAsync(parts.join("\n\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Defensive: a malformed Dua entry (missing arabicText etc.) used to
  // crash this screen because the legacy Animated.Value pipeline threw on
  // the first render. We fall back to safe empty strings so a broken
  // entry shows visibly empty but doesn't take the whole screen down.
  // String() guards against any non-string slipping in from future data
  // edits — React Native's <Text> children throw if they receive objects.
  const arabic = String(dua?.arabicText ?? "");
  const occasion = String(dua?.occasion ?? "");
  const transliteration = String(dua?.transliteration ?? "");
  const english = String(dua?.englishText ?? "");
  const source = dua?.source != null ? String(dua.source) : "";

  // Auto-link the "Made Dua" intention the first time a card is opened.
  // We run this in an effect rather than synchronously inside the tap
  // handler — otherwise markDeedDone's AppContext write fires on the
  // same tick as setExpanded, every other DuaCard in the FlatList
  // re-renders mid-commit, and the New Architecture occasionally trips
  // a render-time error that lands in the ErrorBoundary as
  // "Something went wrong". Decoupling the side-effect avoids the
  // cascade entirely. markDeedDone is idempotent — never undoes a
  // manual uncheck.
  useEffect(() => {
    if (expanded) markDeedDone("dua");
  }, [expanded, markDeedDone]);

  const toggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded((p) => !p);
  };

  return (
    <Pressable
      onPress={toggle}
      // Native press feedback via Pressable's `pressed` arg replaces the
      // legacy `Animated.sequence` micro-bounce. The previous version
      // created a fresh Animated.Value per item inside FlatList and ran
      // sequences on press — under the New Architecture this combination
      // intermittently threw at render time, which is what the friend's
      // "pops up with an error" was. Pressable's built-in press style is
      // both cheaper (no JS thread animation tick) and crash-proof.
      style={({ pressed }) => [
        styles.duaCard,
        {
          backgroundColor: C.card,
          shadowColor: isDark ? "#000" : "#000",
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
      ]}
    >
      {/* Occasion header */}
      <View style={styles.duaHeader}>
        <View style={[styles.occasionBadge, { backgroundColor: C.secondary }]}>
          <Ionicons name="moon-outline" size={12} color={C.primary} />
          <Text style={[styles.occasionText, { color: C.primary, fontFamily: "Inter_500Medium" }]}>
            {occasion}
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
        {arabic}
      </Text>

      {/* Expanded content */}
      {expanded && (
        <View style={styles.expandedContent}>
          <View style={[styles.divider, { backgroundColor: C.border }]} />
          {transliteration ? (
            <Text style={[styles.transliteration, { color: C.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              {transliteration}
            </Text>
          ) : null}
          {english ? (
            <Text style={[styles.englishDua, { color: C.foreground, fontFamily: "Inter_400Regular" }]}>
              {`"${english}"`}
            </Text>
          ) : null}
          {source ? (
            <View style={[styles.sourceBadge, { backgroundColor: isDark ? "rgba(200,147,60,0.12)" : "rgba(200,147,60,0.1)" }]}>
              <Text style={[styles.sourceText, { color: C.accent, fontFamily: "Inter_600SemiBold" }]}>
                {`Source: ${source}`}
              </Text>
            </View>
          ) : null}
          <Pressable
            onPress={handleCopy}
            accessibilityLabel="Copy this du'a"
            style={({ pressed }) => [
              styles.copyBtn,
              { backgroundColor: C.muted, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name={copied ? "checkmark" : "copy-outline"} size={14} color={C.mutedForeground} />
            <Text style={[styles.copyBtnText, { color: C.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              {copied ? "Copied!" : "Copy"}
            </Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

// React.memo so DuaCards only re-render when their dua/isDark/C props
// change by reference — without this, every AppContext write (markDeedDone,
// markAyahRead, recordActivity from anywhere in the app) re-runs every
// rendered DuaCard's render path. Bigger lists got slow and, more
// importantly, every concurrent re-render is another chance for the
// expand-crash to trigger. dua/isDark/C are all stable references so the
// default shallow comparison is sufficient.
const MemoDuaCard = React.memo(DuaCardInner);

// Wrapper component: a per-card ErrorBoundary so a single malformed entry
// can't take the entire Duas tab down. The fallback shows the actual
// error message inline so beta testers can report it.
function DuaCard(props: { dua: Dua; isDark: boolean; C: (typeof colors)["light"] }) {
  return (
    <ErrorBoundary FallbackComponent={DuaCardErrorFallback}>
      <MemoDuaCard {...props} />
    </ErrorBoundary>
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

  const tilePairs = useMemo(() => {
    const pairs: [typeof categoryTiles[0], typeof categoryTiles[0] | null][] = [];
    for (let i = 0; i < categoryTiles.length; i += 2) {
      pairs.push([categoryTiles[i]!, categoryTiles[i + 1] ?? null]);
    }
    return pairs;
  }, [categoryTiles]);

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
        <ScrollView
          contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
        >
          {tilePairs.map(([left, right]) => (
            <View key={left.name} style={styles.gridRow}>
              {[left, right].map((item) =>
                item ? (
                  <Pressable
                    key={item.name}
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
                ) : (
                  <View key="empty" style={{ flex: 1 }} />
                )
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        <FlatList
          key="duas-list"
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
  duaArabic: { fontSize: 24, lineHeight: 46, textAlign: "right", writingDirection: "rtl", fontFamily: ARABIC_FONT_REGULAR },
  expandedContent: { gap: 10 },
  divider: { height: StyleSheet.hairlineWidth },
  // `fontStyle: "italic"` was dropped here — applied to a custom font
  // (Inter_400Regular) without an italic variant, it spams warnings on
  // iOS and on some configs has been linked to render-time errors. The
  // transliteration is now visually distinguished by its smaller size,
  // muted color, and line spacing alone — still clearly secondary.
  transliteration: { fontSize: 13, lineHeight: 20 },
  englishDua: { fontSize: 15, lineHeight: 24 },
  sourceBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  sourceText: { fontSize: 12 },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 2,
  },
  copyBtnText: { fontSize: 12 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15 },
});
