import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { RoleHeader } from "@/components/RoleHeader";
import { StatCard } from "@/components/StatCard";
import { SectionHeader } from "@/components/SectionHeader";
import { AlertBanner } from "@/components/AlertBanner";
import { ClientListItem } from "@/components/ClientListItem";
import { Card } from "@/components/Card";
import { getUsers } from "@/lib/storage";
import { User } from "@/types";

const TRAINER_ID = "t1";

export default function TrainerHome() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      const all = await getUsers();
      setUsers(all.filter((u) => u.trainerId === TRAINER_ID));
    })();
  }, []);

  const today = new Date();
  const expiring = users.filter((u) => u.planStatus === "por_vencer").length;
  const overdue = users.filter((u) => u.planStatus === "vencida").length;
  const todaysClients = users.slice(0, 3);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <RoleHeader
        greeting="ENTRENADOR"
        title="Hola, Roberto"
        subtitle={today.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}
        initials="RE"
        showLogo
      />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 + (Platform.OS === "web" ? 0 : insets.bottom) }}
      >
        {expiring > 0 && (
          <AlertBanner
            variant="warning"
            title={`${expiring} cliente${expiring > 1 ? "s" : ""} por vencer`}
            message="Comunícate con ellos para renovar su membresía."
            dismissible
          />
        )}

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Animated.View entering={FadeInDown.duration(300)} style={{ flex: 1 }}>
            <StatCard icon="users" label="Clientes activos" value={users.length} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(80).duration(300)} style={{ flex: 1 }}>
            <StatCard icon="alert-triangle" label="Por vencer" value={expiring} />
          </Animated.View>
        </View>
        <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
          <Animated.View entering={FadeInDown.delay(120).duration(300)} style={{ flex: 1 }}>
            <StatCard icon="calendar" label="Sesiones hoy" value={todaysClients.length} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(160).duration(300)} style={{ flex: 1 }}>
            <StatCard icon="x-octagon" label="Vencidos" value={overdue} />
          </Animated.View>
        </View>

        <SectionHeader title="Clientes de hoy" actionLabel="Ver todos" onAction={() => router.push("/(trainer)/clients")} />
        {todaysClients.map((u, i) => (
          <Animated.View key={u.id} entering={FadeInDown.delay(i * 60).duration(300)}>
            <ClientListItem
              user={u}
              progress={Math.random() * 0.6 + 0.2}
              onPress={() => router.push(`/client-detail/${u.id}`)}
            />
          </Animated.View>
        ))}

        <SectionHeader title="Resumen rápido" />
        <Card>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Feather name="message-square" size={20} color={colors.primary} />
            <Text style={{ color: colors.foreground, fontFamily: "Inter_500Medium", fontSize: 14, flex: 1 }}>
              3 mensajes nuevos de tus clientes
            </Text>
            <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
