import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomeRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "PATIENT") return <Navigate to="/patient/dashboard" replace />;
  if (user.role === "DOCTOR") return <Navigate to="/doctor/dashboard" replace />;
  if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

export default HomeRedirect;