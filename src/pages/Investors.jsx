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
      <div className="space-y-6 font-sans text-white">
        
        {/* SLIDE NAVIGATION CONTROLS */}
        <div className="flex justify-between items-center bg-[#121824] p-4 rounded-xl border border-[#1e2638]">
          <div className="flex bg-[#090d16] p-1.5 rounded-lg border border-[#1e2638] relative w-72">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md z-10 transition-all duration-300 ${
                activeTab === "users" ? "text-white bg-pink-500 shadow-sm" : "text-[#8f9cae] hover:text-white"
              }`}
            >
              Registered Users
            </button>
            <button
              onClick={() => setActiveTab("investors")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md z-10 transition-all duration-300 ${
                activeTab === "investors" ? "text-white bg-pink-500 shadow-sm" : "text-[#8f9cae] hover:text-white"
              }`}
            >
              Investors
            </button>
          </div>

          {activeTab === "investors" && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-5 py-2.5 rounded-lg font-semibold transition-all cursor-pointer shadow-md shadow-pink-500/10"
            >
              Add Investor
            </button>
          )}
        </div>

        {/* SLIDES CONTENT CONTAINER */}
        <div className="relative overflow-hidden min-h-100">
          
          {/* SLIDE 1: REGISTERED USERS */}
          {activeTab === "users" && (
            <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638]">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-lineat-to-r from-pink-400 to-purple-400">Registered Users</h2>
                <p className="text-[#8f9cae] text-sm mt-1">
                  Manage core platform user registrations and status updates.
                </p>
              </div>

              <div className="overflow-x-auto border border-[#1e2638] rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#090d16] text-[#8f9cae] text-xs uppercase">
                      <th className="p-4 text-left">ID</th>
                      <th className="p-4 text-left">Username</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-left">Joined</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.length ? (
                      users.map((u) => (
                        <tr key={u.id} className="border-b border-[#1e2638] hover:bg-[#1e2638]/50">
                          <td className="p-4 text-pink-400 font-medium">#{u.id}</td>
                          <td className="p-4">{u.username}</td>
                          <td className="p-4 text-[#8f9cae]">{u.email || "—"}</td>
                          <td className="p-4 text-center">
                            {u.is_active ? (
                              <span className="bg-purple-500/15 text-purple-300 px-3 py-1 rounded-full text-xs border border-purple-500/20">
                                Active
                              </span>
                            ) : (
                              <span className="bg-red-500/15 text-red-400 px-3 py-1 rounded-full text-xs">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-[#8f9cae]">
                            {new Date(u.date_joined).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => deleteUser(u.id, u.username)}
                              className="text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center p-6 text-[#8f9cae]">
                          No Users Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SLIDE 2: INVESTORS */}
          {activeTab === "investors" && (
            <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638]">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-purple-400">Investors</h1>
                <p className="text-[#8f9cae] text-sm mt-1">
                  Manage registered investor accounts, balances, and bonuses.
                </p>
              </div>

              <div className="overflow-x-auto rounded-lg border border-[#1e2638]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#090d16] text-[#8f9cae] text-xs uppercase">
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
                    {investors.length ? (
                      investors.map((inv) => (
                        <tr key={inv.id} className="border-b border-[#1e2638] hover:bg-[#1e2638]/50">
                          <td className="p-4">{inv.name}</td>
                          <td className="p-4 text-[#8f9cae]">{inv.email}</td>
                          <td className="p-4 text-[#8f9cae]">{inv.phone}</td>
                          <td className="p-4 font-semibold text-white">
                            ${Number(inv.balance || 0).toLocaleString()}
                          </td>
                          <td className="p-4 text-teal-400 font-semibold">
                            ${Number(inv.bonus || 0).toLocaleString()}
                          </td>
                          <td className="p-4 text-center">
                            {inv.blocked ? (
                              <span className="bg-red-500/15 text-red-400 px-3 py-1 rounded-full text-xs">
                                Blocked
                              </span>
                            ) : (
                              <span className="bg-purple-500/15 text-purple-300 px-3 py-1 rounded-full text-xs border border-purple-500/20">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center flex gap-4 justify-center">
                            {inv.blocked ? (
                              <button onClick={() => unblockUser(inv.id)} className="text-purple-400 hover:text-purple-300 hover:underline cursor-pointer">
                                Unblock
                              </button>
                            ) : (
                              <button onClick={() => blockUser(inv.id)} className="text-red-400 hover:text-red-300 hover:underline cursor-pointer">
                                Block
                              </button>
                            )}
                            <button
                              onClick={() => deleteInvestor(inv.id, inv.name)}
                              className="text-red-500 hover:text-red-400 hover:underline cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center p-6 text-[#8f9cae]">
                          No Investors Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}

export default InvestorsAndUsers;