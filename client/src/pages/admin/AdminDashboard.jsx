import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import { getAdminDashboardData } from "../../api/dashboardApi";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState({
    users: [],
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalAdmins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await getAdminDashboardData();
        setDashboard(data);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const recentUsers = useMemo(() => {
    return [...dashboard.users]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [dashboard.users]);

  if (loading) {
    return (
      <AppShell title="Admin Dashboard" subtitle="Loading system data...">
        <div className="panel">Loading dashboard...</div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Admin Dashboard"
      subtitle="Overview of users and system activity."
    >
      <PageHeader
        title={`Welcome, ${user?.name}`}
        subtitle="Here is a real-time overview of the platform accounts."
      />

      <div className="stats-grid">
        <StatCard
          label="Total Users"
          value={dashboard.totalUsers}
          hint="All registered accounts"
        />
        <StatCard
          label="Patients"
          value={dashboard.totalPatients}
          hint="Patient accounts"
        />
        <StatCard
          label="Doctors"
          value={dashboard.totalDoctors}
          hint="Doctor accounts"
        />
        <StatCard
          label="Admins"
          value={dashboard.totalAdmins}
          hint="Admin accounts"
        />
      </div>

      <div className="panel-grid">
        <div className="panel">
          <h3>Recently Joined Users</h3>

          {recentUsers.length === 0 ? (
            <p className="muted-text">No users found.</p>
          ) : (
            <div className="dashboard-list">
              {recentUsers.map((item) => (
                <div key={item.id} className="dashboard-list-item">
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.email}</p>
                  </div>
                  <span className={`status-pill status-${item.role?.toLowerCase()}`}>
                    {item.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <h3>Quick Actions</h3>
          <div className="quick-link-grid admin-quick-grid">
            <Link className="quick-link-card" to="/admin/users">
              View All Users
            </Link>
            <Link className="quick-link-card" to="/admin/users">
              Filter Patients
            </Link>
            <Link className="quick-link-card" to="/admin/users">
              Filter Doctors
            </Link>
            <Link className="quick-link-card" to="/admin/users">
              Refresh User Data
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default AdminDashboard;