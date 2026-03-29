import { useEffect, useState } from "react";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import { getMyLabResults, getLabResultById } from "../../api/labResultApi";

const PatientLabResultsPage = () => {
  const [labResults, setLabResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLabResults = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyLabResults();
      setLabResults(data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load lab results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabResults();
  }, []);

  const handleViewDetails = async (id) => {
    try {
      setDetailsLoading(true);
      setError("");
      const data = await getLabResultById(id);
      setSelectedResult(data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load lab result details");
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <AppShell title="Lab Results" subtitle="View your uploaded test reports.">
      <PageHeader
        title="My Lab Results"
        subtitle="Review uploaded reports, summaries, and attached files."
      />

      <div className="panel-grid">
        <div className="panel">
          <h3>Lab Result List</h3>

          {error && <p className="error-text">{error}</p>}

          {loading ? (
            <p>Loading lab results...</p>
          ) : labResults.length === 0 ? (
            <p className="muted-text">No lab results found yet.</p>
          ) : (
            <div className="appointment-list">
              {labResults.map((item) => (
                <div key={item.id} className="appointment-card">
                  <div className="appointment-top">
                    <div>
                      <h4>{item.testName}</h4>
                      <p>Uploaded by: {item?.uploadedBy?.name || "Unknown"}</p>
                    </div>
                    <span className="status-pill status-confirmed">#{item.id}</span>
                  </div>

                  <div className="appointment-meta">
                    <p>
                      <strong>Report Date:</strong>{" "}
                      {item.reportDate ? new Date(item.reportDate).toLocaleDateString() : "N/A"}
                    </p>
                    <p>
                      <strong>Summary:</strong> {item.resultSummary || "N/A"}
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
          <h3>Lab Result Details</h3>

          {detailsLoading ? (
            <p>Loading details...</p>
          ) : !selectedResult ? (
            <p className="muted-text">Select a lab result to view details.</p>
          ) : (
            <div className="details-stack">
              <p><strong>Test Name:</strong> {selectedResult.testName}</p>
              <p><strong>Report Date:</strong> {selectedResult.reportDate ? new Date(selectedResult.reportDate).toLocaleDateString() : "N/A"}</p>
              <p><strong>Summary:</strong> {selectedResult.resultSummary || "N/A"}</p>
              <p><strong>Uploaded By:</strong> {selectedResult?.uploadedBy?.name || "N/A"}</p>

              <div className="action-row">
                <a
                  className="btn btn-primary"
                  href={`https://healthcare-capstone.onrender.com${selectedResult.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Report File
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default PatientLabResultsPage;