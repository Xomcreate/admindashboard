import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

const RANK_STYLE = {
  1: { bg: "bg-yellow-500/20",  text: "text-yellow-400",  border: "border-yellow-500/40",  label: "🥇" },
  2: { bg: "bg-slate-400/15",   text: "text-slate-300",   border: "border-slate-400/30",   label: "🥈" },
  3: { bg: "bg-orange-600/15",  text: "text-orange-400",  border: "border-orange-500/30",  label: "🥉" },
};

const UserDashboard = () => {
  const [profile,     setProfile]     = useState({});
  const [investments, setInvestments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [topList,     setTopList]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [topLoading,  setTopLoading]  = useState(true);

  useEffect(() => {
    load();
    fetchTopInvestors();
  }, []);

  const load = async () => {
    try {
      const res = await API.get("user-dashboard/");
      setProfile(res.data.profile);
      setInvestments(res.data.investments);
      setWithdrawals(res.data.withdrawals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopInvestors = async () => {
    try {
      const res = await API.get("top-investors/");
      setTopList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setTopLoading(false);
    }
  };

  const totalWithdrawals = withdrawals
    .filter((w) => w.status === "Approved")
    .reduce((sum, w) => sum + parseFloat(w.amount || 0), 0);

  const totalInvested = investments.reduce(
    (sum, inv) => sum + parseFloat(inv.amount || 0), 0
  );

  const totalProfit = investments.reduce(
    (sum, inv) => sum + parseFloat(inv.current_profit || 0), 0
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#10b981]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="text-white space-y-8">

        {/* Welcome Banner */}
        <div className="bg-linear-to-r from-[#0f2057] to-[#111c44] rounded-2xl p-6 border border-[#1e295d]">
          <p className="text-[#94a3b8] text-sm mb-1">Welcome back,</p>
          <h1 className="text-3xl font-bold text-white">
            {profile.name || profile.email || "Investor"} 👋
          </h1>
          <p className="text-[#94a3b8] text-sm mt-2">
            Here's an overview of your portfolio today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#111c44] rounded-xl p-5 border border-[#1e295d]">
            <p className="text-[#94a3b8] text-xs uppercase tracking-wider mb-1">Wallet Balance</p>
            <h2 className="text-2xl font-bold text-[#10b981]">
              ${parseFloat(profile.wallet_balance || 0).toFixed(2)}
            </h2>
            <p className="text-xs text-[#64748b] mt-1">Available to withdraw</p>
          </div>
          <div className="bg-[#111c44] rounded-xl p-5 border border-[#1e295d]">
            <p className="text-[#94a3b8] text-xs uppercase tracking-wider mb-1">Active Profits</p>
            <h2 className="text-2xl font-bold text-yellow-400">
              ${parseFloat(profile.active_profits || 0).toFixed(2)}
            </h2>
            <p className="text-xs text-[#64748b] mt-1">Accumulating daily</p>
          </div>
          <div className="bg-[#111c44] rounded-xl p-5 border border-[#1e295d]">
            <p className="text-[#94a3b8] text-xs uppercase tracking-wider mb-1">Total Balance</p>
            <h2 className="text-2xl font-bold text-blue-400">
              ${parseFloat(profile.live_balance || 0).toFixed(2)}
            </h2>
            <p className="text-xs text-[#64748b] mt-1">Wallet + active profits</p>
          </div>
          <div className="bg-[#111c44] rounded-xl p-5 border border-[#1e295d]">
            <p className="text-[#94a3b8] text-xs uppercase tracking-wider mb-1">Total Withdrawn</p>
            <h2 className="text-2xl font-bold text-red-400">
              ${totalWithdrawals.toFixed(2)}
            </h2>
            <p className="text-xs text-[#64748b] mt-1">Approved withdrawals</p>
          </div>
        </div>

        {/* Investments Table */}
        <div className="bg-[#111c44] rounded-2xl border border-[#1e295d] overflow-hidden">
          <div className="p-5 border-b border-[#1e295d] flex items-center justify-between">
            <h2 className="text-lg font-semibold">My Investments</h2>
            <span className="text-xs bg-[#0a1128] px-3 py-1 rounded-full text-[#94a3b8]">
              {investments.length} plan{investments.length !== 1 ? "s" : ""}
            </span>
          </div>
          {investments.length === 0 ? (
            <div className="p-10 text-center text-[#94a3b8]">
              <p className="text-4xl mb-3">📈</p>
              <p>No investments yet. Start investing to grow your portfolio.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1e295d]">
              {investments.map((inv) => (
                <div key={inv.id} className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0a1128] flex items-center justify-center text-lg">💼</div>
                    <div>
                      <p className="font-semibold">{inv.category}</p>
                      <p className="text-xs text-[#94a3b8]">
                        via {inv.payment_method} · {new Date(inv.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="text-[#94a3b8] text-xs">Amount</p>
                      <p className="font-semibold text-white">${parseFloat(inv.amount).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[#94a3b8] text-xs">Daily ROI</p>
                      <p className="font-semibold text-yellow-400">{inv.daily_roi}%</p>
                    </div>
                    <div>
                      <p className="text-[#94a3b8] text-xs">Profit</p>
                      <p className="font-semibold text-[#10b981]">
                        ${parseFloat(inv.current_profit || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#94a3b8] text-xs">Status</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        inv.active
                          ? "bg-green-900/40 text-green-400"
                          : "bg-red-900/40 text-red-400"
                      }`}>
                        {inv.active ? "Active" : "Expired"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Investors Leaderboard */}
        <div className="bg-[#111c44] border border-[#1e295d] rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e295d]">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">🏆 Top Investors</h2>
              <p className="text-xs text-[#64748b] mt-0.5">Ranked by total capital invested</p>
            </div>
            <span className="text-xs bg-[#0f1a3e] border border-[#1e295d] text-[#94a3b8] px-3 py-1 rounded-full">
              Top {topList.length}
            </span>
          </div>

          {topLoading ? (
            <div className="flex items-center justify-center py-16 text-[#64748b]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10b981] mr-3" />
              Loading leaderboard…
            </div>
          ) : topList.length === 0 ? (
            <div className="text-center py-16 text-[#64748b] italic text-sm">
              No investors with active investments yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0f1a3e] text-[#94a3b8] uppercase text-xs font-semibold tracking-wider">
                    <th className="p-4 text-center w-16">Rank</th>
                    <th className="p-4 text-left">Investor</th>
                    <th className="p-4 text-right">Total Invested</th>
                    <th className="p-4 text-right">Total Profit</th>
                    <th className="p-4 text-center">Active Plans</th>
                  </tr>
                </thead>
                <tbody>
                  {topList.map((inv) => {
                    const isCurrentUser = inv.email === profile.email;
                    const style = RANK_STYLE[inv.rank] || {
                      bg: "bg-transparent", text: "text-[#94a3b8]",
                      border: "border-transparent", label: `#${inv.rank}`,
                    };
                    return (
                      <tr
                        key={inv.rank}
                        className={`border-b border-[#1e295d] transition-colors ${
                          isCurrentUser
                            ? "bg-emerald-900/10 hover:bg-emerald-900/20"
                            : inv.rank <= 3
                            ? "hover:bg-[#1a2550]"
                            : "hover:bg-[#172554]"
                        }`}
                      >
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${style.bg} ${style.text} ${style.border}`}>
                            {inv.rank <= 3 ? style.label : inv.rank}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white">{inv.name}</p>
                            {isCurrentUser && (
                              <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#64748b] mt-0.5">{inv.email}</p>
                        </td>
                        <td className="p-4 text-right font-bold text-[#10b981]">
                          ${Number(inv.total_invested).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-right font-semibold text-yellow-400">
                          ${Number(inv.total_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            inv.active_plans > 0
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-slate-700/50 text-slate-500 border border-slate-600"
                          }`}>
                            {inv.active_plans} plan{inv.active_plans !== 1 ? "s" : ""}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Withdrawals Summary */}
        <div className="bg-[#111c44] rounded-2xl border border-[#1e295d] overflow-hidden">
          <div className="p-5 border-b border-[#1e295d] flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Withdrawals</h2>
            <span className="text-xs bg-[#0a1128] px-3 py-1 rounded-full text-[#94a3b8]">
              {withdrawals.length} request{withdrawals.length !== 1 ? "s" : ""}
            </span>
          </div>
          {withdrawals.length === 0 ? (
            <div className="p-10 text-center text-[#94a3b8]">
              <p className="text-4xl mb-3">💸</p>
              <p>No withdrawals yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1e295d]">
              {withdrawals.map((w) => (
                <div key={w.id} className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">${parseFloat(w.amount).toFixed(2)}</p>
                    <p className="text-xs text-[#94a3b8] font-mono mt-0.5 break-all">{w.wallet_address}</p>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      {new Date(w.created_at).toLocaleDateString(undefined, {
                        year: "numeric", month: "short", day: "numeric"
                      })}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold shrink-0 ${
                    w.status === "Approved"
                      ? "bg-green-900/40 text-green-400"
                      : w.status === "Rejected"
                      ? "bg-red-900/40 text-red-400"
                      : "bg-yellow-900/40 text-yellow-400"
                  }`}>
                    {w.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;