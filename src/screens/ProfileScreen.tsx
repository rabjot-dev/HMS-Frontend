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
import { getPatientId } from "../utils/storage";
import client from "../api/client";

// ─── Types ────────────────────────────────────────────────────────────────────
type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  bloodGroup: string;
  maritalStatus: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  relationship: string;
  allergies: string;
  chronicDiseases: string;
  currentMedications: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
};

const EMPTY_FORM: ProfileForm = {
  firstName: "", lastName: "", email: "", phone: "",
  gender: "", bloodGroup: "", maritalStatus: "", dateOfBirth: "",
  address: "", city: "", state: "", pincode: "", country: "",
  emergencyContactName: "", emergencyContactPhone: "", relationship: "",
  allergies: "", chronicDiseases: "", currentMedications: "",
  insuranceProvider: "", insurancePolicyNumber: "",
};

function profileToForm(data: any): ProfileForm {
  return {
    firstName:             data.firstName             ?? "",
    lastName:              data.lastName              ?? "",
    email:                 data.email                 ?? "",
    phone:                 data.phone                 ?? "",
    gender:                data.gender                ?? "",
    bloodGroup:            data.bloodGroup            ?? "",
    maritalStatus:         data.maritalStatus         ?? "",
    dateOfBirth:           data.dateOfBirth           ?? "",
    address:               data.address               ?? "",
    city:                  data.city                  ?? "",
    state:                 data.state                 ?? "",
    pincode:               data.pincode               ?? "",
    country:               data.country               ?? "",
    emergencyContactName:  data.emergencyContactName  ?? "",
    emergencyContactPhone: data.emergencyContactPhone ?? "",
    relationship:          data.relationship          ?? "",
    allergies:             Array.isArray(data.allergies)
                             ? data.allergies.join(", ") : "",
    chronicDiseases:       Array.isArray(data.chronicDiseases)
                             ? data.chronicDiseases.join(", ") : "",
    currentMedications:    Array.isArray(data.currentMedications)
                             ? data.currentMedications.join(", ") : "",
    insuranceProvider:     data.insuranceProvider     ?? "",
    insurancePolicyNumber: data.insurancePolicyNumber ?? "",
  };
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState<ProfileForm>(EMPTY_FORM);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const patientId = await getPatientId();
      if (!patientId) {
        Alert.alert("Session Error", "Please login again.");
        return;
      }
      const res = await client.get(`/patients/${patientId}`);
      if (res.data.success) {
        setProfile(res.data.data);
        setForm(profileToForm(res.data.data));
      } else {
        Alert.alert("Error", res.data.message || "Failed to load profile");
      }
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  // ── Shared API save ──────────────────────────────────────────────────────────
  const savePartial = async (partial: Partial<ProfileForm>) => {
    const patientId = await getPatientId();
    const merged    = { ...form, ...partial };
    const payload   = {
      ...merged,
      allergies:          toArray(merged.allergies),
      chronicDiseases:    toArray(merged.chronicDiseases),
      currentMedications: toArray(merged.currentMedications),
    };
    const res = await client.put(`/patients/${patientId}`, payload);
    if (res.data.success) {
      setProfile(res.data.data);
      setForm(profileToForm(res.data.data));
    } else {
      throw new Error(res.data.message || "Update failed");
    }
  };

  // ── Navigate to edit screens with pre-filled values + onSave callback ────────
  const editPersonal = () =>
    navigation.navigate("EditPersonalInfo", {
      initialValues: {
        firstName:    form.firstName,
        lastName:     form.lastName,
        gender:       form.gender,
        bloodGroup:   form.bloodGroup,
        maritalStatus:form.maritalStatus,
        dateOfBirth:  form.dateOfBirth,
      },
      onSave: async (vals: any) => savePartial(vals),
    });

  const editContact = () =>
    navigation.navigate("EditContactInfo", {
      initialValues: {
        email:   form.email, // passed as read-only display
        phone:   form.phone,
        address: form.address,
        city:    form.city,
        state:   form.state,
        pincode: form.pincode,
        country: form.country,
      },
      onSave: async (vals: any) => savePartial(vals),
    });

  const editEmergency = () =>
    navigation.navigate("EditEmergencyContact", {
      initialValues: {
        emergencyContactName:  form.emergencyContactName,
        emergencyContactPhone: form.emergencyContactPhone,
        relationship:          form.relationship,
      },
      onSave: async (vals: any) => savePartial(vals),
    });

  const editMedical = () =>
    navigation.navigate("EditMedicalInfo", {
      initialValues: {
        allergies:          form.allergies,
        chronicDiseases:    form.chronicDiseases,
        currentMedications: form.currentMedications,
      },
      onSave: async (vals: any) => savePartial(vals),
    });

  const editInsurance = () =>
    navigation.navigate("EditInsurance", {
      initialValues: {
        insuranceProvider:     form.insuranceProvider,
        insurancePolicyNumber: form.insurancePolicyNumber,
      },
      onSave: async (vals: any) => savePartial(vals),
    });

  const fullName = profile
    ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
    : "";

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Profile</Text>
        <View style={{ width: 50 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={BLUE} style={{ marginTop: 48 }} />
      ) : !profile ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>👤</Text>
          <Text style={s.emptyText}>Profile not found.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">

          {/* Hero card */}
          <View style={s.heroCard}>
            <View style={s.avatarRing}>
              <View style={s.avatarCircle}>
                <Text style={s.avatarText}>
                  {(profile.firstName ?? "P").charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={s.heroName}>{fullName || "—"}</Text>
            {profile.email ? <Text style={s.heroSub}>{profile.email}</Text> : null}
            {profile.phone ? <Text style={s.heroSub}>{profile.phone}</Text> : null}
            <Text style={s.heroId}>Patient ID: {profile.patientId}</Text>
            <View style={s.heroBadgeRow}>
              {profile.patientType && (
                <View style={[s.heroBadge, { backgroundColor: "#dbeafe" }]}>
                  <Text style={[s.heroBadgeText, { color: BLUE }]}>{profile.patientType}</Text>
                </View>
              )}
              {profile.status && (
                <View style={[s.heroBadge, { backgroundColor: "#d1fae5" }]}>
                  <Text style={[s.heroBadgeText, { color: "#065f46" }]}>{profile.status}</Text>
                </View>
              )}
              {profile.bloodGroup && (
                <View style={[s.heroBadge, { backgroundColor: "#fee2e2" }]}>
                  <Text style={[s.heroBadgeText, { color: "#991b1b" }]}>🩸 {profile.bloodGroup}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Sections */}
          <SectionCard
            icon="👤" title="Personal Information"
            onEdit={editPersonal}
          >
            <InfoRow label="First Name"    value={profile.firstName} />
            <InfoRow label="Last Name"     value={profile.lastName} />
            <InfoRow label="Gender"        value={profile.gender} />
            <InfoRow label="Date of Birth" value={
              profile.dateOfBirth
                ? new Date(profile.dateOfBirth).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "long", year: "numeric",
                  })
                : undefined
            } />
            <InfoRow label="Blood Group"   value={profile.bloodGroup} />
            <InfoRow label="Marital Status" value={profile.maritalStatus} />
          </SectionCard>

          <SectionCard
            icon="📞" title="Contact Information"
            onEdit={editContact}
          >
            <InfoRow label="Phone"   value={profile.phone} />
            <InfoRow label="Email"   value={profile.email} />
            <InfoRow label="Address" value={profile.address} />
            <InfoRow label="City"    value={profile.city} />
            <InfoRow label="State"   value={profile.state} />
            <InfoRow label="Pincode" value={profile.pincode} />
            <InfoRow label="Country" value={profile.country} />
          </SectionCard>

          <SectionCard
            icon="🚨" title="Emergency Contact"
            onEdit={editEmergency}
          >
            <InfoRow label="Name"         value={profile.emergencyContactName} />
            <InfoRow label="Phone"        value={profile.emergencyContactPhone} />
            <InfoRow label="Relationship" value={profile.relationship} />
          </SectionCard>

          <SectionCard
            icon="🏥" title="Medical Information"
            onEdit={editMedical}
            optional
          >
            <InfoRow label="Assigned Doctor" value={profile.assignedDoctor?.name} />
            <InfoRow label="Department"      value={profile.department} />
            <InfoRow label="Allergies"       value={toDisplay(profile.allergies)} />
            <InfoRow label="Chronic Diseases" value={toDisplay(profile.chronicDiseases)} />
            <InfoRow label="Medications"     value={toDisplay(profile.currentMedications)} />
            <InfoRow label="Medical History" value={profile.medicalHistory} />
            <InfoRow label="Family History"  value={profile.familyMedicalHistory} />
          </SectionCard>

          <SectionCard
            icon="🛡️" title="Insurance"
            onEdit={editInsurance}
            optional
          >
            <InfoRow label="Provider"      value={profile.insuranceProvider} />
            <InfoRow label="Policy Number" value={profile.insurancePolicyNumber} />
            <InfoRow label="Expiry"        value={
              profile.insuranceExpiryDate
                ? new Date(profile.insuranceExpiryDate).toLocaleDateString("en-IN")
                : undefined
            } />
            <InfoRow label="Coverage"      value={
              profile.insuranceCoverageAmount
                ? `₹${profile.insuranceCoverageAmount.toLocaleString()}`
                : undefined
            } />
          </SectionCard>

          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── SectionCard ─────────────────────────────────────────────────────────────
function SectionCard({
  icon, title, children, onEdit, optional,
}: {
  icon: string; title: string; children: React.ReactNode;
  onEdit: () => void; optional?: boolean;
}) {
  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <View style={s.cardTitleRow}>
          <View style={s.cardIconCircle}>
            <Text style={s.cardIcon}>{icon}</Text>
          </View>
          <View>
            <Text style={s.cardTitle}>{title}</Text>
            {optional && <Text style={s.optionalTag}>Optional</Text>}
          </View>
        </View>
        <TouchableOpacity style={s.editBtn} onPress={onEdit}>
          <Text style={s.editBtnText}>✏️ Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={s.divider} />
      {children}
    </View>
  );
}

// ─── InfoRow ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={[s.infoValue, !value && s.infoValueEmpty]}>{value || "—"}</Text>
    </View>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const toArray = (s: string) =>
  s ? s.split(",").map((x) => x.trim()).filter(Boolean) : [];

const toDisplay = (arr: any) =>
  Array.isArray(arr) && arr.length > 0 ? arr.join(", ") : undefined;

// ─── Styles ──────────────────────────────────────────────────────────────────
const BLUE       = "#2563eb";
const BLUE_LIGHT = "#eff6ff";

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: "#f1f5f9" },
  header:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: BLUE, paddingHorizontal: 16, paddingVertical: 16 },
  backText:    { color: "#fff", fontSize: 16, fontWeight: "bold" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  body:        { padding: 16, paddingBottom: 50 },

  // Empty
  empty:     { alignItems: "center", marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: "#6b7280" },

  // Hero card
  heroCard: {
    backgroundColor: "#fff", borderRadius: 20, padding: 24,
    alignItems: "center", marginBottom: 16,
    elevation: 4, shadowColor: "#000", shadowOpacity: 0.08,
    shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
  },
  avatarRing:  { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: BLUE, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  avatarCircle:{ width: 84, height: 84, borderRadius: 42, backgroundColor: BLUE, alignItems: "center", justifyContent: "center" },
  avatarText:  { fontSize: 36, color: "#fff", fontWeight: "bold" },
  heroName:    { fontSize: 20, fontWeight: "bold", color: "#111827", marginBottom: 2 },
  heroSub:     { fontSize: 13, color: "#6b7280", marginBottom: 2 },
  heroId:      { fontSize: 12, color: "#9ca3af", marginTop: 6, marginBottom: 10 },
  heroBadgeRow:{ flexDirection: "row", flexWrap: "wrap", gap: 6, justifyContent: "center" },
  heroBadge:   { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  heroBadgeText:{ fontSize: 12, fontWeight: "700" },

  // Section card
  card: {
    backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 14,
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
  },
  cardHeader:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  cardTitleRow:{ flexDirection: "row", alignItems: "center", gap: 10 },
  cardIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: BLUE_LIGHT, alignItems: "center", justifyContent: "center" },
  cardIcon:    { fontSize: 15 },
  cardTitle:   { fontSize: 14, fontWeight: "700", color: "#111827" },
  optionalTag: { fontSize: 10, color: "#6b7280", fontWeight: "500", marginTop: 1 },
  divider:     { height: 1, backgroundColor: "#f3f4f6", marginBottom: 10 },

  // Edit button per section
  editBtn:     { flexDirection: "row", alignItems: "center", backgroundColor: BLUE_LIGHT, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  editBtnText: { fontSize: 12, fontWeight: "700", color: BLUE },

  // View info row
  infoRow:       { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#f9fafb" },
  infoLabel:     { fontSize: 13, color: "#6b7280", fontWeight: "600", flex: 1 },
  infoValue:     { fontSize: 13, color: "#111827", flex: 1.5, textAlign: "right" },
  infoValueEmpty:{ color: "#d1d5db" },
});
