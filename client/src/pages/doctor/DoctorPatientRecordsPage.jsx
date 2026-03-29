import { useEffect, useMemo, useState } from "react";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import DoctorPatientSelector from "../../components/DoctorPatientSelector";
import { getMedicalHistoryByPatientId } from "../../api/medicalHistoryApi";
import { getPrescriptionsByPatientId } from "../../api/prescriptionApi";
import { getMyDoctorAppointments } from "../../api/appointmentApi";

const DoctorPatientRecordsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [historyData, setHistoryData] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [error, setError] = useState("");

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

  const fetchDoctorAppointments = async () => {
    try {
      setLoadingPatients(true);
      setError("");
      const data = await getMyDoctorAppointments();
      setAppointments(data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load patients");
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const handleLoadRecords = async () => {
    if (!selectedPatientId) return;

    try {
      setLoadingRecords(true);
      setError("");
      setHistoryData(null);
      setPrescriptions([]);

      const [historyResponse, prescriptionsResponse] = await Promise.all([
        getMedicalHistoryByPatientId(selectedPatientId),
        getPrescriptionsByPatientId(selectedPatientId),
      ]);

      setHistoryData(historyResponse.data || null);
      setPrescriptions(prescriptionsResponse.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load patient records");
    } finally {
      setLoadingRecords(false);
    }
  };

  return (
    <AppShell title="Patient Records" subtitle="Review records from your own patient list.">
      <PageHeader
        title="Patient Records"
        subtitle="Choose a patient from your appointment list to view history and prescriptions."
      />

      <div className="panel-grid">
        <div className="panel">
          <h3>Select Patient</h3>

          {loadingPatients ? (
            <p>Loading your patients...</p>
          ) : (
            <div className="auth-form">
              <DoctorPatientSelector
                patients={patientOptions}
                value={selectedPatientId}
                onChange={setSelectedPatientId}
              />

              {error && <p className="error-text">{error}</p>}

              <button
                className="btn btn-primary"
                type="button"
                onClick={handleLoadRecords}
                disabled={!selectedPatientId || loadingRecords}
              >
                {loadingRecords ? "Loading..." : "Load Records"}
              </button>
            </div>
          )}
        </div>

        <div className="panel">
          <h3>Medical History</h3>

          {loadingRecords ? (
            <p>Loading medical history...</p>
          ) : !historyData ? (
            <p className="muted-text">Select a patient to view medical history.</p>
          ) : (
            <div className="details-stack">
              <p><strong>Name:</strong> {historyData?.user?.name || "N/A"}</p>
              <p><strong>Email:</strong> {historyData?.user?.email || "N/A"}</p>
              <p><strong>Conditions:</strong> {historyData?.medicalHistory?.conditions || "N/A"}</p>
              <p><strong>Allergies:</strong> {historyData?.medicalHistory?.allergies || "N/A"}</p>
              <p><strong>Surgeries:</strong> {historyData?.medicalHistory?.surgeries || "N/A"}</p>
              <p><strong>Notes:</strong> {historyData?.medicalHistory?.notes || "N/A"}</p>
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <h3>Patient Prescriptions</h3>

        {!historyData ? (
          <p className="muted-text">Select a patient first.</p>
        ) : prescriptions.length === 0 ? (
          <p className="muted-text">No prescriptions found for this patient.</p>
        ) : (
          <div className="appointment-list">
            {prescriptions.map((item) => (
              <div key={item.id} className="appointment-card">
                <div className="appointment-top">
                  <div>
                    <h4>{item.diagnosis || "No diagnosis provided"}</h4>
                    <p>{item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}</p>
                  </div>
                  <span className="status-pill status-confirmed">#{item.id}</span>
                </div>

                <div className="appointment-meta">
                  <p><strong>Notes:</strong> {item.notes || "N/A"}</p>
                  <p><strong>Medicines:</strong> {item.items?.length || 0}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default DoctorPatientRecordsPage;