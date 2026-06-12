import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { loginApi } from "../api/auth.api";
import { storeToken, storePatientId } from "../utils/storage";
import { jwtDecode } from "jwt-decode";

export default function LoginScreen({ navigation }: any) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!loginId || !password) {
      alert("Please enter Login ID and Password");
      return;
    }

    try {
      setLoading(true);

      const res = await loginApi({ loginId, password });
      console.log("LOGIN RESPONSE:", res.data);

      const token = res.data?.data?.token;
      const user = res.data?.data?.user;

      if (!token) {
        throw new Error("Token not received from server");
      }

      await storeToken(token);

      const decoded: any = jwtDecode(token);
      const patientId = decoded?.patientId;
      if (patientId) {
        await storePatientId(patientId);
      }

      // ✅ Check if this is the user's first login (temp password)
     const firstLogin = user?.isFirstLogin;
      const userEmail = user?.email;

      if (firstLogin) {
        // Redirect to reset password — user must change temp password
        navigation.replace("ResetPassword", {
          email: userEmail,
          isFirstLogin: true,
        });
      } else {
        // Normal flow — go to Dashboard
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      }
    } catch (err: any) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏥 Patient Login</Text>

      <TextInput
        label="Email / Login ID"
        value={loginId}
        onChangeText={setLoginId}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      <Button
        mode="contained"
        loading={loading}
        onPress={handleLogin}
        style={styles.button}
      >
        Login
      </Button>

      <Text style={styles.link} onPress={() => navigation.navigate("Signup")}>
        Create new account
      </Text>

      <Text
        style={styles.link}
        onPress={() => navigation.navigate("ResetPassword")}
      >
        Forgot Password?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#0f172a",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    padding: 5,
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#2563eb",
    fontWeight: "600",
  },
});