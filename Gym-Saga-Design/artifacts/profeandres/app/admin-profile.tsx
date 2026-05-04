import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { SectionHeader } from "@/components/SectionHeader";

export default function AdminProfile() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: 24 + (Platform.OS === "web" ? 34 : insets.bottom) }}
    >
      <View style={{ alignItems: "center" }}>
        <Avatar initials="PA" size={88} />
        <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 22, marginTop: 12 }}>
          profeandres
        </Text>
        <View style={[styles.tag, { borderColor: colors.primary }]}>
          <Feather name="shield" size={12} color={colors.primary} />
          <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold", fontSize: 12 }}>
            Administrador
          </Text>
        </View>
      </View>

      <SectionHeader title="Cuenta" />
      <Card>
        <Row icon="mail" label="Email" value="hola@profeandres.fit" colors={colors} />
        <Divider colors={colors} />
        <Row icon="phone" label="Teléfono" value="+591 700-99887" colors={colors} />
        <Divider colors={colors} />
        <Row icon="map-pin" label="Sucursal" value="Centro Principal" colors={colors} />
      </Card>

      <SectionHeader title="Configuración" />
      {[
        { icon: "shield", label: "Seguridad" },
        { icon: "globe", label: "Idioma" },
        { icon: "moon", label: "Apariencia" },
      ].map((it) => (
        <View
          key={it.label}
          style={[styles.linkRow, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
        >
          <Feather name={it.icon as keyof typeof Feather.glyphMap} size={20} color={colors.primary} />
          <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 15, flex: 1 }}>
            {it.label}
          </Text>
          <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
        </View>
      ))}

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
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 8,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
});
