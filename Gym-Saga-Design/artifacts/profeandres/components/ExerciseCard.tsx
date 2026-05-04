import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { RoutineExercise, Exercise } from "@/types";

interface Props {
  routineExercise: RoutineExercise;
  exercise?: Exercise;
  onToggle: () => void;
  onDemo: () => void;
}

export function ExerciseCard({ routineExercise, exercise, onToggle, onDemo }: Props) {
  const colors = useColors();
  const re = routineExercise;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: re.completed ? colors.primary : colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
            {exercise?.name || "Ejercicio"}
          </Text>
          {exercise?.muscleGroup && (
            <Text style={[styles.muscle, { color: colors.mutedForeground }]}>
              {exercise.muscleGroup}
            </Text>
          )}
        </View>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onToggle();
          }}
          style={[
            styles.checkbox,
            {
              backgroundColor: re.completed ? colors.primary : "transparent",
              borderColor: re.completed ? colors.primary : colors.border,
            },
          ]}
        >
          {re.completed && (
            <Feather name="check" size={16} color={colors.primaryForeground} />
          )}
        </Pressable>
      </View>

      <View style={styles.metaRow}>
        <Meta icon="repeat" label={`${re.sets}×${re.reps}`} colors={colors} />
        {re.weightKg != null && (
          <Meta icon="trending-up" label={`${re.weightKg} kg`} colors={colors} />
        )}
        {re.restSeconds != null && (
          <Meta icon="clock" label={`${re.restSeconds}s`} colors={colors} />
        )}
      </View>

      {re.notes && (
        <Text style={[styles.notes, { color: colors.mutedForeground }]}>
          “{re.notes}”
        </Text>
      )}

      <Pressable onPress={onDemo} style={styles.demoBtn}>
        <Feather name="play-circle" size={14} color={colors.primary} />
        <Text style={[styles.demoText, { color: colors.primary }]}>Ver demo</Text>
      </Pressable>
    </View>
  );
}

function Meta({
  icon,
  label,
  colors,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.meta}>
      <Feather name={icon} size={13} color={colors.mutedForeground} />
      <Text style={[styles.metaText, { color: colors.foreground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, borderWidth: 1, marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  muscle: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  metaRow: { flexDirection: "row", gap: 16, marginTop: 12, flexWrap: "wrap" },
  meta: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  notes: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    marginTop: 12,
  },
  demoBtn: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 12 },
  demoText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
