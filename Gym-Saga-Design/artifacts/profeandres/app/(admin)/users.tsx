import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { RoleHeader } from "@/components/RoleHeader";
import { SearchInput } from "@/components/SearchInput";
import { Tag } from "@/components/Tag";
import { ClientListItem } from "@/components/ClientListItem";
import { BottomSheet } from "@/components/BottomSheet";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { SelectField } from "@/components/SelectField";
import { getUsers, getPlans, getTrainers } from "@/lib/storage";
import { User, Plan, Trainer } from "@/types";

const FILTERS = ["Todos", "Activos", "Por vencer", "Vencidos"];

export default function AdminUsers() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [planId, setPlanId] = useState<string | undefined>();
  const [trainerId, setTrainerId] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      setUsers(await getUsers());
      setPlans(await getPlans());
      setTrainers(await getTrainers());
    })();
  }, []);

  const filtered = useMemo(() => {
    return users
      .filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))
      .filter((u) => {
        if (filter === "Activos") return u.planStatus === "activa";
        if (filter === "Por vencer") return u.planStatus === "por_vencer";
        if (filter === "Vencidos") return u.planStatus === "vencida";
        return true;
      });
  }, [users, query, filter]);

  const handleCreate = () => {
    if (!name || !planId || !trainerId) {
      Alert.alert("Faltan datos", "Completa todos los campos.");
      return;
    }
    Alert.alert("Usuario creado", `${name} agregado correctamente.`);
    setName("");
    setPlanId(undefined);
    setTrainerId(undefined);
    setOpen(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <RoleHeader greeting="USUARIOS" title="Gestión" subtitle={`${users.length} clientes registrados`} initials="CA" />
      <View style={{ paddingHorizontal: 20 }}>
        <SearchInput placeholder="Buscar usuario…" value={query} onChangeText={setQuery} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 12 }}>
          {FILTERS.map((f) => (
            <Tag key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140 + (Platform.OS === "web" ? 0 : insets.bottom) }}>
        {filtered.map((u) => (
          <ClientListItem key={u.id} user={u} onPress={() => router.push(`/client-detail/${u.id}`)} />
        ))}
      </ScrollView>

      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            bottom: 100 + (Platform.OS === "web" ? 0 : insets.bottom),
          },
        ]}
      >
        <Feather name="plus" size={24} color={colors.primaryForeground} />
      </Pressable>

      <BottomSheet visible={open} onClose={() => setOpen(false)} title="Nuevo usuario">
        <Input label="Nombre completo" value={name} onChangeText={setName} placeholder="Ej: Juan Pérez" />
        <SelectField
          label="Plan"
          value={planId}
          options={plans.map((p) => ({ label: `${p.name} — $${p.price}`, value: p.id }))}
          onSelect={setPlanId}
        />
        <SelectField
          label="Entrenador"
          value={trainerId}
          options={trainers.map((t) => ({ label: t.name, value: t.id }))}
          onSelect={setTrainerId}
        />
        <Button title="Crear usuario" onPress={handleCreate} />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
