import React from "react";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Platform, View } from "react-native";
import { BlurView } from "expo-blur";
import { useColors } from "@/hooks/useColors";

export default function TrainerTabsLayout() {
  const colors = useColors();
  const isWeb = Platform.OS === "web";
  const isIOS = Platform.OS === "ios";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: { fontFamily: "Inter_500Medium", fontSize: 11 },
        tabBarStyle: {
          backgroundColor: isIOS ? "transparent" : colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={100} tint="dark" style={{ flex: 1 }} />
          ) : (
            <View style={{ flex: 1, backgroundColor: colors.background }} />
          ),
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Inicio", tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="clients" options={{ title: "Clientes", tabBarIcon: ({ color, size }) => <Feather name="users" size={size} color={color} /> }} />
      <Tabs.Screen name="create-routine" options={{ title: "Rutinas", tabBarIcon: ({ color, size }) => <Feather name="plus-square" size={size} color={color} /> }} />
      <Tabs.Screen name="measurements" options={{ title: "Medidas", tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil", tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} /> }} />
    </Tabs>
  );
}
