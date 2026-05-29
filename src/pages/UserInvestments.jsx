import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

function UserInvestments() {
  const [investments, setInvestments] = useState([]);
  const [form, setForm] = useState({
    category:       "",
    amount:         "",
    payment_method: "BTC",
    payment_proof:  null,
  });
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    setFetching(true);
    try {
      const res = await API.get("investments/");
      setInvestments(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const submitInvestment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("category",       form.category);
      data.append("amount",         form.amount);
      data.append("payment_method", form.payment_method);
      if (form.payment_proof) {
        data.append("payment_proof", form.payment_proof);
      }

      await API.post("investments/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Investment Submitted Successfully! It will appear as Active once confirmed.");
      setForm({ category: "", amount: "", payment_method: "BTC", payment_proof: null });
      fetchInvestments();
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteInvestment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this investment?")) return;
    try {
      await API.delete(`investments/${id}/`);
      fetchInvestments();
    } catch (error) {
      console.error(error);
      alert("Failed to delete investment.");
    }
  };

  const activeInvestments = investments.filter((inv) => inv.active);
  const totalProfit       = activeInvestments.reduce(
    (sum, inv) => sum + parseFloat(inv.current_profit || 0), 0
  );
  const totalInvested     = activeInvestments.reduce(
    (sum, inv) => sum + parseFloat(inv.amount || 0), 0
  );

  return (
    <DashboardLayout>
      <div className="text-white space-y-8 max-w-4xl mx-auto">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-wide">My Investments</h1>
          <p className="text-[#8f9cae] text-sm mt-1">
            Submit a new investment or track your existing portfolio.
          </p>
        </div>

        {/* SUMMARY CARDS */}
        {!fetching && investments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 shadow-2xl">
              <p className="text-xs text-[#8f9cae] uppercase tracking-wider mb-2">Active Investments</p>
              <p className="text-2xl font-bold text-[#0b66e4]">{activeInvestments.length}</p>
            </div>
            <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 shadow-2xl">
              <p className="text-xs text-[#8f9cae] uppercase tracking-wider mb-2">Total Invested</p>
              <p className="text-2xl font-bold text-slate-100">
                ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 shadow-2xl">
              <p className="text-xs text-[#8f9cae] uppercase tracking-wider mb-2">Total ROI Earned</p>
              <p className="text-2xl font-bold text-yellow-400">
                ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}

        {/* NEW INVESTMENT FORM */}
        <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638] shadow-2xl">
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
                <option value="" className="bg-[#121824]">Choose Category</option>
                <option value="Bitcoin Mining" className="bg-[#121824]">Bitcoin Mining</option>
                <option value="Forex Trading" className="bg-[#121824]">Forex Trading</option>
                <option value="Real Estate" className="bg-[#121824]">Real Estate</option>
                <option value="Crypto Arbitrage" className="bg-[#121824]">Crypto Arbitrage</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">Investment Amount ($)</label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full bg-[#090d16] p-3 rounded-lg border border-[#1e2638] text-white placeholder-[#8f9cae] focus:outline-none focus:border-[#0b66e4] transition-colors"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
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
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, payment_proof: e.target.files[0] })}
                className="w-full bg-[#090d16] p-3 rounded-lg border border-[#1e2638] text-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0b66e4] file:text-white cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0b66e4] hover:bg-[#0055cc] px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Investment"}
            </button>
          </form>
        </div>

        {/* INVESTMENT LIST */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-100">Investment History</h2>

          {fetching && (
            <p className="text-[#8f9cae] text-center py-8">Loading investments…</p>
          )}

          {!fetching && investments.length === 0 && (
            <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-10 text-center text-[#8f9cae] shadow-2xl italic">
              No investments yet. Submit one above to get started.
            </div>
          )}

          {!fetching && investments.map((inv) => (
            <div
              key={inv.id}
              className="bg-[#121824] p-5 rounded-xl border border-[#1e2638] hover:bg-[#1e2638] transition-colors shadow-2xl"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-white">{inv.category}</h2>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      inv.active
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-700/60 text-slate-400 border border-slate-600"
                    }`}>
                      {inv.active ? "Active" : "Expired"}
                    </span>
                  </div>
                  <p className="text-sm text-[#8f9cae] mt-1">
                    {inv.daily_roi}% daily ROI · {inv.payment_method}
                  </p>
                  <p className="text-xs text-[#8f9cae] mt-0.5">
                    Started {new Date(inv.created_at).toLocaleDateString(undefined, {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </p>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-2">
                  <p className="text-[#0b66e4] font-bold text-lg">
                    ${Number(inv.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-yellow-400 text-sm">
                    Profit: ${Number(inv.current_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>

                  {/* Only allow delete if expired */}
                  {!inv.active && (
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