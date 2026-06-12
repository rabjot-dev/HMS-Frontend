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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPatientId } from "../utils/storage";

export default function AppointmentsScreen({ navigation }: any) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      
       const patientId = await getPatientId();
    // use whatever key you stored it under

    if (!patientId) {
      Alert.alert("Error", "Patient ID not found. Please login again.");
      return;
    } const res = await getMyPatientAppointmentsApi(patientId);
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
  switch (status?.toUpperCase()) {
    case "APPROVED":  return "#10b981"; // green
    case "PENDING":   return "#f59e0b"; // yellow
    case "REJECTED":  return "#ef4444"; // red
    case "BOOKED":    return "#2563eb"; // blue
    default:          return "#6b7280"; // gray
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
    
    <View style={styles.cardHeader}>
      {/* patientName comes from populated patientId */}
      <Text style={styles.patientName}>
        {appt.patientId?.name ?? "Patient"}
      </Text>
      {/* use approvalStatus instead of status */}
      <View style={[styles.badge, { backgroundColor: statusColor(appt.approvalStatus) }]}>
        <Text style={styles.badgeText}>{appt.approvalStatus}</Text>
      </View>
    </View>

    <Text style={styles.apptId}>ID: {appt.appointmentId}</Text>
    <View style={styles.divider} />

    {/* doctorEmployeeId is the populated doctor object */}
    <InfoRow icon="👨‍⚕️" label="Doctor"  value={appt.doctorEmployeeId?.name} />
    <InfoRow
      icon="📅"
      label="Date"
      value={new Date(appt.appointmentDate).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      })}
    />
    {/* timeSlot instead of appointmentTime */}
    <InfoRow icon="🕐" label="Time"   value={appt.timeSlot} />
    {/* appointmentType instead of type */}
    <InfoRow icon="🏷️" label="Type"   value={appt.appointmentType} />
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
