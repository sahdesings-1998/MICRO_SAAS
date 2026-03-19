import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/Dashboard/MainLayout";
import DatePicker from "../components/DatePicker";
import DashboardCards from "../components/Dashboard/DashboardCards";
import RevenueChart from "../components/Dashboard/RevenueChart";
import MembersTable from "../components/Dashboard/MembersTable";
import SubscriptionsTable from "../components/Dashboard/SubscriptionsTable";
import InvoicesTable from "../components/Dashboard/InvoicesTable";
import ReportsSection from "../components/Dashboard/ReportsSection";
import AccountSection from "../components/Dashboard/AccountSection";
import DashboardModal from "../components/Dashboard/DashboardModal";
import MemberDetailsModal from "../components/Dashboard/MemberDetailsModal";
import PhoneInput from "../components/PhoneInput/PhoneInput";
import { parseE164Phone, getDefaultDialCode } from "../utils/phoneParser";
import * as ds from "../services/dashboardService";
import "../css/dashboard.css";

const MENU = ["Dashboard", "Members", "Subscriptions", "Payment Methods", "Invoices", "Reports", "Account", "Logout"];



const validateMemberForm = (f, isEdit = false) => {
  if (!f.name?.trim()) return "Name is required";
  if (!f.email?.trim()) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(f.email)) return "Invalid email";
  if (f.password && f.password.length < 6) return "Password must be at least 6 characters";
  if (!isEdit && !f.subscriptionPlanId) return "Subscription plan is required for initial invoice";
  return "";
};

const validateSubscriptionForm = (f) => {
  if (!f.planName?.trim()) return "Plan name is required";
  if (f.amount == null || f.amount === "" || Number(f.amount) < 0)
    return "Valid amount is required";
  if (f.duration == null || f.duration === "" || Number(f.duration) < 1)
    return "Duration must be at least 1 month";
  return "";
};

const validateInvoiceForm = (f) => {
  if (!f.memberId) return "Member is required";
  if (!f.subscriptionPlanId) return "Subscription plan is required";
  return "";
};

const validatePaymentMethodForm = (f) => {
  if (!f.name?.trim()) return "Payment method name is required";
  return "";
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Dashboard");

  const [stats, setStats] = useState(null);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    mobileDial: getDefaultDialCode(),
    companyName: "",
    subscriptionPlanId: "",
    startDate: "",
    isActive: true,
  });
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [showMemberPw, setShowMemberPw] = useState(false);
  const [memberFormErr, setMemberFormErr] = useState("");

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionForm, setSubscriptionForm] = useState({
    planName: "",
    amount: "",
    duration: "",
    description: "",
  });
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [subscriptionFormErr, setSubscriptionFormErr] = useState("");

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    memberId: "",
    subscriptionPlanId: "",
    date: new Date().toISOString().slice(0, 10),
    status: "Unpaid",
  });
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [invoiceFormErr, setInvoiceFormErr] = useState("");

  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [paymentMethodForm, setPaymentMethodForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [editingMethodId, setEditingMethodId] = useState(null);
  const [paymentMethodFormErr, setPaymentMethodFormErr] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteType, setDeleteType] = useState("");
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [pendingStatusValue, setPendingStatusValue] = useState(null);
  const [showUpdateMemberConfirm, setShowUpdateMemberConfirm] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [viewMember, setViewMember] = useState(null);
  const [showMemberDetailsModal, setShowMemberDetailsModal] = useState(false);

  const loadStats = async () => {
    try {
      const { data } = await ds.getAdminStats();
      setStats(data);
    } catch { /* silent */ }
  };

  const loadRevenueByMonth = async () => {
    try {
      const { data } = await ds.getAdminRevenueByMonth();
      setRevenueByMonth(data?.months || []);
    } catch { /* silent */ }
  };

  const loadMembers = async () => {
    setMembersLoading(true);
    try {
      const { data } = await ds.getAdminMembers();
      setMembers(data?.members || data || []);
    } catch { /* silent */ }
    setMembersLoading(false);
  };

  const loadSubscriptions = async () => {
    setSubscriptionsLoading(true);
    try {
      const { data } = await ds.getAdminSubscriptions();
      setSubscriptions(data?.plans || data || []);
    } catch { /* silent */ }
    setSubscriptionsLoading(false);
  };

  const loadInvoices = async () => {
    setInvoicesLoading(true);
    try {
      const { data } = await ds.getAdminInvoices();
      setInvoices(data?.invoices || data || []);
    } catch { /* silent */ }
    setInvoicesLoading(false);
  };

  const loadPaymentMethods = async () => {
    setPaymentMethodsLoading(true);
    try {
      const { data } = await ds.getPaymentMethods();
      setPaymentMethods(data?.methods || data || []);
    } catch { /* silent */ }
    setPaymentMethodsLoading(false);
  };

  useEffect(() => { loadStats(); loadRevenueByMonth(); loadPaymentMethods(); }, []);
  useEffect(() => {
    if (activeItem === "Dashboard") {
      loadStats();
      loadRevenueByMonth();
    }
  }, [activeItem]);
  useEffect(() => {
    if (activeItem === "Members") {
      loadMembers();
      loadSubscriptions();
      loadInvoices();
    }
  }, [activeItem]);
  useEffect(() => {
    if (activeItem === "Subscriptions") loadSubscriptions();
  }, [activeItem]);
  useEffect(() => {
    if (activeItem === "Invoices") {
      loadInvoices();
      loadMembers();
      loadSubscriptions();
    }
  }, [activeItem]);
  useEffect(() => {
    if (activeItem === "Reports") {
      loadMembers();
      loadInvoices();
      loadStats();
    }
  }, [activeItem]);

  const handleMenu = (item) => {
    if (item === "Logout") { setShowLogout(true); return; }
    setActiveItem(item);
  };

  const confirmLogout = () => { logout(); navigate("/login"); };

  const resetMemberForm = () => {
    setMemberForm({
      name: "",
      email: "",
      password: "",
      mobile: "",
      mobileDial: getDefaultDialCode(),
      companyName: "",
      subscriptionPlanId: "",
      startDate: "",
      isActive: true,
    });
    setEditingMemberId(null);
    setMemberFormErr("");
  };
  const handleCreateMember = async (e) => {
    e.preventDefault();
    const err = validateMemberForm({ ...memberForm, password: memberForm.password || "dummy123" }, false);
    if (err) { setMemberFormErr(err); return; }
    if (!memberForm.password?.trim()) {
      setMemberFormErr("Password is required");
      return;
    }
    try {
      const payload = {
        name: memberForm.name.trim(),
        email: memberForm.email.trim(),
        password: memberForm.password,
        mobile: memberForm.mobile
          ? (memberForm.mobileDial || "+91") + memberForm.mobile
          : "",
        companyName: (memberForm.companyName || "").trim(),
        subscriptionPlanId: memberForm.subscriptionPlanId,
        startDate: memberForm.startDate || new Date().toISOString().slice(0, 10),
      };
      await ds.createMember(payload);
      setShowMemberModal(false);
      resetMemberForm();
      loadMembers();
      loadStats();
      loadInvoices();
      loadRevenueByMonth();
    } catch (ex) {
      setMemberFormErr(ex?.response?.data?.message || "Failed to create member");
    }
  };

  const handleEditMember = (id) => {
    const m = members.find((x) => String(x._id || x.userId || "") === String(id));
    if (!m) return;
    
    // Parse the E.164 format phone number to extract dial code and digits
    const storedMobile = m.mobile || "";
    const { dialCode, digits } = parseE164Phone(storedMobile);
    
    setMemberForm({
      name: m.name || "",
      email: m.email || "",
      password: "",
      mobile: digits,
      mobileDial: dialCode,
      companyName: m.companyName || "",
      subscriptionPlanId: "",
      startDate: "",
      isActive: m.isActive !== false,
    });
    setEditingMemberId(id);
    setShowMemberModal(true);
    setMemberFormErr("");
  };

  const handleStatusDropdownChange = (e) => {
    const newActive = e.target.value === "Active";
    setMemberForm((prev) => ({ ...prev, isActive: newActive }));
  };

  const handleStatusConfirm = async () => {
    if (!editingMemberId || pendingStatusValue === null) return;
    try {
      await ds.updateMember(editingMemberId, { isActive: pendingStatusValue });
      setMemberForm((prev) => ({ ...prev, isActive: pendingStatusValue }));
      setShowStatusConfirm(false);
      setPendingStatusValue(null);
      loadMembers();
      loadStats();
    } catch (ex) {
      setMemberFormErr(ex?.response?.data?.message || "Failed to update status");
    }
  };

  const handleStatusCancel = () => {
    setShowStatusConfirm(false);
    setPendingStatusValue(null);
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    const err = validateMemberForm(memberForm, true);
    if (err) { setMemberFormErr(err); return; }
    if (!editingMemberId) return;
    setShowUpdateMemberConfirm(true);
  };

  const handleConfirmUpdateMember = async () => {
    if (!editingMemberId) return;
    const originalMember = members.find((x) => String(x._id || x.userId || "") === String(editingMemberId));
    if (!originalMember) return;

    const payload = {};
    const trimmedName = (memberForm.name || "").trim();
    const trimmedEmail = (memberForm.email || "").trim();
    const fullMobile = memberForm.mobile
      ? (memberForm.mobileDial || "+91") + memberForm.mobile
      : "";
    const trimmedCompany = (memberForm.companyName || "").trim();

    if (trimmedName !== (originalMember.name || "")) payload.name = trimmedName;
    if (trimmedEmail !== (originalMember.email || "")) payload.email = trimmedEmail;
    if (fullMobile !== (originalMember.mobile || "")) payload.mobile = fullMobile;
    if (trimmedCompany !== (originalMember.companyName || "")) payload.companyName = trimmedCompany;
    if (memberForm.password?.trim()) payload.password = memberForm.password;
    if (memberForm.isActive !== originalMember.isActive) payload.isActive = memberForm.isActive;

    if (Object.keys(payload).length === 0) {
      setMemberFormErr("No changes to save");
      setShowUpdateMemberConfirm(false);
      return;
    }

    try {
      await ds.updateMember(editingMemberId, payload);
      setShowMemberModal(false);
      setShowUpdateMemberConfirm(false);
      resetMemberForm();
      loadMembers();
      loadStats();
    } catch (ex) {
      setMemberFormErr(ex?.response?.data?.message || "Failed to update member");
    }
  };

  const handleCancelUpdateMember = () => {
    setShowUpdateMemberConfirm(false);
  };

  const openDeleteMember = (id) => {
    setDeleteTarget(id);
    setDeleteReason("");
    setDeleteType("member");
  };

  const handleDeleteMember = async () => {
    if (!deleteReason?.trim() || deleteType !== "member") return;
    try {
      await ds.softDeleteMember(deleteTarget, { reason: deleteReason });
      setDeleteTarget(null);
      setDeleteReason("");
      setDeleteType("");
      loadMembers();
      loadInvoices();
      loadStats();
    } catch { /* silent */ }
  };

  const handleCreateSubscription = async (e) => {
    e.preventDefault();
    const err = validateSubscriptionForm(subscriptionForm);
    if (err) { setSubscriptionFormErr(err); return; }
    try {
      await ds.createSubscription({
        planName: subscriptionForm.planName.trim(),
        amount: Number(subscriptionForm.amount),
        duration: Number(subscriptionForm.duration),
        description: (subscriptionForm.description || "").trim(),
      });
      setShowSubscriptionModal(false);
      setSubscriptionForm({ planName: "", amount: "", duration: "", description: "" });
      setEditingPlanId(null);
      setSubscriptionFormErr("");
      loadSubscriptions();
    } catch (ex) {
      setSubscriptionFormErr(ex?.response?.data?.message || "Failed to create plan");
    }
  };

  const handleEditSubscription = (id) => {
    const p = subscriptions.find((x) => String(x._id || "") === String(id));
    if (!p) return;
    setSubscriptionForm({
      planName: p.planName || "",
      amount: String(p.amount ?? ""),
      duration: String(p.duration ?? ""),
      description: p.description || "",
    });
    setEditingPlanId(id);
    setShowSubscriptionModal(true);
    setSubscriptionFormErr("");
  };

  const handleUpdateSubscription = async (e) => {
    e.preventDefault();
    const err = validateSubscriptionForm(subscriptionForm);
    if (err) { setSubscriptionFormErr(err); return; }
    if (!editingPlanId) return;
    try {
      await ds.updateSubscription(String(editingPlanId), {
        planName: subscriptionForm.planName.trim(),
        amount: Number(subscriptionForm.amount),
        duration: Number(subscriptionForm.duration),
        description: (subscriptionForm.description || "").trim(),
      });
      setShowSubscriptionModal(false);
      setSubscriptionForm({ planName: "", amount: "", duration: "", description: "" });
      setEditingPlanId(null);
      setSubscriptionFormErr("");
      loadSubscriptions();
    } catch (ex) {
      setSubscriptionFormErr(ex?.response?.data?.message || "Failed to update plan");
    }
  };

  const openDeleteSubscription = (id) => {
    setDeleteTarget(id);
    setDeleteReason("");
    setDeleteType("subscription");
  };

  const handleDeleteSubscription = async () => {
    if (deleteType !== "subscription") return;
    try {
      await ds.deleteSubscription(deleteTarget);
      setDeleteTarget(null);
      setDeleteReason("");
      setDeleteType("");
      loadSubscriptions();
    } catch { /* silent */ }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    const err = validateInvoiceForm(invoiceForm);
    if (err) { setInvoiceFormErr(err); return; }
    
    // Check if the selected member is still active
    const selectedMember = members.find((m) => String(m._id || m.userId || "") === String(invoiceForm.memberId));
    if (!selectedMember || selectedMember.isActive === false) {
      setInvoiceFormErr("Cannot create invoice for an inactive member");
      return;
    }
    
    try {
      await ds.createInvoice({
        memberId: invoiceForm.memberId,
        subscriptionPlanId: invoiceForm.subscriptionPlanId,
        date: invoiceForm.date || new Date().toISOString().slice(0, 10),
        status: invoiceForm.status || "Unpaid",
      });
      setShowInvoiceModal(false);
      setInvoiceForm({
        memberId: "",
        subscriptionPlanId: "",
        date: new Date().toISOString().slice(0, 10),
        status: "Unpaid",
      });
      setEditingInvoiceId(null);
      setInvoiceFormErr("");
      loadInvoices();
      loadStats();
    } catch (ex) {
      setInvoiceFormErr(ex?.response?.data?.message || "Failed to create invoice");
    }
  };

  const handleEditInvoice = (id) => {
    const inv = invoices.find((x) => String(x._id || "") === String(id));
    if (!inv) return;
    const mid = inv.memberId?._id ?? inv.memberId;
    const planId = inv.subscriptionPlanId?._id ?? inv.subscriptionPlanId;
    setInvoiceForm({
      memberId: mid ? String(mid) : "",
      subscriptionPlanId: planId ? String(planId) : "",
      date: (inv.invoiceDate || inv.date) ? new Date(inv.invoiceDate || inv.date).toISOString().slice(0, 10) : "",
      status: inv.status || "Unpaid",
    });
    setEditingInvoiceId(id);
    setShowInvoiceModal(true);
    setInvoiceFormErr("");
  };

  const handleUpdateInvoice = async (e) => {
    e.preventDefault();
    const err = validateInvoiceForm(invoiceForm);
    if (err) { setInvoiceFormErr(err); return; }
    if (!editingInvoiceId) return;
    
    // Check if the selected member is still active
    const selectedMember = members.find((m) => String(m._id || m.userId || "") === String(invoiceForm.memberId));
    if (!selectedMember || selectedMember.isActive === false) {
      setInvoiceFormErr("Cannot update invoice: member is inactive");
      return;
    }
    
    try {
      await ds.updateInvoice(editingInvoiceId, {
        memberId: invoiceForm.memberId || undefined,
        subscriptionPlanId: invoiceForm.subscriptionPlanId || undefined,
        date: invoiceForm.date || new Date().toISOString().slice(0, 10),
        status: invoiceForm.status || "Unpaid",
      });
      setShowInvoiceModal(false);
      setInvoiceForm({
        memberId: "",
        subscriptionPlanId: "",
        date: new Date().toISOString().slice(0, 10),
        status: "Unpaid",
      });
      setEditingInvoiceId(null);
      setInvoiceFormErr("");
      loadInvoices();
      loadMembers();
      loadStats();
      loadRevenueByMonth();
    } catch (ex) {
      setInvoiceFormErr(ex?.response?.data?.message || "Failed to update invoice");
    }
  };

  const handleToggleInvoiceStatus = async (id, paymentData) => {
    try {
      await ds.toggleInvoiceStatus(id, paymentData || {});
      loadInvoices();
      loadMembers();
      loadStats();
      loadRevenueByMonth();
    } catch { /* silent */ }
  };

  const openDeleteInvoice = (id) => {
    setDeleteTarget(id);
    setDeleteReason("");
    setDeleteType("invoice");
  };

  const handleDeleteInvoice = async () => {
    if (!deleteReason?.trim() || deleteType !== "invoice") return;
    try {
      await ds.softDeleteInvoice(deleteTarget, { reason: deleteReason });
      setDeleteTarget(null);
      setDeleteReason("");
      setDeleteType("");
      loadInvoices();
    } catch { /* silent */ }
  };

  const handleCreatePaymentMethod = async (e) => {
    e.preventDefault();
    const err = validatePaymentMethodForm(paymentMethodForm);
    if (err) { setPaymentMethodFormErr(err); return; }
    try {
      await ds.createPaymentMethod({
        name: paymentMethodForm.name.trim(),
        description: (paymentMethodForm.description || "").trim(),
        isActive: paymentMethodForm.isActive,
      });
      setShowPaymentMethodModal(false);
      setPaymentMethodForm({ name: "", description: "", isActive: true });
      setPaymentMethodFormErr("");
      loadPaymentMethods();
    } catch (ex) {
      setPaymentMethodFormErr(ex?.response?.data?.message || "Failed to create payment method");
    }
  };

  const handleEditPaymentMethod = (id) => {
    const m = paymentMethods.find((x) => String(x._id || "") === String(id));
    if (!m) return;
    setPaymentMethodForm({
      name: m.name || "",
      description: m.description || "",
      isActive: m.isActive ?? true,
    });
    setEditingMethodId(id);
    setShowPaymentMethodModal(true);
    setPaymentMethodFormErr("");
  };

  const handleUpdatePaymentMethod = async (e) => {
    e.preventDefault();
    const err = validatePaymentMethodForm(paymentMethodForm);
    if (err) { setPaymentMethodFormErr(err); return; }
    if (!editingMethodId) return;
    try {
      await ds.updatePaymentMethod(String(editingMethodId), {
        name: paymentMethodForm.name.trim(),
        description: (paymentMethodForm.description || "").trim(),
        isActive: paymentMethodForm.isActive,
      });
      setShowPaymentMethodModal(false);
      setPaymentMethodForm({ name: "", description: "", isActive: true });
      setEditingMethodId(null);
      setPaymentMethodFormErr("");
      loadPaymentMethods();
    } catch (ex) {
      setPaymentMethodFormErr(ex?.response?.data?.message || "Failed to update payment method");
    }
  };

  const openDeletePaymentMethod = (id) => {
    setDeleteTarget(id);
    setDeleteReason("");
    setDeleteType("payment_method");
  };

  const handleDeletePaymentMethod = async () => {
    if (deleteType !== "payment_method") return;
    try {
      await ds.deletePaymentMethod(deleteTarget);
      setDeleteTarget(null);
      setDeleteReason("");
      setDeleteType("");
      loadPaymentMethods();
    } catch { /* silent */ }
  };

  const handleDeleteConfirm = () => {
    if (deleteType === "member") handleDeleteMember();
    else if (deleteType === "subscription") handleDeleteSubscription();
    else if (deleteType === "invoice") handleDeleteInvoice();
    else if (deleteType === "payment_method") handleDeletePaymentMethod();
  };

  const cards = stats
    ? [
      { label: "Total Members", value: stats.totalMembers ?? 0 },
      { label: "Active Members", value: stats.activeMembers ?? 0 },
      { label: "Inactive Members", value: stats.inactiveMembers ?? 0 },
      { label: "Paid Members", value: stats.paidMembers ?? 0 },
      { label: "Unpaid Members", value: stats.unpaidMembers ?? 0 },
      { label: "Total Revenue", value: `$${stats.totalRevenue ?? 0}` },
    ]
    : [];

  const renderContent = () => {
    switch (activeItem) {
      case "Dashboard":
        return (
          <>
            <DashboardCards cards={cards} />
            <div className="sa-panel sa-revenue-chart-panel">
              <h3 className="sa-panel-title">Organization Revenue Over Time</h3>
              <p className="sa-revenue-chart-subtitle">Revenue from Paid invoices only</p>
              <RevenueChart data={revenueByMonth} />
            </div>
          </>
        );

      case "Members":
        return (
          <MembersTable
            title="Members"
            addLabel="+ Add Member"
            rows={members}
            showAddButton
            onAdd={() => { resetMemberForm(); setShowMemberModal(true); }}
            onView={(row) => {
              setViewMember(row);
              setShowMemberDetailsModal(true);
            }}
            onEdit={handleEditMember}
            onSoftDelete={openDeleteMember}
            loading={membersLoading}
          />
        );

      case "Subscriptions":
        return (
          <SubscriptionsTable
            title="Subscription Plans"
            addLabel="+ Add Plan"
            rows={subscriptions}
            showAddButton
            onAdd={() => { setSubscriptionForm({ planName: "", amount: "", duration: "", description: "" }); setEditingPlanId(null); setShowSubscriptionModal(true); }}
            onEdit={handleEditSubscription}
            onSoftDelete={openDeleteSubscription}
            loading={subscriptionsLoading}
          />
        );

      case "Payment Methods":
        return (
          <div className="sa-panel">
            <div className="sa-panel-header">
              <h3 className="sa-panel-title">Payment Methods</h3>
              <button 
                type="button"
                className="sa-btn sa-btn-primary"
                onClick={() => { setPaymentMethodForm({ name: "", description: "", isActive: true }); setEditingMethodId(null); setShowPaymentMethodModal(true); }}
              >
                + Add Payment Method
              </button>
            </div>

            <div className="sa-table-wrapper">
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Method Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentMethodsLoading && (
                    <tr>
                      <td colSpan="4" className="sa-table-empty">
                        Loading...
                      </td>
                    </tr>
                  )}

                  {!paymentMethodsLoading && paymentMethods.length === 0 && (
                    <tr>
                      <td colSpan="4" className="sa-table-empty">
                        No payment methods found
                      </td>
                    </tr>
                  )}

                  {!paymentMethodsLoading && paymentMethods.map((method) => (
                    <tr key={method._id}>
                      <td>{method.name}</td>
                      <td>{method.description || "—"}</td>
                      <td>
                        <span className={`sa-badge ${method.isActive ? "sa-badge-active" : "sa-badge-inactive"}`}>
                          {method.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="sa-table-actions">
                          <button 
                            type="button"
                            className="sa-btn sa-btn-outline sa-btn-sm"
                            onClick={() => handleEditPaymentMethod(method._id)}
                            title="Edit payment method"
                            aria-label="Edit payment method"
                          >
                            <FiEdit2 />
                          </button>
                          <button 
                            type="button"
                            className="sa-btn sa-btn-danger sa-btn-sm"
                            onClick={() => openDeletePaymentMethod(method._id)}
                            title="Delete payment method"
                            aria-label="Delete payment method"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Invoices":
        return (
          <InvoicesTable
            title="Invoices"
            addLabel="+ Create Invoice"
            rows={invoices}
            showAddButton
            onAdd={() => { setInvoiceForm({ memberId: "", subscriptionPlanId: "", date: new Date().toISOString().slice(0, 10), status: "Unpaid" }); setEditingInvoiceId(null); setShowInvoiceModal(true); }}
            onEdit={handleEditInvoice}
            onToggleStatus={handleToggleInvoiceStatus}
            onSoftDelete={openDeleteInvoice}
            paymentMethods={paymentMethods}
            loading={invoicesLoading}
          />
        );

      case "Reports":
        return (
          <ReportsSection
            stats={stats}
            members={members}
            invoices={invoices}
            loading={membersLoading || invoicesLoading}
          />
        );

      case "Account":
        return <AccountSection />;

      default:
        return null;
    }
  };

  const isMemberEdit = Boolean(editingMemberId);
  const isSubscriptionEdit = Boolean(editingPlanId);
  const isInvoiceEdit = Boolean(editingInvoiceId);

  return (
    <MainLayout
      menuItems={MENU}
      activeItem={activeItem}
      onMenuSelect={handleMenu}
      title={activeItem}
      role={user?.role || "admin"}
      onLogout={() => setShowLogout(true)}
    >
      {renderContent()}

      {/* Member Details Modal */}
      <MemberDetailsModal
        open={showMemberDetailsModal}
        member={viewMember}
        memberInvoices={
          viewMember
            ? (invoices || []).filter(
              (inv) =>
                inv.isDeleted !== true &&
                String(inv.memberId?._id ?? inv.memberId ?? "") === String(viewMember._id ?? viewMember.userId ?? "")
            )
            : []
        }
        paymentMethods={paymentMethods}
        onClose={() => {
          setShowMemberDetailsModal(false);
          setViewMember(null);
        }}
        onAddInvoice={(member) => {
          setInvoiceForm({
            memberId: String(member._id ?? member.userId ?? ""),
            subscriptionPlanId: "",
            date: new Date().toISOString().slice(0, 10),
            status: "Unpaid",
          });
          setEditingInvoiceId(null);
          setInvoiceFormErr("");
          setShowInvoiceModal(true);
        }}
        onEditInvoice={handleEditInvoice}
        onDeleteInvoice={openDeleteInvoice}
        onToggleInvoiceStatus={handleToggleInvoiceStatus}
      />

      {/* Member Modal */}
      {/* <DashboardModal
        open={showMemberModal}
        title={isMemberEdit ? "Edit Member" : "Add New Member"}
        onClose={() => { setShowMemberModal(false); resetMemberForm(); }}
      >
        <form className="sa-form" onSubmit={isMemberEdit ? handleUpdateMember : handleCreateMember}>
          <div className="sa-form-field">
            <label className="sa-form-label">Name</label>
            <input
              className="sa-form-input"
              value={memberForm.name}
              onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
              required
            />
          </div>
          <div className="sa-form-field">
            <label className="sa-form-label">Email</label>
            <input
              className="sa-form-input"
              type="email"
              value={memberForm.email}
              onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
              required
            />
          </div>
          <div className="sa-form-field">
            <label className="sa-form-label">Password {isMemberEdit && "(leave blank to keep)"}</label>
            <div className="sa-form-pw-wrap">
              <input
                className="sa-form-input"
                type={showMemberPw ? "text" : "password"}
                value={memberForm.password}
                onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                required={!isMemberEdit}
                placeholder={isMemberEdit ? "Leave blank to keep" : ""}
              />
              <button
                type="button"
                className="sa-form-pw-toggle"
                onClick={() => setShowMemberPw((v) => !v)}
              >
                {showMemberPw ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <div className="sa-form-field">
            <label className="sa-form-label">Phone</label>
            <input
              className="sa-form-input"
              value={memberForm.mobile}
              onChange={(e) => setMemberForm({ ...memberForm, mobile: sanitizePhone(e.target.value) })}
              inputMode="numeric"
            />
          </div>
          <div className="sa-form-field">
            <label className="sa-form-label">Subscription Plan</label>
            <select
              className="sa-form-input"
              value={memberForm.subscriptionPlanId}
              onChange={(e) => setMemberForm({ ...memberForm, subscriptionPlanId: e.target.value })}
            >
              <option value="">— Select Plan —</option>
              {(subscriptions || []).map((p) => (
                <option key={String(p._id || "")} value={String(p._id || "")}>
                  {p.planName} – ${p.amount ?? 0} – {p.duration ?? 0} Month(s)
                </option>
              ))}
            </select>
          </div>
          {memberForm.subscriptionPlanId && (
            <div className="sa-form-field">
              <label className="sa-form-label">Start Date</label>
              <input
                className="sa-form-input"
                type="date"
                value={memberForm.startDate}
                onChange={(e) => setMemberForm({ ...memberForm, startDate: e.target.value })}
              />
            </div>
          )}
          <div className="sa-form-field">
            <label className="sa-form-label">Payment Status</label>
            <select
              className="sa-form-input"
              value={memberForm.paymentStatus}
              onChange={(e) => setMemberForm({ ...memberForm, paymentStatus: e.target.value })}
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          {memberFormErr && <p className="sa-form-error">{memberFormErr}</p>}
          <div className="sa-form-actions">
            <button type="submit" className="sa-btn sa-btn-primary">
              {isMemberEdit ? "Update Member" : "Create Member"}
            </button>
            <button type="button" className="sa-btn sa-btn-outline" onClick={() => setShowMemberModal(false)}>
              Cancel
            </button>
          </div>
        </form>
      </DashboardModal> */}
      <DashboardModal
        open={showMemberModal}
        title={isMemberEdit ? "Edit Member" : "Add New Member"}
        onClose={() => { setShowMemberModal(false); resetMemberForm(); }}
        size="form"
      >
        <form className="sa-form" onSubmit={isMemberEdit ? handleUpdateMember : handleCreateMember}>
          <div className="sa-form-row">
            <div className="sa-form-field">
              <label className="sa-form-label">Name</label>
              <input className="sa-form-input" value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} required />
            </div>
            <div className="sa-form-field">
              <label className="sa-form-label">Email</label>
              <input className="sa-form-input" type="email" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} required />
            </div>
          </div>

          <div className="sa-form-row">
            {!isMemberEdit && (
              <div className="sa-form-field">
                <label className="sa-form-label">Password</label>
                <div className="sa-form-pw-wrap">
                  <input className="sa-form-input" type={showMemberPw ? "text" : "password"} value={memberForm.password} onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })} required />
                  <button type="button" className="sa-form-pw-toggle" onClick={() => setShowMemberPw((v) => !v)}>{showMemberPw ? <FiEyeOff /> : <FiEye />}</button>
                </div>
              </div>
            )}
            <div className="sa-form-field">
              <label className="sa-form-label">Phone</label>
              <PhoneInput
                value={memberForm.mobile}
                dialCode={memberForm.mobileDial}
                onChange={(digits, dial) =>
                  setMemberForm({ ...memberForm, mobile: digits, mobileDial: dial })
                }
                placeholder="Enter phone number"
                id="memberForm-mobile"
              />
            </div>
          </div>

          <div className="sa-form-row">
            {/* <div className="sa-form-field">
              <label className="sa-form-label">Company Name</label>
              <input className="sa-form-input" value={memberForm.companyName} onChange={(e) => setMemberForm({ ...memberForm, companyName: e.target.value })} placeholder="Optional" />
            </div> */}
            {!isMemberEdit && (
              <div className="sa-form-field">
                <label className="sa-form-label">Subscription Plan</label>
                <select className="sa-form-input" value={memberForm.subscriptionPlanId} onChange={(e) => setMemberForm({ ...memberForm, subscriptionPlanId: e.target.value })}>
                  <option value="">— Select Plan —</option>
                  {(subscriptions || []).map((p) => (
                    <option key={String(p._id || "")} value={String(p._id || "")}>{p.planName} – ${p.amount ?? 0} – {p.duration ?? 0} Month(s)</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {memberForm.subscriptionPlanId && (
            <div className="sa-form-row">
              <div className="sa-form-field">
                <label className="sa-form-label">Start Date</label>
                <DatePicker value={memberForm.startDate} onChange={(v) => setMemberForm({ ...memberForm, startDate: v })} placeholder="Select start date" />
              </div>
              {isMemberEdit && (
                <div className="sa-form-field">
                  <label className="sa-form-label">Member Status</label>
                  <select className="sa-form-input" value={memberForm.isActive ? "Active" : "Inactive"} onChange={handleStatusDropdownChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {isMemberEdit && !memberForm.subscriptionPlanId && (
            <div className="sa-form-row">
              <div className="sa-form-field">
                <label className="sa-form-label">Member Status</label>
                <select className="sa-form-input" value={memberForm.isActive ? "Active" : "Inactive"} onChange={handleStatusDropdownChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}

          {memberFormErr && <p className="sa-form-error">{memberFormErr}</p>}

          <div className="sa-form-actions">
            <button type="button" className="sa-btn sa-btn-outline" onClick={() => setShowMemberModal(false)}>Cancel</button>
            {isMemberEdit ? (
              <button type="button" className="sa-btn sa-btn-primary" onClick={handleUpdateMember}>Update Member</button>
            ) : (
              <button type="submit" className="sa-btn sa-btn-primary">Create Member</button>
            )}
          </div>
        </form>
      </DashboardModal>

      {/* Status Change Confirmation */}
      <DashboardModal
        open={showStatusConfirm}
        title="Change Member Status"
        onClose={handleStatusCancel}
      >
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
          Are you sure you want to change this member&apos;s status?
        </p>
        <div className="sa-form-actions">
          <button type="button" className="sa-btn sa-btn-outline" onClick={handleStatusCancel}>
            Cancel
          </button>
          <button type="button" className="sa-btn sa-btn-primary" onClick={handleStatusConfirm}>
            Confirm
          </button>
        </div>
      </DashboardModal>

      {/* Update Member Confirmation */}
      <DashboardModal
        open={showUpdateMemberConfirm}
        title="Confirm Update"
        onClose={handleCancelUpdateMember}
      >
        <div className="sa-confirmation-modal">
          <p className="sa-confirmation-message">
            Are you sure you want to update this member?
          </p>
          <div className="sa-confirmation-actions">
            <button
              type="button"
              className="sa-btn sa-btn-secondary"
              onClick={handleCancelUpdateMember}
            >
              Cancel
            </button>
            <button
              type="button"
              className="sa-btn sa-btn-primary"
              onClick={handleConfirmUpdateMember}
            >
              Yes, Update
            </button>
          </div>
        </div>
      </DashboardModal>

      {/* Subscription Modal */}
      <DashboardModal
        open={showSubscriptionModal}
        title={isSubscriptionEdit ? "Edit Subscription Plan" : "Add Subscription Plan"}
        onClose={() => { setShowSubscriptionModal(false); setEditingPlanId(null); }}
        size="form"
      >
        <form className="sa-form" onSubmit={isSubscriptionEdit ? handleUpdateSubscription : handleCreateSubscription}>
          <div className="sa-form-row">
            <div className="sa-form-field">
              <label className="sa-form-label">Plan Name</label>
              <input
                className="sa-form-input"
                value={subscriptionForm.planName}
                onChange={(e) => setSubscriptionForm({ ...subscriptionForm, planName: e.target.value })}
                placeholder="e.g. Monthly"
                required
              />
            </div>
            <div className="sa-form-field">
              <label className="sa-form-label">Amount</label>
              <input
                className="sa-form-input"
                type="number"
                min="0"
                step="0.01"
                value={subscriptionForm.amount}
                onChange={(e) => setSubscriptionForm({ ...subscriptionForm, amount: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="sa-form-row">
            <div className="sa-form-field">
              <label className="sa-form-label">Duration (Months)</label>
              <input
                className="sa-form-input"
                type="number"
                min="1"
                value={subscriptionForm.duration}
                onChange={(e) => setSubscriptionForm({ ...subscriptionForm, duration: e.target.value })}
                required
              />
            </div>
            <div className="sa-form-field">
              <label className="sa-form-label">Description</label>
              <textarea
                className="sa-form-textarea"
                value={subscriptionForm.description}
                onChange={(e) => setSubscriptionForm({ ...subscriptionForm, description: e.target.value })}
                placeholder="Optional"
                rows={3}
              />
            </div>
          </div>
          {subscriptionFormErr && <p className="sa-form-error">{subscriptionFormErr}</p>}
          <div className="sa-form-actions">
            <button type="button" className="sa-btn sa-btn-outline" onClick={() => setShowSubscriptionModal(false)}>
              Cancel
            </button>
            <button type="submit" className="sa-btn sa-btn-primary">
              {isSubscriptionEdit ? "Update Plan" : "Create Plan"}
            </button>

          </div>
        </form>
      </DashboardModal>

      {/* Invoice Modal */}
      <DashboardModal
        open={showInvoiceModal}
        title={isInvoiceEdit ? "Edit Invoice" : "Create Invoice"}
        onClose={() => { setShowInvoiceModal(false); setEditingInvoiceId(null); }}
        size="form"
      >
        <form className="sa-form" onSubmit={isInvoiceEdit ? handleUpdateInvoice : handleCreateInvoice}>
          <div className="sa-form-row">
            <div className="sa-form-field">
              <label className="sa-form-label">Member</label>
              <select
                className="sa-form-input"
                value={invoiceForm.memberId}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, memberId: e.target.value })}
                required
              >
                <option value="">— Select Member —</option>
                {(members || []).filter((m) => m.isActive !== false).map((m) => (
                  <option key={String(m._id || m.userId || "")} value={String(m._id || m.userId || "")}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="sa-form-field">
              <label className="sa-form-label">Subscription Plan</label>
              <select
                className="sa-form-input"
                value={invoiceForm.subscriptionPlanId}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, subscriptionPlanId: e.target.value })}
                required
              >
                <option value="">— Select Plan —</option>
                {(subscriptions || []).map((p) => (
                  <option key={String(p._id || "")} value={String(p._id || "")}>
                    {p.planName} – ${p.amount ?? 0}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {invoiceForm.subscriptionPlanId && (
            <div className="sa-form-row">
              <div className="sa-form-field">
                <label className="sa-form-label">Amount (from plan)</label>
                <div
                  className="sa-form-input"
                  style={{ background: "#f8fafc", cursor: "default", color: "#0f172a" }}
                >
                  $
                  {(subscriptions || []).find((p) => String(p._id || "") === String(invoiceForm.subscriptionPlanId))
                    ?.amount ?? 0}
                </div>
              </div>
              <div className="sa-form-field">
                <label className="sa-form-label">Invoice Date</label>
                <DatePicker
                  value={invoiceForm.date}
                  onChange={(v) => setInvoiceForm({ ...invoiceForm, date: v })}
                  placeholder="Select invoice date"
                />
              </div>
            </div>
          )}
          {!invoiceForm.subscriptionPlanId && (
            <div className="sa-form-row">
              <div className="sa-form-field">
                <label className="sa-form-label">Invoice Date</label>
                <DatePicker
                  value={invoiceForm.date}
                  onChange={(v) => setInvoiceForm({ ...invoiceForm, date: v })}
                  placeholder="Select invoice date"
                />
              </div>
              <div className="sa-form-field">
                <label className="sa-form-label">Status</label>
                <select
                  className="sa-form-input"
                  value={invoiceForm.status}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, status: e.target.value })}
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>
          )}
          {invoiceForm.subscriptionPlanId && (
            <div className="sa-form-row">
              <div className="sa-form-field">
                <label className="sa-form-label">Status</label>
                <select
                  className="sa-form-input"
                  value={invoiceForm.status}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, status: e.target.value })}
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>
          )}
          {invoiceFormErr && <p className="sa-form-error">{invoiceFormErr}</p>}
          <div className="sa-form-actions">
            <button type="button" className="sa-btn sa-btn-outline" onClick={() => setShowInvoiceModal(false)}>
              Cancel
            </button>
            <button type="submit" className="sa-btn sa-btn-primary">
              {isInvoiceEdit ? "Update Invoice" : "Create Invoice"}
            </button>

          </div>
        </form>
      </DashboardModal>

      {/* Soft Delete Modal */}
      <DashboardModal
        open={deleteTarget !== null}
        title="Delete"
        onClose={() => { setDeleteTarget(null); setDeleteReason(""); setDeleteType(""); }}
        size="form"
      >
        <div className="sa-form">
          <p style={{ color: "#64748b", fontSize: 14 }}>
            {deleteType === "member"
              ? "Enter reason for deletion. This will soft delete the member and all their invoices."
              : "Enter reason for deletion. This will soft delete the record."}
          </p>
          <div className="sa-form-field">
            <label className="sa-form-label">Reason</label>
            <textarea
              className="sa-form-textarea"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Enter deletion reason..."
            />
          </div>
          <div className="sa-form-actions">
            <button
              type="button"
              className="sa-btn sa-btn-outline"
              onClick={() => { setDeleteTarget(null); setDeleteReason(""); setDeleteType(""); }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="sa-btn sa-btn-danger"
              onClick={handleDeleteConfirm}
              disabled={deleteType !== "subscription" && !deleteReason?.trim()}
            >
              Confirm Delete
            </button>

          </div>
        </div>
      </DashboardModal>

      {/* Logout Modal */}
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

      {/* Payment Method Modal */}
      <DashboardModal
        open={showPaymentMethodModal}
        title={editingMethodId ? "Edit Payment Method" : "Add Payment Method"}
        onClose={() => { setShowPaymentMethodModal(false); setEditingMethodId(null); }}
        size="form"
      >
        <form className="sa-form" onSubmit={editingMethodId ? handleUpdatePaymentMethod : handleCreatePaymentMethod}>
          <div className="sa-form-field">
            <label className="sa-form-label">Payment Method Name *</label>
            <input
              className="sa-form-input"
              type="text"
              value={paymentMethodForm.name}
              onChange={(e) => setPaymentMethodForm({ ...paymentMethodForm, name: e.target.value })}
              placeholder="e.g., UPI, Bank Transfer, Cash"
              required
            />
          </div>

          <div className="sa-form-field">
            <label className="sa-form-label">Description (Optional)</label>
            <textarea
              className="sa-form-textarea"
              value={paymentMethodForm.description}
              onChange={(e) => setPaymentMethodForm({ ...paymentMethodForm, description: e.target.value })}
              placeholder="e.g., Details about this payment method"
              rows="3"
            />
          </div>

          <div className="sa-form-field">
  <label className="sa-form-label">Status</label>
  <select
    className="sa-form-select"
    value={paymentMethodForm.isActive ? "active" : "inactive"}
    onChange={(e) =>
      setPaymentMethodForm({
        ...paymentMethodForm,
        isActive: e.target.value === "active",
      })
    }
  >
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>
</div>

          {/* <div className="sa-form-field">
            <label className="sa-checkbox-label">
              <input
                type="checkbox"
                className="sa-checkbox-input"
                checked={paymentMethodForm.isActive}
                onChange={(e) => setPaymentMethodForm({ ...paymentMethodForm, isActive: e.target.checked })}
              />
              <span>Active</span>
            </label>
          </div> */}

          {paymentMethodFormErr && (
            <p className="sa-form-error">{paymentMethodFormErr}</p>
          )}

          <div className="sa-form-actions">
            <button type="button" className="sa-btn sa-btn-outline" onClick={() => setShowPaymentMethodModal(false)}>
              Cancel
            </button>
            <button type="submit" className="sa-btn sa-btn-primary">
              {editingMethodId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </DashboardModal>
    </MainLayout>
  );
};

export default AdminDashboard;
