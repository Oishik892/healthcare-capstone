import { getMyPatientProfile } from "./patientApi";
import { getMyPatientAppointments, getMyDoctorAppointments } from "./appointmentApi";
import { getMyPatientPrescriptions, getMyDoctorPrescriptions } from "./prescriptionApi";
import { getMyMedicalHistory } from "./medicalHistoryApi";
import { getMyLabResults } from "./labResultApi";
import { getAllUsers } from "./adminApi";

const unwrapSettled = (result, fallback) => {
  if (result.status === "fulfilled") {
    return result.value?.data ?? fallback;
  }
  return fallback;
};

export const getPatientDashboardData = async () => {
  const results = await Promise.allSettled([
    getMyPatientProfile(),
    getMyPatientAppointments(),
    getMyPatientPrescriptions(),
    getMyMedicalHistory(),
    getMyLabResults(),
  ]);

  return {
    profile: unwrapSettled(results[0], null),
    appointments: unwrapSettled(results[1], []),
    prescriptions: unwrapSettled(results[2], []),
    medicalHistory: unwrapSettled(results[3], null),
    labResults: unwrapSettled(results[4], []),
  };
};

export const getDoctorDashboardData = async () => {
  const results = await Promise.allSettled([
    getMyDoctorAppointments(),
    getMyDoctorPrescriptions(),
  ]);

  const appointments = unwrapSettled(results[0], []);
  const prescriptions = unwrapSettled(results[1], []);

  const uniquePatients = new Set(
    appointments.map((item) => item?.patient?.id).filter(Boolean)
  ).size;

  return {
    appointments,
    prescriptions,
    uniquePatients,
  };
};

export const getAdminDashboardData = async () => {
  const results = await Promise.allSettled([getAllUsers()]);

  const users = unwrapSettled(results[0], []);

  return {
    users,
    totalUsers: users.length,
    totalPatients: users.filter((u) => u.role === "PATIENT").length,
    totalDoctors: users.filter((u) => u.role === "DOCTOR").length,
    totalAdmins: users.filter((u) => u.role === "ADMIN").length,
  };
};