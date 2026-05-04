import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface StatCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string | number;
  delta?: { value: string; positive: boolean };
}

export function StatCard({ icon, label, value, delta }: StatCardProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <Text style={[styles.value, { color: colors.foreground }]}>{value}</Text>
      {delta && (
        <View style={styles.deltaContainer}>
          <Feather name={delta.positive ? "arrow-up-right" : "arrow-down-right"} size={12} color={delta.positive ? colors.accent : colors.destructive} />
          <Text style={[styles.delta, { color: delta.positive ? colors.accent : colors.destructive }]}>{delta.value}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
  },
  value: {
    fontSize: 24,
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
