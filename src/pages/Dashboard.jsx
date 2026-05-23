// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import Loader from "../MainComponets/Loader";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

const PIE_COLORS = ["#10b981", "#38bdf8", "#f59e0b", "#a78bfa", "#f472b6", "#34d399"];

// ── Rank medal colors ──────────────────────────────────────────────────────────
const RANK_STYLE = {
  1: { bg: "bg-yellow-500/20",  text: "text-yellow-400",  border: "border-yellow-500/40",  label: "🥇" },
  2: { bg: "bg-slate-400/15",   text: "text-slate-300",   border: "border-slate-400/30",   label: "🥈" },
  3: { bg: "bg-orange-600/15",  text: "text-orange-400",  border: "border-orange-500/30",  label: "🥉" },
};

const StatCard = ({ label, value, color = "text-slate-100", accent, icon }) => (
  <div className={`bg-[#111c44] border border-[#1e295d] p-6 rounded-xl shadow-xl transition-all duration-300 ${accent}`}>
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">{label}</h2>
      {icon && <span className="text-2xl opacity-60">{icon}</span>}
    </div>
    <p className={`text-3xl font-bold tracking-tight ${color}`}>{value}</p>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f1a3e] border border-[#1e295d] rounded-lg p-3 shadow-xl text-sm">
        <p className="text-[#94a3b8] mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {typeof p.value === "number" && p.value > 100
              ? `$${Number(p.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [stats, setStats]           = useState(null);
  const [topList, setTopList]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [topLoading, setTopLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchTopInvestors();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("dashboard-stats/");
      setStats(res.data);
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

  if (loading) return <Loader />;

  const categoryData = stats?.investment_by_category ?? [];
  const monthlyData  = stats?.monthly_investments    ?? [];

  return (
    <DashboardLayout>
      <div className="text-white font-sans max-w-6xl mx-auto space-y-8">

        {/* PAGE HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Dashboard</h1>
          <p className="text-[#64748b] text-sm mt-1">
            Real-time overview of system activity, capital, and user states.
          </p>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Users"        value={stats?.users ?? 0}
            color="text-slate-100" accent="hover:border-slate-600" icon="👥" />
          <StatCard
            label="Total Investments"
            value={`$${Number(stats?.investments ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            color="text-[#10b981]" accent="hover:border-[#10b981]/50" icon="📈" />
          <StatCard
            label="Total Withdrawals"
            value={`$${Number(stats?.withdrawals ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            color="text-[#38bdf8]" accent="hover:border-[#38bdf8]/30" icon="💸" />
          <StatCard label="Blocked Accounts"   value={stats?.blocked_users ?? 0}
            color="text-red-400" accent="hover:border-red-500/30" icon="🚫" />
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Bar Chart */}
          <div className="bg-[#111c44] border border-[#1e295d] rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-100 mb-1">Investments by Category</h2>
            <p className="text-xs text-[#64748b] mb-5">Total capital allocated per investment type</p>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-[#64748b] italic text-sm">No investment data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={categoryData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e295d" />
                  <XAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#1e295d" }} tickLine={false} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${Number(v).toLocaleString()}`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />
                  <Bar dataKey="total" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie Chart */}
          <div className="bg-[#111c44] border border-[#1e295d] rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-100 mb-1">Portfolio Distribution</h2>
            <p className="text-xs text-[#64748b] mb-5">Share of total capital by category</p>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-[#64748b] italic text-sm">No investment data yet</div>
            ) : (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="55%" height={220}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="total" paddingAngle={3}>
                      {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  {categoryData.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-[#94a3b8] truncate">{entry.category}</span>
                      <span className="ml-auto text-slate-200 font-semibold shrink-0">
                        ${Number(entry.total).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Trend */}
        {monthlyData.length > 0 && (
          <div className="bg-[#111c44] border border-[#1e295d] rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-100 mb-1">Monthly Investment Trend</h2>
            <p className="text-xs text-[#64748b] mb-5">Total investments received per month</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e295d" />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#1e295d" }} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${Number(v).toLocaleString()}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2.5}
                  dot={{ fill: "#10b981", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#10b981" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── TOP INVESTORS LEADERBOARD ── */}
        <div className="bg-[#111c44] border border-[#1e295d] rounded-xl shadow-2xl overflow-hidden">

          {/* Header */}
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
                    <th className="p-4 text-right">Wallet Balance</th>
                    <th className="p-4 text-center">Active Plans</th>
                  </tr>
                </thead>
                <tbody>
                  {topList.map((inv) => {
                    const style = RANK_STYLE[inv.rank] || {
                      bg: "bg-transparent", text: "text-[#94a3b8]",
                      border: "border-transparent", label: `#${inv.rank}`
                    };
                    return (
                      <tr
                        key={inv.rank}
                        className={`border-b border-[#1e295d] transition-colors ${
                          inv.rank <= 3 ? "hover:bg-[#1a2550]" : "hover:bg-[#172554]"
                        }`}
                      >
                        {/* Rank */}
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${style.bg} ${style.text} ${style.border}`}>
                            {inv.rank <= 3 ? style.label : inv.rank}
                          </span>
                        </td>

                        {/* Name + email */}
                        <td className="p-4">
                          <p className="font-semibold text-white">{inv.name}</p>
                          <p className="text-xs text-[#64748b] mt-0.5">{inv.email}</p>
                        </td>

                        {/* Total Invested */}
                        <td className="p-4 text-right font-bold text-[#10b981]">
                          ${Number(inv.total_invested).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>

                        {/* Total Profit */}
                        <td className="p-4 text-right font-semibold text-yellow-400">
                          ${Number(inv.total_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>

                        {/* Wallet Balance */}
                        <td className="p-4 text-right text-slate-200 font-semibold">
                          ${Number(inv.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>

                        {/* Active Plans */}
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

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;