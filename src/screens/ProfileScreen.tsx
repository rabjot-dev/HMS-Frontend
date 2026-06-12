import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPatientId } from "../utils/storage";
import client from "../api/client";

export default function ProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ── Edit mode state ────────────────────────────────────────────────────────
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
    gender: "",
    allergies: "",
    insuranceProvider: "",
  });

  // ── Load profile ───────────────────────────────────────────────────────────
  const loadProfile = async () => {
    try {
      setLoading(true);
      const patientId = await getPatientId();

      if (!patientId) {
        Alert.alert("Session Error", "Patient ID not found. Please login again.");
        return;
      }

      const res = await client.get(`/patients/${patientId}`);
      if (res.data.success) {
        const data = res.data.data;
        setProfile(data);
        setForm({
          name:              data.name              ?? "",
          phone:             data.phone             ?? "",
          email:             data.email             ?? "",
          address:           data.address           ?? "",
          bloodGroup:        data.bloodGroup        ?? "",
          gender:            data.gender            ?? "",
          allergies:         Array.isArray(data.allergies)
                               ? data.allergies.join(", ")
                               : (data.allergies ?? ""),
          insuranceProvider: data.insuranceProvider ?? "",
        });
      } else {
        Alert.alert("Error", res.data.message || "Failed to load profile");
      }
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ── Save edits ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert("Required", "Name cannot be empty.");
      return;
    }
    try {
      setSaving(true);
      const patientId = await getPatientId();
      const payload = {
        ...form,
        allergies: form.allergies
          ? form.allergies.split(",").map((a) => a.trim()).filter(Boolean)
          : [],
      };
      const res = await client.put(`/patients/${patientId}`, payload);
      if (res.data.success) {
        setProfile(res.data.data);
        setEditMode(false);
        Alert.alert("Success", "Profile updated successfully.");
      } else {
        Alert.alert("Error", res.data.message || "Update failed");
      }
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setForm({
        name:              profile.name              ?? "",
        phone:             profile.phone             ?? "",
        email:             profile.email             ?? "",
        address:           profile.address           ?? "",
        bloodGroup:        profile.bloodGroup        ?? "",
        gender:            profile.gender            ?? "",
        allergies:         Array.isArray(profile.allergies)
                             ? profile.allergies.join(", ")
                             : (profile.allergies ?? ""),
        insuranceProvider: profile.insuranceProvider ?? "",
      });
    }
    setEditMode(false);
  };

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 60 }}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        {!loading && profile ? (
          <TouchableOpacity
            style={styles.editToggleBtn}
            onPress={() => (editMode ? handleCancelEdit() : setEditMode(true))}
          >
            <Text style={styles.editToggleText}>
              {editMode ? "Cancel" : "✏️ Edit"}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 40 }} />
      ) : !profile ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>👤</Text>
          <Text style={styles.emptyText}>Profile not found.</Text>
        </View>
      ) : editMode ? (

        /* ── EDIT MODE ──────────────────────────────────────────────────── */
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

          <View style={styles.editBanner}>
            <Text style={styles.editBannerText}>✏️  Editing Profile — tap Cancel to discard</Text>
          </View>

          <SectionCard title="👤 Personal Information">
            <EditField
              label="Full Name"
              value={form.name}
              onChangeText={(v) => setField("name", v)}
              placeholder="Enter full name"
            />
            <EditField
              label="Gender"
              value={form.gender}
              onChangeText={(v) => setField("gender", v)}
              placeholder="Male / Female / Other"
            />
            <EditField
              label="Blood Group"
              value={form.bloodGroup}
              onChangeText={(v) => setField("bloodGroup", v)}
              placeholder="e.g. A+, B-, O+"
            />
          </SectionCard>

          <SectionCard title="📞 Contact Information">
            <EditField
              label="Phone"
              value={form.phone}
              onChangeText={(v) => setField("phone", v)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
            <EditField
              label="Email"
              value={form.email}
              onChangeText={(v) => setField("email", v)}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <EditField
              label="Address"
              value={form.address}
              onChangeText={(v) => setField("address", v)}
              placeholder="Enter address"
              multiline
            />
          </SectionCard>

          <SectionCard title="🏥 Medical Information">
            <EditField
              label="Allergies (comma-separated)"
              value={form.allergies}
              onChangeText={(v) => setField("allergies", v)}
              placeholder="e.g. Penicillin, Pollen"
            />
            <EditField
              label="Insurance Provider"
              value={form.insuranceProvider}
              onChangeText={(v) => setField("insuranceProvider", v)}
              placeholder="Enter insurance provider"
            />
          </SectionCard>

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>💾  Save Changes</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>

      ) : (

        /* ── VIEW MODE ──────────────────────────────────────────────────── */
        <ScrollView contentContainerStyle={styles.body}>

          {/* Avatar + Name */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {profile.name?.charAt(0).toUpperCase() ?? "P"}
              </Text>
            </View>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileId}>ID: {profile.patientId ?? profile._id}</Text>
          </View>

          <SectionCard title="👤 Personal Information">
            <InfoRow label="Full Name"     value={profile.name} />
            <InfoRow label="Gender"        value={profile.gender} />
            <InfoRow
              label="Date of Birth"
              value={
                profile.dateOfBirth
                  ? new Date(profile.dateOfBirth).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "long", year: "numeric",
                    })
                  : undefined
              }
            />
            <InfoRow label="Blood Group"   value={profile.bloodGroup} />
          </SectionCard>

          <SectionCard title="📞 Contact Information">
            <InfoRow label="Phone"   value={profile.phone} />
            <InfoRow label="Email"   value={profile.email} />
            <InfoRow label="Address" value={profile.address} />
          </SectionCard>

          <SectionCard title="🏥 Medical Information">
            <InfoRow label="Assigned Doctor" value={profile.assignedDoctor?.name} />
            <InfoRow
              label="Allergies"
              value={
                Array.isArray(profile.allergies) && profile.allergies.length > 0
                  ? profile.allergies.join(", ")
                  : undefined
              }
            />
            <InfoRow
              label="Medical History"
              value={
                Array.isArray(profile.medicalHistory) && profile.medicalHistory.length > 0
                  ? profile.medicalHistory.join(", ")
                  : undefined
              }
            />
            <InfoRow label="Insurance" value={profile.insuranceProvider} />
          </SectionCard>

          <SectionCard title="🔒 Account">
            <InfoRow label="Status" value={profile.status} />
            <InfoRow
              label="Joined"
              value={
                profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "long", year: "numeric",
                    })
                  : undefined
              }
            />
          </SectionCard>

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.divider} />
      {children}
    </View>
  );
}

// ─── View mode row ────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value ?? "—"}</Text>
    </View>
  );
}

// ─── Edit mode field ──────────────────────────────────────────────────────────
function EditField({
  label, value, onChangeText, placeholder, keyboardType, autoCapitalize, multiline,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: any;
  autoCapitalize?: any;
  multiline?: boolean;
}) {
  return (
    <View style={styles.editFieldWrapper}>
      <Text style={styles.editFieldLabel}>{label}</Text>
      <TextInput
        style={[styles.editFieldInput, multiline && styles.editFieldInputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        keyboardType={keyboardType ?? "default"}
        autoCapitalize={autoCapitalize ?? "words"}
        multiline={multiline ?? false}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const BLUE       = "#2563eb";
const BLUE_LIGHT = "#eff6ff";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f4f6" },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: BLUE, paddingHorizontal: 16, paddingVertical: 16,
  },
  backText:      { color: "#fff", fontSize: 16, fontWeight: "bold", width: 60 },
  headerTitle:   { color: "#fff", fontSize: 20, fontWeight: "bold" },
  editToggleBtn: {
    backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 8,
  },
  editToggleText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  body: { padding: 16, paddingBottom: 40 },

  empty:     { alignItems: "center", marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: "#6b7280" },

  avatarSection: {
    alignItems: "center", marginBottom: 20, paddingVertical: 24,
    backgroundColor: "#fff", borderRadius: 16,
    elevation: 3, shadowColor: "#000", shadowOpacity: 0.07,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: BLUE, alignItems: "center",
    justifyContent: "center", marginBottom: 12,
  },
  avatarText:  { fontSize: 34, color: "#fff", fontWeight: "bold" },
  profileName: { fontSize: 22, fontWeight: "bold", color: "#111827", marginBottom: 4 },
  profileId:   { fontSize: 12, color: "#9ca3af" },

  editBanner: {
    backgroundColor: "#fef3c7", borderRadius: 10, padding: 12,
    marginBottom: 14, alignItems: "center",
    borderWidth: 1, borderColor: "#fcd34d",
  },
  editBannerText: { color: "#92400e", fontWeight: "700", fontSize: 13 },

  card: {
    backgroundColor: "#fff", borderRadius: 14, padding: 16,
    marginBottom: 14, elevation: 2, shadowColor: "#000",
    shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 1 },
  },
  cardTitle: { fontSize: 14, fontWeight: "700", color: BLUE, marginBottom: 10 },
  divider:   { height: 1, backgroundColor: "#f3f4f6", marginBottom: 10 },

  infoRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "flex-start", paddingVertical: 7,
    borderBottomWidth: 1, borderBottomColor: "#f9fafb",
  },
  infoLabel: { fontSize: 13, color: "#6b7280", fontWeight: "600", flex: 1 },
  infoValue: { fontSize: 13, color: "#111827", flex: 1.5, textAlign: "right" },

  editFieldWrapper: { marginBottom: 14 },
  editFieldLabel:   { fontSize: 12, fontWeight: "600", color: "#6b7280", marginBottom: 5 },
  editFieldInput: {
    borderWidth: 1.5, borderColor: "#d1d5db", borderRadius: 10,
    paddingHorizontal: 13, paddingVertical: 11,
    fontSize: 14, color: "#111827", backgroundColor: "#f9fafb",
  },
  editFieldInputMultiline: { minHeight: 80, textAlignVertical: "top" },

  saveBtn: {
    marginTop: 8, backgroundColor: BLUE, borderRadius: 12,
    paddingVertical: 15, alignItems: "center",
    elevation: 3, shadowColor: BLUE, shadowOpacity: 0.3,
    shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText:     { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
