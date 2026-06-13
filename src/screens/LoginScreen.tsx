import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { loginApi } from "../api/auth.api";
import { storeToken, storePatientId } from "../utils/storage";
import { jwtDecode } from "jwt-decode";

const BLUE = "#2563eb";
const BLUE_DARK = "#1d4ed8";
const BLUE_LIGHT = "#eff6ff";
const BLUE_BORDER = "#bfdbfe";

export default function LoginScreen({ navigation }: any) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ loginId?: string; password?: string }>({});

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors: { loginId?: string; password?: string } = {};

    if (!loginId.trim()) {
      newErrors.loginId = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginId.trim())) {
      newErrors.loginId = "Enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await loginApi({ loginId: loginId.trim(), password ,appType:"mobile"});
      const token = res.data?.data?.token;
      const user = res.data?.data?.user;

      if (!token) throw new Error("Token not received from server");

      await storeToken(token);

      const decoded: any = jwtDecode(token);
      const patientId = decoded?.patientId;
      if (patientId) await storePatientId(patientId);

      if (user?.isFirstLogin) {
        navigation.replace("ResetPassword", {
          email: user?.email,
          isFirstLogin: true,
        });
      } else {
        navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      setErrors({ loginId: " ", password: msg });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo / Header */}
        <View style={styles.logoBox}>
          <Text style={styles.logoIcon}>🏥</Text>
          <Text style={styles.title}>Patient Portal</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>

          {/* Email */}
          <Text style={styles.label}>Email Address</Text>
          <View style={[styles.inputBox, errors.loginId ? styles.inputError : null]}>
            <Text style={styles.inputIcon}>✉️</Text>
            <TextInput
              style={styles.input}
              value={loginId}
              onChangeText={(v) => { setLoginId(v); setErrors((e) => ({ ...e, loginId: undefined })); }}
              placeholder="you@example.com"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </View>
          {errors.loginId && errors.loginId !== " " && (
            <Text style={styles.errorText}>⚠ {errors.loginId}</Text>
          )}

          {/* Password */}
          <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
          <View style={[styles.inputBox, errors.password ? styles.inputError : null]}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
              placeholder="Enter your password"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.eyeIcon}> 👁</Text>
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>⚠ {errors.password}</Text>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Signup link */}
        <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={styles.signupRow}>
          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text style={styles.signupLink}>Create one</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: BLUE_LIGHT,
    padding: 24,
    justifyContent: "center",
  },

  // Header
  logoBox: { alignItems: "center", marginBottom: 32 },
  logoIcon: { fontSize: 56, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: "bold", color: BLUE_DARK, letterSpacing: 0.3 },
  subtitle: { fontSize: 14, color: "#6b7280", marginTop: 4 },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    elevation: 5,
    shadowColor: BLUE,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },

  label: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: BLUE_BORDER,
    borderRadius: 12,
    backgroundColor: "#f8faff",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 4,
  },
  inputError: { borderColor: "#ef4444", backgroundColor: "#fff5f5" },
  inputIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: "#111827" },
  eyeIcon: { fontSize: 18, paddingLeft: 8 },

  errorText: { fontSize: 12, color: "#ef4444", marginTop: 4, marginLeft: 4 },

  loginBtn: {
    marginTop: 24,
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: BLUE,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  loginBtnDisabled: { opacity: 0.65 },
  loginBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16, letterSpacing: 0.3 },

  // Signup link
  signupRow: { marginTop: 24, alignItems: "center" },
  signupText: { fontSize: 14, color: "#6b7280" },
  signupLink: { color: BLUE, fontWeight: "700" },
});