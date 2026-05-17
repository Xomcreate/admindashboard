import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

const Dashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("dashboard-stats/");
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="text-white font-sans max-w-6xl mx-auto">
        
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-wide">
            Dashboard Statistics
          </h1>
          <p className="text-[#64748b] text-sm mt-1">
            Real-time overview of system activities, capital, and user states.
          </p>
        </div>

        {/* METRICS GRID - Fully responsive breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* TOTAL USERS */}
          <div className="bg-[#111c44] border border-[#1e295d] p-6 rounded-xl shadow-xl transition-all duration-300 hover:border-slate-700">
            <h2 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
              Total Users
            </h2>
            <p className="text-3xl font-bold mt-3 text-slate-100 tracking-tight">
              {stats.users || 0}
            </p>
          </div>

          {/* TOTAL INVESTMENTS - Emerald Growth Accent */}
          <div className="bg-[#111c44] border border-[#1e295d] p-6 rounded-xl shadow-[inset_0_0_12px_rgba(16,185,129,0.02)] transition-all duration-300 hover:border-[#10b981]/50">
            <h2 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
              Total Investments
            </h2>
            <p className="text-3xl font-bold mt-3 text-[#10b981] tracking-tight">
              ${stats.investments ? Number(stats.investments).toLocaleString() : "0.00"}
            </p>
          </div>

          {/* TOTAL WITHDRAWALS - Clean White Highlight */}
          <div className="bg-[#111c44] border border-[#1e295d] p-6 rounded-xl shadow-xl transition-all duration-300 hover:border-slate-700">
            <h2 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
              Total Withdrawals
            </h2>
            <p className="text-3xl font-bold mt-3 text-white tracking-tight">
              ${stats.withdrawals ? Number(stats.withdrawals).toLocaleString() : "0.00"}
            </p>
          </div>

          {/* BLOCKED USERS - Warning Red Accent */}
          <div className="bg-[#111c44] border border-[#1e295d] p-6 rounded-xl shadow-xl transition-all duration-300 hover:border-red-500/30">
            <h2 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
              Blocked Users
            </h2>
            <p className="text-3xl font-bold mt-3 text-red-400 tracking-tight">
              {stats.blocked_users || 0}
            </p>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;