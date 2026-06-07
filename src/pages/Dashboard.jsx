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
  FaBan, FaArrowDown, FaArrowUp,
  FaSignal, FaGlobe,
} from "react-icons/fa";

const PIE_COLORS = ["#c45a45", "#e07060", "#a03929", "#10b981", "#f59e0b", "#a78bfa"];

const TIER_STYLE = {
  silver:  { bg: "bg-slate-100 dark:bg-slate-400/15",   text: "text-slate-600 dark:text-slate-300",   border: "border-slate-300 dark:border-slate-400/30",   label: "🥈 Silver"  },
  gold:    { bg: "bg-yellow-50 dark:bg-yellow-500/20",  text: "text-yellow-600 dark:text-yellow-400", border: "border-yellow-300 dark:border-yellow-500/40", label: "🥇 Gold"    },
  diamond: { bg: "bg-violet-50 dark:bg-violet-500/15",  text: "text-violet-600 dark:text-violet-300", border: "border-violet-300 dark:border-violet-500/30", label: "💎 Diamond" },
  none:    { bg: "bg-gray-100 dark:bg-white/5",         text: "text-gray-500 dark:text-white/50",     border: "border-gray-200 dark:border-white/10",        label: "—"          },
};

/* ─── Investment Plans ─── */
const INVESTMENT_PLANS = [
  { name: "Trial",     icon: "🌱", min: 500,    max: 5000,    duration: "3 Days",   minReturn: "15%",    maxReturn: "20%",    color: "#10b981" },
  { name: "Essential", icon: "🛡️", min: 5000,   max: 10000,   duration: "14 Days",  minReturn: "30%",    maxReturn: "35%",    color: "#3b82f6" },
  { name: "Premium",   icon: "✨", min: 10000,  max: 50000,   duration: "30 Days",  minReturn: "60%",    maxReturn: "65%",    color: "#f59e0b" },
  { name: "Ultimate",  icon: "🔥", min: 50000,  max: 250000,  duration: "60 Days",  minReturn: "290%",   maxReturn: "300%",   color: "#c45a45" },
  { name: "Royal",     icon: "👑", min: 250000, max: 500000,  duration: "90 Days",  minReturn: "550%",   maxReturn: "600%",   color: "#8b5cf6" },
  { name: "Diamond",   icon: "💎", min: 500000, max: 2000000, duration: "120 Days", minReturn: "1,450%", maxReturn: "1,500%", color: "#06b6d4" },
];

/* ─── Signal data ─── */
const signalData = [
  { time: "00:00", strength: 42 },
  { time: "03:00", strength: 58 },
  { time: "06:00", strength: 51 },
  { time: "09:00", strength: 74 },
  { time: "12:00", strength: 88 },
  { time: "15:00", strength: 65 },
  { time: "18:00", strength: 79 },
  { time: "21:00", strength: 91 },
  { time: "Now",   strength: 84 },
];

const tradingModules = [
  { name: "Stock Signals", pct: 84, color: "#c45a45", icon: <FaShoppingCart />, status: "Strong Buy" },
  { name: "Copy Trading",  pct: 67, color: "#10b981", icon: <FaExchangeAlt />,  status: "Active"     },
  { name: "AI Bot Engine", pct: 91, color: "#a78bfa", icon: <FaRobot />,        status: "Optimal"    },
];

/* ─── Market Overview Data ─── */
const marketAssets = [
  { symbol: "BTC",  name: "Bitcoin",        price: 67842.50, change: +2.34, color: "#f59e0b", sparkline: [61000,63200,62100,65000,64500,66800,67200,67842] },
  { symbol: "ETH",  name: "Ethereum",       price: 3541.20,  change: +1.87, color: "#6366f1", sparkline: [3200,3310,3280,3400,3380,3450,3510,3541] },
  { symbol: "AAPL", name: "Apple Inc.",     price: 189.45,   change: -0.52, color: "#10b981", sparkline: [191,190,192,191,190,189,190,189] },
  { symbol: "TSLA", name: "Tesla",          price: 248.30,   change: +3.21, color: "#c45a45", sparkline: [232,235,238,241,244,245,247,248] },
  { symbol: "GOLD", name: "Gold (XAU/USD)", price: 2341.80,  change: +0.45, color: "#d97706", sparkline: [2310,2318,2325,2320,2330,2335,2338,2341] },
  { symbol: "SPX",  name: "S&P 500",        price: 5248.90,  change: +0.78, color: "#8b5cf6", sparkline: [5180,5195,5200,5210,5220,5230,5240,5248] },
];

/* ─── Helpers ─── */
const getSignal = (change) => {
  if (change > 2)  return { label: "Strong Buy", style: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" };
  if (change > 0)  return { label: "Buy",        style: "bg-emerald-400/8 text-emerald-300 border-emerald-400/15" };
  if (change > -2) return { label: "Neutral",    style: "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/30 border-gray-200 dark:border-white/10" };
  return                  { label: "Sell",       style: "bg-red-400/10 text-red-400 border-red-400/20" };
};

/* ─── Sub-components ─── */
const TierBadge = ({ tier }) => {
  const s = TIER_STYLE[tier] || TIER_STYLE.none;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      {s.label}
    </span>
  );
};

const StatCard = ({ label, value, color, accent, icon, sub }) => (
  <div className={`dark:bg-[#0A0A0B] bg-white border dark:border-white/6 border-gray-200 p-5 rounded-2xl transition-all duration-300 group ${accent}`}>
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm border ${
        accent?.includes("c45a45")
          ? "bg-[#c45a45]/15 border-[#c45a45]/25 text-[#c45a45]"
          : accent?.includes("10b981")
          ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400"
          : accent?.includes("red")
          ? "bg-red-400/10 border-red-400/20 text-red-400"
          : "dark:bg-white/5 dark:border-white/8 dark:text-white/40 bg-gray-100 border-gray-200 text-gray-500"
      }`}>
        {icon}
      </div>
      {sub && <span className="text-[10px] dark:text-white/25 text-gray-400">{sub}</span>}
    </div>
    <p className="text-[11px] uppercase tracking-widest dark:text-white/40 text-gray-500 mb-1">{label}</p>
    <p className={`text-2xl font-bold tracking-tight ${color}`}>{value}</p>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="dark:bg-[#141212] bg-white border dark:border-white/10 border-gray-200 rounded-xl p-3 text-sm shadow-xl">
        <p className="dark:text-white/50 text-gray-500 mb-1 text-xs">{label}</p>
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

const SignalTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="dark:bg-[#141212] bg-white border dark:border-white/10 border-gray-200 rounded-xl p-2.5 text-xs shadow-xl">
        <p className="dark:text-white/40 text-gray-400 mb-1">{label}</p>
        <p className="text-[#c45a45] font-bold">{payload[0].value}% Signal</p>
      </div>
    );
  }
  return null;
};

/* ─── Sparkline SVG ─── */
const SparklineSVG = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 200, H = 44;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 6) - 3;
    return { x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)) };
  });
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const polygon  = `${polyline} ${W},${H} 0,${H}`;
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-11">
      <polygon points={polygon} fill={color} opacity="0.08" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="3" fill={color} />
    </svg>
  );
};

/* ─── Asset Card ─── */
const AssetCard = ({ asset }) => {
  const isPositive = asset.change >= 0;
  const { label: signalLabel, style: signalStyle } = getSignal(asset.change);
  return (
    <div className="bg-white dark:bg-[#0f0e0e] border border-gray-200 dark:border-white/[0.07] rounded-xl p-3.5 flex flex-col gap-2.5 hover:border-gray-300 dark:hover:border-white/12 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
            style={{ backgroundColor: `${asset.color}18`, color: asset.color }}
          >
            {asset.symbol.slice(0, 2)}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">{asset.symbol}</p>
            <p className="text-[10px] text-gray-400 dark:text-white/30 mt-0.5 leading-none truncate max-w-20">{asset.name}</p>
          </div>
        </div>
        <span className={`text-[11px] font-bold flex items-center gap-0.5 ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          {isPositive ? <FaArrowUp className="text-[9px]" /> : <FaArrowDown className="text-[9px]" />}
          {Math.abs(asset.change).toFixed(2)}%
        </span>
      </div>
      <SparklineSVG data={asset.sparkline} color={asset.color} />
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${signalStyle}`}>
          {signalLabel}
        </span>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
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

  const currentSignal = signalData[signalData.length - 1].strength;
  const signalLabel =
    currentSignal >= 80 ? "Strong Buy" :
    currentSignal >= 60 ? "Buy" :
    currentSignal >= 40 ? "Neutral" : "Weak";
  const signalColor =
    currentSignal >= 80 ? "text-emerald-400" :
    currentSignal >= 60 ? "text-yellow-400" :
    currentSignal >= 40 ? "text-gray-400" : "text-red-400";

  return (
    <DashboardLayout>
      <div className="dark:text-white text-gray-900 font-sans max-w-6xl mx-auto space-y-8">

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-widest dark:text-white/30 text-gray-400 mb-1">Admin Overview</p>
            <h1 className="text-3xl font-bold tracking-tight dark:text-white text-gray-900">Dashboard</h1>
            <p className="dark:text-white/40 text-gray-500 text-sm mt-1">
              Real-time capital flows, user tiers, and trading performance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs dark:text-white/40 text-gray-400">Live</span>
          </div>
        </div>

        {/* ── METRIC CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users"
            value={stats?.users ?? 0}
            color="dark:text-white text-gray-900"
            accent="dark:hover:border-white/20 hover:border-gray-300"
            icon={<FaUsers />} sub="All accounts" />
          <StatCard label="Total Investments"
            value={`$${Number(stats?.investments ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            color="text-emerald-400"
            accent="dark:hover:border-emerald-500/30 hover:border-emerald-300"
            icon={<FaChartLine />} sub="Capital deployed" />
          <StatCard label="Total Withdrawals"
            value={`$${Number(stats?.withdrawals ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            color="text-[#c45a45]"
            accent="dark:hover:border-[#c45a45]/40 hover:border-red-300"
            icon={<FaArrowDown />} sub="Paid out" />
          <StatCard label="Blocked Accounts"
            value={stats?.blocked_users ?? 0}
            color="text-red-400"
            accent="dark:hover:border-red-500/30 hover:border-red-200"
            icon={<FaBan />} sub="Restricted" />
        </div>

        {/* ── TRADING SIGNAL ANALYSIS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Signal Strength Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold dark:text-white text-gray-900 flex items-center gap-2">
                  <FaSignal className="text-[#c45a45]" /> Trading Signal Analysis
                </h2>
                <p className="text-[11px] dark:text-white/30 text-gray-400 mt-0.5">Live market signal strength over 24h</p>
              </div>
              <div className="text-right">
                <p className={`text-xl font-black ${signalColor}`}>{currentSignal}%</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  currentSignal >= 80
                    ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                    : "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                }`}>
                  {signalLabel}
                </span>
              </div>
            </div>

            {/* Signal strength bar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${currentSignal}%`, background: `linear-gradient(90deg, #c45a45, #e07060)` }}
                />
              </div>
              <span className="text-xs dark:text-white/30 text-gray-400 shrink-0">Signal Power</span>
            </div>

            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={signalData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="signalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#c45a45" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#c45a45" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fill: "rgba(150,150,150,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "rgba(150,150,150,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<SignalTooltip />} />
                  <Area type="monotone" dataKey="strength" stroke="#c45a45" strokeWidth={2} fillOpacity={1} fill="url(#signalGrad)" dot={{ fill: "#c45a45", r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Module Signal Strength */}
          <div className="bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold dark:text-white text-gray-900 mb-0.5">Module Signals</h2>
              <p className="text-[11px] dark:text-white/30 text-gray-400 mb-4">Live signal per trading engine</p>
            </div>
            <div className="space-y-4">
              {tradingModules.map((mod) => (
                <div key={mod.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="dark:text-white/60 text-gray-500 flex items-center gap-2">
                      <span className="text-[11px]" style={{ color: mod.color }}>{mod.icon}</span>
                      {mod.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                        style={{ backgroundColor: `${mod.color}18`, color: mod.color }}>
                        {mod.status}
                      </span>
                      <span className="dark:text-white text-gray-900 font-bold">{mod.pct}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${mod.pct}%`, backgroundColor: mod.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 dark:border-white/5 pt-3 mt-4 flex items-center justify-between text-[10px] dark:text-white/25 text-gray-400">
              <span>All systems operational</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </div>

        {/* ── MARKET OVERVIEW (Card Grid) ── */}
        <div className="bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold dark:text-white text-gray-900 flex items-center gap-2">
                <FaGlobe className="text-[#c45a45]" /> Market Overview
              </h2>
              <p className="text-[11px] dark:text-white/30 text-gray-400 mt-0.5">Live prices across key assets</p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Markets Open
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {marketAssets.map((asset) => (
              <AssetCard key={asset.symbol} asset={asset} />
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-white/4 text-[10px] dark:text-white/25 text-gray-400">
            <span>Data updates every 30 seconds</span>
            <span>Prices indicative only · not financial advice</span>
          </div>
        </div>

        {/* ── PLAN DISTRIBUTION + PIE CHART ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="dark:bg-[#0A0A0B] bg-white border dark:border-white/6 border-gray-200 rounded-2xl p-6">
            <h2 className="text-base font-bold dark:text-white text-gray-900 mb-1">Investments by Plan</h2>
            <p className="text-xs dark:text-white/40 text-gray-500 mb-5">Capital allocated per plan tier</p>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-48 dark:text-white/30 text-gray-400 italic text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={categoryData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="category" tick={{ fill: "rgba(150,150,150,0.5)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(150,150,150,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${Number(v).toLocaleString()}`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(196,90,69,0.06)" }} />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                    {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="dark:bg-[#0A0A0B] bg-white border dark:border-white/6 border-gray-200 rounded-2xl p-6">
            <h2 className="text-base font-bold dark:text-white text-gray-900 mb-1">Portfolio Distribution</h2>
            <p className="text-xs dark:text-white/40 text-gray-500 mb-5">Share of total capital by plan</p>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-48 dark:text-white/30 text-gray-400 italic text-sm">No data yet</div>
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
                      <span className="dark:text-white/50 text-gray-500 truncate">{entry.category}</span>
                      <span className="ml-auto dark:text-white text-gray-900 font-bold shrink-0">
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
          <div className="dark:bg-[#0A0A0B] bg-white border dark:border-white/6 border-gray-200 rounded-2xl p-6">
            <h2 className="text-base font-bold dark:text-white text-gray-900 mb-1">Monthly Investment Trend</h2>
            <p className="text-xs dark:text-white/40 text-gray-500 mb-5">Total investments received per month</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(150,150,150,0.5)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} />
                <YAxis tick={{ fill: "rgba(150,150,150,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${Number(v).toLocaleString()}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="total" stroke="#c45a45" strokeWidth={2.5}
                  dot={{ fill: "#c45a45", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#c45a45" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── INVESTMENT PLANS ── */}
        <div className="dark:bg-[#0A0A0B] bg-white border dark:border-white/6 border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b dark:border-white/6 border-gray-200">
            <h2 className="text-base font-bold dark:text-white text-gray-900">📊 Investment Tiers</h2>
            <p className="text-xs dark:text-white/40 text-gray-500 mt-0.5">All available plans and their return ranges</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="dark:bg-white/1 bg-gray-50 dark:text-white/30 text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b dark:border-white/6 border-gray-200">
                  <th className="p-4">Plan</th>
                  <th className="p-4 text-center">Duration</th>
                  <th className="p-4 text-right">Min. Investment</th>
                  <th className="p-4 text-right">Max. Investment</th>
                  <th className="p-4 text-center">Returns</th>
                </tr>
              </thead>
              <tbody>
                {INVESTMENT_PLANS.map((plan) => (
                  <tr key={plan.name} className="border-b dark:border-white/4 border-gray-100 dark:hover:bg-white/1 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg dark:bg-white/5 bg-gray-100 border dark:border-white/8 border-gray-200 flex items-center justify-center text-base">
                          {plan.icon}
                        </span>
                        <div>
                          <p className="font-bold dark:text-white text-gray-900">{plan.name} Plan</p>
                          <p className="text-[10px] dark:text-white/25 text-gray-400 mt-0.5">Investment Tier</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 rounded-md font-semibold text-[11px]"
                        style={{ backgroundColor: `${plan.color}15`, color: plan.color }}>
                        {plan.duration}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold dark:text-white text-gray-900">
                      ${plan.min.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-bold dark:text-white text-gray-900">
                      ${plan.max.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-[11px]">
                        <span className="text-emerald-400 font-bold">{plan.minReturn}</span>
                        <span className="dark:text-white/20 text-gray-300">–</span>
                        <span className="text-[#c45a45] font-bold">{plan.maxReturn}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── TOP INVESTORS (emails masked) ── */}
        <div className="dark:bg-[#0A0A0B] bg-white border dark:border-white/6 border-gray-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b dark:border-white/6 border-gray-200">
            <div>
              <h2 className="text-base font-bold dark:text-white text-gray-900">🏆 Top Investors</h2>
              <p className="text-xs dark:text-white/40 text-gray-500 mt-0.5">
                Tier by count · 🥈 Silver (1–2) · 🥇 Gold (3–5) · 💎 Diamond (6+)
              </p>
            </div>
            <span className="text-xs dark:bg-white/5 bg-gray-100 border dark:border-white/10 border-gray-200 dark:text-white/50 text-gray-500 px-3 py-1 rounded-full">
              Top {topList.length}
            </span>
          </div>

          {topLoading ? (
            <div className="flex items-center justify-center py-16 dark:text-white/40 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c45a45] mr-3" />
              Loading leaderboard…
            </div>
          ) : topList.length === 0 ? (
            <div className="text-center py-16 dark:text-white/40 text-gray-400 italic text-sm">No investors yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="dark:bg-white/2 bg-gray-50 dark:text-white/40 text-gray-500 uppercase text-xs font-semibold tracking-wider border-b dark:border-white/6 border-gray-200">
                    <th className="p-4 text-center w-16">Rank</th>
                    <th className="p-4 text-left">Name</th>
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
                      <tr key={inv.rank} className="border-b dark:border-white/5 border-gray-100 dark:hover:bg-white/2 hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold dark:bg-white/5 bg-gray-100 border dark:border-white/10 border-gray-200 dark:text-white/50 text-gray-500">
                            {rankLabel}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold dark:text-white text-gray-900">{inv.name}</p>
                        </td>
                        <td className="p-4 text-center"><TierBadge tier={inv.tier} /></td>
                        <td className="p-4 text-right font-bold text-emerald-400">
                          ${Number(inv.total_invested).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-right font-semibold text-yellow-400">
                          ${Number(inv.total_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-right dark:text-white text-gray-900 font-semibold">
                          ${Number(inv.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            inv.active_plans > 0
                              ? "bg-[#c45a45]/15 dark:text-white text-gray-900 border border-[#c45a45]/30"
                              : "dark:bg-white/5 bg-gray-100 dark:text-white/40 text-gray-400 border dark:border-white/10 border-gray-200"
                          }`}>
                            {inv.active_plans}
                          </span>
                        </td>
                        <td className="p-4 text-center dark:text-white/50 text-gray-500 font-semibold">
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