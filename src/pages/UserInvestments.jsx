import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

const MIN = 100;
const MAX = 500;

const COMPANIES = [
  { name: "Apex Capital", category: "Forex Trading",    roi: 2.5, dividends: "10%", min: "$100", max: "$500" },
  { name: "BitMine Pro",  category: "Bitcoin Mining",   roi: 3.0, dividends: "10%", min: "$100", max: "$500" },
  { name: "UrbanVest",    category: "Real Estate",      roi: 2.0, dividends: "10%", min: "$100", max: "$500" },
  { name: "ArbitrageX",   category: "Crypto Arbitrage", roi: 3.5, dividends: "10%", min: "$100", max: "$500" },
];

const CATEGORY_ROI = {
  "Forex Trading":    2.5,
  "Bitcoin Mining":   3.0,
  "Real Estate":      2.0,
  "Crypto Arbitrage": 3.5,
};

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
    if (n < MIN) return `Minimum investment is $${MIN}`;
    if (n > MAX) return `Maximum investment is $${MAX}`;
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
  const selectedROI   = CATEGORY_ROI[form.category];

  return (
    <DashboardLayout>
      <div className="text-white space-y-8 max-w-4xl mx-auto">

        <div>
          <h1 className="text-3xl font-bold tracking-wide">My Investments</h1>
          <p className="text-[#8f9cae] text-sm mt-1">Submit a new investment or track your existing portfolio.</p>
        </div>

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

        {/* COMPANY PLANS TABLE */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e2638]">
            <h2 className="text-lg font-semibold">Available Investment Plans</h2>
            <p className="text-xs text-[#8f9cae] mt-0.5">
              All plans pay 10% dividends every 2 weeks. Range: $100 – $500.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#090d16] text-[#8f9cae] uppercase text-xs font-semibold tracking-wider">
                  <th className="p-4 text-left">Company</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-right">Daily ROI</th>
                  <th className="p-4 text-right">Dividends</th>
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
                    <td className="p-4 text-right font-semibold text-[#10b981]">{c.roi}%</td>
                    <td className="p-4 text-right text-yellow-400 font-semibold">{c.dividends}</td>
                    <td className="p-4 text-right text-[#8f9cae]">14 days</td>
                    <td className="p-4 text-right text-white">{c.min}</td>
                    <td className="p-4 text-right text-white">{c.max}</td>
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
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">Category</label>
              <select
                className="w-full bg-[#090d16] p-3 rounded-lg border border-[#1e2638] text-white focus:outline-none focus:border-[#0b66e4] transition-colors cursor-pointer"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">Choose Category</option>
                <option value="Bitcoin Mining">Bitcoin Mining</option>
                <option value="Forex Trading">Forex Trading</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Crypto Arbitrage">Crypto Arbitrage</option>
              </select>
            </div>

            {/* Auto ROI pill */}
            {selectedROI && (
              <div className="flex items-center gap-3 bg-[#0b66e4]/10 border border-[#0b66e4]/25 rounded-lg px-4 py-3">
                <span className="text-xs text-[#8f9cae]">Daily ROI for this plan</span>
                <span className="ml-auto text-[#10b981] font-bold text-lg">{selectedROI}%</span>
                <span className="text-xs text-[#8f9cae]">· auto-assigned · 10% dividends / 2 wks</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">
                Investment Amount ($100 – $500)
              </label>
              <input
                type="number"
                placeholder="100.00"
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

          {!fetching && investments.map((inv) => (
            <div key={inv.id} className="bg-[#121824] p-5 rounded-xl border border-[#1e2638] hover:bg-[#1e2638] transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-white">{inv.category}</h2>
                    {inv.active ? (
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Active</span>
                    ) : inv.approved ? (
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-700/60 text-slate-400 border border-slate-600">Expired</span>
                    ) : (
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">Pending Approval</span>
                    )}
                  </div>
                  <p className="text-sm text-[#8f9cae] mt-1">
                    {inv.daily_roi}% daily ROI · 10% dividends / 2 wks · {inv.payment_method}
                  </p>
                  <p className="text-xs text-[#8f9cae] mt-0.5">
                    Started {new Date(inv.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  </p>
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
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}

export default UserInvestments;