import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { AppHeader } from "@/components/RoleHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { getUser } from "@/lib/storage";
import { User } from "@/types";

const CURRENT_USER_ID = "u1";

export default function Profile() {
  const colors = useColors();
  const [user, setUser] = useState<User | undefined>();
  const [syncEnabled, setSyncEnabled] = useState(true);

  useEffect(() => {
    (async () => {
      setUser(await getUser(CURRENT_USER_ID));
    })();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader
        title="Perfil"
        subtitle="Gestiona tu cuenta y ajustes"
        initials="AC"
      />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Avatar initials={user?.avatar || "AC"} size={80} />
            <Pressable style={[styles.editButton, { backgroundColor: colors.primary }]}>
              <Feather name="edit-2" size={16} color={colors.primaryForeground} />
            </Pressable>
          </View>
          <Text style={[styles.userName, { color: colors.foreground }]}>{user?.name || "Cargando..."}</Text>
          <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>atleta@profeandres.fit</Text>
        </Card>

        <SectionHeader title="Mis Objetivos" />
        <Card>
          <View style={{ gap: 12 }}>
            <ObjectiveRow icon="target" label="Meta" value="Ganancia Muscular" />
            <ObjectiveRow icon="calendar" label="Frecuencia" value="4 días / semana" />
            <ObjectiveRow icon="droplet" label="Agua diaria" value="2.5 Litros" />
          </View>
        </Card>

        <SectionHeader title="Sincronización de Salud" />
        <Card>
          <View style={styles.syncRow}>
            <View style={styles.syncInfo}>
              <Feather name="heart" size={20} color={colors.primary} />
              <View>
                <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>
                  Apple Health / Google Fit
                </Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>
                  Sincronización automática de actividad
                </Text>
              </View>
            </View>
            <Switch
              value={syncEnabled}
              onValueChange={setSyncEnabled}
              trackColor={{ false: colors.secondary, true: colors.primary }}
              thumbColor="#F5F5F5"
            />
          </View>
        </Card>

        <SectionHeader title="Preferencias" />
        <Card>
          <View style={{ gap: 16 }}>
            <MenuRow icon="bell" label="Notificaciones" />
            <MenuRow icon="shield" label="Privacidad" />
            <MenuRow icon="help-circle" label="Soporte Técnico" />
          </View>
        </Card>

        <Pressable style={[styles.logoutButton, { borderColor: colors.destructive }]}>
          <Feather name="log-out" size={20} color={colors.destructive} />
          <Text style={[styles.logoutText, { color: colors.destructive }]}>Cerrar Sesión</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function ObjectiveRow({ icon, label, value }: any) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Feather name={icon as any} size={16} color={colors.mutedForeground} />
        <Text style={{ color: colors.mutedForeground }}>{label}</Text>
      </View>
      <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>{value}</Text>
    </View>
  );
}

function MenuRow({ icon, label }: any) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" }}>
          <Feather name={icon as any} size={18} color={colors.foreground} />
        </View>
        <Text style={{ color: colors.foreground, fontFamily: "Inter_500Medium" }}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: { alignItems: "center", paddingVertical: 32 },
  avatarContainer: { position: "relative", marginBottom: 16 },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#141416",
  },
  userName: { fontSize: 20, fontFamily: "Inter_700Bold" },
  userEmail: { fontSize: 14, marginTop: 4 },
  syncRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  syncInfo: { flexDirection: "row", gap: 12, alignItems: "center", flex: 1 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 32,
    gap: 8,
  },
  logoutText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
