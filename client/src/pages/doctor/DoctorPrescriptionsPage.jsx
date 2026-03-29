import { useEffect, useMemo, useState } from "react";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import DoctorPatientSelector from "../../components/DoctorPatientSelector";
import {
  createPrescription,
  getMyDoctorPrescriptions,
} from "../../api/prescriptionApi";
import { getMyDoctorAppointments } from "../../api/appointmentApi";

const emptyItem = {
  medicineName: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
};

const DoctorPrescriptionsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    patientId: "",
    appointmentId: "",
    diagnosis: "",
    notes: "",
    items: [{ ...emptyItem }],
  });

  const patientOptions = useMemo(() => {
    const map = new Map();

    appointments.forEach((item) => {
      const patient = item?.patient;
      const user = patient?.user;

      if (patient?.id && user?.name && !map.has(patient.id)) {
        map.set(patient.id, {
          id: patient.id,
          name: user.name,
          email: user.email,
        });
      }
    });

    return Array.from(map.values());
  }, [appointments]);

  const selectedPatientAppointments = useMemo(() => {
    if (!formData.patientId) return [];
    return appointments.filter(
      (item) => String(item?.patient?.id) === String(formData.patientId)
    );
  }, [appointments, formData.patientId]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await getMyDoctorPrescriptions();
      setPrescriptions(data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load doctor prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorAppointments = async () => {
    try {
      setLoadingPatients(true);
      const data = await getMyDoctorAppointments();
      setAppointments(data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load doctor patients");
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
    fetchDoctorAppointments();
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "patientId" ? { appointmentId: "" } : {}),
    }));
  };

  const handlePatientChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      patientId: value,
      appointmentId: "",
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index][field] = value;
      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  const addMedicineItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...emptyItem }],
    }));
  };

  const removeMedicineItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");
      setError("");

      await createPrescription({
        patientId: Number(formData.patientId),
        appointmentId: formData.appointmentId ? Number(formData.appointmentId) : undefined,
        diagnosis: formData.diagnosis,
        notes: formData.notes,
        items: formData.items,
      });

      setMessage("Prescription created successfully");
      setFormData({
        patientId: "",
        appointmentId: "",
        diagnosis: "",
        notes: "",
        items: [{ ...emptyItem }],
      });
      fetchPrescriptions();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create prescription");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell title="Prescriptions" subtitle="Create and review prescriptions.">
      <PageHeader
        title="Doctor Prescriptions"
        subtitle="Select a patient from your appointments and create prescriptions professionally."
      />

      <div className="panel-grid">
        <div className="panel">
          <h3>Create Prescription</h3>

          {loadingPatients ? (
            <p>Loading patients...</p>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <DoctorPatientSelector
                patients={patientOptions}
                value={formData.patientId}
                onChange={handlePatientChange}
              />

              <div className="form-group">
                <label>Related Appointment (optional)</label>
                <select
                  name="appointmentId"
                  value={formData.appointmentId}
                  onChange={handleFieldChange}
                  disabled={!formData.patientId}
                >
                  <option value="">Choose appointment</option>
                  {selectedPatientAppointments.map((item) => (
                    <option key={item.id} value={item.id}>
                      {new Date(item.appointmentDate).toLocaleString()} — {item.reason || "No reason"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Diagnosis</label>
                <input
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleFieldChange}
                  placeholder="Diagnosis"
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  rows="4"
                  name="notes"
                  value={formData.notes}
                  onChange={handleFieldChange}
                  placeholder="Prescription notes"
                />
              </div>

              <div className="details-stack">
                <strong>Medicine Items</strong>

                {formData.items.map((item, index) => (
                  <div key={index} className="med-card">
                    <div className="form-group">
                      <label>Medicine Name</label>
                      <input
                        value={item.medicineName}
                        onChange={(e) => handleItemChange(index, "medicineName", e.target.value)}
                        placeholder="Medicine name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Dosage</label>
                      <input
                        value={item.dosage}
                        onChange={(e) => handleItemChange(index, "dosage", e.target.value)}
                        placeholder="Dosage"
                      />
                    </div>

                    <div className="form-group">
                      <label>Frequency</label>
                      <input
                        value={item.frequency}
                        onChange={(e) => handleItemChange(index, "frequency", e.target.value)}
                        placeholder="Frequency"
                      />
                    </div>

                    <div className="form-group">
                      <label>Duration</label>
                      <input
                        value={item.duration}
                        onChange={(e) => handleItemChange(index, "duration", e.target.value)}
                        placeholder="Duration"
                      />
                    </div>

                    <div className="form-group">
                      <label>Instructions</label>
                      <input
                        value={item.instructions}
                        onChange={(e) => handleItemChange(index, "instructions", e.target.value)}
                        placeholder="Instructions"
                      />
                    </div>

                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => removeMedicineItem(index)}
                      >
                        Remove Medicine
                      </button>
                    )}
                  </div>
                ))}

                <button type="button" className="btn btn-secondary" onClick={addMedicineItem}>
                  Add Another Medicine
                </button>
              </div>

              {message && <p className="success-text">{message}</p>}
              {error && <p className="error-text">{error}</p>}

              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Prescription"}
              </button>
            </form>
          )}
        </div>

        <div className="panel">
          <h3>Issued Prescriptions</h3>

          {loading ? (
            <p>Loading prescriptions...</p>
          ) : prescriptions.length === 0 ? (
            <p className="muted-text">No prescriptions created yet.</p>
          ) : (
            <div className="appointment-list">
              {prescriptions.map((item) => (
                <div key={item.id} className="appointment-card">
                  <div className="appointment-top">
                    <div>
                      <h4>{item?.patient?.user?.name || "Unknown Patient"}</h4>
                      <p>{item.diagnosis || "No diagnosis provided"}</p>
                    </div>
                    <span className="status-pill status-confirmed">#{item.id}</span>
                  </div>

                  <div className="appointment-meta">
                    <p><strong>Date:</strong> {item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}</p>
                    <p><strong>Notes:</strong> {item.notes || "N/A"}</p>
                    <p><strong>Medicines:</strong> {item.items?.length || 0}</p>
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

export default DoctorPrescriptionsPage;