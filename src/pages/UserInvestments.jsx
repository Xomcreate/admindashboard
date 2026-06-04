import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

const MIN = 500000;
const MAX = 2000000;

const PLANS = [
  {
    name:     "Silver Plan",
    category: "Silver Plan",
    roi:      25,
    icon:     "🥈",
    color:    "text-slate-300",
    border:   "border-slate-400/30",
    bg:       "bg-slate-400/10",
    tagColor: "#94a3b8",
  },
  {
    name:     "Gold Plan",
    category: "Gold Plan",
    roi:      25,
    icon:     "🥇",
    color:    "text-amber-300",
    border:   "border-amber-400/30",
    bg:       "bg-amber-400/10",
    tagColor: "#f59e0b",
  },
  {
    name:     "Diamond Plan",
    category: "Diamond Plan",
    roi:      25,
    icon:     "💎",
    color:    "text-violet-300",
    border:   "border-violet-400/30",
    bg:       "bg-violet-400/10",
    tagColor: "#a78bfa",
  },
];

const PLAN_MAP = Object.fromEntries(PLANS.map((p) => [p.category, p]));

function UserInvestments() {
  const [investments, setInvestments] = useState([]);
  const [form, setForm] = useState({
    category: "", amount: "", payment_method: "BTC", payment_proof: null,
  });
  const [amountError, setAmountError] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { fetchInvestments(); }, []);

  const fetchInvestments = async () => {
    setFetching(true);
    try {
      const res = await API.get("investments/");
      setInvestments(res.data);
    } catch (e) { console.error(e); }
    finally { setFetching(false); }
  };

  const validateAmount = (val) => {
    const n = parseFloat(val);
    if (!val) return "";
    if (n < MIN) return `Minimum investment is $${MIN.toLocaleString()}`;
    if (n > MAX) return `Maximum investment is $${MAX.toLocaleString()}`;
    return "";
  };

  const submitInvestment = async (e) => {
    e.preventDefault();
    const err = validateAmount(form.amount);
    if (err) { setAmountError(err); return; }
    setLoading(true);
    try {
      const data = new FormData();
      data.append("category",       form.category);
      data.append("amount",         form.amount);
      data.append("payment_method", form.payment_method);
      if (form.payment_proof) data.append("payment_proof", form.payment_proof);
      await API.post("investments/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Investment submitted! It will become Active once an admin approves it.");
      setForm({ category: "", amount: "", payment_method: "BTC", payment_proof: null });
      fetchInvestments();
    } catch (error) {
      const msg = error.response?.data?.amount?.[0] || "Submission failed. Please try again.";
      alert(msg);
    } finally { setLoading(false); }
  };

  const deleteInvestment = async (id) => {
    if (!window.confirm("Delete this investment?")) return;
    try {
      await API.delete(`investments/${id}/`);
      fetchInvestments();
    } catch { alert("Failed to delete."); }
  };

  const activeInvestments = investments.filter((i) => i.active);
  const totalProfit   = activeInvestments.reduce((s, i) => s + parseFloat(i.current_profit || 0), 0);
  const totalInvested = activeInvestments.reduce((s, i) => s + parseFloat(i.amount || 0), 0);

  // Check if any investment is still within the 120-day lock
  const now = new Date();
  const isLocked = investments.some((inv) => {
    if (!inv.active || !inv.approved) return false;
    const start = new Date(inv.created_at);
    const daysSince = (now - start) / (1000 * 60 * 60 * 24);
    return daysSince < 120;
  });

  return (
    <DashboardLayout>
      <div className="text-white space-y-8 max-w-4xl mx-auto">

        <div>
          <h1 className="text-3xl font-bold tracking-wide">My Investments</h1>
          <p className="text-[#8f9cae] text-sm mt-1">Submit a new investment or track your existing portfolio.</p>
        </div>

        {/* LOCK NOTICE */}
        {isLocked && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-4 flex items-start gap-3">
            <span className="text-amber-400 text-xl mt-0.5">🔒</span>
            <div>
              <p className="text-amber-300 font-semibold text-sm">Withdrawal Locked</p>
              <p className="text-amber-400/80 text-xs mt-0.5">
                You have active investment(s) still within the 120-day lock period. Withdrawals will be available once your plan matures and profits are credited to your wallet.
              </p>
            </div>
          </div>
        )}

        {/* SUMMARY CARDS */}
        {!fetching && investments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5">
              <p className="text-xs text-[#8f9cae] uppercase tracking-wider mb-2">Active Investments</p>
              <p className="text-2xl font-bold text-[#0b66e4]">{activeInvestments.length}</p>
            </div>
            <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5">
              <p className="text-xs text-[#8f9cae] uppercase tracking-wider mb-2">Total Invested</p>
              <p className="text-2xl font-bold text-slate-100">
                ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5">
              <p className="text-xs text-[#8f9cae] uppercase tracking-wider mb-2">Total ROI Earned</p>
              <p className="text-2xl font-bold text-yellow-400">
                ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}

        {/* AVAILABLE PLANS */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e2638]">
            <h2 className="text-lg font-semibold">Available Investment Plans</h2>
            <p className="text-xs text-[#8f9cae] mt-0.5">
              All plans earn <span className="text-[#10b981] font-semibold">25% daily ROI</span> for <span className="text-white font-semibold">120 days</span>. Range: $500,000 – $2,000,000. <span className="text-amber-400 font-medium">Withdrawals locked for 120 days.</span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#1e2638]">
            {PLANS.map((plan) => (
              <div key={plan.category} className={`p-6 ${plan.bg} flex flex-col gap-3`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{plan.icon}</span>
                  <span className={`text-lg font-bold ${plan.color}`}>{plan.name}</span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8f9cae]">Daily ROI</span>
                    <span className="text-[#10b981] font-bold">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8f9cae]">Duration</span>
                    <span className="text-white font-semibold">120 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8f9cae]">Min</span>
                    <span className="text-white">$500,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8f9cae]">Max</span>
                    <span className="text-white">$2,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8f9cae]">Total ROI</span>
                    <span className="text-yellow-400 font-bold">3,000%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8f9cae]">Withdrawal</span>
                    <span className="text-amber-400 font-medium text-xs">After 120 days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NEW INVESTMENT FORM */}
        <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638]">
          <h2 className="text-lg font-semibold mb-5 text-slate-100">New Investment</h2>
          <form onSubmit={submitInvestment} className="space-y-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">Select Plan</label>
              <select
                className="w-full bg-[#090d16] p-3 rounded-lg border border-[#1e2638] text-white focus:outline-none focus:border-[#0b66e4] transition-colors cursor-pointer"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">Choose a Plan</option>
                {PLANS.map((p) => (
                  <option key={p.category} value={p.category}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>

            {/* Plan details pill */}
            {form.category && (
              <div className="flex items-center gap-3 bg-[#0b66e4]/10 border border-[#0b66e4]/25 rounded-lg px-4 py-3">
                <span className="text-xs text-[#8f9cae]">Daily ROI for this plan</span>
                <span className="ml-auto text-[#10b981] font-bold text-lg">25%</span>
                <span className="text-xs text-[#8f9cae]">· 120-day lock · No early withdrawal</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">
                Investment Amount ($500,000 – $2,000,000)
              </label>
              <input
                type="number"
                placeholder="500000.00"
                min={MIN} max={MAX} step="0.01"
                className={`w-full bg-[#090d16] p-3 rounded-lg border text-white placeholder-[#8f9cae] focus:outline-none transition-colors ${
                  amountError ? "border-red-500" : "border-[#1e2638] focus:border-[#0b66e4]"
                }`}
                value={form.amount}
                onChange={(e) => {
                  setForm({ ...form, amount: e.target.value });
                  setAmountError(validateAmount(e.target.value));
                }}
                required
              />
              {amountError && <p className="text-red-400 text-xs mt-0.5">{amountError}</p>}
            </div>

            <div className="bg-[#090d16] p-4 rounded-lg border border-[#1e2638]">
              <p className="text-sm text-[#8f9cae]">Send payment to BTC Wallet:</p>
              <p className="text-[#0b66e4] break-all mt-1.5 font-mono text-sm font-semibold">
                1FfmbHfnpaZjKFvyi1okTjJJusN455paPH
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">Upload Payment Proof</label>
              <input
                type="file" accept="image/*"
                onChange={(e) => setForm({ ...form, payment_proof: e.target.files[0] })}
                className="w-full bg-[#090d16] p-3 rounded-lg border border-[#1e2638] text-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0b66e4] file:text-white cursor-pointer"
              />
            </div>

            {/* Lock reminder */}
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-lg px-4 py-3 flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">🔒</span>
              <p className="text-amber-400/90 text-xs leading-relaxed">
                By submitting, you agree to the <strong>120-day lock period</strong>. No withdrawals will be permitted until your plan matures and profits are credited to your wallet.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !!amountError}
              className="w-full bg-[#0b66e4] hover:bg-[#0055cc] px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Submitting…" : "Submit Investment"}
            </button>
          </form>
        </div>

        {/* INVESTMENT HISTORY */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-100">Investment History</h2>

          {fetching && <p className="text-[#8f9cae] text-center py-8">Loading…</p>}

          {!fetching && investments.length === 0 && (
            <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-10 text-center text-[#8f9cae] italic">
              No investments yet. Submit one above to get started.
            </div>
          )}

          {!fetching && investments.map((inv) => {
            const plan = PLAN_MAP[inv.category] || {};
            const start = new Date(inv.created_at);
            const daysSince = Math.floor((now - start) / (1000 * 60 * 60 * 24));
            const daysLeft = Math.max(0, 120 - daysSince);
            const progress = Math.min(100, (daysSince / 120) * 100);

            return (
              <div key={inv.id} className="bg-[#121824] p-5 rounded-xl border border-[#1e2638] hover:bg-[#1e2638] transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{plan.icon || "📈"}</span>
                      <h2 className="font-semibold text-white">{inv.category}</h2>
                      {inv.active ? (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Active</span>
                      ) : inv.approved ? (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-700/60 text-slate-400 border border-slate-600">Matured</span>
                      ) : (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">Pending Approval</span>
                      )}
                    </div>
                    <p className="text-sm text-[#8f9cae] mt-1">
                      25% daily ROI · 120-day lock · {inv.payment_method}
                    </p>
                    <p className="text-xs text-[#8f9cae] mt-0.5">
                      Started {new Date(inv.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </p>

                    {/* Progress bar for active investments */}
                    {inv.active && inv.approved && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-[#8f9cae] mb-1">
                          <span>Day {Math.min(daysSince, 120)} of 120</span>
                          <span className={daysLeft === 0 ? "text-[#10b981]" : "text-amber-400"}>
                            {daysLeft === 0 ? "Maturing soon" : `${daysLeft} days until withdrawal`}
                          </span>
                        </div>
                        <div className="w-full bg-[#1e2638] rounded-full h-1.5">
                          <div
                            className="bg-[#0b66e4] h-1.5 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-2">
                    <p className="text-[#0b66e4] font-bold text-lg">
                      ${Number(inv.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-yellow-400 text-sm">
                      Profit: ${Number(inv.current_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    {!inv.active && inv.approved && (
                      <button
                        onClick={() => deleteInvestment(inv.id)}
                        className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </DashboardLayout>
  );
}

export default UserInvestments;