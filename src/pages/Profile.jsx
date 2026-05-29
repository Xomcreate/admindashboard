import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

function Profile() {
  const [profile, setProfile] = useState({
    id: null, name: "", email: "", phone: "",
    wallet_balance: 0, active_profits: 0, live_balance: 0, bonus: 0,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("profile/");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await API.patch(`investors/${profile.id}/`, {
        name:  profile.name,
        phone: profile.phone,
      });
      setSuccess("Profile updated successfully!");
      fetchProfile(); // re-fetch profile to sync changes
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Extracting basic color palette variables for clarity
  const pageBg = "bg-[#090d16]";
  const cardBg = "bg-[#121824]";
  const borderCol = "border-[#1e2638]";
  const primaryBlue = "text-[#0b66e4]";
  const mutedText = "text-[#8f9cae]";
  const inputBg = "bg-[#090d16]";

  return (
    <DashboardLayout>
      <div className={`text-white space-y-8 max-w-4xl mx-auto p-4`}>
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Account Settings</h1>
          <p className={`${mutedText} text-sm mt-1`}>Manage your personal information and view account balances.</p>
        </div>

        {/* BALANCE SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${cardBg} p-5 rounded-xl border ${borderCol} shadow-2xl`}>
            <p className={`${mutedText} text-xs uppercase tracking-wider mb-1`}>Wallet Balance</p>
            <h2 className={`text-2xl font-bold ${primaryBlue}`}>
              ${parseFloat(profile.wallet_balance || 0).toFixed(2)}
            </h2>
          </div>
          <div className={`${cardBg} p-5 rounded-xl border ${borderCol} shadow-2xl`}>
            <p className={`${mutedText} text-xs uppercase tracking-wider mb-1`}>Active Profits</p>
            <h2 className="text-2xl font-bold text-yellow-400">
              ${parseFloat(profile.active_profits || 0).toFixed(2)}
            </h2>
          </div>
          <div className={`${cardBg} p-5 rounded-xl border ${borderCol} shadow-2xl`}>
            <p className={`${mutedText} text-xs uppercase tracking-wider mb-1`}>Live Balance</p>
            <h2 className="text-2xl font-bold text-slate-100">
              ${parseFloat(profile.live_balance || 0).toFixed(2)}
            </h2>
          </div>
          <div className={`${cardBg} p-5 rounded-xl border ${borderCol} shadow-2xl`}>
            <p className={`${mutedText} text-xs uppercase tracking-wider mb-1`}>Bonus</p>
            <h2 className="text-2xl font-bold text-white">
              ${parseFloat(profile.bonus || 0).toFixed(2)}
            </h2>
          </div>
        </div>

        {/* PERSONAL DETAILS FORM */}
        <form onSubmit={updateProfile} className={`${cardBg} p-8 rounded-xl border ${borderCol} shadow-2xl space-y-6`}>
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Personal Details</h2>

          {success && (
            <p className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3 rounded-lg">
              {success}
            </p>
          )}
          {error && (
            <p className="bg-red-500/15 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={`${mutedText} text-xs uppercase tracking-wider mb-1.5 block`}>Full Name</label>
              <input
                type="text"
                className={`w-full ${inputBg} p-3 rounded-lg border ${borderCol} text-white focus:outline-none focus:border-[#0b66e4] transition-colors`}
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className={`${mutedText} text-xs uppercase tracking-wider mb-1.5 block`}>Email Address</label>
              <input
                type="email"
                className={`w-full ${inputBg} p-3 rounded-lg border ${borderCol} text-slate-400 cursor-not-allowed`}
                value={profile.email}
                disabled // Email is usually fixed or changed through a different process
              />
            </div>
            <div>
              <label className={`${mutedText} text-xs uppercase tracking-wider mb-1.5 block`}>Phone Number</label>
              <input
                type="tel"
                className={`w-full ${inputBg} p-3 rounded-lg border ${borderCol} text-white focus:outline-none focus:border-[#0b66e4] transition-colors`}
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#1e295d]">
            <button
              type="submit"
              className={`bg-[#0b66e4] hover:bg-[#0055cc] px-8 py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer shadow-2xl`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

      </div>
    </DashboardLayout>
  );
}

export default Profile;