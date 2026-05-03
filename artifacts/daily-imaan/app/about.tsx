import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/constants/colors";
import { AboutContent } from "@/components/AboutContent";
import { a11yButton, a11yDecorative } from "@/components/a11y";

/**
 * Re-readable About screen. Same content as the first-launch welcome modal,
 * reachable any time from Settings → About Daily Imaan.
 */
export default function AboutScreen() {
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
          About Daily Imaan
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ height: 8 }} />
      <AboutContent C={C} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 18 },
});
