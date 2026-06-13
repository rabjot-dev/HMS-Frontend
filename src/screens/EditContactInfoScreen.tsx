import React, { useState } from "react";
import {
  Alert, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { validateContactForm, ValidationErrors } from "../utils/profileValidation";

const BLUE = "#2563eb";

type ContactInitialValues = {
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

// onSave only sends the editable fields (email is read-only)
type ContactEditableValues = Omit<ContactInitialValues, "email">;

export default function EditContactInfoScreen({ navigation, route }: any) {
  const { initialValues, onSave } = route.params as {
    initialValues: ContactInitialValues;
    onSave: (values: ContactEditableValues) => Promise<void>;
  };

  const [form, setForm] = useState<ContactEditableValues>({
    phone:   initialValues.phone,
    address: initialValues.address,
    city:    initialValues.city,
    state:   initialValues.state,
    pincode: initialValues.pincode,
    country: initialValues.country,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);

  const f = (key: keyof ContactEditableValues) => (val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSave = async () => {
    const errs = validateContactForm(form);
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
        <Text style={s.headerTitle}>Contact Information</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">

        {/* Email — read-only, cannot be changed */}
        <View style={s.fieldWrapper}>
          <Text style={s.fieldLabel}>
            Email <Text style={s.disabledNote}>(cannot be changed)</Text>
          </Text>
          <View style={[s.input, s.inputDisabled]}>
            <Text style={s.disabledText}>{initialValues.email || "—"}</Text>
          </View>
        </View>

        {/* Phone */}
        <Field label="Phone" required error={errors.phone}>
          <TextInput
            style={[s.input, errors.phone ? s.inputError : null]}
            value={form.phone}
            onChangeText={(v) => f("phone")(v.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit phone number"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            maxLength={10}
          />
        </Field>

        {/* Address */}
        <Field label="Address" required error={errors.address}>
          <TextInput
            style={[s.input, s.inputMulti, errors.address ? s.inputError : null]}
            value={form.address}
            onChangeText={f("address")}
            placeholder="Street address"
            placeholderTextColor="#9ca3af"
            multiline
          />
        </Field>

        {/* City */}
        <Field label="City" required error={errors.city}>
          <TextInput
            style={[s.input, errors.city ? s.inputError : null]}
            value={form.city}
            onChangeText={f("city")}
            placeholder="City"
            placeholderTextColor="#9ca3af"
          />
        </Field>

        {/* State */}
        <Field label="State" required error={errors.state}>
          <TextInput
            style={[s.input, errors.state ? s.inputError : null]}
            value={form.state}
            onChangeText={f("state")}
            placeholder="State"
            placeholderTextColor="#9ca3af"
          />
        </Field>

        {/* Pincode */}
        <Field label="Pincode" required error={errors.pincode}>
          <TextInput
            style={[s.input, errors.pincode ? s.inputError : null]}
            value={form.pincode}
            onChangeText={(v) => f("pincode")(v.replace(/\D/g, "").slice(0, 6))}
            placeholder="6-digit pincode"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            maxLength={6}
          />
        </Field>

        {/* Country */}
        <Field label="Country" required error={errors.country}>
          <TextInput
            style={[s.input, errors.country ? s.inputError : null]}
            value={form.country}
            onChangeText={f("country")}
            placeholder="Country"
            placeholderTextColor="#9ca3af"
          />
        </Field>

        {/* Actions */}
        <View style={s.actionRow}>
          <TouchableOpacity style={[s.btn, s.cancelBtn]} onPress={() => navigation.goBack()}>
            <Text style={s.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btn, s.saveBtn, saving && s.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
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

// ─── Field wrapper ────────────────────────────────────────────────────────────
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: "#f1f5f9" },
  header:        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: BLUE, paddingHorizontal: 16, paddingVertical: 16 },
  backText:      { color: "#fff", fontSize: 16, fontWeight: "bold" },
  headerTitle:   { color: "#fff", fontSize: 18, fontWeight: "bold" },
  body:          { padding: 16, paddingBottom: 50 },
  fieldWrapper:  { marginBottom: 16 },
  fieldLabel:    { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  input:         { borderWidth: 1.5, borderColor: "#d1d5db", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#111827", backgroundColor: "#fff" },
  inputError:    { borderColor: "#ef4444" },
  inputMulti:    { minHeight: 80, textAlignVertical: "top" },
  inputDisabled: { backgroundColor: "#f3f4f6", borderColor: "#e5e7eb", justifyContent: "center" },
  disabledText:  { fontSize: 14, color: "#6b7280" },
  disabledNote:  { fontSize: 11, color: "#9ca3af", fontWeight: "400" },
  errorText:     { color: "#ef4444", fontSize: 12, marginTop: 4 },
  actionRow:     { flexDirection: "row", gap: 10, marginTop: 20 },
  btn:           { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  cancelBtn:     { backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#d1d5db" },
  cancelText:    { color: "#374151", fontWeight: "700", fontSize: 14 },
  saveBtn:       { backgroundColor: BLUE, elevation: 3, shadowColor: BLUE, shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  saveBtnDisabled: { opacity: 0.6 },
  saveText:      { color: "#fff", fontWeight: "700", fontSize: 14 },
});