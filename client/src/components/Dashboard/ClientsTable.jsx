import { FiEye, FiToggleRight, FiTrash2 } from "react-icons/fi";
import "../../css/dashboard.css";

const ClientsTable = ({
  title = "Organization",
  addLabel = "Add",
  rows = [],
  showAddButton = false,
  onAdd,
  onView,
  onToggleStatus,
  onSoftDelete,
  loading = false,
}) => {
  return (
    <div className="sa-panel">
      <div className="sa-panel-header">
        <h3 className="sa-panel-title">{title}</h3>
        {showAddButton && (
          <button type="button" className="sa-btn sa-btn-primary" onClick={onAdd}>
            {addLabel}
          </button>
        )}
      </div>

      <div className="sa-table-wrapper">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Created</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="sa-table-empty">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan="6" className="sa-table-empty">
                  No records found
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((row) => {
                const rowId =
                  row._id ||
                  row.userId ||
                  row.memberId ||
                  row.memberCode ||
                  row.adminCode ||
                  row.email;
                const actionId = row._id || row.userId || row.memberId || "";

                return (
                  <tr key={rowId}>
                    <td>{row.name}</td>
                    <td>{row.mobile || "—"}</td>
                    <td>
                      <span
                        className={`sa-badge ${row.isActive ? "sa-badge-active" : "sa-badge-inactive"}`}
                      >
                        {row.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{new Date(row.createdAt).toLocaleDateString()}</td>
                    <td>{row.email}</td>
                    <td>
                      <div className="sa-table-actions">
                        {onView && (
                          <button
                            type="button"
                            className="sa-btn sa-btn-outline sa-btn-sm"
                            onClick={() => onView(row)}
                            disabled={!actionId}
                            title="View Details"
                            aria-label="View client details"
                          >
                            <FiEye />
                          </button>
                        )}
                        {onToggleStatus && (
                          <button
                            type="button"
                            className="sa-btn sa-btn-outline sa-btn-sm"
                            onClick={() => onToggleStatus(actionId, row)}
                            disabled={!actionId}
                            title={row.isActive ? "Deactivate" : "Activate"}
                            aria-label={row.isActive ? "Deactivate client" : "Activate client"}
                          >
                            <FiToggleRight />
                          </button>
                        )}
                        {onSoftDelete && (
                          <button
                            type="button"
                            className="sa-btn sa-btn-danger sa-btn-sm"
                            onClick={() => onSoftDelete(actionId)}
                            disabled={!actionId}
                            title="Delete"
                            aria-label="Delete client"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsTable;
