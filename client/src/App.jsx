import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfilePage from "./pages/patient/PatientProfilePage";
import PatientAppointmentsPage from "./pages/patient/PatientAppointmentsPage";
import PatientMedicalHistoryPage from "./pages/patient/PatientMedicalHistoryPage";
import PatientPrescriptionsPage from "./pages/patient/PatientPrescriptionsPage";
import PatientLabResultsPage from "./pages/patient/PatientLabResultsPage";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointmentsPage from "./pages/doctor/DoctorAppointmentsPage";
import DoctorPatientRecordsPage from "./pages/doctor/DoctorPatientRecordsPage";
import DoctorPrescriptionsPage from "./pages/doctor/DoctorPrescriptionsPage";
import DoctorLabResultsPage from "./pages/doctor/DoctorLabResultsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomeRedirect from "./pages/HomeRedirect";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute roles={["PATIENT"]}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute roles={["PATIENT"]}>
            <PatientProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute roles={["PATIENT"]}>
            <PatientAppointmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/medical-history"
        element={
          <ProtectedRoute roles={["PATIENT"]}>
            <PatientMedicalHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/prescriptions"
        element={
          <ProtectedRoute roles={["PATIENT"]}>
            <PatientPrescriptionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/lab-results"
        element={
          <ProtectedRoute roles={["PATIENT"]}>
            <PatientLabResultsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute roles={["DOCTOR"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <ProtectedRoute roles={["DOCTOR"]}>
            <DoctorAppointmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patient-records"
        element={
          <ProtectedRoute roles={["DOCTOR"]}>
            <DoctorPatientRecordsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/prescriptions"
        element={
          <ProtectedRoute roles={["DOCTOR"]}>
            <DoctorPrescriptionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/lab-results"
        element={
          <ProtectedRoute roles={["DOCTOR"]}>
            <DoctorLabResultsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;