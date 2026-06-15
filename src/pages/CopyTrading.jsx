import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import {
  FaExchangeAlt,
  FaChartLine,
  FaUserCircle,
  FaCheckCircle,
  FaSearch,
  FaShieldAlt,
  FaUsers,
  FaTrophy,
  FaTimes,
  FaWallet,
  FaInfoCircle,
  FaTimesCircle,
  FaClock,
  FaSyncAlt,
  FaTrash,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaStopCircle,
  FaHourglassHalf,
} from "react-icons/fa";

/* ─────────────────────────────────────────
   SHARED TRADER LIST
───────────────────────────────────────── */
const traders = [
  {
    id: 1,
    name: "Alex Mercer",
    handle: "@alexm_trades",
    avatar: "AM",
    roi: "+184.3%",
    roiPositive: true,
    winRate: "78%",
    followers: "12.4K",
    risk: "Medium",
    tags: ["Forex", "Gold"],
    monthlyReturn: "+18.2%",
    badge: "Top Performer",
    color: "#c45a45",
    tier: "Starter",
    minCapital: "$1,000",
    maxCapital: "$500,000",
    duration: "14 Days",
    activeTrades: 143,
  },
  {
    id: 2,
    name: "Sofia Chen",
    handle: "@sofia_quant",
    avatar: "SC",
    roi: "+231.7%",
    roiPositive: true,
    winRate: "83%",
    followers: "28.1K",
    risk: "Low",
    tags: ["Stocks", "ETFs"],
    monthlyReturn: "+22.5%",
    badge: "Elite",
    color: "#d4875a",
    tier: "Pro",
    minCapital: "$2,000",
    maxCapital: "$750,000",
    duration: "30 Days",
    activeTrades: 89,
  },
  {
    id: 3,
    name: "Raj Patel",
    handle: "@raj_algo",
    avatar: "RP",
    roi: "+97.6%",
    roiPositive: true,
    winRate: "71%",
    followers: "7.8K",
    risk: "High",
    tags: ["Crypto", "Futures"],
    monthlyReturn: "+9.8%",
    badge: "Rising Star",
    color: "#9b6ab5",
    tier: "Starter",
    minCapital: "$500",
    maxCapital: "$250,000",
    duration: "7 Days",
    activeTrades: 312,
  },
  {
    id: 4,
    name: "Elena Kovacs",
    handle: "@elena_macro",
    avatar: "EK",
    roi: "+312.0%",
    roiPositive: true,
    winRate: "88%",
    followers: "41.3K",
    risk: "Low",
    tags: ["Indices", "Forex"],
    monthlyReturn: "+28.1%",
    badge: "Legend",
    color: "#c45a45",
    tier: "Institutional",
    minCapital: "$10,000",
    maxCapital: "$2,000,000",
    duration: "30 Days",
    activeTrades: 42,
  },
  {
    id: 5,
    name: "Marcus Webb",
    handle: "@mwebb_scalp",
    avatar: "MW",
    roi: "+143.8%",
    roiPositive: true,
    winRate: "69%",
    followers: "9.2K",
    risk: "High",
    tags: ["Crypto", "Stocks"],
    monthlyReturn: "+14.6%",
    badge: "Top Performer",
    color: "#5a8fc4",
    tier: "Pro",
    minCapital: "$1,000",
    maxCapital: "$375,000",
    duration: "14 Days",
    activeTrades: 207,
  },
  {
    id: 6,
    name: "Nadia Osei",
    handle: "@nadia_swing",
    avatar: "NO",
    roi: "+189.2%",
    roiPositive: true,
    winRate: "76%",
    followers: "15.6K",
    risk: "Medium",
    tags: ["Forex", "Commodities"],
    monthlyReturn: "+17.9%",
    badge: "Verified",
    color: "#4db89b",
    tier: "Starter",
    minCapital: "$500",
    maxCapital: "$300,000",
    duration: "21 Days",
    activeTrades: 178,
  },
];

/* Map plan -> minimum required deposit (mirrors backend COPY_TRADING_PLAN_DEPOSITS) */
const COPY_PLAN_DEPOSITS = {
  Starter: 500,
  Pro: 2000,
  Institutional: 10000,
};
const COPY_PLAN_FEES = {
  Starter: 49,
  Pro: 149,
  Institutional: 499,
};
const COPY_PLAN_ORDER = ["Starter", "Pro", "Institutional"];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const resolveUserName = (sub) => {
  if (sub.user_name && sub.user_name.trim()) return sub.user_name.trim();
  if (sub.user) {
    const u = sub.user;
    if (u.first_name || u.last_name) return `${u.first_name || ""} ${u.last_name || ""}`.trim();
    if (u.full_name) return u.full_name.trim();
    if (u.username) return u.username.trim();
    if (u.email) return u.email.trim();
  }
  return sub.user_email || "Unknown User";
};

const resolveUserEmail = (sub) => {
  if (sub.user_email) return sub.user_email;
  if (sub.user?.email) return sub.user.email;
  return "";
};

/* Returns a friendly "Xd Yh left" / "Ends today" string from copy_ends_at */
const formatTimeRemaining = (endsAt) => {
  if (!endsAt) return null;
  const end = new Date(endsAt).getTime();
  const now = Date.now();
  const diffMs = end - now;
  if (diffMs <= 0) return "Ending soon";

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h left`;
  return "Less than 1h left";
};

const statusStyle = {
  Pending:  "bg-amber-400/10 text-amber-400 border-amber-400/25",
  Approved: "bg-emerald-400/10 text-emerald-400 border-emerald-400/25",
  Declined: "bg-red-400/10 text-red-400 border-red-400/25",
  Expired:  "bg-white/10 text-white/40 border-white/15",
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md border font-semibold ${statusStyle[status] || statusStyle.Pending}`}>
    {status === "Approved" && <FaCheckCircle className="text-[9px]" />}
    {status === "Declined" && <FaTimesCircle className="text-[9px]" />}
    {status === "Pending"  && <FaClock className="text-[9px]" />}
    {status === "Expired"  && <FaHourglassHalf className="text-[9px]" />}
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
   INVEST / SUBSCRIBE MODAL
   Creates a CopyTradingSubscription (plan + copied_trader)
───────────────────────────────────────── */
function InvestModal({ open, trader, onConfirm, onCancel, loading, error }) {
  const [plan, setPlan] = useState("Starter");

  useEffect(() => {
    if (open && trader) {
      setPlan(trader.tier && COPY_PLAN_ORDER.includes(trader.tier) ? trader.tier : "Starter");
    }
  }, [open, trader]);

  if (!open || !trader) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#141212] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2"
              style={{
                background:  `${trader.color}22`,
                borderColor: `${trader.color}55`,
                color:        trader.color,
              }}
            >
              {trader.avatar}
            </div>
            <div>
              <p className="text-white text-sm font-bold">{trader.name}</p>
              <p className="text-white/30 text-[11px]">{trader.handle}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white/30 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <FaTimes size={13} />
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Win Rate",  value: trader.winRate,      green: true },
            { label: "Duration",  value: trader.duration },
            { label: "Min Cap",   value: trader.minCapital },
          ].map(({ label, value, green }) => (
            <div key={label} className="bg-[#0f0e0e] border border-white/6 rounded-xl px-2 py-2.5 text-center">
              <p className="text-[9px] text-white/30 uppercase tracking-wide">{label}</p>
              <p className={`text-xs font-bold mt-0.5 ${green ? "text-emerald-400" : "text-white/80"}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Plan selection */}
        <div className="space-y-2">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Copy Trading Plan</p>
          <div className="grid grid-cols-3 gap-2">
            {COPY_PLAN_ORDER.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlan(p)}
                className={`rounded-xl border px-2 py-2.5 text-center transition-all ${
                  plan === p
                    ? "border-[#c45a45]/50 bg-[#c45a45]/10"
                    : "border-white/8 bg-[#0f0e0e] hover:border-white/20"
                }`}
              >
                <p className={`text-xs font-bold ${plan === p ? "text-white" : "text-white/60"}`}>{p}</p>
                <p className="text-[10px] text-white/30 mt-0.5">${COPY_PLAN_FEES[p]}/mo</p>
                <p className="text-[9px] text-emerald-400 mt-0.5">
                  Min ${COPY_PLAN_DEPOSITS[p].toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-3 py-2.5 text-xs text-red-400">
            <FaTimesCircle className="shrink-0 text-[10px]" /> {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white/50 hover:bg-white/8 hover:text-white/70 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(plan)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{
              background: `linear-gradient(135deg, ${trader.color}cc, #4eca8b99)`,
              color: "#fff",
            }}
          >
            {loading ? (
              <><FaSyncAlt className="animate-spin text-[10px]" /> Submitting…</>
            ) : (
              <><FaWallet className="text-[10px]" /> Subscribe & Copy</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ADMIN — MANAGE COPY TRADING SUBSCRIPTIONS
───────────────────────────────────────── */
function AdminManageCopyTrading() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [filterStatus, setFilterStatus]   = useState("All");
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast]                 = useState(null);
  const [confirmModal, setConfirmModal]   = useState({ open: false, type: null, sub: null });

  useEffect(() => { fetchSubscriptions(); }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await API.get("copy-trading-subscriptions/");
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
      const res = await API.patch(`copy-trading-subscriptions/${sub.id}/`, {
        status: "Approved",
      });
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === sub.id ? res.data : s))
      );
      showToast(`Subscription for ${resolveUserName(sub)} approved. Copy session started.`);
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.detail || "Approval failed.", "error");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, sub: null });
    }
  };

  const handleDecline = async (sub) => {
    setActionLoading(`decline-${sub.id}`);
    try {
      const res = await API.patch(`copy-trading-subscriptions/${sub.id}/`, {
        status: "Declined",
      });
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === sub.id ? res.data : s))
      );
      showToast("Subscription declined.", "error");
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.detail || "Decline failed.", "error");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, sub: null });
    }
  };

  const handleDelete = async (sub) => {
    setActionLoading(`delete-${sub.id}`);
    try {
      await API.delete(`copy-trading-subscriptions/${sub.id}/`);
      setSubscriptions((prev) => prev.filter((s) => s.id !== sub.id));
      showToast("Subscription record deleted.");
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.detail || "Delete failed.", "error");
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
    else if (type === "delete") handleDelete(sub);
  };

  const filtered = subscriptions.filter((s) => {
    const name  = resolveUserName(s).toLowerCase();
    const email = resolveUserEmail(s).toLowerCase();
    const matchSearch =
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      (s.plan || "").toLowerCase().includes(search.toLowerCase());

    const subStatus = s.status || (s.approved ? "Approved" : "Pending");

    const matchStatus =
      filterStatus === "All" ||
      (filterStatus === "Pending"  && subStatus === "Pending") ||
      (filterStatus === "Approved" && subStatus === "Approved") ||
      (filterStatus === "Declined" && subStatus === "Declined") ||
      (filterStatus === "Expired"  && subStatus === "Expired");
    return matchSearch && matchStatus;
  });

  const totals = {
    all:      subscriptions.length,
    pending:  subscriptions.filter((s) => (s.status || "Pending") === "Pending").length,
    approved: subscriptions.filter((s) => (s.status || "") === "Approved").length,
    declined: subscriptions.filter((s) => (s.status || "") === "Declined").length,
    expired:  subscriptions.filter((s) => (s.status || "") === "Expired").length,
  };

  const confirmConfig = {
    approve: {
      title:        "Approve Subscription",
      message:      "This will activate the copy trading plan and start the copy session for the plan's duration.",
      confirmLabel: "Approve",
      confirmClass: "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25",
    },
    decline: {
      title:        "Decline Subscription",
      message:      "This will reject the copy trading subscription request and stop any active copy session.",
      confirmLabel: "Decline",
      confirmClass: "bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25",
    },
    delete: {
      title:        "Delete Record",
      message:      "This permanently removes the subscription record. This cannot be undone.",
      confirmLabel: "Delete",
      confirmClass: "bg-red-500 hover:bg-red-600 text-white",
    },
  };

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
          { label: "Total",    value: totals.all,      icon: <FaExchangeAlt />,  highlight: "" },
          { label: "Pending",  value: totals.pending,  icon: <FaClock />,        highlight: "text-amber-400" },
          { label: "Approved", value: totals.approved, icon: <FaCheckCircle />,  highlight: "text-emerald-400" },
          { label: "Declined", value: totals.declined, icon: <FaTimesCircle />,  highlight: "text-red-400" },
          { label: "Expired",  value: totals.expired,  icon: <FaHourglassHalf />, highlight: "text-white/50" },
        ].map((s) => (
          <div key={s.label} className="bg-[#0f0e0e] border border-white/[0.07] rounded-xl px-4 py-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 bg-white/5 border border-white/8 text-white/30">
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
            placeholder="Search user or plan…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f0e0e] border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c45a45]/40 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "Approved", "Declined", "Expired"].map((f) => (
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
                  ({f === "Pending" ? totals.pending : f === "Approved" ? totals.approved : f === "Declined" ? totals.declined : totals.expired})
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
            <FaExchangeAlt className="text-white/10 text-3xl" />
            <p className="text-white/25 text-sm">No copy trading subscriptions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/25 text-[10px] uppercase tracking-widest font-semibold">
                  <th className="px-5 py-3.5 text-left">User</th>
                  <th className="px-5 py-3.5 text-left">Plan</th>
                  <th className="px-5 py-3.5 text-left">Copying</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-center">Time Left</th>
                  <th className="px-5 py-3.5 text-center">Date</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => {
                  const isLoading = (k) => actionLoading === `${k}-${sub.id}`;
                  const subStatus = sub.status || (sub.approved ? "Approved" : "Pending");
                  const timeLeft = subStatus === "Approved" ? formatTimeRemaining(sub.copy_ends_at) : null;
                  return (
                    <tr key={sub.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-white text-xs font-semibold">{resolveUserName(sub)}</p>
                        {resolveUserEmail(sub) && (
                          <p className="text-white/25 text-[10px] mt-0.5">{resolveUserEmail(sub)}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg border font-semibold bg-white/8 border-white/15 text-white/60">
                          <FaExchangeAlt className="text-[9px]" /> {sub.plan || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-white/50 text-[11px]">{sub.copied_trader || "—"}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={subStatus} />
                      </td>
                      <td className="px-5 py-4 text-center text-white/40 text-[11px]">
                        {timeLeft || "—"}
                      </td>
                      <td className="px-5 py-4 text-center text-white/30 text-[11px]">
                        {sub.created_at
                          ? new Date(sub.created_at).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {subStatus !== "Approved" && (
                            <button
                              onClick={() => openConfirm("approve", sub)}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/20 text-[10px] font-semibold disabled:opacity-40 transition-colors"
                            >
                              {isLoading("approve") ? (
                                <FaSyncAlt className="animate-spin text-[9px]" />
                              ) : (
                                <FaCheckCircle className="text-[9px]" />
                              )}
                              Approve
                            </button>
                          )}
                          {subStatus !== "Declined" && (
                            <button
                              onClick={() => openConfirm("decline", sub)}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 hover:bg-amber-400/20 text-[10px] font-semibold disabled:opacity-40 transition-colors"
                            >
                              {isLoading("decline") ? (
                                <FaSyncAlt className="animate-spin text-[9px]" />
                              ) : (
                                <FaTimesCircle className="text-[9px]" />
                              )}
                              {subStatus === "Approved" ? "Stop" : "Decline"}
                            </button>
                          )}
                          <button
                            onClick={() => openConfirm("delete", sub)}
                            disabled={!!actionLoading}
                            className="w-7 h-7 rounded-lg bg-red-500/8 border border-red-500/15 text-red-400/50 hover:text-red-400 hover:bg-red-500/15 flex items-center justify-center disabled:opacity-40 transition-colors"
                          >
                            {isLoading("delete") ? (
                              <FaSyncAlt className="animate-spin text-[9px]" />
                            ) : (
                              <FaTrash className="text-[9px]" />
                            )}
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
   TRADER CARD
───────────────────────────────────────── */
function TraderCard({ trader, onInvest, copyingState }) {
  const stats = [
    { label: "Min.\nCapital",  value: trader.minCapital   || "$1,000" },
    { label: "Max.\nCapital",  value: trader.maxCapital   || "$500,000" },
    { label: "Duration",       value: trader.duration     || "14 Days" },
    { label: "Win\nPercent",   value: trader.winRate,      green: true },
    { label: "Followers",      value: trader.followers },
    { label: "Active\nTrades", value: trader.activeTrades || "—" },
  ];

  const { isCopying, status, timeLeft, stopping } = copyingState || {};

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#c45a45]/30 transition-all duration-300 flex flex-col">
      {/* Avatar + name */}
      <div className="flex flex-col items-center pt-5 pb-4 px-4 border-b border-[#2a2a2a]">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-base mb-2 border-2"
          style={{
            background:  `${trader.color}22`,
            borderColor: `${trader.color}55`,
            color:        trader.color,
          }}
        >
          {trader.avatar}
        </div>
        <p className="text-sm font-semibold" style={{ color: trader.color }}>
          {trader.name}
        </p>
        <p className="text-white/30 text-[11px] mt-0.5">{trader.handle}</p>

        {/* Badge */}
        <span
          className="mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
          style={{
            background:  `${trader.color}18`,
            borderColor: `${trader.color}40`,
            color:        trader.color,
          }}
        >
          {trader.badge}
        </span>
      </div>

      {/* 3×2 stat grid */}
      <div className="grid grid-cols-3 divide-x divide-y divide-[#252525]">
        {stats.map(({ label, value, green }) => (
          <div key={label} className="bg-[#161616] px-2 py-3 text-center">
            <p className="text-[9px] text-white/30 uppercase tracking-wide whitespace-pre-line leading-tight">
              {label}
            </p>
            <p className={`text-[13px] font-bold mt-1 ${green ? "text-emerald-400" : "text-white/80"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Status / Invest button */}
      <div className="px-4 py-4 mt-auto space-y-2">
        {status === "Pending" && (
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg py-1.5">
            <FaClock className="text-[9px]" /> Subscription Pending Approval
          </div>
        )}

        {isCopying && timeLeft && (
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400/80 bg-emerald-400/5 border border-emerald-400/15 rounded-lg py-1.5">
            <FaHourglassHalf className="text-[9px]" /> {timeLeft}
          </div>
        )}

        <button
          onClick={() => onInvest(trader)}
          disabled={status === "Pending" || stopping}
          className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isCopying
              ? "transparent"
              : `linear-gradient(135deg, ${trader.color}cc, #4eca8b99)`,
            border: isCopying ? `1px solid ${trader.color}55` : "none",
            color:  isCopying ? trader.color : "#fff",
          }}
        >
          {stopping ? (
            <><FaSyncAlt className="animate-spin text-xs" /> Stopping…</>
          ) : isCopying ? (
            <><FaStopCircle className="text-xs" /> Copying — Click to Stop</>
          ) : status === "Pending" ? (
            <><FaClock className="text-xs" /> Awaiting Approval</>
          ) : (
            <><FaWallet className="text-xs" /> Invest / Copy</>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SHARED COPY TRADING VIEW
───────────────────────────────────────── */
function CopyTradingView({ isAdmin = false }) {
  const [filter, setFilter]           = useState("All");
  const [search, setSearch]           = useState("");
  const [investModal, setInvestModal] = useState({ open: false, trader: null });
  const [investLoading, setInvestLoading] = useState(false);
  const [investError, setInvestError]     = useState("");
  const [toast, setToast]                 = useState(null);
  const [mySubscriptions, setMySubscriptions] = useState([]);
  const [loadingSubs, setLoadingSubs]         = useState(!isAdmin);
  const [stoppingId, setStoppingId]           = useState(null);

  const filters = ["All", "Low Risk", "High ROI", "Most Followed"];

  // Fetch the current user's own copy-trading subscriptions so state survives refresh
  useEffect(() => {
    if (isAdmin) return;
    fetchMySubscriptions();
  }, [isAdmin]);

  const fetchMySubscriptions = async () => {
    setLoadingSubs(true);
    try {
      const res = await API.get("copy-trading-subscriptions/");
      setMySubscriptions(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubs(false);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Find the subscription (if any) tied to a given trader.
  // Prefer an active (Approved) or Pending sub over old Declined/Expired ones.
  const getSubFor = (trader) => {
    const subsForTrader = mySubscriptions.filter((s) => s.copied_trader === trader.name);
    if (subsForTrader.length === 0) return null;
    const live = subsForTrader.find((s) => s.status === "Approved" || s.status === "Pending");
    return live || subsForTrader[0];
  };

  const openInvest = (trader) => {
    const existing = getSubFor(trader);

    if (existing && existing.status === "Approved") {
      // Already copying — stop the active subscription
      handleStopCopying(existing, trader);
      return;
    }

    if (existing && existing.status === "Pending") {
      // Already awaiting approval, do nothing
      return;
    }

    setInvestError("");
    setInvestModal({ open: true, trader });
  };

  const handleStopCopying = async (sub, trader) => {
    setStoppingId(sub.id);
    try {
      const res = await API.patch(`copy-trading-subscriptions/${sub.id}/`, {
        status: "Declined",
      });
      setMySubscriptions((prev) => prev.map((s) => (s.id === sub.id ? res.data : s)));
      showToast(`Stopped copying ${trader.name}.`, "info");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Could not stop copy trading. Please try again.";
      showToast(msg, "error");
    } finally {
      setStoppingId(null);
    }
  };

  const handleInvestConfirm = async (plan) => {
    const { trader } = investModal;
    setInvestLoading(true);
    setInvestError("");
    try {
      const res = await API.post("copy-trading-subscriptions/", {
        plan,
        copied_trader: trader.name,
      });
      setMySubscriptions((prev) => [res.data, ...prev]);
      setInvestModal({ open: false, trader: null });
      showToast(
        `Subscription request submitted for ${plan} plan — copying ${trader.name}. Awaiting admin approval.`
      );
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        (Array.isArray(err.response?.data) ? err.response.data.join(" ") : null) ||
        "Subscription failed. Please try again.";
      setInvestError(msg);
    } finally {
      setInvestLoading(false);
    }
  };

  const copyingCount = mySubscriptions.filter((s) => s.status === "Approved").length;

  const filtered = traders.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.handle.toLowerCase().includes(search.toLowerCase());
    if (filter === "Low Risk")       return t.risk === "Low" && matchSearch;
    if (filter === "High ROI")       return parseFloat(t.roi) > 150 && matchSearch;
    if (filter === "Most Followed")  return parseInt(t.followers) > 10 && matchSearch;
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl ${
          toast.type === "error"
            ? "bg-red-500/10 border-red-500/25 text-red-400"
            : toast.type === "info"
            ? "bg-blue-500/10 border-blue-500/25 text-blue-400"
            : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
        }`}>
          {toast.type === "error" ? <FaTimesCircle /> : <FaCheckCircle />}
          {toast.msg}
        </div>
      )}

      {/* Admin notice */}
      {isAdmin && (
        <div className="flex items-start gap-2.5 bg-[#c45a45]/5 border border-[#c45a45]/15 rounded-xl px-4 py-3 text-xs text-white/50">
          <FaInfoCircle className="text-[#c45a45]/60 shrink-0 mt-0.5" />
          <span>
            You are trading as <span className="text-white font-semibold">Admin</span>. All traders are available.
          </span>
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Copies", value: copyingCount, icon: <FaUsers /> },
          { label: "Avg. ROI",      value: "+18.4%",     icon: <FaChartLine /> },
          { label: "Top Trader",    value: "Elena K.",   icon: <FaTrophy /> },
          { label: "Protected",     value: "Insured",    icon: <FaShieldAlt /> },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#0f0e0e] border border-white/[0.07] rounded-2xl px-4 py-3.5 flex items-center gap-3"
          >
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

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs" />
          <input
            type="text"
            placeholder="Search traders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f0e0e] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#c45a45]/40 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 border ${
                filter === f
                  ? "bg-[#c45a45]/15 border-[#c45a45]/35 text-white"
                  : "bg-transparent border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {copyingCount > 0 && (
          <div className="md:ml-auto flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 self-start md:self-center">
            <FaCheckCircle className="text-[10px]" /> {copyingCount} Active {copyingCount === 1 ? "Copy" : "Copies"}
          </div>
        )}
      </div>

      {/* Traders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((trader) => {
          const sub = isAdmin ? null : getSubFor(trader);
          const copyingState = {
            isCopying: sub?.status === "Approved",
            status: sub?.status,
            timeLeft: sub?.status === "Approved" ? formatTimeRemaining(sub.copy_ends_at) : null,
            stopping: stoppingId === sub?.id,
          };
          return (
            <TraderCard
              key={trader.id}
              trader={trader}
              onInvest={openInvest}
              copyingState={copyingState}
            />
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/25">
          <FaSearch className="text-4xl mx-auto mb-3 opacity-30" />
          <p className="text-sm">No traders match your search.</p>
        </div>
      )}

      {/* Invest Modal */}
      <InvestModal
        open={investModal.open}
        trader={investModal.trader}
        onConfirm={handleInvestConfirm}
        onCancel={() => { setInvestModal({ open: false, trader: null }); setInvestError(""); }}
        loading={investLoading}
        error={investError}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   ADMIN WRAPPER
───────────────────────────────────────── */
function AdminCopyTradingView() {
  const [activeTab, setActiveTab] = useState("manage");

  const tabs = [
    { key: "manage", label: "Manage Subscriptions", icon: <FaUsers className="text-[11px]" /> },
    { key: "trade",  label: "Copy Trade",            icon: <FaExchangeAlt className="text-[11px]" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center">
              <FaExchangeAlt className="text-[#c45a45] text-sm" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Copy Trading</h1>
          </div>
          <p className="text-white/30 text-sm ml-12">
            {activeTab === "manage"
              ? "Review and manage user copy trading subscriptions."
              : "Mirror top traders directly as admin."}
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

      {activeTab === "manage" ? <AdminManageCopyTrading /> : <CopyTradingView isAdmin={true} />}
    </div>
  );
}

/* ─────────────────────────────────────────
   USER VIEW
───────────────────────────────────────── */
function UserCopyTradingView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center">
              <FaExchangeAlt className="text-[#c45a45] text-sm" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Copy Trading</h1>
          </div>
          <p className="text-white/35 text-sm ml-12">
            Mirror top traders automatically and share in their profits.
          </p>
        </div>
      </div>
      <CopyTradingView isAdmin={false} />
    </div>
  );
}

/* ─────────────────────────────────────────
   ROOT
───────────────────────────────────────── */
function CopyTrading() {
  const role    = localStorage.getItem("role");
  const isAdmin = role === "admin";

  return (
    <DashboardLayout>
      <div className="text-white p-5 md:p-7 max-w-7xl mx-auto">
        {isAdmin ? <AdminCopyTradingView /> : <UserCopyTradingView />}
      </div>
    </DashboardLayout>
  );
}

export default CopyTrading;