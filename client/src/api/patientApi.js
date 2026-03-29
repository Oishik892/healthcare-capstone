import api from "./axios";

export const getMyPatientProfile = async () => {
  const response = await api.get("/patients/me");
  return response.data;
};

export const updateMyPatientProfile = async (payload) => {
  const response = await api.put("/patients/me", payload);
  return response.data;
};