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
        name: "",
        email: "",
        phone: "",
        balance: "",
        bonus: "",
        blocked: false,
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
      <div className="space-y-10 font-sans text-white">

        {/* INVESTORS */}
        <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638]">

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Investors</h1>
              <p className="text-[#8f9cae] text-sm mt-1">
                Manage registered investor accounts.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-[#0b66e4] hover:bg-[#0055cc] px-5 py-2.5 rounded-lg font-semibold"
            >
              Add Investor
            </button>
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
                {investors.length ? investors.map((inv) => (
                  <tr key={inv.id} className="border-b border-[#1e2638] hover:bg-[#1e2638]/50">

                    <td className="p-4">{inv.name}</td>
                    <td className="p-4 text-[#8f9cae]">{inv.email}</td>
                    <td className="p-4 text-[#8f9cae]">{inv.phone}</td>

                    <td className="p-4 font-semibold">
                      ${Number(inv.balance || 0).toLocaleString()}
                    </td>

                    <td className="p-4 text-[#10b981] font-semibold">
                      ${Number(inv.bonus || 0).toLocaleString()}
                    </td>

                    <td className="p-4 text-center">
                      {inv.blocked ? (
                        <span className="bg-red-500/15 text-red-400 px-3 py-1 rounded-full text-xs">
                          Blocked
                        </span>
                      ) : (
                        <span className="bg-blue-500/15 text-blue-400 px-3 py-1 rounded-full text-xs">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center flex gap-2 justify-center">
                      {inv.blocked ? (
                        <button onClick={() => unblockUser(inv.id)} className="text-blue-400">
                          Unblock
                        </button>
                      ) : (
                        <button onClick={() => blockUser(inv.id)} className="text-red-400">
                          Block
                        </button>
                      )}

                      <button
                        onClick={() => deleteInvestor(inv.id, inv.name)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                )) : (
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

        {/* USERS */}
        <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638]">
          <h2 className="text-2xl font-bold mb-4">Registered Users</h2>

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
                {users.length ? users.map((u) => (
                  <tr key={u.id} className="border-b border-[#1e2638] hover:bg-[#1e2638]/50">

                    <td className="p-4 text-blue-400">#{u.id}</td>
                    <td className="p-4">{u.username}</td>
                    <td className="p-4 text-[#8f9cae]">{u.email || "—"}</td>

                    <td className="p-4 text-center">
                      {u.is_active ? (
                        <span className="text-blue-400">Active</span>
                      ) : (
                        <span className="text-red-400">Inactive</span>
                      )}
                    </td>

                    <td className="p-4 text-[#8f9cae]">
                      {new Date(u.date_joined).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteUser(u.id, u.username)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                )) : (
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

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#121824] w-full max-w-xl p-6 rounded-xl border border-[#1e2638]">

            <h2 className="text-2xl font-bold mb-4">Add Investor</h2>

            <form onSubmit={addInvestor} className="grid grid-cols-2 gap-4">

              <input placeholder="Name" className="p-3 bg-[#090d16] border border-[#1e2638] rounded"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

              <input placeholder="Email" className="p-3 bg-[#090d16] border border-[#1e2638] rounded"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

              <input placeholder="Phone" className="p-3 bg-[#090d16] border border-[#1e2638] rounded"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

              <input type="number" placeholder="Balance" className="p-3 bg-[#090d16] border border-[#1e2638] rounded"
                value={form.balance} onChange={e => setForm({ ...form, balance: e.target.value })} />

              <input type="number" placeholder="Bonus" className="p-3 bg-[#090d16] border border-[#1e2638] rounded"
                value={form.bonus} onChange={e => setForm({ ...form, bonus: e.target.value })} />

              <div className="col-span-2 flex gap-3 mt-2">
                <button className="bg-blue-600 flex-1 py-3 rounded">Save</button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="bg-red-600 flex-1 py-3 rounded">
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