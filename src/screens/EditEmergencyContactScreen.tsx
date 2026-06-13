import React, { useState } from "react";
import {
  Alert, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { validateEmergencyForm, ValidationErrors } from "../utils/profileValidation";

const BLUE = "#2563eb";

export default function EditEmergencyContactScreen({ navigation, route }: any) {
  const { initialValues, onSave } = route.params as {
    initialValues: {
      emergencyContactName: string;
      emergencyContactPhone: string;
      relationship: string;
    };
    onSave: (values: typeof initialValues) => Promise<void>;
  };

  const [form, setForm]     = useState({ ...initialValues });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);

  const f = (key: keyof typeof form) => (val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSave = async () => {
    const errs = validateEmergencyForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
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
        <Text style={s.headerTitle}>Emergency Contact</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
        <Field label="Contact Name" required error={errors.emergencyContactName}>
          <TextInput
            style={[s.input, errors.emergencyContactName ? s.inputError : null]}
            value={form.emergencyContactName}
            onChangeText={f("emergencyContactName")}
            placeholder="Full name (letters only)"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
          />
        </Field>

        <Field label="Contact Phone" required error={errors.emergencyContactPhone}>
          <TextInput
            style={[s.input, errors.emergencyContactPhone ? s.inputError : null]}
            value={form.emergencyContactPhone}
            onChangeText={(v) => f("emergencyContactPhone")(v.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit phone number"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            maxLength={10}
          />
        </Field>

        <Field label="Relationship" required error={errors.relationship}>
          <TextInput
            style={[s.input, errors.relationship ? s.inputError : null]}
            value={form.relationship}
            onChangeText={f("relationship")}
            placeholder="e.g. Spouse, Parent, Sibling"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
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

function Field({ label, required, children, error }: {
  label: string; required?: boolean; children: React.ReactNode; error?: string;
}) {
  return (
    <View style={s.fieldWrapper}>
      <Text style={s.fieldLabel}>
        {label}{required ? <Text style={{ color: "red" }}> *</Text> : ""}
      </Text>
      {children}
      {error ? <Text style={s.errorText}>{error}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: "#f1f5f9" },
  header:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: BLUE, paddingHorizontal: 16, paddingVertical: 16 },
  backText:     { color: "#fff", fontSize: 16, fontWeight: "bold" },
  headerTitle:  { color: "#fff", fontSize: 18, fontWeight: "bold" },
  body:         { padding: 16, paddingBottom: 50 },
  fieldWrapper: { marginBottom: 16 },
  fieldLabel:   { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  input:        { borderWidth: 1.5, borderColor: "#d1d5db", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#111827", backgroundColor: "#fff" },
  inputError:   { borderColor: "#ef4444" },
  errorText:    { color: "#ef4444", fontSize: 12, marginTop: 4 },
  actionRow:    { flexDirection: "row", gap: 10, marginTop: 20 },
  btn:          { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  cancelBtn:    { backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#d1d5db" },
  cancelText:   { color: "#374151", fontWeight: "700", fontSize: 14 },
  saveBtn:      { backgroundColor: BLUE, elevation: 3, shadowColor: BLUE, shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  saveBtnDisabled: { opacity: 0.6 },
  saveText:     { color: "#fff", fontWeight: "700", fontSize: 14 },
});