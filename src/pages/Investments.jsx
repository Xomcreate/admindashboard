import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import Loader from "../MainComponets/Loader";

const PLAN_CATEGORIES = [
  "Silver Plan",
  "Gold Plan",
  "Diamond Plan",
];

const PLAN_META = {
  "Silver Plan":  { color: "#94a3b8", bg: "bg-slate-400/15",   border: "border-slate-400/30",   label: "🥈 Silver"  },
  "Gold Plan":    { color: "#f59e0b", bg: "bg-amber-400/15",   border: "border-amber-400/30",   label: "🥇 Gold"    },
  "Diamond Plan": { color: "#a78bfa", bg: "bg-violet-400/15",  border: "border-violet-400/30",  label: "💎 Diamond" },
};

const getStatus = (investment) => {
  if (!investment.approved) return "pending";
  if (investment.active)    return "active";
  return "expired";
};

const StatusBadge = ({ investment }) => {
  const s = getStatus(investment);
  if (s === "active")
    return <span className="bg-[#0b66e4]/15 text-[#0b66e4] border border-[#0b66e4]/30 px-3 py-1 rounded-full text-xs font-medium">Active</span>;
  if (s === "pending")
    return <span className="bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-medium">Pending</span>;
  return <span className="bg-orange-500/15 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-medium">Expired</span>;
};

function Investments() {
  const [investments, setInvestments] = useState([]);
  const [investors,   setInvestors]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [tab,         setTab]         = useState("all");
  const [form, setForm] = useState({
    investor: "", amount: "", category: "Silver Plan", active: true,
  });

  const [profitModal,  setProfitModal]  = useState(null);
  const [profitAmount, setProfitAmount] = useState("");
  const [profitLoading, setProfitLoading] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      await Promise.all([fetchInvestments(), fetchInvestors()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvestments = async () => {
    try {
      const res = await API.get("investments/");
      setInvestments(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchInvestors = async () => {
    try {
      const res = await API.get("investors/");
      setInvestors(res.data);
    } catch (e) { console.error(e); }
  };

  const createInvestment = async (e) => {
    e.preventDefault();
    try {
      await API.post("investments/", {
        investor: form.investor,
        amount:   form.amount,
        category: form.category,
      });
      alert("Investment Created Successfully");
      setForm({ investor: "", amount: "", category: "Silver Plan", active: true });
      fetchInvestments();
    } catch (err) {
      const msg = err.response?.data?.amount?.[0] || "Failed to create investment";
      alert(msg);
    }
  };

  const approveInvestment = async (id) => {
    try {
      await API.post(`investments/${id}/approve/`);
      fetchInvestments();
    } catch (e) {
      alert("Failed to approve.");
    }
  };

  const deleteInvestment = async (id) => {
    if (!window.confirm("Delete this investment?")) return;
    try {
      await API.delete(`investments/${id}/`);
      fetchInvestments();
    } catch (e) { console.error(e); }
  };

  const openProfitModal = (inv) => {
    setProfitModal(inv);
    setProfitAmount("");
  };

  const submitManualProfit = async (e) => {
    e.preventDefault();
    if (!profitAmount || isNaN(profitAmount) || Number(profitAmount) <= 0) {
      alert("Please enter a valid profit amount.");
      return;
    }
    setProfitLoading(true);
    try {
      await API.post(`investments/${profitModal.id}/add_profit/`, {
        amount: profitAmount,
      });
      alert("Profit added successfully.");
      setProfitModal(null);
      fetchInvestments();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to add profit.";
      alert(msg);
    } finally {
      setProfitLoading(false);
    }
  };

  const getInvestorName = (id) => {
    const found = investors.find((inv) => inv.id === id);
    return found ? found.name : `#${id}`;
  };

  const pendingList = investments.filter((i) => !i.approved);
  const displayList = tab === "pending" ? pendingList : investments;

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <div className="text-white font-sans max-w-6xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold tracking-wide">Investments</h1>
          <p className="text-[#8f9cae] text-sm mt-1">
            Manage and approve investment contracts. All plans earn <span className="text-[#10b981] font-semibold">25% daily ROI</span> for <span className="text-white font-semibold">120 days</span>. Withdrawals are locked until maturity.
          </p>
        </div>

        {/* PLAN OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: "Silver Plan",  icon: "🥈", desc: "Entry-level plan" },
            { key: "Gold Plan",    icon: "🥇", desc: "Mid-tier plan" },
            { key: "Diamond Plan", icon: "💎", desc: "Premium plan" },
          ].map(({ key, icon, desc }) => {
            const meta = PLAN_META[key];
            return (
              <div key={key} className={`bg-[#121824] border ${meta.border} rounded-xl p-5`}>
                <p className="text-lg font-bold text-white mb-1">{icon} {key}</p>
                <p className="text-xs text-[#8f9cae] mb-3">{desc}</p>
                <div className="flex justify-between text-xs text-[#8f9cae]">
                  <span>Daily ROI</span><span className="text-[#10b981] font-bold text-sm">25%</span>
                </div>
                <div className="flex justify-between text-xs text-[#8f9cae] mt-1">
                  <span>Duration</span><span className="text-white font-semibold">120 days</span>
                </div>
                <div className="flex justify-between text-xs text-[#8f9cae] mt-1">
                  <span>Range</span><span className="text-white font-semibold">$500K – $2M</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CREATE FORM */}
        <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638]">
          <h2 className="text-xl font-semibold mb-5 text-white">Create Investment</h2>
          <form onSubmit={createInvestment} className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">Investor</label>
              <select
                className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg text-white focus:outline-none focus:border-[#0b66e4] transition-colors cursor-pointer"
                value={form.investor}
                onChange={(e) => setForm({ ...form, investor: e.target.value })}
                required
              >
                <option value="">Select Investor</option>
                {investors.map((inv) => (
                  <option key={inv.id} value={inv.id}>{inv.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">Plan</label>
              <select
                className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg text-white focus:outline-none focus:border-[#0b66e4] transition-colors cursor-pointer"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {PLAN_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">
                Amount ($500,000 – $2,000,000)
              </label>
              <input
                type="number"
                placeholder="500000.00"
                min="500000"
                max="2000000"
                step="0.01"
                className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg text-white placeholder-[#8f9cae] focus:outline-none focus:border-[#0b66e4] transition-colors"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>

            {/* ROI preview */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">
                Plan Details (all plans)
              </label>
              <div className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg flex items-center justify-between">
                <span className="text-[#8f9cae] text-sm">25% daily · 120-day lock · No early withdrawal</span>
                <span className="text-[#10b981] font-bold text-lg">25%</span>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#0b66e4] hover:bg-[#0055cc] text-white p-3 rounded-lg font-semibold tracking-wide transition-all duration-200 col-span-1 md:col-span-2 mt-2 cursor-pointer"
            >
              Create & Activate Contract
            </button>
          </form>
        </div>

        {/* TABS */}
        <div className="flex gap-3">
          {["all", "pending"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                tab === t
                  ? "bg-[#0b66e4] text-white"
                  : "bg-[#121824] border border-[#1e2638] text-[#8f9cae] hover:border-[#0b66e4]/50"
              }`}
            >
              {t === "all" ? `All Investments (${investments.length})` : `Pending Approval (${pendingList.length})`}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638]">
          <div className="overflow-x-auto rounded-lg border border-[#1e2638]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#090d16] text-[#8f9cae] uppercase text-xs font-semibold tracking-wider">
                  <th className="p-4 text-left border-b border-[#1e2638]">Investor</th>
                  <th className="p-4 text-left border-b border-[#1e2638]">Plan</th>
                  <th className="p-4 text-left border-b border-[#1e2638]">Amount</th>
                  <th className="p-4 text-left border-b border-[#1e2638]">Daily ROI</th>
                  <th className="p-4 text-left border-b border-[#1e2638]">Profit</th>
                  <th className="p-4 text-center border-b border-[#1e2638]">Status</th>
                  <th className="p-4 text-left border-b border-[#1e2638]">Date</th>
                  <th className="p-4 text-center border-b border-[#1e2638]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayList.length > 0 ? displayList.map((inv) => (
                  <tr key={inv.id} className="border-b border-[#1e2638] hover:bg-[#1e2638]/50 transition-colors">
                    <td className="p-4 font-medium text-white">{getInvestorName(inv.investor)}</td>
                    <td className="p-4">
                      {(() => {
                        const meta = PLAN_META[inv.category] || {};
                        return (
                          <span className={`${meta.bg || "bg-[#1e2638]"} ${meta.border || "border-[#1e2638]"} border px-2 py-0.5 rounded-full text-xs font-semibold`}
                                style={{ color: meta.color || "#8f9cae" }}>
                            {meta.label || inv.category}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="p-4 font-semibold text-white">${Number(inv.amount).toLocaleString()}</td>
                    <td className="p-4 font-semibold text-[#10b981]">{inv.daily_roi}%</td>
                    <td className="p-4 font-semibold text-[#0b66e4]">
                      ${Number(inv.current_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-center"><StatusBadge investment={inv} /></td>
                    <td className="p-4 text-[#8f9cae]">
                      {new Date(inv.created_at).toLocaleDateString(undefined, {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {!inv.approved && (
                          <button
                            onClick={() => approveInvestment(inv.id)}
                            className="bg-[#10b981]/15 hover:bg-[#10b981] text-[#10b981] hover:text-white border border-[#10b981]/30 text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => openProfitModal(inv)}
                          className="bg-yellow-500/15 hover:bg-yellow-500 text-yellow-400 hover:text-white border border-yellow-500/30 text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer"
                        >
                          + Profit
                        </button>
                        <button
                          onClick={() => deleteInvestment(inv.id)}
                          className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="text-center p-8 text-[#8f9cae] italic bg-[#090d16]/50">
                      {tab === "pending" ? "No pending investments" : "No investments found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MANUAL PROFIT MODAL */}
      {profitModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#121824] w-full max-w-md p-6 rounded-xl border border-[#1e2638]">
            <h2 className="text-xl font-bold text-white mb-1">Add Manual Profit</h2>
            <p className="text-[#8f9cae] text-sm mb-5">
              Investor: <span className="text-white font-medium">{getInvestorName(profitModal.investor)}</span>
              &nbsp;·&nbsp;
              Plan: <span className="text-white font-medium">{profitModal.category}</span>
              &nbsp;·&nbsp;
              Current Profit: <span className="text-[#0b66e4] font-medium">
                ${Number(profitModal.current_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </p>
            <form onSubmit={submitManualProfit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">
                  Profit Amount to Add ($)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg text-white placeholder-[#8f9cae] focus:outline-none focus:border-[#0b66e4] transition-colors"
                  value={profitAmount}
                  onChange={(e) => setProfitAmount(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-3 mt-1">
                <button
                  type="submit"
                  disabled={profitLoading}
                  className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 flex-1 py-3 rounded-lg font-semibold text-black transition-colors cursor-pointer"
                >
                  {profitLoading ? "Adding..." : "Add Profit"}
                </button>
                <button
                  type="button"
                  onClick={() => setProfitModal(null)}
                  className="bg-[#1e2638] hover:bg-[#2a3448] flex-1 py-3 rounded-lg font-semibold text-white transition-colors cursor-pointer"
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

export default Investments;