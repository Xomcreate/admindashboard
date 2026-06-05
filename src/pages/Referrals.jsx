import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

function Referrals() {
  const [copied, setCopied] = useState(false);
  
  // Base deployment URL provided dynamically appended with placeholder ref identity
  const referralLink = "https://admindashboard-ruddy-beta.vercel.app/dashboard/register?ref=USER123";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  // BRAND PALETTE MATCHED DIRECTLY WITH INVESTMENTS & PROFILE
  const pageBg        = "bg-[#171515]"; 
  const cardBg        = "bg-[#211e1e]"; 
  const borderCol     = "border-[#332d2c]"; 
  const primaryOrange = "text-[#c45a45]"; 
  const mutedText     = "text-[#9e9593]"; 
  const inputBg       = "bg-[#171515]"; 

  return (
    <DashboardLayout>
      <div className={`text-white space-y-8 max-w-4xl mx-auto p-4 min-h-screen ${pageBg}`}>
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Affiliate Program</h1>
          <p className={`${mutedText} text-sm mt-1`}>
            Invite new investors to the platform and earn a recurring commission percentage on their active contract cycles.
          </p>
        </div>

        {/* QUICK METRICS STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`${cardBg} p-5 rounded-xl border ${borderCol} shadow-xl`}>
            <p className={`${mutedText} text-xs uppercase tracking-wider mb-1`}>Total Referred</p>
            <h2 className="text-2xl font-bold text-slate-100">0 Users</h2>
          </div>
          <div className={`${cardBg} p-5 rounded-xl border ${borderCol} shadow-xl`}>
            <p className={`${mutedText} text-xs uppercase tracking-wider mb-1`}>Active Contracts</p>
            <h2 className="text-2xl font-bold text-emerald-400">0 Active</h2>
          </div>
          <div className={`${cardBg} p-5 rounded-xl border ${borderCol} shadow-xl`}>
            <p className={`${mutedText} text-xs uppercase tracking-wider mb-1`}>Total Earnings</p>
            <h2 className={`text-2xl font-bold ${primaryOrange}`}>$0.00</h2>
          </div>
        </div>

        {/* REFERRAL LINK CARD */}
        <div className={`${cardBg} p-6 rounded-xl border ${borderCol} shadow-2xl space-y-4`}>
          <div>
            <h2 className="text-lg font-bold tracking-wide text-slate-100">Your Unique Invitation Link</h2>
            <p className={`${mutedText} text-xs mt-0.5`}>
              Copy and share this destination vector. New registrations tracking via this link attach to your ledger node.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 mt-2">
            <div className={`flex-1 ${inputBg} border ${borderCol} p-3.5 rounded-lg text-xs font-mono break-all text-slate-300 flex items-center min-h-11`}>
              {referralLink}
            </div>
            
            <button
              onClick={handleCopy}
              className={`px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 shadow-md whitespace-nowrap min-w-32.5 ${
                copied 
                  ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20" 
                  : "bg-[#a64633] hover:bg-[#c45a45] shadow-[#c45a45]/10"
              }`}
            >
              {copied ? "✓ Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* PROGRAM TERMS INFO FOOTER */}
        <div className={`${cardBg} p-5 rounded-xl border ${borderCol} shadow-xl`}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-3">How it works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <span className={`font-bold ${primaryOrange} text-sm`}>01.</span>
              <p className="font-semibold text-slate-300">Share Link</p>
              <p className={mutedText}>Distribute your deployment link to prospective network traders.</p>
            </div>
            <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-[#332d2c] pt-3 md:pt-0 md:pl-4">
              <span className={`font-bold ${primaryOrange} text-sm`}>02.</span>
              <p className="font-semibold text-slate-300">Account Validation</p>
              <p className={mutedText}>Referred profiles finalize registration forms on the platform portal.</p>
            </div>
            <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-[#332d2c] pt-3 md:pt-0 md:pl-4">
              <span className={`font-bold ${primaryOrange} text-sm`}>03.</span>
              <p className="font-semibold text-slate-300">Collect Commissions</p>
              <p className={mutedText}>Receive immediate allocation balances whenever assets are locked into smart contracts.</p>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default Referrals;