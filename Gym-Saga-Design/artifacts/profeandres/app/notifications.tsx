import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { NotificationItem } from "@/components/NotificationItem";
import { EmptyState } from "@/components/EmptyState";
import { SectionHeader } from "@/components/SectionHeader";
import { getNotifications } from "@/lib/storage";
import { Notification } from "@/types";

const CURRENT_USER_ID = "u1";

const EXTRA: Notification[] = [
  {
    id: "nx1",
    userId: CURRENT_USER_ID,
    type: "payment",
    title: "Pago próximo",
    message: "Tu cuota mensual vence en 3 días.",
    date: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: "nx2",
    userId: CURRENT_USER_ID,
    type: "routine",
    title: "Nueva rutina asignada",
    message: "Tu entrenador actualizó tu rutina de hipertrofia.",
    date: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
  {
    id: "nx3",
    userId: CURRENT_USER_ID,
    type: "reminder",
    title: "Recordatorio de entrenamiento",
    message: "Mañana tienes sesión a las 07:30.",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    read: true,
  },
  {
    id: "nx4",
    userId: CURRENT_USER_ID,
    type: "progress",
    title: "Progreso registrado",
    message: "Tu peso bajó 1 kg respecto a la semana pasada.",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    read: true,
  },
];

function group(items: Notification[]) {
  const today: Notification[] = [];
  const week: Notification[] = [];
  const older: Notification[] = [];
  const now = Date.now();
  for (const n of items) {
    const ageMs = now - new Date(n.date).getTime();
    if (ageMs < 86400000) today.push(n);
    else if (ageMs < 86400000 * 7) week.push(n);
    else older.push(n);
  }
  return { today, week, older };
}

export default function Notifications() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    (async () => {
      const stored = await getNotifications(CURRENT_USER_ID);
      setItems([...stored, ...EXTRA].sort((a, b) => +new Date(b.date) - +new Date(a.date)));
    })();
  }, []);

  const { today, week, older } = group(items);
  const isEmpty = items.length === 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: 24 + (Platform.OS === "web" ? 34 : insets.bottom) }}
    >
      {isEmpty ? (
        <EmptyState icon="notifications-outline" title="Sin notificaciones" subtitle="Te avisaremos cuando haya novedades." />
      ) : (
        <>
          {today.length > 0 && (
            <>
              <SectionHeader title="Hoy" />
              {today.map((n) => <NotificationItem key={n.id} notification={n} />)}
            </>
          )}
          {week.length > 0 && (
            <>
              <SectionHeader title="Esta semana" />
              {week.map((n) => <NotificationItem key={n.id} notification={n} />)}
            </>
          )}
          {older.length > 0 && (
            <>
              <SectionHeader title="Anteriores" />
              {older.map((n) => <NotificationItem key={n.id} notification={n} />)}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}
