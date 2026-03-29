import api from "./axios";

export const getMyPatientPrescriptions = async () => {
  const response = await api.get("/prescriptions/mine/patient");
  return response.data;
};

export const getMyDoctorPrescriptions = async () => {
  const response = await api.get("/prescriptions/mine/doctor");
  return response.data;
};

export const getPrescriptionsByPatientId = async (patientId) => {
  const response = await api.get(`/prescriptions/patient/${patientId}`);
  return response.data;
};

export const getPrescriptionById = async (id) => {
  const response = await api.get(`/prescriptions/${id}`);
  return response.data;
};

export const createPrescription = async (payload) => {
  const response = await api.post("/prescriptions", payload);
  return response.data;
};