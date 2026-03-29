import api from "./axios";

export const getMyLabResults = async () => {
  const response = await api.get("/lab-results/mine");
  return response.data;
};

export const getLabResultsByPatientId = async (patientId) => {
  const response = await api.get(`/lab-results/patient/${patientId}`);
  return response.data;
};

export const getLabResultById = async (id) => {
  const response = await api.get(`/lab-results/${id}`);
  return response.data;
};

export const uploadLabResult = async (formData) => {
  const response = await api.post("/lab-results/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};