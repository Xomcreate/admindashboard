import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import Loader from "../MainComponets/Loader";

const STOCK_CATEGORIES = [
  "Tesla (TSLA)",
  "Apple (AAPL)",
  "Amazon (AMZN)",
  "McDonald's (MCD)",
  "GameStop (GME)",
  "Coca-Cola (KO)",
  "Meta (META)",
  "Alphabet (GOOG)",
  "Netflix (NFLX)",
  "Intel (INTC)",
];

const getStatus = (investment) => {
  if (!investment.approved) return "pending";
  if (investment.active)    return "active";
  return "expired";
};

const StatusBadge = ({ investment }) => {
  const s = getStatus(investment);
  if (s === "active")
    return <span className="bg-[#0b66e4]/15 text-[#0b66e4] border border-[#0b66e4]/30 px-3 py-1 rounded-full text-xs font-medium">Active</span>;
  if (s === "pending")
    return <span className="bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-medium">Pending</span>;
  return <span className="bg-orange-500/15 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-medium">Expired</span>;
};

function Investments() {
  const [investments, setInvestments] = useState([]);
  const [investors,   setInvestors]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [tab,         setTab]         = useState("all");
  const [form, setForm] = useState({
    investor: "", amount: "", category: "Tesla (TSLA)", active: true,
  });

  useEffect(() => { fetchAll(); }, []);

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
    } catch (e) { console.error(e); }
  };

  const fetchInvestors = async () => {
    try {
      const res = await API.get("investors/");
      setInvestors(res.data);
    } catch (e) { console.error(e); }
  };

  const createInvestment = async (e) => {
    e.preventDefault();
    try {
      await API.post("investments/", {
        investor: form.investor,
        amount:   form.amount,
        category: form.category,
      });
      alert("Investment Created Successfully");
      setForm({ investor: "", amount: "", category: "Tesla (TSLA)", active: true });
      fetchInvestments();
    } catch (err) {
      const msg = err.response?.data?.amount?.[0] || "Failed to create investment";
      alert(msg);
    }
  };

  const approveInvestment = async (id) => {
    try {
      await API.post(`investments/${id}/approve/`);
      fetchInvestments();
    } catch (e) {
      alert("Failed to approve.");
    }
  };

  const deleteInvestment = async (id) => {
    if (!window.confirm("Delete this investment?")) return;
    try {
      await API.delete(`investments/${id}/`);
      fetchInvestments();
    } catch (e) { console.error(e); }
  };

  const getInvestorName = (id) => {
    const found = investors.find((inv) => inv.id === id);
    return found ? found.name : `#${id}`;
  };

  const pendingList  = investments.filter((i) => !i.approved);
  const displayList  = tab === "pending" ? pendingList : investments;

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <div className="text-white font-sans max-w-6xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold tracking-wide">Investments</h1>
          <p className="text-[#8f9cae] text-sm mt-1">
            Manage and approve investment contracts. All plans earn 10% daily ROI for 14 days.
          </p>
        </div>

        {/* CREATE FORM */}
        <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638]">
          <h2 className="text-xl font-semibold mb-5 text-white">Create Investment</h2>
          <form onSubmit={createInvestment} className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">Investor</label>
              <select
                className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg text-white focus:outline-none focus:border-[#0b66e4] transition-colors cursor-pointer"
                value={form.investor}
                onChange={(e) => setForm({ ...form, investor: e.target.value })}
                required
              >
                <option value="">Select Investor</option>
                {investors.map((inv) => (
                  <option key={inv.id} value={inv.id}>{inv.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">Category</label>
              <select
                className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg text-white focus:outline-none focus:border-[#0b66e4] transition-colors cursor-pointer"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {STOCK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">
                Amount ($100 – $500)
              </label>
              <input
                type="number"
                placeholder="100.00"
                min="100"
                max="500"
                step="0.01"
                className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg text-white placeholder-[#8f9cae] focus:outline-none focus:border-[#0b66e4] transition-colors"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>

            {/* ROI preview — always 10% */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">
                Daily ROI (all plans)
              </label>
              <div className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg flex items-center justify-between">
                <span className="text-[#8f9cae] text-sm">Flat rate · 14-day duration</span>
                <span className="text-[#10b981] font-bold text-lg">10%</span>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#0b66e4] hover:bg-[#0055cc] text-white p-3 rounded-lg font-semibold tracking-wide transition-all duration-200 col-span-1 md:col-span-2 mt-2 cursor-pointer"
            >
              Create & Activate Contract
            </button>
          </form>
        </div>

        {/* TABS */}
        <div className="flex gap-3">
          {["all", "pending"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                tab === t
                  ? "bg-[#0b66e4] text-white"
                  : "bg-[#121824] border border-[#1e2638] text-[#8f9cae] hover:border-[#0b66e4]/50"
              }`}
            >
              {t === "all" ? `All Investments (${investments.length})` : `Pending Approval (${pendingList.length})`}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638]">
          <div className="overflow-x-auto rounded-lg border border-[#1e2638]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#090d16] text-[#8f9cae] uppercase text-xs font-semibold tracking-wider">
                  <th className="p-4 text-left border-b border-[#1e2638]">Investor</th>
                  <th className="p-4 text-left border-b border-[#1e2638]">Category</th>
                  <th className="p-4 text-left border-b border-[#1e2638]">Amount</th>
                  <th className="p-4 text-left border-b border-[#1e2638]">Daily ROI</th>
                  <th className="p-4 text-left border-b border-[#1e2638]">Profit</th>
                  <th className="p-4 text-center border-b border-[#1e2638]">Status</th>
                  <th className="p-4 text-left border-b border-[#1e2638]">Date</th>
                  <th className="p-4 text-center border-b border-[#1e2638]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayList.length > 0 ? displayList.map((inv) => (
                  <tr key={inv.id} className="border-b border-[#1e2638] hover:bg-[#1e2638]/50 transition-colors">
                    <td className="p-4 font-medium text-white">{getInvestorName(inv.investor)}</td>
                    <td className="p-4 text-[#8f9cae]">{inv.category}</td>
                    <td className="p-4 font-semibold text-white">${Number(inv.amount).toLocaleString()}</td>
                    <td className="p-4 font-semibold text-[#10b981]">{inv.daily_roi}%</td>
                    <td className="p-4 font-semibold text-[#0b66e4]">
                      ${Number(inv.current_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-center"><StatusBadge investment={inv} /></td>
                    <td className="p-4 text-[#8f9cae]">
                      {new Date(inv.created_at).toLocaleDateString(undefined, {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {!inv.approved && (
                          <button
                            onClick={() => approveInvestment(inv.id)}
                            className="bg-[#10b981]/15 hover:bg-[#10b981] text-[#10b981] hover:text-white border border-[#10b981]/30 text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => deleteInvestment(inv.id)}
                          className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="text-center p-8 text-[#8f9cae] italic bg-[#090d16]/50">
                      {tab === "pending" ? "No pending investments" : "No investments found"}
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