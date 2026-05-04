import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { RoleHeader } from "@/components/RoleHeader";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { SelectField } from "@/components/SelectField";
import { Card } from "@/components/Card";
import { BottomSheet } from "@/components/BottomSheet";
import { SectionHeader } from "@/components/SectionHeader";
import { MOCK_EXERCISES, MOCK_USERS } from "@/lib/mockData";
import { Exercise } from "@/types";

const DAYS = [
  { v: "1", l: "Lunes" },
  { v: "2", l: "Martes" },
  { v: "3", l: "Miércoles" },
  { v: "4", l: "Jueves" },
  { v: "5", l: "Viernes" },
  { v: "6", l: "Sábado" },
  { v: "7", l: "Domingo" },
];

interface DraftExercise {
  exercise: Exercise;
  sets: number;
  reps: number;
  weightKg: number;
}

export default function CreateRoutine() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [client, setClient] = useState<string | undefined>();
  const [day, setDay] = useState<string | undefined>("1");
  const [drafts, setDrafts] = useState<DraftExercise[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const userOptions = MOCK_USERS.map((u) => ({ label: u.name, value: u.id }));

  const addExercise = (e: Exercise) => {
    setDrafts((d) => [...d, { exercise: e, sets: e.defaultSets, reps: e.defaultReps, weightKg: 0 }]);
    setLibraryOpen(false);
  };

  const removeExercise = (i: number) => {
    setDrafts((d) => d.filter((_, idx) => idx !== i));
  };

  const handleSave = () => {
    if (!name || !client || drafts.length === 0) {
      Alert.alert("Faltan datos", "Completa nombre, cliente y al menos un ejercicio.");
      return;
    }
    Alert.alert("Rutina guardada", `${name} para ${MOCK_USERS.find((u) => u.id === client)?.name}`);
    setName("");
    setDrafts([]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <RoleHeader greeting="CREAR RUTINA" title="Nueva rutina" subtitle="Diseña una sesión personalizada" />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 200 + (Platform.OS === "web" ? 0 : insets.bottom) }}
      >
        <Input label="Nombre de la rutina" value={name} onChangeText={setName} placeholder="Ej: Día de empuje" />
        <SelectField label="Cliente" value={client} options={userOptions} onSelect={setClient} placeholder="Selecciona…" />
        <SelectField
          label="Día de la semana"
          value={day}
          options={DAYS.map((d) => ({ label: d.l, value: d.v }))}
          onSelect={setDay}
        />

        <SectionHeader title="Ejercicios" />
        {drafts.length === 0 ? (
          <Card>
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 13 }}>
              Aún no hay ejercicios. Toca el botón para agregar desde la biblioteca.
            </Text>
          </Card>
        ) : (
          drafts.map((d, i) => (
            <View
              key={i}
              style={[
                styles.draft,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 15, flex: 1 }}>
                  {d.exercise.name}
                </Text>
                <Pressable onPress={() => removeExercise(i)}>
                  <Feather name="trash-2" size={16} color={colors.destructive} />
                </Pressable>
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Field label="Sets" value={String(d.sets)} colors={colors} />
                <Field label="Reps" value={String(d.reps)} colors={colors} />
                <Field label="Peso kg" value={String(d.weightKg)} colors={colors} />
              </View>
            </View>
          ))
        )}

        <Button
          title="+ Agregar ejercicio"
          variant="secondary"
          onPress={() => setLibraryOpen(true)}
          style={{ marginTop: 12 }}
        />

        <Button title="Guardar rutina" onPress={handleSave} style={{ marginTop: 16 }} />
      </ScrollView>

      <BottomSheet visible={libraryOpen} onClose={() => setLibraryOpen(false)} title="Biblioteca de ejercicios">
        <ScrollView style={{ maxHeight: 400 }}>
          {MOCK_EXERCISES.map((e) => (
            <Pressable
              key={e.id}
              onPress={() => addExercise(e)}
              style={[styles.libRow, { borderBottomColor: colors.border }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
                  {e.name}
                </Text>
                <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 }}>
                  {e.muscleGroup} · {e.defaultSets}×{e.defaultReps}
                </Text>
              </View>
              <Feather name="plus-circle" size={20} color={colors.primary} />
            </Pressable>
          ))}
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

function Field({ label, value, colors }: { label: string; value: string; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={[styles.field, { backgroundColor: colors.input, borderColor: colors.border }]}>
      <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 10, textTransform: "uppercase" }}>
        {label}
      </Text>
      <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 16, fontVariant: ["tabular-nums"], marginTop: 2 }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  draft: { padding: 14, borderWidth: 1, marginBottom: 10 },
  field: { flex: 1, padding: 10, borderWidth: 1, borderRadius: 10 },
  libRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, gap: 12 },
});
