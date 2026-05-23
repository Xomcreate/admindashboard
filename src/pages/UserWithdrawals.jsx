import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

function UserWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [profile, setProfile]         = useState({ wallet_balance: 0 });
  const [form, setForm]               = useState({ amount: "", wallet_address: "" });
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  useEffect(() => {
    fetchWithdrawals();
    fetchProfile();
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

  const submitWithdrawal = async (e) => {
    e.preventDefault();
    setError("");

    if (parseFloat(form.amount) > parseFloat(profile.wallet_balance)) {
      setError(
        `Insufficient balance. Your wallet has $${parseFloat(profile.wallet_balance).toFixed(2)}.`
      );
      return;
    }

    setLoading(true);
    try {
      await API.post("withdrawals/", form);
      alert("Withdrawal Submitted Successfully!");
      setForm({ amount: "", wallet_address: "" });
      await fetchWithdrawals();
      await fetchProfile();
    } catch (error) {
      console.error(error.response?.data || error);
      const msg = error.response?.data?.error || "Submission failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const deleteWithdrawal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this withdrawal request?")) return;
    try {
      await API.delete(`withdrawals/${id}/`);
      fetchWithdrawals();
      fetchProfile();
    } catch (error) {
      console.error(error);
      alert("Failed to delete withdrawal.");
    }
  };

  const statusColor = (status) => {
    if (status === "Approved") return "bg-green-500/20 text-green-400 border border-green-500/30";
    if (status === "Rejected") return "bg-red-500/20 text-red-400 border border-red-500/30";
    return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
  };

  const totalApproved = withdrawals
    .filter((w) => w.status === "Approved")
    .reduce((sum, w) => sum + parseFloat(w.amount || 0), 0);

  return (
    <DashboardLayout>
      <div className="text-white space-y-8 max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold">Withdrawals</h1>

        {/* Balance Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#111c44] p-5 rounded-xl border border-[#1e295d]">
            <p className="text-[#94a3b8] text-xs uppercase tracking-wider mb-1">Wallet Balance</p>
            <h2 className="text-2xl font-bold text-[#10b981]">
              ${parseFloat(profile.wallet_balance || 0).toFixed(2)}
            </h2>
            <p className="text-xs text-[#64748b] mt-1">Available to withdraw</p>
          </div>
          <div className="bg-[#111c44] p-5 rounded-xl border border-[#1e295d]">
            <p className="text-[#94a3b8] text-xs uppercase tracking-wider mb-1">Total Withdrawn</p>
            <h2 className="text-2xl font-bold text-red-400">
              ${totalApproved.toFixed(2)}
            </h2>
            <p className="text-xs text-[#64748b] mt-1">Approved withdrawals</p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={submitWithdrawal}
          className="bg-[#111c44] p-6 rounded-xl border border-[#1e295d] space-y-5"
        >
          <h2 className="text-lg font-semibold text-slate-100">New Withdrawal Request</h2>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-lg">
              {error}
            </p>
          )}

          <div>
            <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5 block">
              Withdrawal Amount ($)
            </label>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full bg-[#0a1128] p-3 rounded-lg border border-[#1e295d] text-white placeholder-[#64748b] focus:outline-none focus:border-[#10b981] transition-colors"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
            <p className="text-xs text-[#64748b] mt-1">
              Max: ${parseFloat(profile.wallet_balance || 0).toFixed(2)}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5 block">
              Your BTC Wallet Address
            </label>
            <input
              type="text"
              placeholder="BTC wallet address"
              className="w-full bg-[#0a1128] p-3 rounded-lg border border-[#1e295d] text-white placeholder-[#64748b] focus:outline-none focus:border-[#10b981] transition-colors font-mono text-sm"
              value={form.wallet_address}
              onChange={(e) => setForm({ ...form, wallet_address: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#10b981] hover:bg-[#059669] px-6 py-3 rounded-lg font-semibold disabled:opacity-50 transition-colors"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Withdrawal"}
          </button>
        </form>

        {/* List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-100">Withdrawal History</h2>

          {withdrawals.length === 0 && (
            <div className="bg-[#111c44] border border-[#1e295d] rounded-xl p-10 text-center text-[#64748b] italic">
              No withdrawals yet.
            </div>
          )}

          {withdrawals.map((w) => (
            <div
              key={w.id}
              className="bg-[#111c44] p-5 rounded-xl border border-[#1e295d] hover:bg-[#172554] transition-colors"
            >
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-xl text-white">
                    ${parseFloat(w.amount).toFixed(2)}
                  </h2>
                  <p className="text-sm text-[#94a3b8] font-mono break-all mt-1">
                    {w.wallet_address}
                  </p>
                  <p className="text-xs text-[#64748b] mt-1">
                    {new Date(w.created_at).toLocaleDateString(undefined, {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(w.status)}`}>
                    {w.status}
                  </span>

                  {/* Only allow delete if still Pending */}
                  {w.status === "Pending" && (
                    <button
                      onClick={() => deleteWithdrawal(w.id)}
                      className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-semibold px-3 py-1.5 rounded-md transition-all"
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