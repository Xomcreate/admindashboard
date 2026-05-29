import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import Loader from "../MainComponets/Loader";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

const PIE_COLORS = ["#10b981", "#0b66e4", "#f59e0b", "#a78bfa", "#f472b6", "#34d399"];

const TIER_STYLE = {
  silver: { bg: "bg-slate-400/15",  text: "text-slate-300",  border: "border-slate-400/30",  label: "🥈 Silver" },
  gold:   { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/40", label: "🥇 Gold"   },
  bronze: { bg: "bg-orange-600/15", text: "text-orange-400", border: "border-orange-500/30", label: "🥉 Bronze" },
  none:   { bg: "bg-[#1e2638]",     text: "text-[#8f9cae]",  border: "border-[#1e2638]",     label: "—"         },
};

const TierBadge = ({ tier }) => {
  const s = TIER_STYLE[tier] || TIER_STYLE.none;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      {s.label}
    </span>
  );
};

const StatCard = ({ label, value, color = "text-white", accent, icon }) => (
  <div className={`bg-[#121824] border border-[#1e2638] p-6 rounded-xl transition-all duration-300 ${accent}`}>
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">{label}</h2>
      {icon && <span className="text-2xl opacity-60">{icon}</span>}
    </div>
    <p className={`text-3xl font-bold tracking-tight ${color}`}>{value}</p>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#090d16] border border-[#1e2638] rounded-lg p-3 text-sm">
        <p className="text-[#8f9cae] mb-1">{label}</p>
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
  const [stats,      setStats]      = useState(null);
  const [topList,    setTopList]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [topLoading, setTopLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchTopInvestors();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("dashboard-stats/");
      setStats(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchTopInvestors = async () => {
    try {
      const res = await API.get("top-investors/");
      setTopList(res.data);
    } catch (err) { console.error(err); }
    finally { setTopLoading(false); }
  };

  if (loading) return <Loader />;

  const categoryData = stats?.investment_by_category ?? [];
  const monthlyData  = stats?.monthly_investments    ?? [];

  return (
    <DashboardLayout>
      <div className="text-white font-sans max-w-6xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold tracking-wide">Dashboard</h1>
          <p className="text-[#8f9cae] text-sm mt-1">
            Real-time overview of system activity, capital, and user states.
          </p>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Users"
            value={stats?.users ?? 0}
            color="text-white" accent="hover:border-[#1e2638]" icon="👥" />
          <StatCard label="Total Investments"
            value={`$${Number(stats?.investments ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            color="text-[#10b981]" accent="hover:border-[#10b981]/40" icon="📈" />
          <StatCard label="Total Withdrawals"
            value={`$${Number(stats?.withdrawals ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            color="text-[#0b66e4]" accent="hover:border-[#0b66e4]/30" icon="💸" />
          <StatCard label="Blocked Accounts"
            value={stats?.blocked_users ?? 0}
            color="text-red-400" accent="hover:border-red-500/30" icon="🚫" />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-1">Investments by Category</h2>
            <p className="text-xs text-[#8f9cae] mb-5">Total capital allocated per investment type</p>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-[#8f9cae] italic text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={categoryData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2638" />
                  <XAxis dataKey="category" tick={{ fill: "#8f9cae", fontSize: 11 }} axisLine={{ stroke: "#1e2638" }} tickLine={false} />
                  <YAxis tick={{ fill: "#8f9cae", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${Number(v).toLocaleString()}`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(11,102,228,0.06)" }} />
                  <Bar dataKey="total" fill="#0b66e4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-1">Portfolio Distribution</h2>
            <p className="text-xs text-[#8f9cae] mb-5">Share of total capital by category</p>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-[#8f9cae] italic text-sm">No data yet</div>
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
                      <span className="text-[#8f9cae] truncate">{entry.category}</span>
                      <span className="ml-auto text-white font-semibold shrink-0">
                        ${Number(entry.total).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MONTHLY TREND */}
        {monthlyData.length > 0 && (
          <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-1">Monthly Investment Trend</h2>
            <p className="text-xs text-[#8f9cae] mb-5">Total investments received per month</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2638" />
                <XAxis dataKey="month" tick={{ fill: "#8f9cae", fontSize: 11 }} axisLine={{ stroke: "#1e2638" }} tickLine={false} />
                <YAxis tick={{ fill: "#8f9cae", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${Number(v).toLocaleString()}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="total" stroke="#0b66e4" strokeWidth={2.5}
                  dot={{ fill: "#0b66e4", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#0b66e4" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* TOP INVESTORS */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e2638]">
            <div>
              <h2 className="text-lg font-semibold text-white">🏆 Top Investors</h2>
              <p className="text-xs text-[#8f9cae] mt-0.5">
                Tier by investment count · Silver (1–2) · Gold (3–5) · Bronze elite (6+)
              </p>
            </div>
            <span className="text-xs bg-[#090d16] border border-[#1e2638] text-[#8f9cae] px-3 py-1 rounded-full">
              Top {topList.length}
            </span>
          </div>

          {topLoading ? (
            <div className="flex items-center justify-center py-16 text-[#8f9cae]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b66e4] mr-3" />
              Loading leaderboard…
            </div>
          ) : topList.length === 0 ? (
            <div className="text-center py-16 text-[#8f9cae] italic text-sm">
              No investors yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#090d16] text-[#8f9cae] uppercase text-xs font-semibold tracking-wider">
                    <th className="p-4 text-center w-16">Rank</th>
                    <th className="p-4 text-left">Investor</th>
                    <th className="p-4 text-center">Tier</th>
                    <th className="p-4 text-right">Total Invested</th>
                    <th className="p-4 text-right">Total Profit</th>
                    <th className="p-4 text-right">Wallet Balance</th>
                    <th className="p-4 text-center">Active Plans</th>
                    <th className="p-4 text-center"># Investments</th>
                  </tr>
                </thead>
                <tbody>
                  {topList.map((inv) => {
                    const rankLabel =
                      inv.rank === 1 ? "🥇" :
                      inv.rank === 2 ? "🥈" :
                      inv.rank === 3 ? "🥉" : `#${inv.rank}`;
                    return (
                      <tr key={inv.rank} className="border-b border-[#1e2638] hover:bg-[#1e2638]/50 transition-colors">
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold bg-[#090d16] border border-[#1e2638] text-[#8f9cae]">
                            {rankLabel}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-white">{inv.name}</p>
                          <p className="text-xs text-[#8f9cae]/60 mt-0.5">{inv.email}</p>
                        </td>
                        <td className="p-4 text-center">
                          <TierBadge tier={inv.tier} />
                        </td>
                        <td className="p-4 text-right font-bold text-[#10b981]">
                          ${Number(inv.total_invested).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-right font-semibold text-yellow-400">
                          ${Number(inv.total_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-right text-white font-semibold">
                          ${Number(inv.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            inv.active_plans > 0
                              ? "bg-[#0b66e4]/15 text-[#0b66e4] border border-[#0b66e4]/30"
                              : "bg-[#1e2638] text-[#8f9cae] border border-[#1e2638]"
                          }`}>
                            {inv.active_plans} plan{inv.active_plans !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td className="p-4 text-center text-[#8f9cae] font-semibold">
                          {inv.investment_count}
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