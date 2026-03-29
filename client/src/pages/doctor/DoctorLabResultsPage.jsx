import { useEffect, useMemo, useState } from "react";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import DoctorPatientSelector from "../../components/DoctorPatientSelector";
import {
  getLabResultsByPatientId,
  uploadLabResult,
} from "../../api/labResultApi";
import { getMyDoctorAppointments } from "../../api/appointmentApi";

const DoctorLabResultsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [labResults, setLabResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [uploadForm, setUploadForm] = useState({
    patientId: "",
    testName: "",
    resultSummary: "",
    reportDate: "",
    reportFile: null,
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

  const fetchDoctorAppointments = async () => {
    try {
      setPatientsLoading(true);
      const data = await getMyDoctorAppointments();
      setAppointments(data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load patients");
    } finally {
      setPatientsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const handleUploadChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "reportFile") {
      setUploadForm((prev) => ({
        ...prev,
        reportFile: files[0] || null,
      }));
      return;
    }

    setUploadForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePatientPickForUpload = (value) => {
    setUploadForm((prev) => ({
      ...prev,
      patientId: value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setSearchLoading(true);
      setError("");
      const data = await getLabResultsByPatientId(patientId);
      setLabResults(data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load patient lab results");
      setLabResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);
      setMessage("");
      setError("");

      const formData = new FormData();
      formData.append("patientId", uploadForm.patientId);
      formData.append("testName", uploadForm.testName);
      formData.append("resultSummary", uploadForm.resultSummary);
      formData.append("reportDate", uploadForm.reportDate);

      if (uploadForm.reportFile) {
        formData.append("reportFile", uploadForm.reportFile);
      }

      await uploadLabResult(formData);

      setMessage("Lab result uploaded successfully");
      setUploadForm({
        patientId: "",
        testName: "",
        resultSummary: "",
        reportDate: "",
        reportFile: null,
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to upload lab result");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppShell title="Lab Results" subtitle="Upload and review patient lab reports.">
      <PageHeader
        title="Doctor Lab Results"
        subtitle="Choose a patient from your appointment list and manage reports."
      />

      <div className="panel-grid">
        <div className="panel">
          <h3>Upload Lab Result</h3>

          {patientsLoading ? (
            <p>Loading patients...</p>
          ) : (
            <form onSubmit={handleUpload} className="auth-form">
              <DoctorPatientSelector
                patients={patientOptions}
                value={uploadForm.patientId}
                onChange={handlePatientPickForUpload}
              />

              <div className="form-group">
                <label>Test Name</label>
                <input
                  name="testName"
                  value={uploadForm.testName}
                  onChange={handleUploadChange}
                  placeholder="Example: CBC"
                  required
                />
              </div>

              <div className="form-group">
                <label>Result Summary</label>
                <textarea
                  rows="4"
                  name="resultSummary"
                  value={uploadForm.resultSummary}
                  onChange={handleUploadChange}
                  placeholder="Example: Mild anemia detected"
                />
              </div>

              <div className="form-group">
                <label>Report Date</label>
                <input
                  type="date"
                  name="reportDate"
                  value={uploadForm.reportDate}
                  onChange={handleUploadChange}
                />
              </div>

              <div className="form-group">
                <label>Report File</label>
                <input
                  type="file"
                  name="reportFile"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleUploadChange}
                  required
                />
              </div>

              {message && <p className="success-text">{message}</p>}
              {error && <p className="error-text">{error}</p>}

              <button className="btn btn-primary" type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Report"}
              </button>
            </form>
          )}
        </div>

        <div className="panel">
          <h3>Search Patient Lab Results</h3>

          {patientsLoading ? (
            <p>Loading patients...</p>
          ) : (
            <form onSubmit={handleSearch} className="auth-form">
              <DoctorPatientSelector
                patients={patientOptions}
                value={patientId}
                onChange={setPatientId}
              />

              <button className="btn btn-secondary" type="submit" disabled={searchLoading || !patientId}>
                {searchLoading ? "Searching..." : "Load Results"}
              </button>
            </form>
          )}

          <div className="appointment-list" style={{ marginTop: "16px" }}>
            {labResults.length === 0 ? (
              <p className="muted-text">No searched lab results yet.</p>
            ) : (
              labResults.map((item) => (
                <div key={item.id} className="appointment-card">
                  <div className="appointment-top">
                    <div>
                      <h4>{item.testName}</h4>
                      <p>{item.resultSummary || "No summary"}</p>
                    </div>
                    <span className="status-pill status-confirmed">#{item.id}</span>
                  </div>

                  <div className="appointment-meta">
                    <p>
                      <strong>Report Date:</strong>{" "}
                      {item.reportDate ? new Date(item.reportDate).toLocaleDateString() : "N/A"}
                    </p>
                    <p>
                      <strong>Uploader:</strong> {item?.uploadedBy?.name || "Unknown"}
                    </p>
                  </div>

                  <div className="action-row">
                    <a
                      className="btn btn-primary"
                      href={`https://healthcare-capstone.onrender.com${item.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open File
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default DoctorLabResultsPage;