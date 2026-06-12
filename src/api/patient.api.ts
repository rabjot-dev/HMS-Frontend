import client from "./client";

export const getPatientByUserIdApi = (userId: string) =>
  client.get(`/patients/${userId}`);

export const getProfileApi = () =>
  client.get("/patients/profile");

export const updateProfileApi = (data: any) =>
  client.put("/patients/profile", data);

export const getMyPatientAppointmentsApi = (patientId: string) =>
  client.get(`/appointments/patient/${patientId}`);

export const updatePatientAppointmentApi = (id: string, data: any) =>
  client.put(`/appointments/${id}`, data);
