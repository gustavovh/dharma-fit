import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { RoleHeader } from "@/components/RoleHeader";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { SelectField } from "@/components/SelectField";
import { Card } from "@/components/Card";
import { LineChart } from "@/components/LineChart";
import { SectionHeader } from "@/components/SectionHeader";
import { addMeasurement, getMeasurements, getUsers } from "@/lib/storage";
import { Measurement, User } from "@/types";

const TRAINER_ID = "t1";

export default function Measurements() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(width, 600) - 80;
  const [users, setUsers] = useState<User[]>([]);
  const [client, setClient] = useState<string | undefined>();
  const [weight, setWeight] = useState("");
  const [fat, setFat] = useState("");
  const [waist, setWaist] = useState("");
  const [chest, setChest] = useState("");
  const [data, setData] = useState<Measurement[]>([]);

  useEffect(() => {
    (async () => {
      const all = await getUsers();
      const mine = all.filter((u) => u.trainerId === TRAINER_ID);
      setUsers(mine);
      if (mine[0]) setClient(mine[0].id);
    })();
  }, []);

  useEffect(() => {
    if (client) (async () => setData(await getMeasurements(client)))();
  }, [client]);

  const handleSave = async () => {
    if (!client || !weight || !fat) {
      Alert.alert("Faltan datos", "Selecciona cliente y completa peso y % grasa.");
      return;
    }
    await addMeasurement({
      id: `m${Date.now()}`,
      userId: client,
      date: new Date().toISOString(),
      weightKg: parseFloat(weight),
      bodyFatPct: parseFloat(fat),
      waistCm: waist ? parseFloat(waist) : undefined,
      chestCm: chest ? parseFloat(chest) : undefined,
    });
    setWeight("");
    setFat("");
    setWaist("");
    setChest("");
    setData(await getMeasurements(client));
    Alert.alert("Listo", "Medición registrada.");
  };

  const sparkData = data.map((m, i) => ({ x: i, y: m.weightKg }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <RoleHeader greeting="MEDIDAS" title="Registro corporal" subtitle="Captura cada avance" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 + (Platform.OS === "web" ? 0 : insets.bottom) }}>
        <SelectField
          label="Cliente"
          value={client}
          options={users.map((u) => ({ label: u.name, value: u.id }))}
          onSelect={setClient}
        />

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Input label="Peso (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} placeholder="78" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="% Grasa" keyboardType="numeric" value={fat} onChangeText={setFat} placeholder="18" />
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Input label="Cintura (cm)" keyboardType="numeric" value={waist} onChangeText={setWaist} placeholder="80" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Pecho (cm)" keyboardType="numeric" value={chest} onChangeText={setChest} placeholder="100" />
          </View>
        </View>

        <Button title="Guardar medición" onPress={handleSave} />

        <SectionHeader title="Histórico de peso" />
        <Card>
          {sparkData.length > 1 ? (
            <LineChart data={sparkData} width={chartWidth} height={140} color={colors.primary} />
          ) : (
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 13 }}>
              Aún no hay datos suficientes.
            </Text>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
