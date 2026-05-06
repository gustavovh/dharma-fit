import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { LinearGradient } from "expo-linear-gradient";

interface StatCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string | number;
  delta?: { value: string; positive: boolean };
}

export function StatCard({ icon, label, value, delta }: StatCardProps) {
  const colors = useColors();

  return (
    <LinearGradient
      colors={colors.gradientCard}
      style={[
        styles.container,
        {
          borderColor: colors.border,
          borderRadius: colors.radius,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      </View>
      <Text style={[styles.value, { color: colors.foreground }]}>{value}</Text>
      {delta && (
        <View style={styles.deltaContainer}>
          <Feather name={delta.positive ? "arrow-up-right" : "arrow-down-right"} size={12} color={delta.positive ? colors.accent : colors.destructive} />
          <Text style={[styles.delta, { color: delta.positive ? colors.accent : colors.destructive }]}>{delta.value}</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    flex: 1,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
  },
  value: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    fontVariant: ["tabular-nums"],
  },
  deltaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  delta: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  }
});
