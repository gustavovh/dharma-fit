import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInRight } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { useColors } from "@/hooks/useColors";
import { AppHeader } from "@/components/RoleHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/Card";
import { getRoutinesForUser } from "@/lib/storage";
import { ExerciseCard } from "@/components/ExerciseCard";
import { ExerciseDetail } from "@/components/ExerciseDetail";
import { Button } from "@/components/Button";
import { Routine, RoutineExercise } from "@/types";

const CURRENT_USER_ID = "u1";

export default function Training() {
  const colors = useColors();
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

  const completedExercises = activeRoutine?.exercises.filter((exercise) => exercise.completed).length || 0;
  const totalExercises = activeRoutine?.exercises.length || 0;

  return (
    <LinearGradient colors={colors.gradientBackground} style={styles.screen}>
      <AppHeader
        title="Entrenamiento"
        subtitle={activeRoutine?.name || "Cargando..."}
        initials="AC"
      />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={colors.gradientHero} style={[styles.routineHero, { borderColor: colors.border }]}> 
          <View style={styles.heroHeader}>
            <View>
              <Text style={[styles.heroKicker, { color: colors.primary }]}>RUTINA DEL DIA</Text>
              <Text style={[styles.heroTitle, { color: colors.foreground }]}>{activeRoutine?.name || "Tu próxima sesión"}</Text>
              <Text style={[styles.heroSubtitle, { color: colors.mutedForeground }]}>Progresión inteligente con foco en ejecución y recuperación.</Text>
            </View>
            <View style={[styles.heroBadge, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <Text style={[styles.heroBadgeValue, { color: colors.foreground }]}>{completedExercises}/{totalExercises}</Text>
              <Text style={[styles.heroBadgeLabel, { color: colors.mutedForeground }]}>completados</Text>
            </View>
          </View>

          <View style={styles.heroMetaRow}>
            <MetaPill icon="clock" label={`${Math.max(totalExercises * 8, 30)} min`} colors={colors} />
            <MetaPill icon="zap" label="Intermedio" colors={colors} />
            <MetaPill icon="activity" label={`${totalExercises} ejercicios`} colors={colors} />
          </View>
        </LinearGradient>

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
                  { backgroundColor: isActive ? colors.secondary : colors.card, borderColor: isActive ? colors.primary : colors.border, shadowColor: isActive ? colors.primary : colors.shadow }
                ]}
              >
                <Text style={[styles.dayText, { color: isActive ? colors.primary : colors.mutedForeground }]}> 
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <SectionHeader title="Ejercicios" actionLabel="Rutinas" onAction={() => setActiveRoutine(routines[0])} />
        
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
              <Card style={styles.miniCard} variant="gold">
                <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 16 }}>{r.name}</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 6 }}>
                  {r.exercises.length} ejercicios
                </Text>
                <Text style={{ color: colors.primary, fontSize: 12, marginTop: 14, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.6 }}>
                  Cambiar rutina
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

      <View style={styles.ctaContainer}>
        <Button
          title="Start Workout"
          onPress={() => {
            if (activeRoutine?.exercises[0]) {
              handleOpenDetail(activeRoutine.exercises[0]);
            }
          }}
          icon="play-circle"
        />
      </View>
    </LinearGradient>
  );
}

function MetaPill({ icon, label, colors }: { icon: keyof typeof Feather.glyphMap; label: string; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={[styles.metaPill, { backgroundColor: colors.secondary, borderColor: colors.border }]}> 
      <Feather name={icon} size={14} color={colors.primary} />
      <Text style={[styles.metaPillText, { color: colors.foreground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  routineHero: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
  },
  heroKicker: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.1,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    marginTop: 8,
    maxWidth: 220,
  },
  heroSubtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
    lineHeight: 20,
    maxWidth: 220,
  },
  heroBadge: {
    minWidth: 88,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  heroBadgeValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  heroBadgeLabel: { fontSize: 11, fontFamily: "Inter_500Medium", marginTop: 3, textTransform: "uppercase" },
  heroMetaRow: { flexDirection: "row", gap: 10, marginTop: 18, flexWrap: "wrap" },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  metaPillText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  miniCard: { width: 170, marginRight: 12 },
  ctaContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 22,
  },
  dayPicker: { flexDirection: "row", gap: 8, marginBottom: 24 },
  dayButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  dayText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
