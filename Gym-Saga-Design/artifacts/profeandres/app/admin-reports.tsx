import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { Card } from "@/components/Card";
import { LineChart } from "@/components/LineChart";
import { BarChart } from "@/components/BarChart";
import { Button } from "@/components/Button";
import { SectionHeader } from "@/components/SectionHeader";

const REPORTS = [
  { id: "ingresos", label: "Ingresos", icon: "dollar-sign", description: "Por mes / plan" },
  { id: "asistencia", label: "Asistencia", icon: "log-in", description: "Promedio diario y semanal" },
  { id: "retencion", label: "Retención", icon: "users", description: "Renovaciones vs bajas" },
  { id: "rutinas", label: "Rutinas", icon: "activity", description: "Cumplimiento por cliente" },
] as const;

type ReportId = (typeof REPORTS)[number]["id"];

export default function AdminReports() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(width, 600) - 80;
  const [selected, setSelected] = useState<ReportId | null>(null);

  if (selected) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 20, paddingBottom: 24 + (Platform.OS === "web" ? 34 : insets.bottom) }}
      >
        <Pressable onPress={() => setSelected(null)} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }}>
          <Feather name="chevron-left" size={20} color={colors.primary} />
          <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>Reportes</Text>
        </Pressable>
        <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 24, textTransform: "capitalize" }}>
          {REPORTS.find((r) => r.id === selected)?.label}
        </Text>
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 4 }}>
          Período: últimos 6 meses
        </Text>

        <Card style={{ marginTop: 16 }}>
          {selected === "ingresos" || selected === "retencion" ? (
            <LineChart
              data={[
                { x: 0, y: 1200 },
                { x: 1, y: 1450 },
                { x: 2, y: 1380 },
                { x: 3, y: 1620 },
                { x: 4, y: 1810 },
                { x: 5, y: 1990 },
              ]}
              width={chartWidth}
              height={160}
              color={colors.primary}
            />
          ) : (
            <BarChart
              data={[
                { label: "Lun", value: 24 },
                { label: "Mar", value: 31 },
                { label: "Mié", value: 28 },
                { label: "Jue", value: 35 },
                { label: "Vie", value: 42 },
              ]}
              width={chartWidth}
              height={180}
              color={colors.accent}
            />
          )}
        </Card>

        <SectionHeader title="Detalle" />
        <Card>
          <Row label="Total" value="$9,450" colors={colors} />
          <Row label="Promedio mensual" value="$1,575" colors={colors} />
          <Row label="Crecimiento" value="+18%" colors={colors} positive />
          <Row label="Top plan" value="Trimestral" colors={colors} />
        </Card>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
          <Button
            title="Exportar PDF"
            variant="secondary"
            onPress={() => Alert.alert("Exportar", "PDF generado en demo.")}
            style={{ flex: 1 }}
          />
          <Button
            title="Exportar Excel"
            variant="secondary"
            onPress={() => Alert.alert("Exportar", "Excel generado en demo.")}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: 24 + (Platform.OS === "web" ? 34 : insets.bottom) }}
    >
      <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 22 }}>
        Reportes
      </Text>
      <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 4, marginBottom: 16 }}>
        Visualiza el comportamiento de tu gimnasio
      </Text>

      {REPORTS.map((r) => (
        <Pressable
          key={r.id}
          onPress={() => setSelected(r.id)}
          style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.secondary }]}>
            <Feather name={r.icon as keyof typeof Feather.glyphMap} size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 15 }}>{r.label}</Text>
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 }}>{r.description}</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

function Row({ label, value, colors, positive }: { label: string; value: string; colors: ReturnType<typeof useColors>; positive?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 13 }}>{label}</Text>
      <Text
        style={{
          color: positive ? colors.accent : colors.foreground,
          fontFamily: "Inter_700Bold",
          fontSize: 14,
          fontVariant: ["tabular-nums"],
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12, borderWidth: 1, marginBottom: 10 },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
