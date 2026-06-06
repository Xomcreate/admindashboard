import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import {
  FaExchangeAlt, FaChartLine, FaUserCircle, FaStar, FaCheckCircle,
  FaFire, FaLock, FaSearch,
  FaBolt, FaShieldAlt, FaUsers, FaTrophy, FaTimes,
  FaWallet, FaInfoCircle,
} from "react-icons/fa";

const traders = [
  {
    id: 1, name: "Alex Mercer", handle: "@alexm_trades", avatar: "AM",
    roi: "+184.3%", roiPositive: true, winRate: "78%", followers: "12.4K",
    risk: "Medium", tags: ["Forex", "Gold"], monthlyReturn: "+18.2%",
    badge: "Top Performer", color: "#c45a45", copying: false, tier: "Starter",
  },
  {
    id: 2, name: "Sofia Chen", handle: "@sofia_quant", avatar: "SC",
    roi: "+231.7%", roiPositive: true, winRate: "83%", followers: "28.1K",
    risk: "Low", tags: ["Stocks", "ETFs"], monthlyReturn: "+22.5%",
    badge: "Elite", color: "#d4875a", copying: false, tier: "Pro",
  },
  {
    id: 3, name: "Raj Patel", handle: "@raj_algo", avatar: "RP",
    roi: "+97.6%", roiPositive: true, winRate: "71%", followers: "7.8K",
    risk: "High", tags: ["Crypto", "Futures"], monthlyReturn: "+9.8%",
    badge: "Rising Star", color: "#9b6ab5", copying: false, tier: "Starter",
  },
  {
    id: 4, name: "Elena Kovacs", handle: "@elena_macro", avatar: "EK",
    roi: "+312.0%", roiPositive: true, winRate: "88%", followers: "41.3K",
    risk: "Low", tags: ["Indices", "Forex"], monthlyReturn: "+28.1%",
    badge: "Legend", color: "#c45a45", copying: false, tier: "Institutional",
  },
  {
    id: 5, name: "Marcus Webb", handle: "@mwebb_scalp", avatar: "MW",
    roi: "+143.8%", roiPositive: true, winRate: "69%", followers: "9.2K",
    risk: "High", tags: ["Crypto", "Stocks"], monthlyReturn: "+14.6%",
    badge: "Top Performer", color: "#5a8fc4", copying: false, tier: "Pro",
  },
  {
    id: 6, name: "Nadia Osei", handle: "@nadia_swing", avatar: "NO",
    roi: "+189.2%", roiPositive: true, winRate: "76%", followers: "15.6K",
    risk: "Medium", tags: ["Forex", "Commodities"], monthlyReturn: "+17.9%",
    badge: "Verified", color: "#4db89b", copying: false, tier: "Starter",
  },
];

const plans = [
  {
    name: "Starter", price: "$49", deposit: "$500", period: "/mo",
    description: "Perfect for exploring platform-assisted manual trades.",
    features: [
      "Access to 3 Starter Tier Traders",
      "Max $2,500 copying allocation",
      "Standard execution latency",
      "Discord Group Access",
      "Min. deposit: $500",
    ],
    popular: false, depositAmount: 500,
  },
  {
    name: "Pro", price: "$149", deposit: "$2,000", period: "/mo",
    description: "Most popular choice for steady monthly growth curves.",
    features: [
      "Access to Elite & Pro Tier Traders",
      "Max $15,000 copying allocation",
      "Priority real-time execution",
      "Advanced risk-management metrics",
      "24/7 priority desk",
      "Min. deposit: $2,000",
    ],
    popular: true, depositAmount: 2000,
  },
  {
    name: "Institutional", price: "$499", deposit: "$10,000", period: "/mo",
    description: "Full alpha pipeline access for heavy asset deployment.",
    features: [
      "Unlock ALL Legend & Institutional Traders",
      "No allocation cap barriers",
      "Sub-millisecond execution vectors",
      "Direct 1-on-1 account engineer",
      "Custom webhooks API integration",
      "Min. deposit: $10,000",
    ],
    popular: false, depositAmount: 10000,
  },
];

const riskBg = {
  Low:    "bg-emerald-400/10 border-emerald-400/20",
  Medium: "bg-amber-400/10  border-amber-400/20",
  High:   "bg-red-400/10    border-red-400/20",
};
const riskColor = { Low: "text-emerald-400", Medium: "text-amber-400", High: "text-red-400" };
const badgeIcon = {
  Elite:           <FaTrophy      className="text-[10px]" />,
  Legend:          <FaStar        className="text-[10px]" />,
  "Top Performer": <FaFire        className="text-[10px]" />,
  "Rising Star":   <FaBolt        className="text-[10px]" />,
  Verified:        <FaCheckCircle className="text-[10px]" />,
};

function TraderCard({ trader, onToggle, hasActivePlan }) {
  return (
    <div className="group relative bg-[#0f0e0e] border border-white/[0.07] rounded-2xl p-5 hover:border-[#c45a45]/25 transition-all duration-300 hover:shadow-lg hover:shadow-[#c45a45]/5 flex flex-col gap-4">
      {!hasActivePlan && (
        <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#c45a45]/20 border border-[#c45a45]/40 flex items-center justify-center">
            <FaLock className="text-[#c45a45] text-sm" />
          </div>
          <p className="text-white/60 text-xs font-medium">Subscribe to copy this trader</p>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: `${trader.color}25`, border: `1px solid ${trader.color}40` }}
          >
            <span style={{ color: trader.color }}>{trader.avatar}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white text-sm font-semibold leading-none">{trader.name}</p>
              <span
                className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                style={{ background: `${trader.color}18`, color: trader.color, border: `1px solid ${trader.color}30` }}
              >
                {badgeIcon[trader.badge]}
                {trader.badge}
              </span>
            </div>
            <p className="text-white/30 text-xs mt-0.5">{trader.handle}</p>
          </div>
        </div>
        <div className={`text-xs px-2 py-1 rounded-lg border font-medium ${riskBg[trader.risk]} ${riskColor[trader.risk]}`}>
          {trader.risk} Risk
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { val: trader.roi,       label: "Total ROI",  cls: "text-emerald-400" },
          { val: trader.winRate,   label: "Win Rate",   cls: "text-white"       },
          { val: trader.followers, label: "Followers",  cls: "text-white/70"    },
        ].map(({ val, label, cls }) => (
          <div key={label} className="bg-white/3 rounded-xl p-3 text-center border border-white/3">
            <p className={`text-base font-bold leading-none ${cls}`}>{val}</p>
            <p className="text-white/30 text-[10px] mt-1 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1.5 flex-wrap">
          {trader.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/40 font-medium">
              {tag}
            </span>
          ))}
        </div>
        <div className="text-right">
          <p className="text-emerald-400 text-xs font-semibold">{trader.monthlyReturn}</p>
          <p className="text-white/25 text-[10px]">this month</p>
        </div>
      </div>

      <button
        onClick={() => onToggle(trader)}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
          trader.copying
            ? "bg-[#c45a45]/15 border border-[#c45a45]/40 text-[#c45a45] hover:bg-[#c45a45]/25"
            : "bg-[#c45a45] hover:bg-[#d06a55] text-white shadow-md shadow-[#c45a45]/20"
        }`}
      >
        {trader.copying
          ? "✓ Copying — Stop"
          : <>
              {!hasActivePlan && <FaLock className="text-[10px] opacity-70" />}
              Copy Trader
              <span className="text-[10px] opacity-60 px-1 py-0.5 rounded bg-black/20 font-mono">
                {trader.tier}
              </span>
            </>
        }
      </button>
    </div>
  );
}

function CopyTrading() {
  const navigate = useNavigate();
  const [traderList,    setTraderList]    = useState(traders);
  const [filter,        setFilter]        = useState("All");
  const [search,        setSearch]        = useState("");
  const [showPlans,     setShowPlans]     = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [activePlanName]                  = useState(null);
  const [checkingBalance, setCheckingBalance] = useState(false);
  const [pendingPlan,   setPendingPlan]   = useState(null); // plan awaiting balance check

  const filters = ["All", "Low Risk", "High ROI", "Most Followed"];

  const toggleCopy = (trader) => {
    if (!hasActivePlan) { setShowPlans(true); return; }
    setTraderList((prev) =>
      prev.map((t) => (t.id === trader.id ? { ...t, copying: !t.copying } : t))
    );
  };

  /**
   * Called when user clicks a plan card.
   * 1. Fetch the user's current wallet balance from the API.
   * 2. If balance >= plan.depositAmount  → activate immediately (no need to fund).
   * 3. If balance < plan.depositAmount   → redirect to Fund Account to top up.
   */
  const handleSelectPlan = async (plan) => {
    setCheckingBalance(true);
    setPendingPlan(plan);
    try {
      const res = await API.get("user-dashboard/");
      const walletBalance = parseFloat(res.data?.profile?.wallet_balance || 0);

      setShowPlans(false);

      if (walletBalance >= plan.depositAmount) {
        // ✅ Sufficient balance — activate the plan directly
        setHasActivePlan(true);
        // Optionally call an API endpoint here to create the subscription
        // e.g. await API.post("activate-plan/", { plan: plan.name });
        alert(`✅ "${plan.name}" plan activated using your existing balance ($${walletBalance.toFixed(2)})!`);
      } else {
        // ❌ Insufficient balance — redirect to fund account
        const shortfall = plan.depositAmount - walletBalance;
        navigate("/fund-account", {
          state: {
            fromPlan:   true,
            planName:   plan.name,
            planPrice:  plan.price,
            minDeposit: plan.depositAmount,
            shortfall,
            currentBalance: walletBalance,
            returnTo:   "/copy-trading",
          },
        });
      }
    } catch (err) {
      console.error("Balance check failed:", err);
      // Fallback: if API fails, route to fund account to be safe
      setShowPlans(false);
      navigate("/fund-account", {
        state: {
          fromPlan:   true,
          planName:   plan.name,
          planPrice:  plan.price,
          minDeposit: plan.depositAmount,
          returnTo:   "/copy-trading",
        },
      });
    } finally {
      setCheckingBalance(false);
      setPendingPlan(null);
    }
  };

  const copyingCount = traderList.filter((t) => t.copying).length;
  const filtered = traderList.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.handle.toLowerCase().includes(search.toLowerCase());
    if (filter === "Low Risk") return t.risk === "Low" && matchSearch;
    return matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="text-white p-5 md:p-7 max-w-7xl mx-auto relative">

        {/* Header */}
        <div className="mb-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center">
                <FaExchangeAlt className="text-[#c45a45] text-sm" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Copy Trading</h1>
            </div>
            <p className="text-white/35 text-sm ml-12">
              Mirror top traders automatically and share in their profits.
            </p>
          </div>

          {hasActivePlan ? (
            <div className="md:ml-auto flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 self-start md:self-center">
              <FaCheckCircle className="text-[10px]" /> {activePlanName} Plan Active
            </div>
          ) : (
            <button
              onClick={() => setShowPlans(true)}
              className="md:ml-auto text-xs font-semibold px-4 py-2 rounded-xl border border-[#c45a45]/40 bg-[#c45a45]/10 hover:bg-[#c45a45]/20 text-[#c45a45] transition-all flex items-center gap-2 self-start md:self-center"
            >
              <FaWallet className="text-[10px]" /> Invest & Subscribe to Start
            </button>
          )}
        </div>

        {/* Notice Banner */}
        {!hasActivePlan && (
          <div className="mb-6 flex items-start gap-3 bg-amber-400/8 border border-amber-400/20 rounded-xl px-4 py-3.5">
            <FaInfoCircle className="text-amber-400 text-sm shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 text-xs font-semibold">Investment Required to Copy Traders</p>
              <p className="text-white/40 text-[11px] mt-0.5">
                You must subscribe to a plan and make a minimum deposit before copying any trader.
                Plans start from <span className="text-white/60 font-medium">$49/mo + $500 min. deposit</span>.
                If your wallet already has sufficient funds, activation is instant.
              </p>
              <button
                onClick={() => setShowPlans(true)}
                className="mt-2 text-[11px] text-amber-400 underline underline-offset-2 hover:text-amber-300 transition-colors"
              >
                View plans & deposit requirements →
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          {[
            { label: "Active Copies", value: copyingCount,  icon: <FaUsers />     },
            { label: "Avg. ROI",      value: "+18.4%",      icon: <FaChartLine /> },
            { label: "Top Trader",    value: "Elena K.",    icon: <FaTrophy />    },
            { label: "Protected",     value: "Insured",     icon: <FaShieldAlt /> },
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

        {/* Filter + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs" />
            <input
              type="text"
              placeholder="Search traders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0f0e0e] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#c45a45]/40 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 border ${
                  filter === f
                    ? "bg-[#c45a45]/15 border-[#c45a45]/35 text-white"
                    : "bg-transparent border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Traders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((trader) => (
            <TraderCard key={trader.id} trader={trader} onToggle={toggleCopy} hasActivePlan={hasActivePlan} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/25">
            <FaSearch className="text-4xl mx-auto mb-3 opacity-30" />
            <p className="text-sm">No traders match your search.</p>
          </div>
        )}

        {/* ── Plans Modal ── */}
        {showPlans && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#141212] border border-white/8 w-full max-w-5xl rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 relative space-y-6">

              <button
                onClick={() => setShowPlans(false)}
                className="absolute top-5 right-5 text-white/40 hover:text-white p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FaTimes size={14} />
              </button>

              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#c45a45] bg-[#c45a45]/10 px-2.5 py-1 rounded-md">
                  Subscription + Deposit Required
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Select Your Copy Trading Plan
                </h2>
                <p className="text-white/40 text-xs md:text-sm">
                  Choose a plan. If your wallet balance covers the minimum deposit, activation is instant.
                  Otherwise, you'll be taken to the deposit page to top up.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {plans.map((plan) => (
                  <div key={plan.name} className="flex-1 flex items-center gap-3 bg-white/3 border border-white/8 rounded-xl px-4 py-3">
                    <FaWallet className="text-[#c45a45] text-sm shrink-0" />
                    <div>
                      <p className="text-white text-xs font-bold">{plan.name} Plan</p>
                      <p className="text-white/40 text-[11px]">
                        <span className="text-white/60">{plan.price}/mo</span> + min.{" "}
                        <span className="text-emerald-400 font-semibold">{plan.deposit} deposit</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative rounded-xl p-5 border flex flex-col justify-between transition-all duration-300 ${
                      plan.popular
                        ? "bg-[#1c1818] border-[#c45a45]/40 shadow-xl shadow-[#c45a45]/5"
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

                      <div className="bg-white/3 border border-white/6 rounded-xl p-3 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-white tracking-tight">{plan.price}</span>
                            <span className="text-white/40 text-xs font-medium">{plan.period}</span>
                          </div>
                          <span className="text-[10px] text-white/30 uppercase tracking-wide">Subscription</span>
                        </div>
                        <div className="border-t border-white/6 pt-2 flex items-center justify-between">
                          <span className="text-[10px] text-white/40 uppercase tracking-wide">Min. Deposit</span>
                          <span className="text-emerald-400 font-bold text-sm">{plan.deposit}</span>
                        </div>
                      </div>

                      <ul className="space-y-2.5 pt-1">
                        {plan.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2 text-[11px] text-slate-300">
                            <FaCheckCircle className="text-emerald-400 mt-0.5 shrink-0 text-[10px]" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={checkingBalance && pendingPlan?.name === plan.name}
                      className={`w-full mt-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait ${
                        plan.popular
                          ? "bg-[#c45a45] hover:bg-[#d06a55] text-white shadow-md shadow-[#c45a45]/20"
                          : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                      }`}
                    >
                      <FaWallet className="text-[10px]" />
                      {checkingBalance && pendingPlan?.name === plan.name
                        ? "Checking balance…"
                        : `Activate ${plan.name} Plan`}
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-center text-white/20 text-[10px]">
                If your wallet balance is sufficient, the plan activates instantly. Otherwise you'll be redirected to deposit.
              </p>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default CopyTrading;