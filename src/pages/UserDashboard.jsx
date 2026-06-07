// src/pages/UserDashboard.jsx
import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  FaChartLine, FaBolt, FaArrowDown,
  FaCoins, FaArrowUp, FaRobot,
  FaExchangeAlt, FaShoppingCart, FaSignal,
  FaCheckCircle, FaClock, FaGlobe, FaTimes,
  FaUsers, FaLink, FaCopy, FaGift, FaNetworkWired,
} from "react-icons/fa";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

/* ─── Tier config ─── */
const TIER_STYLE = {
  silver:  { bg: "bg-slate-100 dark:bg-slate-400/15",   text: "text-slate-600 dark:text-slate-300",   border: "border-slate-300 dark:border-slate-400/30",   label: "🥈 Silver"  },
  gold:    { bg: "bg-yellow-50 dark:bg-yellow-500/20",  text: "text-yellow-600 dark:text-yellow-400", border: "border-yellow-300 dark:border-yellow-500/40", label: "🥇 Gold"    },
  diamond: { bg: "bg-violet-50 dark:bg-violet-500/15",  text: "text-violet-600 dark:text-violet-300", border: "border-violet-300 dark:border-violet-500/30", label: "💎 Diamond" },
  none:    { bg: "bg-gray-100 dark:bg-white/5",         text: "text-gray-500 dark:text-white/50",     border: "border-gray-200 dark:border-white/10",        label: "—"          },
};

const TIER_DESC = {
  none:    "Make your first investment to earn a tier",
  silver:  "1–2 investments · keep going for Gold!",
  gold:    "3–5 investments · almost at Diamond!",
  diamond: "6+ investments · elite Diamond status!",
};

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
  { name: "Stock Signals",  pct: 84, color: "#c45a45", icon: <FaShoppingCart />,  status: "Strong Buy"  },
  { name: "Copy Trading",   pct: 67, color: "#10b981", icon: <FaExchangeAlt />,   status: "Active"      },
  { name: "AI Bot Engine",  pct: 91, color: "#a78bfa", icon: <FaRobot />,         status: "Optimal"     },
];

/* ─── Market Overview Data ─── */
const marketAssets = [
  {
    symbol: "BTC",  name: "Bitcoin",
    price: 67842.50, change: +2.34, color: "#f59e0b",
    sparkline: [61000,63200,62100,65000,64500,66800,67200,67842],
    history: [
      { time: "Nov", price: 58000 },{ time: "Dec", price: 60200 },
      { time: "Jan", price: 62100 },{ time: "Feb", price: 61500 },
      { time: "Mar", price: 63000 },{ time: "Apr", price: 64200 },
      { time: "May", price: 65800 },{ time: "Jun", price: 65000 },
      { time: "Jul", price: 66100 },{ time: "Aug", price: 67200 },
      { time: "Now", price: 67842 },
    ],
    high: 68500, low: 57200, vol: "$38.2B", mktcap: "$1.33T",
  },
  {
    symbol: "ETH",  name: "Ethereum",
    price: 3541.20, change: +1.87, color: "#6366f1",
    sparkline: [3200,3310,3280,3400,3380,3450,3510,3541],
    history: [
      { time: "Nov", price: 2800 },{ time: "Dec", price: 2950 },
      { time: "Jan", price: 3100 },{ time: "Feb", price: 3050 },
      { time: "Mar", price: 3200 },{ time: "Apr", price: 3300 },
      { time: "May", price: 3420 },{ time: "Jun", price: 3380 },
      { time: "Jul", price: 3450 },{ time: "Aug", price: 3510 },
      { time: "Now", price: 3541 },
    ],
    high: 3600, low: 2720, vol: "$18.5B", mktcap: "$425B",
  },
  {
    symbol: "AAPL", name: "Apple Inc.",
    price: 189.45, change: -0.52, color: "#10b981",
    sparkline: [191,190,192,191,190,189,190,189],
    history: [
      { time: "Nov", price: 175 },{ time: "Dec", price: 180 },
      { time: "Jan", price: 185 },{ time: "Feb", price: 182 },
      { time: "Mar", price: 188 },{ time: "Apr", price: 192 },
      { time: "May", price: 191 },{ time: "Jun", price: 189 },
      { time: "Jul", price: 190 },{ time: "Aug", price: 188 },
      { time: "Now", price: 189 },
    ],
    high: 198, low: 164, vol: "$62.1B", mktcap: "$2.91T",
  },
  {
    symbol: "TSLA", name: "Tesla",
    price: 248.30, change: +3.21, color: "#c45a45",
    sparkline: [232,235,238,241,244,245,247,248],
    history: [
      { time: "Nov", price: 210 },{ time: "Dec", price: 218 },
      { time: "Jan", price: 225 },{ time: "Feb", price: 222 },
      { time: "Mar", price: 230 },{ time: "Apr", price: 238 },
      { time: "May", price: 244 },{ time: "Jun", price: 240 },
      { time: "Jul", price: 245 },{ time: "Aug", price: 246 },
      { time: "Now", price: 248 },
    ],
    high: 255, low: 196, vol: "$22.4B", mktcap: "$791B",
  },
  {
    symbol: "GOLD", name: "Gold (XAU/USD)",
    price: 2341.80, change: +0.45, color: "#d97706",
    sparkline: [2310,2318,2325,2320,2330,2335,2338,2341],
    history: [
      { time: "Nov", price: 2180 },{ time: "Dec", price: 2210 },
      { time: "Jan", price: 2240 },{ time: "Feb", price: 2230 },
      { time: "Mar", price: 2270 },{ time: "Apr", price: 2300 },
      { time: "May", price: 2320 },{ time: "Jun", price: 2310 },
      { time: "Jul", price: 2330 },{ time: "Aug", price: 2338 },
      { time: "Now", price: 2341 },
    ],
    high: 2360, low: 2140, vol: "$184B", mktcap: "—",
  },
  {
    symbol: "SPX",  name: "S&P 500",
    price: 5248.90, change: +0.78, color: "#8b5cf6",
    sparkline: [5180,5195,5200,5210,5220,5230,5240,5248],
    history: [
      { time: "Nov", price: 4900 },{ time: "Dec", price: 4960 },
      { time: "Jan", price: 5020 },{ time: "Feb", price: 5000 },
      { time: "Mar", price: 5080 },{ time: "Apr", price: 5140 },
      { time: "May", price: 5190 },{ time: "Jun", price: 5180 },
      { time: "Jul", price: 5210 },{ time: "Aug", price: 5240 },
      { time: "Now", price: 5248 },
    ],
    high: 5265, low: 4820, vol: "—", mktcap: "$46.8T",
  },
];

/* ─── Investment Plans ─── */
const INVESTMENT_PLANS = [
  { name: "Trial",     icon: "🌱", min: 500,    max: 5000,    duration: "3 Days",   minReturn: "15%",    maxReturn: "20%",    color: "#10b981" },
  { name: "Essential", icon: "🛡️", min: 5000,   max: 10000,   duration: "14 Days",  minReturn: "30%",    maxReturn: "35%",    color: "#3b82f6" },
  { name: "Premium",   icon: "✨", min: 10000,  max: 50000,   duration: "30 Days",  minReturn: "60%",    maxReturn: "65%",    color: "#f59e0b" },
  { name: "Ultimate",  icon: "🔥", min: 50000,  max: 250000,  duration: "60 Days",  minReturn: "290%",   maxReturn: "300%",   color: "#c45a45" },
  { name: "Royal",     icon: "👑", min: 250000, max: 500000,  duration: "90 Days",  minReturn: "550%",   maxReturn: "600%",   color: "#8b5cf6" },
  { name: "Diamond",   icon: "💎", min: 500000, max: 2000000, duration: "120 Days", minReturn: "1,450%", maxReturn: "1,500%", color: "#06b6d4" },
];

/* ─── Sparkline SVG helper ─── */
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

const StatCard = ({ label, value, sub, icon, accent = false, highlight }) => (
  <div className={`bg-white dark:bg-[#0f0e0e] border rounded-xl px-4 py-4 flex items-center gap-3 transition-all duration-200 ${
    accent
      ? "border-[#c45a45]/25 shadow-lg shadow-[#c45a45]/5"
      : "border-gray-200 dark:border-white/[0.07] hover:border-gray-300 dark:hover:border-white/12"
  }`}>
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
      accent
        ? "bg-[#c45a45]/15 border border-[#c45a45]/30 text-[#c45a45]"
        : "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 text-gray-400 dark:text-white/40"
    }`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-gray-400 dark:text-white/30 text-[10px] uppercase tracking-widest mb-0.5 truncate">{label}</p>
      <p className={`text-lg font-bold leading-none truncate ${highlight || "text-gray-900 dark:text-white"}`}>{value}</p>
      {sub && <p className="text-gray-400 dark:text-white/25 text-[10px] mt-0.5 truncate">{sub}</p>}
    </div>
  </div>
);

const SignalTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#141212] border border-gray-200 dark:border-white/10 rounded-xl p-2.5 text-xs shadow-xl">
        <p className="text-gray-400 dark:text-white/40 mb-1">{label}</p>
        <p className="text-[#c45a45] font-bold">{payload[0].value}% Signal</p>
      </div>
    );
  }
  return null;
};

/* ─── Asset Chart Tooltip ─── */
const AssetChartTooltip = ({ active, payload, label, color }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#141212] border border-gray-200 dark:border-white/10 rounded-xl p-2.5 text-xs shadow-xl">
        <p className="text-gray-400 dark:text-white/40 mb-1">{label}</p>
        <p className="font-bold" style={{ color }}>
          ${Number(payload[0].value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

/* ─── Asset Card (clickable) ─── */
const AssetCard = ({ asset, onClick }) => {
  const isPositive = asset.change >= 0;
  const { label: signalLabel, style: signalStyle } = getSignal(asset.change);
  return (
    <button
      onClick={() => onClick(asset)}
      className="bg-gray-50 dark:bg-white/3 border border-gray-200 dark:border-white/[0.07] rounded-xl p-3.5 flex flex-col gap-2.5 hover:border-[#c45a45]/40 dark:hover:border-[#c45a45]/30 hover:shadow-md hover:shadow-[#c45a45]/5 transition-all duration-200 cursor-pointer text-left w-full group"
      aria-label={`View ${asset.name} chart`}
    >
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

      {/* Tap hint */}
      <p className="text-[9px] text-gray-300 dark:text-white/15 group-hover:text-[#c45a45]/60 transition-colors text-center uppercase tracking-widest">
        Tap to expand
      </p>
    </button>
  );
};

/* ─── Asset Chart Modal ─── */
const AssetChartModal = ({ asset, onClose }) => {
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!asset) return null;

  const isPositive = asset.change >= 0;
  const { label: signalLabel, style: signalStyle } = getSignal(asset.change);

  const statsRow = [
    { label: "Current Price", value: `$${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
    { label: "24h High",      value: `$${asset.high.toLocaleString()}` },
    { label: "24h Low",       value: `$${asset.low.toLocaleString()}` },
    { label: "Volume",        value: asset.vol },
    { label: "Market Cap",    value: asset.mktcap },
  ];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white dark:bg-[#0f0e0e] border border-gray-200 dark:border-white/[0.07] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
              style={{ backgroundColor: `${asset.color}18`, color: asset.color }}
            >
              {asset.symbol.slice(0, 2)}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white leading-none">{asset.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-black text-gray-900 dark:text-white">
                  ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className={`text-xs font-bold flex items-center gap-0.5 ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                  {isPositive ? <FaArrowUp className="text-[10px]" /> : <FaArrowDown className="text-[10px]" />}
                  {Math.abs(asset.change).toFixed(2)}%
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${signalStyle}`}>
                  {signalLabel}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-white/30 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
            aria-label="Close chart"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-px border-b border-gray-100 dark:border-white/[0.07] bg-gray-100 dark:bg-white/4">
          {statsRow.map((s) => (
            <div key={s.label} className="bg-white dark:bg-[#0f0e0e] px-4 py-3">
              <p className="text-gray-400 dark:text-white/30 text-[9px] uppercase tracking-widest mb-0.5">{s.label}</p>
              <p className="text-gray-900 dark:text-white text-xs font-bold truncate">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="px-4 pt-4 pb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-gray-400 dark:text-white/30 uppercase tracking-widest">Price History (12 months)</p>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: asset.color }} />
              <span className="text-[10px] font-bold" style={{ color: asset.color }}>Live</span>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={asset.history} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad-${asset.symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={asset.color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={asset.color} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.08)" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "rgba(150,150,150,0.5)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fill: "rgba(150,150,150,0.5)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v.toLocaleString()}`}
                />
                <Tooltip content={<AssetChartTooltip color={asset.color} />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={asset.color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#grad-${asset.symbol})`}
                  dot={{ fill: asset.color, r: 3, strokeWidth: 0 }}
                  activeDot={{ fill: asset.color, r: 5, strokeWidth: 2, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[9px] text-gray-300 dark:text-white/15 text-center mt-2">
            Prices are indicative only · not financial advice
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─── Referral Card ─── */
const ReferralCard = ({ profile }) => {
  const [copied, setCopied]         = useState(false);
  const [refStats, setRefStats]     = useState({ referred: 0, active: 0, earnings: "0.00" });
  const [refLoading, setRefLoading] = useState(true);

  const referralLink = `https://admindashboard-ruddy-beta.vercel.app/dashboard/register?ref=${profile.ref_code || "USER123"}`;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("referrals/my-stats/");
        setRefStats({
          referred: res.data.total_referred  ?? 0,
          active:   res.data.active_contracts ?? 0,
          earnings: parseFloat(res.data.total_earnings || 0).toFixed(2),
        });
      } catch { /* fall back to zeros */ }
      finally { setRefLoading(false); }
    };
    fetchStats();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-white dark:bg-[#0f0e0e] border border-gray-200 dark:border-white/[0.07] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/[0.07]">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FaNetworkWired className="text-[#c45a45]" /> Affiliate Program
          </h2>
          <p className="text-[11px] text-gray-400 dark:text-white/30 mt-0.5">
            Invite investors and earn commission on their active contracts.
          </p>
        </div>
        <a
          href="/referrals"
          className="text-[10px] font-bold text-[#c45a45] hover:text-[#d06a55] transition-colors underline underline-offset-2 shrink-0"
        >
          View Full Page →
        </a>
      </div>

      <div className="p-5 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Referred",   value: refLoading ? "—" : refStats.referred,           icon: <FaUsers />,     color: "text-gray-900 dark:text-white"    },
            { label: "Active Contracts", value: refLoading ? "—" : refStats.active,             icon: <FaChartLine />, color: "text-emerald-400"                  },
            { label: "Commissions",      value: refLoading ? "—" : `$${refStats.earnings}`,     icon: <FaGift />,      color: "text-[#c45a45]"                    },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#c45a45]/10 border border-[#c45a45]/20 flex items-center justify-center text-[#c45a45] text-xs shrink-0">
                {s.icon}
              </div>
              <div className="min-w-0">
                <p className={`text-base font-bold leading-none truncate ${s.color}`}>{s.value}</p>
                <p className="text-gray-400 dark:text-white/25 text-[10px] mt-0.5 uppercase tracking-wide truncate">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Link row */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-[#171515] border border-gray-200 dark:border-white/8 rounded-xl px-3.5 py-2.5 min-w-0">
            <FaLink className="text-gray-400 dark:text-white/20 text-[10px] shrink-0" />
            <span className="text-[11px] font-mono text-gray-400 dark:text-white/40 truncate">{referralLink}</span>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 shrink-0 ${
              copied
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                : "bg-[#c45a45] hover:bg-[#d06a55] text-white shadow-md shadow-[#c45a45]/20"
            }`}
          >
            {copied
              ? <><FaCheckCircle className="text-[10px]" /> Copied!</>
              : <><FaCopy className="text-[10px]" /> Copy Link</>
            }
          </button>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-3 gap-3 pt-1 border-t border-gray-100 dark:border-white/5">
          {[
            { step: "01", title: "Share Link",      desc: "Send your link to new investors." },
            { step: "02", title: "They Register",   desc: "They sign up & are auto-tracked."  },
            { step: "03", title: "Earn Commission", desc: "Get paid when they invest."        },
          ].map((s, i) => (
            <div key={s.step} className={`space-y-0.5 pt-3 ${i > 0 ? "border-l border-gray-100 dark:border-white/5 pl-3" : ""}`}>
              <p className="text-[#c45a45] font-black text-xs">{s.step}.</p>
              <p className="text-gray-900 dark:text-white font-semibold text-[11px]">{s.title}</p>
              <p className="text-gray-400 dark:text-white/30 text-[10px] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const UserDashboard = () => {
  const [profile,       setProfile]       = useState({});
  const [investments,   setInvestments]   = useState([]);
  const [withdrawals,   setWithdrawals]   = useState([]);
  const [topList,       setTopList]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [topLoading,    setTopLoading]    = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null); // ← modal state

  useEffect(() => { load(); fetchTopInvestors(); }, []);

  const load = async () => {
    try {
      const res = await API.get("user-dashboard/");
      setProfile(res.data.profile);
      setInvestments(res.data.investments);
      setWithdrawals(res.data.withdrawals);
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

  const totalWithdrawals = withdrawals
    .filter((w) => w.status === "Approved")
    .reduce((sum, w) => sum + parseFloat(w.amount || 0), 0);

  const currentSignal = signalData[signalData.length - 1].strength;
  const signalLabel =
    currentSignal >= 80 ? "Strong Buy" :
    currentSignal >= 60 ? "Buy" :
    currentSignal >= 40 ? "Neutral" : "Weak";
  const signalColor =
    currentSignal >= 80 ? "text-emerald-400" :
    currentSignal >= 60 ? "text-yellow-400" :
    currentSignal >= 40 ? "text-gray-400" : "text-red-400";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#c45a45]/30 border-t-[#c45a45] animate-spin" />
            <p className="text-gray-400 dark:text-white/30 text-xs">Loading dashboard…</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="text-gray-900 dark:text-white space-y-5 pb-8">

        {/* ── ASSET CHART MODAL ── */}
        {selectedAsset && (
          <AssetChartModal
            asset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
          />
        )}

        {/* ── WELCOME BANNER ── */}
        <div className="relative bg-white dark:bg-[#0f0e0e] border border-gray-200 dark:border-white/[0.07] rounded-2xl px-6 py-5 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#c45a45]/8 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-gray-400 dark:text-white/30 text-xs uppercase tracking-widest mb-1">Welcome back</p>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {profile.name || profile.email || "Investor"} 👋
              </h1>
              <div className="flex items-center gap-2.5 mt-3 flex-wrap">
                <TierBadge tier={profile.tier || "none"} />
                <span className="text-xs text-gray-400 dark:text-white/25">{TIER_DESC[profile.tier] || TIER_DESC.none}</span>
              </div>
            </div>
            <div className="flex items-center gap-6 sm:border-l border-gray-200 dark:border-white/10 sm:pl-6 shrink-0">
              <div>
                <p className="text-gray-400 dark:text-white/30 text-[10px] uppercase tracking-widest mb-0.5">Wallet Balance</p>
                <p className="text-xl font-black text-emerald-400">${Number(profile.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-white/30 text-[10px] uppercase tracking-widest mb-0.5">Active Plans</p>
                <p className="text-xl font-black text-violet-400">{investments.filter(i => i.active && i.approved).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── METRIC CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Invested Capital"
            value={`$${Number(profile.total_invested || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={<FaChartLine />} accent={true} />
          <StatCard label="Total Net Profits"
            value={`$${Number(profile.total_profit || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={<FaCoins />} highlight="text-yellow-400" />
          <StatCard label="Withdrawn Funds"
            value={`$${Number(totalWithdrawals).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={<FaArrowDown />} highlight="text-[#c45a45]" />
          <StatCard label="Bonus Balance"
            value={`$${Number(profile.bonus || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={<FaBolt />} highlight="text-violet-400" sub="Referral & promo rewards" />
        </div>

        {/* ── TRADING ANALYSIS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Signal Strength Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0f0e0e] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaSignal className="text-[#c45a45]" /> Trading Signal Analysis
                </h2>
                <p className="text-[11px] text-gray-400 dark:text-white/30 mt-0.5">Live market signal strength over 24h</p>
              </div>
              <div className="text-right">
                <p className={`text-xl font-black ${signalColor}`}>{currentSignal}%</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  currentSignal >= 80
                    ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                    : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                }`}>
                  {signalLabel}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${currentSignal}%`, background: `linear-gradient(90deg, #c45a45, #e07060)` }} />
              </div>
              <span className="text-xs text-gray-400 dark:text-white/30 shrink-0">Signal Power</span>
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
          <div className="bg-white dark:bg-[#0f0e0e] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">Module Signals</h2>
              <p className="text-[11px] text-gray-400 dark:text-white/30 mb-4">Live signal per trading engine</p>
            </div>
            <div className="space-y-4">
              {tradingModules.map((mod) => (
                <div key={mod.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-gray-500 dark:text-white/60 flex items-center gap-2">
                      <span className="text-[11px]" style={{ color: mod.color }}>{mod.icon}</span>
                      {mod.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                        style={{ backgroundColor: `${mod.color}18`, color: mod.color }}>
                        {mod.status}
                      </span>
                      <span className="text-gray-900 dark:text-white font-bold">{mod.pct}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${mod.pct}%`, backgroundColor: mod.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 dark:border-white/5 pt-3 mt-4 flex items-center justify-between text-[10px] text-gray-400 dark:text-white/25">
              <span>All systems operational</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </div>

        {/* ── MARKET OVERVIEW ── */}
        <div className="bg-white dark:bg-[#0f0e0e] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaGlobe className="text-[#c45a45]" /> Market Overview
              </h2>
              <p className="text-[11px] text-gray-400 dark:text-white/30 mt-0.5">
                Live prices · tap any asset to view full chart
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Markets Open
            </span>
          </div>

          {/* ── FIX: use minmax(0,1fr) to prevent overflow on desktop ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 *:min-w-0">
            {marketAssets.map((asset) => (
              <AssetCard
                key={asset.symbol}
                asset={asset}
                onClick={setSelectedAsset}
              />
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-white/4 text-[10px] text-gray-400 dark:text-white/25">
            <span>Data updates every 30 seconds</span>
            <span>Prices indicative only · not financial advice</span>
          </div>
        </div>

        {/* ── INVESTMENT PLANS ── */}
        <div className="bg-white dark:bg-[#0f0e0e] border border-gray-200 dark:border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/[0.07]">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">📊 Investment Tiers</h2>
              <p className="text-[11px] text-gray-400 dark:text-white/30 mt-0.5">Available plans matching your tier level</p>
            </div>
            <TierBadge tier={profile.tier || "none"} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/1 text-gray-400 dark:text-white/30 uppercase text-[10px] font-bold tracking-wider border-b border-gray-200 dark:border-white/[0.07]">
                  <th className="p-4">Plan</th>
                  <th className="p-4 text-center">Duration</th>
                  <th className="p-4 text-right">Min. Investment</th>
                  <th className="p-4 text-right">Max. Investment</th>
                  <th className="p-4 text-center">Returns</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {INVESTMENT_PLANS.map((plan) => {
                  const isActive = investments.some(
                    (inv) => inv.active && inv.approved && (inv.plan || inv.category || "").includes(plan.name)
                  );
                  return (
                    <tr key={plan.name} className="border-b border-gray-100 dark:border-white/4 hover:bg-gray-50/50 dark:hover:bg-white/1 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 flex items-center justify-center text-base">
                            {plan.icon}
                          </span>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{plan.name} Plan</p>
                            <p className="text-[10px] text-gray-400 dark:text-white/25 mt-0.5">Investment Tier</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-0.5 rounded-md font-semibold text-[11px]"
                          style={{ backgroundColor: `${plan.color}15`, color: plan.color }}>
                          {plan.duration}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-gray-900 dark:text-white">${plan.min.toLocaleString()}</td>
                      <td className="p-4 text-right font-bold text-gray-900 dark:text-white">${plan.max.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-[11px]">
                          <span className="text-emerald-400 font-bold">{plan.minReturn}</span>
                          <span className="text-gray-300 dark:text-white/20">–</span>
                          <span className="text-[#c45a45] font-bold">{plan.maxReturn}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                            <FaCheckCircle className="text-[9px]" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/30 border border-gray-200 dark:border-white/5">
                            <FaClock className="text-[9px]" /> Available
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── REFERRAL CARD ── */}
        <ReferralCard profile={profile} />

        {/* ── TOP INVESTORS LEADERBOARD ── */}
        <div className="bg-white dark:bg-[#0f0e0e] border border-gray-200 dark:border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/[0.07]">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">🏆 Global Leaderboard</h2>
              <p className="text-[11px] text-gray-400 dark:text-white/30 mt-0.5">Top performing capital accounts this cycle</p>
            </div>
            <span className="text-[10px] font-bold bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/40 px-2.5 py-0.5 rounded-md">
              Rankings Live
            </span>
          </div>
          {topLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400 dark:text-white/30 text-xs">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#c45a45] mr-2.5" />
              Syncing standings…
            </div>
          ) : topList.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-white/30 italic text-xs">No entries found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-white/1 text-gray-400 dark:text-white/30 uppercase text-[10px] font-bold tracking-wider border-b border-gray-200 dark:border-white/[0.07]">
                    <th className="p-4 text-center w-14">Rank</th>
                    <th className="p-4">Investor Name</th>
                    <th className="p-4 text-center">Tier</th>
                    <th className="p-4 text-right">Total Invested</th>
                    <th className="p-4 text-center">Active Plans</th>
                  </tr>
                </thead>
                <tbody>
                  {topList.map((inv) => {
                    const rankLabel =
                      inv.rank === 1 ? "🥇" :
                      inv.rank === 2 ? "🥈" :
                      inv.rank === 3 ? "🥉" : `#${inv.rank}`;
                    return (
                      <tr key={inv.rank} className="border-b border-gray-100 dark:border-white/4 hover:bg-gray-50/50 dark:hover:bg-white/1 transition-colors">
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full font-bold bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-500 dark:text-white/40">
                            {rankLabel}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-gray-900 dark:text-white">{inv.name}</p>
                        </td>
                        <td className="p-4 text-center"><TierBadge tier={inv.tier} /></td>
                        <td className="p-4 text-right font-bold text-emerald-400">
                          ${Number(inv.total_invested).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            inv.active_plans > 0
                              ? "bg-[#c45a45]/15 text-gray-900 dark:text-white border border-[#c45a45]/25"
                              : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/30 border border-gray-200 dark:border-white/5"
                          }`}>
                            {inv.active_plans} Plans
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

export default UserDashboard;