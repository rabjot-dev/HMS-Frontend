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

// ─── Types ────────────────────────────────────────────────────────────────────
type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  bloodGroup: string;
  maritalStatus: string;
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
  gender: "", bloodGroup: "", maritalStatus: "",
  address: "", city: "", state: "", pincode: "", country: "",
  emergencyContactName: "", emergencyContactPhone: "", relationship: "",
  allergies: "", chronicDiseases: "", currentMedications: "",
  insuranceProvider: "", insurancePolicyNumber: "",
};

function profileToForm(data: any): ProfileForm {
  return {
    firstName:            data.firstName            ?? "",
    lastName:             data.lastName             ?? "",
    email:                data.email                ?? "",
    phone:                data.phone                ?? "",
    gender:               data.gender               ?? "",
    bloodGroup:           data.bloodGroup           ?? "",
    maritalStatus:        data.maritalStatus        ?? "",
    address:              data.address              ?? "",
    city:                 data.city                 ?? "",
    state:                data.state                ?? "",
    pincode:              data.pincode              ?? "",
    country:              data.country              ?? "",
    emergencyContactName: data.emergencyContactName ?? "",
    emergencyContactPhone:data.emergencyContactPhone?? "",
    relationship:         data.relationship         ?? "",
    allergies:            Array.isArray(data.allergies)
                            ? data.allergies.join(", ") : "",
    chronicDiseases:      Array.isArray(data.chronicDiseases)
                            ? data.chronicDiseases.join(", ") : "",
    currentMedications:   Array.isArray(data.currentMedications)
                            ? data.currentMedications.join(", ") : "",
    insuranceProvider:    data.insuranceProvider    ?? "",
    insurancePolicyNumber:data.insurancePolicyNumber?? "",
  };
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation }: any) {
  const [profile, setProfile]   = useState<any>(null);
  const [loading, setLoading]   = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState<ProfileForm>(EMPTY_FORM);
  const [activeSection, setActiveSection] = useState<string | null>(null);

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

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      Alert.alert("Required", "First and last name cannot be empty.");
      return;
    }
    try {
      setSaving(true);
      const patientId = await getPatientId();
      const payload = {
        ...form,
        allergies:          toArray(form.allergies),
        chronicDiseases:    toArray(form.chronicDiseases),
        currentMedications: toArray(form.currentMedications),
      };
      const res = await client.put(`/patients/${patientId}`, payload);
      if (res.data.success) {
        setProfile(res.data.data);
        setForm(profileToForm(res.data.data));
        setEditMode(false);
        setActiveSection(null);
        Alert.alert("✅ Saved", "Profile updated successfully.");
      } else {
        Alert.alert("Error", res.data.message || "Update failed");
      }
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) setForm(profileToForm(profile));
    setEditMode(false);
    setActiveSection(null);
  };

  const f = (key: keyof ProfileForm) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const fullName = profile
    ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
    : "";

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 56 }}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Profile</Text>
        <View style={{ width: 56 }} />
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

          {/* ── Hero card ── */}
          <View style={s.heroCard}>
            <View style={s.avatarRing}>
              <View style={s.avatarCircle}>
                <Text style={s.avatarText}>
                  {(profile.firstName ?? "P").charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={s.heroName}>{fullName || "—"}</Text>
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

            {/* Edit Profile Button — inside hero card, prominent */}
            {!editMode ? (
              <TouchableOpacity
                style={s.editProfileBtn}
                onPress={() => setEditMode(true)}
                activeOpacity={0.85}
              >
                <Text style={s.editProfileBtnText}>✏️  Edit Profile</Text>
              </TouchableOpacity>
            ) : (
              <View style={s.editActionRow}>
                <TouchableOpacity
                  style={[s.editActionBtn, s.cancelBtn]}
                  onPress={handleCancel}
                >
                  <Text style={s.cancelBtnText}>✕  Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.editActionBtn, s.saveBtn, saving && s.saveBtnDisabled]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={s.saveBtnText}>💾  Save</Text>
                  }
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ── Edit mode banner ── */}
          {editMode && (
            <View style={s.editBanner}>
              <Text style={s.editBannerIcon}>✏️</Text>
              <Text style={s.editBannerText}>
                You are editing your profile. Tap a section to expand and fill in your details.
              </Text>
            </View>
          )}

          {/* ── Sections ── */}
          <Section
            title="👤 Personal Information"
            editMode={editMode}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            viewContent={
              <>
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
              </>
            }
            editContent={
              <>
                <EditRow label="First Name"    value={form.firstName}    onChange={f("firstName")}    placeholder="Enter first name" />
                <EditRow label="Last Name"     value={form.lastName}     onChange={f("lastName")}     placeholder="Enter last name" />
                <EditRow label="Blood Group"   value={form.bloodGroup}   onChange={f("bloodGroup")}   placeholder="e.g. A+, B-, O+" />
                <EditRow label="Marital Status" value={form.maritalStatus} onChange={f("maritalStatus")} placeholder="SINGLE / MARRIED / DIVORCED" />
              </>
            }
          />

          <Section
            title="📞 Contact Information"
            editMode={editMode}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            viewContent={
              <>
                <InfoRow label="Phone"   value={profile.phone} />
                <InfoRow label="Email"   value={profile.email} />
                <InfoRow label="Address" value={profile.address} />
                <InfoRow label="City"    value={profile.city} />
                <InfoRow label="State"   value={profile.state} />
                <InfoRow label="Pincode" value={profile.pincode} />
                <InfoRow label="Country" value={profile.country} />
              </>
            }
            editContent={
              <>
                <EditRow label="Phone"   value={form.phone}   onChange={f("phone")}   placeholder="10-digit phone" keyboardType="phone-pad" autoCapitalize="none" />
                <EditRow label="Email"   value={form.email}   onChange={f("email")}   placeholder="Enter email" keyboardType="email-address" autoCapitalize="none" />
                <EditRow label="Address" value={form.address} onChange={f("address")} placeholder="Street address" multiline />
                <EditRow label="City"    value={form.city}    onChange={f("city")}    placeholder="City" />
                <EditRow label="State"   value={form.state}   onChange={f("state")}   placeholder="State" />
                <EditRow label="Pincode" value={form.pincode} onChange={f("pincode")} placeholder="Pincode" keyboardType="number-pad" />
                <EditRow label="Country" value={form.country} onChange={f("country")} placeholder="Country" />
              </>
            }
          />

          <Section
            title="🚨 Emergency Contact"
            editMode={editMode}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            viewContent={
              <>
                <InfoRow label="Name"         value={profile.emergencyContactName} />
                <InfoRow label="Phone"        value={profile.emergencyContactPhone} />
                <InfoRow label="Relationship" value={profile.relationship} />
              </>
            }
            editContent={
              <>
                <EditRow label="Contact Name"  value={form.emergencyContactName}  onChange={f("emergencyContactName")}  placeholder="Emergency contact name" />
                <EditRow label="Contact Phone" value={form.emergencyContactPhone} onChange={f("emergencyContactPhone")} placeholder="Emergency contact phone" keyboardType="phone-pad" />
                <EditRow label="Relationship"  value={form.relationship}          onChange={f("relationship")}          placeholder="e.g. Spouse, Parent" />
              </>
            }
          />

          <Section
            title="🏥 Medical Information"
            editMode={editMode}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            viewContent={
              <>
                <InfoRow label="Assigned Doctor" value={profile.assignedDoctor?.name} />
                <InfoRow label="Department"      value={profile.department} />
                <InfoRow label="Allergies"       value={toDisplay(profile.allergies)} />
                <InfoRow label="Chronic Diseases" value={toDisplay(profile.chronicDiseases)} />
                <InfoRow label="Medications"     value={toDisplay(profile.currentMedications)} />
                <InfoRow label="Medical History" value={profile.medicalHistory} />
                <InfoRow label="Family History"  value={profile.familyMedicalHistory} />
              </>
            }
            editContent={
              <>
                <EditRow label="Allergies (comma-separated)"       value={form.allergies}          onChange={f("allergies")}          placeholder="e.g. Penicillin, Pollen" />
                <EditRow label="Chronic Diseases (comma-separated)" value={form.chronicDiseases}    onChange={f("chronicDiseases")}    placeholder="e.g. Diabetes, Hypertension" />
                <EditRow label="Current Medications (comma-separated)" value={form.currentMedications} onChange={f("currentMedications")} placeholder="e.g. Metformin, Aspirin" />
              </>
            }
          />

          <Section
            title="🛡️ Insurance"
            editMode={editMode}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            viewContent={
              <>
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
              </>
            }
            editContent={
              <>
                <EditRow label="Insurance Provider"      value={form.insuranceProvider}     onChange={f("insuranceProvider")}     placeholder="Provider name" />
                <EditRow label="Insurance Policy Number" value={form.insurancePolicyNumber}  onChange={f("insurancePolicyNumber")}  placeholder="Policy number" />
              </>
            }
          />

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── Section (collapsible in edit mode) ──────────────────────────────────────
function Section({
  title, editMode, viewContent, editContent, activeSection, setActiveSection,
}: {
  title: string;
  editMode: boolean;
  viewContent: React.ReactNode;
  editContent: React.ReactNode;
  activeSection: string | null;
  setActiveSection: (v: string | null) => void;
}) {
  const isOpen = activeSection === title;

  return (
    <View style={s.card}>
      <TouchableOpacity
        style={s.cardHeader}
        onPress={() => editMode && setActiveSection(isOpen ? null : title)}
        activeOpacity={editMode ? 0.7 : 1}
      >
        <Text style={s.cardTitle}>{title}</Text>
        {editMode && (
          <View style={[s.sectionEditBadge, isOpen && s.sectionEditBadgeOpen]}>
            <Text style={[s.sectionEditBadgeText, isOpen && s.sectionEditBadgeTextOpen]}>
              {isOpen ? "▲ Close" : "✏️ Edit"}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={s.divider} />

      {/* Always show view content */}
      {viewContent}

      {/* Show edit fields only when this section is open */}
      {editMode && isOpen && (
        <View style={s.editFieldsBox}>
          <Text style={s.editFieldsBoxLabel}>Edit fields below:</Text>
          {editContent}
        </View>
      )}
    </View>
  );
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={[s.infoValue, !value && s.infoValueEmpty]}>{value || "—"}</Text>
    </View>
  );
}

// ─── EditRow ──────────────────────────────────────────────────────────────────
function EditRow({
  label, value, onChange, placeholder, keyboardType, autoCapitalize, multiline,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; keyboardType?: any; autoCapitalize?: any; multiline?: boolean;
}) {
  return (
    <View style={s.editRow}>
      <Text style={s.editRowLabel}>{label}</Text>
      <TextInput
        style={[s.editRowInput, multiline && s.editRowInputMulti]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        keyboardType={keyboardType ?? "default"}
        autoCapitalize={autoCapitalize ?? "words"}
        multiline={multiline ?? false}
      />
    </View>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toArray = (s: string) =>
  s ? s.split(",").map((x) => x.trim()).filter(Boolean) : [];

const toDisplay = (arr: any) =>
  Array.isArray(arr) && arr.length > 0 ? arr.join(", ") : undefined;

// ─── Styles ───────────────────────────────────────────────────────────────────
const BLUE       = "#2563eb";
const BLUE_LIGHT = "#eff6ff";

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f1f5f9" },

  // Header
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: BLUE, paddingHorizontal: 16, paddingVertical: 16,
  },
  backText:    { color: "#fff", fontSize: 16, fontWeight: "bold" },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  body: { padding: 16, paddingBottom: 50 },

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
  avatarRing: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 3, borderColor: BLUE,
    alignItems: "center", justifyContent: "center", marginBottom: 14,
  },
  avatarCircle: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: BLUE, alignItems: "center", justifyContent: "center",
  },
  avatarText:  { fontSize: 36, color: "#fff", fontWeight: "bold" },
  heroName:    { fontSize: 22, fontWeight: "bold", color: "#111827", marginBottom: 4 },
  heroId:      { fontSize: 12, color: "#9ca3af", marginBottom: 10 },
  heroBadgeRow:{ flexDirection: "row", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 18 },
  heroBadge:   { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  heroBadgeText:{ fontSize: 12, fontWeight: "700" },

  // Edit profile button (view mode)
  editProfileBtn: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: BLUE, paddingHorizontal: 28, paddingVertical: 11,
    borderRadius: 30, elevation: 3,
    shadowColor: BLUE, shadowOpacity: 0.35,
    shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
  },
  editProfileBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  // Edit/Cancel/Save row (edit mode)
  editActionRow: { flexDirection: "row", gap: 10, width: "100%" },
  editActionBtn: {
    flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: "center",
  },
  cancelBtn:     { backgroundColor: "#f3f4f6", borderWidth: 1.5, borderColor: "#d1d5db" },
  cancelBtnText: { color: "#374151", fontWeight: "700", fontSize: 14 },
  saveBtn:       {
    backgroundColor: "#10b981",
    elevation: 2, shadowColor: "#10b981",
    shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText:   { color: "#fff", fontWeight: "700", fontSize: 14 },

  // Edit banner
  editBanner: {
    flexDirection: "row", alignItems: "flex-start",
    backgroundColor: "#fef3c7", borderRadius: 12, padding: 12,
    marginBottom: 14, borderWidth: 1, borderColor: "#fcd34d", gap: 8,
  },
  editBannerIcon: { fontSize: 16 },
  editBannerText: { flex: 1, color: "#92400e", fontSize: 12, fontWeight: "500", lineHeight: 18 },

  // Section card
  card: {
    backgroundColor: "#fff", borderRadius: 14, padding: 16,
    marginBottom: 14, elevation: 2, shadowColor: "#000",
    shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 1 },
  },
  cardHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: { fontSize: 14, fontWeight: "700", color: BLUE },
  divider:   { height: 1, backgroundColor: "#f3f4f6", marginBottom: 10 },

  // Section edit badge
  sectionEditBadge: {
    backgroundColor: BLUE_LIGHT, paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 20,
    borderWidth: 1, borderColor: "#bfdbfe",
  },
  sectionEditBadgeOpen: { backgroundColor: BLUE, borderColor: BLUE },
  sectionEditBadgeText: { fontSize: 11, fontWeight: "700", color: BLUE },
  sectionEditBadgeTextOpen: { color: "#fff" },

  // View info row
  infoRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "flex-start", paddingVertical: 6,
    borderBottomWidth: 1, borderBottomColor: "#f9fafb",
  },
  infoLabel:      { fontSize: 13, color: "#6b7280", fontWeight: "600", flex: 1 },
  infoValue:      { fontSize: 13, color: "#111827", flex: 1.5, textAlign: "right" },
  infoValueEmpty: { color: "#d1d5db" },

  // Edit fields box
  editFieldsBox: {
    backgroundColor: "#f8faff", borderRadius: 10, padding: 14,
    marginTop: 12, borderWidth: 1.5, borderColor: "#bfdbfe",
  },
  editFieldsBoxLabel: {
    fontSize: 11, fontWeight: "700", color: BLUE,
    marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5,
  },

  // Edit row
  editRow:            { marginBottom: 12 },
  editRowLabel:       { fontSize: 12, fontWeight: "600", color: "#374151", marginBottom: 4 },
  editRowInput: {
    borderWidth: 1.5, borderColor: "#d1d5db", borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, color: "#111827", backgroundColor: "#fff",
  },
  editRowInputMulti:  { minHeight: 72, textAlignVertical: "top" },
});
