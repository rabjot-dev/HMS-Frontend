import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { signupApi } from "../api/auth.api";

const BLUE = "#2563eb";
const BLUE_DARK = "#1d4ed8";
const BLUE_LIGHT = "#eff6ff";
const BLUE_BORDER = "#bfdbfe";

const GENDERS = ["MALE", "FEMALE", "OTHER"];

const isAlpha = (v: string) => /^[A-Za-z\s]+$/.test(v);
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v);
const isPhone = (v: string) => /^\d{10}$/.test(v);

type FormFields = "firstName"|"lastName"|"email"|"phone"|"gender"|"dateOfBirth"|"password"|"confirmPassword";
type Errors = Partial<Record<FormFields, string>>;

export default function SignupScreen({ navigation }: any) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    gender: "", dateOfBirth: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateObj, setDateObj] = useState<Date | null>(null);
  const [genderDropdown, setGenderDropdown] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfPwd, setShowConfPwd] = useState(false);

  const set = (key: FormFields) => (val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    else if (!isAlpha(form.firstName.trim())) e.firstName = "Letters only.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    else if (!isAlpha(form.lastName.trim())) e.lastName = "Letters only.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!isEmail(form.email.trim())) e.email = "Enter a valid email.";
    if (!form.phone.trim()) e.phone = "Phone is required.";
    else if (!isPhone(form.phone.trim())) e.phone = "Must be 10 digits.";
    if (!form.gender) e.gender = "Please select a gender.";
    if (!form.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "At least 6 characters.";
    else if (!/[A-Z]/.test(form.password)) e.password = "Must include uppercase.";
    else if (!/[0-9]/.test(form.password)) e.password = "Must include a number.";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm password.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await signupApi(form);
      Alert.alert("🎉 Account Created", "Your account is ready. Please log in.", [
        { text: "Go to Login", onPress: () => navigation.replace("LoginScreen") },
      ]);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Signup failed. Please try again.";
      Alert.alert("Signup Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (_: any, selected?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selected) {
      setDateObj(selected);
      const y = selected.getFullYear();
      const m = String(selected.getMonth() + 1).padStart(2, "0");
      const d = String(selected.getDate()).padStart(2, "0");
      set("dateOfBirth")(`${y}-${m}-${d}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.headerBox}>
            <View style={styles.logoCircle}>
              <Text style={{ fontSize: 30 }}>🏥</Text>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>

            <Field label="Full Name" error={errors.firstName || errors.lastName}>
              <View style={styles.nameRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <TextInput
                    style={[styles.inputBox, errors.firstName && styles.inputError]}
                    value={form.firstName}
                    onChangeText={set("firstName")}
                    placeholder="First Name"
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="words"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    style={[styles.inputBox, errors.lastName && styles.inputError]}
                    value={form.lastName}
                    onChangeText={set("lastName")}
                    placeholder="Last Name"
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="words"
                  />
                </View>
              </View>
            </Field>

            <Field label="Email Address" error={errors.email}>
              <View style={[styles.inputRow, errors.email && styles.inputError]}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.inputFlex}
                  value={form.email}
                  onChangeText={set("email")}
                  placeholder="Email Address"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </Field>

            <Field label="Phone Number" error={errors.phone}>
              <View style={[styles.inputRow, errors.phone && styles.inputError]}>
                <Text style={styles.inputIcon}>📱</Text>
                <TextInput
                  style={styles.inputFlex}
                  value={form.phone}
                  onChangeText={(v) => set("phone")(v.replace(/\D/g, "").slice(0, 10))}
                  placeholder="Phone Number"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </View>
            </Field>

            <Field label="Gender" error={errors.gender}>
              <TouchableOpacity
                style={[styles.inputRow, errors.gender && styles.inputError]}
                onPress={() => setGenderDropdown(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.inputIcon}>👤</Text>
                <Text style={[styles.inputFlex, { color: form.gender ? "#111827" : "#9ca3af" }]}>
                  {form.gender ? (form.gender.charAt(0) + form.gender.slice(1).toLowerCase()) : "Select gender"}
                </Text>
                <Text style={styles.chevron}>▾</Text>
              </TouchableOpacity>
            </Field>

            <Field label="Date of Birth" error={errors.dateOfBirth}>
              <TouchableOpacity
                style={[styles.inputRow, errors.dateOfBirth && styles.inputError]}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.inputIcon}>📅</Text>
                <Text style={[styles.inputFlex, { color: form.dateOfBirth ? "#111827" : "#9ca3af" }]}>
                  {form.dateOfBirth || "Select date of birth"}
                </Text>
              </TouchableOpacity>
            </Field>

            {showDatePicker && Platform.OS === "android" && (
              <DateTimePicker value={dateObj ?? new Date(2000, 0, 1)} mode="date" display="calendar" maximumDate={new Date()} onChange={onDateChange} />
            )}
            {showDatePicker && Platform.OS === "ios" && (
              <View style={styles.iosPicker}>
                <TouchableOpacity style={styles.doneBtn} onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
                <DateTimePicker value={dateObj ?? new Date(2000, 0, 1)} mode="date" display="inline" maximumDate={new Date()} accentColor={BLUE} themeVariant="light" onChange={onDateChange} />
              </View>
            )}

            <Field label="Password" error={errors.password}>
              <View style={[styles.inputRow, errors.password && styles.inputError]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.inputFlex}
                  value={form.password}
                  onChangeText={set("password")}
                  placeholder="Password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPwd}
                />
                <TouchableOpacity onPress={() => setShowPwd(v => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.eyeIcon}>{showPwd ? "🙈" : "👁️"}</Text>
                </TouchableOpacity>
              </View>
            </Field>

            <Field label="Confirm Password" error={errors.confirmPassword}>
              <View style={[styles.inputRow, errors.confirmPassword && styles.inputError]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.inputFlex}
                  value={form.confirmPassword}
                  onChangeText={set("confirmPassword")}
                  placeholder="Confirm Password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showConfPwd}
                />
                <TouchableOpacity onPress={() => setShowConfPwd(v => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.eyeIcon}>{showConfPwd ? "🙈" : "👁️"}</Text>
                </TouchableOpacity>
              </View>
            </Field>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>{loading ? "Creating Account…" : "Sign Up"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")} style={styles.loginRow}>
            <Text style={styles.loginText}>
              Already have an account?{"  "}
              <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Gender Modal */}
      <Modal visible={genderDropdown} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setGenderDropdown(false)}>
          <View style={styles.dropdownSheet}>
            <Text style={styles.dropdownTitle}>Select Gender</Text>
            {GENDERS.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.dropdownItem, form.gender === g && styles.dropdownItemActive]}
                onPress={() => { set("gender")(g); setGenderDropdown(false); }}
              >
                <Text style={[styles.dropdownItemText, form.gender === g && styles.dropdownItemTextActive]}>
                  {g.charAt(0) + g.slice(1).toLowerCase()}
                </Text>
                {form.gender === g && <Text style={{ color: BLUE, fontWeight: "bold" }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.errorText}>⚠ {error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f4ff" },
  container: { padding: 24, paddingBottom: 20 },
  headerBox: { alignItems: "center", marginBottom: 24, marginTop: 4 },
  logoCircle: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: BLUE_LIGHT, borderWidth: 3, borderColor: BLUE,
    alignItems: "center", justifyContent: "center", marginBottom: 10,
  },
  title: { fontSize: 24, fontWeight: "bold", color: BLUE_DARK, letterSpacing: 0.3 },
  subtitle: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  card: {
    backgroundColor: "#fff", borderRadius: 20, padding: 20,
    elevation: 5, shadowColor: BLUE, shadowOpacity: 0.1,
    shadowRadius: 14, shadowOffset: { width: 0, height: 5 },
  },
  nameRow: { flexDirection: "row" },
  label: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  inputBox: {
    borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 10,
    backgroundColor: "#f9fafb", paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 13 : 9,
    fontSize: 14, color: "#111827",
  },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1.5, borderColor: "#e5e7eb",
    borderRadius: 10, backgroundColor: "#f9fafb",
    paddingHorizontal: 12, paddingVertical: Platform.OS === "ios" ? 13 : 9,
  },
  inputError: { borderColor: "#ef4444", backgroundColor: "#fff5f5" },
  inputFlex: { flex: 1, fontSize: 14, color: "#111827" },
  inputIcon: { fontSize: 15, marginRight: 8 },
  chevron: { color: "#6b7280", fontSize: 14 },
  eyeIcon: { fontSize: 17, paddingLeft: 8 },
  errorText: { fontSize: 11, color: "#ef4444", marginTop: 3, marginLeft: 2 },
  submitBtn: {
    marginTop: 8, backgroundColor: BLUE, borderRadius: 12,
    paddingVertical: 15, alignItems: "center",
    elevation: 4, shadowColor: BLUE, shadowOpacity: 0.38,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
  },
  submitBtnDisabled: { opacity: 0.65 },
  submitBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  loginRow: { marginTop: 22, alignItems: "center" },
  loginText: { fontSize: 14, color: "#6b7280" },
  loginLink: { color: BLUE, fontWeight: "700" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", paddingHorizontal: 40 },
  dropdownSheet: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden" },
  dropdownTitle: { fontSize: 14, fontWeight: "700", color: BLUE_DARK, padding: 16, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  dropdownItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14 },
  dropdownItemActive: { backgroundColor: BLUE_LIGHT },
  dropdownItemText: { fontSize: 15, color: "#374151" },
  dropdownItemTextActive: { color: BLUE, fontWeight: "700" },
  iosPicker: { backgroundColor: "#fff", borderRadius: 12, padding: 10, marginBottom: 8 },
  doneBtn: { alignSelf: "flex-end", backgroundColor: BLUE, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 8, marginBottom: 6 },
  doneBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});