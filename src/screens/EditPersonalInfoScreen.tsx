import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { validatePersonalForm, ValidationErrors } from "../utils/profileValidation";

// ─── Dropdown options ─────────────────────────────────────────────────────────
const GENDER_OPTIONS       = ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"];
const BLOOD_GROUP_OPTIONS  = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const MARITAL_OPTIONS      = ["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED"];

const BLUE = "#2563eb";

// ─── Simple Dropdown ──────────────────────────────────────────────────────────
function Dropdown({
  label, value, options, onSelect, error,
}: {
  label: string; value: string; options: string[];
  onSelect: (v: string) => void; error?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={dd.wrapper}>
      <Text style={dd.label}>{label} <Text style={{ color: "red" }}>*</Text></Text>
      <TouchableOpacity
        style={[dd.btn, error ? dd.btnError : null]}
        onPress={() => setOpen((p) => !p)}
        activeOpacity={0.8}
      >
        <Text style={value ? dd.selected : dd.placeholder}>
          {value || `Select ${label}`}
        </Text>
        <Text style={dd.arrow}>{open ? "▲" : "▾"}</Text>
      </TouchableOpacity>
      {open && (
        <View style={dd.list}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[dd.option, value === opt && dd.optionActive]}
              onPress={() => { onSelect(opt); setOpen(false); }}
            >
              <Text style={[dd.optionText, value === opt && dd.optionTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {error ? <Text style={dd.error}>{error}</Text> : null}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function EditPersonalInfoScreen({ navigation, route }: any) {
  const { initialValues, onSave } = route.params as {
    initialValues: {
      firstName: string; lastName: string; gender: string;
      bloodGroup: string; maritalStatus: string; dateOfBirth: string;
    };
    onSave: (values: typeof initialValues) => Promise<void>;
  };

  const [form, setForm]     = useState({ ...initialValues });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const f = (key: keyof typeof form) => (val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

 const parsedDate = form.dateOfBirth
  ? new Date(form.dateOfBirth)
  : new Date();

  const handleSave = async () => {
    const errs = validatePersonalForm(form);
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
        <Text style={s.headerTitle}>Personal Information</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
        {/* First Name */}
        <Field label="First Name" required error={errors.firstName}>
          <TextInput
            style={[s.input, errors.firstName ? s.inputError : null]}
            value={form.firstName}
            onChangeText={f("firstName")}
            placeholder="Enter first name"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
          />
        </Field>

        {/* Last Name */}
        <Field label="Last Name" required error={errors.lastName}>
          <TextInput
            style={[s.input, errors.lastName ? s.inputError : null]}
            value={form.lastName}
            onChangeText={f("lastName")}
            placeholder="Enter last name"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
          />
        </Field>

        {/* Gender */}
        <Dropdown
          label="Gender" value={form.gender}
          options={GENDER_OPTIONS} onSelect={f("gender")} error={errors.gender}
        />

        {/* Date of Birth */}
        <View style={s.fieldWrapper}>
          <Text style={s.fieldLabel}>Date of Birth <Text style={{ color: "red" }}>*</Text></Text>
          <TouchableOpacity
            style={[s.input, s.dateBtn, errors.dateOfBirth ? s.inputError : null]}
            onPress={() => setShowPicker(true)}
          >
            <Text style={form.dateOfBirth ? s.dateText : s.datePlaceholder}>
              {form.dateOfBirth
                ? new Date(form.dateOfBirth).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "long", year: "numeric",
                  })
                : "Select date of birth"}
            </Text>
            <Text style={s.calIcon}>📅</Text>
          </TouchableOpacity>
          {errors.dateOfBirth ? <Text style={s.errorText}>{errors.dateOfBirth}</Text> : null}
          {showPicker && (
           <DateTimePicker
  value={parsedDate}
  mode="date"
  display={Platform.OS === "ios" ? "spinner" : "default"}
  maximumDate={new Date()}
  onChange={(event, selectedDate) => {
    setShowPicker(false);

    if (selectedDate) {
      f("dateOfBirth")(selectedDate.toISOString());
    }
  }}
/>
          )}
        </View>

        {/* Blood Group */}
        <Dropdown
          label="Blood Group" value={form.bloodGroup}
          options={BLOOD_GROUP_OPTIONS} onSelect={f("bloodGroup")} error={errors.bloodGroup}
        />

        {/* Marital Status */}
        <Dropdown
          label="Marital Status" value={form.maritalStatus}
          options={MARITAL_OPTIONS} onSelect={f("maritalStatus")} error={errors.maritalStatus}
        />

        {/* Actions */}
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
  safe:        { flex: 1, backgroundColor: "#f1f5f9" },
  header:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: BLUE, paddingHorizontal: 16, paddingVertical: 16 },
  backText:    { color: "#fff", fontSize: 16, fontWeight: "bold" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  body:        { padding: 16, paddingBottom: 50 },
  fieldWrapper:{ marginBottom: 16 },
  fieldLabel:  { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  input:       { borderWidth: 1.5, borderColor: "#d1d5db", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#111827", backgroundColor: "#fff" },
  inputError:  { borderColor: "#ef4444" },
  dateBtn:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dateText:    { fontSize: 14, color: "#111827" },
  datePlaceholder: { fontSize: 14, color: "#9ca3af" },
  calIcon:     { fontSize: 16 },
  errorText:   { color: "#ef4444", fontSize: 12, marginTop: 4 },
  actionRow:   { flexDirection: "row", gap: 10, marginTop: 20 },
  btn:         { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  cancelBtn:   { backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#d1d5db" },
  cancelText:  { color: "#374151", fontWeight: "700", fontSize: 14 },
  saveBtn:     { backgroundColor: BLUE, elevation: 3, shadowColor: BLUE, shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  saveBtnDisabled: { opacity: 0.6 },
  saveText:    { color: "#fff", fontWeight: "700", fontSize: 14 },
});

const dd = StyleSheet.create({
  wrapper:       { marginBottom: 16 },
  label:         { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  btn:           { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1.5, borderColor: "#d1d5db", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: "#fff" },
  btnError:      { borderColor: "#ef4444" },
  selected:      { fontSize: 14, color: "#111827" },
  placeholder:   { fontSize: 14, color: "#9ca3af" },
  arrow:         { color: "#6b7280", fontSize: 13 },
  list:          { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, backgroundColor: "#fff", marginTop: 4, overflow: "hidden", elevation: 4, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6 },
  option:        { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  optionActive:  { backgroundColor: "#eff6ff" },
  optionText:    { fontSize: 14, color: "#374151" },
  optionTextActive: { color: BLUE, fontWeight: "700" },
  error:         { color: "#ef4444", fontSize: 12, marginTop: 4 },
});