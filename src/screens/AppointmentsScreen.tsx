import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMyPatientAppointmentsApi } from "../api/patient.api";

export default function AppointmentsScreen({ navigation }: any) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await getMyPatientAppointmentsApi();
      if (res.data.success) {
        setAppointments(res.data.data);
      } else {
        Alert.alert("Error", res.data.message || "Failed to load appointments");
      }
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const statusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "#10b981";
      case "pending":   return "#f59e0b";
      case "cancelled": return "#ef4444";
      default:          return "#6b7280";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {appointments.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyText}>No appointments found.</Text>
            </View>
          ) : (
            appointments.map((appt) => (
              <View key={appt._id} style={styles.card}>
                {/* Top row: name + status badge */}
                <View style={styles.cardHeader}>
                  <Text style={styles.patientName}>{appt.patientName}</Text>
                  <View style={[styles.badge, { backgroundColor: statusColor(appt.status) }]}>
                    <Text style={styles.badgeText}>{appt.status}</Text>
                  </View>
                </View>

                <Text style={styles.apptId}>ID: {appt.appointmentId}</Text>

                <View style={styles.divider} />

                <InfoRow icon="👨‍⚕️" label="Doctor" value={appt.doctorName} />
                <InfoRow
                  icon="📅"
                  label="Date"
                  value={new Date(appt.appointmentDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                />
                <InfoRow icon="🕐" label="Time" value={appt.appointmentTime} />
                <InfoRow icon="🏷️" label="Type" value={appt.type} />
                {appt.notes ? (
                  <InfoRow icon="📝" label="Notes" value={appt.notes} />
                ) : null}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value?: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value ?? "—"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    width: 60,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    padding: 15,
    paddingBottom: 40,
  },
  empty: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  apptId: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "600",
    marginRight: 4,
    width: 52,
  },
  infoValue: {
    fontSize: 13,
    color: "#111827",
    flex: 1,
  },
});
