import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { RoutineExercise, Exercise } from "@/types";
import { LinearGradient } from "expo-linear-gradient";

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
          shadowColor: re.completed ? colors.primary : colors.shadow,
        },
      ]}
    >
      <View style={styles.row}>
        {re.media?.url ? (
          <Image source={{ uri: re.media.url }} style={styles.media} contentFit="cover" transition={200} />
        ) : (
          <LinearGradient colors={colors.gradientCard} style={[styles.media, styles.mediaPlaceholder]}>
            <Feather name="image" size={22} color={colors.mutedForeground} />
          </LinearGradient>
        )}

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.kicker, { color: colors.primary }]}>EJERCICIO</Text>
              <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
                {re.name || exercise?.name || "Ejercicio"}
              </Text>
            </View>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onToggle();
              }}
              style={[
                styles.checkbox,
                {
                  backgroundColor: re.completed ? colors.primary : colors.secondary,
                  borderColor: re.completed ? colors.primary : colors.border,
                },
              ]}
            >
              {re.completed && (
                <Feather name="check" size={16} color={colors.primaryForeground} />
              )}
            </Pressable>
          </View>

          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
            {`${re.sets} series x ${re.reps} repeticiones`}
          </Text>
          {(re.media || exercise?.videoUrl) && (
            <View style={styles.visualHint}>
              <Feather name="play-circle" size={12} color={colors.accent} />
              <Text style={[styles.muscle, { color: colors.accent, marginTop: 0 }]}>Demo visual disponible</Text>
            </View>
          )}

          <View style={styles.metaRow}>
            <Meta icon="repeat" label={`${re.sets}x${re.reps}`} colors={colors} />
            {re.weightKg != null && (
              <Meta icon="trending-up" label={`${re.weightKg} kg`} colors={colors} />
            )}
            {re.restSeconds != null && (
              <Meta icon="clock" label={`${re.restSeconds}s`} colors={colors} />
            )}
          </View>

          {re.notes && re.notes.length > 0 && (
            <View style={styles.noteWrap}>
              <Text style={[styles.notes, { color: colors.mutedForeground }]} numberOfLines={2}>
                {re.notes[0]}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.primary }]}>Ver detalle</Text>
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
  container: {
    padding: 14,
    borderWidth: 1,
    marginBottom: 14,
    position: "relative",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
  },
  row: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  media: {
    width: 94,
    height: 114,
    borderRadius: 16,
  },
  mediaPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1 },
  titleRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  kicker: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
    marginBottom: 4,
  },
  name: { fontSize: 16, fontFamily: "Inter_600SemiBold", lineHeight: 22 },
  muscle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  visualHint: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
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
  noteWrap: {
    marginTop: 12,
    paddingTop: 12,
  },
  notes: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 12,
  },
  footerText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});
