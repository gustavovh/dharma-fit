import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { RoleHeader } from "@/components/RoleHeader";
import { StatCard } from "@/components/StatCard";
import { SectionHeader } from "@/components/SectionHeader";
import { AlertBanner } from "@/components/AlertBanner";
import { LineChart } from "@/components/LineChart";
import { Card } from "@/components/Card";
import {
  getUser,
  getRoutinesForUser,
  getMeasurements,
  getPayments,
  getPlans,
} from "@/lib/storage";
import { Routine, Measurement, Payment, Plan, User } from "@/types";

const CURRENT_USER_ID = "u1";

function daysUntil(dateStr?: string) {
  if (!dateStr) return 0;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export default function UserHome() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | undefined>();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    (async () => {
      setUser(await getUser(CURRENT_USER_ID));
      setRoutines(await getRoutinesForUser(CURRENT_USER_ID));
      setMeasurements(await getMeasurements(CURRENT_USER_ID));
      setPayments((await getPayments()).filter((p) => p.userId === CURRENT_USER_ID));
      setPlans(await getPlans());
    })();
  }, []);

  const today = new Date();
  const dayOfWeek = ((today.getDay() + 6) % 7) + 1;
  const todayRoutine = routines.find((r) => r.dayOfWeek === dayOfWeek);
  const plan = plans.find((p) => p.id === user?.planId);
  const daysLeft = daysUntil(user?.planExpiry);
  const nextPayment = payments.find((p) => p.status === "pending");
  const sparkData = measurements.slice(-7).map((m, i) => ({ x: i, y: m.weightKg }));
  const greeting = today.getHours() < 12 ? "Buenos días" : today.getHours() < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <RoleHeader
        greeting={greeting}
        title={user?.name?.split(" ")[0] || "Atleta"}
        subtitle={today.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}
        initials={user?.avatar || "AC"}
        showLogo
      />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 + (Platform.OS === "web" ? 0 : insets.bottom) }}
        showsVerticalScrollIndicator={false}
      >
        {daysLeft <= 7 && daysLeft > 0 && (
          <AlertBanner
            variant="warning"
            title="Tu membresía vence pronto"
            message={`Quedan ${daysLeft} días. Renueva para no perder acceso.`}
            dismissible
          />
        )}
        {nextPayment && (
          <AlertBanner
            variant="error"
            title="Pago pendiente"
            message={`$${nextPayment.amount} con vencimiento próximo`}
            dismissible
          />
        )}

        <Animated.View entering={FadeInDown.duration(400)}>
          <Pressable onPress={() => router.push("/(user)/routine")}>
            <View style={{ borderRadius: colors.radius, overflow: "hidden" }}>
              <LinearGradient
                colors={["rgba(212,175,55,0.30)", "rgba(212,175,55,0.05)", colors.card]}
                style={[styles.heroCard, { borderColor: colors.primary }]}
              >
                <Text style={[styles.heroLabel, { color: colors.primary }]}>RUTINA DE HOY</Text>
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
                    {todayRoutine ? "Empezar entrenamiento" : "Ver semana"}
                  </Text>
                  <Feather name="arrow-right" size={16} color={colors.primaryForeground} />
                </View>
              </LinearGradient>
            </View>
          </Pressable>
        </Animated.View>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
          <Animated.View entering={FadeInDown.delay(80).duration(400)} style={{ flex: 1 }}>
            <StatCard
              icon="trending-up"
              label="Peso actual"
              value={`${user?.weightKg ?? "—"} kg`}
              delta={{ value: "-2 kg", positive: true }}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(120).duration(400)} style={{ flex: 1 }}>
            <StatCard
              icon="calendar"
              label="Vencimiento"
              value={`${daysLeft}d`}
            />
          </Animated.View>
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
          <Animated.View entering={FadeInDown.delay(160).duration(400)} style={{ flex: 1 }}>
            <StatCard
              icon="credit-card"
              label="Próximo pago"
              value={nextPayment ? `$${nextPayment.amount}` : "—"}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ flex: 1 }}>
            <StatCard
              icon="award"
              label="Plan"
              value={plan?.name ?? "—"}
            />
          </Animated.View>
        </View>

        <SectionHeader title="Próximo entrenamiento" />
        <Card>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: colors.secondary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="zap" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 15 }}>
                Mañana, 07:30
              </Text>
              <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 }}>
                Sesión personal con tu entrenador
              </Text>
            </View>
          </View>
        </Card>

        <SectionHeader title="Progreso reciente" actionLabel="Ver más" onAction={() => router.push("/(user)/progress")} />
        <Card>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12 }}>
              ÚLTIMOS 7 REGISTROS
            </Text>
            <Text style={{ color: colors.accent, fontFamily: "Inter_700Bold", fontSize: 16 }}>
              -2.0 kg
            </Text>
          </View>
          {sparkData.length > 1 ? (
            <LineChart data={sparkData} width={300} height={80} color={colors.accent} />
          ) : (
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 13 }}>
              Aún no hay suficientes mediciones.
            </Text>
          )}
        </Card>
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
});
