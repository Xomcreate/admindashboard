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
                activeTab === "users" ? "text-white bg-red-600 shadow-sm" : "text-[#8f9cae] hover:text-white"
              }`}
            >
              Registered Users
            </button>
            <button
              onClick={() => setActiveTab("investors")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md z-10 transition-all duration-300 ${
                activeTab === "investors" ? "text-white bg-red-600 shadow-sm" : "text-[#8f9cae] hover:text-white"
              }`}
            >
              Investors
            </button>
          </div>

          {activeTab === "investors" && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-lg font-semibold transition-all cursor-pointer shadow-md shadow-red-600/10"
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
                <h2 className="text-3xl font-bold text-white tracking-wide">Registered Users</h2>
                <p className="text-[#8f9cae] text-sm mt-1">
                  Manage core platform user registrations and status updates.
                </p>
              </div>
              {/* Rest of slide component content table/list mirrors your implementation */}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default InvestorsAndUsers;