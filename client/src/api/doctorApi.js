import api from "./axios";

export const getAllDoctors = async () => {
  const response = await api.get("/doctors");
  return response.data;
};