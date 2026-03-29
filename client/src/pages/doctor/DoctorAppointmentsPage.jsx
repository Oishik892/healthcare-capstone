import { useEffect, useState } from "react";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import {
  getMyDoctorAppointments,
  updateAppointmentStatus,
} from "../../api/appointmentApi";

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getMyDoctorAppointments();
      setAppointments(data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      setMessage("");
      setError("");
      await updateAppointmentStatus(id, { status });
      setMessage(`Appointment marked as ${status}`);
      fetchAppointments();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update appointment");
    }
  };

  return (
    <AppShell
      title="Doctor Appointments"
      subtitle="Manage patient appointments and update their status."
    >
      <PageHeader
        title="Appointment Queue"
        subtitle="Review your appointments and update progress."
      />

      <div className="panel">
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}

        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="muted-text">No doctor appointments found.</p>
        ) : (
          <div className="appointment-list">
            {appointments.map((item) => (
              <div key={item.id} className="appointment-card">
                <div className="appointment-top">
                  <div>
                    <h4>{item?.patient?.user?.name || "Unknown Patient"}</h4>
                    <p>{item?.patient?.user?.email || "No email"}</p>
                  </div>
                  <span className={`status-pill status-${item.status?.toLowerCase()}`}>
                    {item.status}
                  </span>
                </div>

                <div className="appointment-meta">
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(item.appointmentDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>Reason:</strong> {item.reason || "N/A"}
                  </p>
                </div>

                <div className="action-row">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleStatusUpdate(item.id, "CONFIRMED")}
                  >
                    Confirm
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => handleStatusUpdate(item.id, "COMPLETED")}
                  >
                    Complete
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => handleStatusUpdate(item.id, "CANCELLED")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default DoctorAppointmentsPage;