const StatCard = ({ label, value, hint }) => {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
      {hint && <p className="stat-hint">{hint}</p>}
    </div>
  );
};

export default StatCard;