import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import {
  FaShoppingCart, FaCheckCircle, FaTimesCircle, FaTrash,
  FaPlus, FaSearch, FaChartLine,
  FaMoneyBillWave, FaClock, FaTimes, FaExclamationTriangle,
  FaDollarSign, FaPercent, FaSyncAlt, FaCog, FaWallet,
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

const resolveInvestorName = (inv) => {
  if (inv.investor_name && inv.investor_name.trim()) return inv.investor_name.trim();
  if (inv.user) {
    const u = inv.user;
    if (u.first_name || u.last_name) return `${u.first_name || ""} ${u.last_name || ""}`.trim();
    if (u.full_name && u.full_name.trim()) return u.full_name.trim();
    if (u.username && u.username.trim()) return u.username.trim();
    if (u.email && u.email.trim()) return u.email.trim();
  }
  if (inv.investor) {
    const i = inv.investor;
    if (i.name && i.name.trim()) return i.name.trim();
    if (i.first_name || i.last_name) return `${i.first_name || ""} ${i.last_name || ""}`.trim();
    if (i.email && i.email.trim()) return i.email.trim();
  }
  if (inv.investor_email && inv.investor_email.trim()) return inv.investor_email.trim();
  return "Unknown Investor";
};

const resolveInvestorEmail = (inv) => {
  if (inv.investor_email && inv.investor_email.trim()) return inv.investor_email.trim();
  if (inv.user?.email) return inv.user.email.trim();
  if (inv.investor?.email) return inv.investor.email.trim();
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
          <button onClick={onCancel} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-colors">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${confirmClass}`}>{confirmLabel}</button>
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
              <p className="text-white/30 text-[11px]">{investment.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <FaTimes className="text-xs" />
          </button>
        </div>
        <div className="bg-white/3 border border-white/6 rounded-xl p-3.5 space-y-2 text-xs">
          {[
            { label: "Investor",       value: resolveInvestorName(investment) },
            { label: "Investment",     value: `$${fmt(investment.amount)}` },
            { label: "Status",         value: <StatusBadge status={investment.status || "Pending"} /> },
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
            <button key={key} onClick={() => { setMode(key); setValue(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                mode === key ? "bg-[#c45a45]/15 border-[#c45a45]/35 text-white" : "bg-white/3 border-white/8 text-white/40 hover:border-white/15"
              }`}>
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
            <input type="number" min="0" step="0.01"
              placeholder={mode === "fixed" ? "e.g. 250.00" : "e.g. 25"}
              value={value} onChange={(e) => setValue(e.target.value)}
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
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white/50 hover:bg-white/8 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !value}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
            <FaPlus className="text-[9px]" />
            {loading ? "Adding…" : `Add $${fmt(computed)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ADMIN — MANAGE TAB
───────────────────────────────────────── */
function AdminManageView() {
  const [investments,   setInvestments]   = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [filterStatus,  setFilterStatus]  = useState("All");
  const [actionLoading, setActionLoading] = useState(null);
  const [toast,         setToast]         = useState(null);
  const [profitModal,   setProfitModal]   = useState({ open: false, investment: null });
  const [confirmModal,  setConfirmModal]  = useState({ open: false, type: null, investment: null });

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
      showToast(`Investment declined.`, "error");
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
      showToast(`Investment record deleted.`, "error");
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
    const name  = resolveInvestorName(inv).toLowerCase();
    const email = resolveInvestorEmail(inv).toLowerCase();
    const matchSearch =
      name.includes(search.toLowerCase()) ||
      (inv.category || "").toLowerCase().includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "All" ||
      (filterStatus === "Pending"  && inv.status === "Pending") ||
      (filterStatus === "Approved" && inv.status === "Approved") ||
      (filterStatus === "Declined" && inv.status === "Declined");
    return matchSearch && matchStatus;
  });

  const totals = {
    all:      investments.length,
    pending:  investments.filter((i) => i.status === "Pending").length,
    approved: investments.filter((i) => i.status === "Approved").length,
    declined: investments.filter((i) => i.status === "Declined").length,
    volume:   investments.filter((i) => i.status === "Approved").reduce((s, i) => s + parseFloat(i.amount || 0), 0),
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
      message: "This will reject the investment. The amount will be refunded to the investor's wallet.",
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
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl transition-all ${
          toast.type === "error" ? "bg-red-500/10 border-red-500/25 text-red-400" : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
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
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-xs" />
          <input type="text" placeholder="Search investor or stock…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f0e0e] border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c45a45]/40 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "Approved", "Declined"].map((f) => (
            <button key={f} onClick={() => setFilterStatus(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                filterStatus === f ? "bg-[#c45a45]/15 border-[#c45a45]/35 text-white" : "bg-transparent border-white/10 text-white/35 hover:text-white/60 hover:border-white/20"
              }`}>
              {f}
              {f !== "All" && (
                <span className="ml-1.5 text-[9px] opacity-60">
                  ({f === "Pending" ? totals.pending : f === "Approved" ? totals.approved : totals.declined})
                </span>
              )}
            </button>
          ))}
        </div>
        <button onClick={fetchInvestments}
          className="md:ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/8 text-xs font-medium transition-colors self-start">
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
                  const isLoading  = (k) => actionLoading === `${k}-${inv.id}`;
                  const status     = inv.status || (inv.approved ? "Approved" : "Pending");
                  const matchStock = STOCKS_LIST.find((s) =>
                    (inv.category || "").includes(s.ticker) || (inv.category || "").includes(s.name.split(",")[0])
                  );
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
                          {matchStock && (
                            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                              style={{ background: `${matchStock.color}20`, border: `1px solid ${matchStock.color}35` }}>
                              {matchStock.icon}
                            </span>
                          )}
                          <div>
                            <p className="text-white text-xs font-medium leading-tight">{inv.category || "—"}</p>
                            <p className="text-white/25 text-[10px]">Stock</p>
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
                          ? new Date(inv.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {status !== "Approved" && (
                            <button onClick={() => openConfirm("approve", inv)} disabled={!!actionLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/20 text-[10px] font-semibold disabled:opacity-40 transition-colors">
                              {isLoading("approve") ? <FaSyncAlt className="animate-spin text-[9px]" /> : <FaCheckCircle className="text-[9px]" />}
                              Approve
                            </button>
                          )}
                          {status !== "Declined" && (
                            <button onClick={() => openConfirm("decline", inv)} disabled={!!actionLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 hover:bg-amber-400/20 text-[10px] font-semibold disabled:opacity-40 transition-colors">
                              {isLoading("decline") ? <FaSyncAlt className="animate-spin text-[9px]" /> : <FaTimesCircle className="text-[9px]" />}
                              Decline
                            </button>
                          )}
                          <button onClick={() => setProfitModal({ open: true, investment: inv })} disabled={!!actionLoading}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#c45a45]/10 border border-[#c45a45]/25 text-[#e07060] hover:bg-[#c45a45]/20 text-[10px] font-semibold disabled:opacity-40 transition-colors">
                            <FaPlus className="text-[9px]" /> Profit
                          </button>
                          <button onClick={() => openConfirm("delete", inv)} disabled={!!actionLoading}
                            className="w-7 h-7 rounded-lg bg-red-500/8 border border-red-500/15 text-red-400/50 hover:text-red-400 hover:bg-red-500/15 flex items-center justify-center disabled:opacity-40 transition-colors">
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
   STOCK PURCHASE GRID
───────────────────────────────────────── */
function StockPurchaseGrid({ isAdmin = false, walletBalance = 0, onBalanceRefresh }) {
  const navigate    = useNavigate();
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

    if (val > walletBalance) {
      showToast(
        `Insufficient balance. Your wallet has $${fmt(walletBalance)} but this investment requires $${fmt(val)}.`,
        "insufficient"
      );
      return;
    }

    setLoadingId(stock.id);
    try {
      await API.post("investments/", {
        amount:   val,
        category: `${stock.name.split(",")[0]} (${stock.ticker})`,
        type:     "stock",
      });
      showToast(
        isAdmin
          ? `$${val.toLocaleString()} invested in ${stock.name}.`
          : `$${val.toLocaleString()} invested in ${stock.name}. Pending approval.`
      );
      setAmounts((p) => ({ ...p, [stock.id]: "" }));
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
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-start gap-3 px-4 py-3.5 rounded-xl border text-xs font-semibold shadow-2xl max-w-sm ${
          toast.type === "insufficient"
            ? "bg-amber-500/10 border-amber-500/25 text-amber-300"
            : toast.type === "error"
            ? "bg-red-500/10 border-red-500/25 text-red-400"
            : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
        }`}>
          <div className="shrink-0 mt-0.5">
            {toast.type === "insufficient" ? <FaWallet className="text-amber-400" />
              : toast.type === "error" ? <FaTimesCircle />
              : <FaCheckCircle />}
          </div>
          <div className="flex-1">
            <p className="leading-relaxed">{toast.msg}</p>
            {toast.type === "insufficient" && (
              <button onClick={() => navigate("/fund-account")}
                className="mt-2 w-full py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition-colors text-[11px] font-bold flex items-center justify-center gap-1.5">
                <FaWallet className="text-[10px]" /> Fund Account Now
              </button>
            )}
          </div>
          <button onClick={() => setToast(null)} className="shrink-0 text-white/20 hover:text-white/60 transition-colors">
            <FaTimes className="text-[10px]" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {STOCKS_LIST.map((stock) => {
          const amt       = parseFloat(amounts[stock.id] || 0);
          const shares    = amt > 0 ? (amt / stock.price).toFixed(4) : "—";
          const isLoading = loadingId === stock.id;
          const canAfford = walletBalance >= stock.min;
          const willAfford = !amt || walletBalance >= amt;

          return (
            <div key={stock.id}
              className={`bg-[#0f0e0e] rounded-2xl border border-white/[0.07] p-5 flex flex-col justify-between hover:border-[#c45a45]/30 hover:shadow-lg hover:shadow-[#c45a45]/5 transition-all duration-300 ${!canAfford ? "opacity-60" : ""}`}>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: `${stock.color}18`, border: `1px solid ${stock.color}35` }}>
                    {stock.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold leading-tight truncate">{stock.name}</p>
                    <span className="text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded-md bg-white/5 border border-white/8 text-white/35 inline-block mt-0.5">
                      {stock.ticker}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 bg-white/2 border border-white/5 rounded-xl p-3 text-xs mb-4">
                  {[
                    { label: "Price / Share",   value: `$${stock.price.toFixed(2)}`,    cls: "text-emerald-400 font-bold" },
                    { label: "Min. Investment", value: `$${stock.min.toLocaleString()}`, cls: "text-white/60 font-semibold" },
                    { label: "Max. Investment", value: `$${stock.max.toLocaleString()}`, cls: "text-white/60 font-semibold" },
                    { label: "Est. Shares",     value: shares,                           cls: "text-white font-bold" },
                  ].map(({ label, value, cls }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-white/25">{label}</span>
                      <span className={cls}>{value}</span>
                    </div>
                  ))}
                </div>

                {!canAfford && (
                  <div className="mb-4 flex items-center gap-2 bg-amber-500/8 border border-amber-500/20 rounded-lg px-3 py-2">
                    <FaWallet className="text-amber-400 text-[10px] shrink-0" />
                    <p className="text-amber-400/80 text-[10px] leading-relaxed">
                      Need ${stock.min.toLocaleString()} minimum.{" "}
                      <button onClick={() => navigate("/fund-account")}
                        className="underline text-amber-400 font-semibold hover:text-amber-300">
                        Fund account
                      </button>
                    </p>
                  </div>
                )}
              </div>

              <form onSubmit={(e) => handleInvest(stock, e)} className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] uppercase tracking-widest text-white/25">
                      Amount to Invest
                    </label>
                    <span className={`text-[10px] font-semibold ${walletBalance >= (amt || stock.min) ? "text-emerald-400" : "text-amber-400"}`}>
                      Bal: ${fmt(walletBalance)}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs font-bold">$</span>
                    <input type="number"
                      placeholder={`${stock.min.toLocaleString()}`}
                      min={stock.min} max={stock.max}
                      value={amounts[stock.id] || ""}
                      onChange={(e) => handleAmountChange(stock.id, e.target.value)}
                      className={`w-full bg-[#0A0A0B] border rounded-xl pl-7 pr-3 py-2.5 text-white text-sm placeholder-white/15 focus:outline-none transition-colors ${
                        !willAfford && amt > 0
                          ? "border-amber-500/40 focus:border-amber-500"
                          : "border-white/10 focus:border-[#c45a45]/50"
                      }`}
                      required
                    />
                  </div>
                  {amt > 0 && amt > walletBalance && (
                    <p className="text-amber-400 text-[10px] mt-1 flex items-center gap-1">
                      <FaExclamationTriangle className="text-[9px]" />
                      Insufficient balance — need ${fmt(amt - walletBalance)} more
                    </p>
                  )}
                </div>
                <button type="submit"
                  disabled={isLoading || (amt > walletBalance && amt > 0)}
                  className="w-full bg-[#c45a45] hover:bg-[#d06a55] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-200 uppercase tracking-wider shadow-md shadow-[#c45a45]/20 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <><FaSyncAlt className="animate-spin text-[10px]" /> Submitting…</>
                  ) : amt > walletBalance && amt > 0 ? (
                    <><FaWallet className="text-[10px]" /> Fund Account First</>
                  ) : (
                    <><FaShoppingCart className="text-[10px]" /> Invest Now</>
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
   ADMIN VIEW — tab-aware wrapper
   Now fetches real admin wallet balance
───────────────────────────────────────── */
function AdminStocksView() {
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
    { key: "manage",   label: "Manage Investments", icon: <FaCog className="text-[11px]" /> },
    { key: "purchase", label: "Purchase Stocks",    icon: <FaShoppingCart className="text-[11px]" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center">
              <FaShoppingCart className="text-[#c45a45] text-sm" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Stock Investments</h1>
          </div>
          <p className="text-white/30 text-sm ml-12">
            {activeTab === "manage"
              ? "Review, approve, and manage all investor stock positions."
              : "Deploy capital into top-tier global equities on behalf of investors."}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          {/* Admin wallet balance pill — visible on purchase tab */}
          {activeTab === "purchase" && (
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
              <button onClick={() => navigate("/fund-account")}
                className="ml-2 px-2.5 py-1 rounded-lg bg-[#c45a45]/15 border border-[#c45a45]/30 text-[#c45a45] text-[10px] font-bold hover:bg-[#c45a45]/25 transition-colors">
                + Fund
              </button>
            </div>
          )}

          <div className="flex gap-1.5 bg-[#0f0e0e] border border-white/8 rounded-xl p-1">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.key
                    ? "bg-[#c45a45]/15 border border-[#c45a45]/30 text-white"
                    : "text-white/35 hover:text-white/60 border border-transparent"
                }`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === "manage" ? (
        <AdminManageView />
      ) : (
        <div className="space-y-5">
          {/* Low balance warning for admin */}
          {!balanceLoading && walletBalance < 300 && (
            <div className="flex items-center gap-3 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
              <FaWallet className="text-amber-400 shrink-0" />
              <div className="flex-1">
                <p className="text-amber-300 text-xs font-semibold">Your admin wallet balance is low.</p>
                <p className="text-amber-400/60 text-[11px] mt-0.5">Fund your account to make stock investments.</p>
              </div>
              <button onClick={() => navigate("/fund-account")}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors shrink-0">
                Fund Account
              </button>
            </div>
          )}

          <div className="bg-[#c45a45]/5 border border-[#c45a45]/15 rounded-xl px-4 py-3 text-xs text-white/50 flex items-start gap-2.5">
            <FaExclamationTriangle className="text-[#c45a45]/60 shrink-0 mt-0.5" />
            <span>
              You are investing as <span className="text-white font-semibold">Admin</span>. Investments are posted under your account and deducted from your wallet.
            </span>
          </div>

          {/* Pass real admin balance — balance check applies to admin too */}
          <StockPurchaseGrid
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
function UserStocksView() {
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
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

        <div className="flex items-center gap-2 bg-[#0f0e0e] border border-white/8 rounded-xl px-4 py-2.5 self-start sm:self-auto shrink-0">
          <FaWallet className="text-[#c45a45] text-xs shrink-0" />
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider leading-none">Wallet Balance</p>
            {balanceLoading ? (
              <div className="h-4 w-20 bg-white/5 rounded animate-pulse mt-0.5" />
            ) : (
              <p className="text-white font-bold text-sm leading-none mt-0.5">${fmt(walletBalance)}</p>
            )}
          </div>
          <button onClick={() => navigate("/fund-account")}
            className="ml-2 px-2.5 py-1 rounded-lg bg-[#c45a45]/15 border border-[#c45a45]/30 text-[#c45a45] text-[10px] font-bold hover:bg-[#c45a45]/25 transition-colors">
            + Fund
          </button>
        </div>
      </div>

      {!balanceLoading && walletBalance < 300 && (
        <div className="flex items-center gap-3 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
          <FaWallet className="text-amber-400 shrink-0" />
          <div className="flex-1">
            <p className="text-amber-300 text-xs font-semibold">Your wallet balance is too low to invest.</p>
            <p className="text-amber-400/60 text-[11px] mt-0.5">Minimum stock investment starts at $300. Fund your account to get started.</p>
          </div>
          <button onClick={() => navigate("/fund-account")}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors shrink-0">
            Fund Account
          </button>
        </div>
      )}

      <StockPurchaseGrid
        isAdmin={false}
        walletBalance={walletBalance}
        onBalanceRefresh={fetchBalance}
      />
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