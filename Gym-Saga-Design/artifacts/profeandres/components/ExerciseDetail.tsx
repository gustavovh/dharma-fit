import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { RoutineExercise } from "@/types";
import { BottomSheet } from "./BottomSheet";
import { Button } from "./Button";

interface Props {
  visible: boolean;
  onClose: () => void;
  exercise: RoutineExercise | null;
  onToggleComplete: () => void;
}

export function ExerciseDetail({ visible, onClose, exercise, onToggleComplete }: Props) {
  const colors = useColors();

  if (!exercise) return null;

  return (
    <BottomSheet visible={visible} onClose={onClose} title={exercise.name}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Visual Media */}
        <View style={styles.mediaContainer}>
          {exercise.media?.url ? (
            <Image
              source={{ uri: exercise.media.url }}
              style={[styles.media, { borderRadius: colors.radius }]}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={[styles.mediaPlaceholder, { backgroundColor: colors.muted, borderRadius: colors.radius }]}>
              <Feather name="image" size={48} color={colors.mutedForeground} />
              <Text style={{ color: colors.mutedForeground, marginTop: 8 }}>Sin guía visual</Text>
            </View>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatBox icon="repeat" label="Series" value={exercise.sets.toString()} colors={colors} />
          <StatBox icon="activity" label="Reps" value={exercise.reps} colors={colors} />
          <StatBox icon="trending-up" label="Peso" value={`${exercise.weightKg} kg`} colors={colors} />
          <StatBox icon="clock" label="Descanso" value={`${exercise.restSeconds || 60}s`} colors={colors} />
        </View>

        {/* Coach Notes */}
        {exercise.notes && exercise.notes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="message-circle" size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Indicaciones del Coach</Text>
            </View>
            <View style={[styles.notesContainer, { backgroundColor: colors.muted + "40", borderRadius: colors.radius }]}>
              {exercise.notes.map((note, index) => (
                <View key={index} style={styles.noteRow}>
                   <Text style={styles.noteIcon}>{note.includes("Descanso") ? "⏱️" : "👉"}</Text>
                   <Text style={[styles.noteText, { color: colors.foreground }]}>{note}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Completion Toggle */}
        <View style={{ marginTop: 24 }}>
          <Button
            title={exercise.completed ? "Marcado como Completado" : "Marcar como Completado"}
            onPress={onToggleComplete}
            variant={exercise.completed ? "outline" : "default"}
            icon={exercise.completed ? "check-circle" : "circle"}
          />
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

function StatBox({ icon, label, value, colors }: { icon: keyof typeof Feather.glyphMap, label: string, value: string, colors: any }) {
  return (
    <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Feather name={icon} size={16} color={colors.primary} />
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mediaContainer: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  media: {
    width: "100%",
    height: "100%",
  },
  mediaPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    minWidth: "45%",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  notesContainer: {
    padding: 16,
    gap: 12,
  },
  noteRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  noteIcon: {
    fontSize: 16,
  },
  noteText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    flex: 1,
    lineHeight: 20,
  },
});
