import { useState, useEffect } from "react";
import DashboardModal from "./DashboardModal";
import DatePicker from "../DatePicker";
import "../../css/dashboard.css";

const PaymentConfirmModal = ({
  open,
  invoiceNumber,
  amount,
  paymentMethods = [],
  onConfirm,
  onCancel,
  loading = false
}) => {
  const [selectedMethodId, setSelectedMethodId] = useState("");
  // const [paymentDate, setPaymentDate] = useState(null);
  const [notes, setNotes] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date());


  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      const activePaymentMethods = paymentMethods.filter((method) => method.isActive !== false);
      setSelectedMethodId(activePaymentMethods.length > 0 ? activePaymentMethods[0]._id : "");
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setNotes("");
      setTransactionId("");
    }
  }, [open, paymentMethods]);

  const handleConfirm = () => {
    if (!selectedMethodId && paymentMethods.length > 0) {
      alert("Please select a payment method");
      return;
    }

    onConfirm({
      paymentMethodId: selectedMethodId,
      paymentDate: paymentDate,
      paymentNotes: notes,
      transactionId: transactionId
    });
  };

  // Filter to only show active payment methods
  const activePaymentMethods = paymentMethods.filter((method) => method.isActive !== false);

  return (
    <DashboardModal
      open={open}
      title="Confirm Payment"
      onClose={onCancel}
      size="form"
    >
      <div className="sa-payment-confirm-container">
        {/* Invoice Details */}
        <div className="sa-payment-invoice-summary">
          <div className="sa-payment-summary-row">
            <span className="sa-payment-summary-label">Invoice Number:</span>
            <span className="sa-payment-summary-value">{invoiceNumber || "—"}</span>
          </div>
          <div className="sa-payment-summary-row">
            <span className="sa-payment-summary-label">Amount:</span>
            <span className="sa-payment-summary-value">${(amount || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Form */}
        <form className="sa-payment-form" onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
          {/* Payment Method Dropdown */}
          <div className="sa-form-field">
            <label className="sa-form-label">Payment Method *</label>
            <select
              className="sa-form-input sa-payment-method-select"
              value={selectedMethodId}
              onChange={(e) => setSelectedMethodId(e.target.value)}
              required
              disabled={activePaymentMethods.length === 0 || loading}
            >
              <option value="">Select a payment method</option>
              {activePaymentMethods.map((method) => (
                <option key={method._id} value={method._id}>
                  {method.name}
                </option>
              ))}
            </select>
            {activePaymentMethods.length === 0 && (
              <p className="sa-payment-field-hint">No payment methods configured</p>
            )}
          </div>

          {/* Payment Date */}
          <div className="sa-form-field">
            <label className="sa-form-label">Payment Date *</label>
            <DatePicker
              value={paymentDate}
              // onChange={setPaymentDate}
              onChange={(date) => setPaymentDate(date)}
              placeholder="Select payment date"
              required
              disabled={loading}
            />
            {/* <p className="sa-payment-field-hint">Default: Today's date</p> */}
          </div>

          {/* Payment Notes (Optional) */}
          <div className="sa-form-field">
            <label className="sa-form-label">Payment Notes (Optional)</label>
            <textarea
              className="sa-form-input sa-payment-notes-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Received via bank transfer or any other notes"
              rows="3"
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="sa-form-actions" style={{ marginTop: 24 }}>
            <button
              type="button"
              className="sa-btn sa-btn-outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="sa-btn sa-btn-primary"
              disabled={loading || (!selectedMethodId && activePaymentMethods.length > 0)}
            >
              {loading ? "Confirming..." : "Confirm Payment"}
            </button>
          </div>
        </form>
      </div>
    </DashboardModal>
  );
};

export default PaymentConfirmModal;
