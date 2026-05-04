import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useRole } from "@/contexts/RoleContext";
import { Role } from "@/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ROLES: { id: Role; title: string; subtitle: string; icon: keyof typeof Feather.glyphMap }[] = [
  {
    id: "user",
    title: "Cliente",
    subtitle: "Sigue tu rutina, mide tu progreso",
    icon: "user",
  },
  {
    id: "trainer",
    title: "Entrenador",
    subtitle: "Gestiona tus clientes y rutinas",
    icon: "activity",
  },
  {
    id: "admin",
    title: "Administrador",
    subtitle: "Operación, pagos y reportes",
    icon: "shield",
  },
];

export default function RoleSwitcher() {
  const colors = useColors();
  const router = useRouter();
  const { role, setRole } = useRole();
  const insets = useSafeAreaInsets();

  const handleSelect = async (r: Role) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setRole(r);
    router.dismissAll();
    router.replace("/");
  };

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.container, { paddingBottom: bottomPad + 24 }]}
    >
      <View style={styles.logoWrap}>
        <Image
          source={require("../assets/images/profeandres-logo.png")}
          style={styles.logo}
          contentFit="contain"
        />
      </View>
      <Text style={[styles.title, { color: colors.foreground }]}>
        Elige tu rol
      </Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        Cambia entre vistas para experimentar la app completa
      </Text>

      <View style={{ marginTop: 32, gap: 12 }}>
        {ROLES.map((r) => {
          const active = r.id === role;
          return (
            <Pressable
              key={r.id}
              onPress={() => handleSelect(r.id)}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: active ? colors.primary : colors.border,
                  borderRadius: colors.radius,
                  borderWidth: active ? 2 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: active ? colors.primary : colors.secondary },
                ]}
              >
                <Feather
                  name={r.icon}
                  size={22}
                  color={active ? colors.primaryForeground : colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                  {r.title}
                </Text>
                <Text style={[styles.cardSub, { color: colors.mutedForeground }]}>
                  {r.subtitle}
                </Text>
              </View>
              {active ? (
                <Feather name="check-circle" size={22} color={colors.primary} />
              ) : (
                <Feather name="chevron-right" size={22} color={colors.mutedForeground} />
              )}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 32 },
  logoWrap: { alignItems: "center", marginBottom: 24 },
  logo: { width: 140, height: 140, borderRadius: 16 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", textAlign: "center" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 6 },
  card: { flexDirection: "row", alignItems: "center", padding: 18, gap: 14 },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  cardSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
});
