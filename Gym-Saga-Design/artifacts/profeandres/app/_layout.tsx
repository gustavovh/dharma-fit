import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RoleProvider } from "@/contexts/RoleContext";
import { initStorage } from "@/lib/storage";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0A0A0B" },
        headerTintColor: "#F5F5F5",
        headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
        contentStyle: { backgroundColor: "#0A0A0B" },
        headerBackTitle: "Atrás",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(user)" options={{ headerShown: false }} />
      <Stack.Screen name="(trainer)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      <Stack.Screen
        name="role-switcher"
        options={{ presentation: "modal", title: "Cambiar de rol" }}
      />
      <Stack.Screen name="payments" options={{ title: "Pagos" }} />
      <Stack.Screen name="notifications" options={{ title: "Notificaciones" }} />
      <Stack.Screen name="notes" options={{ title: "Observaciones" }} />
      <Stack.Screen name="admin-attendance" options={{ title: "Asistencia" }} />
      <Stack.Screen name="admin-reports" options={{ title: "Reportes" }} />
      <Stack.Screen name="admin-profile" options={{ title: "Perfil" }} />
      <Stack.Screen name="client-detail/[id]" options={{ title: "Cliente" }} />
      <Stack.Screen
        name="exercise-detail/[id]"
        options={{ presentation: "modal", title: "Ejercicio" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    initStorage();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <RoleProvider>
            <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0A0A0B" }}>
              <KeyboardProvider>
                <View style={{ flex: 1, backgroundColor: "#0A0A0B" }}>
                  <StatusBar style="light" />
                  <RootLayoutNav />
                </View>
              </KeyboardProvider>
            </GestureHandlerRootView>
          </RoleProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
