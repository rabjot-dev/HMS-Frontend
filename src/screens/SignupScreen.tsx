import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signupApi } from "../api/auth.api";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

export default function SignupScreen({ navigation }: any) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "MALE",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSignup = async () => {
    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!form.firstName || !form.email || !form.password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await signupApi(form);
      Alert.alert("Success", "Account created successfully", [
        { text: "OK", onPress: () => navigation.replace("LoginScreen") },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🏥 Patient Signup</Text>
        <Text style={styles.subtitle}>Create your account to get started.</Text>

        <InputField
          label="First Name"
          value={form.firstName}
          onChangeText={set("firstName")}
          autoCapitalize="words"
        />
        <InputField
          label="Last Name"
          value={form.lastName}
          onChangeText={set("lastName")}
          autoCapitalize="words"
        />
        <InputField
          label="Email"
          value={form.email}
          onChangeText={set("email")}
          keyboardType="email-address"
        />
        <InputField
          label="Phone"
          value={form.phone}
          onChangeText={set("phone")}
          keyboardType="phone-pad"
        />
        <InputField
          label="Gender (MALE / FEMALE / OTHER)"
          value={form.gender}
          onChangeText={set("gender")}
        />
        <InputField
          label="Date of Birth (YYYY-MM-DD)"
          value={form.dateOfBirth}
          onChangeText={set("dateOfBirth")}
          placeholder="YYYY-MM-DD"
        />
        <InputField
          label="Password"
          value={form.password}
          onChangeText={set("password")}
          secureTextEntry
        />
        <InputField
          label="Confirm Password"
          value={form.confirmPassword}
          onChangeText={set("confirmPassword")}
          secureTextEntry
        />

        <PrimaryButton title="Sign Up" onPress={handleSignup} loading={loading} />

        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0f172a",
    marginBottom: 6,
    marginTop: 16,
  },
  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 24,
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
