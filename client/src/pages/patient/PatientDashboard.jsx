import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import { getPatientDashboardData } from "../../api/dashboardApi";
import { useAuth } from "../../context/AuthContext";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState({
    profile: null,
    appointments: [],
    prescriptions: [],
    medicalHistory: null,
    labResults: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await getPatientDashboardData();
        setDashboard(data);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const openAppointments = useMemo(
    () =>
      dashboard.appointments.filter((item) =>
        ["PENDING", "CONFIRMED"].includes(item.status)
      ),
    [dashboard.appointments]
  );

  const latestAppointments = useMemo(
    () => [...dashboard.appointments].slice(0, 3),
    [dashboard.appointments]
  );

  const latestPrescriptions = useMemo(
    () => [...dashboard.prescriptions].slice(0, 3),
    [dashboard.prescriptions]
  );

  if (loading) {
    return (
      <AppShell title="Patient Dashboard" subtitle="Loading your data...">
        <div className="panel">Loading dashboard...</div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Patient Dashboard"
      subtitle="Overview of your health records and activity."
    >
      <PageHeader
        title={`Welcome, ${user?.name}`}
        subtitle="Here is a quick overview of your account and healthcare information."
      />

      <div className="stats-grid">
        <StatCard
          label="Open Appointments"
          value={openAppointments.length}
          hint="Pending or confirmed"
        />
        <StatCard
          label="Prescriptions"
          value={dashboard.prescriptions.length}
          hint="Issued by doctors"
        />
        <StatCard
          label="Lab Reports"
          value={dashboard.labResults.length}
          hint="Uploaded test results"
        />
        <StatCard
          label="Medical History"
          value={dashboard.medicalHistory ? "Saved" : "Empty"}
          hint="Your health background"
        />
      </div>

      <div className="panel-grid">
        <div className="panel">
          <h3>Recent Appointments</h3>

          {latestAppointments.length === 0 ? (
            <p className="muted-text">No appointments booked yet.</p>
          ) : (
            <div className="dashboard-list">
              {latestAppointments.map((item) => (
                <div key={item.id} className="dashboard-list-item">
                  <div>
                    <strong>Dr. {item?.doctor?.user?.name || "Unknown"}</strong>
                    <p>
                      {item.appointmentDate
                        ? new Date(item.appointmentDate).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  <span className={`status-pill status-${item.status?.toLowerCase()}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <h3>Recent Prescriptions</h3>

          {latestPrescriptions.length === 0 ? (
            <p className="muted-text">No prescriptions found yet.</p>
          ) : (
            <div className="dashboard-list">
              {latestPrescriptions.map((item) => (
                <div key={item.id} className="dashboard-list-item">
                  <div>
                    <strong>{item.diagnosis || "No diagnosis"}</strong>
                    <p>Dr. {item?.doctor?.user?.name || "Unknown Doctor"}</p>
                  </div>
                  <span className="status-pill status-confirmed">#{item.id}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <h3>Quick Actions</h3>
        <div className="quick-link-grid">
          <Link className="quick-link-card" to="/patient/profile">Manage Profile</Link>
          <Link className="quick-link-card" to="/patient/appointments">Appointments</Link>
          <Link className="quick-link-card" to="/patient/medical-history">Medical History</Link>
          <Link className="quick-link-card" to="/patient/prescriptions">Prescriptions</Link>
          <Link className="quick-link-card" to="/patient/lab-results">Lab Results</Link>
        </div>
      </div>
    </AppShell>
  );
};

export default PatientDashboard;