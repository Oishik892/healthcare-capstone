import api from "./axios";

export const getMyMedicalHistory = async () => {
  const response = await api.get("/medical-history/me");
  return response.data;
};

export const updateMyMedicalHistory = async (payload) => {
  const response = await api.put("/medical-history/me", payload);
  return response.data;
};

export const getMedicalHistoryByPatientId = async (patientId) => {
  const response = await api.get(`/medical-history/patient/${patientId}`);
  return response.data;
};