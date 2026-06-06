import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import Loader from "../MainComponets/Loader";

function InvestorsAndUsers() {
  const [investors, setInvestors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [activeTab, setActiveTab] = useState("users");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    balance: "",
    bonus: "",
    blocked: false,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchInvestors(), fetchUsers()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvestors = async () => {
    try {
      const res = await API.get("investors/");
      setInvestors(res.data || []);
    } catch (error) {
      console.error("Investors fetch error:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("users/");
      setUsers(res.data || []);
    } catch (error) {
      console.error("Users fetch error:", error);
    }
  };

  const addInvestor = async (e) => {
    e.preventDefault();
    try {
      await API.post("investors/", {
        ...form,
        balance: Number(form.balance),
        bonus: Number(form.bonus),
      });

      alert("Investor Added Successfully");
      setShowModal(false);
      setForm({
        name: "", email: "", phone: "", balance: "", bonus: "", blocked: false,
      });
      fetchInvestors();
    } catch (error) {
      console.error(error);
      alert("Failed To Add Investor");
    }
  };

  const blockUser = async (id) => {
    try {
      await API.patch(`investors/${id}/`, { blocked: true });
      fetchInvestors();
    } catch (error) {
      console.error(error);
      alert("Failed to block investor.");
    }
  };

  const unblockUser = async (id) => {
    try {
      await API.patch(`investors/${id}/`, { blocked: false });
      fetchInvestors();
    } catch (error) {
      console.error(error);
      alert("Failed to unblock investor.");
    }
  };

  const deleteInvestor = async (id, name) => {
    if (!window.confirm(`Delete investor "${name}"? This cannot be undone.`)) return;
    try {
      await API.delete(`investors/${id}/`);
      fetchInvestors();
    } catch (error) {
      console.error(error);
      alert("Failed to delete investor.");
    }
  };

  const deleteUser = async (id, username) => {
    if (!window.confirm(`Delete user "${username}"? This is irreversible.`)) return;
    try {
      await API.delete(`users/${id}/delete/`);
      fetchAll();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Failed to delete user.");
    }
  };

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans text-white max-w-6xl mx-auto">
        
        {/* TOP BANNER CONTROLS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-[#121111] p-4 rounded-xl border border-[#242020]">
          <div className="flex bg-[#0e0d0d] p-1 rounded-lg border border-[#242020] w-64 relative">
            <button 
              onClick={() => setActiveTab("users")}
              className={`flex-1 py-2 text-xs font-semibold rounded-md tracking-wide transition-all ${
                activeTab === "users" ? "bg-[#c45a45] text-white" : "text-[#9e9593] hover:text-white"
              }`}
            >
              System Users ({users.length})
            </button>
            <button 
              onClick={() => setActiveTab("investors")}
              className={`flex-1 py-2 text-xs font-semibold rounded-md tracking-wide transition-all ${
                activeTab === "investors" ? "bg-[#c45a45] text-white" : "text-[#9e9593] hover:text-white"
              }`}
            >
              Investors ({investors.length})
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#c45a45] hover:bg-[#a64633] text-white px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-200 cursor-pointer shadow-[0_0_14px_rgba(196,90,69,0.15)]"
          >
            + Add New Investor
          </button>
        </div>

        {/* DATA TABLES CONTENT */}
        <div className="bg-[#121111] p-6 rounded-xl border border-[#242020]">
          <h2 className="text-xl font-semibold mb-4 tracking-wide capitalize text-white">
            {activeTab === "users" ? "Registered System Accounts" : "Active Profiles & Capital"}
          </h2>

          <div className="overflow-x-auto rounded-lg border border-[#242020]">
            <table className="w-full border-collapse text-sm">
              {activeTab === "users" ? (
                <>
                  <thead>
                    <tr className="bg-[#0e0d0d] text-[#9e9593] uppercase text-xs font-semibold tracking-wider">
                      <th className="p-4 text-left border-b border-[#242020]">ID</th>
                      <th className="p-4 text-left border-b border-[#242020]">Username</th>
                      <th className="p-4 text-left border-b border-[#242020]">Email Address</th>
                      <th className="p-4 text-center border-b border-[#242020]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? users.map((user) => (
                      <tr key={user.id} className="border-b border-[#242020] hover:bg-[#242020]/30 transition-colors">
                        <td className="p-4 text-[#9e9593]">#{user.id}</td>
                        <td className="p-4 font-semibold text-white">{user.username}</td>
                        <td className="p-4 text-[#9e9593]">{user.email || "—"}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => deleteUser(user.id, user.username)}
                            className="bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer"
                          >
                            Delete Account
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="text-center p-8 text-[#9e9593] italic bg-[#0e0d0d]/50">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </>
              ) : (
                <>
                  <thead>
                    <tr className="bg-[#0e0d0d] text-[#9e9593] uppercase text-xs font-semibold tracking-wider">
                      <th className="p-4 text-left border-b border-[#242020]">Investor</th>
                      <th className="p-4 text-left border-b border-[#242020]">Contact Details</th>
                      <th className="p-4 text-left border-b border-[#242020]">Main Balance</th>
                      <th className="p-4 text-left border-b border-[#242020]">Total Bonus</th>
                      <th className="p-4 text-center border-b border-[#242020]">Status</th>
                      <th className="p-4 text-center border-b border-[#242020]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investors.length > 0 ? investors.map((inv) => (
                      <tr key={inv.id} className="border-b border-[#242020] hover:bg-[#242020]/30 transition-colors">
                        <td className="p-4 font-semibold text-white">{inv.name}</td>
                        <td className="p-4">
                          <div className="flex flex-col text-xs gap-0.5">
                            <span className="text-white">{inv.email}</span>
                            <span className="text-[#9e9593]">{inv.phone || "No phone added"}</span>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-white">
                          ${Number(inv.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 font-semibold text-emerald-400">
                          ${Number(inv.bonus).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-center">
                          {inv.blocked ? (
                            <span className="bg-red-500/15 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-medium inline-block w-20">Blocked</span>
                          ) : (
                            <span className="bg-[#c45a45]/15 text-[#c45a45] border border-[#c45a45]/30 px-3 py-1 rounded-full text-xs font-medium inline-block w-20">Active</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex gap-2 justify-center items-center">
                            {inv.blocked ? (
                              <button
                                onClick={() => unblockUser(inv.id)}
                                className="bg-[#c45a45]/15 hover:bg-[#c45a45] text-[#c45a45] hover:text-white border border-[#c45a45]/30 text-xs px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                              >
                                Unblock
                              </button>
                            ) : (
                              <button
                                onClick={() => blockUser(inv.id)}
                                className="bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-white border border-amber-500/20 text-xs px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                              >
                                Block
                              </button>
                            )}
                            <button
                              onClick={() => deleteInvestor(inv.id, inv.name)}
                              className="bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 text-xs px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="text-center p-8 text-[#9e9593] italic bg-[#0e0d0d]/50">No investors found.</td>
                      </tr>
                    )}
                  </tbody>
                </>
              )}
            </table>
          </div>
        </div>

        {/* CREATE PROFILE DIALOG FORM (MODAL) */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-xs">
            <div className="bg-[#121111] border border-[#242020] w-full max-w-lg p-6 rounded-xl shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">Register New Investor</h3>
                <p className="text-[#9e9593] text-xs mt-0.5">Setup direct base account attributes, balance allocations, and statuses.</p>
              </div>

              <form onSubmit={addInvestor} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#9e9593] uppercase tracking-wider">Full Legal Name</label>
                  <input
                    type="text" required placeholder="John Doe"
                    className="bg-[#0e0d0d] border border-[#242020] p-3 rounded-lg text-white placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45]"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#9e9593] uppercase tracking-wider">Email Address</label>
                  <input
                    type="email" required placeholder="johndoe@example.com"
                    className="bg-[#0e0d0d] border border-[#242020] p-3 rounded-lg text-white placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45]"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#9e9593] uppercase tracking-wider">Phone Line</label>
                  <input
                    type="text" placeholder="+1 (555) 000-0000"
                    className="bg-[#0e0d0d] border border-[#242020] p-3 rounded-lg text-white placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45]"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#9e9593] uppercase tracking-wider">Opening Capital Balance ($)</label>
                  <input
                    type="number" required min="0" step="0.01" placeholder="0.00"
                    className="bg-[#0e0d0d] border border-[#242020] p-3 rounded-lg text-white placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45]"
                    value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#9e9593] uppercase tracking-wider">Initial Sign-up Bonus ($)</label>
                  <input
                    type="number" required min="0" step="0.01" placeholder="0.00"
                    className="bg-[#0e0d0d] border border-[#242020] p-3 rounded-lg text-white placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45]"
                    value={form.bonus} onChange={(e) => setForm({ ...form, bonus: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3 bg-[#0e0d0d] border border-[#242020] p-3 rounded-lg mt-1">
                  <input
                    type="checkbox" id="blocked-status" className="w-4 h-4 accent-[#c45a45] cursor-pointer"
                    checked={form.blocked} onChange={(e) => setForm({ ...form, blocked: e.target.checked })}
                  />
                  <label htmlFor="blocked-status" className="text-xs font-semibold text-[#9e9593] cursor-pointer selection:bg-transparent">
                    Restrict profile initialization (Create as Blocked account status)
                  </label>
                </div>

                <div className="sm:col-span-2 flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-[#c45a45] hover:bg-[#a64633] text-white flex-1 py-3 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Save Investor
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-[#242020] hover:bg-[#2d2929] text-white flex-1 py-3 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default InvestorsAndUsers;