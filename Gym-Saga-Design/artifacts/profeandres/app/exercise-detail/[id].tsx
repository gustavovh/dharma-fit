import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { MOCK_EXERCISES } from "@/lib/mockData";

export default function ExerciseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const exercise = useMemo(() => MOCK_EXERCISES.find((e) => e.id === id), [id]);

  if (!exercise) {
    return <EmptyState icon="alert-circle" title="Ejercicio no encontrado" subtitle="" />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: 24 + (Platform.OS === "web" ? 34 : insets.bottom) }}
    >
      <View
        style={{
          aspectRatio: 16 / 9,
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: `${colors.primary}30`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="play" size={28} color={colors.primary} />
        </View>
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 12 }}>
          Demo en video
        </Text>
      </View>

      <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 24, marginTop: 20 }}>
        {exercise.name}
      </Text>
      <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold", fontSize: 12, marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {exercise.muscleGroup}
      </Text>

      <SectionHeader title="Configuración base" />
      <Card>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Stat label="Sets" value={exercise.defaultSets} colors={colors} />
          <Stat label="Reps" value={exercise.defaultReps} colors={colors} />
          <Stat label="Descanso" value="60s" colors={colors} />
        </View>
      </Card>

      <SectionHeader title="Cómo hacerlo" />
      <Card>
        <Step n={1} text="Posiciona tu cuerpo correctamente alineado." colors={colors} />
        <Step n={2} text="Ejecuta el movimiento con control en ambas fases." colors={colors} />
        <Step n={3} text="Mantén la respiración constante." colors={colors} />
        <Step n={4} text="No comprometas la técnica por el peso." colors={colors} />
      </Card>

      <SectionHeader title="Tips" />
      <Card>
        <Text style={{ color: colors.foreground, fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 22 }}>
          Calienta siempre antes de empezar. Si sientes dolor agudo, detente y consulta con tu entrenador. La calidad supera la cantidad.
        </Text>
      </Card>
    </ScrollView>
  );
}

function Stat({ label, value, colors }: { label: string; value: number | string; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 24, fontVariant: ["tabular-nums"] }}>
        {value}
      </Text>
      <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 }}>
        {label}
      </Text>
    </View>
  );
}

function Step({ n, text, colors }: { n: number; text: string; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={{ flexDirection: "row", gap: 12, paddingVertical: 8 }}>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: colors.primaryForeground, fontFamily: "Inter_700Bold", fontSize: 12 }}>{n}</Text>
      </View>
      <Text style={{ color: colors.foreground, fontFamily: "Inter_400Regular", fontSize: 14, flex: 1, lineHeight: 22 }}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
