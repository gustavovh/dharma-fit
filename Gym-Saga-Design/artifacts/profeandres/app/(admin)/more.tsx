import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { RoleHeader } from "@/components/RoleHeader";

const ITEMS: { icon: keyof typeof Feather.glyphMap; label: string; route: string; description: string }[] = [
  { icon: "log-in", label: "Asistencia", route: "/admin-attendance", description: "Control de ingresos diarios" },
  { icon: "bar-chart-2", label: "Reportes", route: "/admin-reports", description: "Métricas y exportaciones" },
  { icon: "user", label: "Perfil", route: "/admin-profile", description: "Configuración de tu cuenta" },
  { icon: "bell", label: "Notificaciones", route: "/notifications", description: "Mensajes del sistema" },
  { icon: "repeat", label: "Cambiar de rol", route: "/role-switcher", description: "Vista cliente o entrenador" },
];

export default function More() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <RoleHeader greeting="MÁS" title="Más opciones" initials="CA" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 + (Platform.OS === "web" ? 0 : insets.bottom) }}>
        {ITEMS.map((it) => (
          <Pressable
            key={it.route}
            onPress={() => router.push(it.route as any)}
            style={[
              styles.row,
              {
                backgroundColor: colors.card,
                borderColor: it.label === "Cambiar de rol" ? colors.primary : colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <View style={[styles.iconWrap, { backgroundColor: colors.secondary }]}>
              <Feather name={it.icon} size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 15 }}>
                {it.label}
              </Text>
              <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 }}>
                {it.description}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
