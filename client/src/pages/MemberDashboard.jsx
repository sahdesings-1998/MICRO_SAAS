import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUserCheck,
  FiFileText,
  FiDollarSign,
  FiClock,
  FiUser,
  FiEdit2,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { usePhoneInput } from "../hooks";
import MainLayout from "../components/Dashboard/MainLayout";
import DashboardModal from "../components/Dashboard/DashboardModal";
import PhoneInput from "../components/PhoneInput/PhoneInput";
import * as ds from "../services/dashboardService";
import "../css/dashboard.css";

const MENU = ["Dashboard", "Invoices", "Account", "Logout"];

const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};



const MemberDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editFormErr, setEditFormErr] = useState("");
  const [editFormData, setEditFormData] = useState({ name: "", email: "", companyName: "" });
  const [editSaving, setEditSaving] = useState(false);

  // Phone input hook for edit modal
  const {
    mobile: editMobile,
    mobileDial: editMobileDial,
    handleMobileChange: handleEditMobileChange,
    getE164: getEditE164,
    isValid: isEditPhoneValid,
    setFromE164: setEditFromE164
  } = usePhoneInput({
    defaultDial: "+91"
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: res } = await ds.getMemberProfile();
      setData(res);
    } catch {
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMenu = (item) => {
    if (item === "Logout") {
      setShowLogout(true);
      return;
    }
    setActiveItem(item);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login");
  };

  const openEditMemberModal = () => {
    if (!data?.member) return;
    setEditingMember(data.member);
    setEditFormData({
      name: data.member.name ?? "",
      email: data.member.email ?? "",
      companyName: data.member.companyName ?? ""
    });
    if (data.member.mobile) {
      setEditFromE164(data.member.mobile);
    }
    setEditFormErr("");
    setShowEditModal(true);
  };

  const closeEditMemberModal = () => {
    setShowEditModal(false);
    setEditingMember(null);
    setEditFormErr("");
    setEditFormData({ name: "", email: "", companyName: "" });
  };

  const handleEditMemberSave = async (e) => {
    e.preventDefault();
    if (!editFormData.name?.trim()) {
      setEditFormErr("Name is required");
      return;
    }
    if (!editFormData.email?.trim()) {
      setEditFormErr("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(editFormData.email)) {
      setEditFormErr("Invalid email format");
      return;
    }
    if (!isEditPhoneValid) {
      setEditFormErr("Invalid phone number");
      return;
    }
    setEditFormErr("");
    setEditSaving(true);
    try {
      const e164Phone = getEditE164();
      await ds.updateMemberProfile({
        name: editFormData.name.trim(),
        email: editFormData.email.trim(),
        mobile: e164Phone,
        companyName: (editFormData.companyName || "").trim()
      });
      closeEditMemberModal();
      loadData();
    } catch (ex) {
      setEditFormErr(ex?.response?.data?.message || "Failed to update member");
    }
    setEditSaving(false);
  };

  const member = data?.member || {};
  const invoices = Array.isArray(data?.invoices) ? data.invoices : [];
  const totalInvoices = data?.totalInvoices ?? 0;
  const totalPaidAmount = data?.totalPaidAmount ?? 0;
  const totalUnpaidAmount = data?.totalUnpaidAmount ?? 0;
  const currentPlan = data?.currentPlan;

  const summaryCards = [
    { label: "Member Status", value: member.isActive ? "Active" : "Inactive", icon: FiUserCheck },
    { label: "Total Invoices", value: totalInvoices, icon: FiFileText },
    { label: "Total Paid Amount", value: `$${totalPaidAmount.toLocaleString()}`, icon: FiDollarSign },
    { label: "Pending Amount", value: `$${totalUnpaidAmount.toLocaleString()}`, icon: FiClock },
  ];

  const renderDashboard = () => (
    <div className="sa-member-dashboard">
      {/* <h2 className="sa-member-page-title">Dashboard</h2>
      <p className="sa-member-page-subtitle">Overview of your membership and payments</p> */}

      {/* Member Info Section with Edit Button */}
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", backgroundColor: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{member?.name || "Member"}</h3>
          <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#64748b" }}>Member ID: {member?.memberCode || "—"}</p>
        </div>
        <button
          type="button"
          onClick={openEditMemberModal}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
        >
          <FiEdit2 size={16} /> Edit Member
        </button>
      </div>

      <div className="sa-cards-grid sa-dashboard-cards-grid sa-member-cards">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="sa-dashboard-card">
              <div className="sa-dashboard-card-top">
                <span className="sa-dashboard-card-icon">
                  <Icon size={18} />
                </span>
                <p className="sa-dashboard-card-value">{card.value}</p>
              </div>
              <p className="sa-dashboard-card-label">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="sa-member-dashboard-row">
        <div className="sa-memdash-subscription-card">
          <h3 className="sa-memdash-section-title">Current Subscription</h3>
          {currentPlan ? (
            <div className="sa-memdash-subscription-content">
              <div className="sa-memdash-subscription-row">
                <span className="sa-memdash-sub-label">Plan Name</span>
                <span className="sa-memdash-sub-value">{currentPlan.planName}</span>
              </div>
              <div className="sa-memdash-subscription-row">
                <span className="sa-memdash-sub-label">Amount</span>
                <span className="sa-memdash-sub-value">${currentPlan.amount?.toLocaleString() ?? 0}</span>
              </div>
              <div className="sa-memdash-subscription-row">
                <span className="sa-memdash-sub-label">Duration</span>
                <span className="sa-memdash-sub-value">{currentPlan.duration ?? 0} month(s)</span>
              </div>
              <div className="sa-memdash-subscription-row">
                <span className="sa-memdash-sub-label">Start Date</span>
                <span className="sa-memdash-sub-value">{formatDate(currentPlan.startDate)}</span>
              </div>
              <div className="sa-memdash-subscription-row">
                <span className="sa-memdash-sub-label">Next Due Date</span>
                <span className="sa-memdash-sub-value">{formatDate(currentPlan.nextDueDate)}</span>
              </div>
              <span
                className={`sa-badge sa-badge-invoice-status ${(currentPlan.status || "").toLowerCase() === "paid" ? "sa-badge-paid" : "sa-badge-unpaid"
                  }`}
              >
                {currentPlan.status ?? "Unpaid"}
              </span>
            </div>
          ) : (
            <p className="sa-empty">No subscription plan</p>
          )}
        </div>

        <div className="sa-memdash-payment-card">
          <h3 className="sa-memdash-section-title">Payment Summary</h3>
          <div className="sa-memdash-payment-content">
            <div className="sa-memdash-payment-row">
              <span className="sa-memdash-pay-label">Total Paid Amount</span>
              <span className="sa-memdash-pay-value sa-memdash-pay-success">
                ${totalPaidAmount.toLocaleString()}
              </span>
            </div>
            <div className="sa-memdash-payment-row">
              <span className="sa-memdash-pay-label">Total Unpaid Amount</span>
              <span className="sa-memdash-pay-value sa-memdash-pay-pending">
                ${totalUnpaidAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="sa-member-invoices-page">
      {/* <h2 className="sa-member-page-title">Invoices</h2>
      <p className="sa-member-page-subtitle">Your invoice history</p> */}

      <div className="sa-memdash-invoices-panel">
        {invoices.length === 0 ? (
          <p className="sa-empty">No invoices found</p>
        ) : (
          <div className="sa-memdash-invoices-table-wrap">
            <table className="sa-memdash-invoices-table">
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Plan Name</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Method</th>
                  <th>Invoice Date</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv._id}>
                    <td>{inv.invoiceNumber ?? "—"}</td>
                    <td>{inv.planName ?? "—"}</td>
                    <td>${(inv.amount ?? 0).toLocaleString()}</td>
                    <td>
                      <span
                        className={`sa-badge sa-badge-invoice-status ${(inv.status || "").toLowerCase() === "paid" ? "sa-badge-paid" : "sa-badge-unpaid"
                          }`}
                      >
                        {inv.status ?? "Unpaid"}
                      </span>
                    </td>
                    <td>—</td>
                    <td>{formatDate(inv.invoiceDate || inv.date)}</td>
                    <td>{formatDate(inv.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderAccount = () => <MemberAccountSection member={member} onSaved={loadData} />;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="sa-panel">
          <div className="sa-panel-body">
            <p className="sa-empty">Loading...</p>
          </div>
        </div>
      );
    }

    switch (activeItem) {
      case "Dashboard":
        return renderDashboard();
      case "Invoices":
        return renderInvoices();
      case "Account":
        return renderAccount();
      default:
        return renderDashboard();
    }
  };

  return (
    <MainLayout
      menuItems={MENU}
      activeItem={activeItem}
      onMenuSelect={handleMenu}
      title={activeItem}
      role={user?.role || "member"}
      onLogout={() => setShowLogout(true)}
    >
      {renderContent()}

      <DashboardModal open={showLogout} title="Confirm Logout" onClose={() => setShowLogout(false)}>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>
          Are you sure you want to logout?
        </p>
        <div className="sa-form-actions">
          <button type="button" className="sa-btn sa-btn-outline" onClick={() => setShowLogout(false)}>
            Cancel
          </button>
          <button type="button" className="sa-btn sa-btn-danger" onClick={confirmLogout}>
            Yes, Logout
          </button>
        </div>
      </DashboardModal>

      {/* Edit Member Modal */}
      <DashboardModal
        open={showEditModal}
        title="Edit Member Details"
        onClose={closeEditMemberModal}
        size="form"
      >
        <form onSubmit={handleEditMemberSave}>
          <div className="sa-form-row">
            <div className="sa-form-field">
              <label className="sa-form-label">Name *</label>
              <input
                className="sa-form-input"
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                placeholder="Enter member name"
                required
              />
            </div>
            <div className="sa-form-field">
              <label className="sa-form-label">Email *</label>
              <input
                className="sa-form-input"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div className="sa-form-row">
            <div className="sa-form-field">
              <label className="sa-form-label">Mobile Number *</label>
              <PhoneInput
                value={editMobile}
                dialCode={editMobileDial}
                onChange={handleEditMobileChange}
                placeholder="Enter phone number"
                id="edit-member-mobile"
              />
            </div>
            <div className="sa-form-field">
              <label className="sa-form-label">Company Name</label>
              <input
                className="sa-form-input"
                type="text"
                value={editFormData.companyName}
                onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
                placeholder="Enter company name"
              />
            </div>
          </div>

          {editFormErr && (
            <p className="sa-form-error" style={{ marginTop: 16 }}>
              {editFormErr}
            </p>
          )}

          <div className="sa-form-actions" style={{ marginTop: 24 }}>
            <button
              type="button"
              className="sa-btn sa-btn-outline"
              onClick={closeEditMemberModal}
              disabled={editSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="sa-btn sa-btn-primary"
              disabled={editSaving || !isEditPhoneValid}
            >
              {editSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </DashboardModal>
    </MainLayout>
  );
};

const MemberAccountSection = ({ member, onSaved }) => {
  const [profile, setProfile] = useState(member);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", companyName: "" });
  const [formErr, setFormErr] = useState("");
  const [saving, setSaving] = useState(false);

  // Phone input hook for account section
  const {
    mobile,
    mobileDial,
    handleMobileChange,
    getE164,
    isValid: isPhoneValid,
    setFromE164
  } = usePhoneInput({
    defaultDial: "+91"
  });

  useEffect(() => {
    setProfile(member);
    // Parse stored mobile (E.164) into form fields
    setForm({
      name: member?.name ?? "",
      email: member?.email ?? "",
      companyName: member?.companyName ?? "",
    });
    if (member?.mobile) {
      setFromE164(member.mobile);
    }
  }, [member, setFromE164]);

  const handleEdit = () => {
    setForm({
      name: profile?.name ?? "",
      email: profile?.email ?? "",
      companyName: profile?.companyName ?? "",
    });
    if (profile?.mobile) {
      setFromE164(profile.mobile);
    }
    setFormErr("");
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormErr("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      setFormErr("Name is required");
      return;
    }
    if (!form.email?.trim()) {
      setFormErr("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setFormErr("Invalid email");
      return;
    }
    if (!isPhoneValid) {
      setFormErr("Invalid phone number");
      return;
    }
    setFormErr("");
    setSaving(true);
    try {
      // Get E.164 format phone number
      const e164Phone = getE164();
      const { data } = await ds.updateMemberProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: e164Phone,
        companyName: (form.companyName || "").trim(),
      });
      setProfile(data);
      setEditing(false);
      onSaved?.();
    } catch (ex) {
      setFormErr(ex?.response?.data?.message || "Failed to update profile");
    }
    setSaving(false);
  };

  return (
    <div className="sa-member-account-page">
      {/* <h2 className="sa-member-page-title">Account</h2>
      <p className="sa-member-page-subtitle">Manage your profile</p> */}

      <div className="sa-memdash-account-card">
        <div className="sa-memdash-account-header">
          <div className="sa-memdash-account-main">
            <div className="sa-memdash-profile-avatar">
              <FiUser size={28} />
            </div>
            <div>
              <h3 className="sa-memdash-account-name">{profile?.name ?? "—"}</h3>
              <p className="sa-memdash-account-code">{profile?.memberCode ?? "—"}</p>
            </div>
          </div>
          <span
            className={`sa-badge sa-badge-status ${profile?.isActive ? "sa-badge-active" : "sa-badge-inactive"}`}
          >
            {profile?.isActive ? "Active" : "Inactive"}
          </span>
          {!editing && (
            <button type="button" className="sa-btn sa-btn-outline" onClick={handleEdit}>
              <FiEdit2 /> Edit
            </button>
          )}
        </div>

        {editing ? (
          <form className="sa-memdash-account-form" onSubmit={handleSave}>
            <div className="sa-memdash-account-grid">
              <div className="sa-memdash-account-field">
                <label className="sa-memdash-account-label">Name</label>
                <input
                  className="sa-memdash-account-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              {/* <div className="sa-memdash-account-field">
                <label className="sa-memdash-account-label">Member Code (read-only)</label>
                <input
                  className="sa-memdash-account-input"
                  value={profile?.memberCode ?? ""}
                  readOnly
                  disabled
                  style={{ background: "#f8fafc", cursor: "default" }}
                />
              </div> */}
              <div className="sa-memdash-account-field">
                <label className="sa-memdash-account-label">Email</label>
                <input
                  className="sa-memdash-account-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="sa-memdash-account-field">
                <label className="sa-memdash-account-label">Mobile</label>
                <PhoneInput
                  value={mobile}
                  dialCode={mobileDial}
                  onChange={handleMobileChange}
                  placeholder="Enter phone number"
                  id="member-account-mobile"
                />
              </div>
              <div className="sa-memdash-account-field sa-memdash-account-field-full">
                <label className="sa-memdash-account-label">Company Name</label>
                <input
                  className="sa-memdash-account-input"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />
              </div>
            </div>
            {formErr && <p className="sa-form-error">{formErr}</p>}
            <div className="sa-memdash-account-actions">
              <button type="button" className="sa-btn sa-btn-outline" onClick={handleCancel} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="sa-btn sa-btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="sa-memdash-account-details">
            <div className="sa-memdash-account-detail-row">
              <div className="sa-memdash-account-detail-item">
                <span className="sa-memdash-detail-label">Mobile Number</span>
                <span className="sa-memdash-detail-value">{profile?.mobile ?? "—"}</span>
              </div>
              <div className="sa-memdash-account-detail-item">
                <span className="sa-memdash-detail-label">Email Address</span>
                <span className="sa-memdash-detail-value">{profile?.email ?? "—"}</span>
              </div>
            </div>
            <div className="sa-memdash-account-detail-row">
              <div className="sa-memdash-account-detail-item">
                <span className="sa-memdash-detail-label">Company Name</span>
                <span className="sa-memdash-detail-value">{profile?.companyName ?? "—"}</span>
              </div>
              <div className="sa-memdash-account-detail-item">
                <span className="sa-memdash-detail-label">Joined Date</span>
                <span className="sa-memdash-detail-value">{formatDate(profile?.createdAt)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
