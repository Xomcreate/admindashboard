import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import Loader from "../MainComponets/Loader";

function getTier(count) {
  if (count >= 6) return "diamond";
  if (count >= 3) return "gold";
  if (count >= 1) return "silver";
  return "none";
}

const TIER_STYLE = {
  silver:  { bg: "bg-slate-400/15",  text: "text-slate-200",  border: "border-slate-400/30",  label: "🥈 Silver"  },
  gold:    { bg: "bg-amber-500/20",  text: "text-amber-300",  border: "border-amber-500/40",  label: "🥇 Gold"    },
  diamond: { bg: "bg-purple-500/20", text: "text-purple-300", border: "border-purple-500/30", label: "💎 Diamond" },
  none:    { bg: "bg-[#242020]",     text: "text-[#9e9593]",  border: "border-[#242020]",     label: "No Tier"    },
};

function TierBadge({ tier }) {
  const s = TIER_STYLE[tier] || TIER_STYLE.none;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      {s.label}
    </span>
  );
}

const getStatus = (inv) => {
  if (!inv.approved) return "pending";
  if (inv.active)    return "active";
  return "completed";
};

function StatusBadge({ investment }) {
  const s = getStatus(investment);
  const map = {
    active:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    pending:   "bg-amber-500/15  text-amber-400  border-amber-500/30",
    completed: "bg-[#9e9593]/15  text-[#9e9593]  border-[#9e9593]/30",
  };
  const labels = { active: "Active", pending: "Pending", completed: "Completed" };
  return (
    <span className={`border px-3 py-1 rounded-full text-xs font-medium inline-block text-center w-24 ${map[s]}`}>
      {labels[s]}
    </span>
  );
}

export default function Investments() {
  const [investments,   setInvestments]   = useState([]);
  const [investors,     setInvestors]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [tab,           setTab]           = useState("pending");
  const [profitModal,   setProfitModal]   = useState(null);
  const [profitAmount,  setProfitAmount]  = useState("");
  const [profitLoading, setProfitLoading] = useState(false);
  const [search,        setSearch]        = useState("");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchInvestments(), fetchInvestors()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvestments = async () => {
    const res = await API.get("investments/");
    setInvestments(res.data);
  };

  const fetchInvestors = async () => {
    const res = await API.get("investors/");
    setInvestors(res.data);
  };

  const approveInvestment = async (id) => {
    try {
      await API.post(`investments/${id}/approve/`);
      fetchInvestments();
    } catch {
      alert("Failed to approve investment.");
    }
  };

  const deleteInvestment = async (id) => {
    if (!window.confirm("Delete this investment permanently?")) return;
    try {
      await API.delete(`investments/${id}/`);
      fetchInvestments();
    } catch {
      alert("Failed to delete investment.");
    }
  };

  const submitManualProfit = async (e) => {
    e.preventDefault();
    if (!profitAmount || isNaN(profitAmount) || Number(profitAmount) <= 0) {
      alert("Enter a valid profit amount.");
      return;
    }
    setProfitLoading(true);
    try {
      await API.post(`investments/${profitModal.id}/add_profit/`, { amount: profitAmount });
      alert("Profit added and investment closed.");
      setProfitModal(null);
      fetchInvestments();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add profit.");
    } finally {
      setProfitLoading(false);
    }
  };

  const getInvestorName = (id) => investors.find((i) => i.id === id)?.name ?? `#${id}`;
  const getInvestorTier = (investorId) => getTier(investments.filter((i) => i.investor === investorId).length);

  const pendingList   = investments.filter((i) => !i.approved);
  const activeList    = investments.filter((i) => i.approved && i.active);
  const completedList = investments.filter((i) => i.approved && !i.active);

  const tabMap = { pending: pendingList, active: activeList, completed: completedList, all: investments };
  const baseList = tabMap[tab] || investments;

  const displayList = search.trim()
    ? baseList.filter((i) =>
        getInvestorName(i.investor).toLowerCase().includes(search.toLowerCase()) ||
        i.category.toLowerCase().includes(search.toLowerCase())
      )
    : baseList;

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <div className="text-white font-sans max-w-6xl mx-auto space-y-6 pb-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-wide">Investments</h1>
            <p className="text-[#9e9593] text-sm mt-1">
              Review and approve investment contracts submitted by users.
            </p>
          </div>
          <button
            onClick={fetchAll}
            className="self-start sm:self-auto bg-[#211e1e] hover:bg-[#2d2929] border border-[#332d2c] text-[#9e9593] hover:text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
          >
            ↻ Refresh
          </button>
        </div>

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total",     value: investments.length,   color: "text-white"         },
            { label: "Pending",   value: pendingList.length,   color: "text-amber-400"     },
            { label: "Active",    value: activeList.length,    color: "text-emerald-400"   },
            { label: "Completed", value: completedList.length, color: "text-[#9e9593]"     },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#211e1e] border border-[#332d2c] rounded-xl p-4">
              <p className="text-[#9e9593] text-xs uppercase tracking-wider mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs + Search ── */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "pending",   label: "Pending",   count: pendingList.length   },
              { key: "active",    label: "Active",    count: activeList.length    },
              { key: "completed", label: "Completed", count: completedList.length },
              { key: "all",       label: "All",       count: investments.length   },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === key
                    ? "bg-[#c45a45] text-white"
                    : "bg-[#211e1e] border border-[#332d2c] text-[#9e9593] hover:border-[#c45a45]/50 hover:text-white"
                }`}
              >
                {label}
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${tab === key ? "bg-white/20" : "bg-[#332d2c]"}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search investor or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#211e1e] border border-[#332d2c] text-white placeholder-[#9e9593] text-sm px-4 py-2 rounded-lg focus:outline-none focus:border-[#c45a45] transition-colors w-full sm:w-64"
          />
        </div>

        {/* ── Table ── */}
        <div className="bg-[#211e1e] border border-[#332d2c] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#171515] text-[#9e9593] uppercase text-xs tracking-wider">
                  {["Investor", "Tier", "Category", "Amount", "Daily ROI", "Profit", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left border-b border-[#332d2c] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayList.length > 0 ? displayList.map((inv, idx) => (
                  <tr
                    key={inv.id}
                    className={`border-b border-[#332d2c] hover:bg-[#2a2525]/60 transition-colors ${
                      idx % 2 === 0 ? "" : "bg-[#1c1919]/40"
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                      {getInvestorName(inv.investor)}
                    </td>
                    <td className="px-4 py-3">
                      <TierBadge tier={getInvestorTier(inv.investor)} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white text-xs font-medium">{inv.category}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-white whitespace-nowrap">
                      ${Number(inv.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-bold text-[#c45a45]">{inv.daily_roi}%</td>
                    <td className="px-4 py-3 font-semibold text-purple-400 whitespace-nowrap">
                      ${Number(inv.current_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge investment={inv} />
                    </td>
                    <td className="px-4 py-3 text-[#9e9593] whitespace-nowrap text-xs">
                      {new Date(inv.created_at).toLocaleDateString(undefined, {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {!inv.approved && (
                          <button
                            onClick={() => approveInvestment(inv.id)}
                            className="bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-semibold px-3 py-1.5 rounded-md transition-all whitespace-nowrap"
                          >
                            ✓ Approve
                          </button>
                        )}
                        <button
                          onClick={() => { setProfitModal(inv); setProfitAmount(""); }}
                          className="bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-white border border-amber-500/30 text-xs font-semibold px-3 py-1.5 rounded-md transition-all whitespace-nowrap"
                        >
                          + Profit
                        </button>
                        <button
                          onClick={() => deleteInvestment(inv.id)}
                          className="bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-semibold px-3 py-1.5 rounded-md transition-all"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="9" className="text-center py-16 text-[#9e9593] italic">
                      {search ? "No results match your search." : `No ${tab === "all" ? "" : tab} investments found.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── Manual Profit Modal ── */}
      {profitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#211e1e] w-full max-w-md rounded-xl border border-[#332d2c] shadow-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-1">Add Manual Profit</h2>
            <p className="text-[#9e9593] text-sm mb-5">
              This will close the investment and credit the full payout (principal + profit) to the investor's wallet.
            </p>

            <div className="bg-[#171515] border border-[#332d2c] rounded-lg p-4 mb-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#9e9593]">Investor</span>
                <span className="text-white font-semibold">{getInvestorName(profitModal.investor)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9e9593]">Category</span>
                <span className="text-white font-semibold">{profitModal.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9e9593]">Principal</span>
                <span className="text-white font-semibold">${Number(profitModal.amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-[#332d2c] pt-2">
                <span className="text-[#9e9593]">Current Profit</span>
                <span className="text-purple-400 font-semibold">
                  ${Number(profitModal.current_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <form onSubmit={submitManualProfit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#9e9593] uppercase tracking-wider mb-1.5">
                  Additional Profit to Add ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9e9593] font-semibold">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    autoFocus
                    className="w-full bg-[#171515] border border-[#332d2c] pl-8 pr-4 py-3 rounded-lg text-white placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45] transition-colors"
                    value={profitAmount}
                    onChange={(e) => setProfitAmount(e.target.value)}
                    required
                  />
                </div>
                {profitAmount && Number(profitAmount) > 0 && (
                  <p className="text-xs text-[#9e9593] mt-1.5">
                    Total payout to wallet:{" "}
                    <span className="text-emerald-400 font-bold">
                      ${(Number(profitModal.amount) + Number(profitModal.current_profit) + Number(profitAmount)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={profitLoading}
                  className="flex-1 bg-[#c45a45] hover:bg-[#a64633] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {profitLoading ? "Processing…" : "Confirm & Close Investment"}
                </button>
                <button
                  type="button"
                  onClick={() => setProfitModal(null)}
                  className="flex-1 bg-[#171515] hover:bg-[#2a2525] border border-[#332d2c] text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}