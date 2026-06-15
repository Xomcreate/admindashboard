import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import {
  FaRobot, FaBolt, FaChartLine, FaShieldAlt, FaPlay, FaStop,
  FaCog, FaCheckCircle, FaLock, FaTimes, FaWallet, FaInfoCircle,
  FaUsers, FaSearch, FaSyncAlt, FaTimesCircle, FaClock,
  FaTrash, FaExclamationTriangle, FaMoneyBillWave, FaToggleOn, FaToggleOff,
} from "react-icons/fa";

/* ─────────────────────────────────────────
   SHARED BOT LIST
───────────────────────────────────────── */
const bots = [
  {
    id: 1, name: "Apex Scalper",
    description: "High-frequency micro-trades on volatile pairs. Sub-second execution.",
    type: "Scalping", market: "Forex", roi: "+94.2%", monthly: "+8.4%",
    drawdown: "3.2%", trades: "1,840", risk: "High", active: false,
    uptime: "99.7%", badge: "Hot", badgeColor: "#c45a45", color: "#c45a45",
    status: "idle", locked: false, tier: "Starter",
  },
  {
    id: 2, name: "GridMaster Pro",
    description: "Grid strategy across major indices. Profits from range-bound markets.",
    type: "Grid", market: "Indices", roi: "+63.1%", monthly: "+5.8%",
    drawdown: "1.8%", trades: "940", risk: "Low", active: false,
    uptime: "99.9%", badge: "Stable", badgeColor: "#4db89b", color: "#4db89b",
    status: "idle", locked: false, tier: "Starter",
  },
  {
    id: 3, name: "CryptoSurge AI",
    description: "Momentum-based crypto bot using ML signals for BTC & ETH entries.",
    type: "Momentum", market: "Crypto", roi: "+218.6%", monthly: "+19.7%",
    drawdown: "12.4%", trades: "2,310", risk: "High", active: false,
    uptime: "98.2%", badge: "Top Pick", badgeColor: "#d4875a", color: "#d4875a",
    status: "idle", locked: false, tier: "Pro",
  },
  {
    id: 4, name: "Sentinel Swing",
    description: "Multi-day swing trades on high-cap stocks using technical confluence.",
    type: "Swing", market: "Stocks", roi: "+81.5%", monthly: "+7.2%",
    drawdown: "4.1%", trades: "380", risk: "Medium", active: false,
    uptime: "99.5%", badge: "Reliable", badgeColor: "#5a8fc4", color: "#5a8fc4",
    status: "idle", locked: false, tier: "Pro",
  },
  {
    id: 5, name: "Nexus Arbitrage",
    description: "Cross-exchange arbitrage capturing micro-spreads 24/7 automatically.",
    type: "Arbitrage", market: "Multi", roi: "+142.3%", monthly: "+11.9%",
    drawdown: "0.9%", trades: "5,620", risk: "Low", active: false,
    uptime: "99.99%", badge: "Premium", badgeColor: "#9b6ab5", color: "#9b6ab5",
    status: "idle", locked: true, tier: "Institutional",
  },
  {
    id: 6, name: "QuantEdge DCA",
    description: "Dollar-cost averaging bot for long-term portfolio accumulation.",
    type: "DCA", market: "Stocks", roi: "+57.8%", monthly: "+4.6%",
    drawdown: "2.3%", trades: "260", risk: "Low", active: false,
    uptime: "100%", badge: "Steady", badgeColor: "#4db89b", color: "#4db89b",
    status: "idle", locked: false, tier: "Starter",
  },
];

/* ─────────────────────────────────────────
   BILLING PERIODS & PLANS
───────────────────────────────────────── */
const BILLING_PERIODS = ["weekly", "monthly", "yearly"];

const PLAN_FEATURES = {
  Starter: [
    "Deploy up to 2 concurrent Starter bots",
    "Maximum runtime cap of 40 hours/wk",
    "Standard trading signals execution",
    "Weekly performance email log",
    "Min. deposit: $500",
  ],
  Pro: [
    "Deploy up to 5 Pro & Starter level bots",
    "True 24/7 perpetual uptime hosting",
    "Advanced ML trend-matching modules",
    "Custom balance drawdown safeguard controls",
    "Min. deposit: $2,000",
  ],
  Institutional: [
    "Run unlimited active bot nodes seamlessly",
    "Unlock exclusive high-yield Arbitrage matrix",
    "Raw webhooks integration pipeline",
    "Assigned risk manager portfolio reviews",
    "Min. deposit: $10,000",
  ],
};

const PLANS_BY_PERIOD = {
  weekly: [
    {
      name: "Starter",
      price: "$15", priceNum: 15,
      deposit: "$500", depositAmount: 500,
      period: "/wk", billingPeriod: "weekly",
      description: "Run entry-level algorithmic instances under basic configurations.",
      features: PLAN_FEATURES.Starter,
      popular: false,
      unlockedTiers: ["Starter"],
    },
    {
      name: "Pro",
      price: "$40", priceNum: 40,
      deposit: "$2,000", depositAmount: 2000,
      period: "/wk", billingPeriod: "weekly",
      description: "Optimized for systematic algorithmic traders running continuous strategies.",
      features: PLAN_FEATURES.Pro,
      popular: true,
      unlockedTiers: ["Starter", "Pro"],
    },
    {
      name: "Institutional",
      price: "$130", priceNum: 130,
      deposit: "$10,000", depositAmount: 10000,
      period: "/wk", billingPeriod: "weekly",
      description: "Full cluster execution capability with sub-millisecond liquidity routing.",
      features: PLAN_FEATURES.Institutional,
      popular: false,
      unlockedTiers: ["Starter", "Pro", "Institutional"],
    },
  ],
  monthly: [
    {
      name: "Starter",
      price: "$49", priceNum: 49,
      deposit: "$500", depositAmount: 500,
      period: "/mo", billingPeriod: "monthly",
      description: "Run entry-level algorithmic instances under basic configurations.",
      features: PLAN_FEATURES.Starter,
      popular: false,
      unlockedTiers: ["Starter"],
    },
    {
      name: "Pro",
      price: "$149", priceNum: 149,
      deposit: "$2,000", depositAmount: 2000,
      period: "/mo", billingPeriod: "monthly",
      description: "Optimized for systematic algorithmic traders running continuous strategies.",
      features: PLAN_FEATURES.Pro,
      popular: true,
      unlockedTiers: ["Starter", "Pro"],
    },
    {
      name: "Institutional",
      price: "$499", priceNum: 499,
      deposit: "$10,000", depositAmount: 10000,
      period: "/mo", billingPeriod: "monthly",
      description: "Full cluster execution capability with sub-millisecond liquidity routing.",
      features: PLAN_FEATURES.Institutional,
      popular: false,
      unlockedTiers: ["Starter", "Pro", "Institutional"],
    },
  ],
  yearly: [
    {
      name: "Starter",
      price: "$410", priceNum: 410,
      deposit: "$500", depositAmount: 500,
      period: "/yr", billingPeriod: "yearly",
      description: "Run entry-level algorithmic instances under basic configurations.",
      features: PLAN_FEATURES.Starter,
      popular: false,
      unlockedTiers: ["Starter"],
      savings: "Save 30%",
    },
    {
      name: "Pro",
      price: "$1,250", priceNum: 1250,
      deposit: "$2,000", depositAmount: 2000,
      period: "/yr", billingPeriod: "yearly",
      description: "Optimized for systematic algorithmic traders running continuous strategies.",
      features: PLAN_FEATURES.Pro,
      popular: true,
      unlockedTiers: ["Starter", "Pro"],
      savings: "Save 30%",
    },
    {
      name: "Institutional",
      price: "$4,190", priceNum: 4190,
      deposit: "$10,000", depositAmount: 10000,
      period: "/yr", billingPeriod: "yearly",
      description: "Full cluster execution capability with sub-millisecond liquidity routing.",
      features: PLAN_FEATURES.Institutional,
      popular: false,
      unlockedTiers: ["Starter", "Pro", "Institutional"],
      savings: "Save 30%",
    },
  ],
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const fmt = (n) =>
  Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const resolveUserName = (sub) => {
  if (sub.user_name && sub.user_name.trim()) return sub.user_name.trim();
  if (sub.user) {
    const u = sub.user;
    if (u.first_name || u.last_name) return `${u.first_name || ""} ${u.last_name || ""}`.trim();
    if (u.full_name) return u.full_name.trim();
    if (u.username)  return u.username.trim();
    if (u.email)     return u.email.trim();
  }
  return sub.user_email || "Unknown User";
};

const resolveUserEmail = (sub) => {
  if (sub.user_email) return sub.user_email;
  if (sub.user?.email) return sub.user.email;
  return "";
};

// FIX 4: Robust error message extractor — handles all DRF error shapes
const extractErrorMessage = (err) => {
  const data = err?.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  // DRF ValidationError from perform_create raises as {"detail": "..."} or as a list
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  if (data.non_field_errors) return Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
  // DRF serializer field errors: { plan: ["..."], billing_period: ["..."] }
  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const val = data[firstKey];
    return `${firstKey}: ${Array.isArray(val) ? val[0] : val}`;
  }
  return "Subscription request failed. Please try again.";
};

const riskBg = {
  Low:    "bg-emerald-400/10 border-emerald-400/20 text-emerald-400",
  Medium: "bg-amber-400/10  border-amber-400/20  text-amber-400",
  High:   "bg-red-400/10    border-red-400/20    text-red-400",
};

const planBadgeColor = {
  Starter:       "bg-white/8 border-white/15 text-white/60",
  Pro:           "bg-[#c45a45]/10 border-[#c45a45]/25 text-[#e07060]",
  Institutional: "bg-[#9b6ab5]/10 border-[#9b6ab5]/25 text-[#b88fd4]",
};

const periodBadgeColor = {
  weekly:  "bg-blue-400/10 border-blue-400/20 text-blue-300",
  monthly: "bg-white/8 border-white/15 text-white/50",
  yearly:  "bg-emerald-400/10 border-emerald-400/20 text-emerald-400",
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
   TOAST (replaces alert())
───────────────────────────────────────── */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-5 right-5 z-999 flex items-start gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl max-w-sm ${
      toast.type === "error"
        ? "bg-red-500/10 border-red-500/25 text-red-400"
        : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
    }`}>
      {toast.type === "error" ? <FaTimesCircle className="shrink-0 mt-0.5" /> : <FaCheckCircle className="shrink-0 mt-0.5" />}
      <span className="leading-relaxed">{toast.msg}</span>
    </div>
  );
}

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
   ADMIN — MANAGE SUBSCRIPTIONS TAB
───────────────────────────────────────── */
function AdminManageBots() {
  const [subscriptions,  setSubscriptions]  = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [search,         setSearch]         = useState("");
  const [filterStatus,   setFilterStatus]   = useState("All");
  const [actionLoading,  setActionLoading]  = useState(null);
  const [toast,          setToast]          = useState(null);
  const [confirmModal,   setConfirmModal]   = useState({ open: false, type: null, sub: null });

  useEffect(() => { fetchSubscriptions(); }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await API.get("bot-subscriptions/");
      setSubscriptions(res.data);
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

  const handleApprove = async (sub) => {
    setActionLoading(`approve-${sub.id}`);
    try {
      await API.patch(`bot-subscriptions/${sub.id}/`, { approved: true, active: true, status: "Approved" });
      setSubscriptions((prev) =>
        prev.map((s) => s.id === sub.id ? { ...s, approved: true, active: true, status: "Approved" } : s)
      );
      showToast(`Subscription for ${resolveUserName(sub)} approved.`);
    } catch (err) {
      showToast(extractErrorMessage(err), "error");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, sub: null });
    }
  };

  const handleDecline = async (sub) => {
    setActionLoading(`decline-${sub.id}`);
    try {
      await API.patch(`bot-subscriptions/${sub.id}/`, { approved: false, active: false, status: "Declined" });
      setSubscriptions((prev) =>
        prev.map((s) => s.id === sub.id ? { ...s, approved: false, active: false, status: "Declined" } : s)
      );
      showToast(`Subscription declined.`, "error");
    } catch (err) {
      showToast(extractErrorMessage(err), "error");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, sub: null });
    }
  };

  const handleDelete = async (sub) => {
    setActionLoading(`delete-${sub.id}`);
    try {
      await API.delete(`bot-subscriptions/${sub.id}/`);
      setSubscriptions((prev) => prev.filter((s) => s.id !== sub.id));
      showToast(`Subscription record deleted.`, "error");
    } catch (err) {
      showToast(extractErrorMessage(err), "error");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, sub: null });
    }
  };

  const openConfirm   = (type, sub) => setConfirmModal({ open: true, type, sub });
  const handleConfirm = () => {
    const { type, sub } = confirmModal;
    if (type === "approve") handleApprove(sub);
    else if (type === "decline") handleDecline(sub);
    else if (type === "delete")  handleDelete(sub);
  };

  const filtered = subscriptions.filter((s) => {
    const name  = resolveUserName(s).toLowerCase();
    const email = resolveUserEmail(s).toLowerCase();
    const matchSearch =
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      (s.plan || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "All" ||
      (filterStatus === "Pending"  && !s.approved && s.status !== "Declined") ||
      (filterStatus === "Approved" && s.approved) ||
      (filterStatus === "Declined" && s.status === "Declined");
    return matchSearch && matchStatus;
  });

  const toMonthlyEquivalent = (sub) => {
    const bp = sub.billing_period || "monthly";
    const allPeriodPlans = Object.values(PLANS_BY_PERIOD).flat();
    const match = allPeriodPlans.find((p) => p.name === sub.plan && p.billingPeriod === bp);
    if (!match) return 0;
    if (bp === "weekly")  return match.priceNum * 4.33;
    if (bp === "yearly")  return match.priceNum / 12;
    return match.priceNum;
  };

  const totals = {
    all:      subscriptions.length,
    pending:  subscriptions.filter((s) => !s.approved && s.status !== "Declined").length,
    approved: subscriptions.filter((s) => s.approved).length,
    declined: subscriptions.filter((s) => s.status === "Declined").length,
    mrr: Math.round(
      subscriptions.filter((s) => s.approved).reduce((acc, s) => acc + toMonthlyEquivalent(s), 0)
    ),
  };

  const confirmConfig = {
    approve: {
      title: "Approve Subscription",
      message: "This will activate the bot plan and allow the user to deploy trading bots.",
      confirmLabel: "Approve",
      confirmClass: "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25",
    },
    decline: {
      title: "Decline Subscription",
      message: "This will reject the subscription request.",
      confirmLabel: "Decline",
      confirmClass: "bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25",
    },
    delete: {
      title: "Delete Record",
      message: "This permanently removes the subscription record. This cannot be undone.",
      confirmLabel: "Delete",
      confirmClass: "bg-red-500 hover:bg-red-600 text-white",
    },
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total",    value: totals.all,          icon: <FaRobot />,        accent: false },
          { label: "Pending",  value: totals.pending,      icon: <FaClock />,        accent: false, highlight: "text-amber-400" },
          { label: "Approved", value: totals.approved,     icon: <FaCheckCircle />,  accent: false, highlight: "text-emerald-400" },
          { label: "Declined", value: totals.declined,     icon: <FaTimesCircle />,  accent: false, highlight: "text-red-400" },
          { label: "Est. MRR", value: `$${totals.mrr.toLocaleString()}`, icon: <FaMoneyBillWave />, accent: true },
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
          <input
            type="text"
            placeholder="Search user or plan…"
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
        <button
          onClick={fetchSubscriptions}
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
            <p className="text-white/25 text-sm">Loading subscriptions…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <FaRobot className="text-white/10 text-3xl" />
            <p className="text-white/25 text-sm">No bot subscriptions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/25 text-[10px] uppercase tracking-widest font-semibold">
                  <th className="px-5 py-3.5 text-left">User</th>
                  <th className="px-5 py-3.5 text-left">Plan</th>
                  <th className="px-5 py-3.5 text-left">Billing</th>
                  <th className="px-5 py-3.5 text-right">Deposit Req.</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-center">Date</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => {
                  const isLoading = (k) => actionLoading === `${k}-${sub.id}`;
                  const status    = sub.approved ? "Approved" : sub.status === "Declined" ? "Declined" : "Pending";
                  const bp        = sub.billing_period || "monthly";
                  const planInfo  = PLANS_BY_PERIOD[bp]?.find((p) => p.name === sub.plan)
                                 || PLANS_BY_PERIOD.monthly.find((p) => p.name === sub.plan);
                  return (
                    <tr key={sub.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-white text-xs font-semibold">{resolveUserName(sub)}</p>
                        {resolveUserEmail(sub) && (
                          <p className="text-white/25 text-[10px] mt-0.5">{resolveUserEmail(sub)}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg border font-semibold ${planBadgeColor[sub.plan] || planBadgeColor.Starter}`}>
                          <FaRobot className="text-[9px]" /> {sub.plan || "—"} Plan
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-md border font-semibold capitalize ${periodBadgeColor[bp] || periodBadgeColor.monthly}`}>
                          {bp}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="text-emerald-400 text-xs font-bold">
                          {planInfo ? planInfo.deposit : "—"}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-5 py-4 text-center text-white/30 text-[11px]">
                        {sub.created_at
                          ? new Date(sub.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {status !== "Approved" && (
                            <button
                              onClick={() => openConfirm("approve", sub)}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/20 text-[10px] font-semibold disabled:opacity-40 transition-colors"
                            >
                              {isLoading("approve") ? <FaSyncAlt className="animate-spin text-[9px]" /> : <FaCheckCircle className="text-[9px]" />}
                              Approve
                            </button>
                          )}
                          {status !== "Declined" && (
                            <button
                              onClick={() => openConfirm("decline", sub)}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 hover:bg-amber-400/20 text-[10px] font-semibold disabled:opacity-40 transition-colors"
                            >
                              {isLoading("decline") ? <FaSyncAlt className="animate-spin text-[9px]" /> : <FaTimesCircle className="text-[9px]" />}
                              Decline
                            </button>
                          )}
                          <button
                            onClick={() => openConfirm("delete", sub)}
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

      <ConfirmModal
        open={confirmModal.open}
        {...(confirmModal.type ? confirmConfig[confirmModal.type] : {})}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModal({ open: false, type: null, sub: null })}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   BOT CARD
───────────────────────────────────────── */
function BotCard({ bot, onToggle, hasActivePlan }) {
  return (
    <div
      className={`relative bg-[#0f0e0e] border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 ${
        bot.active
          ? "border-[#c45a45]/30 shadow-lg shadow-[#c45a45]/5"
          : "border-white/[0.07] hover:border-white/15"
      }`}
    >
      {!hasActivePlan && (
        <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#c45a45]/20 border border-[#c45a45]/40 flex items-center justify-center">
            <FaLock className="text-[#c45a45] text-sm" />
          </div>
          <p className="text-white/60 text-xs font-medium">Subscribe to activate bots</p>
        </div>
      )}

      {bot.active && (
        <span className="absolute top-3 right-3 flex h-2.5 w-2.5 z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
        </span>
      )}

      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${bot.color}18`, border: `1px solid ${bot.color}35` }}
        >
          <FaRobot style={{ color: bot.color }} className="text-base" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white text-sm font-semibold leading-none">{bot.name}</p>
            {bot.locked && (
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-[#c45a45]/15 text-[#c45a45] border border-[#c45a45]/30 font-medium">
                <FaLock className="text-[8px]" /> {bot.tier}
              </span>
            )}
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{ background: `${bot.badgeColor}15`, color: bot.badgeColor, border: `1px solid ${bot.badgeColor}30` }}
            >
              {bot.badge}
            </span>
          </div>
          <p className="text-white/30 text-[11px] mt-1 leading-snug line-clamp-2">{bot.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/40">{bot.type}</span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/40">{bot.market}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ml-auto ${riskBg[bot.risk]}`}>{bot.risk} Risk</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {[
          { label: "ROI",      value: bot.roi,      green: true  },
          { label: "Monthly",  value: bot.monthly,  green: true  },
          { label: "Drawdown", value: bot.drawdown, green: false },
          { label: "Trades",   value: bot.trades,   green: null  },
        ].map((s) => (
          <div key={s.label} className="bg-white/3 border border-white/5 rounded-xl p-2 text-center">
            <p className={`text-xs font-bold leading-none ${
              s.green === true ? "text-emerald-400" : s.green === false ? "text-red-400/80" : "text-white/70"
            }`}>{s.value}</p>
            <p className="text-white/25 text-[9px] mt-1 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-white/30">
          <span className={`w-1.5 h-1.5 rounded-full shadow-sm ${bot.active ? "bg-emerald-400 shadow-emerald-400/60" : "bg-white/20"}`} />
          <span>Uptime {bot.uptime}</span>
        </div>
        <div className="flex gap-2 ml-auto">
          {hasActivePlan && !bot.locked ? (
            <>
              <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/35 hover:text-white/60 hover:bg-white/10 transition-all flex items-center justify-center text-xs">
                <FaCog />
              </button>
              <button
                onClick={() => onToggle(bot)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  bot.active
                    ? "bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25"
                    : "bg-[#c45a45] hover:bg-[#d06a55] text-white shadow-md shadow-[#c45a45]/20"
                }`}
              >
                {bot.active ? <><FaStop className="text-[9px]" /> Stop</> : <><FaPlay className="text-[9px]" /> Start</>}
              </button>
            </>
          ) : (
            <button
              onClick={() => onToggle(bot)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#c45a45]/10 border border-[#c45a45]/30 text-[#c45a45] hover:bg-[#c45a45]/20 transition-colors"
            >
              <FaLock className="text-[9px]" />
              {bot.locked ? `Unlock ${bot.tier}` : "Subscribe to Start"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   BILLING PERIOD TOGGLE
───────────────────────────────────────── */
function BillingToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
      {BILLING_PERIODS.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`relative px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
            value === p
              ? "bg-[#c45a45]/15 border border-[#c45a45]/30 text-white"
              : "text-white/35 hover:text-white/60 border border-transparent"
          }`}
        >
          {p}
          {p === "yearly" && (
            <span className="absolute -top-2.5 -right-1 text-[8px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full leading-none">
              −30%
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   SHARED BOT TRADING VIEW
───────────────────────────────────────── */
function BotTradingView({ isAdmin = false }) {
  const [botList,             setBotList]             = useState(bots);
  const [activeTab,           setActiveTab]           = useState("All");
  const [showPlans,           setShowPlans]           = useState(false);
  const [billingPeriod,       setBillingPeriod]       = useState("monthly");

  const [hasActivePlan,       setHasActivePlan]       = useState(isAdmin);
  const [activePlanName,      setActivePlanName]      = useState(isAdmin ? "Admin" : null);
  const [activeBillingPeriod, setActiveBillingPeriod] = useState(null);
  const [pendingSub,          setPendingSub]          = useState(null);
  const [subLoading,          setSubLoading]          = useState(!isAdmin);
  const [submitLoading,       setSubmitLoading]       = useState(false);
  const [pendingPlan,         setPendingPlan]         = useState(null);

  // FIX 5: Global toast state for the trading view (replaces alert())
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  const plans = PLANS_BY_PERIOD[billingPeriod];
  const displayBots = isAdmin ? botList.map((b) => ({ ...b, locked: false })) : botList;
  const tabs = ["All", "Running", "Idle", "My Bots"];
  const activeCount = displayBots.filter((b) => b.active).length;

  useEffect(() => {
    if (isAdmin) return;
    const fetchActiveSub = async () => {
      try {
        const res = await API.get("bot-subscriptions/my-active/");
        const data = res.data;
        if (data.has_active_plan) {
          setHasActivePlan(true);
          setActivePlanName(data.plan);
          setActiveBillingPeriod(data.billing_period);
          setPendingSub(null);
        } else if (data.pending) {
          setPendingSub(data.pending);
        }
      } catch (err) {
        // 404 or network error — no subscription yet
        console.warn("Could not fetch bot subscription status:", err?.response?.status);
      } finally {
        setSubLoading(false);
      }
    };
    fetchActiveSub();
  }, [isAdmin]);

  const handleBotAction = (bot) => {
    if (!hasActivePlan) { setShowPlans(true); return; }
    setBotList((prev) =>
      prev.map((b) =>
        b.id === bot.id ? { ...b, active: !b.active, status: !b.active ? "running" : "idle" } : b
      )
    );
  };

  // FIX 6: Full error handling with toast instead of alert()
  const handleSelectPlan = async (plan) => {
    setSubmitLoading(true);
    setPendingPlan(plan);
    try {
      await API.post("bot-subscriptions/", {
        plan: plan.name,
        billing_period: plan.billingPeriod,
      });
      setShowPlans(false);

      // Re-fetch subscription state from server
      try {
        const res = await API.get("bot-subscriptions/my-active/");
        const data = res.data;
        if (data.has_active_plan) {
          setHasActivePlan(true);
          setActivePlanName(data.plan);
          setActiveBillingPeriod(data.billing_period);
          setPendingSub(null);
          showToast(`${plan.name} plan request submitted! Awaiting admin approval.`);
        } else if (data.pending) {
          setPendingSub(data.pending);
          showToast(`${plan.name} plan request submitted! Awaiting admin approval.`);
        }
      } catch (fetchErr) {
        // POST succeeded but re-fetch failed — show generic success
        showToast("Plan request submitted! Awaiting admin approval.");
      }
    } catch (err) {
      // FIX 7: Use the robust error extractor instead of alert()
      const msg = extractErrorMessage(err);
      showToast(msg, "error");
    } finally {
      setSubmitLoading(false);
      setPendingPlan(null);
    }
  };

  const filtered = displayBots.filter((b) => {
    if (activeTab === "Running") return b.active;
    if (activeTab === "Idle")    return !b.active && !b.locked;
    if (activeTab === "My Bots") return !b.locked;
    return true;
  });

  if (subLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#c45a45]/30 border-t-[#c45a45] animate-spin" />
        <p className="text-white/30 text-sm">Checking subscription status…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} />

      {/* Admin notice */}
      {isAdmin && (
        <div className="flex items-start gap-2.5 bg-[#c45a45]/5 border border-[#c45a45]/15 rounded-xl px-4 py-3 text-xs text-white/50">
          <FaInfoCircle className="text-[#c45a45]/60 shrink-0 mt-0.5" />
          <span>
            You are trading as <span className="text-white font-semibold">Admin</span>. All bots are unlocked and subscription gates are bypassed.
          </span>
        </div>
      )}

      {/* Active plan badge */}
      {hasActivePlan && !isAdmin && activePlanName && (
        <div className="flex items-center gap-2.5 bg-emerald-400/8 border border-emerald-400/20 rounded-xl px-4 py-3">
          <FaCheckCircle className="text-emerald-400 text-sm shrink-0" />
          <div className="flex-1">
            <p className="text-emerald-300 text-xs font-semibold">
              {activePlanName} Plan Active
              {activeBillingPeriod && (
                <span className="ml-2 text-emerald-400/60 font-normal capitalize">· {activeBillingPeriod}</span>
              )}
            </p>
            <p className="text-white/40 text-[11px] mt-0.5">Your bots are live and ready to deploy.</p>
          </div>
          <button
            onClick={() => setShowPlans(true)}
            className="text-[11px] text-emerald-400/70 hover:text-emerald-400 transition-colors underline underline-offset-2"
          >
            Change plan
          </button>
        </div>
      )}

      {/* Pending approval banner */}
      {!hasActivePlan && pendingSub && !isAdmin && (
        <div className="flex items-start gap-3 bg-blue-400/8 border border-blue-400/20 rounded-xl px-4 py-3.5">
          <FaClock className="text-blue-400 text-sm shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-300 text-xs font-semibold">Subscription Pending Admin Approval</p>
            <p className="text-white/40 text-[11px] mt-0.5">
              Your{" "}
              <span className="text-white/60 font-medium capitalize">
                {pendingSub.plan} ({pendingSub.billing_period})
              </span>{" "}
              plan request is being reviewed. Bots will unlock once approved.
            </p>
          </div>
        </div>
      )}

      {/* No subscription — prompt to subscribe */}
      {!hasActivePlan && !pendingSub && !isAdmin && (
        <div className="flex items-start gap-3 bg-amber-400/8 border border-amber-400/20 rounded-xl px-4 py-3.5">
          <FaInfoCircle className="text-amber-400 text-sm shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 text-xs font-semibold">Deposit Required to Activate AI Bots</p>
            <p className="text-white/40 text-[11px] mt-0.5">
              Plans start at <span className="text-white/60 font-medium">$15/wk · $49/mo · $410/yr</span> + min. deposit.
            </p>
            <button
              onClick={() => setShowPlans(true)}
              className="mt-2 text-[11px] text-amber-400 underline underline-offset-2 hover:text-amber-300 transition-colors"
            >
              View plans →
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Bots",      value: `${activeCount} / ${bots.length}`, icon: <FaRobot />    },
          { label: "Est. Monthly PnL", value: "+$4,821.00",                       icon: <FaChartLine />},
          { label: "Avg. Win Rate",    value: "76.4%",                            icon: <FaBolt />     },
          { label: "Lowest Drawdown",  value: "0.9%",                             icon: <FaShieldAlt />},
        ].map((s) => (
          <div key={s.label} className="bg-[#0f0e0e] border border-white/[0.07] rounded-2xl px-4 py-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#c45a45]/12 border border-[#c45a45]/20 flex items-center justify-center text-[#c45a45] text-xs shrink-0">
              {s.icon}
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-none">{s.value}</p>
              <p className="text-white/30 text-[10px] mt-0.5 uppercase tracking-wide">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/[0.07] pb-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? "border-[#c45a45] text-white"
                : "border-transparent text-white/35 hover:text-white/60"
            }`}
          >
            {tab}
            {tab === "Running" && activeCount > 0 && (
              <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-400">
                {activeCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((bot) => (
          <BotCard key={bot.id} bot={bot} onToggle={handleBotAction} hasActivePlan={hasActivePlan} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/25">
          <FaRobot className="text-4xl mx-auto mb-3 opacity-30" />
          <p className="text-sm">No bots in this category.</p>
        </div>
      )}

      {/* Plans Modal */}
      {showPlans && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141212] border border-white/8 w-full max-w-5xl rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 relative space-y-6">
            <button
              onClick={() => setShowPlans(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FaTimes size={14} />
            </button>

            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#c45a45] bg-[#c45a45]/10 px-2.5 py-1 rounded-md">
                Subscription Required
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">AI Bot Compute Plans</h2>
              <p className="text-white/40 text-xs md:text-sm">
                Your request is reviewed by admin. Bots unlock instantly once approved.
              </p>
            </div>

            <div className="flex justify-center">
              <BillingToggle value={billingPeriod} onChange={setBillingPeriod} />
            </div>

            <p className="text-center text-white/25 text-[11px] -mt-2">
              {billingPeriod === "weekly"  && "Billed every 7 days. Cancel anytime."}
              {billingPeriod === "monthly" && "Billed once per month. Cancel anytime."}
              {billingPeriod === "yearly"  && "Billed annually. Save ~30% vs monthly pricing."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {plans.map((plan) => {
                const isSubmitting = submitLoading && pendingPlan?.name === plan.name;
                return (
                  <div
                    key={plan.name}
                    className={`relative rounded-xl p-5 border flex flex-col justify-between transition-all duration-300 ${
                      plan.popular
                        ? "bg-[#1c1818] border-[#c45a45]/40 shadow-xl shadow-[#c45a45]/5"
                        : "bg-[#0f0e0e] border-white/6 hover:border-white/15"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider bg-[#c45a45] text-white px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                        Most Popular
                      </span>
                    )}
                    {billingPeriod === "yearly" && (
                      <span className="absolute -top-2.5 right-4 text-[9px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
                        Save 30%
                      </span>
                    )}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-100">{plan.name} Plan</h3>
                        <p className="text-white/30 text-[11px] mt-1 leading-snug">{plan.description}</p>
                      </div>
                      <div className="bg-white/3 border border-white/6 rounded-xl p-3 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-white tracking-tight">{plan.price}</span>
                            <span className="text-white/40 text-xs font-medium">{plan.period}</span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold capitalize ${periodBadgeColor[billingPeriod]}`}>
                            {billingPeriod}
                          </span>
                        </div>
                        <div className="border-t border-white/6 pt-2 flex items-center justify-between">
                          <span className="text-[10px] text-white/40 uppercase tracking-wide">Min. Deposit</span>
                          <span className="text-emerald-400 font-bold text-sm">{plan.deposit}</span>
                        </div>
                      </div>
                      <ul className="space-y-2.5 pt-1">
                        {plan.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2 text-[11px] text-slate-300">
                            <FaCheckCircle className="text-emerald-400 mt-0.5 shrink-0 text-[10px]" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={submitLoading}
                      className={`w-full mt-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait ${
                        plan.popular
                          ? "bg-[#c45a45] hover:bg-[#d06a55] text-white shadow-md shadow-[#c45a45]/20"
                          : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                      }`}
                    >
                      <FaWallet className="text-[10px]" />
                      {isSubmitting ? "Submitting…" : `Request ${plan.name} Plan`}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-white/5 pt-4">
              <p className="text-center text-white/20 text-[10px] uppercase tracking-widest mb-3">Price comparison</p>
              <div className="grid grid-cols-3 gap-3">
                {BILLING_PERIODS.map((bp) => (
                  <button
                    key={bp}
                    onClick={() => setBillingPeriod(bp)}
                    className={`rounded-xl border p-3 text-center transition-all ${
                      billingPeriod === bp
                        ? "border-[#c45a45]/30 bg-[#c45a45]/8"
                        : "border-white/5 bg-white/2 hover:border-white/15"
                    }`}
                  >
                    <p className={`text-[10px] tracking-wider font-semibold mb-1.5 capitalize ${billingPeriod === bp ? "text-white/60" : "text-white/25"}`}>{bp}</p>
                    {PLANS_BY_PERIOD[bp].map((p) => (
                      <div key={p.name} className="flex items-center justify-between text-[10px] py-0.5">
                        <span className="text-white/30">{p.name}</span>
                        <span className={`font-semibold ${billingPeriod === bp ? "text-white/70" : "text-white/25"}`}>{p.price}<span className="text-white/25 font-normal">{p.period}</span></span>
                      </div>
                    ))}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   ADMIN WRAPPER
───────────────────────────────────────── */
function AdminBotsView() {
  const [activeTab, setActiveTab] = useState("manage");

  const tabs = [
    { key: "manage", label: "Manage Subscriptions", icon: <FaUsers className="text-[11px]" /> },
    { key: "trade",  label: "Use Bots",             icon: <FaRobot className="text-[11px]" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center">
              <FaRobot className="text-[#c45a45] text-sm" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Trading Bots</h1>
          </div>
          <p className="text-white/30 text-sm ml-12">
            {activeTab === "manage"
              ? "Review and approve user bot subscription payments."
              : "Deploy and control bots directly as admin."}
          </p>
        </div>
        <div className="flex gap-1.5 bg-[#0f0e0e] border border-white/8 rounded-xl p-1 self-start md:self-center">
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
      {activeTab === "manage" ? <AdminManageBots /> : <BotTradingView isAdmin={true} />}
    </div>
  );
}

/* ─────────────────────────────────────────
   USER VIEW
───────────────────────────────────────── */
function UserBotsView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center">
              <FaRobot className="text-[#c45a45] text-sm" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Trading Bots</h1>
          </div>
          <p className="text-white/35 text-sm ml-12">
            Deploy autonomous bots that trade 24/7 using machine learning signals.
          </p>
        </div>
      </div>
      <BotTradingView isAdmin={false} />
    </div>
  );
}

/* ─────────────────────────────────────────
   ROOT
───────────────────────────────────────── */
function AITradingBots() {
  const role    = localStorage.getItem("role");
  const isAdmin = role === "admin";

  return (
    <DashboardLayout>
      <div className="text-white p-5 md:p-7 max-w-7xl mx-auto">
        {isAdmin ? <AdminBotsView /> : <UserBotsView />}
      </div>
    </DashboardLayout>
  );
}

export default AITradingBots;