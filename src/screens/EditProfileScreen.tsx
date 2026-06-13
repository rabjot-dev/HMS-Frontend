import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import client from "../api/client";
import { getPatientId } from "../utils/storage";

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
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

const EMPTY: ProfileForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  bloodGroup: "",
  maritalStatus: "",

  address: "",
  city: "",
  state: "",
  pincode: "",
  country: "",

  emergencyContactName: "",
  emergencyContactPhone: "",
  relationship: "",

  allergies: "",
  chronicDiseases: "",
  currentMedications: "",

  insuranceProvider: "",
  insurancePolicyNumber: "",
};

export default function EditProfileScreen({ navigation }: any) {
  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const f = (key: keyof ProfileForm) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const loadProfile = async () => {
    try {
      setLoading(true);
      const patientId = await getPatientId();

      const res = await client.get(`/patients/${patientId}`);

      if (res.data.success) {
        const data = res.data.data;

        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          dateOfBirth: data.dateOfBirth || "",
          bloodGroup: data.bloodGroup || "",
          maritalStatus: data.maritalStatus || "",

          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          country: data.country || "",

          emergencyContactName: data.emergencyContactName || "",
          emergencyContactPhone: data.emergencyContactPhone || "",
          relationship: data.relationship || "",

          allergies: Array.isArray(data.allergies)
            ? data.allergies.join(", ")
            : "",
          chronicDiseases: Array.isArray(data.chronicDiseases)
            ? data.chronicDiseases.join(", ")
            : "",
          currentMedications: Array.isArray(data.currentMedications)
            ? data.currentMedications.join(", ")
            : "",

          insuranceProvider: data.insuranceProvider || "",
          insurancePolicyNumber: data.insurancePolicyNumber || "",
        });
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const patientId = await getPatientId();

      const payload = {
        ...form,
        allergies: form.allergies.split(",").map((x) => x.trim()),
        chronicDiseases: form.chronicDiseases.split(",").map((x) => x.trim()),
        currentMedications: form.currentMedications.split(",").map((x) => x.trim()),
      };

      const res = await client.put(`/patients/${patientId}`, payload);

      if (res.data.success) {
        Alert.alert("Success", "Profile updated successfully");
        navigation.goBack();
      } else {
        Alert.alert("Error", res.data.message || "Update failed");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.body}>

        <Text style={styles.title}>Edit Profile</Text>

        {/* PERSONAL */}
        <Section title="Personal Info">
          <Input label="First Name" value={form.firstName} onChange={f("firstName")} />
          <Input label="Last Name" value={form.lastName} onChange={f("lastName")} />
          <Input label="Email" value={form.email} onChange={f("email")} />
          <Input label="Phone" value={form.phone} onChange={f("phone")} />
          <Input label="Gender" value={form.gender} onChange={f("gender")} />
          <Input label="DOB (YYYY-MM-DD)" value={form.dateOfBirth} onChange={f("dateOfBirth")} />
        </Section>

        {/* ADDRESS */}
        <Section title="Address">
          <Input label="Address" value={form.address} onChange={f("address")} />
          <Input label="City" value={form.city} onChange={f("city")} />
          <Input label="State" value={form.state} onChange={f("state")} />
          <Input label="Pincode" value={form.pincode} onChange={f("pincode")} />
          <Input label="Country" value={form.country} onChange={f("country")} />
        </Section>

        {/* EMERGENCY */}
        <Section title="Emergency Contact">
          <Input label="Name" value={form.emergencyContactName} onChange={f("emergencyContactName")} />
          <Input label="Phone" value={form.emergencyContactPhone} onChange={f("emergencyContactPhone")} />
          <Input label="Relationship" value={form.relationship} onChange={f("relationship")} />
        </Section>

        {/* MEDICAL */}
        <Section title="Medical Info">
          <Input label="Allergies" value={form.allergies} onChange={f("allergies")} />
          <Input label="Chronic Diseases" value={form.chronicDiseases} onChange={f("chronicDiseases")} />
          <Input label="Medications" value={form.currentMedications} onChange={f("currentMedications")} />
        </Section>

        {/* INSURANCE */}
        <Section title="Insurance">
          <Input label="Provider" value={form.insuranceProvider} onChange={f("insuranceProvider")} />
          <Input label="Policy Number" value={form.insurancePolicyNumber} onChange={f("insurancePolicyNumber")} />
        </Section>

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Save Profile</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={label}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  body: { padding: 16 },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },

  section: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#2563eb",
  },

  label: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },

  saveBtn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});