import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInRight } from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";
import { AppHeader } from "@/components/RoleHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/Card";
import { getRoutinesForUser } from "@/lib/storage";
import { ExerciseCard } from "@/components/ExerciseCard";
import { ExerciseDetail } from "@/components/ExerciseDetail";
import { Routine, RoutineExercise } from "@/types";

const CURRENT_USER_ID = "u1";

export default function Training() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [activeRoutine, setActiveRoutine] = useState<Routine | undefined>();
  const [selectedExercise, setSelectedExercise] = useState<RoutineExercise | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getRoutinesForUser(CURRENT_USER_ID);
      setRoutines(data);
      const today = ((new Date().getDay() + 6) % 7) + 1;
      setActiveRoutine(data.find((r) => r.dayOfWeek === today) || data[0]);
    })();
  }, []);

  const toggleExercise = (exerciseId: string) => {
    if (!activeRoutine) return;
    const updated = {
      ...activeRoutine,
      exercises: activeRoutine.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      ),
    };
    setActiveRoutine(updated);
    // If detail is open, update the selected exercise state too
    if (selectedExercise?.id === exerciseId) {
      setSelectedExercise(updated.exercises.find(ex => ex.id === exerciseId) || null);
    }
  };

  const handleOpenDetail = (exercise: RoutineExercise) => {
    setSelectedExercise(exercise);
    setDetailVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader
        title="Entrenamiento"
        subtitle={activeRoutine?.name || "Cargando..."}
        initials="AC"
      />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dayPicker}>
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day, index) => {
            const dayNum = index + 1;
            const isActive = activeRoutine?.dayOfWeek === dayNum;
            return (
              <Pressable
                key={day}
                onPress={() => {
                  const found = routines.find(r => r.dayOfWeek === dayNum);
                  if (found) setActiveRoutine(found);
                }}
                style={[
                  styles.dayButton,
                  { backgroundColor: isActive ? colors.primary : colors.card, borderColor: isActive ? colors.primary : colors.border }
                ]}
              >
                <Text style={[styles.dayText, { color: isActive ? colors.primaryForeground : colors.mutedForeground }]}>
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <SectionHeader title={activeRoutine?.name || "Rutina"} />
        
        {activeRoutine?.exercises.map((exercise, index) => (
          <Animated.View
            key={exercise.id}
            entering={FadeInRight.delay(index * 100).duration(400)}
          >
            <ExerciseCard
              routineExercise={exercise}
              onToggle={() => toggleExercise(exercise.id)}
              onDemo={() => handleOpenDetail(exercise)}
            />
          </Animated.View>
        ))}

        <SectionHeader title="Otras rutinas" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
          {routines.filter(r => r.id !== activeRoutine?.id).map((r) => (
            <Pressable key={r.id} onPress={() => setActiveRoutine(r)}>
              <Card style={styles.miniCard}>
                <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>{r.name}</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 4 }}>
                  {r.exercises.length} ejercicios
                </Text>
              </Card>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>

      <ExerciseDetail
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        exercise={selectedExercise}
        onToggleComplete={() => selectedExercise && toggleExercise(selectedExercise.id)}
      />

      <View style={[styles.fabContainer, { bottom: 20 }]}>
        <Pressable style={[styles.fab, { backgroundColor: colors.primary }]}>
          <Feather name="plus" size={24} color={colors.primaryForeground} />
          <Text style={[styles.fabText, { color: colors.primaryForeground }]}>Nueva sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseCard: { marginBottom: 12, borderWidth: 1, borderColor: "transparent" },
  exerciseHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  exerciseMeta: { fontSize: 13, marginTop: 4 },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  miniCard: { width: 140, marginRight: 12 },
  fabContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    alignItems: "center",
  },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  dayPicker: { flexDirection: "row", gap: 8, marginBottom: 24 },
  dayButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  dayText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
