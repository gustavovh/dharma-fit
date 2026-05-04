import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { SectionHeader } from "@/components/SectionHeader";
import { StatCard } from "@/components/StatCard";

export default function TrainerProfile() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPad + 24, paddingHorizontal: 20, paddingBottom: 120 + (Platform.OS === "web" ? 0 : insets.bottom) }}
    >
      <View style={styles.headerWrap}>
        <Avatar initials="RE" size={88} />
        <Text style={[styles.name, { color: colors.foreground }]}>Roberto Entrenador</Text>
        <View style={[styles.specialtyTag, { borderColor: colors.primary }]}>
          <Feather name="award" size={12} color={colors.primary} />
          <Text style={[styles.specialtyText, { color: colors.primary }]}>Hipertrofia</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
        <StatCard icon="users" label="Clientes" value={6} />
        <StatCard icon="star" label="Rating" value="4.9" />
      </View>

      <SectionHeader title="Información" />
      <Card>
        <Row icon="mail" label="Email" value="roberto@profeandres.fit" colors={colors} />
        <Divider colors={colors} />
        <Row icon="phone" label="Teléfono" value="+591 711-22334" colors={colors} />
        <Divider colors={colors} />
        <Row icon="calendar" label="Antigüedad" value="3 años" colors={colors} />
      </Card>

      <SectionHeader title="Acciones" />
      <Pressable
        onPress={() => router.push("/notes")}
        style={[styles.linkRow, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
      >
        <Feather name="file-text" size={20} color={colors.primary} />
        <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 15, flex: 1 }}>
          Observaciones de clientes
        </Text>
        <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
      </Pressable>
      <Pressable
        onPress={() => router.push("/notifications")}
        style={[styles.linkRow, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
      >
        <Feather name="bell" size={20} color={colors.primary} />
        <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 15, flex: 1 }}>
          Notificaciones
        </Text>
        <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
      </Pressable>
      <Pressable
        onPress={() => router.push("/role-switcher")}
        style={[styles.linkRow, { backgroundColor: colors.card, borderColor: colors.primary, borderRadius: colors.radius }]}
      >
        <Feather name="repeat" size={20} color={colors.primary} />
        <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold", fontSize: 15, flex: 1 }}>
          Cambiar de rol
        </Text>
        <Feather name="chevron-right" size={20} color={colors.primary} />
      </Pressable>
    </ScrollView>
  );
}

function Row({ icon, label, value, colors }: { icon: keyof typeof Feather.glyphMap; label: string; value: string; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Feather name={icon} size={16} color={colors.mutedForeground} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 11, textTransform: "uppercase" }}>
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
  headerWrap: { alignItems: "center" },
  name: { fontSize: 22, fontFamily: "Inter_700Bold", marginTop: 12 },
  specialtyTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 8,
  },
  specialtyText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
});
