// src/pages/UserDashboard.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  FaChartLine, FaWallet, FaBolt, FaArrowDown,
  FaUserCircle, FaTrophy, FaMedal, FaGem,
  FaCheckCircle, FaClock, FaLock, FaFire,
  FaArrowUp, FaCoins, FaRobot, FaExchangeAlt, FaShoppingCart,
} from "react-icons/fa";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PieChart, Pie, Cell,
} from "recharts";

/* ─── Tier config ─── */
const TIER_STYLE = {
  silver:  { bg: "dark:bg-white/5 light:bg-slate-100",        text: "dark:text-white/70 light:text-slate-600",  border: "dark:border-white/10 light:border-slate-200", label: "Silver",  icon: <FaMedal className="dark:text-white/50 light:text-slate-400" /> },
  gold:    { bg: "dark:bg-[#c45a45]/10 light:bg-orange-50",   text: "dark:text-[#e07060] light:text-orange-600", border: "dark:border-[#c45a45]/25 light:border-orange-200", label: "Gold",  icon: <FaFire className="text-[#c45a45]" /> },
  diamond: { bg: "dark:bg-[#c45a45]/15 light:bg-red-50",      text: "dark:text-[#e8a090] light:text-red-600",   border: "dark:border-[#c45a45]/35 light:border-red-200", label: "Diamond", icon: <FaGem className="text-[#d06a55]" /> },
  none:    { bg: "dark:bg-white/[0.03] light:bg-gray-50",     text: "dark:text-white/25 light:text-gray-400",   border: "dark:border-white/5 light:border-gray-200", label: "No Tier", icon: null },
};

const TIER_DESC = {
  none:    "Make your first investment to earn a tier",
  silver:  "1–2 investments · keep going for Gold!",
  gold:    "3–5 investments · almost at Diamond!",
  diamond: "6+ investments · elite Diamond status!",
};

/* Mask email */
const maskEmail = (email = "") => {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "••••••@•••••";
  return `${user.slice(0, 2)}${"•".repeat(Math.min(5, user.length - 2))}@${domain}`;
};

/* Mock portfolio performance data */
const mockPortfolio = [
  { day: "D1",  value: 10000 },
  { day: "D15", value: 11200 },
  { day: "D30", value: 13800 },
  { day: "D45", value: 16500 },
  { day: "D60", value: 21000 },
  { day: "D75", value: 28400 },
  { day: "D90", value: 38100 },
  { day: "D105",value: 51000 },
  { day: "D120",value: 70000 },
];

/* Mock trading module data */
const mockModuleActivity = [
  { name: "Stocks",      pct: 68, color: "#c45a45" },
  { name: "Copy Trade",  pct: 45, color: "#10b981" },
  { name: "AI Bots",     pct: 82, color: "#a78bfa" },
];

const TierBadge = ({ tier }) => {
  const s = TIER_STYLE[tier] || TIER_STYLE.none;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      {s.icon}{s.label}
    </span>
  );
};

const StatCard = ({ label, value, sub, icon, accent = false, highlight }) => (
  <div className={`dark:bg-[#0f0e0e] light:bg-white border rounded-xl px-4 py-4 flex items-center gap-3 transition-all duration-200 ${
    accent
      ? "border-[#c45a45]/25 dark:shadow-lg dark:shadow-[#c45a45]/5"
      : "dark:border-white/[0.07] light:border-gray-200 dark:hover:border-white/12 light:hover:border-gray-300"
  }`}>
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
      accent
        ? "bg-[#c45a45]/15 border border-[#c45a45]/30 text-[#c45a45]"
        : "dark:bg-white/5 dark:border dark:border-white/8 dark:text-white/40 light:bg-gray-100 light:border light:border-gray-200 light:text-gray-500"
    }`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="dark:text-white/30 light:text-gray-400 text-[10px] uppercase tracking-widest mb-0.5 truncate">{label}</p>
      <p className={`text-lg font-bold leading-none truncate ${highlight || "dark:text-white light:text-gray-900"}`}>
        {value}
      </p>
      {sub && <p className="dark:text-white/25 light:text-gray-400 text-[10px] mt-0.5 truncate">{sub}</p>}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="dark:bg-[#141212] light:bg-white border dark:border-white/10 light:border-gray-200 rounded-xl p-2.5 text-xs shadow-xl">
        <p className="dark:text-white/40 light:text-gray-400 mb-1">{label}</p>
        <p className="text-emerald-400 font-bold">${Number(payload[0].value).toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const UserDashboard = () => {
  const [profile,     setProfile]     = useState({});
  const [investments, setInvestments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [topList,     setTopList]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [topLoading,  setTopLoading]  = useState(true);

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

  const now = new Date();
  const isLocked = investments.some((inv) => {
    if (!inv.active || !inv.approved) return false;
    return (now - new Date(inv.created_at)) / (1000 * 60 * 60 * 24) < 120;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#c45a45]/30 border-t-[#c45a45] animate-spin" />
            <p className="dark:text-white/30 light:text-gray-400 text-xs">Loading dashboard…</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const tierStyle = TIER_STYLE[profile.tier || "none"];

  return (
    <DashboardLayout>
      <div className="dark:text-white light:text-gray-900 space-y-5 pb-8">

        {/* ── WELCOME BANNER ── */}
        <div className="relative dark:bg-[#0f0e0e] light:bg-white border dark:border-white/[0.07] light:border-gray-200 rounded-2xl px-6 py-5 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#c45a45]/8 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="dark:text-white/30 light:text-gray-400 text-xs uppercase tracking-widest mb-1">Welcome back</p>
              <h1 className="text-2xl font-bold dark:text-white light:text-gray-900 leading-tight">
                {profile.name || profile.email || "Investor"} 👋
              </h1>
              <div className="flex items-center gap-2.5 mt-3 flex-wrap">
                <TierBadge tier={profile.tier || "none"} />
                <span className="text-xs dark:text-white/25 light:text-gray-400">{TIER_DESC[profile.tier] || TIER_DESC.none}</span>
                {isLocked && (
                  <span className="flex items-center gap-1.5 text-xs bg-amber-400/8 text-amber-400/80 border border-amber-400/20 px-2.5 py-1 rounded-lg font-medium">
                    <FaLock className="text-[9px]" /> 120-day lock active
                  </span>
                )}
              </div>
            </div>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${tierStyle.border} ${tierStyle.bg} shrink-0`}>
              <div className={`text-lg ${tierStyle.text}`}>{tierStyle.icon}</div>
              <div>
                <p className="dark:text-white/25 light:text-gray-400 text-[10px] uppercase tracking-widest">Current Tier</p>
                <p className={`text-sm font-bold ${tierStyle.text}`}>{tierStyle.label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Wallet Balance"
            value={`$${parseFloat(profile.wallet_balance || 0).toFixed(2)}`}
            sub={isLocked ? "Locked · 120-day period" : "Available to withdraw"}
            icon={<FaWallet />} accent highlight="text-emerald-400" />
          <StatCard label="Active Profits"
            value={`$${parseFloat(profile.active_profits || 0).toFixed(2)}`}
            sub="+25% accumulating daily" icon={<FaBolt />} highlight="text-[#e07060]" />
          <StatCard label="Total Balance"
            value={`$${parseFloat(profile.live_balance || 0).toFixed(2)}`}
            sub="Wallet + active profits" icon={<FaChartLine />} />
          <StatCard label="Total Withdrawn"
            value={`$${totalWithdrawals.toFixed(2)}`}
            sub="Approved withdrawals" icon={<FaArrowDown />}
            highlight="dark:text-white/60 light:text-gray-500" />
        </div>

        {/* ── TRADING ANALYSIS ── */}
        <div className="dark:bg-[#0f0e0e] light:bg-white border dark:border-white/[0.07] light:border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b dark:border-white/[0.07] light:border-gray-200">
            <h2 className="text-sm font-bold dark:text-white light:text-gray-900">Trading Analysis</h2>
            <p className="dark:text-white/30 light:text-gray-400 text-[11px] mt-0.5">
              Projected 120-day portfolio growth · based on 25% daily ROI
            </p>
          </div>
          <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Growth Chart */}
            <div className="lg:col-span-2">
              <p className="text-[10px] uppercase tracking-widest dark:text-white/25 light:text-gray-400 mb-3">Portfolio Growth Projection</p>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={mockPortfolio} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#c45a45" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#c45a45" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#c45a45" fill="url(#growthGrad)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Module Activity */}
            <div>
              <p className="text-[10px] uppercase tracking-widest dark:text-white/25 light:text-gray-400 mb-3">Module Activity</p>
              <div className="space-y-3.5">
                {mockModuleActivity.map((m) => (
                  <div key={m.name}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="dark:text-white/50 light:text-gray-500">{m.name}</span>
                      <span className="dark:text-white light:text-gray-900 font-bold">{m.pct}%</span>
                    </div>
                    <div className="w-full dark:bg-white/5 light:bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${m.pct}%`, backgroundColor: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2">
                {[
                  { icon: <FaShoppingCart />, label: "Stocks",       color: "text-[#c45a45]", bg: "bg-[#c45a45]/10 border-[#c45a45]/20" },
                  { icon: <FaExchangeAlt />,  label: "Copy Trading", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
                  { icon: <FaRobot />,        label: "AI Bots",      color: "text-violet-400",  bg: "bg-violet-400/10 border-violet-400/20" },
                ].map((m) => (
                  <div key={m.label} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border ${m.bg}`}>
                    <span className={`text-xs ${m.color}`}>{m.icon}</span>
                    <span className="dark:text-white/60 light:text-gray-600 text-xs">{m.label}</span>
                    <span className="ml-auto text-[10px] dark:text-white/30 light:text-gray-400">Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── INVESTMENT PLANS ── */}
        <div className="dark:bg-[#0f0e0e] light:bg-white border dark:border-white/[0.07] light:border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b dark:border-white/[0.07] light:border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold dark:text-white light:text-gray-900">Investment Plans</h2>
              <p className="dark:text-white/30 light:text-gray-400 text-[11px] mt-0.5">
                <span className="text-emerald-400 font-medium">25% daily ROI</span> for{" "}
                <span className="dark:text-white/50 light:text-gray-500">120 days</span> · $500k–$2M range ·{" "}
                <span className="text-amber-400/70">Withdrawals locked for 120 days</span>
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#c45a45]/12 border border-[#c45a45]/20 flex items-center justify-center text-[#c45a45] text-xs shrink-0">
              <FaCoins />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x dark:divide-white/5 light:divide-gray-100">
            {[
              { name: "Silver Plan", icon: <FaMedal />, iconColor: "dark:text-white/60 light:text-gray-400", border: "dark:border-white/10 light:border-gray-200", bg: "dark:bg-white/[0.03] light:bg-gray-50", tierReq: "1–2 investments" },
              { name: "Gold Plan",   icon: <FaFire />,  iconColor: "text-[#c45a45]", border: "dark:border-[#c45a45]/25 light:border-orange-200", bg: "dark:bg-[#c45a45]/8 light:bg-orange-50",  tierReq: "3–5 investments" },
              { name: "Diamond Plan",icon: <FaGem />,   iconColor: "text-[#d06a55]", border: "dark:border-[#c45a45]/35 light:border-red-200",    bg: "dark:bg-[#c45a45]/12 light:bg-red-50",  tierReq: "6+ investments" },
            ].map((plan) => (
              <div key={plan.name} className={`p-5 ${plan.bg}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-base ${plan.iconColor}`}>{plan.icon}</span>
                  <span className="text-sm font-bold dark:text-white light:text-gray-900">{plan.name}</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Daily ROI",  value: "25%",        cls: "text-emerald-400 font-bold" },
                    { label: "Duration",   value: "120 days",   cls: "dark:text-white/70 light:text-gray-700 font-semibold" },
                    { label: "Min",        value: "$500,000",   cls: "dark:text-white/60 light:text-gray-500" },
                    { label: "Max",        value: "$2,000,000", cls: "dark:text-white/60 light:text-gray-500" },
                    { label: "Total ROI",  value: "3,000%",     cls: "text-[#e07060] font-bold" },
                    { label: "Tier Req",   value: plan.tierReq, cls: "dark:text-white/40 light:text-gray-400 text-xs" },
                  ].map(({ label, value, cls }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="dark:text-white/30 light:text-gray-400 text-xs">{label}</span>
                      <span className={`text-xs ${cls}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TIER PROGRESS ── */}
        <div className="dark:bg-[#0f0e0e] light:bg-white border dark:border-white/[0.07] light:border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold dark:text-white light:text-gray-900">Tier Progress</h2>
            <span className="dark:text-white/30 light:text-gray-400 text-xs">
              <span className="dark:text-white light:text-gray-900 font-medium">{investments.length}</span> investment{investments.length !== 1 ? "s" : ""} total
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { tier: "silver",  icon: <FaMedal />,  label: "Silver",  range: "1–2 investments",  min: 1 },
              { tier: "gold",    icon: <FaFire />,   label: "Gold",    range: "3–5 investments",  min: 3 },
              { tier: "diamond", icon: <FaGem />,    label: "Diamond", range: "6+ investments",   min: 6 },
            ].map(({ tier, icon, label, range, min }) => {
              const count    = investments.length;
              const current  = profile.tier || "none";
              const isActive = current === tier;
              const isAchieved = count >= min;
              const s = TIER_STYLE[tier];
              return (
                <div key={tier} className={`rounded-xl p-4 border transition-all ${
                  isActive ? `${s.bg} ${s.border}` : "dark:bg-white/2 light:bg-gray-50 dark:border-white/5 light:border-gray-200"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isActive ? s.text : isAchieved ? "dark:text-white/50 light:text-gray-400" : "dark:text-white/20 light:text-gray-300"}`}>{icon}</span>
                      <span className={`text-xs font-bold ${isActive ? s.text : isAchieved ? "dark:text-white/60 light:text-gray-500" : "dark:text-white/25 light:text-gray-300"}`}>{label}</span>
                    </div>
                    {isActive && <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${s.bg} ${s.text} ${s.border}`}>Current</span>}
                    {isAchieved && !isActive && <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 font-semibold">✓</span>}
                  </div>
                  <p className="dark:text-white/25 light:text-gray-400 text-[11px]">{range}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MY INVESTMENTS ── */}
        <div className="dark:bg-[#0f0e0e] light:bg-white border dark:border-white/[0.07] light:border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b dark:border-white/[0.07] light:border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-bold dark:text-white light:text-gray-900">My Investments</h2>
            <span className="text-[10px] dark:bg-white/5 light:bg-gray-100 border dark:border-white/8 light:border-gray-200 px-2.5 py-1 rounded-lg dark:text-white/35 light:text-gray-500">
              {investments.length} plan{investments.length !== 1 ? "s" : ""}
            </span>
          </div>

          {investments.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#c45a45]/10 border border-[#c45a45]/20 flex items-center justify-center text-[#c45a45] text-lg mx-auto mb-3">
                <FaChartLine />
              </div>
              <p className="dark:text-white/30 light:text-gray-400 text-sm">No investments yet.</p>
            </div>
          ) : (
            <div className="divide-y dark:divide-white/5 light:divide-gray-100">
              {investments.map((inv) => {
                const daysSince = Math.floor((now - new Date(inv.created_at)) / (1000 * 60 * 60 * 24));
                const daysLeft  = Math.max(0, 120 - daysSince);
                const progress  = Math.min(100, (daysSince / 120) * 100);
                const planIcon  = inv.category === "Silver Plan" ? <FaMedal className="dark:text-white/50 light:text-gray-400" />
                                : inv.category === "Gold Plan"   ? <FaFire className="text-[#c45a45]" />
                                : <FaGem className="text-[#d06a55]" />;
                return (
                  <div key={inv.id} className="px-5 py-4 flex flex-col md:flex-row md:items-center gap-4 dark:hover:bg-white/2 light:hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl dark:bg-white/5 light:bg-gray-100 border dark:border-white/8 light:border-gray-200 flex items-center justify-center text-sm shrink-0">
                        {planIcon}
                      </div>
                      <div className="min-w-0">
                        <p className="dark:text-white light:text-gray-900 text-sm font-semibold truncate">{inv.category}</p>
                        <p className="dark:text-white/25 light:text-gray-400 text-[11px] mt-0.5 truncate">
                          via {inv.payment_method} · {new Date(inv.created_at).toLocaleDateString()}
                        </p>
                        {inv.active && inv.approved && (
                          <div className="mt-2 w-36">
                            <div className="flex justify-between text-[10px] dark:text-white/25 light:text-gray-400 mb-1">
                              <span>Day {Math.min(daysSince, 120)}/120</span>
                              <span className="text-amber-400/60">{daysLeft}d left</span>
                            </div>
                            <div className="w-full dark:bg-white/5 light:bg-gray-100 rounded-full h-1">
                              <div className="bg-[#c45a45] h-1 rounded-full transition-all" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-5 text-sm flex-wrap">
                      {[
                        { label: "Amount",   value: `$${Number(inv.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, cls: "dark:text-white light:text-gray-900 font-semibold" },
                        { label: "Daily ROI",value: `${inv.daily_roi}%`, cls: "text-[#e07060] font-semibold" },
                        { label: "Duration", value: "120 days",          cls: "dark:text-white/40 light:text-gray-400" },
                        { label: "Profit",   value: `$${parseFloat(inv.current_profit || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, cls: "text-emerald-400 font-semibold" },
                      ].map(({ label, value, cls }) => (
                        <div key={label}>
                          <p className="dark:text-white/25 light:text-gray-400 text-[10px] uppercase tracking-wide mb-0.5">{label}</p>
                          <p className={`text-sm ${cls}`}>{value}</p>
                        </div>
                      ))}
                      <div>
                        <p className="dark:text-white/25 light:text-gray-400 text-[10px] uppercase tracking-wide mb-0.5">Status</p>
                        {inv.active ? (
                          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                          </span>
                        ) : inv.approved ? (
                          <span className="text-xs px-2 py-0.5 rounded-lg dark:bg-white/5 light:bg-gray-100 dark:text-white/40 light:text-gray-500 border dark:border-white/8 light:border-gray-200 font-medium">Matured</span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 font-medium">
                            <FaClock className="text-[9px]" /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── TOP INVESTORS (emails masked) ── */}
        <div className="dark:bg-[#0f0e0e] light:bg-white border dark:border-white/[0.07] light:border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b dark:border-white/[0.07] light:border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold dark:text-white light:text-gray-900 flex items-center gap-2">
                <FaTrophy className="text-[#c45a45] text-xs" /> Top Investors
              </h2>
              <p className="dark:text-white/25 light:text-gray-400 text-[10px] mt-0.5">
                Silver (1–2) · Gold (3–5) · Diamond (6+)
              </p>
            </div>
            <span className="text-[10px] dark:bg-white/5 light:bg-gray-100 border dark:border-white/8 light:border-gray-200 px-2.5 py-1 rounded-lg dark:text-white/35 light:text-gray-400">
              Top {topList.length}
            </span>
          </div>

          {topLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 rounded-full border-2 border-[#c45a45]/30 border-t-[#c45a45] animate-spin mr-3" />
              <span className="dark:text-white/30 light:text-gray-400 text-sm">Loading leaderboard…</span>
            </div>
          ) : topList.length === 0 ? (
            <div className="text-center py-16 dark:text-white/25 light:text-gray-400 italic text-sm">No investors yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-white/5 light:border-gray-100 dark:text-white/25 light:text-gray-400 uppercase text-[10px] font-semibold tracking-widest">
                    <th className="px-5 py-3 text-center w-14">Rank</th>
                    <th className="px-5 py-3 text-left">Investor</th>
                    <th className="px-5 py-3 text-center">Tier</th>
                    <th className="px-5 py-3 text-right">Invested</th>
                    <th className="px-5 py-3 text-right">Profit</th>
                    <th className="px-5 py-3 text-center">Plans</th>
                    <th className="px-5 py-3 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {topList.map((inv) => {
                    const isMe = inv.email === profile.email;
                    const rankEl =
                      inv.rank === 1 ? <FaTrophy className="text-[#c45a45]" />  :
                      inv.rank === 2 ? <FaMedal  className="dark:text-white/50 light:text-gray-400" />   :
                      inv.rank === 3 ? <FaMedal  className="text-[#c45a45]/60" /> :
                      <span className="dark:text-white/30 light:text-gray-400 font-mono text-xs">#{inv.rank}</span>;

                    return (
                      <tr key={inv.rank} className={`border-b dark:border-white/4 light:border-gray-100 transition-colors ${
                        isMe ? "bg-[#c45a45]/5 dark:hover:bg-[#c45a45]/8 light:hover:bg-orange-50/50" : "dark:hover:bg-white/2 light:hover:bg-gray-50"
                      }`}>
                        <td className="px-5 py-3.5 text-center">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg dark:bg-white/3 light:bg-gray-100 border dark:border-white/6 light:border-gray-200">
                            {rankEl}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#c45a45]/15 border border-[#c45a45]/25 flex items-center justify-center text-[#c45a45] text-xs shrink-0">
                              <FaUserCircle />
                            </div>
                            <div>
                              <p className="dark:text-white light:text-gray-900 text-xs font-semibold flex items-center gap-1.5">
                                {inv.name}
                                {isMe && <span className="text-[9px] bg-[#c45a45]/15 text-[#e07060] border border-[#c45a45]/25 px-1.5 py-0.5 rounded-md font-bold">You</span>}
                              </p>
                              <p className="dark:text-white/20 light:text-gray-400 text-[10px] font-mono">{maskEmail(inv.email)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <TierBadge tier={inv.tier} />
                        </td>
                        <td className="px-5 py-3.5 text-right text-xs font-bold text-emerald-400">
                          ${Number(inv.total_invested).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3.5 text-right text-xs font-semibold text-[#e07060]">
                          ${Number(inv.total_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            inv.active_plans > 0
                              ? "bg-[#c45a45]/12 text-[#e07060] border border-[#c45a45]/25"
                              : "dark:bg-white/3 light:bg-gray-100 dark:text-white/25 light:text-gray-400 border dark:border-white/6 light:border-gray-200"
                          }`}>
                            {inv.active_plans}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center dark:text-white/40 light:text-gray-500 text-xs font-semibold">
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

        {/* ── RECENT WITHDRAWALS ── */}
        <div className="dark:bg-[#0f0e0e] light:bg-white border dark:border-white/[0.07] light:border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b dark:border-white/[0.07] light:border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-bold dark:text-white light:text-gray-900">Recent Withdrawals</h2>
            <span className="text-[10px] dark:bg-white/5 light:bg-gray-100 border dark:border-white/8 light:border-gray-200 px-2.5 py-1 rounded-lg dark:text-white/35 light:text-gray-400">
              {withdrawals.length} request{withdrawals.length !== 1 ? "s" : ""}
            </span>
          </div>

          {withdrawals.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-2xl dark:bg-white/3 light:bg-gray-100 border dark:border-white/6 light:border-gray-200 flex items-center justify-center dark:text-white/20 light:text-gray-300 text-lg mx-auto mb-3">
                <FaArrowUp />
              </div>
              <p className="dark:text-white/25 light:text-gray-400 text-sm">No withdrawals yet.</p>
            </div>
          ) : (
            <div className="divide-y dark:divide-white/5 light:divide-gray-100">
              {withdrawals.map((w) => (
                <div key={w.id} className="px-5 py-4 flex items-center justify-between gap-4 dark:hover:bg-white/2 light:hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl dark:bg-white/3 light:bg-gray-100 border dark:border-white/6 light:border-gray-200 flex items-center justify-center dark:text-white/25 light:text-gray-400 shrink-0">
                      <FaArrowDown className="text-xs" />
                    </div>
                    <div className="min-w-0">
                      <p className="dark:text-white light:text-gray-900 text-sm font-bold">${parseFloat(w.amount).toFixed(2)}</p>
                      <p className="dark:text-white/25 light:text-gray-400 text-[10px] font-mono mt-0.5 truncate max-w-45">{w.wallet_address}</p>
                      <p className="dark:text-white/20 light:text-gray-300 text-[10px] mt-0.5">
                        {new Date(w.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold shrink-0 border ${
                    w.status === "Approved" ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                    : w.status === "Rejected" ? "bg-red-400/10 text-red-400 border-red-400/20"
                    : "bg-amber-400/10 text-amber-400 border-amber-400/20"
                  }`}>
                    {w.status === "Approved" && <FaCheckCircle className="inline mr-1 text-[9px]" />}
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