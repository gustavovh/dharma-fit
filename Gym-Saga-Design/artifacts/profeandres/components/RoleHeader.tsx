import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { Avatar } from "./Avatar";

interface RoleHeaderProps {
  greeting?: string;
  title: string;
  subtitle?: string;
  initials?: string;
  showBell?: boolean;
  showLogo?: boolean;
}

export function AppHeader({
  greeting,
  title,
  subtitle,
  initials = "PA",
  showBell = true,
  showLogo = false,
}: RoleHeaderProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ paddingTop: topPad + 8 }}>
      {showLogo && (
        <View style={styles.logoRow}>
          <Image
            source={require("../assets/images/profeandres-logo.png")}
            style={styles.logo}
            contentFit="contain"
          />
        </View>
      )}
      <View style={styles.container}>
        <View style={styles.left}>
          {greeting && (
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>{greeting}</Text>
          )}
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={styles.right}>
          {showBell && (
            <Pressable
              onPress={() => router.push("/notifications")}
              style={[styles.bellBtn, { backgroundColor: colors.secondary }]}
            >
              <Feather name="bell" size={20} color={colors.foreground} />
              <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            </Pressable>
          )}
          <Avatar initials={initials} size={40} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoRow: {
    paddingHorizontal: 20,
    marginBottom: 8,
    alignItems: "flex-start",
  },
  logo: { width: 56, height: 56, borderRadius: 8 },
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  left: { flex: 1, marginRight: 12 },
  right: { flexDirection: "row", alignItems: "center", gap: 12 },
  greeting: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
