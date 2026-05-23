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
      fetchProfile(); // re-fetch to get latest balances
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto text-white">

        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">

          <div className="bg-[#111c44] p-5 rounded-xl border border-[#1e295d]">
            <p className="text-[#94a3b8] text-xs uppercase tracking-wider mb-1">Wallet Balance</p>
            <h2 className="text-2xl font-bold text-[#10b981] mt-1">
              ${parseFloat(profile.wallet_balance || 0).toFixed(2)}
            </h2>
            <p className="text-xs text-[#64748b] mt-1">Available to withdraw</p>
          </div>

          <div className="bg-[#111c44] p-5 rounded-xl border border-[#1e295d]">
            <p className="text-[#94a3b8] text-xs uppercase tracking-wider mb-1">Active Profits</p>
            <h2 className="text-2xl font-bold text-yellow-400 mt-1">
              ${parseFloat(profile.active_profits || 0).toFixed(2)}
            </h2>
            <p className="text-xs text-[#64748b] mt-1">Accumulating daily</p>
          </div>

          <div className="bg-[#111c44] p-5 rounded-xl border border-[#1e295d]">
            <p className="text-[#94a3b8] text-xs uppercase tracking-wider mb-1">Total Balance</p>
            <h2 className="text-2xl font-bold text-blue-400 mt-1">
              ${parseFloat(profile.live_balance || 0).toFixed(2)}
            </h2>
            <p className="text-xs text-[#64748b] mt-1">Wallet + active profits</p>
          </div>

          <div className="bg-[#111c44] p-5 rounded-xl border border-[#1e295d]">
            <p className="text-[#94a3b8] text-xs uppercase tracking-wider mb-1">Bonus</p>
            <h2 className="text-2xl font-bold text-purple-400 mt-1">
              ${parseFloat(profile.bonus || 0).toFixed(2)}
            </h2>
            <p className="text-xs text-[#64748b] mt-1">Awarded by admin</p>
          </div>

        </div>

        {/* Edit Form */}
        <form
          onSubmit={updateProfile}
          className="bg-[#111c44] p-8 rounded-xl border border-[#1e295d] space-y-5"
        >
          {success && <p className="text-green-400 text-sm">{success}</p>}
          {error   && <p className="text-red-400   text-sm">{error}</p>}

          <div>
            <label className="text-sm text-[#94a3b8] mb-1 block">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-[#0a1128] p-3 rounded-lg border border-[#1e295d] text-white focus:outline-none focus:border-[#10b981]"
            />
          </div>

          <div>
            <label className="text-sm text-[#94a3b8] mb-1 block">
              Email
              <span className="ml-2 text-xs text-yellow-500 font-medium">🔒 Cannot be changed</span>
            </label>
            <input
              type="email"
              value={profile.email}
              readOnly
              disabled
              className="w-full bg-[#0a1128] p-3 rounded-lg border border-[#1e295d] text-[#94a3b8] cursor-not-allowed opacity-60"
            />
          </div>

          <div>
            <label className="text-sm text-[#94a3b8] mb-1 block">Phone</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full bg-[#0a1128] p-3 rounded-lg border border-[#1e295d] text-white focus:outline-none focus:border-[#10b981]"
            />
          </div>

          <button
            type="submit"
            className="bg-[#10b981] px-6 py-3 rounded-lg font-semibold disabled:opacity-50 hover:bg-[#059669] transition-colors"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>

      </div>
    </DashboardLayout>
  );
}

export default Profile;