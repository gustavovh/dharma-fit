import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { RoleHeader } from "@/components/RoleHeader";
import { ExerciseCard } from "@/components/ExerciseCard";
import { ProgressBar } from "@/components/ProgressBar";
import { EmptyState } from "@/components/EmptyState";
import {
  getRoutinesForUser,
  markExerciseComplete,
} from "@/lib/storage";
import { MOCK_EXERCISES } from "@/lib/mockData";
import { Routine } from "@/types";

const CURRENT_USER_ID = "u1";
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function MyRoutine() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const today = ((new Date().getDay() + 6) % 7) + 1;
  const [selectedDay, setSelectedDay] = useState<number>(today);
  const [routines, setRoutines] = useState<Routine[]>([]);

  const load = async () => {
    setRoutines(await getRoutinesForUser(CURRENT_USER_ID));
  };

  useEffect(() => {
    load();
  }, []);

  const routine = routines.find((r) => r.dayOfWeek === selectedDay);
  const exercises = routine?.exercises ?? [];
  const completed = exercises.filter((e) => e.completed).length;
  const progress = exercises.length ? completed / exercises.length : 0;

  const exerciseMap = useMemo(() => {
    const map: Record<string, (typeof MOCK_EXERCISES)[number]> = {};
    MOCK_EXERCISES.forEach((e) => (map[e.id] = e));
    return map;
  }, []);

  const handleToggle = async (exerciseId: string, currentlyDone: boolean) => {
    if (!routine) return;
    await markExerciseComplete(routine.id, exerciseId, !currentlyDone);
    await load();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <RoleHeader greeting="MI RUTINA" title="Esta semana" subtitle="Ve tus ejercicios y márcalos al terminar" />

      <View style={{ paddingHorizontal: 20 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
        >
          {DAYS.map((d, i) => {
            const dayNum = i + 1;
            const active = dayNum === selectedDay;
            const isToday = dayNum === today;
            return (
              <Pressable
                key={d}
                onPress={() => setSelectedDay(dayNum)}
                style={[
                  styles.dayPill,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: active ? colors.primaryForeground : colors.foreground },
                  ]}
                >
                  {d}
                </Text>
                {isToday && !active && (
                  <View style={[styles.todayDot, { backgroundColor: colors.primary }]} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {exercises.length > 0 && (
        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <View style={styles.progressHeader}>
            <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
              {routine?.name || "Sesión"}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 13 }}>
              {completed} / {exercises.length}
            </Text>
          </View>
          <ProgressBar progress={progress} />
          {progress === 1 && (
            <View
              style={[
                styles.successBanner,
                { backgroundColor: `${colors.accent}20`, borderColor: colors.accent },
              ]}
            >
              <Feather name="award" size={18} color={colors.accent} />
              <Text style={{ color: colors.accent, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
                Rutina terminada. Excelente trabajo.
              </Text>
            </View>
          )}
        </View>
      )}

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120 + (Platform.OS === "web" ? 0 : insets.bottom),
        }}
        showsVerticalScrollIndicator={false}
      >
        {exercises.length === 0 ? (
          <EmptyState
            icon="moon"
            title="Día de descanso"
            subtitle="No hay ejercicios programados para este día. Recupera energía."
          />
        ) : (
          exercises.map((re, i) => (
            <Animated.View key={re.id} entering={FadeInDown.delay(i * 60).duration(300)}>
              <ExerciseCard
                routineExercise={re}
                exercise={exerciseMap[re.exerciseId]}
                onToggle={() => handleToggle(re.id, re.completed)}
                onDemo={() => router.push(`/exercise-detail/${re.exerciseId}`)}
              />
            </Animated.View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dayPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 60,
    alignItems: "center",
    position: "relative",
  },
  dayText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  todayDot: {
    position: "absolute",
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  successBanner: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
});
