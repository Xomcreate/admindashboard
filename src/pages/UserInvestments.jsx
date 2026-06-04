import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

const MIN = 500000;
const MAX = 2000000;

const PLANS = [
  {
    name:     "Silver Plan",
    category: "Silver Plan",
    icon:     "🥈",
    color:    "text-slate-300",
    border:   "border-slate-400/30",
    bg:       "bg-slate-400/10",
    levels:   "1–2 investments",
  },
  {
    name:     "Gold Plan",
    category: "Gold Plan",
    icon:     "🥇",
    color:    "text-amber-300",
    border:   "border-amber-400/30",
    bg:       "bg-amber-400/10",
    levels:   "3–5 investments",
  },
  {
    name:     "Diamond Plan",
    category: "Diamond Plan",
    icon:     "💎",
    color:    "text-violet-300",
    border:   "border-violet-400/30",
    bg:       "bg-violet-400/10",
    levels:   "6+ investments",
  },
];

const COMPANIES = [
  { name: "Tesla, Inc.",             category: "Tesla (TSLA)"      },
  { name: "Apple Inc.",              category: "Apple (AAPL)"      },
  { name: "Amazon.com, Inc.",        category: "Amazon (AMZN)"     },
  { name: "McDonald's Corporation",  category: "McDonald's (MCD)"  },
  { name: "GameStop Corporation",    category: "GameStop (GME)"    },
  { name: "Coca-Cola Company",       category: "Coca-Cola (KO)"    },
  { name: "Meta Platforms, Inc.",    category: "Meta (META)"       },
  { name: "Alphabet Inc. (Class C)", category: "Alphabet (GOOG)"   },
  { name: "Netflix, Inc.",           category: "Netflix (NFLX)"    },
  { name: "Intel Corporation",       category: "Intel (INTC)"      },
];

const PLAN_MAP = Object.fromEntries(PLANS.map((p) => [p.category, p]));

const TIER_STYLE = {
  silver:  { bg: "bg-slate-400/15",  text: "text-slate-300",  border: "border-slate-400/30",  label: "🥈 Silver"  },
  gold:    { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/40", label: "🥇 Gold"    },
  diamond: { bg: "bg-violet-500/15", text: "text-violet-300", border: "border-violet-500/30", label: "💎 Diamond" },
  none:    { bg: "bg-[#1e2638]",     text: "text-[#8f9cae]",  border: "border-[#1e2638]",     label: "No Tier"    },
};

function getTier(count) {
  if (count >= 6) return "diamond";
  if (count >= 3) return "gold";
  if (count >= 1) return "silver";
  return "none";
}

function TierBadge({ tier }) {
  const s = TIER_STYLE[tier] || TIER_STYLE.none;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      {s.label}
    </span>
  );
}

function UserInvestments() {
  const [investments, setInvestments] = useState([]);
  const [form, setForm] = useState({
    category: "", amount: "", payment_method: "BTC", payment_proof: null,
  });
  const [amountError, setAmountError] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);

  const now = new Date();

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
  const totalProfit       = activeInvestments.reduce((s, i) => s + parseFloat(i.current_profit || 0), 0);
  const totalInvested     = activeInvestments.reduce((s, i) => s + parseFloat(i.amount || 0), 0);
  const totalCount        = investments.length;
  const currentTier       = getTier(totalCount);

  const isLocked = investments.some((inv) => {
    if (!inv.active || !inv.approved) return false;
    const start = new Date(inv.created_at);
    const daysSince = (now - start) / (1000 * 60 * 60 * 24);
    return daysSince < 120;
  });

  return (
    <DashboardLayout>
      <div className="text-white space-y-8 max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-wide">My Investments</h1>
            <p className="text-[#8f9cae] text-sm mt-1">Submit a new investment or track your existing portfolio.</p>
          </div>
          {totalCount > 0 && (
            <div className="flex flex-col items-end gap-1">
              <p className="text-xs text-[#8f9cae] uppercase tracking-wider">Your Tier</p>
              <TierBadge tier={currentTier} />
              <p className="text-xs text-[#8f9cae]">{totalCount} total investment{totalCount !== 1 ? "s" : ""}</p>
            </div>
          )}
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

        {/* TIER SYSTEM INFO */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e2638]">
            <h2 className="text-lg font-semibold">Investor Tier System</h2>
            <p className="text-xs text-[#8f9cae] mt-0.5">
              Your tier upgrades automatically based on your total number of investments.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#1e2638]">
            {PLANS.map((plan) => {
              const tierKey = plan.category.toLowerCase().replace(" plan", "");
              const isActive = totalCount > 0 && currentTier === tierKey;
              return (
                <div key={plan.category} className={`p-6 ${plan.bg} flex flex-col gap-3 relative`}>
                  {isActive && (
                    <span className="absolute top-3 right-3 text-xs bg-[#0b66e4]/20 text-[#0b66e4] border border-[#0b66e4]/30 px-2 py-0.5 rounded-full font-semibold">
                      Current
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{plan.icon}</span>
                    <span className={`text-lg font-bold ${plan.color}`}>{plan.name}</span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#8f9cae]">Required</span>
                      <span className={`font-bold ${plan.color}`}>{plan.levels}</span>
                    </div>
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
                      <span className="text-amber-400 text-xs font-medium">After 120 days</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STOCK COMPANIES TABLE */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e2638]">
            <h2 className="text-lg font-semibold">Stock Companies</h2>
            <p className="text-xs text-[#8f9cae] mt-0.5">
              Invest in top-performing companies.{" "}
              <span className="text-[#10b981] font-semibold">25% daily ROI</span>{" "}·{" "}
              <span className="text-white font-semibold">120-day lock</span>{" "}·{" "}
              Range: $500,000 – $2,000,000.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#090d16] text-[#8f9cae] uppercase text-xs font-semibold tracking-wider">
                  <th className="p-4 text-left">Company</th>
                  <th className="p-4 text-left">Ticker</th>
                  <th className="p-4 text-right">Daily ROI</th>
                  <th className="p-4 text-right">Duration</th>
                  <th className="p-4 text-right">Min</th>
                  <th className="p-4 text-right">Max</th>
                </tr>
              </thead>
              <tbody>
                {COMPANIES.map((c, i) => (
                  <tr key={i} className="border-t border-[#1e2638] hover:bg-[#1e2638]/50 transition-colors">
                    <td className="p-4 font-semibold text-white">{c.name}</td>
                    <td className="p-4 text-[#8f9cae]">{c.category}</td>
                    <td className="p-4 text-right font-semibold text-[#10b981]">25%</td>
                    <td className="p-4 text-right text-[#8f9cae]">120 days</td>
                    <td className="p-4 text-right text-white">$500,000</td>
                    <td className="p-4 text-right text-white">$2,000,000</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NEW INVESTMENT FORM */}
        <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638]">
          <h2 className="text-lg font-semibold mb-5 text-slate-100">New Investment</h2>
          <form onSubmit={submitInvestment} className="space-y-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">
                Select Plan or Stock
              </label>
              <select
                className="w-full bg-[#090d16] p-3 rounded-lg border border-[#1e2638] text-white focus:outline-none focus:border-[#0b66e4] transition-colors cursor-pointer"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">Choose a Plan or Stock</option>
                <optgroup label="── Investment Plans ──">
                  {PLANS.map((p) => (
                    <option key={p.category} value={p.category}>
                      {p.icon} {p.name} ({p.levels})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="── Stock Companies ──">
                  {COMPANIES.map((c) => (
                    <option key={c.category} value={c.category}>{c.category}</option>
                  ))}
                </optgroup>
              </select>
            </div>

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
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">
                Upload Payment Proof
              </label>
              <input
                type="file" accept="image/*"
                onChange={(e) => setForm({ ...form, payment_proof: e.target.files[0] })}
                className="w-full bg-[#090d16] p-3 rounded-lg border border-[#1e2638] text-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0b66e4] file:text-white cursor-pointer"
              />
            </div>

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
            const plan      = PLAN_MAP[inv.category];
            const start     = new Date(inv.created_at);
            const daysSince = Math.floor((now - start) / (1000 * 60 * 60 * 24));
            const daysLeft  = Math.max(0, 120 - daysSince);
            const progress  = Math.min(100, (daysSince / 120) * 100);

            return (
              <div key={inv.id} className="bg-[#121824] p-5 rounded-xl border border-[#1e2638] hover:bg-[#1e2638] transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{plan?.icon || "📈"}</span>
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
                      Started {new Date(inv.created_at).toLocaleDateString(undefined, {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </p>

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