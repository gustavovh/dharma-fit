import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, useWindowDimensions, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { RoleHeader } from "@/components/RoleHeader";
import { Card } from "@/components/Card";
import { LineChart } from "@/components/LineChart";
import { BarChart } from "@/components/BarChart";
import { SectionHeader } from "@/components/SectionHeader";
import { getMeasurements } from "@/lib/storage";
import { Measurement } from "@/types";

const CURRENT_USER_ID = "u1";

const ACHIEVEMENTS = [
  { icon: "zap", label: "Primer mes" },
  { icon: "award", label: "10 sesiones" },
  { icon: "trending-up", label: "+5 kg fuerza" },
  { icon: "target", label: "Meta peso" },
  { icon: "heart", label: "Cardio pro", locked: true },
  { icon: "shield", label: "100% asist.", locked: true },
];

export default function Progress() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(width, 600) - 80;
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [tab, setTab] = useState<"peso" | "grasa" | "medidas">("peso");

  useEffect(() => {
    (async () => setMeasurements(await getMeasurements(CURRENT_USER_ID)))();
  }, []);

  const weightData = measurements.map((m, i) => ({ x: i, y: m.weightKg }));
  const fatData = measurements.map((m, i) => ({ x: i, y: m.bodyFatPct }));
  const lastMeasure = measurements[measurements.length - 1];
  const measureData = lastMeasure
    ? [
        { label: "Cintura", value: lastMeasure.waistCm ?? 80 },
        { label: "Pecho", value: lastMeasure.chestCm ?? 100 },
        { label: "Brazo", value: lastMeasure.armCm ?? 35 },
        { label: "Pierna", value: lastMeasure.legCm ?? 55 },
      ]
    : [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <RoleHeader greeting="PROGRESO" title="Tu evolución" subtitle="Mide lo que mejoras" />

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 + (Platform.OS === "web" ? 0 : insets.bottom) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.tabRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {(["peso", "grasa", "medidas"] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[
                styles.tabBtn,
                tab === t && { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={{
                  color: tab === t ? colors.primaryForeground : colors.foreground,
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 13,
                  textTransform: "capitalize",
                }}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        <Card style={{ marginTop: 16 }}>
          <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>
            {tab === "peso" ? "PESO (KG)" : tab === "grasa" ? "GRASA CORPORAL (%)" : "MEDIDAS (CM)"}
          </Text>
          <Text style={[styles.bigValue, { color: colors.foreground }]}>
            {tab === "peso"
              ? `${lastMeasure?.weightKg ?? "—"} kg`
              : tab === "grasa"
                ? `${lastMeasure?.bodyFatPct ?? "—"}%`
                : "Hoy"}
          </Text>
          <View style={{ marginTop: 16 }}>
            {tab === "peso" && weightData.length > 1 && (
              <LineChart data={weightData} width={chartWidth} height={140} color={colors.primary} />
            )}
            {tab === "grasa" && fatData.length > 1 && (
              <LineChart data={fatData} width={chartWidth} height={140} color={colors.accent} />
            )}
            {tab === "medidas" && measureData.length > 0 && (
              <BarChart data={measureData} width={chartWidth} height={160} color={colors.primary} />
            )}
            {((tab === "peso" && weightData.length <= 1) || (tab === "grasa" && fatData.length <= 1)) && (
              <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 13 }}>
                Sin suficientes datos.
              </Text>
            )}
          </View>
        </Card>

        <SectionHeader title="Antes / Después" />
        <View style={{ flexDirection: "row", gap: 12 }}>
          {["Antes", "Después"].map((label) => (
            <View
              key={label}
              style={[
                styles.photoCard,
                { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
              ]}
            >
              <View
                style={[
                  styles.photoPlaceholder,
                  { backgroundColor: colors.secondary, borderRadius: colors.radius - 4 },
                ]}
              >
                <Feather name="image" size={28} color={colors.mutedForeground} />
              </View>
              <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 8 }}>
                {label}
              </Text>
            </View>
          ))}
        </View>

        <SectionHeader title="Logros" />
        <View style={styles.achievementsGrid}>
          {ACHIEVEMENTS.map((a, i) => (
            <View
              key={i}
              style={[
                styles.achievement,
                {
                  backgroundColor: colors.card,
                  borderColor: a.locked ? colors.border : colors.primary,
                  borderRadius: colors.radius,
                  opacity: a.locked ? 0.5 : 1,
                },
              ]}
            >
              <Feather
                name={a.icon as keyof typeof Feather.glyphMap}
                size={24}
                color={a.locked ? colors.mutedForeground : colors.primary}
              />
              <Text style={{ color: colors.foreground, fontFamily: "Inter_500Medium", fontSize: 11, textAlign: "center", marginTop: 8 }}>
                {a.label}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    padding: 4,
    borderWidth: 1,
    borderRadius: 999,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 999,
  },
  cardLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  bigValue: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    fontVariant: ["tabular-nums"],
    marginTop: 4,
  },
  photoCard: { flex: 1, padding: 12, borderWidth: 1 },
  photoPlaceholder: { aspectRatio: 1, alignItems: "center", justifyContent: "center" },
  achievementsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  achievement: {
    width: "30.5%",
    aspectRatio: 1,
    padding: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
