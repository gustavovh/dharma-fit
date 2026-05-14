import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColors } from "@/hooks/useColors";
import { gymApi } from "@/lib/api";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const [email, setEmail] = useState("alejandro@gym.local");
  const [password, setPassword] = useState("atleta123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await gymApi.login(email, password);
      if (response.success) {
        await AsyncStorage.setItem("atleta_token", response.data.access_token);
        await AsyncStorage.setItem("atleta_id", response.data.user.id);
        await AsyncStorage.setItem("atleta_user", JSON.stringify(response.data.user));
        router.replace("/(tabs)/home");
      }
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={colors.gradientBackground} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Animated.View entering={FadeIn.duration(800)} style={styles.logoContainer}>
          <View style={[styles.logoCircle, { borderColor: colors.primary }]}>
             <Text style={[styles.logoText, { color: colors.foreground }]}>PA</Text>
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>ProfeAndres</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>GYM SAGA • DESIGN</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.form}>
          <Text style={[styles.label, { color: colors.primary }]}>EMAIL</Text>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.secondary }]}
            placeholder="tu@email.com"
            placeholderTextColor={colors.mutedForeground}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={[styles.label, { color: colors.primary, marginTop: 20 }]}>CONTRASEÑA</Text>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.secondary }]}
            placeholder="••••••••"
            placeholderTextColor={colors.mutedForeground}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <Pressable 
            onPress={handleLogin} 
            disabled={loading}
            style={({ pressed }) => [
              styles.button, 
              { backgroundColor: colors.primary, opacity: pressed || loading ? 0.8 : 1 }
            ]}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>ENTRAR</Text>
            )}
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 30, justifyContent: "center" },
  logoContainer: { alignItems: "center", marginBottom: 50 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  logoText: { fontSize: 32, fontWeight: "900" },
  title: { fontSize: 32, fontWeight: "800", letterSpacing: -1 },
  subtitle: { fontSize: 12, fontWeight: "600", letterSpacing: 2, marginTop: 5 },
  form: { width: "100%" },
  label: { fontSize: 10, fontWeight: "800", letterSpacing: 1, marginBottom: 8 },
  input: {
    height: 55,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  button: {
    height: 55,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "800", letterSpacing: 1 },
  errorText: { color: "#ff4444", fontSize: 12, marginTop: 15, textAlign: "center", fontWeight: "600" },
});
