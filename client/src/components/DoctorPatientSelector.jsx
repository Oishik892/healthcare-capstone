const DoctorPatientSelector = ({
  patients = [],
  value,
  onChange,
  label = "Select Patient",
  placeholder = "Choose a patient",
}) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} required>
        <option value="">{placeholder}</option>
        {patients.map((patient) => (
          <option key={patient.id} value={patient.id}>
            {patient.name} — {patient.email || "No email"}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DoctorPatientSelector;