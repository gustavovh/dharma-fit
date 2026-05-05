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
    <Pressable
      onPress={onDemo}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: re.completed ? colors.primary : colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
            {re.name || exercise?.name || "Ejercicio"}
          </Text>
          {(re.media || exercise?.videoUrl) && (
             <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
               <Feather name="image" size={12} color={colors.primary} />
               <Text style={[styles.muscle, { color: colors.primary, marginTop: 0 }]}>
                 Ver guía visual
               </Text>
             </View>
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

      {re.notes && re.notes.length > 0 && (
        <View style={{ marginTop: 12 }}>
          <Text style={[styles.notes, { color: colors.mutedForeground }]} numberOfLines={1}>
            “{re.notes[0]}...”
          </Text>
        </View>
      )}

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      </View>
    </Pressable>
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
  container: { padding: 16, borderWidth: 1, marginBottom: 12, position: "relative" },
  row: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  muscle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
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
  },
  footer: {
    position: "absolute",
    right: 8,
    bottom: 8,
  },
});
