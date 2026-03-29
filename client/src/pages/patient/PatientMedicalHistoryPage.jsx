import { useEffect, useState } from "react";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import {
  getMyMedicalHistory,
  updateMyMedicalHistory,
} from "../../api/medicalHistoryApi";

const PatientMedicalHistoryPage = () => {
  const [formData, setFormData] = useState({
    conditions: "",
    allergies: "",
    surgeries: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyMedicalHistory();
      const history = data.data || {};

      setFormData({
        conditions: history.conditions || "",
        allergies: history.allergies || "",
        surgeries: history.surgeries || "",
        notes: history.notes || "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load medical history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      setError("");
      await updateMyMedicalHistory(formData);
      setMessage("Medical history saved successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save medical history");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Medical History" subtitle="Manage your health background.">
      <PageHeader
        title="My Medical History"
        subtitle="Update conditions, allergies, surgeries, and notes."
      />

      <div className="panel">
        {loading ? (
          <p>Loading medical history...</p>
        ) : (
          <form onSubmit={handleSave} className="auth-form">
            <div className="form-group">
              <label>Conditions</label>
              <textarea
                rows="4"
                name="conditions"
                value={formData.conditions}
                onChange={handleChange}
                placeholder="Example: Asthma, diabetes"
              />
            </div>

            <div className="form-group">
              <label>Allergies</label>
              <textarea
                rows="4"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Example: Dust, peanuts"
              />
            </div>

            <div className="form-group">
              <label>Surgeries</label>
              <textarea
                rows="4"
                name="surgeries"
                value={formData.surgeries}
                onChange={handleChange}
                placeholder="Example: Appendectomy in 2020"
              />
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                rows="5"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional medical notes"
              />
            </div>

            {message && <p className="success-text">{message}</p>}
            {error && <p className="error-text">{error}</p>}

            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Medical History"}
            </button>
          </form>
        )}
      </div>
    </AppShell>
  );
};

export default PatientMedicalHistoryPage;