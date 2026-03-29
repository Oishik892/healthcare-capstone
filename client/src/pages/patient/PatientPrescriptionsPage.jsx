import { useEffect, useState } from "react";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import {
  getMyPatientPrescriptions,
  getPrescriptionById,
} from "../../api/prescriptionApi";

const PatientPrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyPatientPrescriptions();
      setPrescriptions(data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleViewDetails = async (id) => {
    try {
      setDetailsLoading(true);
      const data = await getPrescriptionById(id);
      setSelectedPrescription(data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load prescription details");
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <AppShell title="Prescriptions" subtitle="Review your medicine instructions.">
      <PageHeader
        title="My Prescriptions"
        subtitle="See prescriptions issued by doctors and inspect medicine details."
      />

      <div className="panel-grid">
        <div className="panel">
          <h3>Prescription List</h3>

          {loading ? (
            <p>Loading prescriptions...</p>
          ) : prescriptions.length === 0 ? (
            <p className="muted-text">No prescriptions found yet.</p>
          ) : (
            <div className="appointment-list">
              {prescriptions.map((item) => (
                <div key={item.id} className="appointment-card">
                  <div className="appointment-top">
                    <div>
                      <h4>{item.diagnosis || "No diagnosis provided"}</h4>
                      <p>Dr. {item?.doctor?.user?.name || "Unknown Doctor"}</p>
                    </div>
                    <span className="status-pill status-confirmed">
                      #{item.id}
                    </span>
                  </div>

                  <div className="appointment-meta">
                    <p>
                      <strong>Date:</strong>{" "}
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}
                    </p>
                    <p>
                      <strong>Notes:</strong> {item.notes || "N/A"}
                    </p>
                    <p>
                      <strong>Medicines:</strong> {item.items?.length || 0}
                    </p>
                  </div>

                  <div className="action-row">
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleViewDetails(item.id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <h3>Prescription Details</h3>

          {detailsLoading ? (
            <p>Loading details...</p>
          ) : !selectedPrescription ? (
            <p className="muted-text">Select a prescription to view details.</p>
          ) : (
            <div className="details-stack">
              <p><strong>Diagnosis:</strong> {selectedPrescription.diagnosis || "N/A"}</p>
              <p><strong>Doctor:</strong> {selectedPrescription?.doctor?.user?.name || "N/A"}</p>
              <p><strong>Notes:</strong> {selectedPrescription.notes || "N/A"}</p>

              <div>
                <strong>Medicines:</strong>
                <div className="med-list">
                  {selectedPrescription.items?.map((item) => (
                    <div key={item.id} className="med-card">
                      <h4>{item.medicineName}</h4>
                      <p><strong>Dosage:</strong> {item.dosage || "N/A"}</p>
                      <p><strong>Frequency:</strong> {item.frequency || "N/A"}</p>
                      <p><strong>Duration:</strong> {item.duration || "N/A"}</p>
                      <p><strong>Instructions:</strong> {item.instructions || "N/A"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </AppShell>
  );
};

export default PatientPrescriptionsPage;