import React, { useState } from "react";
import {
  Alert, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BLUE = "#2563eb";

export default function EditMedicalInfoScreen({ navigation, route }: any) {
  const { initialValues, onSave } = route.params as {
    initialValues: {
      allergies: string; chronicDiseases: string; currentMedications: string;
    };
    onSave: (values: typeof initialValues) => Promise<void>;
  };

  const [form, setForm] = useState({ ...initialValues });
  const [saving, setSaving] = useState(false);

  const f = (key: keyof typeof form) => (val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(form);
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Medical Information</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
        <View style={s.optionalBanner}>
          <Text style={s.optionalBannerText}>ℹ️  All fields in this section are optional.</Text>
        </View>

        <Field label="Allergies (comma-separated)">
          <TextInput
            style={[s.input, s.inputMulti]}
            value={form.allergies}
            onChangeText={f("allergies")}
            placeholder="e.g. Penicillin, Pollen, Dust"
            placeholderTextColor="#9ca3af"
            multiline
          />
        </Field>

        <Field label="Chronic Diseases (comma-separated)">
          <TextInput
            style={[s.input, s.inputMulti]}
            value={form.chronicDiseases}
            onChangeText={f("chronicDiseases")}
            placeholder="e.g. Diabetes, Hypertension"
            placeholderTextColor="#9ca3af"
            multiline
          />
        </Field>

        <Field label="Current Medications (comma-separated)">
          <TextInput
            style={[s.input, s.inputMulti]}
            value={form.currentMedications}
            onChangeText={f("currentMedications")}
            placeholder="e.g. Metformin 500mg, Aspirin"
            placeholderTextColor="#9ca3af"
            multiline
          />
        </Field>

        <View style={s.actionRow}>
          <TouchableOpacity style={[s.btn, s.cancelBtn]} onPress={() => navigation.goBack()}>
            <Text style={s.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btn, s.saveBtn, saving && s.saveBtnDisabled]}
            onPress={handleSave} disabled={saving}
          >
            {saving
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={s.saveText}>Save Changes</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={s.fieldWrapper}>
      <Text style={s.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: "#f1f5f9" },
  header:        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: BLUE, paddingHorizontal: 16, paddingVertical: 16 },
  backText:      { color: "#fff", fontSize: 16, fontWeight: "bold" },
  headerTitle:   { color: "#fff", fontSize: 18, fontWeight: "bold" },
  body:          { padding: 16, paddingBottom: 50 },
  optionalBanner:{ backgroundColor: "#eff6ff", borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: "#bfdbfe" },
  optionalBannerText: { fontSize: 13, color: "#1d4ed8", fontWeight: "500" },
  fieldWrapper:  { marginBottom: 16 },
  fieldLabel:    { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  input:         { borderWidth: 1.5, borderColor: "#d1d5db", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#111827", backgroundColor: "#fff" },
  inputMulti:    { minHeight: 80, textAlignVertical: "top" },
  actionRow:     { flexDirection: "row", gap: 10, marginTop: 20 },
  btn:           { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  cancelBtn:     { backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#d1d5db" },
  cancelText:    { color: "#374151", fontWeight: "700", fontSize: 14 },
  saveBtn:       { backgroundColor: BLUE, elevation: 3, shadowColor: BLUE, shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  saveBtnDisabled:{ opacity: 0.6 },
  saveText:      { color: "#fff", fontWeight: "700", fontSize: 14 },
});