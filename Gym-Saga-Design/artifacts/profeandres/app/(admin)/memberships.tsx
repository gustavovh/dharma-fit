import React, { useEffect, useState } from "react";
import { View, ScrollView, Alert, Platform, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { RoleHeader } from "@/components/RoleHeader";
import { Button } from "@/components/Button";
import { PlanCard } from "@/components/PlanCard";
import { BottomSheet } from "@/components/BottomSheet";
import { Input } from "@/components/Input";
import { getPlans } from "@/lib/storage";
import { Plan } from "@/types";

export default function Memberships() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [benefits, setBenefits] = useState("");

  useEffect(() => {
    (async () => setPlans(await getPlans()))();
  }, []);

  const handleCreate = () => {
    if (!name || !price || !duration) {
      Alert.alert("Faltan datos", "Completa nombre, precio y duración.");
      return;
    }
    Alert.alert("Plan creado", `${name} agregado correctamente.`);
    setName("");
    setPrice("");
    setDuration("");
    setBenefits("");
    setOpen(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <RoleHeader greeting="MEMBRESÍAS" title="Planes" subtitle="Configura tu oferta" initials="CA" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 24 + (Platform.OS === "web" ? 0 : insets.bottom) + 100 }}>
        {plans.map((p) => (
          <PlanCard
            key={p.id}
            plan={p}
            onEdit={() => Alert.alert("Editar plan", p.name)}
            onDelete={() => Alert.alert("Eliminar plan", `¿Eliminar ${p.name}?`)}
          />
        ))}
        <Button title="+ Crear plan" onPress={() => setOpen(true)} style={{ marginTop: 16 }} />
      </ScrollView>

      <BottomSheet visible={open} onClose={() => setOpen(false)} title="Nuevo plan">
        <Input label="Nombre" value={name} onChangeText={setName} placeholder="Ej: Semestral" />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Input label="Precio ($)" keyboardType="numeric" value={price} onChangeText={setPrice} placeholder="200" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Duración (días)" keyboardType="numeric" value={duration} onChangeText={setDuration} placeholder="180" />
          </View>
        </View>
        <Input
          label="Beneficios"
          value={benefits}
          onChangeText={setBenefits}
          placeholder="Separa con comas"
          multiline
          numberOfLines={3}
          style={{ minHeight: 80, textAlignVertical: "top" }}
        />
        <Button title="Crear plan" onPress={handleCreate} />
      </BottomSheet>
    </View>
  );
}
