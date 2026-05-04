import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { RoleHeader } from "@/components/RoleHeader";
import { PaymentRow } from "@/components/PaymentRow";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { BottomSheet } from "@/components/BottomSheet";
import { Input } from "@/components/Input";
import { SelectField } from "@/components/SelectField";
import { getPayments, getUsers } from "@/lib/storage";
import { Payment, User } from "@/types";

const TABS = ["Recibidos", "Pendientes", "Vencidos"] as const;
type Tab = (typeof TABS)[number];

export default function AdminPayments() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tab, setTab] = useState<Tab>("Recibidos");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<string | undefined>();
  const [amount, setAmount] = useState("");

  useEffect(() => {
    (async () => {
      setPayments(await getPayments());
      setUsers(await getUsers());
    })();
  }, []);

  const filtered = useMemo(() => {
    if (tab === "Recibidos") return payments.filter((p) => p.status === "paid");
    if (tab === "Pendientes") return payments.filter((p) => p.status === "pending");
    return payments.filter((p) => p.status === "overdue");
  }, [payments, tab]);

  const handleSave = () => {
    if (!user || !amount) {
      Alert.alert("Faltan datos", "Selecciona usuario y monto.");
      return;
    }
    Alert.alert("Pago registrado", `$${amount} para ${users.find((u) => u.id === user)?.name}`);
    setUser(undefined);
    setAmount("");
    setOpen(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <RoleHeader greeting="PAGOS" title="Tesorería" subtitle="Cobros y vencimientos" initials="CA" />

      <View style={{ paddingHorizontal: 20 }}>
        <View style={[styles.tabRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {TABS.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tabBtn, tab === t && { backgroundColor: colors.primary }]}
            >
              <Text
                style={{
                  color: tab === t ? colors.primaryForeground : colors.foreground,
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 13,
                }}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140 + (Platform.OS === "web" ? 0 : insets.bottom) }}>
        {filtered.length === 0 ? (
          <EmptyState icon="check-circle" title="Sin registros" subtitle="No hay pagos en esta categoría." />
        ) : (
          filtered.map((p) => (
            <PaymentRow
              key={p.id}
              payment={p}
              userName={users.find((u) => u.id === p.userId)?.name}
              onDownload={p.status === "paid" ? () => Alert.alert("Comprobante", "Descarga simulada.") : undefined}
            />
          ))
        )}
        <Button title="Registrar pago manual" variant="secondary" onPress={() => setOpen(true)} style={{ marginTop: 16 }} />
      </ScrollView>

      <BottomSheet visible={open} onClose={() => setOpen(false)} title="Pago manual">
        <SelectField
          label="Usuario"
          value={user}
          options={users.map((u) => ({ label: u.name, value: u.id }))}
          onSelect={setUser}
        />
        <Input label="Monto ($)" keyboardType="numeric" value={amount} onChangeText={setAmount} placeholder="50" />
        <Button title="Registrar pago" onPress={handleSave} />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: { flexDirection: "row", padding: 4, borderWidth: 1, borderRadius: 999, gap: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 999 },
});
