// src/pages/Dashboard.jsx  (Admin)
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import Loader from "../MainComponets/Loader";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from "recharts";
import {
  FaRobot, FaExchangeAlt, FaShoppingCart, FaChartLine, FaUsers,
  FaWallet, FaBan, FaArrowDown, FaFire, FaBolt, FaGem,
} from "react-icons/fa";

const PIE_COLORS = ["#c45a45", "#e07060", "#a03929", "#10b981", "#f59e0b", "#a78bfa"];

const TIER_STYLE = {
  silver:  { bg: "dark:bg-slate-400/15 light:bg-slate-100",  text: "dark:text-slate-300 light:text-slate-600",  border: "dark:border-slate-400/30 light:border-slate-300",  label: "🥈 Silver"  },
  gold:    { bg: "dark:bg-yellow-500/20 light:bg-yellow-50", text: "dark:text-yellow-400 light:text-yellow-600", border: "dark:border-yellow-500/40 light:border-yellow-300", label: "🥇 Gold"    },
  diamond: { bg: "dark:bg-violet-500/15 light:bg-violet-50", text: "dark:text-violet-300 light:text-violet-600", border: "dark:border-violet-500/30 light:border-violet-300", label: "💎 Diamond" },
  none:    { bg: "dark:bg-white/5 light:bg-gray-100",        text: "dark:text-white/50 light:text-gray-500",    border: "dark:border-white/10 light:border-gray-200",       label: "—"          },
};

/* Mask email: show first 2 chars + *** + @domain */
const maskEmail = (email = "") => {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "••••••@•••••";
  return `${user.slice(0, 2)}${"•".repeat(Math.min(5, user.length - 2))}@${domain}`;
};

const TierBadge = ({ tier }) => {
  const s = TIER_STYLE[tier] || TIER_STYLE.none;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      {s.label}
    </span>
  );
};

const StatCard = ({ label, value, color, accent, icon, sub }) => (
  <div className={`dark:bg-[#0A0A0B] light:bg-white border dark:border-white/6 light:border-gray-200 p-5 rounded-2xl transition-all duration-300 group ${accent}`}>
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm border ${
        accent?.includes("c45a45")
          ? "bg-[#c45a45]/15 border-[#c45a45]/25 text-[#c45a45]"
          : accent?.includes("10b981")
          ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400"
          : accent?.includes("red")
          ? "bg-red-400/10 border-red-400/20 text-red-400"
          : "dark:bg-white/5 dark:border-white/8 dark:text-white/40 light:bg-gray-100 light:border-gray-200 light:text-gray-500"
      }`}>
        {icon}
      </div>
      {sub && <span className="text-[10px] dark:text-white/25 light:text-gray-400">{sub}</span>}
    </div>
    <p className="text-[11px] uppercase tracking-widest dark:text-white/40 light:text-gray-500 mb-1">{label}</p>
    <p className={`text-2xl font-bold tracking-tight ${color}`}>{value}</p>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="dark:bg-[#141212] light:bg-white border dark:border-white/10 light:border-gray-200 rounded-xl p-3 text-sm shadow-xl">
        <p className="dark:text-white/50 light:text-gray-500 mb-1 text-xs">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-bold text-sm">
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

/* ── Mock trading analysis data ── */
const mockTradingActivity = [
  { name: "Mon", stocks: 42, copyTrade: 18, bots: 31 },
  { name: "Tue", stocks: 58, copyTrade: 24, bots: 45 },
  { name: "Wed", stocks: 35, copyTrade: 31, bots: 28 },
  { name: "Thu", stocks: 71, copyTrade: 19, bots: 52 },
  { name: "Fri", stocks: 90, copyTrade: 44, bots: 67 },
  { name: "Sat", stocks: 48, copyTrade: 29, bots: 38 },
  { name: "Sun", stocks: 55, copyTrade: 35, bots: 41 },
];

const mockPlanDistribution = [
  { name: "Trial",     value: 12, color: "#10b981" },
  { name: "Essential", value: 28, color: "#f59e0b" },
  { name: "Premium",   value: 19, color: "#c45a45" },
  { name: "Ultimate",  value: 15, color: "#a78bfa" },
  { name: "Royal",     value: 8,  color: "#e07060" },
  { name: "Diamond",   value: 5,  color: "#a03929" },
];

const Dashboard = () => {
  const [stats,      setStats]      = useState(null);
  const [topList,    setTopList]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [topLoading, setTopLoading] = useState(true);

  useEffect(() => { fetchStats(); fetchTopInvestors(); }, []);

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
      <div className="dark:text-white light:text-gray-900 font-sans max-w-6xl mx-auto space-y-8">

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-widest dark:text-white/30 light:text-gray-400 mb-1">Admin Overview</p>
            <h1 className="text-3xl font-bold tracking-tight dark:text-white light:text-gray-900">Dashboard</h1>
            <p className="dark:text-white/40 light:text-gray-500 text-sm mt-1">
              Real-time capital flows, user tiers, and trading performance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs dark:text-white/40 light:text-gray-400">Live</span>
          </div>
        </div>

        {/* ── METRIC CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users"
            value={stats?.users ?? 0}
            color="dark:text-white light:text-gray-900"
            accent="dark:hover:border-white/20 light:hover:border-gray-300"
            icon={<FaUsers />} sub="All accounts" />
          <StatCard label="Total Investments"
            value={`$${Number(stats?.investments ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            color="text-emerald-400"
            accent="dark:hover:border-emerald-500/30 light:hover:border-emerald-300"
            icon={<FaChartLine />} sub="Capital deployed" />
          <StatCard label="Total Withdrawals"
            value={`$${Number(stats?.withdrawals ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            color="text-[#c45a45]"
            accent="dark:hover:border-[#c45a45]/40 light:hover:border-red-300"
            icon={<FaArrowDown />} sub="Paid out" />
          <StatCard label="Blocked Accounts"
            value={stats?.blocked_users ?? 0}
            color="text-red-400"
            accent="dark:hover:border-red-500/30 light:hover:border-red-200"
            icon={<FaBan />} sub="Restricted" />
        </div>

        {/* ── TRADING ACTIVITY OVERVIEW ── */}
        <div className="dark:bg-[#0A0A0B] light:bg-white border dark:border-white/6 light:border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold dark:text-white light:text-gray-900">Trading Activity</h2>
              <p className="text-xs dark:text-white/40 light:text-gray-500 mt-0.5">Weekly breakdown across all trading modules</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] dark:text-white/30 light:text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#c45a45]" />Stocks</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10b981]" />Copy Trade</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#a78bfa]" />AI Bots</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockTradingActivity} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gStocks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c45a45" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#c45a45" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCopy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gBots" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="stocks"    stroke="#c45a45" fill="url(#gStocks)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="copyTrade" stroke="#10b981" fill="url(#gCopy)"   strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="bots"      stroke="#a78bfa" fill="url(#gBots)"   strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── TRADING MODULE STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <FaShoppingCart />, label: "Stocks",       sub: "Purchase orders",  val: "Active", accent: "text-[#c45a45]", bg: "bg-[#c45a45]/10 border-[#c45a45]/20 text-[#c45a45]" },
            { icon: <FaExchangeAlt />,  label: "Copy Trading",  sub: "Mirrored traders", val: "Live",   accent: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" },
            { icon: <FaRobot />,        label: "AI Bots",       sub: "Automated trades", val: "Running",accent: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/20 text-violet-400" },
          ].map((m) => (
            <div key={m.label} className="dark:bg-[#0A0A0B] light:bg-white border dark:border-white/6 light:border-gray-200 rounded-2xl p-5 flex items-center gap-4 dark:hover:border-white/15 light:hover:border-gray-300 transition-colors">
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center text-base shrink-0 ${m.bg}`}>
                {m.icon}
              </div>
              <div>
                <p className="text-xs dark:text-white/35 light:text-gray-400 mb-0.5">{m.sub}</p>
                <p className="dark:text-white light:text-gray-900 font-bold text-sm">{m.label}</p>
              </div>
              <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-lg dark:bg-white/5 light:bg-gray-100 ${m.accent}`}>{m.val}</span>
            </div>
          ))}
        </div>

        {/* ── TIER LEGEND ── */}
        <div className="dark:bg-[#0A0A0B] light:bg-white border dark:border-white/6 light:border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold dark:text-white/60 light:text-gray-600 uppercase tracking-wider mb-4">Investor Tier System</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { emoji: "🥈", label: "Silver",  sub1: "1 – 2 investments", sub2: "Entry-level investor", bg: "dark:bg-slate-400/10 light:bg-slate-50", border: "dark:border-slate-400/25 light:border-slate-200", text: "dark:text-slate-300 light:text-slate-600" },
              { emoji: "🥇", label: "Gold",    sub1: "3 – 5 investments", sub2: "Mid-tier investor",    bg: "dark:bg-yellow-500/10 light:bg-yellow-50", border: "dark:border-yellow-500/25 light:border-yellow-200", text: "dark:text-yellow-400 light:text-yellow-600" },
              { emoji: "💎", label: "Diamond", sub1: "6+ investments",    sub2: "Elite investor status", bg: "dark:bg-violet-500/10 light:bg-violet-50", border: "dark:border-violet-500/25 light:border-violet-200", text: "dark:text-violet-300 light:text-violet-600" },
            ].map((t) => (
              <div key={t.label} className={`${t.bg} border ${t.border} rounded-xl p-4 flex items-center gap-4`}>
                <span className="text-3xl">{t.emoji}</span>
                <div>
                  <p className={`${t.text} font-bold`}>{t.label}</p>
                  <p className="text-xs dark:text-white/50 light:text-gray-500 mt-0.5">{t.sub1}</p>
                  <p className="text-xs dark:text-white/40 light:text-gray-400">{t.sub2}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PLAN DISTRIBUTION + BAR CHART ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="dark:bg-[#0A0A0B] light:bg-white border dark:border-white/6 light:border-gray-200 rounded-2xl p-6">
            <h2 className="text-base font-bold dark:text-white light:text-gray-900 mb-1">Investments by Plan</h2>
            <p className="text-xs dark:text-white/40 light:text-gray-500 mb-5">Capital allocated per plan tier</p>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-48 dark:text-white/30 light:text-gray-400 italic text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={categoryData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="category" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${Number(v).toLocaleString()}`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(196,90,69,0.06)" }} />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                    {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="dark:bg-[#0A0A0B] light:bg-white border dark:border-white/6 light:border-gray-200 rounded-2xl p-6">
            <h2 className="text-base font-bold dark:text-white light:text-gray-900 mb-1">Portfolio Distribution</h2>
            <p className="text-xs dark:text-white/40 light:text-gray-500 mb-5">Share of total capital by plan</p>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-48 dark:text-white/30 light:text-gray-400 italic text-sm">No data yet</div>
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
                      <span className="dark:text-white/50 light:text-gray-500 truncate">{entry.category}</span>
                      <span className="ml-auto dark:text-white light:text-gray-900 font-bold shrink-0">
                        ${Number(entry.total).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── MONTHLY TREND ── */}
        {monthlyData.length > 0 && (
          <div className="dark:bg-[#0A0A0B] light:bg-white border dark:border-white/6 light:border-gray-200 rounded-2xl p-6">
            <h2 className="text-base font-bold dark:text-white light:text-gray-900 mb-1">Monthly Investment Trend</h2>
            <p className="text-xs dark:text-white/40 light:text-gray-500 mb-5">Total investments received per month</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${Number(v).toLocaleString()}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="total" stroke="#c45a45" strokeWidth={2.5}
                  dot={{ fill: "#c45a45", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#c45a45" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── TOP INVESTORS (emails masked) ── */}
        <div className="dark:bg-[#0A0A0B] light:bg-white border dark:border-white/6 light:border-gray-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b dark:border-white/6 light:border-gray-200">
            <div>
              <h2 className="text-base font-bold dark:text-white light:text-gray-900">🏆 Top Investors</h2>
              <p className="text-xs dark:text-white/40 light:text-gray-500 mt-0.5">
                Tier by count · 🥈 Silver (1–2) · 🥇 Gold (3–5) · 💎 Diamond (6+)
              </p>
            </div>
            <span className="text-xs dark:bg-white/5 light:bg-gray-100 border dark:border-white/10 light:border-gray-200 dark:text-white/50 light:text-gray-500 px-3 py-1 rounded-full">
              Top {topList.length}
            </span>
          </div>

          {topLoading ? (
            <div className="flex items-center justify-center py-16 dark:text-white/40 light:text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c45a45] mr-3" />
              Loading leaderboard…
            </div>
          ) : topList.length === 0 ? (
            <div className="text-center py-16 dark:text-white/40 light:text-gray-400 italic text-sm">No investors yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="dark:bg-white/2 light:bg-gray-50 dark:text-white/40 light:text-gray-500 uppercase text-xs font-semibold tracking-wider border-b dark:border-white/6 light:border-gray-200">
                    <th className="p-4 text-center w-16">Rank</th>
                    <th className="p-4 text-left">Investor</th>
                    <th className="p-4 text-center">Tier</th>
                    <th className="p-4 text-right">Total Invested</th>
                    <th className="p-4 text-right">Total Profit</th>
                    <th className="p-4 text-right">Wallet</th>
                    <th className="p-4 text-center">Plans</th>
                    <th className="p-4 text-center">#</th>
                  </tr>
                </thead>
                <tbody>
                  {topList.map((inv) => {
                    const rankLabel =
                      inv.rank === 1 ? "🥇" :
                      inv.rank === 2 ? "🥈" :
                      inv.rank === 3 ? "🥉" : `#${inv.rank}`;
                    return (
                      <tr key={inv.rank} className="border-b dark:border-white/5 light:border-gray-100 dark:hover:bg-white/2 light:hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold dark:bg-white/5 light:bg-gray-100 border dark:border-white/10 light:border-gray-200 dark:text-white/50 light:text-gray-500">
                            {rankLabel}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold dark:text-white light:text-gray-900">{inv.name}</p>
                          <p className="text-xs dark:text-white/25 light:text-gray-400 mt-0.5 font-mono">{maskEmail(inv.email)}</p>
                        </td>
                        <td className="p-4 text-center"><TierBadge tier={inv.tier} /></td>
                        <td className="p-4 text-right font-bold text-emerald-400">
                          ${Number(inv.total_invested).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-right font-semibold text-yellow-400">
                          ${Number(inv.total_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-right dark:text-white light:text-gray-900 font-semibold">
                          ${Number(inv.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            inv.active_plans > 0
                              ? "bg-[#c45a45]/15 dark:text-white light:text-gray-900 border border-[#c45a45]/30"
                              : "dark:bg-white/5 light:bg-gray-100 dark:text-white/40 light:text-gray-400 border dark:border-white/10 light:border-gray-200"
                          }`}>
                            {inv.active_plans}
                          </span>
                        </td>
                        <td className="p-4 text-center dark:text-white/50 light:text-gray-500 font-semibold">
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