import { useState } from "react";
import { FiCheck, FiTrash2 } from "react-icons/fi";
import DashboardModal from "./DashboardModal";
import "../../css/dashboard.css";

const InvoicesTable = ({
  title = "Invoices",
  addLabel = "+ Create Invoice",
  rows = [],
  showAddButton = false,
  onAdd,
  onEdit,
  onToggleStatus,
  onSoftDelete,
  loading = false,
}) => {
  const [confirmMarkPaidId, setConfirmMarkPaidId] = useState(null);

  const handleMarkPaidClick = (id) => {
    setConfirmMarkPaidId(id);
  };

  const handleConfirmMarkPaid = () => {
    if (confirmMarkPaidId && onToggleStatus) {
      onToggleStatus(confirmMarkPaidId);
    }
    setConfirmMarkPaidId(null);
  };

  const handleCancelMarkPaid = () => {
    setConfirmMarkPaidId(null);
  };

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
              <th>Invoice ID</th>
              <th>Member Code</th>
              <th>Member Name</th>
              <th>Subscription Plan</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Invoice Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="8" className="sa-table-empty">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan="8" className="sa-table-empty">
                  No invoices found
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((row) => {
                const rowId = String(row._id || row.invoiceNumber || row.memberName || "");
                const actionId = row._id || "";

                return (
                  <tr key={rowId}>
                    <td>{row.invoiceNumber || row._id || "—"}</td>
                    <td>{row.memberCode || row.memberId?.memberCode || "—"}</td>
                    <td>{row.memberName || row.memberId?.name || "—"}</td>
                    <td>{row.planName || row.subscriptionPlanId?.planName || "—"}</td>
                    <td>${row.amount ?? 0}</td>
                    <td>
                      <span
                        className={`sa-badge sa-badge-invoice-status ${
                          (row.status || "").toLowerCase() === "paid"
                            ? "sa-badge-paid"
                            : "sa-badge-unpaid"
                        }`}
                      >
                        {row.status || "Unpaid"}
                      </span>
                    </td>
                    <td>
                      {row.date ? new Date(row.date).toLocaleDateString() : "—"}
                    </td>
                    <td>
                      <div className="sa-table-actions">
                        {(row.status || "").toLowerCase() !== "paid" && onToggleStatus && (
                          <button
                            type="button"
                            className="sa-btn sa-btn-outline sa-btn-sm"
                            onClick={() => handleMarkPaidClick(actionId)}
                            disabled={!actionId}
                            title="Mark as Paid"
                            aria-label="Mark invoice as paid"
                          >
                            <FiCheck />
                          </button>
                        )}
                        {onSoftDelete && (
                          <button
                            type="button"
                            className="sa-btn sa-btn-danger sa-btn-sm"
                            onClick={() => onSoftDelete(actionId)}
                            disabled={!actionId}
                            title="Delete"
                            aria-label="Delete invoice"
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

      <DashboardModal
        open={confirmMarkPaidId !== null}
        title="Confirm Payment"
        onClose={handleCancelMarkPaid}
      >
        <div className="sa-confirmation-modal">
          <p className="sa-confirmation-message">
            Are you sure you want to mark this invoice as paid?
          </p>
          <div className="sa-confirmation-actions">
            <button
              type="button"
              className="sa-btn sa-btn-secondary"
              onClick={handleCancelMarkPaid}
            >
              Cancel
            </button>
            <button
              type="button"
              className="sa-btn sa-btn-primary"
              onClick={handleConfirmMarkPaid}
            >
              Yes, Mark as Paid
            </button>
          </div>
        </div>
      </DashboardModal>
    </div>
  );
};

export default InvoicesTable;
