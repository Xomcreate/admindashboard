import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const INVESTMENT_PLANS = [
  {
    name: "Trial Plan",
    icon: "🌱",
    min: 500,
    max: 5000,
    duration: "3 Days",
    minReturn: "15%",
    maxReturn: "20%",
  },
  {
    name: "Essential Plan",
    icon: "🛡️",
    min: 5000,
    max: 10000,
    duration: "14 Days",
    minReturn: "30%",
    maxReturn: "35%",
  },
  {
    name: "Premium Plan",
    icon: "✨",
    min: 10000,
    max: 50000,
    duration: "30 Days",
    minReturn: "60%",
    maxReturn: "65%",
  },
  {
    name: "Ultimate Plan",
    icon: "🔥",
    min: 50000,
    max: 250000,
    duration: "60 Days",
    minReturn: "290%",
    maxReturn: "300%",
  },
  {
    name: "Royal Plan",
    icon: "👑",
    min: 250000,
    max: 500000,
    duration: "90 Days",
    minReturn: "550%",
    maxReturn: "600%",
  },
  {
    name: "Diamond Plan",
    icon: "💎",
    min: 500000,
    max: 2000000,
    duration: "120 Days",
    minReturn: "1,450%",
    maxReturn: "1,500%",
  },
];

function InvestmentPlans() {
  // Store individual amount inputs per plan using plan name as key
  const [amounts, setAmounts] = useState({});

  const handleAmountChange = (planName, value) => {
    setAmounts((prev) => ({ ...prev, [planName]: value }));
  };

  const handleInvest = (plan, e) => {
    e.preventDefault();
    const investmentAmount = parseFloat(amounts[plan.name] || 0);
    
    if (!investmentAmount || investmentAmount < plan.min || investmentAmount > plan.max) {
      alert(`Please enter a valid amount between $${plan.min.toLocaleString()} and $${plan.max.toLocaleString()} for the ${plan.name}.`);
      return;
    }
    
    console.log(`Investing $${investmentAmount} into ${plan.name}`);
    // Handle investment logic or API action here
  };

  // PALETTE CONFIGURATION - Synced cleanly with Profile & Loader
  const pageBg        = "bg-[#171515]";
  const cardBg        = "bg-[#211e1e]";
  const borderCol     = "border-[#332d2c]";
  const primaryOrange = "text-[#c45a45]";
  const mutedText     = "text-[#9e9593]";
  const inputBg       = "bg-[#171515]";

  return (
    <DashboardLayout>
      <div className={`text-white space-y-8 max-w-6xl mx-auto p-4 min-h-screen ${pageBg}`}>
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Investment Plans</h1>
          <p className={`${mutedText} text-sm mt-1`}>
            Select a risk tier suited to your investment profile. Higher brackets yield premium market returns over specialized holding intervals.
          </p>
        </div>

        {/* CARDS GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INVESTMENT_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`${cardBg} rounded-xl border ${borderCol} p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-[#c45a45]/40 hover:scale-[1.01]`}
            >
              {/* Header Info */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-2 rounded-lg bg-[#171515]/60 border border-[#332d2c]">{plan.icon}</span>
                  <span className="bg-[#c45a45]/10 border border-[#c45a45]/20 text-[#c45a45] px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
                    {plan.duration}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold tracking-wide mb-4 text-slate-100">{plan.name}</h3>

                {/* Return Values Section */}
                <div className="grid grid-cols-2 gap-2 bg-[#171515]/50 border border-[#332d2c]/50 rounded-lg p-3 mb-4">
                  <div>
                    <p className={`text-[10px] uppercase font-semibold tracking-wider ${mutedText}`}>Min. Return</p>
                    <p className="text-emerald-400 font-bold text-sm">{plan.minReturn}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] uppercase font-semibold tracking-wider ${mutedText}`}>Max. Return</p>
                    <p className={`${primaryOrange} font-bold text-sm`}>{plan.maxReturn}</p>
                  </div>
                </div>

                {/* Configuration Specs */}
                <div className="space-y-2 text-sm border-b border-[#332d2c] pb-4 mb-5">
                  <div className="flex justify-between">
                    <span className={mutedText}>Min. Investment:</span>
                    <span className="font-semibold text-slate-200">${plan.min.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={mutedText}>Max. Investment:</span>
                    <span className="font-semibold text-slate-200">${plan.max.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Form */}
              <form onSubmit={(e) => handleInvest(plan, e)} className="space-y-3">
                <div>
                  <label className={`block text-xs uppercase tracking-wider mb-1.5 ${mutedText}`}>
                    Amount to Invest
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold ${mutedText}`}>$</span>
                    <input
                      type="number"
                      placeholder={`${plan.min}`}
                      min={plan.min}
                      max={plan.max}
                      className={`w-full ${inputBg} border ${borderCol} rounded-lg pl-8 pr-4 py-2.5 text-white placeholder-[#5a5352] focus:outline-none focus:border-[#c45a45] text-sm transition-colors`}
                      value={amounts[plan.name] || ""}
                      onChange={(e) => handleAmountChange(plan.name, e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#a64633] hover:bg-[#c45a45] text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-[#c45a45]/10"
                >
                  Invest
                </button>
              </form>

            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}

export default InvestmentPlans;