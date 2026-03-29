import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppShell = ({ title, subtitle, children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const roleNavMap = {
    PATIENT: [
      { label: "Dashboard", path: "/patient/dashboard" },
      { label: "My Profile", path: "/patient/profile" },
      { label: "Appointments", path: "/patient/appointments" },
      { label: "Medical History", path: "/patient/medical-history" },
      { label: "Prescriptions", path: "/patient/prescriptions" },
      { label: "Lab Results", path: "/patient/lab-results" },
    ],
    DOCTOR: [
      { label: "Dashboard", path: "/doctor/dashboard" },
      { label: "Appointments", path: "/doctor/appointments" },
      { label: "Patient Records", path: "/doctor/patient-records" },
      { label: "Prescriptions", path: "/doctor/prescriptions" },
      { label: "Lab Results", path: "/doctor/lab-results" },
    ],
    ADMIN: [
      { label: "Dashboard", path: "/admin/dashboard" },
      { label: "Users", path: "/admin/users" },
    ],
  };

  const navItems = roleNavMap[user?.role] || [];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-badge">H</div>
          <div>
            <h2>HealthCare</h2>
            <p>Capstone Project</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{title}</h1>
            {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
          </div>

          <div className="topbar-actions">
            <div className="user-chip">
              <span className="role-badge">{user?.role}</span>
              <div>
                <strong>{user?.name}</strong>
                <p>{user?.email}</p>
              </div>
            </div>
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <section className="page-body">{children}</section>
      </main>
    </div>
  );
};

export default AppShell;