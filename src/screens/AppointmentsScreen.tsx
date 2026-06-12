import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getMyPatientAppointmentsApi, updatePatientAppointmentApi } from "../api/patient.api";
import { getPatientId } from "../utils/storage";

export default function AppointmentsScreen({ navigation }: any) {
  // ── List state ─────────────────────────────────────────────────────────────
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ── Edit modal state ───────────────────────────────────────────────────────
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [editDate, setEditDate] = useState(new Date());
  const [editSlot, setEditSlot] = useState("");
  const [showEditCalendar, setShowEditCalendar] = useState(false);
  const [updating, setUpdating] = useState(false);

  // ── Load appointments ──────────────────────────────────────────────────────
  const loadAppointments = async () => {
    try {
      setLoading(true);
      const patientId = await getPatientId();

      if (!patientId) {
        Alert.alert("Session Error", "Patient ID not found. Please login again.");
        return;
      }

      const res = await getMyPatientAppointmentsApi(patientId);
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

  // ── Edit helpers ───────────────────────────────────────────────────────────
  const openEditModal = (appt: any) => {
    setSelectedAppt(appt);
    setEditDate(new Date(appt.appointmentDate));
    setEditSlot(appt.timeSlot ?? "");
    setEditModalVisible(true);
  };

  const toApiDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const handleUpdate = async () => {
    if (!selectedAppt) return;
    if (!editSlot.trim()) {
      Alert.alert("Required", "Please enter a time slot.");
      return;
    }
    try {
      setUpdating(true);
      const res = await updatePatientAppointmentApi(selectedAppt._id, {
        appointmentDate: toApiDate(editDate),
        timeSlot: editSlot.trim(),
      });
      if (res.data.success) {
        Alert.alert("Success", "Appointment updated successfully.");
        setEditModalVisible(false);
        loadAppointments();
      } else {
        Alert.alert("Error", res.data.message || "Update failed");
      }
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Failed to update appointment");
    } finally {
      setUpdating(false);
    }
  };

  // ── Status helpers ─────────────────────────────────────────────────────────
  const statusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":  return "#10b981";
      case "PENDING":   return "#f59e0b";
      case "REJECTED":  return "#ef4444";
      case "BOOKED":    return "#2563eb";
      default:          return "#6b7280";
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
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

                {/* Top row: patient name + status badge */}
                <View style={styles.cardHeader}>
                  <Text style={styles.patientName}>
                    {appt.patientId?.name ?? "Patient"}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: statusColor(appt.approvalStatus) }]}>
                    <Text style={styles.badgeText}>{appt.approvalStatus}</Text>
                  </View>
                </View>

                <Text style={styles.apptId}>ID: {appt.appointmentId}</Text>
                <View style={styles.divider} />

                <InfoRow icon="👨‍⚕️" label="Doctor" value={appt.doctorEmployeeId?.name} />
                <InfoRow
                  icon="📅"
                  label="Date"
                  value={new Date(appt.appointmentDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                />
                <InfoRow icon="🕐" label="Time"  value={appt.timeSlot} />
                <InfoRow icon="🏷️" label="Type"  value={appt.appointmentType} />
                {appt.notes ? (
                  <InfoRow icon="📝" label="Notes" value={appt.notes} />
                ) : null}

                {/* Edit button — only for PENDING appointments */}
                {appt.approvalStatus === "PENDING" && (
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => openEditModal(appt)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.editBtnText}>✏️  Edit Appointment</Text>
                  </TouchableOpacity>
                )}

              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* ── Edit Modal ───────────────────────────────────────────────────── */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>

            {/* Modal header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>✏️  Edit Appointment</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={styles.sheetClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 20 }} keyboardShouldPersistTaps="handled">

              {/* Current info (read-only) */}
              {selectedAppt && (
                <View style={styles.currentInfoBox}>
                  <Text style={styles.currentInfoTitle}>Current Appointment</Text>
                  <Text style={styles.currentInfoText}>
                    🏥 {selectedAppt.doctorEmployeeId?.name ?? "—"}
                  </Text>
                  <Text style={styles.currentInfoText}>
                    📅 {new Date(selectedAppt.appointmentDate).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                    {"   "}🕐 {selectedAppt.timeSlot ?? "—"}
                  </Text>
                </View>
              )}

              {/* New Date */}
              <Text style={styles.editLabel}>📅  New Date</Text>
              <TouchableOpacity
                style={styles.editSelectBox}
                onPress={() => setShowEditCalendar(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.editSelectText}>
                  {editDate.toLocaleDateString("en-IN", {
                    day: "2-digit", month: "long", year: "numeric",
                  })}
                </Text>
                <Text style={styles.chevron}>▾</Text>
              </TouchableOpacity>

              {showEditCalendar && Platform.OS === "ios" && (
                <>
                  <TouchableOpacity
                    style={styles.doneBtn}
                    onPress={() => setShowEditCalendar(false)}
                  >
                    <Text style={styles.doneBtnText}>Done</Text>
                  </TouchableOpacity>
                  <DateTimePicker
                    value={editDate}
                    mode="date"
                    display="inline"
                    minimumDate={new Date()}
                    accentColor="#2563eb"
                    themeVariant="light"
                    onChange={(_e, selected) => {
                      if (selected) setEditDate(selected);
                    }}
                  />
                </>
              )}

              {showEditCalendar && Platform.OS === "android" && (
                <DateTimePicker
                  value={editDate}
                  mode="date"
                  display="calendar"
                  minimumDate={new Date()}
                  onChange={(_e, selected) => {
                    setShowEditCalendar(false);
                    if (selected) setEditDate(selected);
                  }}
                />
              )}

              {/* New Time Slot */}
              <Text style={styles.editLabel}>🕐  New Time Slot</Text>
              <TextInput
                style={styles.editInput}
                value={editSlot}
                onChangeText={setEditSlot}
                placeholder="e.g. 10:00 AM"
                placeholderTextColor="#9ca3af"
              />
              <Text style={styles.editHint}>
                Enter the time slot exactly as shown (e.g. 09:00 AM)
              </Text>

              {/* Save button */}
              <TouchableOpacity
                style={[styles.saveBtn, updating && styles.saveBtnDisabled]}
                onPress={handleUpdate}
                disabled={updating}
                activeOpacity={0.85}
              >
                {updating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>

              <View style={{ height: 20 }} />
            </ScrollView>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }: { icon: string; label: string; value?: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value ?? "—"}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const BLUE       = "#2563eb";
const BLUE_LIGHT = "#eff6ff";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f4f6" },

  // Header
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: BLUE, paddingHorizontal: 16, paddingVertical: 16,
  },
  backText:    { color: "#fff", fontSize: 16, fontWeight: "bold", width: 60 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  // List
  list: { padding: 15, paddingBottom: 40 },

  // Empty state
  empty:     { alignItems: "center", marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: "#6b7280" },

  // Card
  card: {
    backgroundColor: "#fff", borderRadius: 14, padding: 16,
    marginBottom: 14, elevation: 3, shadowColor: "#000",
    shadowOpacity: 0.07, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 4,
  },
  patientName: { fontSize: 16, fontWeight: "bold", color: "#111827", flex: 1 },
  badge:       { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeText:   { color: "#fff", fontSize: 12, fontWeight: "bold", textTransform: "capitalize" },
  apptId:      { fontSize: 12, color: "#9ca3af", marginBottom: 10 },
  divider:     { height: 1, backgroundColor: "#f3f4f6", marginBottom: 10 },

  // InfoRow
  infoRow:   { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  infoIcon:  { fontSize: 14, marginRight: 6 },
  infoLabel: { fontSize: 13, color: "#6b7280", fontWeight: "600", marginRight: 4, width: 52 },
  infoValue: { fontSize: 13, color: "#111827", flex: 1 },

  // Edit button on card
  editBtn: {
    marginTop: 14, borderWidth: 1.5, borderColor: BLUE,
    borderRadius: 8, paddingVertical: 9, alignItems: "center",
  },
  editBtnText: { color: BLUE, fontWeight: "700", fontSize: 13 },

  // Modal overlay + sheet
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff", borderTopLeftRadius: 22,
    borderTopRightRadius: 22, maxHeight: "88%", paddingBottom: 10,
  },
  sheetHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 18,
    borderBottomWidth: 1, borderBottomColor: "#f3f4f6",
  },
  sheetTitle: { fontSize: 17, fontWeight: "bold", color: "#111827" },
  sheetClose: { fontSize: 18, color: "#6b7280", fontWeight: "bold" },

  // Current info box inside modal
  currentInfoBox: {
    backgroundColor: BLUE_LIGHT, borderRadius: 10, padding: 14, marginBottom: 8,
  },
  currentInfoTitle: { fontSize: 12, fontWeight: "700", color: BLUE, marginBottom: 6 },
  currentInfoText:  { fontSize: 13, color: "#374151", marginBottom: 3 },

  // Edit form fields
  editLabel: {
    fontSize: 13, fontWeight: "600", color: "#374151",
    marginBottom: 6, marginTop: 16,
  },
  editSelectBox: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderWidth: 1.5, borderColor: "#d1d5db", borderRadius: 10,
    padding: 13, backgroundColor: "#f9fafb",
  },
  editSelectText: { fontSize: 14, color: "#111827" },
  chevron:        { color: "#6b7280", fontSize: 16 },
  doneBtn: {
    alignSelf: "flex-end", marginBottom: 6,
    paddingHorizontal: 16, paddingVertical: 6,
    backgroundColor: BLUE, borderRadius: 8,
  },
  doneBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  editInput: {
    borderWidth: 1.5, borderColor: "#d1d5db", borderRadius: 10,
    padding: 13, fontSize: 14, color: "#111827", backgroundColor: "#f9fafb",
  },
  editHint: { fontSize: 11, color: "#9ca3af", marginTop: 4 },

  // Save button
  saveBtn: {
    marginTop: 24, backgroundColor: BLUE, borderRadius: 12,
    paddingVertical: 15, alignItems: "center",
    elevation: 3, shadowColor: BLUE, shadowOpacity: 0.3,
    shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText:     { color: "#fff", fontWeight: "bold", fontSize: 15 },
});