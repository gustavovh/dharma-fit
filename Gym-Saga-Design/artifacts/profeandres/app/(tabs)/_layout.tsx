import { Tabs } from "expo-router";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { View } from "react-native";
import { useColors } from "@/hooks/useColors";

export default function TabLayout() {
  const colors = useColors();

  const renderIcon = (name: keyof typeof Feather.glyphMap) =>
    ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
      <View
        style={{
          minWidth: 44,
          height: 32,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: focused ? colors.secondary : "transparent",
          shadowColor: focused ? colors.primary : "transparent",
          shadowOpacity: focused ? 0.35 : 0,
          shadowRadius: focused ? 14 : 0,
          shadowOffset: { width: 0, height: 8 },
        }}
      >
        <Feather name={name} size={size} color={color} />
      </View>
    );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "rgba(7, 12, 22, 0.96)",
          borderTopColor: colors.border,
          height: 78,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 11,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: renderIcon("home"),
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          title: "Entrenar",
          tabBarIcon: renderIcon("zap"),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progreso",
          tabBarIcon: renderIcon("trending-up"),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: "Nutrición",
          tabBarIcon: renderIcon("coffee"),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: renderIcon("user"),
        }}
      />
    </Tabs>
  );
}
