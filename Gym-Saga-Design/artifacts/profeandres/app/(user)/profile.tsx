import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { StatusPill } from "@/components/StatusPill";
import { SectionHeader } from "@/components/SectionHeader";
import { getUser, getTrainers, getPlans } from "@/lib/storage";
import { User, Trainer, Plan } from "@/types";

const CURRENT_USER_ID = "u1";

export default function UserProfile() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | undefined>();
  const [trainer, setTrainer] = useState<Trainer | undefined>();
  const [plan, setPlan] = useState<Plan | undefined>();

  useEffect(() => {
    (async () => {
      const u = await getUser(CURRENT_USER_ID);
      setUser(u);
      const trainers = await getTrainers();
      setTrainer(trainers.find((t) => t.id === u?.trainerId));
      const plans = await getPlans();
      setPlan(plans.find((p) => p.id === u?.planId));
    })();
  }, []);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPad + 24, paddingHorizontal: 20, paddingBottom: 120 + (Platform.OS === "web" ? 0 : insets.bottom) }}
    >
      <View style={styles.headerWrap}>
        <Avatar initials={user?.avatar || "AC"} size={88} />
        <Text style={[styles.name, { color: colors.foreground }]}>{user?.name || "—"}</Text>
        {plan && (
          <View style={[styles.planBadge, { borderColor: colors.primary }]}>
            <Feather name="star" size={12} color={colors.primary} />
            <Text style={[styles.planText, { color: colors.primary }]}>Plan {plan.name}</Text>
          </View>
        )}
        {user?.planStatus && <View style={{ marginTop: 10 }}><StatusPill status={user.planStatus} /></View>}
      </View>

      <SectionHeader title="Datos personales" />
      <Card>
        <Row icon="user" label="Nombre" value={user?.name ?? "—"} colors={colors} />
        <Divider colors={colors} />
        <Row icon="phone" label="Teléfono" value="+591 700-12345" colors={colors} />
        <Divider colors={colors} />
        <Row icon="mail" label="Email" value="alejandro@profeandres.fit" colors={colors} />
      </Card>

      <SectionHeader title="Contacto de emergencia" />
      <Card>
        <Row icon="alert-circle" label="Contacto" value="María Cliente" colors={colors} />
        <Divider colors={colors} />
        <Row icon="phone-call" label="Teléfono" value="+591 711-98765" colors={colors} />
      </Card>

      <SectionHeader title="Notas médicas" />
      <Card>
        <Text style={{ color: colors.foreground, fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 }}>
          Sin alergias conocidas. Lesión leve de hombro derecho (2023) — evitar press militar pesado sin calentamiento.
        </Text>
      </Card>

      <SectionHeader title="Tu entrenador" />
      <Card>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Avatar initials={trainer?.avatar || "—"} size={48} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 15 }}>
              {trainer?.name || "Sin asignar"}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 }}>
              {trainer?.specialty || "—"}
            </Text>
          </View>
          <Feather name="message-circle" size={20} color={colors.primary} />
        </View>
      </Card>

      <SectionHeader title="Acceso rápido" />
      <Pressable
        onPress={() => router.push("/payments")}
        style={[styles.linkRow, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
      >
        <Feather name="credit-card" size={20} color={colors.primary} />
        <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 15, flex: 1 }}>Mis pagos</Text>
        <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
      </Pressable>
      <Pressable
        onPress={() => router.push("/notifications")}
        style={[styles.linkRow, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
      >
        <Feather name="bell" size={20} color={colors.primary} />
        <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 15, flex: 1 }}>Notificaciones</Text>
        <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
      </Pressable>
      <Pressable
        onPress={() => router.push("/role-switcher")}
        style={[styles.linkRow, { backgroundColor: colors.card, borderColor: colors.primary, borderRadius: colors.radius }]}
      >
        <Feather name="repeat" size={20} color={colors.primary} />
        <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold", fontSize: 15, flex: 1 }}>Cambiar de rol</Text>
        <Feather name="chevron-right" size={20} color={colors.primary} />
      </Pressable>
    </ScrollView>
  );
}

function Row({
  icon,
  label,
  value,
  colors,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.row}>
      <Feather name={icon} size={16} color={colors.mutedForeground} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {label}
        </Text>
        <Text style={{ color: colors.foreground, fontFamily: "Inter_500Medium", fontSize: 14, marginTop: 2 }}>
          {value}
        </Text>
      </View>
    </View>
  );
}
function Divider({ colors }: { colors: ReturnType<typeof useColors> }) {
  return <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 12 }} />;
}

const styles = StyleSheet.create({
  headerWrap: { alignItems: "center", marginBottom: 8 },
  name: { fontSize: 22, fontFamily: "Inter_700Bold", marginTop: 12 },
  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 8,
  },
  planText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
});
