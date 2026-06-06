import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import Loader from "../MainComponets/Loader";
import {
  FaBan,
  FaUsers,
  FaSearch,
  FaShieldAlt,
  FaTrash,
  FaInfoCircle,
  FaCheckCircle,
  FaUserSlash,
} from "react-icons/fa";

function BlockedAccounts() {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  useEffect(() => {
    const filtered = blockedUsers.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, blockedUsers]);

  const fetchBlockedUsers = async () => {
    try {
      const res = await API.get("investors/");
      const blocked = res.data.filter((user) => user.blocked === true);
      setBlockedUsers(blocked);
      setFilteredUsers(blocked);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const unblockAccount = async (user) => {
    setActionLoading(`unblock-${user.id}`);
    try {
      await API.patch(`investors/${user.id}/`, { blocked: false });
      alert("Account Unblocked Successfully");
      fetchBlockedUsers();
    } catch (error) {
      console.error(error);
      alert("Failed To Unblock Account");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteAccount = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setActionLoading(`delete-${id}`);
    try {
      await API.delete(`investors/${id}/`);
      fetchBlockedUsers();
    } catch (error) {
      console.error(error);
      alert("Failed To Delete Account");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <DashboardLayout>
      <div className="text-white p-5 md:p-7 max-w-7xl mx-auto relative">
        <div className="mb-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center">
                <FaUserSlash className="text-[#c45a45] text-sm" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Blocked Accounts
              </h1>
            </div>
            <p className="text-white/35 text-sm ml-12">
              Review restricted users, restore access, or remove accounts permanently.
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.07] bg-[#0f0e0e] self-start md:self-center">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <FaBan className="text-sm" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">
                Total Blocked
              </p>
              <p className="text-lg font-bold text-white">{blockedUsers.length}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-start gap-3 bg-amber-400/8 border border-amber-400/20 rounded-xl px-4 py-3.5">
          <FaInfoCircle className="text-amber-400 text-sm shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 text-xs font-semibold">
              Restricted Accounts Management
            </p>
            <p className="text-white/40 text-[11px] mt-0.5">
              Search blocked users, restore accounts when needed, or permanently delete records.
            </p>
          </div>
        </div>

        <div className="bg-[#0f0e0e] rounded-2xl border border-white/[0.07] overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/[0.07] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/3">
            <h2 className="text-lg font-semibold tracking-wide text-slate-200 flex items-center gap-2">
              <FaUsers className="text-[#c45a45] text-sm" />
              All Restricted Profiles
            </h2>

            <div className="relative max-w-xs w-full">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#090d16] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#c45a45]/40 transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm text-left">
              <thead>
                <tr className="bg-white/2 text-white/30 uppercase text-[10px] font-semibold tracking-wider border-b border-white/[0.07]">
                  <th className="p-4">Name</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Balance</th>
                  <th className="p-4">Bonus</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-white/3 transition-colors"
                    >
                      <td className="p-4 font-semibold text-slate-100 whitespace-nowrap">
                        {user.name}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <div className="text-slate-300">{user.email}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {user.phone || "No phone linked"}
                        </div>
                      </td>

                      <td className="p-4 font-mono font-medium text-slate-200 whitespace-nowrap">
                        ${Number(user.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      <td className="p-4 font-mono font-medium text-emerald-400 whitespace-nowrap">
                        ${Number(user.bonus || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      <td className="p-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-md text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                          Blocked
                        </span>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => unblockAccount(user)}
                            disabled={actionLoading === `unblock-${user.id}`}
                            title="Unblock User"
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 px-3 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-60 disabled:cursor-wait flex items-center gap-1.5"
                          >
                            <FaShieldAlt className="text-[10px]" />
                            <span className="hidden sm:inline">
                              {actionLoading === `unblock-${user.id}` ? "Unblocking..." : "Unblock"}
                            </span>
                          </button>

                          <button
                            onClick={() => deleteAccount(user.id)}
                            disabled={actionLoading === `delete-${user.id}`}
                            title="Delete User Permanently"
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 px-3 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-60 disabled:cursor-wait flex items-center gap-1.5"
                          >
                            <FaTrash className="text-[10px]" />
                            <span className="hidden sm:inline">
                              {actionLoading === `delete-${user.id}` ? "Deleting..." : "Delete"}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-12 text-white/25">
                      <FaUsers className="text-3xl mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No matching blocked profiles found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default BlockedAccounts;