import React, { useState, useEffect } from "react";
import {
  FaUserShield, FaSearch, FaCheckCircle, FaTimesCircle,
  FaClock, FaEye, FaTimes, FaIdCard, FaDownload, FaFilter,
} from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

/* ─── Status config ─── */
const STATUS_CONFIG = {
  pending:  { bg: "bg-yellow-500/10",  text: "text-yellow-400",  border: "border-yellow-500/20",  icon: <FaClock />,       label: "Pending"  },
  approved: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", icon: <FaCheckCircle />, label: "Approved" },
  rejected: { bg: "bg-red-500/10",     text: "text-red-400",     border: "border-red-500/20",     icon: <FaTimesCircle />, label: "Rejected" },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className="text-[9px]">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
};

/* ─── Stat Card ─── */
const StatCard = ({ label, value, icon, accent = false, highlight = "text-white" }) => (
  <div className={`bg-[#1f1b1b] border rounded-xl px-4 py-4 flex items-center gap-3 transition-all duration-200 ${
    accent ? "border-[#c45a45]/30 shadow-lg shadow-[#c45a45]/5" : "border-[#2e2726] hover:border-[#c45a45]/20"
  }`}>
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
      accent
        ? "bg-[#c45a45]/15 border border-[#c45a45]/30 text-[#c45a45]"
        : "bg-[#121010] border border-[#2e2726] text-[#9e9593]"
    }`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[#9e9593] text-[10px] uppercase tracking-widest mb-0.5 truncate">{label}</p>
      <p className={`text-lg font-bold leading-none truncate ${highlight}`}>{value}</p>
    </div>
  </div>
);

/* ─── Document Preview Modal ─── */
const DocPreviewModal = ({ submission, onClose, onApprove, onReject, actioning }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const docs = [
    { label: "ID Front",      url: submission.id_front },
    { label: "ID Back",        url: submission.id_back  },
    { label: "Selfie with ID", url: submission.selfie   },
  ].filter(d => d.url);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)" }}
      className="flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#0b0e11] border border-[#2e2726] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2e2726] bg-[#131720]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center">
              <FaIdCard className="text-[#c45a45]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{submission.name}</p>
              <p className="text-[11px] text-[#9e9593] mt-0.5">
                {submission.email} · {submission.doc_type_display || submission.doc}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={submission.status} />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 border border-[#2e2726] text-[#9e9593] hover:text-white flex items-center justify-center transition-colors"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        </div>

        {/* Document grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {docs.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-[#9e9593] text-xs">
              No documents on file.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {docs.map(doc => (
                <div key={doc.label} className="bg-[#121010] border border-[#2e2726] rounded-xl overflow-hidden">
                  <div className="aspect-video flex items-center justify-center bg-[#0d0c0c] relative group">
                    <img
                      src={doc.url}
                      alt={doc.label}
                      className="w-full h-full object-contain"
                      onError={e => { e.target.style.display = "none"; }}
                    />
                    
                    <a
                      href={doc.url}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaDownload className="text-white text-lg" />
                    </a>
                  </div>
                  <p className="text-[10px] font-bold text-[#9e9593] uppercase tracking-widest px-3 py-2 text-center">
                    {doc.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Submission meta */}
          <div className="mt-4 bg-[#121010] border border-[#2e2726] rounded-xl p-4 grid grid-cols-2 gap-3">
            {[
              { label: "Submitted", value: submission.submitted },
              { label: "Document",  value: submission.doc_type_display || submission.doc },
              { label: "Status",    value: submission.status },
              { label: "User ID",   value: `#${submission.id}` },
            ].map(m => (
              <div key={m.label}>
                <p className="text-[10px] text-[#9e9593] uppercase tracking-widest mb-0.5">{m.label}</p>
                <p className="text-xs font-semibold text-white capitalize">{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        {submission.status === "pending" && (
          <div className="flex gap-2 px-5 py-4 border-t border-[#2e2726] bg-[#131720]">
            <button
              onClick={() => onApprove(submission.id)}
              disabled={actioning === submission.id}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all disabled:opacity-50"
            >
              {actioning === submission.id ? "Processing…" : "✓ Approve"}
            </button>
            <button
              onClick={() => onReject(submission.id)}
              disabled={actioning === submission.id}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
            >
              {actioning === submission.id ? "Processing…" : "✕ Reject"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════ */
function Kycverify() {
  const [filter,    setFilter]    = useState("all");
  const [search,    setSearch]    = useState("");
  const [kycList,   setKycList]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [previewId, setPreviewId] = useState(null); 
  const [actioning, setActioning] = useState(null);

  /* ── Fetch KYC submissions ── */
  useEffect(() => {
    const fetchKyc = async () => {
      try {
        const res = await API.get("kyc/all/");
        setKycList(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchKyc();
  }, []);

  /* ── Approve / Reject ── */
  const handleApprove = async (id) => {
    setActioning(id);
    try {
      await API.post(`kyc/${id}/approve/`);
      setKycList(prev => prev.map(k => k.id === id ? { ...k, status: "approved" } : k));
    } catch (e) { 
      console.error(e); 
    } finally { 
      setActioning(null); 
    }
  };

  const handleReject = async (id) => {
    setActioning(id);
    try {
      await API.post(`kyc/${id}/reject/`);
      setKycList(prev => prev.map(k => k.id === id ? { ...k, status: "rejected" } : k));
    } catch (e) { 
      console.error(e); 
    } finally { 
      setActioning(null); 
    }
  };

  /* ── Derived counts ── */
  const total    = kycList.length;
  const pending  = kycList.filter(k => k.status === "pending").length;
  const approved = kycList.filter(k => k.status === "approved").length;
  const rejected = kycList.filter(k => k.status === "rejected").length;

  /* ── Filtered list ── */
  const filtered = kycList.filter(k => {
    const matchFilter = filter === "all" || k.status === filter;
    const matchSearch = !search ||
      (k.name  || "").toLowerCase().includes(search.toLowerCase()) ||
      (k.email || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Dynamically resolve preview data directly from updated state list
  const activePreviewItem = kycList.find(k => k.id === previewId);

  return (
    <DashboardLayout>
      <div className="text-white space-y-5 pb-8">

        {/* ── PAGE HEADER ── */}
        <div className="relative bg-[#1f1b1b] border border-[#2e2726] rounded-2xl px-6 py-5 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#c45a45]/8 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[#9e9593] text-xs uppercase tracking-widest mb-1">Admin Panel</p>
              <h1 className="text-2xl font-bold text-white leading-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center shrink-0">
                  <FaUserShield className="text-[#c45a45]" />
                </div>
                KYC Verification
              </h1>
              <p className="text-[#9e9593] text-xs mt-2">Review and manage user identity submissions.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {pending} Awaiting Review
              </span>
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Requests" value={total}    icon={<FaUserShield />}  accent={true} />
          <StatCard label="Pending"        value={pending}  icon={<FaClock />}        highlight="text-yellow-400" />
          <StatCard label="Approved"       value={approved} icon={<FaCheckCircle />}  highlight="text-emerald-400" />
          <StatCard label="Rejected"       value={rejected} icon={<FaTimesCircle />}  highlight="text-red-400" />
        </div>

        {/* ── MAIN TABLE CARD ── */}
        <div className="bg-[#1f1b1b] border border-[#2e2726] rounded-2xl overflow-hidden">

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-[#2e2726]">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FaFilter className="text-[#c45a45] text-xs" /> Submissions
              </h2>
              <p className="text-[11px] text-[#9e9593] mt-0.5">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} shown
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9593] text-[10px]" />
                <input
                  type="text"
                  placeholder="Search name or email…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-4 py-2 rounded-xl bg-[#121010] border border-[#2e2726] outline-none text-xs text-white placeholder-[#9e9593] focus:border-[#c45a45]/40 transition-colors w-full sm:w-52"
                />
              </div>
              <div className="flex gap-1.5">
                {["all", "pending", "approved", "rejected"].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-bold border transition-all duration-150 capitalize ${
                      filter === f
                        ? "bg-[#c45a45]/15 border-[#c45a45]/40 text-[#c45a45]"
                        : "bg-[#121010] border-[#2e2726] text-[#9e9593] hover:border-[#c45a45]/25 hover:text-white"
                    }`}
                  >
                    {f}
                    {f !== "all" && (
                      <span className="ml-1.5 text-[9px] opacity-60">
                        {f === "pending" ? pending : f === "approved" ? approved : rejected}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table body */}
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-[#9e9593] text-xs">
              <div className="w-5 h-5 rounded-full border-2 border-[#c45a45]/30 border-t-[#c45a45] animate-spin" />
              Loading submissions…
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#9e9593]">
              <FaUserShield className="text-3xl opacity-20" />
              <p className="text-xs italic">No submissions match this filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-[#121010] text-[#9e9593] uppercase text-[10px] font-bold tracking-wider border-b border-[#2e2726]">
                    <th className="px-5 py-4">Investor</th>
                    <th className="px-5 py-4">Document</th>
                    <th className="px-5 py-4 text-center">Status</th>
                    <th className="px-5 py-4">Submitted</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(user => (
                    <tr key={user.id} className="border-t border-[#2e2726] hover:bg-[#2e2726]/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#c45a45]/10 border border-[#c45a45]/20 flex items-center justify-center text-[#c45a45] text-[10px] font-black shrink-0">
                            {(user.name || "?")[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate">{user.name}</p>
                            <p className="text-[#9e9593] text-[10px] mt-0.5 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-[#9e9593]">
                          <FaIdCard className="text-[10px] shrink-0" />
                          <span className="truncate">{user.doc_type_display || user.doc}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-5 py-4 text-[#9e9593]">{user.submitted}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setPreviewId(user.id)}
                            className="w-7 h-7 rounded-lg bg-[#121010] border border-[#2e2726] text-[#9e9593] hover:border-[#c45a45]/40 hover:text-[#c45a45] flex items-center justify-center transition-all"
                            title="View documents"
                          >
                            <FaEye className="text-[10px]" />
                          </button>
                          {user.status !== "approved" && (
                            <button
                              onClick={() => handleApprove(user.id)}
                              disabled={actioning === user.id}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                            >
                              {actioning === user.id ? "…" : "Approve"}
                            </button>
                          )}
                          {user.status !== "rejected" && (
                            <button
                              onClick={() => handleReject(user.id)}
                              disabled={actioning === user.id}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
                            >
                              {actioning === user.id ? "…" : "Reject"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#2e2726] text-[10px] text-[#9e9593]">
            <span>{filtered.length} of {total} submissions</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
        </div>

        {/* ── DOC PREVIEW MODAL ── */}
        {activePreviewItem && (
          <DocPreviewModal
            submission={activePreviewItem}
            actioning={actioning}
            onApprove={handleApprove}
            onReject={handleReject}
            onClose={() => setPreviewId(null)}
          />
        )}

      </div>
    </DashboardLayout>
  );
}

export default Kycverify;