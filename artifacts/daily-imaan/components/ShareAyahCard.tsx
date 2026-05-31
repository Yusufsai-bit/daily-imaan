import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ARABIC_FONT_REGULAR } from "@/constants/fonts";

interface Props {
  arabic: string;
  english: string;
  reference: string; // e.g. "Al-Baqarah 2:255"
}

const ShareAyahCard = React.forwardRef<View, Props>(
  ({ arabic, english, reference }, ref) => {
    return (
      <View ref={ref} style={styles.card} collapsable={false}>
        <View style={styles.topAccent} />
        <Text style={styles.arabic}>{arabic}</Text>
        <View style={styles.divider} />
        <Text style={styles.english}>"{english}"</Text>
        <Text style={styles.reference}>— {reference}</Text>
        <View style={styles.footer}>
          <Text style={styles.brand}>Daily Imaan</Text>
          <Text style={styles.sub}>dailyimaan.com</Text>
        </View>
      </View>
    );
  },
);

ShareAyahCard.displayName = "ShareAyahCard";
export default ShareAyahCard;

const styles = StyleSheet.create({
  card: {
    width: 1080,
    backgroundColor: "#0f3d27",
    padding: 80,
    gap: 32,
  },
  topAccent: {
    height: 4,
    width: 60,
    backgroundColor: "#C8933C",
    borderRadius: 2,
    marginBottom: 8,
  },
  arabic: {
    fontFamily: ARABIC_FONT_REGULAR,
    fontSize: 52,
    lineHeight: 96,
    color: "#fff",
    textAlign: "right",
    writingDirection: "rtl",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  english: {
    fontSize: 30,
    lineHeight: 48,
    color: "rgba(255,255,255,0.88)",
    fontFamily: "Inter_400Regular",
  },
  reference: {
    fontSize: 24,
    color: "#C8933C",
    fontFamily: "Inter_500Medium",
  },
  footer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: 22,
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
  sub: {
    fontSize: 18,
    color: "rgba(255,255,255,0.45)",
    fontFamily: "Inter_400Regular",
  },
});
