import { FiEdit2, FiTrash2 } from "react-icons/fi";
import "../../css/dashboard.css";

const SubscriptionsTable = ({
  title = "Subscription Plans",
  addLabel = "+ Add Plan",
  rows = [],
  showAddButton = false,
  onAdd,
  onEdit,
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
              <th>Plan Name</th>
              <th>Amount</th>
              <th>Duration</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="sa-table-empty">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan="5" className="sa-table-empty">
                  No subscription plans found
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((row) => {
                const rowId = String(row._id || `${row.planName}-${row.amount}` || "");
                const actionId = row._id || "";

                return (
                  <tr key={rowId}>
                    <td>{row.planName}</td>
                    <td>${row.amount ?? 0}</td>
                    <td>{row.duration ?? 0} Month(s)</td>
                    <td>{row.description || "—"}</td>
                    <td>
                      <div className="sa-table-actions">
                        {onEdit && (
                          <button
                            type="button"
                            className="sa-btn sa-btn-outline sa-btn-sm"
                            onClick={() => onEdit(actionId)}
                            disabled={!actionId}
                            title="Edit"
                            aria-label="Edit subscription plan"
                          >
                            <FiEdit2 />
                          </button>
                        )}
                        {onSoftDelete && (
                          <button
                            type="button"
                            className="sa-btn sa-btn-danger sa-btn-sm"
                            onClick={() => onSoftDelete(actionId)}
                            disabled={!actionId}
                            title="Delete"
                            aria-label="Delete subscription plan"
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

export default SubscriptionsTable;
