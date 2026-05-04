import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { SectionHeader } from "@/components/SectionHeader";
import { getUsers, getAttendance, recordAttendance } from "@/lib/storage";
import { User, Attendance } from "@/types";

const TABS = ["Presentes", "Ausentes"] as const;
type Tab = (typeof TABS)[number];

export default function AdminAttendance() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [users, setUsers] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [tab, setTab] = useState<Tab>("Presentes");

  const load = async () => {
    setUsers(await getUsers());
    setAttendance(await getAttendance());
  };

  useEffect(() => {
    load();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const presentIds = new Set(attendance.filter((a) => a.date === today).map((a) => a.userId));

  const list = useMemo(() => {
    if (tab === "Presentes") return users.filter((u) => presentIds.has(u.id));
    return users.filter((u) => !presentIds.has(u.id));
  }, [users, tab, presentIds]);

  const checkIn = async (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await recordAttendance({ id: `at${Date.now()}`, userId: id, date: today, time: new Date().toTimeString().slice(0, 5) });
    await load();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: 24 + (Platform.OS === "web" ? 34 : insets.bottom) }}
    >
      <View style={{ flexDirection: "row", gap: 12 }}>
        <StatBox label="Presentes hoy" value={presentIds.size} colors={colors} accent />
        <StatBox label="Ausentes" value={users.length - presentIds.size} colors={colors} />
      </View>

      <View style={[styles.tabRow, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 16 }]}>
        {TABS.map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tabBtn, tab === t && { backgroundColor: colors.primary }]}
          >
            <Text
              style={{
                color: tab === t ? colors.primaryForeground : colors.foreground,
                fontFamily: "Inter_600SemiBold",
                fontSize: 13,
              }}
            >
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="QR Scanner" />
      <Card>
        <View style={{ alignItems: "center", padding: 16 }}>
          <View
            style={{
              width: 160,
              height: 160,
              borderRadius: 16,
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="camera" size={40} color={colors.mutedForeground} />
          </View>
          <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 12, textAlign: "center" }}>
            Apunta al QR del cliente
          </Text>
          <Button
            title="Activar escáner"
            variant="secondary"
            onPress={() => Alert.alert("Escáner", "Cámara simulada en demo.")}
            style={{ marginTop: 12, alignSelf: "stretch" }}
          />
        </View>
      </Card>

      <SectionHeader title={tab} />
      {list.map((u) => (
        <View
          key={u.id}
          style={[
            styles.row,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Avatar initials={u.avatar || "??"} size={40} />
          <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 14, flex: 1 }}>
            {u.name}
          </Text>
          {tab === "Ausentes" ? (
            <Pressable onPress={() => checkIn(u.id)} style={[styles.miniBtn, { backgroundColor: colors.primary }]}>
              <Text style={{ color: colors.primaryForeground, fontFamily: "Inter_600SemiBold", fontSize: 12 }}>
                Check-in
              </Text>
            </Pressable>
          ) : (
            <Feather name="check-circle" size={20} color={colors.accent} />
          )}
        </View>
      ))}
    </ScrollView>
  );
}

function StatBox({ label, value, colors, accent }: { label: string; value: number; colors: ReturnType<typeof useColors>; accent?: boolean }) {
  return (
    <View
      style={[
        styles.statBox,
        {
          backgroundColor: colors.card,
          borderColor: accent ? colors.primary : colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <Text style={{ color: accent ? colors.primary : colors.foreground, fontFamily: "Inter_700Bold", fontSize: 28, fontVariant: ["tabular-nums"] }}>
        {value}
      </Text>
      <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 11, marginTop: 4, textTransform: "uppercase" }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: { flexDirection: "row", padding: 4, borderWidth: 1, borderRadius: 999, gap: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 999 },
  row: { flexDirection: "row", alignItems: "center", padding: 12, borderWidth: 1, gap: 12, marginBottom: 10 },
  miniBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  statBox: { flex: 1, padding: 16, borderWidth: 1 },
});
