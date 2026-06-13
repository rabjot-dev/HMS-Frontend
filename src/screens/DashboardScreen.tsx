import React, {  useState } from "react";
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

const BLUE = "#2563eb";
const BLUE_LIGHT = "#eff6ff";

export default function DashboardScreen({ navigation }: any) {
  const [userName] = useState("John");

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
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {userName} 👋</Text>
            <Text style={styles.greetingSub}>Good to see you!</Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <Text style={{ fontSize: 20 }}>🧑‍💼</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Your Health,{"\n"}Our Priority</Text>
            <Text style={styles.heroSub}>Book appointments with{"\n"}top doctors easily.</Text>
          </View>
          <Text style={{ fontSize: 70, marginTop: 4 }}>👨‍⚕️</Text>
        </View>

        {/* Quick Action Grid */}
        <View style={styles.grid}>
          <ActionCard
            icon="📅"
            label="Book Appointment"
            color="#dbeafe"
            iconColor={BLUE}
            onPress={() => navigation.navigate("BookAppointmentScreen")}
          />
          <ActionCard
            icon="🗓️"
            label="View Appointments"
            color="#d1fae5"
            iconColor="#059669"
            onPress={() => navigation.navigate("Appointments")}
          />
          <ActionCard
            icon="👨‍⚕️"
            label="Find Doctors"
            color="#fce7f3"
            iconColor="#db2777"
            onPress={() => Alert.alert("Coming Soon", "Health Records feature coming soon!")}
          />
          <ActionCard
            icon="📋"
            label="Health Records"
            color="#fef3c7"
            iconColor="#d97706"
            onPress={() => Alert.alert("Coming Soon", "Health Records feature coming soon!")}
          />
        </View>

        {/* Upcoming Appointment */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointment</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Appointments")}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.upcomingCard}>
          <View style={styles.upcomingLeft}>
            <View style={styles.docAvatar}>
              <Text style={{ fontSize: 22 }}>👩‍⚕️</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.docName}>Dr. Sarah Johnson</Text>
            <Text style={styles.docSpec}>Cardiologist</Text>
            <View style={styles.upcomingMeta}>
              <Text style={styles.metaText}>📅 20 May 2024</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>🕐 10:30 AM</Text>
            </View>
          </View>
          <View style={styles.scheduledBadge}>
            <Text style={styles.scheduledText}>Scheduled</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>🚪  Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function ActionCard({ icon, label, color, iconColor, onPress }: any) {
  return (
    <TouchableOpacity style={[styles.actionCard, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.actionIconCircle}>
        <Text style={{ fontSize: 26 }}>{icon}</Text>
      </View>
      <Text style={[styles.actionLabel, { color: iconColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f3f4f6" },
  body: { paddingBottom: 40 },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
    backgroundColor: "#fff",
  },
  greeting: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  greetingSub: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  notifBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#f3f4f6",
    alignItems: "center", justifyContent: "center",
  },
  heroBanner: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: BLUE, marginHorizontal: 16, marginTop: 16,
    borderRadius: 18, paddingHorizontal: 20, paddingVertical: 20,
    overflow: "hidden",
  },
  heroTitle: { fontSize: 20, fontWeight: "bold", color: "#fff", lineHeight: 28 },
  heroSub: { fontSize: 12, color: "#bfdbfe", marginTop: 6, lineHeight: 18 },
  grid: {
    flexDirection: "row", flexWrap: "wrap",
    paddingHorizontal: 12, marginTop: 20, gap: 12,
  },
  actionCard: {
    width: "46%", borderRadius: 16, padding: 16,
    alignItems: "center",
  },
  actionIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center", justifyContent: "center", marginBottom: 10,
  },
  actionLabel: { fontSize: 13, fontWeight: "700", textAlign: "center" },
  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, marginTop: 24, marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  viewAll: { fontSize: 13, color: BLUE, fontWeight: "600" },
  upcomingCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", marginHorizontal: 16,
    borderRadius: 14, padding: 14,
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.06,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  upcomingLeft: { marginRight: 12 },
  docAvatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: "#dbeafe",
    alignItems: "center", justifyContent: "center",
  },
  docName: { fontSize: 15, fontWeight: "700", color: "#111827" },
  docSpec: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  upcomingMeta: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 4 },
  metaText: { fontSize: 11, color: "#6b7280" },
  metaDot: { color: "#9ca3af", fontSize: 10 },
  scheduledBadge: {
    backgroundColor: "#d1fae5", paddingHorizontal: 8,
    paddingVertical: 4, borderRadius: 8,
  },
  scheduledText: { fontSize: 11, color: "#065f46", fontWeight: "700" },
  logoutBtn: {
    marginHorizontal: 16, marginTop: 24,
    borderWidth: 1.5, borderColor: "#ef4444",
    borderRadius: 12, paddingVertical: 13,
    alignItems: "center", backgroundColor: "#fff5f5",
  },
  logoutText: { color: "#ef4444", fontWeight: "700", fontSize: 14 },
});