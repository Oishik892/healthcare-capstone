import { useEffect, useState } from "react";
import AppShell from "../../components/AppShell";
import PageHeader from "../../components/PageHeader";
import { getMyPatientProfile, updateMyPatientProfile } from "../../api/patientApi";

const PatientProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    gender: "",
    dateOfBirth: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyPatientProfile();
      setProfile(data.data);

      setFormData({
        phone: data.data?.phone || "",
        address: data.data?.address || "",
        gender: data.data?.gender || "",
        dateOfBirth: data.data?.dateOfBirth
          ? new Date(data.data.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const data = await updateMyPatientProfile(formData);
      setProfile(data.data);
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="Patient Profile" subtitle="Manage your personal details.">
        <div className="panel">Loading profile...</div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Patient Profile" subtitle="Manage your personal details.">
      <PageHeader
        title="My Profile"
        subtitle="View and update your patient information."
      />

      <div className="panel-grid">
        <div className="panel">
          <h3>Account Info</h3>
          <p><strong>Name:</strong> {profile?.user?.name}</p>
          <p><strong>Email:</strong> {profile?.user?.email}</p>
          <p><strong>Role:</strong> {profile?.user?.role}</p>
          <p>
            <strong>Joined:</strong>{" "}
            {profile?.user?.createdAt
              ? new Date(profile.user.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        <div className="panel">
          <h3>Update Patient Info</h3>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <input
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="Gender"
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            {message && <p className="success-text">{message}</p>}
            {error && <p className="error-text">{error}</p>}

            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
};

export default PatientProfilePage;