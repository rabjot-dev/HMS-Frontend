import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { resetPasswordApi } from "../api/auth.api";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

export default function ResetPasswordScreen({ navigation, route }: any) {
  // ✅ Read params passed from LoginScreen (first login) or used standalone (forgot password)
  const prefillEmail = route.params?.email || "";
  const isFirstLogin = route.params?.isFirstLogin || false;

  const [email, setEmail] = useState(prefillEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordApi({ email, newPassword, confirmPassword });

      Alert.alert(
        "Success",
        isFirstLogin
          ? "Password updated! Please log in with your new password."
          : "Password reset successful",
        [{ text: "OK", onPress: () => navigation.replace("LoginScreen") }]
      );
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* ✅ Title changes based on context */}
        <Text style={styles.title}>
          {isFirstLogin ? "Set Your Password" : "Reset Password"}
        </Text>

        {/* ✅ Subtitle explains why if it's a forced reset */}
        <Text style={styles.subtitle}>
          {isFirstLogin
            ? "You're using a temporary password. Please set a new one to continue."
            : "Enter your email and choose a new password."}
        </Text>

        {/* ✅ Email is locked/read-only on first login — prefilled and non-editable */}
        <InputField
          label="Email"
          value={email}
          onChangeText={isFirstLogin ? () => {} : setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <InputField
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <PrimaryButton
          title={isFirstLogin ? "Set Password" : "Reset Password"}
          onPress={handleReset}
          loading={loading}
        />

        {/* ✅ Hide back link on first login — user must complete password reset */}
        {!isFirstLogin && (
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={styles.link}>Back to Login</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    padding: 24,
    justifyContent: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0f172a",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 28,
    fontSize: 14,
  },
  link: {
    marginTop: 18,
    textAlign: "center",
    color: "#2563eb",
    fontWeight: "600",
    fontSize: 14,
  },
});