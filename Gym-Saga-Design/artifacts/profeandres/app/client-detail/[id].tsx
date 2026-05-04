import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, useWindowDimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { Avatar } from "@/components/Avatar";
import { StatusPill } from "@/components/StatusPill";
import { TopTabs } from "@/components/TopTabs";
import { Card } from "@/components/Card";
import { LineChart } from "@/components/LineChart";
import { Calendar } from "@/components/Calendar";
import { EmptyState } from "@/components/EmptyState";
import {
  getUser,
  getMeasurements,
  getRoutinesForUser,
  getObservations,
  getAttendance,
} from "@/lib/storage";
import { MOCK_EXERCISES } from "@/lib/mockData";
import { User, Measurement, Routine, Observation, Attendance } from "@/types";

const TABS = ["Medidas", "Rutinas", "Observaciones", "Asistencia"];

export default function ClientDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(width, 600) - 80;
  const [tab, setTab] = useState<string>(TABS[0]);
  const [user, setUser] = useState<User | undefined>();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setUser(await getUser(id));
      setMeasurements(await getMeasurements(id));
      setRoutines(await getRoutinesForUser(id));
      const obs = await getObservations();
      setObservations(obs.filter((o) => o.userId === id));
      const att = await getAttendance();
      setAttendance(att.filter((a) => a.userId === id));
    })();
  }, [id]);

  const exerciseMap = useMemo(() => {
    const map: Record<string, string> = {};
    MOCK_EXERCISES.forEach((e) => (map[e.id] = e.name));
    return map;
  }, []);

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <EmptyState icon="user-x" title="Cliente no encontrado" subtitle="" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 20, alignItems: "center" }}>
        <Avatar initials={user.avatar || "??"} size={72} />
        <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 20, marginTop: 12 }}>
          {user.name}
        </Text>
        <View style={{ marginTop: 6 }}>
          <StatusPill status={user.planStatus} />
        </View>
      </View>

      <TopTabs tabs={TABS} active={tab} onChange={setTab} />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 24 + (Platform.OS === "web" ? 34 : insets.bottom) }}>
        {tab === "Medidas" &&
          (measurements.length === 0 ? (
            <EmptyState icon="bar-chart-2" title="Sin mediciones" subtitle="Aún no se registraron medidas." />
          ) : (
            <>
              <Card>
                <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 11, textTransform: "uppercase" }}>
                  PESO HISTÓRICO
                </Text>
                <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 28, marginVertical: 8 }}>
                  {measurements[measurements.length - 1].weightKg} kg
                </Text>
                <LineChart
                  data={measurements.map((m, i) => ({ x: i, y: m.weightKg }))}
                  width={chartWidth}
                  height={120}
                  color={colors.primary}
                />
              </Card>
              <Card style={{ marginTop: 12 }}>
                {measurements.slice().reverse().map((m, i) => (
                  <View key={m.id} style={{ paddingVertical: 10, borderBottomWidth: i === measurements.length - 1 ? 0 : 1, borderBottomColor: colors.border }}>
                    <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
                      {m.weightKg} kg · {m.bodyFatPct}% grasa
                    </Text>
                    <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 }}>
                      {new Date(m.date).toLocaleDateString("es")}
                    </Text>
                  </View>
                ))}
              </Card>
            </>
          ))}

        {tab === "Rutinas" &&
          (routines.length === 0 ? (
            <EmptyState icon="activity" title="Sin rutinas" subtitle="Este cliente aún no tiene rutinas." />
          ) : (
            routines.map((r) => (
              <Card key={r.id} style={{ marginBottom: 12 }}>
                <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 15 }}>
                  {r.name}
                </Text>
                <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 4 }}>
                  {r.exercises.length} ejercicios
                </Text>
                <View style={{ marginTop: 12, gap: 6 }}>
                  {r.exercises.map((re) => (
                    <View key={re.id} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Feather name={re.completed ? "check-circle" : "circle"} size={14} color={re.completed ? colors.accent : colors.mutedForeground} />
                      <Text style={{ color: colors.foreground, fontFamily: "Inter_400Regular", fontSize: 13 }}>
                        {exerciseMap[re.exerciseId]} · {re.sets}×{re.reps}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            ))
          ))}

        {tab === "Observaciones" &&
          (observations.length === 0 ? (
            <EmptyState icon="file-text" title="Sin observaciones" subtitle="Aún no hay notas." />
          ) : (
            observations.map((o) => (
              <Card key={o.id} style={{ marginBottom: 10 }}>
                <Text style={{ color: colors.primary, fontFamily: "Inter_700Bold", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {o.type}
                </Text>
                <Text style={{ color: colors.foreground, fontFamily: "Inter_400Regular", fontSize: 14, marginTop: 6, lineHeight: 20 }}>
                  {o.content}
                </Text>
                <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 11, marginTop: 6 }}>
                  {new Date(o.date).toLocaleDateString("es")}
                </Text>
              </Card>
            ))
          ))}

        {tab === "Asistencia" && (
          <Card>
            <Calendar
              year={new Date().getFullYear()}
              month={new Date().getMonth()}
              attended={new Set(attendance.map((a) => a.date))}
            />
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
