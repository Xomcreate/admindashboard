import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import {
  FaUsers,
  FaLink,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCopy,
  FaSearch,
  FaSyncAlt,
  FaTrash,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaUserPlus,
  FaChartLine,
  FaInfoCircle,
  FaGift,
  FaNetworkWired,
} from "react-icons/fa";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const resolveUserName = (ref) => {
  if (ref.referred_name && ref.referred_name.trim()) return ref.referred_name.trim();
  if (ref.referred_user) {
    const u = ref.referred_user;
    if (u.first_name || u.last_name) return `${u.first_name || ""} ${u.last_name || ""}`.trim();
    if (u.full_name) return u.full_name.trim();
    if (u.username) return u.username.trim();
    if (u.email) return u.email.trim();
  }
  return ref.referred_email || "Unknown User";
};

const resolveUserEmail = (ref) => {
  if (ref.referred_email) return ref.referred_email;
  if (ref.referred_user?.email) return ref.referred_user.email;
  return "";
};

const resolveReferrerName = (ref) => {
  if (ref.referrer_name && ref.referrer_name.trim()) return ref.referrer_name.trim();
  if (ref.referrer) {
    const u = ref.referrer;
    if (u.first_name || u.last_name) return `${u.first_name || ""} ${u.last_name || ""}`.trim();
    if (u.username) return u.username.trim();
    if (u.email) return u.email.trim();
  }
  return ref.referrer_email || "—";
};

const statusStyle = {
  active:   "bg-emerald-400/10 text-emerald-400 border-emerald-400/25",
  pending:  "bg-amber-400/10 text-amber-400 border-amber-400/25",
  inactive: "bg-white/5 text-white/40 border-white/10",
  expired:  "bg-orange-400/10 text-orange-400 border-orange-400/25",
};

const StatusBadge = ({ status }) => {
  const s = (status || "pending").toLowerCase();
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md border font-semibold capitalize ${statusStyle[s] || statusStyle.pending}`}>
      {s === "active"   && <FaCheckCircle className="text-[9px]" />}
      {s === "pending"  && <FaClock       className="text-[9px]" />}
      {s === "inactive" && <FaTimesCircle className="text-[9px]" />}
      {s === "expired"  && <FaTimesCircle className="text-[9px]" />}
      {s}
    </span>
  );
};

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
   ADMIN — MANAGE REFERRALS
───────────────────────────────────────── */
function AdminManageReferrals() {
  const [referrals,     setReferrals]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [filterStatus,  setFilterStatus]  = useState("All");
  const [actionLoading, setActionLoading] = useState(null);
  const [toast,         setToast]         = useState(null);
  const [confirmModal,  setConfirmModal]  = useState({ open: false, type: null, ref: null });

  useEffect(() => { fetchReferrals(); }, []);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const res = await API.get("referrals/");
      setReferrals(res.data);
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

  const handleApprove = async (ref) => {
    setActionLoading(`approve-${ref.id}`);
    try {
      await API.patch(`referrals/${ref.id}/`, { status: "active", approved: true });
      setReferrals((prev) =>
        prev.map((r) => r.id === ref.id ? { ...r, status: "active", approved: true } : r)
      );
      showToast(`Referral for ${resolveUserName(ref)} approved.`);
    } catch (err) {
      showToast(err.response?.data?.detail || "Approval failed.", "error");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, ref: null });
    }
  };

  const handleDecline = async (ref) => {
    setActionLoading(`decline-${ref.id}`);
    try {
      await API.patch(`referrals/${ref.id}/`, { status: "inactive", approved: false });
      setReferrals((prev) =>
        prev.map((r) => r.id === ref.id ? { ...r, status: "inactive", approved: false } : r)
      );
      showToast("Referral declined.", "error");
    } catch (err) {
      showToast(err.response?.data?.detail || "Decline failed.", "error");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, ref: null });
    }
  };

  const handleDelete = async (ref) => {
    setActionLoading(`delete-${ref.id}`);
    try {
      await API.delete(`referrals/${ref.id}/`);
      setReferrals((prev) => prev.filter((r) => r.id !== ref.id));
      showToast("Referral record deleted.", "error");
    } catch (err) {
      showToast(err.response?.data?.detail || "Delete failed.", "error");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, ref: null });
    }
  };

  const openConfirm   = (type, ref) => setConfirmModal({ open: true, type, ref });
  const handleConfirm = () => {
    const { type, ref } = confirmModal;
    if (type === "approve") handleApprove(ref);
    else if (type === "decline") handleDecline(ref);
    else if (type === "delete")  handleDelete(ref);
  };

  const filtered = referrals.filter((r) => {
    const name    = resolveUserName(r).toLowerCase();
    const email   = resolveUserEmail(r).toLowerCase();
    const referee = resolveReferrerName(r).toLowerCase();
    const matchSearch =
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      referee.includes(search.toLowerCase());
    const s = (r.status || "pending").toLowerCase();
    const matchStatus =
      filterStatus === "All" ||
      filterStatus.toLowerCase() === s;
    return matchSearch && matchStatus;
  });

  const totals = {
    all:      referrals.length,
    active:   referrals.filter((r) => (r.status || "").toLowerCase() === "active").length,
    pending:  referrals.filter((r) => !r.status || (r.status || "").toLowerCase() === "pending").length,
    inactive: referrals.filter((r) => (r.status || "").toLowerCase() === "inactive").length,
    earnings: referrals
      .filter((r) => (r.status || "").toLowerCase() === "active")
      .reduce((acc, r) => acc + parseFloat(r.commission || r.earnings || 0), 0),
  };

  const confirmConfig = {
    approve: {
      title: "Approve Referral",
      message: "This will mark the referral as active and credit the referrer's commission.",
      confirmLabel: "Approve",
      confirmClass: "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25",
    },
    decline: {
      title: "Decline Referral",
      message: "This will mark the referral as inactive and no commission will be credited.",
      confirmLabel: "Decline",
      confirmClass: "bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25",
    },
    delete: {
      title: "Delete Referral Record",
      message: "This permanently removes this referral record. This cannot be undone.",
      confirmLabel: "Delete",
      confirmClass: "bg-red-500 hover:bg-red-600 text-white",
    },
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total",    value: totals.all,                                        icon: <FaNetworkWired />, accent: false },
          { label: "Active",   value: totals.active,                                     icon: <FaCheckCircle />,  accent: false, highlight: "text-emerald-400" },
          { label: "Pending",  value: totals.pending,                                    icon: <FaClock />,        accent: false, highlight: "text-amber-400" },
          { label: "Inactive", value: totals.inactive,                                   icon: <FaTimesCircle />,  accent: false, highlight: "text-white/40" },
          { label: "Commissions Paid", value: `$${totals.earnings.toFixed(2)}`,          icon: <FaMoneyBillWave />, accent: true },
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
            placeholder="Search user, email or referrer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f0e0e] border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c45a45]/40 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Active", "Pending", "Inactive"].map((f) => (
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
                  ({f === "Active" ? totals.active : f === "Pending" ? totals.pending : totals.inactive})
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={fetchReferrals}
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
            <p className="text-white/25 text-sm">Loading referrals…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <FaNetworkWired className="text-white/10 text-3xl" />
            <p className="text-white/25 text-sm">No referral records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/25 text-[10px] uppercase tracking-widest font-semibold">
                  <th className="px-5 py-3.5 text-left">Referred User</th>
                  <th className="px-5 py-3.5 text-left">Referred By</th>
                  <th className="px-5 py-3.5 text-right">Commission</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-center">Date</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ref) => {
                  const isLoading = (k) => actionLoading === `${k}-${ref.id}`;
                  const status    = (ref.status || "pending").toLowerCase();
                  return (
                    <tr key={ref.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-white text-xs font-semibold">{resolveUserName(ref)}</p>
                        {resolveUserEmail(ref) && (
                          <p className="text-white/25 text-[10px] mt-0.5">{resolveUserEmail(ref)}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#c45a45]/15 border border-[#c45a45]/25 flex items-center justify-center shrink-0">
                            <FaUserPlus className="text-[#c45a45] text-[8px]" />
                          </div>
                          <p className="text-white/70 text-xs font-medium">{resolveReferrerName(ref)}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="text-emerald-400 text-xs font-bold">
                          ${parseFloat(ref.commission || ref.earnings || 0).toFixed(2)}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-5 py-4 text-center text-white/30 text-[11px]">
                        {ref.created_at
                          ? new Date(ref.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {status !== "active" && (
                            <button
                              onClick={() => openConfirm("approve", ref)}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/20 text-[10px] font-semibold disabled:opacity-40 transition-colors"
                            >
                              {isLoading("approve") ? <FaSyncAlt className="animate-spin text-[9px]" /> : <FaCheckCircle className="text-[9px]" />}
                              Approve
                            </button>
                          )}
                          {status !== "inactive" && (
                            <button
                              onClick={() => openConfirm("decline", ref)}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 hover:bg-amber-400/20 text-[10px] font-semibold disabled:opacity-40 transition-colors"
                            >
                              {isLoading("decline") ? <FaSyncAlt className="animate-spin text-[9px]" /> : <FaTimesCircle className="text-[9px]" />}
                              Decline
                            </button>
                          )}
                          <button
                            onClick={() => openConfirm("delete", ref)}
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
        onCancel={() => setConfirmModal({ open: false, type: null, ref: null })}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   USER REFERRAL VIEW
───────────────────────────────────────── */
function UserReferralView() {
  const [copied, setCopied]   = useState(false);
  const [stats,  setStats]    = useState({ referred: 0, active: 0, earnings: "0.00" });
  const [loading, setLoading] = useState(true);

  const referralLink = "https://admindashboard-ruddy-beta.vercel.app/dashboard/register?ref=USER123";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("referrals/my-stats/");
        setStats({
          referred: res.data.total_referred  ?? 0,
          active:   res.data.active_contracts ?? 0,
          earnings: parseFloat(res.data.total_earnings || 0).toFixed(2),
        });
      } catch {
        // silently fall back to zeros
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  return (
    <div className="space-y-7">
      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Referred",    value: loading ? "—" : `${stats.referred} Users`,  icon: <FaUsers />,     color: "text-white" },
          { label: "Active Contracts",  value: loading ? "—" : `${stats.active} Active`,   icon: <FaChartLine />, color: "text-emerald-400" },
          { label: "Total Earnings",    value: loading ? "—" : `$${stats.earnings}`,       icon: <FaGift />,      color: "text-[#c45a45]" },
        ].map((s) => (
          <div key={s.label} className="bg-[#0f0e0e] border border-white/[0.07] rounded-2xl px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#c45a45]/12 border border-[#c45a45]/20 flex items-center justify-center text-[#c45a45] shrink-0">
              {s.icon}
            </div>
            <div>
              <p className={`text-xl font-bold leading-none ${s.color}`}>{s.value}</p>
              <p className="text-white/30 text-[10px] mt-1 uppercase tracking-wide">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Referral Link Card */}
      <div className="bg-[#0f0e0e] border border-white/[0.07] rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide">Your Unique Invitation Link</h2>
          <p className="text-white/30 text-xs mt-0.5">
            Share this link. New registrations via this link are automatically attached to your referral ledger.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="flex-1 bg-[#171515] border border-white/8 p-3.5 rounded-xl text-xs font-mono break-all text-white/50 flex items-center min-h-11">
            {referralLink}
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 shadow-md whitespace-nowrap min-w-32 ${
              copied
                ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20"
                : "bg-[#c45a45] hover:bg-[#d06a55] shadow-[#c45a45]/20"
            }`}
          >
            {copied ? <><FaCheckCircle className="text-[10px]" /> Copied!</> : <><FaCopy className="text-[10px]" /> Copy Link</>}
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-[#0f0e0e] border border-white/[0.07] rounded-2xl p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-5">How it works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Share Your Link",
              desc: "Distribute your invitation link to prospective investors and network traders.",
            },
            {
              step: "02",
              title: "They Register",
              desc: "Referred users complete registration via your link — they're automatically tracked.",
            },
            {
              step: "03",
              title: "Earn Commission",
              desc: "Receive commission allocations whenever your referrals activate investment contracts.",
            },
          ].map((step, i) => (
            <div key={step.step} className={`space-y-2 ${i > 0 ? "md:border-l border-white/6 md:pl-6" : ""}`}>
              <span className="text-[#c45a45] font-black text-sm">{step.step}.</span>
              <p className="font-semibold text-white text-sm">{step.title}</p>
              <p className="text-white/35 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info notice */}
      <div className="flex items-start gap-3 bg-[#c45a45]/5 border border-[#c45a45]/15 rounded-xl px-4 py-3.5">
        <FaInfoCircle className="text-[#c45a45]/60 text-sm shrink-0 mt-0.5" />
        <p className="text-white/40 text-xs leading-relaxed">
          Commission rates and payout schedules are governed by your active plan tier. Contact support for full program terms.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ADMIN WRAPPER — tab-aware
───────────────────────────────────────── */
function AdminReferralsView() {
  const [activeTab, setActiveTab] = useState("manage");

  const tabs = [
    { key: "manage", label: "Manage Referrals", icon: <FaNetworkWired className="text-[11px]" /> },
    { key: "view",   label: "My Referrals",      icon: <FaLink         className="text-[11px]" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center">
              <FaNetworkWired className="text-[#c45a45] text-sm" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Affiliate Program</h1>
          </div>
          <p className="text-white/30 text-sm ml-12">
            {activeTab === "manage"
              ? "Review and manage all platform referral records."
              : "Your personal referral link and commission stats."}
          </p>
        </div>

        {/* Tab Toggle */}
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

      {activeTab === "manage" ? <AdminManageReferrals /> : <UserReferralView />}
    </div>
  );
}

/* ─────────────────────────────────────────
   USER WRAPPER
───────────────────────────────────────── */
function UserReferralPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center">
          <FaNetworkWired className="text-[#c45a45] text-sm" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Affiliate Program</h1>
          <p className="text-white/35 text-sm">
            Invite new investors and earn recurring commission on their active contracts.
          </p>
        </div>
      </div>
      <UserReferralView />
    </div>
  );
}

/* ─────────────────────────────────────────
   ROOT
───────────────────────────────────────── */
function Referrals() {
  const role    = localStorage.getItem("role");
  const isAdmin = role === "admin";

  return (
    <DashboardLayout>
      <div className="text-white p-5 md:p-7 max-w-7xl mx-auto">
        {isAdmin ? <AdminReferralsView /> : <UserReferralPage />}
      </div>
    </DashboardLayout>
  );
}

export default Referrals;