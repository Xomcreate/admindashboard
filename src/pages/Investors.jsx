// src/pages/Investors.jsx

import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import Loader from "../MainComponets/Loader";

function Investors() {
  const [investors, setInvestors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
    try {
      await Promise.all([fetchInvestors(), fetchUsers()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvestors = async () => {
    try {
      const res = await API.get("investors/");
      setInvestors(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("users/");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addInvestor = async (e) => {
    e.preventDefault();
    try {
      await API.post("investors/", form);
      alert("Investor Added Successfully");
      setShowModal(false);
      setForm({ name: "", email: "", phone: "", balance: "", bonus: "", blocked: false });
      fetchInvestors();
    } catch (error) {
      console.log(error);
      alert("Failed To Add Investor");
    }
  };

  // FIX: Use PATCH with only the `blocked` field — avoids email uniqueness
  // validation errors that occurred when sending the full object via PUT.
  const blockUser = async (id) => {
    try {
      await API.patch(`investors/${id}/`, { blocked: true });
      fetchInvestors();
    } catch (error) {
      console.log(error);
      alert("Failed to block investor.");
    }
  };

  const unblockUser = async (id) => {
    try {
      await API.patch(`investors/${id}/`, { blocked: false });
      fetchInvestors();
    } catch (error) {
      console.log(error);
      alert("Failed to unblock investor.");
    }
  };

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <div className="space-y-10 font-sans text-white">

        {/* ─── INVESTORS SECTION ─── */}
        <div className="bg-[#111c44] p-6 rounded-xl border border-[#1e295d] shadow-2xl">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-wide">Investors</h1>
              <p className="text-[#64748b] text-sm mt-1">
                Manage registered investor accounts.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#10b981] hover:bg-[#0d9488] text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
            >
              Add Investor
            </button>
          </div>

          {/* Investors Table */}
          <div className="overflow-x-auto rounded-lg border border-[#1e295d]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#0f1a3e] text-[#94a3b8] uppercase text-xs font-semibold">
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Balance</th>
                  <th className="p-4 text-left">Bonus</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {investors.length > 0 ? (
                  investors.map((investor) => (
                    <tr
                      key={investor.id}
                      className="border-b border-[#1e295d] hover:bg-[#172554] transition-colors"
                    >
                      <td className="p-4">{investor.name}</td>
                      <td className="p-4">{investor.email}</td>
                      <td className="p-4">{investor.phone}</td>
                      <td className="p-4 font-semibold">${investor.balance}</td>
                      <td className="p-4 text-[#10b981] font-semibold">${investor.bonus}</td>
                      <td className="p-4 text-center">
                        {investor.blocked ? (
                          <span className="bg-red-500/15 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-medium">
                            Blocked
                          </span>
                        ) : (
                          <span className="bg-emerald-500/15 text-[#10b981] border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-medium">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {investor.blocked ? (
                          <button
                            onClick={() => unblockUser(investor.id)}
                            className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-semibold px-4 py-1.5 rounded-md transition-all"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => blockUser(investor.id)}
                            className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-semibold px-4 py-1.5 rounded-md transition-all"
                          >
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-[#64748b] italic">
                      No Investors Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


        {/* ─── REGISTERED USERS SECTION ─── */}
        <div className="bg-[#111c44] p-6 rounded-xl border border-[#1e295d] shadow-2xl">

          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-wide">Registered Users</h2>
            <p className="text-[#64748b] text-sm mt-1">
              All Django auth accounts on the platform.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#1e295d]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#0f1a3e] text-[#94a3b8] uppercase text-xs font-semibold">
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Username</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-center">Account Status</th>
                  <th className="p-4 text-left">Date Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[#1e295d] hover:bg-[#172554] transition-colors"
                    >
                      <td className="p-4 font-mono text-[#38bdf8] font-medium">
                        #{user.id}
                      </td>
                      <td className="p-4 font-medium">{user.username}</td>
                      <td className="p-4 text-[#94a3b8]">{user.email || "—"}</td>
                      <td className="p-4 text-center">
                        {user.is_active ? (
                          <span className="bg-emerald-500/15 text-[#10b981] border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="bg-red-500/15 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-medium">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-[#94a3b8]">
                        {new Date(user.date_joined).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-8 text-[#64748b] italic">
                      No Users Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ADD INVESTOR MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#111c44] w-125 p-6 rounded-xl border border-[#1e295d]">
            <h2 className="text-2xl font-bold text-white mb-5">Add Investor</h2>
            <form onSubmit={addInvestor} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="bg-[#0f1a3e] border border-[#1e295d] p-3 rounded text-white placeholder-[#64748b] focus:outline-none focus:border-[#10b981] transition-colors"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="bg-[#0f1a3e] border border-[#1e295d] p-3 rounded text-white placeholder-[#64748b] focus:outline-none focus:border-[#10b981] transition-colors"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                className="bg-[#0f1a3e] border border-[#1e295d] p-3 rounded text-white placeholder-[#64748b] focus:outline-none focus:border-[#10b981] transition-colors"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Balance"
                className="bg-[#0f1a3e] border border-[#1e295d] p-3 rounded text-white placeholder-[#64748b] focus:outline-none focus:border-[#10b981] transition-colors"
                value={form.balance}
                onChange={(e) => setForm({ ...form, balance: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Bonus"
                className="bg-[#0f1a3e] border border-[#1e295d] p-3 rounded text-white placeholder-[#64748b] focus:outline-none focus:border-[#10b981] transition-colors"
                value={form.bonus}
                onChange={(e) => setForm({ ...form, bonus: e.target.value })}
                required
              />
              <div className="col-span-2 flex gap-3 mt-2">
                <button
                  type="submit"
                  className="bg-[#10b981] hover:bg-[#0d9488] flex-1 py-3 rounded font-semibold text-white transition-colors"
                >
                  Save Investor
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-red-600 hover:bg-red-700 flex-1 py-3 rounded font-semibold text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Investors;