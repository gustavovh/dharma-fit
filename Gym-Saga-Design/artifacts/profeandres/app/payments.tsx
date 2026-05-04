import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { Card } from "@/components/Card";
import { ProgressRing } from "@/components/ProgressRing";
import { Button } from "@/components/Button";
import { PaymentRow } from "@/components/PaymentRow";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { getUser, getPayments, getPlans } from "@/lib/storage";
import { Payment, Plan, User } from "@/types";

const CURRENT_USER_ID = "u1";

function daysUntil(dateStr?: string) {
  if (!dateStr) return 0;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export default function Payments() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | undefined>();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [plan, setPlan] = useState<Plan | undefined>();

  useEffect(() => {
    (async () => {
      const u = await getUser(CURRENT_USER_ID);
      setUser(u);
      setPayments((await getPayments()).filter((p) => p.userId === CURRENT_USER_ID));
      const plans = await getPlans();
      setPlan(plans.find((p) => p.id === u?.planId));
    })();
  }, []);

  const daysLeft = daysUntil(user?.planExpiry);
  const totalDays = plan?.durationDays || 30;
  const progress = Math.max(0, Math.min(1, (totalDays - daysLeft) / totalDays));
  const pending = payments.filter((p) => p.status !== "paid");
  const paid = payments.filter((p) => p.status === "paid");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: 24 + (Platform.OS === "web" ? 34 : insets.bottom) }}
    >
      <Card variant="gold">
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <ProgressRing
            progress={1 - progress}
            size={110}
            strokeWidth={10}
            color={colors.primary}
            centerText={`${daysLeft}d`}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" }}>
              MEMBRESÍA ACTIVA
            </Text>
            <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 22, marginTop: 4 }}>
              {plan?.name || "—"}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 4 }}>
              Vence el{" "}
              {user?.planExpiry
                ? new Date(user.planExpiry).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" })
                : "—"}
            </Text>
          </View>
        </View>
      </Card>

      <Button
        title="Pagar membresía"
        onPress={() => Alert.alert("Pagos", "Pasarela de pago en demo.")}
        style={{ marginTop: 16 }}
      />

      <SectionHeader title="Pagos pendientes" />
      {pending.length === 0 ? (
        <EmptyState icon="check-circle" title="Todo al día" subtitle="No tienes pagos pendientes." />
      ) : (
        pending.map((p) => <PaymentRow key={p.id} payment={p} />)
      )}

      <SectionHeader title="Historial" />
      {paid.length === 0 ? (
        <EmptyState icon="archive" title="Sin historial" subtitle="Aún no se han registrado pagos." />
      ) : (
        paid.map((p) => (
          <PaymentRow
            key={p.id}
            payment={p}
            onDownload={() => Alert.alert("Comprobante", "Descarga simulada.")}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
