import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

function UserWithdrawals() {
  const [withdrawals,   setWithdrawals]   = useState([]);
  const [profile,       setProfile]       = useState({ wallet_balance: 0 });
  const [investments,   setInvestments]   = useState([]);
  const [form,          setForm]          = useState({ amount: "", wallet_address: "" });
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");

  useEffect(() => {
    fetchWithdrawals();
    fetchProfile();
    fetchInvestments();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("profile/");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await API.get("withdrawals/");
      setWithdrawals(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInvestments = async () => {
    try {
      const res = await API.get("investments/");
      setInvestments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Determine if any active investment is still within the 120-day lock
  const now = new Date();
  const lockedInvestment = investments.find((inv) => {
    if (!inv.active || !inv.approved) return false;
    const start = new Date(inv.created_at);
    const daysSince = (now - start) / (1000 * 60 * 60 * 24);
    return daysSince < 120;
  });
  const isLocked = Boolean(lockedInvestment);

  // Earliest unlock date
  let unlockDate = null;
  if (lockedInvestment) {
    const start = new Date(lockedInvestment.created_at);
    unlockDate = new Date(start.getTime() + 120 * 24 * 60 * 60 * 1000);
  }

  const submitWithdrawal = async (e) => {
    e.preventDefault();
    setError("");

    if (isLocked) {
      setError("Your investment is still locked. Withdrawals open after the 120-day period.");
      return;
    }

    if (parseFloat(form.amount) > parseFloat(profile.wallet_balance)) {
      setError(
        `Insufficient balance. Your wallet has $${parseFloat(profile.wallet_balance).toFixed(2)}.`
      );
      return;
    }

    loading(true);
    try {
      await API.post("withdrawals/", form);
      alert("Withdrawal Submitted Successfully!");
      setForm({ amount: "", wallet_address: "" });
      await fetchWithdrawals();
      await fetchProfile();
    } catch (error) {
      console.error(error.response?.data || error);
      const msg = error.response?.data?.error
        || error.response?.data?.non_field_errors?.[0]
        || "Submission failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const deleteWithdrawal = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this withdrawal request?")) return;
    try {
      await API.delete(`withdrawals/${id}/`);
      fetchWithdrawals();
      fetchProfile();
    } catch (error) {
      console.error(error);
      alert("Failed to cancel withdrawal.");
    }
  };

  const statusColor = (status) => {
    if (status === "Approved") return "bg-green-500/15 text-green-400 border border-green-500/30";
    if (status === "Rejected") return "bg-red-500/15 text-red-400 border border-red-500/30";
    return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
  };

  const totalApproved = withdrawals
    .filter((w) => w.status === "Approved")
    .reduce((sum, w) => sum + parseFloat(w.amount || 0), 0);

  return (
    <DashboardLayout>
      {/* Root wrapper updated to the warm dark container color */}
      <div className="text-white space-y-8 max-w-3xl mx-auto min-h-screen bg-[#171515] p-4 rounded-xl">

        <h1 className="text-3xl font-bold tracking-wide">Withdrawals</h1>

        {/* Lock Banner */}
        {isLocked && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-4 flex items-start gap-3">
            <span className="text-amber-400 text-2xl mt-0.5">🔒</span>
            <div>
              <p className="text-amber-300 font-bold text-sm">Withdrawals Locked</p>
              <p className="text-amber-400/80 text-xs mt-1 leading-relaxed">
                Your investment plan is currently within the <strong>120-day lock period</strong>. Withdrawals will be available once your plan matures and profits are credited to your wallet.
              </p>
              {unlockDate && (
                <p className="text-amber-300 text-xs mt-2 font-semibold">
                  Estimated unlock: {unlockDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Balance Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1f1b1b] p-5 rounded-xl border border-[#2e2726] shadow-2xl">
            <p className="text-[#9e9593] text-xs uppercase tracking-wider mb-1">Wallet Balance</p>
            <h2 className="text-2xl font-bold text-[#c45a45]">
              ${parseFloat(profile.wallet_balance || 0).toFixed(2)}
            </h2>
            <p className="text-xs text-[#9e9593] mt-1">
              {isLocked ? "Locked · Available after 120 days" : "Available to withdraw"}
            </p>
          </div>
          <div className="bg-[#1f1b1b] p-5 rounded-xl border border-[#2e2726] shadow-2xl">
            <p className="text-[#9e9593] text-xs uppercase tracking-wider mb-1">Total Withdrawn</p>
            <h2 className="text-2xl font-bold text-red-400">
              ${totalApproved.toFixed(2)}
            </h2>
            <p className="text-xs text-[#9e9593] mt-1">Approved withdrawals</p>
          </div>
        </div>

        {/* Form */}
        <div className={`bg-[#1f1b1b] p-6 rounded-xl border shadow-2xl transition-all ${
          isLocked ? "border-amber-500/20 opacity-50 pointer-events-none select-none" : "border-[#2e2726]"
        }`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-neutral-200">New Withdrawal Request</h2>
            {isLocked && (
              <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-medium">
                🔒 Locked
              </span>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-lg mb-4">
              {error}
            </p>
          )}

          <form onSubmit={submitWithdrawal} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-[#9e9593] uppercase tracking-wider mb-1.5 block">
                Withdrawal Amount ($)
              </label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full bg-[#121010] p-3 rounded-lg border border-[#2e2726] text-white placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45] transition-colors"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                disabled={isLocked}
              />
              <p className="text-xs text-[#9e9593] mt-1">
                Max: ${parseFloat(profile.wallet_balance || 0).toFixed(2)}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#9e9593] uppercase tracking-wider mb-1.5 block">
                Your BTC Wallet Address
              </label>
              <input
                type="text"
                placeholder="BTC wallet address"
                className="w-full bg-[#121010] p-3 rounded-lg border border-[#2e2726] text-white placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45] transition-colors font-mono text-sm"
                value={form.wallet_address}
                onChange={(e) => setForm({ ...form, wallet_address: e.target.value })}
                required
                disabled={isLocked}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#c45a45] hover:bg-[#a64633] text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 transition-colors cursor-pointer shadow-xl"
              disabled={loading || isLocked}
            >
              {loading ? "Submitting..." : isLocked ? "🔒 Locked Until Day 120" : "Submit Withdrawal"}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-200">Withdrawal History</h2>

          {withdrawals.length === 0 && (
            <div className="bg-[#1f1b1b] border border-[#2e2726] rounded-xl p-10 text-center text-[#9e9593] italic shadow-2xl">
              No withdrawals yet.
            </div>
          )}

          {withdrawals.map((w) => (
            <div
              key={w.id}
              className="bg-[#1f1b1b] p-5 rounded-xl border border-[#2e2726] hover:bg-[#2e2726]/40 transition-colors shadow-2xl"
            >
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-xl text-white">
                    ${parseFloat(w.amount).toFixed(2)}
                  </h2>
                  <p className="text-sm text-[#9e9593] font-mono break-all mt-1">
                    {w.wallet_address}
                  </p>
                  <p className="text-xs text-[#9e9593] mt-1">
                    {new Date(w.created_at).toLocaleDateString(undefined, {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(w.status)}`}>
                    {w.status}
                  </span>
                  {w.status === "Pending" && (
                    <button
                      onClick={() => deleteWithdrawal(w.id)}
                      className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer"
                    >
                      Cancel
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

export default UserWithdrawals;