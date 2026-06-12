import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { removeToken } from "../utils/storage";
import PrimaryButton from "../components/PrimaryButton";

export default function DashboardScreen({ navigation }: any) {
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await removeToken();
          navigation.replace("LoginScreen");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Patient Dashboard</Text>
          <TouchableOpacity
            style={styles.profileIconBtn}
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <Text style={{ fontSize: 22 }}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Stat cards */}
        <View style={styles.cardRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Today's Appointments</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>--</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <PrimaryButton
            title="📅 View Appointments"
            onPress={() => navigation.navigate("Appointments")}
          />

          <PrimaryButton
            title="📝 Book Appointment"
            onPress={() => navigation.navigate("BookAppointmentScreen")}
            color="#10b981"
          />

          <PrimaryButton
            title="👤 My Profile"
            onPress={() => navigation.navigate("ProfileScreen")}
            color="#7c3aed"
          />

          <PrimaryButton
            title="🚪 Logout"
            onPress={handleLogout}
            color="#ef4444"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1f2937",
  },
  profileIconBtn: {
    width: 44,
    height: 44,
    backgroundColor: "#dbeafe",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  cardRow: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  statNumber: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  actionsContainer: {
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 14,
  },
});
