import React, { useState } from "react";
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
import { getProfileApi, updateProfileApi } from "../api/patient.api";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

export default function ProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    dob: "",
    address: "",
    bloodGroup: "",
    height: "",
    weight: "",
    allergies: "",
    medicalHistory: "",
    hasInsurance: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    chiefComplaint: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfileApi();
      const p = res.data.patient;
      setProfile(p);
      setLoaded(true);
    } catch (err) {
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadProfile();
  }, []);

  const openEdit = () => {
    if (!profile) return;
    setEditForm({
      name: profile.name ?? "",
      phone: profile.phone ?? "",
      email: profile.email ?? "",
      gender: profile.gender ?? "",
      dob: profile.dob ? profile.dob.split("T")[0] : "",
      address: profile.address ?? "",
      bloodGroup: profile.bloodGroup ?? "",
      height: profile.height?.toString() ?? "",
      weight: profile.weight?.toString() ?? "",
      allergies: Array.isArray(profile.allergies)
        ? profile.allergies.join(", ")
        : (profile.allergies ?? ""),
      medicalHistory: Array.isArray(profile.medicalHistory)
        ? profile.medicalHistory.join(", ")
        : (profile.medicalHistory ?? ""),
      hasInsurance: profile.hasInsurance ? "true" : "false",
      insuranceProvider: profile.insuranceProvider ?? "",
      insurancePolicyNumber: profile.insurancePolicyNumber ?? "",
      chiefComplaint: profile.chiefComplaint ?? "",
      emergencyContactName: profile.emergencyContact?.name ?? "",
      emergencyContactRelation: profile.emergencyContact?.relation ?? "",
      emergencyContactPhone: profile.emergencyContact?.phone ?? "",
    });
    setEditMode(true);
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const payload = {
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        gender: editForm.gender.toUpperCase(),
        dob: editForm.dob,
        address: editForm.address,
        bloodGroup: editForm.bloodGroup,
        height: editForm.height ? Number(editForm.height) : undefined,
        weight: editForm.weight ? Number(editForm.weight) : undefined,
        allergies: editForm.allergies
          ? editForm.allergies.split(",").map((s) => s.trim())
          : [],
        medicalHistory: editForm.medicalHistory
          ? editForm.medicalHistory.split(",").map((s) => s.trim())
          : [],
        hasInsurance: editForm.hasInsurance === "true",
        insuranceProvider: editForm.insuranceProvider,
        insurancePolicyNumber: editForm.insurancePolicyNumber,
        chiefComplaint: editForm.chiefComplaint,
        emergencyContact: {
          name: editForm.emergencyContactName,
          relation: editForm.emergencyContactRelation,
          phone: editForm.emergencyContactPhone,
        },
      };

      const res = await updateProfileApi(payload);
      if (res.data.success) {
        setProfile(res.data.patient);
        setEditMode(false);
        Alert.alert("Success", "Profile updated successfully");
      } else {
        Alert.alert("Error", res.data.message || "Update failed");
      }
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const formatDOB = (dob: string) => {
    const date = new Date(dob);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}-${month}-${date.getFullYear()}`;
  };

  const field = (
    label: string,
    key: keyof typeof editForm,
    options?: {
      secureTextEntry?: boolean;
      keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
      placeholder?: string;
    }
  ) => (
    <InputField
      key={key}
      label={label}
      value={editForm[key]}
      onChangeText={(val) => setEditForm((prev) => ({ ...prev, [key]: val }))}
      {...options}
    />
  );

  if (loading && !loaded) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  if (editMode) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setEditMode(false)}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={styles.editContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👤 Personal Info</Text>
            {field("Full Name", "name")}
            {field("Phone", "phone", { keyboardType: "phone-pad" })}
            {field("Email", "email", { keyboardType: "email-address" })}
            {field("Gender", "gender", { placeholder: "MALE / FEMALE / OTHER" })}
            {field("Date of Birth", "dob", { placeholder: "YYYY-MM-DD" })}
            {field("Address", "address")}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🩺 Medical Info</Text>
            {field("Blood Group", "bloodGroup", { placeholder: "A+, B-, O+…" })}
            {field("Height (cm)", "height", { keyboardType: "numeric" })}
            {field("Weight (kg)", "weight", { keyboardType: "numeric" })}
            {field("Allergies", "allergies", { placeholder: "Comma separated" })}
            {field("Medical History", "medicalHistory", { placeholder: "Comma separated" })}
            {field("Chief Complaint", "chiefComplaint")}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏥 Insurance</Text>
            {field("Has Insurance", "hasInsurance", { placeholder: "true or false" })}
            {field("Insurance Provider", "insuranceProvider")}
            {field("Policy Number", "insurancePolicyNumber")}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚨 Emergency Contact</Text>
            {field("Contact Name", "emergencyContactName")}
            {field("Relation", "emergencyContactRelation")}
            {field("Contact Phone", "emergencyContactPhone", { keyboardType: "phone-pad" })}
          </View>

          <PrimaryButton
            title="💾 Save Changes"
            onPress={saveProfile}
            loading={saving}
            color="#10b981"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Avatar card */}
        <View style={styles.avatarCard}>
          <Text style={styles.avatarEmoji}>👤</Text>
          <Text style={styles.profileName}>{profile?.name}</Text>
          <Text style={styles.profileUHID}>{profile?.UHID}</Text>
        </View>

        {profile ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>👤 Personal Details</Text>
              <InfoRow label="Email" value={profile.email} />
              <InfoRow label="Phone" value={profile.phone} />
              <InfoRow label="Gender" value={profile.gender} />
              <InfoRow label="DOB" value={formatDOB(profile.dob)} />
              <InfoRow label="Address" value={profile.address} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🩺 Medical Details</Text>
              <InfoRow label="Blood Group" value={profile.bloodGroup} />
              <InfoRow label="Height" value={`${profile.height} cm`} />
              <InfoRow label="Weight" value={`${profile.weight} kg`} />
              <InfoRow label="Allergies" value={profile.allergies?.join(", ") ?? profile.allergies} />
              <InfoRow label="History" value={profile.medicalHistory?.join(", ") ?? profile.medicalHistory} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏥 Insurance</Text>
              <InfoRow label="Provider" value={profile.insuranceProvider} />
              <InfoRow label="Policy" value={profile.insurancePolicyNumber} />
              <InfoRow label="Status" value={profile.hasInsurance ? "Active" : "Not Available"} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🚨 Emergency Contact</Text>
              <InfoRow label="Name" value={profile.emergencyContact?.name} />
              <InfoRow label="Relation" value={profile.emergencyContact?.relation} />
              <InfoRow label="Phone" value={profile.emergencyContact?.phone} />
            </View>

            <View style={{ marginHorizontal: 15, marginTop: 8 }}>
              <PrimaryButton title="✏️ Edit Profile" onPress={openEdit} />
            </View>
          </>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 40, color: "#6b7280" }}>
            No profile data found.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value ?? "—"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  avatarCard: {
    backgroundColor: "#2563eb",
    alignItems: "center",
    paddingVertical: 28,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 8,
  },
  avatarEmoji: {
    fontSize: 52,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  profileUHID: {
    fontSize: 13,
    color: "#dbeafe",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "600",
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    color: "#111827",
    flex: 2,
    textAlign: "right",
  },
  editContainer: {
    padding: 15,
    paddingBottom: 40,
    gap: 4,
  },
});
