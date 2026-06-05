import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

const TIER_STYLE = {
  silver:  { bg: "bg-slate-400/15",  text: "text-slate-300",  border: "border-slate-400/30",  label: "🥈 Silver"  },
  gold:    { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/40", label: "🥇 Gold"    },
  diamond: { bg: "bg-violet-500/15", text: "text-violet-300", border: "border-violet-500/30", label: "💎 Diamond" },
  none:    { bg: "bg-white/5",       text: "text-white/50",   border: "border-white/10",     label: "—"          },
};

const TIER_DESC = {
  none:    "Make your first investment to earn a tier",
  silver:  "1–2 investments · keep going for Gold!",
  gold:    "3–5 investments · almost at Diamond!",
  diamond: "6+ investments · elite Diamond status!",
};

const PLANS = [
  {
    name:     "Silver Plan",
    icon:     "🥈",
    color:    "text-slate-300",
    border:   "border-slate-400/30",
    bg:       "bg-slate-400/10",
    tierReq:  "Silver tier (1–2 investments)",
  },
  {
    name:     "Gold Plan",
    icon:     "🥇",
    color:    "text-yellow-400",
    border:   "border-yellow-500/30",
    bg:       "bg-yellow-500/10",
    tierReq:  "Gold tier (3–5 investments)",
  },
  {
    name:     "Diamond Plan",
    icon:     "💎",
    color:    "text-violet-300",
    border:   "border-violet-500/30",
    bg:       "bg-violet-500/10",
    tierReq:  "Diamond tier (6+ investments)",
  },
];

const TierBadge = ({ tier }) => {
  const s = TIER_STYLE[tier] || TIER_STYLE.none;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      {s.label}
    </span>
  );
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

  // 120-day lock check
  const now = new Date();
  const isLocked = investments.some((inv) => {
    if (!inv.active || !inv.approved) return false;
    const daysSince = (now - new Date(inv.created_at)) / (1000 * 60 * 60 * 24);
    return daysSince < 120;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c45a45]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="text-white space-y-8">

        {/* WELCOME */}
        <div className="bg-[#0A0A0B] rounded-2xl p-6 border border-white/6">
          <p className="text-white/50 text-sm mb-1">Welcome back,</p>
          <h1 className="text-3xl font-bold text-white">
            {profile.name || profile.email || "Investor"} 👋
          </h1>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <TierBadge tier={profile.tier || "none"} />
            <span className="text-xs text-white/50">
              {TIER_DESC[profile.tier] || TIER_DESC.none}
            </span>
            {isLocked && (
              <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-medium">
                🔒 120-day lock active
              </span>
            )}
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0A0A0B] rounded-xl p-5 border border-white/6">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Wallet Balance</p>
            <h2 className="text-2xl font-bold text-[#10b981]">
              ${parseFloat(profile.wallet_balance || 0).toFixed(2)}
            </h2>
            <p className="text-xs text-white/30 mt-1">
              {isLocked ? "Locked · after 120 days" : "Available to withdraw"}
            </p>
          </div>
          <div className="bg-[#0A0A0B] rounded-xl p-5 border border-white/6">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Active Profits</p>
            <h2 className="text-2xl font-bold text-yellow-400">
              ${parseFloat(profile.active_profits || 0).toFixed(2)}
            </h2>
            <p className="text-xs text-white/30 mt-1">+25% accumulating daily</p>
          </div>
          <div className="bg-[#0A0A0B] rounded-xl p-5 border border-white/6">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Total Balance</p>
            <h2 className="text-2xl font-bold text-[#c45a45]">
              ${parseFloat(profile.live_balance || 0).toFixed(2)}
            </h2>
            <p className="text-xs text-white/30 mt-1">Wallet + active profits</p>
          </div>
          <div className="bg-[#0A0A0B] rounded-xl p-5 border border-white/6">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Total Withdrawn</p>
            <h2 className="text-2xl font-bold text-red-400">
              ${totalWithdrawals.toFixed(2)}
            </h2>
            <p className="text-xs text-white/30 mt-1">Approved withdrawals</p>
          </div>
        </div>

        {/* INVESTMENT PLANS */}
        <div className="bg-[#0A0A0B] border border-white/6 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/6">
            <h2 className="text-lg font-semibold text-white">Investment Plans</h2>
            <p className="text-xs text-white/50 mt-0.5">
              All plans earn <span className="text-[#10b981] font-semibold">25% daily ROI</span> for <span className="text-white font-semibold">120 days</span> · Range: $500,000 – $2,000,000 · <span className="text-amber-400">Withdrawals locked for 120 days</span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/6">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`p-6 ${plan.bg}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{plan.icon}</span>
                  <span className={`text-lg font-bold ${plan.color}`}>{plan.name}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Daily ROI</span>
                    <span className="text-[#10b981] font-bold">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Duration</span>
                    <span className="text-white font-semibold">120 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Min</span>
                    <span className="text-white">$500,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Max</span>
                    <span className="text-white">$2,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Total ROI</span>
                    <span className="text-yellow-400 font-bold">3,000%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Withdrawal</span>
                    <span className="text-amber-400 text-xs font-medium">After 120 days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TIER PROGRESS */}
        <div className="bg-[#0A0A0B] border border-white/6 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Your Tier Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { tier: "silver", icon: "🥈", label: "Silver",  range: "1–2 investments",  min: 1 },
              { tier: "gold",   icon: "🥇", label: "Gold",    range: "3–5 investments",  min: 3 },
              { tier: "diamond", icon: "💎", label: "Diamond", range: "6+ investments",   min: 6 },
            ].map(({ tier, icon, label, range, min }) => {
              const count   = investments.length;
              const current = profile.tier || "none";
              const isActive  = current === tier;
              const isAchieved = count >= min;
              const s = TIER_STYLE[tier];
              return (
                <div key={tier} className={`rounded-lg p-4 border ${isActive ? `${s.bg} ${s.border}` : "bg-white/5 border-white/6"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{icon}</span>
                    <span className={`font-bold text-sm ${isActive ? s.text : isAchieved ? "text-white" : "text-white/50"}`}>
                      {label}
                    </span>
                    {isActive && (
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border font-semibold ${s.bg} ${s.text} ${s.border}`}>Active</span>
                    )}
                  </div>
                  <p className="text-xs text-white/30">{range}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;