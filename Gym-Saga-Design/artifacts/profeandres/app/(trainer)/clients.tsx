import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { RoleHeader } from "@/components/RoleHeader";
import { SearchInput } from "@/components/SearchInput";
import { Tag } from "@/components/Tag";
import { ClientListItem } from "@/components/ClientListItem";
import { EmptyState } from "@/components/EmptyState";
import { getUsers } from "@/lib/storage";
import { User } from "@/types";

const TRAINER_ID = "t1";
const FILTERS = ["Todos", "Activos", "Por vencer", "Vencidos"];

export default function Clients() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");

  useEffect(() => {
    (async () => {
      const all = await getUsers();
      setUsers(all.filter((u) => u.trainerId === TRAINER_ID));
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <RoleHeader greeting="MIS CLIENTES" title={`${users.length} clientes`} subtitle="Gestiona tu cartera" />
      <View style={{ paddingHorizontal: 20 }}>
        <SearchInput placeholder="Buscar cliente…" value={query} onChangeText={setQuery} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 12 }}>
          {FILTERS.map((f) => (
            <Tag key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120 + (Platform.OS === "web" ? 0 : insets.bottom) }}
      >
        {filtered.length === 0 ? (
          <EmptyState icon="users" title="Sin resultados" subtitle="Ajusta tu búsqueda o filtros." />
        ) : (
          filtered.map((u) => (
            <ClientListItem
              key={u.id}
              user={u}
              progress={Math.random() * 0.7 + 0.15}
              onPress={() => router.push(`/client-detail/${u.id}`)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
