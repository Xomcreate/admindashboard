import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import {
  FaShoppingCart, FaCheckCircle, FaTimesCircle, FaTrash,
  FaPlus, FaSearch, FaFilter, FaChartLine, FaUsers,
  FaMoneyBillWave, FaClock, FaTimes, FaExclamationTriangle,
  FaDollarSign, FaPercent, FaSyncAlt,
} from "react-icons/fa";

/* ─────────────────────────────────────────
   SHARED STOCK LIST
───────────────────────────────────────── */
export const STOCKS_LIST = [
  { id: "SHOP", name: "Shopify Inc.",           ticker: "SHOP", price:   78.42, min: 500,   max: 50000,  icon: "🛍️", color: "#96bf48" },
  { id: "TSLA", name: "Tesla, Inc.",            ticker: "TSLA", price:  245.18, min: 1000,  max: 100000, icon: "⚡",  color: "#cc0000" },
  { id: "META", name: "Meta Platforms, Inc.",   ticker: "META", price:  512.74, min: 1000,  max: 100000, icon: "♾️",  color: "#0066ff" },
  { id: "AMZN", name: "Amazon.com Inc.",        ticker: "AMZN", price:  186.51, min: 1000,  max: 100000, icon: "📦", color: "#ff9900" },
  { id: "NVDA", name: "NVIDIA Corporation",     ticker: "NVDA", price:  138.07, min: 2000,  max: 200000, icon: "🟢", color: "#76b900" },
  { id: "AAPL", name: "Apple Inc.",             ticker: "AAPL", price:  227.93, min: 299,   max: 100000, icon: "🍏", color: "#a3aaae" },
  { id: "MSFT", name: "Microsoft Corporation",  ticker: "MSFT", price:  421.66, min: 1500,  max: 150000, icon: "💻", color: "#00a4ef" },
  { id: "NFLX", name: "Netflix, Inc.",          ticker: "NFLX", price:  702.30, min: 800,   max: 75000,  icon: "🍿", color: "#e50914" },
  { id: "MCD",  name: "McDonald's Corporation", ticker: "MCD",  price:  292.14, min: 500,   max: 50000,  icon: "🍔", color: "#ffc72c" },
  { id: "GME",  name: "GameStop Corporation",   ticker: "GME",  price:   23.85, min: 300,   max: 20000,  icon: "🎮", color: "#e51937" },
  { id: "KO",   name: "Coca-Cola Company",      ticker: "KO",   price:   63.41, min: 300,   max: 30000,  icon: "🥤", color: "#f40009" },
  { id: "GOOG", name: "Alphabet Inc.",          ticker: "GOOG", price:  170.22, min: 1000,  max: 100000, icon: "🔎", color: "#4285f4" },
  { id: "INTC", name: "Intel Corporation",      ticker: "INTC", price:   22.18, min: 300,   max: 30000,  icon: "🧠", color: "#0071c5" },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const fmt = (n) =>
  Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${confirmClass}`}
          >
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
  const [mode,   setMode]   = useState("fixed");   // "fixed" | "percent"
  const [value,  setValue]  = useState("");
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
      onSuccess(`Profit of $${fmt(profit)} added to ${investment.investor_name || "investor"}.`);
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
              <FaMoneyBillWave className="text-emerald-400 text-sm" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Add Profit</p>
              <p className="text-white/30 text-[11px]">{investment.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <FaTimes className="text-xs" />
          </button>
        </div>

        {/* Investor info */}
        <div className="bg-white/3 border border-white/6 rounded-xl p-3.5 space-y-2 text-xs">
          {[
            { label: "Investor",    value: investment.investor_name || "—" },
            { label: "Investment",  value: `$${fmt(investment.amount)}` },
            { label: "Status",      value: <StatusBadge status={investment.status || "Pending"} /> },
            { label: "Current Profit", value: <span className="text-emerald-400 font-bold">${fmt(investment.current_profit || 0)}</span> },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-white/30">{label}</span>
              <span className="text-white font-medium">{value}</span>
            </div>
          ))}
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2">
          {[
            { key: "fixed",   label: "Fixed ($)",   icon: <FaDollarSign className="text-[10px]" /> },
            { key: "percent", label: "Percentage (%)", icon: <FaPercent className="text-[10px]" /> },
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

        {/* Input */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-1.5">
            {mode === "fixed" ? "Profit Amount (USD)" : "Profit Percentage (%)"}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs font-bold">
              {mode === "fixed" ? "$" : "%"}
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
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

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white/50 hover:bg-white/8 transition-colors"
          >
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
   ADMIN VIEW
───────────────────────────────────────── */
function AdminStocksView() {
  const [investments,  setInvestments]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [actionLoading, setActionLoading] = useState(null);
  const [toast,        setToast]        = useState(null);

  // Modals
  const [profitModal,  setProfitModal]  = useState({ open: false, investment: null });
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, investment: null });

  useEffect(() => { fetchInvestments(); }, []);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const res = await API.get("investments/?type=stock");
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

  /* ── Approve ── */
  const handleApprove = async (inv) => {
    setActionLoading(`approve-${inv.id}`);
    try {
      await API.patch(`investments/${inv.id}/`, { approved: true, active: true });
      setInvestments((prev) =>
        prev.map((i) => i.id === inv.id ? { ...i, approved: true, active: true, status: "Approved" } : i)
      );
      showToast(`Investment by ${inv.investor_name || "investor"} approved.`);
    } catch (err) {
      showToast(err.response?.data?.detail || "Approval failed.", "error");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, investment: null });
    }
  };

  /* ── Decline ── */
  const handleDecline = async (inv) => {
    setActionLoading(`decline-${inv.id}`);
    try {
      await API.patch(`investments/${inv.id}/`, { approved: false, active: false, status: "Declined" });
      setInvestments((prev) =>
        prev.map((i) => i.id === inv.id ? { ...i, approved: false, active: false, status: "Declined" } : i)
      );
      showToast(`Investment declined.`, "error");
    } catch (err) {
      showToast(err.response?.data?.detail || "Decline failed.", "error");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, investment: null });
    }
  };

  /* ── Delete ── */
  const handleDelete = async (inv) => {
    setActionLoading(`delete-${inv.id}`);
    try {
      await API.delete(`investments/${inv.id}/`);
      setInvestments((prev) => prev.filter((i) => i.id !== inv.id));
      showToast(`Investment record deleted.`, "error");
    } catch (err) {
      showToast(err.response?.data?.detail || "Delete failed.", "error");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, investment: null });
    }
  };

  const openConfirm = (type, investment) =>
    setConfirmModal({ open: true, type, investment });

  const handleConfirm = () => {
    const { type, investment } = confirmModal;
    if (type === "approve") handleApprove(investment);
    else if (type === "decline") handleDecline(investment);
    else if (type === "delete") handleDelete(investment);
  };

  /* ── Filter / Search ── */
  const filtered = investments.filter((inv) => {
    const matchSearch =
      (inv.investor_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (inv.category      || "").toLowerCase().includes(search.toLowerCase()) ||
      (inv.investor_email|| "").toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "All" ||
      (filterStatus === "Pending"  && !inv.approved && inv.status !== "Declined") ||
      (filterStatus === "Approved" && inv.approved) ||
      (filterStatus === "Declined" && inv.status === "Declined");
    return matchSearch && matchStatus;
  });

  const totals = {
    all:      investments.length,
    pending:  investments.filter((i) => !i.approved && i.status !== "Declined").length,
    approved: investments.filter((i) => i.approved).length,
    declined: investments.filter((i) => i.status === "Declined").length,
    volume:   investments.filter((i) => i.approved).reduce((s, i) => s + parseFloat(i.amount || 0), 0),
  };

  const confirmConfig = {
    approve: {
      title: "Approve Investment",
      message: "This will mark the investment as active and start profit accumulation.",
      confirmLabel: "Approve",
      confirmClass: "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25",
    },
    decline: {
      title: "Decline Investment",
      message: "This will reject the investment. The investor will be notified.",
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

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl transition-all ${
          toast.type === "error"
            ? "bg-red-500/10 border-red-500/25 text-red-400"
            : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
        }`}>
          {toast.type === "error" ? <FaTimesCircle /> : <FaCheckCircle />}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center">
              <FaShoppingCart className="text-[#c45a45] text-sm" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Stock Investments</h1>
          </div>
          <p className="text-white/30 text-sm ml-12">
            Review, approve, and manage all investor stock positions.
          </p>
        </div>
        <button
          onClick={fetchInvestments}
          className="md:ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/8 text-xs font-medium transition-colors self-start md:self-center"
        >
          <FaSyncAlt className={`text-[10px] ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total",    value: totals.all,                         icon: <FaChartLine />,      accent: false },
          { label: "Pending",  value: totals.pending,                     icon: <FaClock />,          accent: false, highlight: "text-amber-400" },
          { label: "Approved", value: totals.approved,                    icon: <FaCheckCircle />,    accent: false, highlight: "text-emerald-400" },
          { label: "Declined", value: totals.declined,                    icon: <FaTimesCircle />,    accent: false, highlight: "text-red-400" },
          { label: "Volume",   value: `$${fmt(totals.volume)}`,           icon: <FaMoneyBillWave />,  accent: true  },
        ].map((s) => (
          <div key={s.label} className={`bg-[#0f0e0e] border rounded-xl px-4 py-3.5 flex items-center gap-3 ${
            s.accent ? "border-[#c45a45]/20 shadow-[#c45a45]/5 shadow-lg" : "border-white/[0.07]"
          }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 ${
              s.accent ? "bg-[#c45a45]/15 border border-[#c45a45]/25 text-[#c45a45]" : "bg-white/5 border border-white/8 text-white/30"
            }`}>
              {s.icon}
            </div>
            <div>
              <p className={`text-sm font-bold leading-none ${s.highlight || "text-white"}`}>{s.value}</p>
              <p className="text-white/25 text-[10px] mt-0.5 uppercase tracking-wide">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-xs" />
          <input
            type="text"
            placeholder="Search investor or stock…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f0e0e] border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c45a45]/40 transition-colors"
          />
        </div>
        <div className="flex gap-2">
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
            <div className="w-12 h-12 rounded-2xl bg-white/3 border border-white/6 flex items-center justify-center text-white/15 text-xl">
              <FaShoppingCart />
            </div>
            <p className="text-white/25 text-sm">No stock investments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/25 text-[10px] uppercase tracking-widest font-semibold">
                  <th className="px-5 py-3.5 text-left">Investor</th>
                  <th className="px-5 py-3.5 text-left">Stock</th>
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
                  const status = inv.approved ? "Approved" : inv.status === "Declined" ? "Declined" : "Pending";
                  // Match a stock icon from the category string
                  const matchStock = STOCKS_LIST.find((s) =>
                    (inv.category || "").includes(s.ticker) || (inv.category || "").includes(s.name.split(",")[0])
                  );
                  return (
                    <tr key={inv.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                      {/* Investor */}
                      <td className="px-5 py-4">
                        <p className="text-white text-xs font-semibold">{inv.investor_name || "—"}</p>
                        <p className="text-white/25 text-[10px] mt-0.5">{inv.investor_email || ""}</p>
                      </td>
                      {/* Stock */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {matchStock && (
                            <span
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                              style={{ background: `${matchStock.color}20`, border: `1px solid ${matchStock.color}35` }}
                            >
                              {matchStock.icon}
                            </span>
                          )}
                          <div>
                            <p className="text-white text-xs font-medium leading-tight">{inv.category || "—"}</p>
                            <p className="text-white/25 text-[10px]">Stock</p>
                          </div>
                        </div>
                      </td>
                      {/* Amount */}
                      <td className="px-5 py-4 text-right">
                        <p className="text-white text-xs font-bold">${fmt(inv.amount)}</p>
                      </td>
                      {/* Profit */}
                      <td className="px-5 py-4 text-right">
                        <p className="text-emerald-400 text-xs font-bold">${fmt(inv.current_profit || 0)}</p>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={status} />
                      </td>
                      {/* Date */}
                      <td className="px-5 py-4 text-center text-white/30 text-[11px]">
                        {inv.created_at ? new Date(inv.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* Approve */}
                          {status !== "Approved" && (
                            <button
                              onClick={() => openConfirm("approve", inv)}
                              disabled={!!actionLoading}
                              title="Approve"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/20 text-[10px] font-semibold disabled:opacity-40 transition-colors"
                            >
                              {isLoading("approve") ? <FaSyncAlt className="animate-spin text-[9px]" /> : <FaCheckCircle className="text-[9px]" />}
                              Approve
                            </button>
                          )}
                          {/* Decline */}
                          {status !== "Declined" && (
                            <button
                              onClick={() => openConfirm("decline", inv)}
                              disabled={!!actionLoading}
                              title="Decline"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 hover:bg-amber-400/20 text-[10px] font-semibold disabled:opacity-40 transition-colors"
                            >
                              {isLoading("decline") ? <FaSyncAlt className="animate-spin text-[9px]" /> : <FaTimesCircle className="text-[9px]" />}
                              Decline
                            </button>
                          )}
                          {/* Add Profit */}
                          <button
                            onClick={() => setProfitModal({ open: true, investment: inv })}
                            disabled={!!actionLoading}
                            title="Add Profit"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#c45a45]/10 border border-[#c45a45]/25 text-[#e07060] hover:bg-[#c45a45]/20 text-[10px] font-semibold disabled:opacity-40 transition-colors"
                          >
                            <FaPlus className="text-[9px]" /> Profit
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => openConfirm("delete", inv)}
                            disabled={!!actionLoading}
                            title="Delete"
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

      {/* Modals */}
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
   USER VIEW  (unchanged from original)
───────────────────────────────────────── */
function UserStocksView() {
  const [amounts,   setAmounts]   = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [toast,     setToast]     = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAmountChange = (stockId, value) =>
    setAmounts((prev) => ({ ...prev, [stockId]: value }));

  const handleInvest = async (stock, e) => {
    e.preventDefault();
    const val = parseFloat(amounts[stock.id] || 0);
    if (!val || val < stock.min || val > stock.max) {
      showToast(`Enter an amount between $${stock.min.toLocaleString()} and $${stock.max.toLocaleString()}.`, "error");
      return;
    }
    setLoadingId(stock.id);
    try {
      await API.post("investments/", {
        amount: val,
        category: `${stock.name.split(",")[0]} (${stock.ticker})`,
        type: "stock",
      });
      showToast(`$${val.toLocaleString()} invested in ${stock.name}. Pending approval.`);
      setAmounts((p) => ({ ...p, [stock.id]: "" }));
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to submit investment.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* Toast */}
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

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center shrink-0">
          <FaShoppingCart className="text-[#c45a45] text-sm" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Purchase Stocks</h1>
          <p className="text-white/30 text-sm mt-0.5">
            Deploy capital into top-tier global equities. Contracts accumulate{" "}
            <span className="text-emerald-400 font-medium">25% daily yields</span> for a 120-day cycle.
          </p>
        </div>
      </div>

      {/* Stock Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {STOCKS_LIST.map((stock) => {
          const amt    = parseFloat(amounts[stock.id] || 0);
          const shares = amt > 0 ? (amt / stock.price).toFixed(4) : "—";
          const isLoading = loadingId === stock.id;
          return (
            <div
              key={stock.id}
              className="bg-[#0f0e0e] rounded-2xl border border-white/[0.07] p-5 flex flex-col justify-between hover:border-[#c45a45]/30 hover:shadow-lg hover:shadow-[#c45a45]/5 transition-all duration-300"
            >
              {/* Stock Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: `${stock.color}18`, border: `1px solid ${stock.color}35` }}
                  >
                    {stock.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold leading-tight truncate">{stock.name}</p>
                    <span className="text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded-md bg-white/5 border border-white/8 text-white/35 inline-block mt-0.5">
                      {stock.ticker}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2 bg-white/2 border border-white/5 rounded-xl p-3 text-xs mb-4">
                  {[
                    { label: "Price / Share",   value: `$${stock.price.toFixed(2)}`, cls: "text-emerald-400 font-bold" },
                    { label: "Min. Investment", value: `$${stock.min.toLocaleString()}`, cls: "text-white/60 font-semibold" },
                    { label: "Max. Investment", value: `$${stock.max.toLocaleString()}`, cls: "text-white/60 font-semibold" },
                    { label: "Est. Shares",     value: shares, cls: "text-white font-bold" },
                  ].map(({ label, value, cls }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-white/25">{label}</span>
                      <span className={cls}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={(e) => handleInvest(stock, e)} className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/25 mb-1.5">
                    Amount to Invest
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs font-bold">$</span>
                    <input
                      type="number"
                      placeholder={`${stock.min.toLocaleString()}`}
                      min={stock.min}
                      max={stock.max}
                      value={amounts[stock.id] || ""}
                      onChange={(e) => handleAmountChange(stock.id, e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl pl-7 pr-3 py-2.5 text-white text-sm placeholder-white/15 focus:outline-none focus:border-[#c45a45]/50 transition-colors"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#c45a45] hover:bg-[#d06a55] disabled:opacity-50 disabled:cursor-wait text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-200 uppercase tracking-wider shadow-md shadow-[#c45a45]/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <><FaSyncAlt className="animate-spin text-[10px]" /> Submitting…</>
                  ) : (
                    <><FaShoppingCart className="text-[10px]" /> Invest Now</>
                  )}
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ROOT COMPONENT — role-aware
───────────────────────────────────────── */
function PurchaseStocks() {
  const role    = localStorage.getItem("role");
  const isAdmin = role === "admin";

  return (
    <DashboardLayout>
      <div className="text-white p-5 md:p-7 max-w-7xl mx-auto">
        {isAdmin ? <AdminStocksView /> : <UserStocksView />}
      </div>
    </DashboardLayout>
  );
}

export default PurchaseStocks;