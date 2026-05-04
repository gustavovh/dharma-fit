import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Modal, Pressable, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { RoleHeader } from "@/components/RoleHeader";
import { Card } from "@/components/Card";
import { Calendar } from "@/components/Calendar";
import { Button } from "@/components/Button";
import { QRPlaceholder } from "@/components/QRPlaceholder";
import { getAttendance, recordAttendance } from "@/lib/storage";
import { Attendance } from "@/types";

const CURRENT_USER_ID = "u1";

export default function AttendanceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [qrOpen, setQrOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const load = async () => {
    const all = await getAttendance();
    setAttendance(all.filter((a) => a.userId === CURRENT_USER_ID));
  };

  useEffect(() => {
    load();
  }, []);

  const today = new Date();
  const attendedSet = new Set(attendance.map((a) => a.date));
  const monthDates = new Set(
    attendance
      .filter((a) => {
        const d = new Date(a.date);
        return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth();
      })
      .map((a) => a.date),
  );
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const elapsedDays = today.getDate();
  const missed = elapsedDays - monthDates.size;

  const handleQR = () => {
    setQrOpen(true);
    setConfirmed(false);
    setTimeout(async () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await recordAttendance({
        id: `at${Date.now()}`,
        userId: CURRENT_USER_ID,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
      });
      setConfirmed(true);
      await load();
    }, 2000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <RoleHeader greeting="ASISTENCIA" title="Tu constancia" subtitle="Cada día cuenta" />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 + (Platform.OS === "web" ? 0 : insets.bottom) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", gap: 12 }}>
          <StatBox label="Asistidos" value={monthDates.size} colors={colors} accent />
          <StatBox label="Faltados" value={missed > 0 ? missed : 0} colors={colors} />
          <StatBox label="Racha" value={`${monthDates.size}d`} colors={colors} />
        </View>

        <Card style={{ marginTop: 16 }}>
          <Calendar
            year={today.getFullYear()}
            month={today.getMonth()}
            attended={attendedSet}
          />
        </Card>

        <Button
          title="Check-in con QR"
          onPress={handleQR}
          style={{ marginTop: 20 }}
        />
      </ScrollView>

      <Modal visible={qrOpen} transparent animationType="fade" onRequestClose={() => setQrOpen(false)}>
        <View style={[styles.modal, { backgroundColor: "rgba(0,0,0,0.85)" }]}>
          <View style={{ alignItems: "center", padding: 32 }}>
            {!confirmed ? (
              <>
                <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 22, marginBottom: 8 }}>
                  Tu código QR
                </Text>
                <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 13, textAlign: "center", marginBottom: 24 }}>
                  Muestra este código al ingresar al gimnasio
                </Text>
                <QRPlaceholder size={220} seed={`profeandres-${CURRENT_USER_ID}`} />
              </>
            ) : (
              <>
                <View
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 48,
                    backgroundColor: colors.accent,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Feather name="check" size={48} color={colors.accentForeground} />
                </View>
                <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 22 }}>
                  Asistencia registrada
                </Text>
                <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 6 }}>
                  ¡Vamos por una excelente sesión!
                </Text>
              </>
            )}
            <Pressable onPress={() => setQrOpen(false)} style={{ marginTop: 32 }}>
              <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold", fontSize: 15 }}>
                Cerrar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function StatBox({
  label,
  value,
  colors,
  accent,
}: {
  label: string;
  value: number | string;
  colors: ReturnType<typeof useColors>;
  accent?: boolean;
}) {
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
      <Text
        style={{
          color: accent ? colors.primary : colors.foreground,
          fontFamily: "Inter_700Bold",
          fontSize: 22,
          fontVariant: ["tabular-nums"],
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          color: colors.mutedForeground,
          fontFamily: "Inter_500Medium",
          fontSize: 11,
          marginTop: 4,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: { flex: 1, alignItems: "center", justifyContent: "center" },
  statBox: { flex: 1, padding: 14, borderWidth: 1, alignItems: "flex-start" },
});
