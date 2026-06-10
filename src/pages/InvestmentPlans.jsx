import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import {
  FaCheckCircle, FaTimesCircle, FaClock, FaTrash, FaSearch,
  FaSyncAlt, FaExclamationTriangle, FaMoneyBillWave, FaChartLine,
  FaCog, FaPlus, FaTimes, FaDollarSign, FaPercent,
  FaWallet,
} from "react-icons/fa";

/* ─────────────────────────────────────────
   SHARED PLANS DATA
───────────────────────────────────────── */
const INVESTMENT_PLANS = [
  { name: "Trial Plan",     icon: "🌱", min: 500,    max: 5000,    duration: "3 Days",   minReturn: "15%",    maxReturn: "20%"    },
  { name: "Essential Plan", icon: "🛡️", min: 5000,   max: 10000,   duration: "14 Days",  minReturn: "30%",    maxReturn: "35%"    },
  { name: "Premium Plan",   icon: "✨", min: 10000,  max: 50000,   duration: "30 Days",  minReturn: "60%",    maxReturn: "65%"    },
  { name: "Ultimate Plan",  icon: "🔥", min: 50000,  max: 250000,  duration: "60 Days",  minReturn: "290%",   maxReturn: "300%"   },
  { name: "Royal Plan",     icon: "👑", min: 250000, max: 500000,  duration: "90 Days",  minReturn: "550%",   maxReturn: "600%"   },
  { name: "Diamond Plan",   icon: "💎", min: 500000, max: 2000000, duration: "120 Days", minReturn: "1,450%", maxReturn: "1,500%" },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const fmt = (n) =>
  Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const resolveStatus = (inv) => {
  if (inv.status && ["Approved", "Declined", "Pending"].includes(inv.status)) {
    return inv.status;
  }
  if (inv.approved) return "Approved";
  if (inv.status === "Declined") return "Declined";
  return "Pending";
};

const resolveInvestorName = (inv) => {
  if (inv.investor_name && inv.investor_name.trim()) return inv.investor_name.trim();
  if (inv.user) {
    const u = inv.user;
    if (u.first_name || u.last_name) return `${u.first_name || ""} ${u.last_name || ""}`.trim();
    if (u.full_name) return u.full_name.trim();
    if (u.username)  return u.username.trim();
    if (u.email)     return u.email.trim();
  }
  if (inv.investor?.name) return inv.investor.name.trim();
  return inv.investor_email || "Unknown Investor";
};

const resolveInvestorEmail = (inv) => {
  if (inv.investor_email) return inv.investor_email;
  if (inv.user?.email)    return inv.user.email;
  return "";
};

const statusStyle = {
  Pending:  "bg-amber-400/10 text-amber-400 border-amber-400/25",
  Approved: "bg-emerald-400/10 text-emerald-400 border-emerald-400/25",
  Declined: "bg-red-400/10 text-red-400 border-red-400/25",
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md border font-semibold ${statusStyle[status] || statusStyle.Pending}`}>
    {status === "Approved" && <FaCheckCircle className="text-[9px]" />}
    {status === "Declined" && <FaTimesCircle className="text-[9px]" />}
    {status === "Pending"  && <FaClock       className="text-[9px]" />}
    {status}
  </span>
);

/* ─────────────────────────────────────────
   CONFIRM MODAL
───────────────────────────────────────── */
function ConfirmModal({ open, title, message, confirmLabel, confirmClass, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#141212] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center shrink-0">
            <FaExclamationTriangle className="text-[#c45a45] text-sm" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">{title}</p>
            <p className="text-white/40 text-xs mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={onCancel} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${confirmClass}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ADD PROFIT MODAL
───────────────────────────────────────── */
function ProfitModal({ open, investment, onClose, onSuccess }) {
  const [mode,    setMode]    = useState("fixed");
  const [value,   setValue]   = useState("");
  const [loading, setLoading] = useState(false);

  if (!open || !investment) return null;

  const computed =
    mode === "percent"
      ? ((parseFloat(value || 0) / 100) * parseFloat(investment.amount)).toFixed(2)
      : parseFloat(value || 0).toFixed(2);

  const handleSubmit = async () => {
    const profit = parseFloat(computed);
    if (!profit || profit <= 0) { alert("Enter a valid profit amount."); return; }
    setLoading(true);
    try {
      await API.post(`investments/${investment.id}/add_profit/`, { profit });
      onSuccess(`Profit of $${fmt(profit)} added to ${resolveInvestorName(investment)}.`);
      setValue("");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add profit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#141212] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
              <FaMoneyBillWave className="text-emerald-400 text-sm" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Add Profit</p>
              <p className="text-white/30 text-[11px]">{investment.plan || investment.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <FaTimes className="text-xs" />
          </button>
        </div>

        <div className="bg-white/3 border border-white/6 rounded-xl p-3.5 space-y-2 text-xs">
          {[
            { label: "Investor",       value: resolveInvestorName(investment) },
            { label: "Plan",           value: investment.plan || investment.category || "—" },
            { label: "Amount",         value: `$${fmt(investment.amount)}` },
            { label: "Status",         value: <StatusBadge status={resolveStatus(investment)} /> },
            { label: "Current Profit", value: <span className="text-emerald-400 font-bold">${fmt(investment.current_profit || 0)}</span> },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-white/30">{label}</span>
              <span className="text-white font-medium">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {[
            { key: "fixed",   label: "Fixed ($)",      icon: <FaDollarSign className="text-[10px]" /> },
            { key: "percent", label: "Percentage (%)", icon: <FaPercent    className="text-[10px]" /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => { setMode(key); setValue(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                mode === key
                  ? "bg-[#c45a45]/15 border-[#c45a45]/35 text-white"
                  : "bg-white/3 border-white/8 text-white/40 hover:border-white/15"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-1.5">
            {mode === "fixed" ? "Profit Amount (USD)" : "Profit Percentage (%)"}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs font-bold">
              {mode === "fixed" ? "$" : "%"}
            </span>
            <input
              type="number" min="0" step="0.01"
              placeholder={mode === "fixed" ? "e.g. 250.00" : "e.g. 25"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-[#0f0e0e] border border-white/10 rounded-xl pl-7 pr-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c45a45]/50 transition-colors"
            />
          </div>
          {mode === "percent" && value && (
            <p className="text-emerald-400 text-[11px] mt-1.5">
              ≈ <strong>${fmt(computed)}</strong> profit on ${fmt(investment.amount)} investment
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white/50 hover:bg-white/8 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !value}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <FaPlus className="text-[9px]" />
            {loading ? "Adding…" : `Add $${fmt(computed)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ADMIN — MANAGE PLAN INVESTMENTS
───────────────────────────────────────── */
function AdminManagePlans() {
  const [investments,   setInvestments]   = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [filterStatus,  setFilterStatus]  = useState("All");
  const [filterPlan,    setFilterPlan]    = useState("All");
  const [actionLoading, setActionLoading] = useState(null);
  const [toast,         setToast]         = useState(null);
  const [profitModal,   setProfitModal]   = useState({ open: false, investment: null });
  const [confirmModal,  setConfirmModal]  = useState({ open: false, type: null, investment: null });

  useEffect(() => { fetchInvestments(); }, []);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const res = await API.get("investments/?type=plan");
      setInvestments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApprove = async (inv) => {
    setActionLoading(`approve-${inv.id}`);
    try {
      await API.patch(`investments/${inv.id}/`, { approved: true, active: true, status: "Approved" });
      setInvestments((prev) =>
        prev.map((i) => i.id === inv.id ? { ...i, approved: true, active: true, status: "Approved" } : i)
      );
      showToast(`Investment by ${resolveInvestorName(inv)} approved.`);
    } catch (err) {
      showToast(err.response?.data?.detail || "Approval failed.", "error");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, investment: null });
    }
  };

  const handleDecline = async (inv) => {
    setActionLoading(`decline-${inv.id}`);
    try {
      await API.patch(`investments/${inv.id}/`, { approved: false, active: false, status: "Declined" });
      setInvestments((prev) =>
        prev.map((i) => i.id === inv.id ? { ...i, approved: false, active: false, status: "Declined" } : i)
      );
      showToast("Investment declined. Amount refunded to investor wallet.", "error");
    } catch (err) {
      showToast(err.response?.data?.detail || "Decline failed.", "error");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, investment: null });
    }
  };

  const handleDelete = async (inv) => {
    setActionLoading(`delete-${inv.id}`);
    try {
      await API.delete(`investments/${inv.id}/`);
      setInvestments((prev) => prev.filter((i) => i.id !== inv.id));
      showToast("Investment record deleted.", "error");
    } catch (err) {
      showToast(err.response?.data?.detail || "Delete failed.", "error");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, investment: null });
    }
  };

  const openConfirm   = (type, investment) => setConfirmModal({ open: true, type, investment });
  const handleConfirm = () => {
    const { type, investment } = confirmModal;
    if (type === "approve") handleApprove(investment);
    else if (type === "decline") handleDecline(investment);
    else if (type === "delete")  handleDelete(investment);
  };

  const filtered = investments.filter((inv) => {
    const name     = resolveInvestorName(inv).toLowerCase();
    const email    = resolveInvestorEmail(inv).toLowerCase();
    const planName = (inv.plan || inv.category || "").toLowerCase();

    const matchSearch =
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      planName.includes(search.toLowerCase());

    const status = resolveStatus(inv);
    const matchStatus = filterStatus === "All" || status === filterStatus;
    const matchPlan   = filterPlan === "All" || (inv.plan || inv.category || "").includes(filterPlan);

    return matchSearch && matchStatus && matchPlan;
  });

  const totals = {
    all:      investments.length,
    pending:  investments.filter((i) => resolveStatus(i) === "Pending").length,
    approved: investments.filter((i) => resolveStatus(i) === "Approved").length,
    declined: investments.filter((i) => resolveStatus(i) === "Declined").length,
    volume:   investments
                .filter((i) => resolveStatus(i) === "Approved")
                .reduce((s, i) => s + parseFloat(i.amount || 0), 0),
  };

  const confirmConfig = {
    approve: {
      title: "Approve Investment",
      message: "This will activate the plan and start profit accumulation for this investor.",
      confirmLabel: "Approve",
      confirmClass: "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25",
    },
    decline: {
      title: "Decline Investment",
      message: "This will reject the investment request and refund the amount back to the investor's wallet.",
      confirmLabel: "Decline",
      confirmClass: "bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25",
    },
    delete: {
      title: "Delete Record",
      message: "This permanently removes the investment record. This cannot be undone.",
      confirmLabel: "Delete",
      confirmClass: "bg-red-500 hover:bg-red-600 text-white",
    },
  };

  const planIcon = (name) =>
    INVESTMENT_PLANS.find((p) => (name || "").includes(p.name.split(" ")[0]))?.icon || "📋";

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl ${
          toast.type === "error"
            ? "bg-red-500/10 border-red-500/25 text-red-400"
            : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
        }`}>
          {toast.type === "error" ? <FaTimesCircle /> : <FaCheckCircle />}
          {toast.msg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total",    value: totals.all,               icon: <FaChartLine />,     accent: false },
          { label: "Pending",  value: totals.pending,           icon: <FaClock />,         accent: false, highlight: "text-amber-400" },
          { label: "Approved", value: totals.approved,          icon: <FaCheckCircle />,   accent: false, highlight: "text-emerald-400" },
          { label: "Declined", value: totals.declined,          icon: <FaTimesCircle />,   accent: false, highlight: "text-red-400" },
          { label: "Volume",   value: `$${fmt(totals.volume)}`, icon: <FaMoneyBillWave />, accent: true },
        ].map((s) => (
          <div key={s.label} className={`bg-[#0f0e0e] border rounded-xl px-4 py-3.5 flex items-center gap-3 ${
            s.accent ? "border-[#c45a45]/20 shadow-[#c45a45]/5 shadow-lg" : "border-white/[0.07]"
          }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 ${
              s.accent ? "bg-[#c45a45]/15 border border-[#c45a45]/25 text-[#c45a45]" : "bg-white/5 border border-white/8 text-white/30"
            }`}>{s.icon}</div>
            <div>
              <p className={`text-sm font-bold leading-none ${s.highlight || "text-white"}`}>{s.value}</p>
              <p className="text-white/25 text-[10px] mt-0.5 uppercase tracking-wide">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-xs" />
          <input
            type="text"
            placeholder="Search investor or plan…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f0e0e] border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c45a45]/40 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "Approved", "Declined"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                filterStatus === f
                  ? "bg-[#c45a45]/15 border-[#c45a45]/35 text-white"
                  : "bg-transparent border-white/10 text-white/35 hover:text-white/60 hover:border-white/20"
              }`}
            >
              {f}
              {f !== "All" && (
                <span className="ml-1.5 text-[9px] opacity-60">
                  ({f === "Pending" ? totals.pending : f === "Approved" ? totals.approved : totals.declined})
                </span>
              )}
            </button>
          ))}
        </div>
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          className="bg-[#0f0e0e] border border-white/10 rounded-xl px-3 py-2 text-white/60 text-xs focus:outline-none focus:border-[#c45a45]/40 transition-colors"
        >
          <option value="All">All Plans</option>
          {INVESTMENT_PLANS.map((p) => (
            <option key={p.name} value={p.name.split(" ")[0]}>{p.name}</option>
          ))}
        </select>
        <button
          onClick={fetchInvestments}
          className="md:ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/8 text-xs font-medium transition-colors self-start"
        >
          <FaSyncAlt className={`text-[10px] ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0f0e0e] border border-white/[0.07] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#c45a45]/30 border-t-[#c45a45] animate-spin" />
            <p className="text-white/25 text-sm">Loading investments…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-4xl opacity-20">💎</span>
            <p className="text-white/25 text-sm">No plan investments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/25 text-[10px] uppercase tracking-widest font-semibold">
                  <th className="px-5 py-3.5 text-left">Investor</th>
                  <th className="px-5 py-3.5 text-left">Plan</th>
                  <th className="px-5 py-3.5 text-right">Amount</th>
                  <th className="px-5 py-3.5 text-right">Profit</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-center">Date</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => {
                  const isLoading = (k) => actionLoading === `${k}-${inv.id}`;
                  const status   = resolveStatus(inv);
                  const planName = inv.plan || inv.category || "—";
                  return (
                    <tr key={inv.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-white text-xs font-semibold">{resolveInvestorName(inv)}</p>
                        {resolveInvestorEmail(inv) && (
                          <p className="text-white/25 text-[10px] mt-0.5">{resolveInvestorEmail(inv)}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-sm">
                            {planIcon(planName)}
                          </span>
                          <div>
                            <p className="text-white text-xs font-medium">{planName}</p>
                            <p className="text-white/25 text-[10px]">Investment Plan</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="text-white text-xs font-bold">${fmt(inv.amount)}</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="text-emerald-400 text-xs font-bold">${fmt(inv.current_profit || 0)}</p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-5 py-4 text-center text-white/30 text-[11px]">
                        {inv.created_at
                          ? new Date(inv.created_at).toLocaleDateString(undefined, {
                              month: "short", day: "numeric", year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {status !== "Approved" && (
                            <button
                              onClick={() => openConfirm("approve", inv)}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/20 text-[10px] font-semibold disabled:opacity-40 transition-colors"
                            >
                              {isLoading("approve") ? <FaSyncAlt className="animate-spin text-[9px]" /> : <FaCheckCircle className="text-[9px]" />}
                              Approve
                            </button>
                          )}
                          {status !== "Declined" && (
                            <button
                              onClick={() => openConfirm("decline", inv)}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 hover:bg-amber-400/20 text-[10px] font-semibold disabled:opacity-40 transition-colors"
                            >
                              {isLoading("decline") ? <FaSyncAlt className="animate-spin text-[9px]" /> : <FaTimesCircle className="text-[9px]" />}
                              Decline
                            </button>
                          )}
                          <button
                            onClick={() => setProfitModal({ open: true, investment: inv })}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#c45a45]/10 border border-[#c45a45]/25 text-[#e07060] hover:bg-[#c45a45]/20 text-[10px] font-semibold disabled:opacity-40 transition-colors"
                          >
                            <FaPlus className="text-[9px]" /> Profit
                          </button>
                          <button
                            onClick={() => openConfirm("delete", inv)}
                            disabled={!!actionLoading}
                            className="w-7 h-7 rounded-lg bg-red-500/8 border border-red-500/15 text-red-400/50 hover:text-red-400 hover:bg-red-500/15 flex items-center justify-center disabled:opacity-40 transition-colors"
                          >
                            {isLoading("delete") ? <FaSyncAlt className="animate-spin text-[9px]" /> : <FaTrash className="text-[9px]" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProfitModal
        open={profitModal.open}
        investment={profitModal.investment}
        onClose={() => setProfitModal({ open: false, investment: null })}
        onSuccess={(msg) => {
          setProfitModal({ open: false, investment: null });
          fetchInvestments();
          showToast(msg);
        }}
      />
      <ConfirmModal
        open={confirmModal.open}
        {...(confirmModal.type ? confirmConfig[confirmModal.type] : {})}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModal({ open: false, type: null, investment: null })}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   SHARED INVEST GRID
───────────────────────────────────────── */
function InvestGrid({ isAdmin = false, walletBalance = 0, onBalanceRefresh }) {
  const navigate    = useNavigate();
  const [amounts,   setAmounts]   = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [toast,     setToast]     = useState(null);

  const borderCol = "border-[#332d2c]";
  const mutedText = "text-[#9e9593]";

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAmountChange = (planName, value) =>
    setAmounts((prev) => ({ ...prev, [planName]: value }));

  const handleInvest = async (plan, e) => {
    e.preventDefault();
    const val = parseFloat(amounts[plan.name] || 0);

    if (!val || val < plan.min || val > plan.max) {
      showToast(
        `Enter a valid amount between $${plan.min.toLocaleString()} and $${plan.max.toLocaleString()}.`,
        "error"
      );
      return;
    }

    // Balance check applies to everyone — admin included
    if (val > walletBalance) {
      showToast(
        `Insufficient balance. Your wallet has $${fmt(walletBalance)} but this investment requires $${fmt(val)}.`,
        "insufficient"
      );
      return;
    }

    setLoadingId(plan.name);
    try {
      await API.post("investments/", {
        amount:   val,
        plan:     plan.name,
        category: plan.name,
        type:     "plan",
      });
      showToast(
        isAdmin
          ? `$${val.toLocaleString()} invested in ${plan.name}.`
          : `$${val.toLocaleString()} invested in ${plan.name}. Pending approval.`
      );
      setAmounts((p) => ({ ...p, [plan.name]: "" }));
      // Refresh balance after successful investment
      if (onBalanceRefresh) onBalanceRefresh();
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.error || "";
      if (detail.toLowerCase().includes("insufficient")) {
        showToast(detail, "insufficient");
      } else {
        showToast(detail || "Failed to submit investment.", "error");
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-start gap-3 px-4 py-3.5 rounded-xl border text-xs font-semibold shadow-2xl max-w-sm ${
          toast.type === "insufficient"
            ? "bg-amber-500/10 border-amber-500/25 text-amber-300"
            : toast.type === "error"
            ? "bg-red-500/10 border-red-500/25 text-red-400"
            : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
        }`}>
          <div className="shrink-0 mt-0.5">
            {toast.type === "insufficient" ? (
              <FaWallet className="text-amber-400" />
            ) : toast.type === "error" ? (
              <FaTimesCircle />
            ) : (
              <FaCheckCircle />
            )}
          </div>
          <div className="flex-1">
            <p className="leading-relaxed">{toast.msg}</p>
            {toast.type === "insufficient" && (
              <button
                onClick={() => navigate("/fund-account")}
                className="mt-2 w-full py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition-colors text-[11px] font-bold flex items-center justify-center gap-1.5"
              >
                <FaWallet className="text-[10px]" /> Fund Account Now
              </button>
            )}
          </div>
          <button
            onClick={() => setToast(null)}
            className="shrink-0 text-white/20 hover:text-white/60 transition-colors"
          >
            <FaTimes className="text-[10px]" />
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {INVESTMENT_PLANS.map((plan) => {
          const enteredAmount = parseFloat(amounts[plan.name] || 0);
          const canAfford     = walletBalance >= plan.min;
          const willAfford    = !enteredAmount || walletBalance >= enteredAmount;

          return (
            <div
              key={plan.name}
              className={`bg-[#211e1e] rounded-xl border ${borderCol} p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-[#c45a45]/40 hover:scale-[1.01] ${!canAfford ? "opacity-60" : ""}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-2 rounded-lg bg-[#171515]/60 border border-[#332d2c]">{plan.icon}</span>
                  <span className="bg-[#c45a45]/10 border border-[#c45a45]/20 text-[#c45a45] px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
                    {plan.duration}
                  </span>
                </div>

                <h3 className="text-xl font-bold tracking-wide mb-4 text-slate-100">{plan.name}</h3>

                <div className="grid grid-cols-2 gap-2 bg-[#171515]/50 border border-[#332d2c]/50 rounded-lg p-3 mb-4">
                  <div>
                    <p className={`text-[10px] uppercase font-semibold tracking-wider ${mutedText}`}>Min. Return</p>
                    <p className="text-emerald-400 font-bold text-sm">{plan.minReturn}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] uppercase font-semibold tracking-wider ${mutedText}`}>Max. Return</p>
                    <p className="text-[#c45a45] font-bold text-sm">{plan.maxReturn}</p>
                  </div>
                </div>

                <div className={`space-y-2 text-sm border-b ${borderCol} pb-4 mb-5`}>
                  <div className="flex justify-between">
                    <span className={mutedText}>Min. Investment:</span>
                    <span className="font-semibold text-slate-200">${plan.min.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={mutedText}>Max. Investment:</span>
                    <span className="font-semibold text-slate-200">${plan.max.toLocaleString()}</span>
                  </div>
                </div>

                {!canAfford && (
                  <div className="mb-4 flex items-center gap-2 bg-amber-500/8 border border-amber-500/20 rounded-lg px-3 py-2">
                    <FaWallet className="text-amber-400 text-[10px] shrink-0" />
                    <p className="text-amber-400/80 text-[10px] leading-relaxed">
                      Need ${plan.min.toLocaleString()} minimum.{" "}
                      <button
                        onClick={() => navigate("/fund-account")}
                        className="underline text-amber-400 font-semibold hover:text-amber-300"
                      >
                        Fund account
                      </button>
                    </p>
                  </div>
                )}
              </div>

              <form onSubmit={(e) => handleInvest(plan, e)} className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`text-xs uppercase tracking-wider ${mutedText}`}>
                      Amount to Invest
                    </label>
                    <span className={`text-[10px] font-semibold ${walletBalance >= (enteredAmount || plan.min) ? "text-emerald-400" : "text-amber-400"}`}>
                      Bal: ${fmt(walletBalance)}
                    </span>
                  </div>
                  <div className="relative">
                    <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold ${mutedText}`}>$</span>
                    <input
                      type="number"
                      placeholder={`${plan.min}`}
                      min={plan.min}
                      max={plan.max}
                      className={`w-full bg-[#171515] border rounded-lg pl-8 pr-4 py-2.5 text-white placeholder-[#5a5352] focus:outline-none text-sm transition-colors ${
                        !willAfford && enteredAmount > 0
                          ? "border-amber-500/40 focus:border-amber-500"
                          : "border-[#332d2c] focus:border-[#c45a45]"
                      }`}
                      value={amounts[plan.name] || ""}
                      onChange={(e) => handleAmountChange(plan.name, e.target.value)}
                      required
                    />
                  </div>
                  {enteredAmount > 0 && enteredAmount > walletBalance && (
                    <p className="text-amber-400 text-[10px] mt-1 flex items-center gap-1">
                      <FaExclamationTriangle className="text-[9px]" />
                      Insufficient balance — need ${fmt(enteredAmount - walletBalance)} more
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loadingId === plan.name || (enteredAmount > walletBalance && enteredAmount > 0)}
                  className="w-full bg-[#a64633] hover:bg-[#c45a45] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-[#c45a45]/10 flex items-center justify-center gap-2"
                >
                  {loadingId === plan.name ? (
                    <><FaSyncAlt className="animate-spin text-xs" /> Submitting…</>
                  ) : enteredAmount > walletBalance && enteredAmount > 0 ? (
                    <><FaWallet className="text-xs" /> Fund Account First</>
                  ) : (
                    "Invest"
                  )}
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   ADMIN WRAPPER — tab-aware
   Now fetches real admin wallet balance
───────────────────────────────────────── */
function AdminPlansView() {
  const navigate = useNavigate();
  const [activeTab,      setActiveTab]      = useState("manage");
  const [walletBalance,  setWalletBalance]  = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);

  const fetchBalance = async () => {
    try {
      const res = await API.get("user-dashboard/");
      setWalletBalance(parseFloat(res.data?.profile?.wallet_balance || 0));
    } catch (err) {
      console.error("Failed to fetch admin wallet balance", err);
    } finally {
      setBalanceLoading(false);
    }
  };

  useEffect(() => { fetchBalance(); }, []);

  const tabs = [
    { key: "manage",  label: "Manage Investments", icon: <FaCog className="text-[11px]" /> },
    { key: "invest",  label: "Invest in Plans",    icon: <FaChartLine className="text-[11px]" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wide text-white">Investment Plans</h1>
          <p className="text-[#9e9593] text-sm mt-1">
            {activeTab === "manage"
              ? "Review, approve, and manage all investor plan submissions."
              : "Deploy capital into any investment tier."}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          {/* Admin wallet balance pill — visible on invest tab */}
          {activeTab === "invest" && (
            <div className="flex items-center gap-2 bg-[#0f0e0e] border border-white/8 rounded-xl px-4 py-2.5 shrink-0">
              <FaWallet className="text-[#c45a45] text-xs shrink-0" />
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider leading-none">Admin Balance</p>
                {balanceLoading ? (
                  <div className="h-4 w-20 bg-white/5 rounded animate-pulse mt-0.5" />
                ) : (
                  <p className="text-white font-bold text-sm leading-none mt-0.5">${fmt(walletBalance)}</p>
                )}
              </div>
              <button
                onClick={() => navigate("/fund-account")}
                className="ml-2 px-2.5 py-1 rounded-lg bg-[#c45a45]/15 border border-[#c45a45]/30 text-[#c45a45] text-[10px] font-bold hover:bg-[#c45a45]/25 transition-colors"
              >
                + Fund
              </button>
            </div>
          )}

          <div className="flex gap-1.5 bg-[#0f0e0e] border border-white/8 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.key
                    ? "bg-[#c45a45]/15 border border-[#c45a45]/30 text-white"
                    : "text-white/35 hover:text-white/60 border border-transparent"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === "manage" ? (
        <AdminManagePlans />
      ) : (
        <div className="space-y-4">
          {/* Low balance warning for admin */}
          {!balanceLoading && walletBalance < 500 && (
            <div className="flex items-center gap-3 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
              <FaWallet className="text-amber-400 shrink-0" />
              <div className="flex-1">
                <p className="text-amber-300 text-xs font-semibold">Your admin wallet balance is low.</p>
                <p className="text-amber-400/60 text-[11px] mt-0.5">Minimum plan investment is $500. Fund your account to get started.</p>
              </div>
              <button
                onClick={() => navigate("/fund-account")}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors shrink-0"
              >
                Fund Account
              </button>
            </div>
          )}

          <div className="flex items-start gap-2.5 bg-[#c45a45]/5 border border-[#c45a45]/15 rounded-xl px-4 py-3 text-xs text-white/50">
            <FaExclamationTriangle className="text-[#c45a45]/60 shrink-0 mt-0.5" />
            <span>
              You are investing as <span className="text-white font-semibold">Admin</span>. Investments are posted under your account and deducted from your wallet.
            </span>
          </div>

          {/* Pass real admin balance — balance check applies to admin too */}
          <InvestGrid
            isAdmin={true}
            walletBalance={walletBalance}
            onBalanceRefresh={fetchBalance}
          />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   USER VIEW — fetches wallet balance first
───────────────────────────────────────── */
function UserPlansView() {
  const navigate = useNavigate();
  const [walletBalance,  setWalletBalance]  = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);

  const fetchBalance = async () => {
    try {
      const res = await API.get("user-dashboard/");
      setWalletBalance(parseFloat(res.data?.profile?.wallet_balance || 0));
    } catch (err) {
      console.error("Failed to fetch wallet balance", err);
    } finally {
      setBalanceLoading(false);
    }
  };

  useEffect(() => { fetchBalance(); }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-wide text-white">Investment Plans</h1>
          <p className="text-[#9e9593] text-sm mt-1">
            Select a risk tier suited to your investment profile. Higher brackets yield premium market returns over specialized holding intervals.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0f0e0e] border border-white/8 rounded-xl px-4 py-2.5 self-start sm:self-auto">
          <FaWallet className="text-[#c45a45] text-xs shrink-0" />
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider leading-none">Wallet Balance</p>
            {balanceLoading ? (
              <div className="h-4 w-20 bg-white/5 rounded animate-pulse mt-0.5" />
            ) : (
              <p className="text-white font-bold text-sm leading-none mt-0.5">${fmt(walletBalance)}</p>
            )}
          </div>
          <button
            onClick={() => navigate("/fund-account")}
            className="ml-2 px-2.5 py-1 rounded-lg bg-[#c45a45]/15 border border-[#c45a45]/30 text-[#c45a45] text-[10px] font-bold hover:bg-[#c45a45]/25 transition-colors"
          >
            + Fund
          </button>
        </div>
      </div>

      {!balanceLoading && walletBalance < 500 && (
        <div className="flex items-center gap-3 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
          <FaWallet className="text-amber-400 shrink-0" />
          <div className="flex-1">
            <p className="text-amber-300 text-xs font-semibold">Your wallet balance is too low to invest.</p>
            <p className="text-amber-400/60 text-[11px] mt-0.5">Minimum investment is $500. Fund your account to get started.</p>
          </div>
          <button
            onClick={() => navigate("/fund-account")}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors shrink-0"
          >
            Fund Account
          </button>
        </div>
      )}

      <InvestGrid
        isAdmin={false}
        walletBalance={walletBalance}
        onBalanceRefresh={fetchBalance}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   ROOT
───────────────────────────────────────── */
function InvestmentPlans() {
  const role    = localStorage.getItem("role");
  const isAdmin = role === "admin";

  return (
    <DashboardLayout>
      <div className="text-white p-4 md:p-7 max-w-6xl mx-auto min-h-screen bg-[#171515]">
        {isAdmin ? <AdminPlansView /> : <UserPlansView />}
      </div>
    </DashboardLayout>
  );
}

export default InvestmentPlans;