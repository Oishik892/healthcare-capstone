import api from "./axios";

export const createAppointment = async (payload) => {
  const response = await api.post("/appointments", payload);
  return response.data;
};

export const getMyPatientAppointments = async () => {
  const response = await api.get("/appointments/mine/patient");
  return response.data;
};

export const getMyDoctorAppointments = async () => {
  const response = await api.get("/appointments/mine/doctor");
  return response.data;
};

export const updateAppointmentStatus = async (id, payload) => {
  const response = await api.patch(`/appointments/${id}/status`, payload);
  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
};