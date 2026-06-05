import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  FaRobot,
  FaBolt,
  FaChartLine,
  FaShieldAlt,
  FaPlay,
  FaStop,
  FaCog,
  FaClock,
  FaCheckCircle,
  FaLock,
  FaStar,
  FaTimes,
} from "react-icons/fa";

const bots = [
  {
    id: 1,
    name: "Apex Scalper",
    description: "High-frequency micro-trades on volatile pairs. Sub-second execution.",
    type: "Scalping",
    market: "Forex",
    roi: "+94.2%",
    monthly: "+8.4%",
    drawdown: "3.2%",
    trades: "1,840",
    risk: "High",
    active: false,
    uptime: "99.7%",
    badge: "Hot",
    badgeColor: "#c45a45",
    color: "#c45a45",
    status: "idle",
    locked: false,
    tier: "Starter",
  },
  {
    id: 2,
    name: "GridMaster Pro",
    description: "Grid strategy across major indices. Profits from range-bound markets.",
    type: "Grid",
    market: "Indices",
    roi: "+63.1%",
    monthly: "+5.8%",
    drawdown: "1.8%",
    trades: "940",
    risk: "Low",
    active: false,
    uptime: "99.9%",
    badge: "Stable",
    badgeColor: "#4db89b",
    color: "#4db89b",
    status: "idle",
    locked: false,
    tier: "Starter",
  },
  {
    id: 3,
    name: "CryptoSurge AI",
    description: "Momentum-based crypto bot using ML signals for BTC & ETH entries.",
    type: "Momentum",
    market: "Crypto",
    roi: "+218.6%",
    monthly: "+19.7%",
    drawdown: "12.4%",
    trades: "2,310",
    risk: "High",
    active: false,
    uptime: "98.2%",
    badge: "Top Pick",
    badgeColor: "#d4875a",
    color: "#d4875a",
    status: "idle",
    locked: false,
    tier: "Pro",
  },
  {
    id: 4,
    name: "Sentinel Swing",
    description: "Multi-day swing trades on high-cap stocks using technical confluence.",
    type: "Swing",
    market: "Stocks",
    roi: "+81.5%",
    monthly: "+7.2%",
    drawdown: "4.1%",
    trades: "380",
    risk: "Medium",
    active: false,
    uptime: "99.5%",
    badge: "Reliable",
    badgeColor: "#5a8fc4",
    color: "#5a8fc4",
    status: "idle",
    locked: false,
    tier: "Pro",
  },
  {
    id: 5,
    name: "Nexus Arbitrage",
    description: "Cross-exchange arbitrage capturing micro-spreads 24/7 automatically.",
    type: "Arbitrage",
    market: "Multi",
    roi: "+142.3%",
    monthly: "+11.9%",
    drawdown: "0.9%",
    trades: "5,620",
    risk: "Low",
    active: false,
    uptime: "99.99%",
    badge: "Premium",
    badgeColor: "#9b6ab5",
    color: "#9b6ab5",
    status: "idle",
    locked: true,
    tier: "Institutional",
  },
  {
    id: 6,
    name: "QuantEdge DCA",
    description: "Dollar-cost averaging bot for long-term portfolio accumulation.",
    type: "DCA",
    market: "Stocks",
    roi: "+57.8%",
    monthly: "+4.6%",
    drawdown: "2.3%",
    trades: "260",
    risk: "Low",
    active: false,
    uptime: "100%",
    badge: "Steady",
    badgeColor: "#4db89b",
    color: "#4db89b",
    status: "idle",
    locked: false,
    tier: "Starter",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/mo",
    description: "Run entry-level algorithmic instances under basic configurations.",
    features: ["Deploy up to 2 concurrent Starter bots", "Maximum runtime cap of 40 hours/wk", "Standard trading signals execution", "Weekly performance email log"],
    popular: false,
  },
  {
    name: "Pro",
    price: "$149",
    period: "/mo",
    description: "Optimized for systematic algorithmic traders running continuous strategies.",
    features: ["Deploy up to 5 Pro & Starter level bots", "True 24/7 perpetual uptime hosting", "Advanced ML trend-matching modules", "Custom balance drawdown safeguard controls"],
    popular: true,
  },
  {
    name: "Institutional",
    price: "$499",
    period: "/mo",
    description: "Full cluster execution capability with sub-millisecond liquidity routing.",
    features: ["Run unlimited active bot nodes seamlessly", "Unlock exclusive high-yield Arbitrage matrix", "Raw webhooks integration pipeline", "Assigned risk manager portfolio reviews"],
    popular: false,
  },
];

const riskBg = {
  Low: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400",
  Medium: "bg-amber-400/10 border-amber-400/20 text-amber-400",
  High: "bg-red-400/10 border-red-400/20 text-red-400",
};

const statusDot = { running: "bg-emerald-400 shadow-emerald-400/60", idle: "bg-white/20" };

function BotCard({ bot, onToggle }) {
  return (
    <div
      className={`relative bg-[#0f0e0e] border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 ${
        bot.active ? "border-[#c45a45]/30 shadow-lg shadow-[#c45a45]/5" : "border-white/[0.07] hover:border-white/15"
      }`}
    >
      {bot.active && (
        <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
        </span>
      )}

      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${bot.color}18`, border: `1px solid ${bot.color}35` }}
        >
          <FaRobot style={{ color: bot.color }} className="text-base" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white text-sm font-semibold leading-none">{bot.name}</p>
            {bot.locked && (
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-[#c45a45]/15 text-[#c45a45] border border-[#c45a45]/30 font-medium">
                <FaLock className="text-[8px]" /> {bot.tier}
              </span>
            )}
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{ background: `${bot.badgeColor}15`, color: bot.badgeColor, border: `1px solid ${bot.badgeColor}30` }}
            >
              {bot.badge}
            </span>
          </div>
          <p className="text-white/30 text-[11px] mt-1 leading-snug line-clamp-2">{bot.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/40">{bot.type}</span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/40">{bot.market}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ml-auto ${riskBg[bot.risk]}`}>{bot.risk} Risk</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {[
          { label: "ROI", value: bot.roi, green: true },
          { label: "Monthly", value: bot.monthly, green: true },
          { label: "Drawdown", value: bot.drawdown, green: false },
          { label: "Trades", value: bot.trades, green: null },
        ].map((s) => (
          <div key={s.label} className="bg-white/3 border border-white/5 rounded-xl p-2 text-center">
            <p className={`text-xs font-bold leading-none ${s.green === true ? "text-emerald-400" : s.green === false ? "text-red-400/80" : "text-white/70"}`}>
              {s.value}
            </p>
            <p className="text-white/25 text-[9px] mt-1 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-white/30">
          <span className={`w-1.5 h-1.5 rounded-full shadow-sm ${statusDot[bot.status]}`} />
          <span>Uptime {bot.uptime}</span>
        </div>
        <div className="flex gap-2 ml-auto">
          {!bot.locked ? (
            <>
              <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/35 hover:text-white/60 hover:bg-white/10 transition-all flex items-center justify-center text-xs">
                <FaCog />
              </button>
              <button
                onClick={() => onToggle(bot)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  bot.active
                    ? "bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25"
                    : "bg-[#c45a45] hover:bg-[#d06a55] text-white shadow-md shadow-[#c45a45]/20"
                }`}
              >
                {bot.active ? <><FaStop className="text-[9px]" /> Stop</> : <><FaPlay className="text-[9px]" /> Start</>}
              </button>
            </>
          ) : (
            <button 
              onClick={() => onToggle(bot)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#c45a45]/10 border border-[#c45a45]/30 text-[#c45a45] hover:bg-[#c45a45]/20 transition-colors"
            >
              <FaLock className="text-[9px]" /> Unlock {bot.tier}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AITradingBots() {
  const [botList, setBotList] = useState(bots);
  const [activeTab, setActiveTab] = useState("All");
  const [showPlans, setShowPlans] = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState(false); // Simulate active membership license node

  const tabs = ["All", "Running", "Idle", "My Bots"];

  const handleBotAction = (bot) => {
    // If user has no premium license and bot is locked or user is trying to start an inactive bot
    if (!hasActivePlan && (bot.locked || !bot.active)) {
      setShowPlans(true);
      return;
    }
    
    setBotList((prev) =>
      prev.map((b) => (b.id === bot.id ? { ...b, active: !b.active, status: !b.active ? "running" : "idle", locked: false } : b))
    );
  };

  const activeCount = botList.filter((b) => b.active).length;
  const filtered = botList.filter((b) => {
    if (activeTab === "Running") return b.active;
    if (activeTab === "Idle") return !b.active && !b.locked;
    if (activeTab === "My Bots") return !b.locked;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="text-white p-5 md:p-7 max-w-7xl mx-auto relative">

        {/* Header */}
        <div className="mb-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center">
                <FaRobot className="text-[#c45a45] text-sm" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Trading Bots</h1>
            </div>
            <p className="text-white/35 text-sm ml-12">
              Deploy autonomous bots that trade 24/7 using machine learning signals.
            </p>
          </div>
          <button 
            onClick={() => setShowPlans(true)}
            className="md:ml-auto text-xs font-semibold px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 transition-all flex items-center gap-2 self-start md:self-center"
          >
            <FaStar className="text-amber-400 text-[10px]" /> Bot Licenses
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          {[
            { label: "Active Bots", value: `${activeCount} / ${bots.length}`, icon: <FaRobot /> },
            { label: "Est. Monthly PnL", value: "+$4,821.00", icon: <FaChartLine /> },
            { label: "Avg. Win Rate", value: "76.4%", icon: <FaBolt /> },
            { label: "Lowest Drawdown", value: "0.9%", icon: <FaShieldAlt /> },
          ].map((s) => (
            <div key={s.label} className="bg-[#0f0e0e] border border-white/[0.07] rounded-2xl px-4 py-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#c45a45]/12 border border-[#c45a45]/20 flex items-center justify-center text-[#c45a45] text-xs shrink-0">
                {s.icon}
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-none">{s.value}</p>
                <p className="text-white/30 text-[10px] mt-0.5 uppercase tracking-wide">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-white/[0.07] pb-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-medium transition-all border-b-2 -mb-px ${
                activeTab === tab ? "border-[#c45a45] text-white" : "border-transparent text-white/35 hover:text-white/60"
              }`}
            >
              {tab}
              {tab === "Running" && activeCount > 0 && (
                <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-400">
                  {activeCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((bot) => (
            <BotCard key={bot.id} bot={bot} onToggle={handleBotAction} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/25">
            <FaRobot className="text-4xl mx-auto mb-3 opacity-30" />
            <p className="text-sm">No bots in this category.</p>
          </div>
        )}

        {/* ================= PAYMENT PLANS OVERLAY MODAL ================= */}
        {showPlans && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#141212] border border-white/8 w-full max-w-5xl rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 relative space-y-6">
              
              <button 
                onClick={() => setShowPlans(false)}
                className="absolute top-5 right-5 text-white/40 hover:text-white p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FaTimes size={14} />
              </button>

              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#c45a45] bg-[#c45a45]/10 px-2.5 py-1 rounded-md">
                  Subscription Activation Required
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">AI Compute Core Plans</h2>
                <p className="text-white/40 text-xs md:text-sm">
                  Unlock high-performance autonomous execution servers. Choose a pipeline capacity tier tailored to your account model size.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                {plans.map((plan) => (
                  <div 
                    key={plan.name}
                    className={`relative rounded-xl p-5 border flex flex-col justify-between transition-all duration-300 ${
                      plan.popular 
                        ? "bg-[#1c1818] border-[#c45a45]/40 shadow-xl shadow-[#c45a45]/5 scale-102" 
                        : "bg-[#0f0e0e] border-white/6 hover:border-white/15"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider bg-[#c45a45] text-white px-2.5 py-0.5 rounded-full shadow-md">
                        Most Popular
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-100">{plan.name} Plan</h3>
                        <p className="text-white/30 text-[11px] mt-1 leading-snug">{plan.description}</p>
                      </div>

                      <div className="flex items-baseline gap-1 py-1">
                        <span className="text-3xl font-black text-white tracking-tight">{plan.price}</span>
                        <span className="text-white/40 text-xs font-medium">{plan.period}</span>
                      </div>

                      <ul className="space-y-2.5 pt-2 border-t border-white/5">
                        {plan.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2 text-[11px] text-slate-300">
                            <FaCheckCircle className="text-emerald-400 mt-0.5 shrink-0 text-[10px]" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      onClick={() => {
                        setHasActivePlan(true);
                        // Unlock premium bot array status items simulation
                        setBotList(prev => prev.map(b => b.tier === plan.name || b.tier === "Starter" ? { ...b, locked: false } : b));
                        setShowPlans(false);
                      }}
                      className={`w-full mt-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                        plan.popular
                          ? "bg-[#c45a45] hover:bg-[#d06a55] text-white shadow-md shadow-[#c45a45]/20"
                          : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                      }`}
                    >
                      Deploy {plan.name} Node
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default AITradingBots;