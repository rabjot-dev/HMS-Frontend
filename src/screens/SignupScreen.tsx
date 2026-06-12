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

// ─── Validation helpers ────────────────────────────────────────────────────────
const isAlpha = (v: string) => /^[A-Za-z\s]+$/.test(v);
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v);
const isPhone = (v: string) => /^\d{10}$/.test(v);

type FormFields = "firstName"|"lastName"|"email"|"phone"|"gender"|"dateOfBirth"|"password"|"confirmPassword";
type Errors = Partial<Record<FormFields, string>>;

export default function SignupScreen({ navigation }: any) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors]           = useState<Errors>({});
  const [loading, setLoading]         = useState(false);

  // Date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateObj, setDateObj]               = useState<Date | null>(null);

  // Gender dropdown
  const [genderDropdown, setGenderDropdown] = useState(false);

  // Password visibility
  const [showPwd, setShowPwd]     = useState(false);
  const [showConfPwd, setShowConfPwd] = useState(false);

  const set = (key: FormFields) => (val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // ── Full form validation ─────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Errors = {};

    if (!form.firstName.trim())             e.firstName = "First name is required.";
    else if (!isAlpha(form.firstName.trim())) e.firstName = "First name must contain only letters.";

    if (!form.lastName.trim())              e.lastName = "Last name is required.";
    else if (!isAlpha(form.lastName.trim()))  e.lastName = "Last name must contain only letters.";

    if (!form.email.trim())                 e.email = "Email is required.";
    else if (!isEmail(form.email.trim()))   e.email = "Enter a valid email (e.g. you@example.com).";

    if (!form.phone.trim())                 e.phone = "Phone number is required.";
    else if (!isPhone(form.phone.trim()))   e.phone = "Phone number must be exactly 10 digits.";

    if (!form.gender)                       e.gender = "Please select a gender.";

    if (!form.dateOfBirth)                  e.dateOfBirth = "Date of birth is required.";

    if (!form.password)                     e.password = "Password is required.";
    else if (form.password.length < 6)      e.password = "Password must be at least 6 characters.";
    else if (!/[A-Z]/.test(form.password))  e.password = "Password must include at least one uppercase letter.";
    else if (!/[0-9]/.test(form.password))  e.password = "Password must include at least one number.";

    if (!form.confirmPassword)                        e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword)  e.confirmPassword = "Passwords do not match.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
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

  // ── Date picker handler ──────────────────────────────────────────────────────
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

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.headerBox}>
            <Text style={styles.logoIcon}>🏥</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Fill in the details below to get started.</Text>
          </View>

          {/* ── Personal Info section ── */}
          <SectionTitle title="Personal Information" />

          <Field label="First Name *" error={errors.firstName}>
            <FieldInput
              value={form.firstName}
              onChangeText={set("firstName")}
              placeholder="e.g. John"
              autoCapitalize="words"
              hasError={!!errors.firstName}
            />
          </Field>

          <Field label="Last Name *" error={errors.lastName}>
            <FieldInput
              value={form.lastName}
              onChangeText={set("lastName")}
              placeholder="e.g. Doe"
              autoCapitalize="words"
              hasError={!!errors.lastName}
            />
          </Field>

          <Field label="Email Address *" error={errors.email}>
            <FieldInput
              value={form.email}
              onChangeText={set("email")}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              hasError={!!errors.email}
            />
          </Field>

          <Field label="Phone Number *" error={errors.phone}>
            <FieldInput
              value={form.phone}
              onChangeText={(v:string) => {
                // Allow only digits, max 10
                const digits = v.replace(/\D/g, "").slice(0, 10);
                set("phone")(digits);
              }}
              placeholder="10-digit mobile number"
              keyboardType="number-pad"
              maxLength={10}
              hasError={!!errors.phone}
            />
          </Field>

          {/* Gender Dropdown */}
          <Field label="Gender *" error={errors.gender}>
            <TouchableOpacity
              style={[styles.inputBox, errors.gender ? styles.inputError : null]}
              onPress={() => setGenderDropdown(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.inputText, !form.gender && { color: "#9ca3af" }]}>
                {form.gender || "Select gender"}
              </Text>
              <Text style={styles.chevron}>▾</Text>
            </TouchableOpacity>
          </Field>

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
                    {form.gender === g && <Text style={{ color: BLUE }}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Date of Birth */}
          <Field label="Date of Birth *" error={errors.dateOfBirth}>
            <TouchableOpacity
              style={[styles.inputBox, errors.dateOfBirth ? styles.inputError : null]}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.inputIcon}>📅</Text>
              <Text style={[styles.inputText, !form.dateOfBirth && { color: "#9ca3af" }]}>
                {form.dateOfBirth || "Select date of birth"}
              </Text>
            </TouchableOpacity>
          </Field>

          {showDatePicker && Platform.OS === "android" && (
            <DateTimePicker
              value={dateObj ?? new Date(2000, 0, 1)}
              mode="date"
              display="calendar"
              maximumDate={new Date()}
              onChange={onDateChange}
            />
          )}

          {showDatePicker && Platform.OS === "ios" && (
            <View style={styles.iosPicker}>
              <TouchableOpacity
                style={styles.doneBtn}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
              <DateTimePicker
                value={dateObj ?? new Date(2000, 0, 1)}
                mode="date"
                display="inline"
                maximumDate={new Date()}
                accentColor={BLUE}
                themeVariant="light"
                onChange={onDateChange}
              />
            </View>
          )}

          {/* ── Account section ── */}
          <SectionTitle title="Account Security" />

          <Field label="Password *" error={errors.password}>
            <View style={[styles.inputBox, errors.password ? styles.inputError : null]}>
              <TextInput
                style={styles.inputFlex}
                value={form.password}
                onChangeText={set("password")}
                placeholder="Min 6 chars, 1 uppercase, 1 number"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPwd}
              />
              <TouchableOpacity onPress={() => setShowPwd((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.eyeIcon}>{showPwd ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
          </Field>

          <Field label="Confirm Password *" error={errors.confirmPassword}>
            <View style={[styles.inputBox, errors.confirmPassword ? styles.inputError : null]}>
              <TextInput
                style={styles.inputFlex}
                value={form.confirmPassword}
                onChangeText={set("confirmPassword")}
                placeholder="Re-enter your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showConfPwd}
              />
              <TouchableOpacity onPress={() => setShowConfPwd((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.eyeIcon}>{showConfPwd ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
          </Field>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>{loading ? "Creating Account…" : "Create Account"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")} style={styles.loginRow}>
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.loginLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Small components ─────────────────────────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionLine} />
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.errorText}>⚠ {error}</Text> : null}
    </View>
  );
}

function FieldInput({ hasError, ...props }: any) {
  return (
    <TextInput
      style={[styles.inputBox, styles.inputFlex, hasError ? styles.inputError : null]}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BLUE_LIGHT },
  container: { padding: 20, paddingBottom: 20 },

  // Header
  headerBox: { alignItems: "center", marginBottom: 24, marginTop: 8 },
  logoIcon: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: "bold", color: BLUE_DARK, letterSpacing: 0.3 },
  subtitle: { fontSize: 13, color: "#6b7280", marginTop: 4 },

  // Section title
  sectionTitleRow: { flexDirection: "row", alignItems: "center", marginVertical: 18 },
  sectionLine: { flex: 1, height: 1, backgroundColor: BLUE_BORDER },
  sectionTitle: { color: BLUE, fontWeight: "700", fontSize: 12, marginHorizontal: 10, letterSpacing: 0.5, textTransform: "uppercase" },

  // Fields
  fieldWrapper: { marginBottom: 4 },
  label: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: BLUE_BORDER,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: 15,
    color: "#111827",
  },
  inputError: { borderColor: "#ef4444", backgroundColor: "#fff5f5" },
  inputFlex: { flex: 1, fontSize: 15, color: "#111827" },
  inputText: { flex: 1, fontSize: 15, color: "#111827" },
  inputIcon: { fontSize: 16, marginRight: 8 },
  chevron: { color: "#6b7280", fontSize: 16 },
  eyeIcon: { fontSize: 18, paddingLeft: 8 },

  errorText: { fontSize: 12, color: "#ef4444", marginTop: 4, marginLeft: 2 },

  // Gender dropdown modal
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", paddingHorizontal: 40 },
  dropdownSheet: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden" },
  dropdownTitle: { fontSize: 14, fontWeight: "700", color: BLUE_DARK, padding: 16, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  dropdownItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14 },
  dropdownItemActive: { backgroundColor: BLUE_LIGHT },
  dropdownItemText: { fontSize: 15, color: "#374151" },
  dropdownItemTextActive: { color: BLUE, fontWeight: "700" },

  // iOS date picker
  iosPicker: { backgroundColor: "#fff", borderRadius: 12, padding: 10, marginBottom: 8 },
  doneBtn: { alignSelf: "flex-end", backgroundColor: BLUE, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 8, marginBottom: 6 },
  doneBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  // Submit
  submitBtn: {
    marginTop: 24,
    backgroundColor: BLUE,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    elevation: 4,
    shadowColor: BLUE,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  submitBtnDisabled: { opacity: 0.65 },
  submitBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  // Login link
  loginRow: { marginTop: 20, alignItems: "center" },
  loginText: { fontSize: 14, color: "#6b7280" },
  loginLink: { color: BLUE, fontWeight: "700" },
});