import { useEffect, useState } from "react";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import {
  createAppointment,
  getMyPatientAppointments,
  cancelAppointment,
} from "../../api/appointmentApi";
import { getAllDoctors } from "../../api/doctorApi";

const PatientAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    reason: "",
  });

  const fetchAppointments = async () => {
    try {
      const data = await getMyPatientAppointments();
      setAppointments(data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load appointments");
    }
  };

  const fetchDoctors = async () => {
    try {
      setDoctorLoading(true);
      const data = await getAllDoctors();
      setDoctors(data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load doctors");
    } finally {
      setDoctorLoading(false);
    }
  };

  const initialLoad = async () => {
    try {
      setLoading(true);
      setError("");
      await Promise.all([fetchAppointments(), fetchDoctors()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialLoad();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      await createAppointment({
        doctorId: Number(formData.doctorId),
        appointmentDate: new Date(formData.appointmentDate).toISOString(),
        reason: formData.reason,
      });

      setMessage("Appointment booked successfully");
      setFormData({
        doctorId: "",
        appointmentDate: "",
        reason: "",
      });
      await fetchAppointments();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      setMessage("");
      setError("");
      await cancelAppointment(id);
      setMessage("Appointment cancelled successfully");
      await fetchAppointments();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to cancel appointment");
    }
  };

  return (
    <AppShell
      title="My Appointments"
      subtitle="Book and manage your appointments."
    >
      <PageHeader
        title="Appointments"
        subtitle="Choose a doctor from the list and review your booked appointments."
      />

      <div className="panel-grid">
        <div className="panel">
          <h3>Book Appointment</h3>

          <form onSubmit={handleCreate} className="auth-form">
            <div className="form-group">
              <label>Select Doctor</label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
                disabled={doctorLoading}
              >
                <option value="">
                  {doctorLoading ? "Loading doctors..." : "Choose a doctor"}
                </option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor?.user?.name} — {doctor.specialization || "General"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Appointment Date & Time</label>
              <input
                type="datetime-local"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Reason</label>
              <textarea
                name="reason"
                rows="4"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Why do you need this appointment?"
              />
            </div>

            {message && <p className="success-text">{message}</p>}
            {error && <p className="error-text">{error}</p>}

            <button className="btn btn-primary" type="submit" disabled={submitting || doctorLoading}>
              {submitting ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>

        <div className="panel">
          <h3>My Appointment List</h3>

          {loading ? (
            <p>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p className="muted-text">No appointments found yet.</p>
          ) : (
            <div className="appointment-list">
              {appointments.map((item) => (
                <div key={item.id} className="appointment-card">
                  <div className="appointment-top">
                    <div>
                      <h4>Dr. {item?.doctor?.user?.name || "Unknown"}</h4>
                      <p>{item?.doctor?.specialization || "General"}</p>
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
                      onClick={() => handleCancel(item.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default PatientAppointmentsPage;