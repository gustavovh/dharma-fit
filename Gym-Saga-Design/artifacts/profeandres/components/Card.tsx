import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";
import { LinearGradient } from "expo-linear-gradient";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "gold";
}

export function Card({ children, style, variant = "default" }: CardProps) {
  const colors = useColors();

  if (variant === "gold") {
    return (
      <View style={[{ borderRadius: colors.radius, overflow: "hidden" }, style]}>
        <LinearGradient
          colors={["rgba(212, 175, 55, 0.15)", colors.card]}
          style={[styles.card, { borderColor: colors.primary, borderWidth: 1 }]}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
  }
});
