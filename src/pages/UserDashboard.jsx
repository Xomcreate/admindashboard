import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

const TIER_STYLE = {
  silver:  { bg: "bg-slate-400/15",  text: "text-slate-300",  border: "border-slate-400/30",  label: "🥈 Silver"  },
  gold:    { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/40", label: "🥇 Gold"    },
  diamond: { bg: "bg-violet-500/15", text: "text-violet-300", border: "border-violet-500/30", label: "💎 Diamond" },
  none:    { bg: "bg-[#1e2638]",     text: "text-[#8f9cae]",  border: "border-[#1e2638]",     label: "—"          },
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
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0b66e4]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="text-white space-y-8">

        {/* WELCOME */}
        <div className="bg-[#121824] rounded-2xl p-6 border border-[#1e2638]">
          <p className="text-[#8f9cae] text-sm mb-1">Welcome back,</p>
          <h1 className="text-3xl font-bold text-white">
            {profile.name || profile.email || "Investor"} 👋
          </h1>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <TierBadge tier={profile.tier || "none"} />
            <span className="text-xs text-[#8f9cae]">
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
          <div className="bg-[#121824] rounded-xl p-5 border border-[#1e2638]">
            <p className="text-[#8f9cae] text-xs uppercase tracking-wider mb-1">Wallet Balance</p>
            <h2 className="text-2xl font-bold text-[#10b981]">
              ${parseFloat(profile.wallet_balance || 0).toFixed(2)}
            </h2>
            <p className="text-xs text-[#8f9cae]/60 mt-1">
              {isLocked ? "Locked · after 120 days" : "Available to withdraw"}
            </p>
          </div>
          <div className="bg-[#121824] rounded-xl p-5 border border-[#1e2638]">
            <p className="text-[#8f9cae] text-xs uppercase tracking-wider mb-1">Active Profits</p>
            <h2 className="text-2xl font-bold text-yellow-400">
              ${parseFloat(profile.active_profits || 0).toFixed(2)}
            </h2>
            <p className="text-xs text-[#8f9cae]/60 mt-1">+25% accumulating daily</p>
          </div>
          <div className="bg-[#121824] rounded-xl p-5 border border-[#1e2638]">
            <p className="text-[#8f9cae] text-xs uppercase tracking-wider mb-1">Total Balance</p>
            <h2 className="text-2xl font-bold text-[#0b66e4]">
              ${parseFloat(profile.live_balance || 0).toFixed(2)}
            </h2>
            <p className="text-xs text-[#8f9cae]/60 mt-1">Wallet + active profits</p>
          </div>
          <div className="bg-[#121824] rounded-xl p-5 border border-[#1e2638]">
            <p className="text-[#8f9cae] text-xs uppercase tracking-wider mb-1">Total Withdrawn</p>
            <h2 className="text-2xl font-bold text-red-400">
              ${totalWithdrawals.toFixed(2)}
            </h2>
            <p className="text-xs text-[#8f9cae]/60 mt-1">Approved withdrawals</p>
          </div>
        </div>

        {/* INVESTMENT PLANS */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e2638]">
            <h2 className="text-lg font-semibold text-white">Investment Plans</h2>
            <p className="text-xs text-[#8f9cae] mt-0.5">
              All plans earn <span className="text-[#10b981] font-semibold">25% daily ROI</span> for <span className="text-white font-semibold">120 days</span> · Range: $500,000 – $2,000,000 · <span className="text-amber-400">Withdrawals locked for 120 days</span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#1e2638]">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`p-6 ${plan.bg}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{plan.icon}</span>
                  <span className={`text-lg font-bold ${plan.color}`}>{plan.name}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8f9cae]">Daily ROI</span>
                    <span className="text-[#10b981] font-bold">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8f9cae]">Duration</span>
                    <span className="text-white font-semibold">120 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8f9cae]">Min</span>
                    <span className="text-white">$500,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8f9cae]">Max</span>
                    <span className="text-white">$2,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8f9cae]">Total ROI</span>
                    <span className="text-yellow-400 font-bold">3,000%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8f9cae]">Withdrawal</span>
                    <span className="text-amber-400 text-xs font-medium">After 120 days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TIER PROGRESS */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Your Tier Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { tier: "silver",  icon: "🥈", label: "Silver",  range: "1–2 investments",  min: 1, max: 2  },
              { tier: "gold",    icon: "🥇", label: "Gold",    range: "3–5 investments",  min: 3, max: 5  },
              { tier: "diamond", icon: "💎", label: "Diamond", range: "6+ investments",   min: 6, max: 99 },
            ].map(({ tier, icon, label, range, min }) => {
              const count   = investments.length;
              const current = profile.tier || "none";
              const isActive  = current === tier;
              const isAchieved = count >= min;
              const s = TIER_STYLE[tier];
              return (
                <div key={tier} className={`rounded-lg p-4 border ${isActive ? `${s.bg} ${s.border}` : "bg-[#090d16] border-[#1e2638]"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{icon}</span>
                    <span className={`font-bold text-sm ${isActive ? s.text : isAchieved ? "text-white" : "text-[#8f9cae]"}`}>
                      {label}
                    </span>
                    {isActive && (
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border font-semibold ${s.bg} ${s.text} ${s.border}`}>
                        Current
                      </span>
                    )}
                    {isAchieved && !isActive && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-semibold">
                        ✓ Achieved
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8f9cae]">{range}</p>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[#8f9cae] mt-3">
            You have <span className="text-white font-semibold">{investments.length}</span> investment{investments.length !== 1 ? "s" : ""} total.
          </p>
        </div>

        {/* INVESTMENTS TABLE */}
        <div className="bg-[#121824] rounded-2xl border border-[#1e2638] overflow-hidden">
          <div className="p-5 border-b border-[#1e2638] flex items-center justify-between">
            <h2 className="text-lg font-semibold">My Investments</h2>
            <span className="text-xs bg-[#090d16] px-3 py-1 rounded-full text-[#8f9cae] border border-[#1e2638]">
              {investments.length} plan{investments.length !== 1 ? "s" : ""}
            </span>
          </div>
          {investments.length === 0 ? (
            <div className="p-10 text-center text-[#8f9cae]">
              <p className="text-4xl mb-3">📈</p>
              <p>No investments yet. Start investing to grow your portfolio.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1e2638]">
              {investments.map((inv) => {
                const daysSince = Math.floor((now - new Date(inv.created_at)) / (1000 * 60 * 60 * 24));
                const daysLeft  = Math.max(0, 120 - daysSince);
                const progress  = Math.min(100, (daysSince / 120) * 100);
                return (
                  <div key={inv.id} className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#090d16] border border-[#1e2638] flex items-center justify-center text-lg">
                        {inv.category === "Silver Plan" ? "🥈" : inv.category === "Gold Plan" ? "🥇" : "💎"}
                      </div>
                      <div>
                        <p className="font-semibold">{inv.category}</p>
                        <p className="text-xs text-[#8f9cae]">
                          via {inv.payment_method} · {new Date(inv.created_at).toLocaleDateString()}
                        </p>
                        {inv.active && inv.approved && (
                          <div className="mt-1.5 w-40">
                            <div className="flex justify-between text-xs text-[#8f9cae] mb-0.5">
                              <span>Day {Math.min(daysSince, 120)}/120</span>
                              <span className="text-amber-400">{daysLeft}d left</span>
                            </div>
                            <div className="w-full bg-[#1e2638] rounded-full h-1">
                              <div className="bg-[#0b66e4] h-1 rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-6 text-sm flex-wrap">
                      <div>
                        <p className="text-[#8f9cae] text-xs">Amount</p>
                        <p className="font-semibold text-white">${Number(inv.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div>
                        <p className="text-[#8f9cae] text-xs">Daily ROI</p>
                        <p className="font-semibold text-yellow-400">{inv.daily_roi}%</p>
                      </div>
                      <div>
                        <p className="text-[#8f9cae] text-xs">Duration</p>
                        <p className="font-semibold text-[#8f9cae]">120 days</p>
                      </div>
                      <div>
                        <p className="text-[#8f9cae] text-xs">Profit</p>
                        <p className="font-semibold text-[#10b981]">
                          ${parseFloat(inv.current_profit || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#8f9cae] text-xs">Status</p>
                        {inv.active ? (
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-900/40 text-green-400">Active</span>
                        ) : inv.approved ? (
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-slate-700/60 text-slate-400">Matured</span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-yellow-900/40 text-yellow-400">Pending</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* TOP INVESTORS LEADERBOARD */}
        <div className="bg-[#121824] border border-[#1e2638] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e2638]">
            <div>
              <h2 className="text-lg font-semibold text-white">🏆 Top Investors</h2>
              <p className="text-xs text-[#8f9cae]/60 mt-0.5">
                🥈 Silver (1–2) · 🥇 Gold (3–5) · 💎 Diamond (6+)
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
              No investors with active investments yet.
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
                    <th className="p-4 text-center">Active Plans</th>
                    <th className="p-4 text-center">Investments</th>
                  </tr>
                </thead>
                <tbody>
                  {topList.map((inv) => {
                    const isMe = inv.email === profile.email;
                    const rankLabel =
                      inv.rank === 1 ? "🥇" :
                      inv.rank === 2 ? "🥈" :
                      inv.rank === 3 ? "🥉" : `#${inv.rank}`;
                    return (
                      <tr
                        key={inv.rank}
                        className={`border-b border-[#1e2638] transition-colors ${
                          isMe ? "bg-[#0b66e4]/10 hover:bg-[#0b66e4]/15" : "hover:bg-[#1e2638]/60"
                        }`}
                      >
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold bg-[#090d16] border border-[#1e2638] text-[#8f9cae]">
                            {rankLabel}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white">{inv.name}</p>
                            {isMe && (
                              <span className="text-xs bg-[#0b66e4]/15 text-[#0b66e4] border border-[#0b66e4]/25 px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#8f9cae]/60 mt-0.5">{inv.email}</p>
                        </td>
                        <td className="p-4 text-center"><TierBadge tier={inv.tier} /></td>
                        <td className="p-4 text-right font-bold text-[#10b981]">
                          ${Number(inv.total_invested).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-right font-semibold text-yellow-400">
                          ${Number(inv.total_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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

        {/* WITHDRAWALS */}
        <div className="bg-[#121824] rounded-2xl border border-[#1e2638] overflow-hidden">
          <div className="p-5 border-b border-[#1e2638] flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Withdrawals</h2>
            <span className="text-xs bg-[#090d16] px-3 py-1 rounded-full text-[#8f9cae] border border-[#1e2638]">
              {withdrawals.length} request{withdrawals.length !== 1 ? "s" : ""}
            </span>
          </div>
          {withdrawals.length === 0 ? (
            <div className="p-10 text-center text-[#8f9cae]">
              <p className="text-4xl mb-3">💸</p>
              <p>No withdrawals yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1e2638]">
              {withdrawals.map((w) => (
                <div key={w.id} className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">${parseFloat(w.amount).toFixed(2)}</p>
                    <p className="text-xs text-[#8f9cae] font-mono mt-0.5 break-all">{w.wallet_address}</p>
                    <p className="text-xs text-[#8f9cae]/60 mt-0.5">
                      {new Date(w.created_at).toLocaleDateString(undefined, {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold shrink-0 ${
                    w.status === "Approved" ? "bg-green-900/40 text-green-400"
                    : w.status === "Rejected" ? "bg-red-900/40 text-red-400"
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