import { useEffect, useState } from "react";
import { FiUsers, FiUserCheck, FiUserX } from "react-icons/fi";
import * as ds from "../../services/dashboardService";
import "../../css/dashboard.css";

const CARD_ICONS = {
  "Total Organizations": FiUsers,
  "Active Organizations": FiUserCheck,
  "Inactive Organizations": FiUserX,
};

const CARD_DESCRIPTIONS = {
  "Total Organizations": "All organization accounts",
  "Active Organizations": "Organizations with active status",
  "Inactive Organizations": "Organizations with inactive status",
};

const ReportCard = ({ label, value, icon: Icon, description }) => (
  <div className="sa-report-card">
    <p className="sa-report-card-label">
      {Icon && (
        <span className="sa-report-card-icon" aria-hidden="true">
          <Icon />
        </span>
      )}
      {label}
    </p>
    <p className="sa-report-card-value">{value}</p>
    <p className="sa-report-card-desc">{description}</p>
  </div>
);

const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const SuperAdminReportsSection = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({ rows: [], summary: null });

  const loadReports = async () => {
    setLoading(true);
    try {
      const { data } = await ds.getSuperAdminReports();
      setReportData({
        rows: data?.rows || [],
        summary: data?.summary || null,
      });
    } catch {
      setReportData({ rows: [], summary: null });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const summary = reportData.summary || {};
  const rows = reportData.rows || [];

  const reportCards = [
    { label: "Total Organizations", value: summary.totalClients ?? 0, icon: CARD_ICONS["Total Organizations"], description: CARD_DESCRIPTIONS["Total Organizations"] },
    { label: "Active Organizations", value: summary.activeClients ?? 0, icon: CARD_ICONS["Active Organizations"], description: CARD_DESCRIPTIONS["Active Organizations"] },
    { label: "Inactive Organizations", value: summary.inactiveClients ?? 0, icon: CARD_ICONS["Inactive Organizations"], description: CARD_DESCRIPTIONS["Inactive Organizations"] },
  ];

  if (loading) {
    return (
      <div className="sa-panel">
        <div className="sa-panel-body">
          <p className="sa-empty">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sa-reports-dashboard">
      <h2 className="sa-reports-dashboard-title">Organization Report</h2>
      <p className="sa-reports-dashboard-subtitle">
        Overview of Organizations across all accounts.
      </p>

      <div className="sa-reports-cards-grid">
        {reportCards.map((card) => (
          <ReportCard key={card.label} label={card.label} value={card.value} icon={card.icon} description={card.description} />
        ))}
      </div>

      <div className="sa-panel" style={{ marginTop: 24 }}>
        <div className="sa-panel-header">
          <h3 className="sa-panel-title">Organization Overview</h3>
        </div>
        <div className="sa-table-wrapper">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Client Name</th>
                {/* <th>Admin Code</th> */}
                <th>Status</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="4" className="sa-table-empty">
                    No clients found
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr key={row.adminId || idx}>
                    <td>{row.clientName ?? "—"}</td>
                    {/* <td>{row.adminCode ?? "—"}</td> */}
                    <td>
                      <span className={`sa-badge ${row.status === "Active" ? "sa-badge-active" : "sa-badge-inactive"}`}>
                        {row.status ?? "—"}
                      </span>
                    </td>
                    <td>{formatDate(row.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminReportsSection;
