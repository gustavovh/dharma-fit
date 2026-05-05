import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { AppHeader } from "@/components/RoleHeader";
import { StatCard } from "@/components/StatCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/Card";
import {
  getUser,
  getRoutinesForUser,
  getMeasurements,
} from "@/lib/storage";
import { Routine, Measurement, User } from "@/types";

const CURRENT_USER_ID = "u1";

export default function Home() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | undefined>();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  useEffect(() => {
    (async () => {
      setUser(await getUser(CURRENT_USER_ID));
      setRoutines(await getRoutinesForUser(CURRENT_USER_ID));
      setMeasurements(await getMeasurements(CURRENT_USER_ID));
    })();
  }, []);

  const today = new Date();
  const dayOfWeek = ((today.getDay() + 6) % 7) + 1;
  const todayRoutine = routines.find((r) => r.dayOfWeek === dayOfWeek);
  const greeting = today.getHours() < 12 ? "Buenos días" : today.getHours() < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader
        greeting={greeting}
        title={user?.name?.split(" ")[0] || "Atleta"}
        subtitle={today.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}
        initials={user?.avatar || "AC"}
        showLogo
      />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <Pressable onPress={() => router.push("/(tabs)/training")}>
            <View style={{ borderRadius: colors.radius, overflow: "hidden" }}>
              <LinearGradient
                colors={["rgba(255,77,79,0.2)", "rgba(255,77,79,0.05)", colors.card]}
                style={[styles.heroCard, { borderColor: colors.primary }]}
              >
                <Text style={[styles.heroLabel, { color: colors.primary }]}>ENTRENAMIENTO DE HOY</Text>
                <Text style={[styles.heroTitle, { color: colors.foreground }]}>
                  {todayRoutine?.name || "Día de descanso"}
                </Text>
                <View style={styles.heroMeta}>
                  <View style={styles.heroMetaItem}>
                    <Feather name="list" size={14} color={colors.foreground} />
                    <Text style={[styles.heroMetaText, { color: colors.foreground }]}>
                      {todayRoutine?.exercises.length || 0} ejercicios
                    </Text>
                  </View>
                  <View style={styles.heroMetaItem}>
                    <Feather name="clock" size={14} color={colors.foreground} />
                    <Text style={[styles.heroMetaText, { color: colors.foreground }]}>
                      ≈ {(todayRoutine?.exercises.length || 0) * 8} min
                    </Text>
                  </View>
                </View>
                <View style={[styles.heroCTA, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.heroCTAText, { color: colors.primaryForeground }]}>
                    {todayRoutine ? "Empezar sesión" : "Ver calendario"}
                  </Text>
                  <Feather name="play" size={16} color={colors.primaryForeground} />
                </View>
              </LinearGradient>
            </View>
          </Pressable>
        </Animated.View>

        <SectionHeader title="Actividad diaria" />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={{ flex: 1 }}>
            <StatCard
              icon="zap"
              label="Calorías"
              value="450"
              delta={{ value: "de 600", positive: true }}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ flex: 1 }}>
            <StatCard
              icon="map-pin"
              label="Pasos"
              value="8,540"
              delta={{ value: "85%", positive: true }}
            />
          </Animated.View>
        </View>

        <SectionHeader title="Tu Progreso" />
        <Card>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <View style={[styles.progressCircle, { borderColor: colors.primary }]}>
              <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 18 }}>75%</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 16 }}>
                Objetivo Semanal
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 4 }}>
                Has completado 3 de 4 entrenamientos programados.
              </Text>
            </View>
          </View>
        </Card>

        <SectionHeader title="Salud" />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={{ flex: 1 }}>
            <StatCard
              icon="heart"
              label="Ritmo Cardíaco"
              value="68 bpm"
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(400).duration(400)} style={{ flex: 1 }}>
            <StatCard
              icon="moon"
              label="Sueño"
              value="7h 20m"
            />
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: { padding: 24, borderWidth: 1, borderRadius: 16 },
  heroLabel: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  heroTitle: { fontSize: 28, fontFamily: "Inter_700Bold", marginTop: 8 },
  heroMeta: { flexDirection: "row", gap: 18, marginTop: 12 },
  heroMetaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  heroMetaText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  heroCTA: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  heroCTAText: { fontSize: 14, fontFamily: "Inter_700Bold", letterSpacing: 0.3 },
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
