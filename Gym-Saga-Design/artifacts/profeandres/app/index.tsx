import { Redirect } from "expo-router";
import { useRole } from "@/contexts/RoleContext";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0A0A0B" }}>
        <ActivityIndicator color="#D4AF37" />
      </View>
    );
  }

  if (role === "admin") return <Redirect href="/(admin)" />;
  if (role === "trainer") return <Redirect href="/(trainer)" />;
  return <Redirect href="/(user)" />;
}
