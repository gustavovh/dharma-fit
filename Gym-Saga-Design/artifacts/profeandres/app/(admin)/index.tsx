import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, Platform } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { RoleHeader } from "@/components/RoleHeader";
import { StatCard } from "@/components/StatCard";
import { SectionHeader } from "@/components/SectionHeader";
import { LineChart } from "@/components/LineChart";
import { BarChart } from "@/components/BarChart";
import { Card } from "@/components/Card";
import { getUsers, getPayments, getAttendance } from "@/lib/storage";

export default function AdminDashboard() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(width, 600) - 80;
  const [stats, setStats] = useState({ users: 0, active: 0, expiring: 0, overdue: 0, monthly: 0, today: 0 });

  useEffect(() => {
    (async () => {
      const users = await getUsers();
      const payments = await getPayments();
      const attendance = await getAttendance();
      const month = new Date().getMonth();
      const monthly = payments.filter((p) => p.status === "paid" && new Date(p.date).getMonth() === month).reduce((s, p) => s + p.amount, 0);
      const todayDate = new Date().toISOString().split("T")[0];
      setStats({
        users: users.length,
        active: users.filter((u) => u.planStatus === "activa").length,
        expiring: users.filter((u) => u.planStatus === "por_vencer").length,
        overdue: users.filter((u) => u.planStatus === "vencida").length,
        monthly,
        today: attendance.filter((a) => a.date === todayDate).length,
      });
    })();
  }, []);

  const revenueData = [
    { x: 0, y: 1200 },
    { x: 1, y: 1450 },
    { x: 2, y: 1380 },
    { x: 3, y: 1620 },
    { x: 4, y: 1810 },
    { x: 5, y: 1990 },
  ];

  const attendanceWeek = [
    { label: "Lun", value: 24 },
    { label: "Mar", value: 31 },
    { label: "Mié", value: 28 },
    { label: "Jue", value: 35 },
    { label: "Vie", value: 42 },
    { label: "Sáb", value: 38 },
    { label: "Dom", value: 18 },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <RoleHeader greeting="DASHBOARD" title="profeandres" subtitle="Operación en tiempo real" initials="PA" showLogo />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 + (Platform.OS === "web" ? 0 : insets.bottom) }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Animated.View entering={FadeInDown.duration(300)} style={{ flex: 1 }}>
            <StatCard icon="users" label="Total clientes" value={stats.users} delta={{ value: "+3", positive: true }} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(60).duration(300)} style={{ flex: 1 }}>
            <StatCard icon="check-circle" label="Activos" value={stats.active} />
          </Animated.View>
        </View>
        <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
          <Animated.View entering={FadeInDown.delay(120).duration(300)} style={{ flex: 1 }}>
            <StatCard icon="alert-triangle" label="Por vencer" value={stats.expiring} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(180).duration(300)} style={{ flex: 1 }}>
            <StatCard icon="x-octagon" label="Vencidos" value={stats.overdue} />
          </Animated.View>
        </View>
        <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
          <Animated.View entering={FadeInDown.delay(240).duration(300)} style={{ flex: 1 }}>
            <StatCard icon="dollar-sign" label="Ingresos mes" value={`$${stats.monthly}`} delta={{ value: "+18%", positive: true }} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(300).duration(300)} style={{ flex: 1 }}>
            <StatCard icon="log-in" label="Hoy" value={stats.today} />
          </Animated.View>
        </View>

        <SectionHeader title="Ingresos últimos 6 meses" />
        <Card>
          <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 28, fontVariant: ["tabular-nums"] }}>
            $9,450
          </Text>
          <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12, marginBottom: 16 }}>
            Total acumulado
          </Text>
          <LineChart data={revenueData} width={chartWidth} height={140} color={colors.primary} />
        </Card>

        <SectionHeader title="Asistencia esta semana" />
        <Card>
          <BarChart data={attendanceWeek} width={chartWidth} height={160} color={colors.accent} />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
