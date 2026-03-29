import { useEffect, useMemo, useState } from "react";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import { getAllUsers } from "../../api/adminApi";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllUsers();
      setUsers(data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "ALL" ? true : user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      patients: users.filter((u) => u.role === "PATIENT").length,
      doctors: users.filter((u) => u.role === "DOCTOR").length,
      admins: users.filter((u) => u.role === "ADMIN").length,
    };
  }, [users]);

  return (
    <AppShell
      title="User Management"
      subtitle="View registered users by role and account details."
    >
      <PageHeader
        title="System Users"
        subtitle="Search, filter, and review all registered accounts."
      />

      <div className="stats-grid">
        <StatCard label="Total Users" value={stats.total} hint="All registered accounts" />
        <StatCard label="Patients" value={stats.patients} hint="Patient accounts" />
        <StatCard label="Doctors" value={stats.doctors} hint="Doctor accounts" />
        <StatCard label="Admins" value={stats.admins} hint="Admin accounts" />
      </div>

      <div className="panel">
        <div className="toolbar">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="PATIENT">Patients</option>
            <option value="DOCTOR">Doctors</option>
            <option value="ADMIN">Admins</option>
          </select>

          <button className="btn btn-secondary" onClick={fetchUsers}>
            Refresh
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {loading ? (
          <p>Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="muted-text">No users found.</p>
        ) : (
          <div className="user-table-wrap">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`status-pill status-${user.role?.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default AdminUsersPage;