import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import { getDoctorDashboardData } from "../../api/dashboardApi";
import { useAuth } from "../../context/AuthContext";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState({
    appointments: [],
    prescriptions: [],
    uniquePatients: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await getDoctorDashboardData();
        setDashboard(data);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const pendingAppointments = useMemo(
    () =>
      dashboard.appointments.filter((item) => item.status === "PENDING").length,
    [dashboard.appointments]
  );

  const latestAppointments = useMemo(
    () => [...dashboard.appointments].slice(0, 4),
    [dashboard.appointments]
  );

  const latestPrescriptions = useMemo(
    () => [...dashboard.prescriptions].slice(0, 4),
    [dashboard.prescriptions]
  );

  if (loading) {
    return (
      <AppShell title="Doctor Dashboard" subtitle="Loading your data...">
        <div className="panel">Loading dashboard...</div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Doctor Dashboard"
      subtitle="Overview of your appointments, patients, and prescriptions."
    >
      <PageHeader
        title={`Welcome, ${user?.name}`}
        subtitle="Here is a real-time overview of your current doctor activity."
      />

      <div className="stats-grid">
        <StatCard
          label="Total Appointments"
          value={dashboard.appointments.length}
          hint="All assigned appointments"
        />
        <StatCard
          label="Pending Appointments"
          value={pendingAppointments}
          hint="Need your attention"
        />
        <StatCard
          label="Linked Patients"
          value={dashboard.uniquePatients}
          hint="From your appointment list"
        />
        <StatCard
          label="Issued Prescriptions"
          value={dashboard.prescriptions.length}
          hint="Created by you"
        />
      </div>

      <div className="panel-grid">
        <div className="panel">
          <h3>Upcoming / Recent Appointments</h3>

          {latestAppointments.length === 0 ? (
            <p className="muted-text">No appointments assigned yet.</p>
          ) : (
            <div className="dashboard-list">
              {latestAppointments.map((item) => (
                <div key={item.id} className="dashboard-list-item">
                  <div>
                    <strong>{item?.patient?.user?.name || "Unknown Patient"}</strong>
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
            <p className="muted-text">No prescriptions created yet.</p>
          ) : (
            <div className="dashboard-list">
              {latestPrescriptions.map((item) => (
                <div key={item.id} className="dashboard-list-item">
                  <div>
                    <strong>{item?.patient?.user?.name || "Unknown Patient"}</strong>
                    <p>{item.diagnosis || "No diagnosis"}</p>
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
          <Link className="quick-link-card" to="/doctor/appointments">Manage Appointments</Link>
          <Link className="quick-link-card" to="/doctor/patient-records">Patient Records</Link>
          <Link className="quick-link-card" to="/doctor/prescriptions">Create Prescriptions</Link>
          <Link className="quick-link-card" to="/doctor/lab-results">Lab Results</Link>
        </div>
      </div>
    </AppShell>
  );
};

export default DoctorDashboard;