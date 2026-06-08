import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

function Profile() {
  const [profile, setProfile] = useState({
    id: null, name: "", email: "", phone: "", country: "",
    wallet_balance: 0, active_profits: 0, live_balance: 0, bonus: 0,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Password reset state
  const [passwords, setPasswords] = useState({
    current_password: "", new_password: "", confirm_password: "",
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

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
    setLoading(true); // ✅ Fixed: was incorrectly calling loading(true)
    setSuccess("");
    setError("");

    try {
      await API.patch(`investors/${profile.id}/`, {
        name:    profile.name,
        phone:   profile.phone,
        country: profile.country,
      });
      setSuccess("Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false); // ✅ Fixed: was incorrectly calling loading(false)
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setPwSuccess("");
    setPwError("");

    if (passwords.new_password !== passwords.confirm_password) {
      setPwError("New passwords do not match.");
      return;
    }
    if (passwords.new_password.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }

    setPwLoading(true);
    try {
      await API.post("change-password/", {
        current_password: passwords.current_password,
        new_password:     passwords.new_password,
      });
      setPwSuccess("Password changed successfully!");
      setPasswords({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.detail || "Failed to change password. Please check your current password.";
      setPwError(msg);
    } finally {
      setPwLoading(false);
    }
  };

  const pageBg        = "bg-[#171515]";
  const cardBg        = "bg-[#211e1e]";
  const borderCol     = "border-[#332d2c]";
  const primaryOrange = "text-[#c45a45]";
  const mutedText     = "text-[#9e9593]";
  const inputBg       = "bg-[#171515]";

  const inputClass = `w-full ${inputBg} p-3 rounded-lg border ${borderCol} text-white focus:outline-none focus:border-[#c45a45] transition-colors`;

  return (
    <DashboardLayout>
      <div className={`text-white space-y-8 max-w-4xl mx-auto p-4 min-h-screen ${pageBg}`}>

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Account Settings</h1>
          <p className={`${mutedText} text-sm mt-1`}>Manage your personal information and view account balances.</p>
        </div>

        {/* BALANCE SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${cardBg} p-5 rounded-xl border ${borderCol} shadow-2xl`}>
            <p className={`${mutedText} text-xs uppercase tracking-wider mb-1`}>Wallet Balance</p>
            <h2 className={`text-2xl font-bold ${primaryOrange}`}>
              ${parseFloat(profile.wallet_balance || 0).toFixed(2)}
            </h2>
          </div>
          <div className={`${cardBg} p-5 rounded-xl border ${borderCol} shadow-2xl`}>
            <p className={`${mutedText} text-xs uppercase tracking-wider mb-1`}>Total Profits</p>
            <h2 className="text-2xl font-bold text-yellow-500">
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
            {/* Full Name */}
            <div>
              <label className={`${mutedText} text-xs uppercase tracking-wider mb-1.5 block`}>Full Name</label>
              <input
                type="text"
                className={inputClass}
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </div>

            {/* Email — read-only */}
            <div>
              <label className={`${mutedText} text-xs uppercase tracking-wider mb-1.5 block`}>Email Address</label>
              <input
                type="email"
                className={`w-full ${inputBg} p-3 rounded-lg border ${borderCol} text-slate-500 cursor-not-allowed`}
                value={profile.email}
                disabled
              />
            </div>

            {/* Phone */}
            <div>
              <label className={`${mutedText} text-xs uppercase tracking-wider mb-1.5 block`}>Phone Number</label>
              <input
                type="tel"
                className={inputClass}
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>

            {/* Country */}
            <div>
              <label className={`${mutedText} text-xs uppercase tracking-wider mb-1.5 block`}>Country</label>
              <input
                type="text"
                className={inputClass}
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                placeholder="Enter your country"
              />
            </div>
          </div>

          <div className={`flex justify-end pt-4 border-t ${borderCol}`}>
            <button
              type="submit"
              className="bg-[#a64633] hover:bg-[#c45a45] px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-[#c45a45]/20"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* PASSWORD RESET SECTION */}
        <form onSubmit={updatePassword} className={`${cardBg} p-8 rounded-xl border ${borderCol} shadow-2xl space-y-6`}>
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Change Password</h2>
            <p className={`${mutedText} text-sm mt-1`}>Choose a strong password you haven't used before.</p>
          </div>

          {pwSuccess && (
            <p className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3 rounded-lg">
              {pwSuccess}
            </p>
          )}
          {pwError && (
            <p className="bg-red-500/15 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {pwError}
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Password — full width */}
            <div className="md:col-span-2">
              <label className={`${mutedText} text-xs uppercase tracking-wider mb-1.5 block`}>Current Password</label>
              <input
                type="password"
                className={inputClass}
                value={passwords.current_password}
                onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                placeholder="Enter your current password"
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label className={`${mutedText} text-xs uppercase tracking-wider mb-1.5 block`}>New Password</label>
              <input
                type="password"
                className={inputClass}
                value={passwords.new_password}
                onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                placeholder="Min. 8 characters"
                required
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className={`${mutedText} text-xs uppercase tracking-wider mb-1.5 block`}>Confirm New Password</label>
              <input
                type="password"
                className={`${inputClass} ${
                  passwords.confirm_password && passwords.confirm_password !== passwords.new_password
                    ? "border-red-500/60 focus:border-red-500"
                    : passwords.confirm_password && passwords.confirm_password === passwords.new_password
                    ? "border-emerald-500/60 focus:border-emerald-500"
                    : ""
                }`}
                value={passwords.confirm_password}
                onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                placeholder="Re-enter new password"
                required
              />
              {passwords.confirm_password && passwords.confirm_password !== passwords.new_password && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
              {passwords.confirm_password && passwords.confirm_password === passwords.new_password && (
                <p className="text-emerald-400 text-xs mt-1">Passwords match</p>
              )}
            </div>
          </div>

          <div className={`flex justify-end pt-4 border-t ${borderCol}`}>
            <button
              type="submit"
              className="bg-[#a64633] hover:bg-[#c45a45] px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-[#c45a45]/20"
              disabled={pwLoading}
            >
              {pwLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>

      </div>
    </DashboardLayout>
  );
}

export default Profile;