// src/pages/Investments.jsx

import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import Loader from "../MainComponets/Loader";

const getStatus = (investment) => {
  const createdAt = new Date(investment.created_at);
  const now = new Date();
  const daysDiff = (now - createdAt) / (1000 * 60 * 60 * 24);

  if (investment.active) return "active";
  if (daysDiff >= 30) return "expired";
  return "inactive";
};

const StatusBadge = ({ investment }) => {
  const status = getStatus(investment);

  if (status === "active") {
    return (
      <span className="bg-[#0b66e4]/15 text-[#0b66e4] border border-[#0b66e4]/30 px-3 py-1 rounded-full text-xs font-medium">
        Active
      </span>
    );
  }

  if (status === "expired") {
    return (
      <span className="bg-orange-500/15 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-medium">
        Expired
      </span>
    );
  }

  return (
    <span className="bg-red-500/15 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-medium">
      Inactive
    </span>
  );
};

function Investments() {
  const [investments, setInvestments] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    investor: "",
    amount: "",
    daily_roi: "",
    active: true,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      await Promise.all([fetchInvestments(), fetchInvestors()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvestments = async () => {
    try {
      const res = await API.get("investments/");
      setInvestments(res.data);
    } catch (error) {
      console.log(error);
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

  const createInvestment = async (e) => {
    e.preventDefault();
    try {
      await API.post("investments/", form);
      alert("Investment Created Successfully");
      setForm({ investor: "", amount: "", daily_roi: "", active: true });
      fetchInvestments();
    } catch (error) {
      console.log(error);
      alert("Failed To Create Investment");
    }
  };

  const deleteInvestment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this investment?")) return;
    try {
      await API.delete(`investments/${id}/`);
      fetchInvestments();
    } catch (error) {
      console.log(error);
    }
  };

  const getInvestorName = (investorId) => {
    const found = investors.find((inv) => inv.id === investorId);
    return found ? found.name : `#${investorId}`;
  };

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <div className="text-white font-sans max-w-6xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold tracking-wide">Investments</h1>
          <p className="text-[#8f9cae] text-sm mt-1">
            Issue new investments and track active market contracts.
          </p>
        </div>

        {/* CREATE INVESTMENT FORM */}
        <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638]">
          <h2 className="text-xl font-semibold mb-5 tracking-wide text-white">
            Create Investment
          </h2>

          <form onSubmit={createInvestment} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">
                Investor
              </label>
              <select
                className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg text-white focus:outline-none focus:border-[#0b66e4] transition-colors cursor-pointer"
                value={form.investor}
                onChange={(e) => setForm({ ...form, investor: e.target.value })}
                required
              >
                <option value="" className="bg-[#121824]">Select Investor</option>
                {investors.map((investor) => (
                  <option key={investor.id} value={investor.id} className="bg-[#121824]">
                    {investor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">
                Investment Amount ($)
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg text-white placeholder-[#8f9cae] focus:outline-none focus:border-[#0b66e4] transition-colors"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">
                Daily ROI %
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 2.5"
                className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg text-white placeholder-[#8f9cae] focus:outline-none focus:border-[#0b66e4] transition-colors"
                value={form.daily_roi}
                onChange={(e) => setForm({ ...form, daily_roi: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">
                Initial Status
              </label>
              <select
                className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg text-white focus:outline-none focus:border-[#0b66e4] transition-colors cursor-pointer"
                value={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.value === "true" })}
              >
                <option value="true" className="bg-[#121824]">Active</option>
                <option value="false" className="bg-[#121824]">Inactive</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-[#0b66e4] hover:bg-[#0055cc] text-white p-3 rounded-lg font-semibold tracking-wide transition-all duration-200 col-span-1 md:col-span-2 mt-2 cursor-pointer"
            >
              Create New Contract
            </button>
          </form>
        </div>

        {/* INVESTMENTS TABLE */}
        <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638]">
          <h2 className="text-xl font-semibold mb-5 tracking-wide text-white">
            All Investments
          </h2>

          <div className="overflow-x-auto rounded-lg border border-[#1e2638]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#090d16] text-[#8f9cae] uppercase text-xs font-semibold tracking-wider">
                  <th className="p-4 text-left border-b border-[#1e2638]">Investor</th>
                  <th className="p-4 text-left border-b border-[#1e2638]">Amount</th>
                  <th className="p-4 text-left border-b border-[#1e2638]">Daily ROI</th>
                  <th className="p-4 text-left border-b border-[#1e2638]">Profit</th>
                  <th className="p-4 text-center border-b border-[#1e2638]">Status</th>
                  <th className="p-4 text-left border-b border-[#1e2638]">Date Issued</th>
                  <th className="p-4 text-center border-b border-[#1e2638]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {investments.length > 0 ? (
                  investments.map((investment) => (
                    <tr
                      key={investment.id}
                      className="border-b border-[#1e2638] hover:bg-[#1e2638]/50 transition-colors"
                    >
                      <td className="p-4 font-medium text-white">
                        {getInvestorName(investment.investor)}
                      </td>
                      <td className="p-4 font-semibold text-white">
                        ${Number(investment.amount).toLocaleString()}
                      </td>
                      <td className="p-4 font-semibold text-[#10b981]">
                        {investment.daily_roi}%
                      </td>
                      <td className="p-4 font-semibold text-[#0b66e4]">
                        ${Number(investment.current_profit).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-4 text-center">
                        <StatusBadge investment={investment} />
                      </td>
                      <td className="p-4 text-[#8f9cae]">
                        {new Date(investment.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => deleteInvestment(investment.id)}
                          className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-semibold px-4 py-1.5 rounded-md transition-all cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-[#8f9cae] italic bg-[#090d16]/50">
                      No Investments Found
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

export default Investments;