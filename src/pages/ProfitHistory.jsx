import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  FaHistory,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaWallet,
  FaCalendarAlt,
  FaFilter,
  FaDownload,
  FaSearch,
  FaRobot,
  FaExchangeAlt,
  FaBolt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

const transactions = [
  { id: 1, type: "profit", source: "AI Bot", name: "CryptoSurge AI", amount: "+$284.50", date: "Jun 5, 2026", time: "14:32", status: "completed", market: "Crypto", icon: <FaRobot /> },
  { id: 2, type: "profit", source: "Copy Trade", name: "Sofia Chen", amount: "+$193.20", date: "Jun 5, 2026", time: "11:07", status: "completed", market: "Stocks", icon: <FaExchangeAlt /> },
  { id: 3, type: "loss", source: "AI Bot", name: "Apex Scalper", amount: "-$42.00", date: "Jun 4, 2026", time: "19:45", status: "completed", market: "Forex", icon: <FaRobot /> },
  { id: 4, type: "profit", source: "Copy Trade", name: "Elena Kovacs", amount: "+$510.00", date: "Jun 4, 2026", time: "16:20", status: "completed", market: "Indices", icon: <FaExchangeAlt /> },
  { id: 5, type: "profit", source: "AI Bot", name: "GridMaster Pro", amount: "+$97.80", date: "Jun 3, 2026", time: "09:15", status: "completed", market: "Indices", icon: <FaRobot /> },
  { id: 6, type: "loss", source: "Copy Trade", name: "Marcus Webb", amount: "-$118.40", date: "Jun 3, 2026", time: "08:02", status: "completed", market: "Crypto", icon: <FaExchangeAlt /> },
  { id: 7, type: "profit", source: "AI Bot", name: "Nexus Arbitrage", amount: "+$340.60", date: "Jun 2, 2026", time: "22:50", status: "completed", market: "Multi", icon: <FaRobot /> },
  { id: 8, type: "profit", source: "Plan", name: "Growth Plan", amount: "+$750.00", date: "Jun 2, 2026", time: "12:00", status: "completed", market: "Mixed", icon: <FaChartLine /> },
  { id: 9, type: "pending", source: "AI Bot", name: "Sentinel Swing", amount: "+$205.00", date: "Jun 1, 2026", time: "18:33", status: "pending", market: "Stocks", icon: <FaRobot /> },
  { id: 10, type: "loss", source: "Copy Trade", name: "Raj Patel", amount: "-$67.10", date: "Jun 1, 2026", time: "10:44", status: "completed", market: "Futures", icon: <FaExchangeAlt /> },
  { id: 11, type: "profit", source: "Plan", name: "Starter Plan", amount: "+$120.00", date: "May 31, 2026", time: "12:00", status: "completed", market: "Mixed", icon: <FaChartLine /> },
  { id: 12, type: "profit", source: "AI Bot", name: "CryptoSurge AI", amount: "+$398.90", date: "May 30, 2026", time: "20:17", status: "completed", market: "Crypto", icon: <FaRobot /> },
];

const statusConfig = {
  completed: { label: "Completed", icon: <FaCheckCircle />, className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  pending: { label: "Pending", icon: <FaClock />, className: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  failed: { label: "Failed", icon: <FaTimesCircle />, className: "text-red-400 bg-red-400/10 border-red-400/20" },
};

const sourceColors = {
  "AI Bot": { bg: "bg-[#c45a45]/12", border: "border-[#c45a45]/25", text: "text-[#c45a45]" },
  "Copy Trade": { bg: "bg-[#5a8fc4]/12", border: "border-[#5a8fc4]/25", text: "text-[#5a8fc4]" },
  "Plan": { bg: "bg-[#4db89b]/12", border: "border-[#4db89b]/25", text: "text-[#4db89b]" },
};

const months = ["All Time", "Jun 2026", "May 2026", "Apr 2026"];

export default function ProfitHistory() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterMonth, setFilterMonth] = useState("All Time");

  const typeFilters = ["All", "Profits", "Losses", "Pending"];

  const filtered = transactions.filter((tx) => {
    const matchSearch =
      tx.name.toLowerCase().includes(search.toLowerCase()) ||
      tx.source.toLowerCase().includes(search.toLowerCase()) ||
      tx.market.toLowerCase().includes(search.toLowerCase());
    const matchType =
      filterType === "All" ||
      (filterType === "Profits" && tx.type === "profit") ||
      (filterType === "Losses" && tx.type === "loss") ||
      (filterType === "Pending" && tx.type === "pending");
    const matchMonth =
      filterMonth === "All Time" || tx.date.startsWith(filterMonth.split(" ")[0]);
    return matchSearch && matchType && matchMonth;
  });

  const totalProfit = transactions
    .filter((t) => t.type === "profit")
    .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.]/g, "")), 0);
  const totalLoss = transactions
    .filter((t) => t.type === "loss")
    .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.]/g, "")), 0);
  const net = totalProfit - totalLoss;
  const winRate = Math.round(
    (transactions.filter((t) => t.type === "profit").length /
      transactions.filter((t) => t.type !== "pending").length) *
      100
  );

  return (
    <DashboardLayout>
      <div className="text-white p-5 md:p-7 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center">
              <FaHistory className="text-[#c45a45] text-sm" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Profit History</h1>
          </div>
          <p className="text-white/35 text-sm ml-12">Track all your earnings and trading activity.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          {[
            {
              label: "Total Earned",
              value: `+$${totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
              sub: `${transactions.filter((t) => t.type === "profit").length} trades`,
              color: "text-emerald-400",
              icon: <FaArrowUp />,
              iconBg: "bg-emerald-400/10 border-emerald-400/20",
              iconColor: "text-emerald-400",
            },
            {
              label: "Total Loss",
              value: `-$${totalLoss.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
              sub: `${transactions.filter((t) => t.type === "loss").length} trades`,
              color: "text-red-400",
              icon: <FaArrowDown />,
              iconBg: "bg-red-400/10 border-red-400/20",
              iconColor: "text-red-400",
            },
            {
              label: "Net P&L",
              value: `+$${net.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
              sub: "All time",
              color: "text-white",
              icon: <FaWallet />,
              iconBg: "bg-[#c45a45]/12 border-[#c45a45]/25",
              iconColor: "text-[#c45a45]",
            },
            {
              label: "Win Rate",
              value: `${winRate}%`,
              sub: `${transactions.filter((t) => t.type !== "pending").length} total trades`,
              color: "text-white",
              icon: <FaBolt />,
              iconBg: "bg-[#c45a45]/12 border-[#c45a45]/25",
              iconColor: "text-[#c45a45]",
            },
          ].map((s) => (
            <div key={s.label} className="bg-[#0f0e0e] border border-white/[0.07] rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-white/35 text-[11px] uppercase tracking-widest">{s.label}</p>
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-[11px] ${s.iconBg} ${s.iconColor}`}>
                  {s.icon}
                </div>
              </div>
              <div>
                <p className={`text-xl font-bold leading-none ${s.color}`}>{s.value}</p>
                <p className="text-white/25 text-[11px] mt-1">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs" />
            <input
              type="text"
              placeholder="Search by name, source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0f0e0e] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#c45a45]/40 transition-colors"
            />
          </div>

          {/* Type filters */}
          <div className="flex gap-2 flex-wrap">
            {typeFilters.map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-150 ${
                  filterType === f
                    ? "bg-[#c45a45]/15 border-[#c45a45]/35 text-white"
                    : "bg-transparent border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Month select */}
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="bg-[#0f0e0e] border border-white/10 text-white/60 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#c45a45]/40 transition-colors cursor-pointer"
          >
            {months.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          {/* Export */}
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-white/40 text-xs hover:text-white/70 hover:border-white/20 transition-all ml-auto shrink-0">
            <FaDownload className="text-[10px]" /> Export
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#0f0e0e] border border-white/[0.07] rounded-2xl overflow-hidden">
          {/* Table head */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/6 text-[10px] uppercase tracking-widest text-white/25 font-medium">
            <span className="w-8" />
            <span>Transaction</span>
            <span className="hidden sm:block">Market</span>
            <span className="hidden md:block">Status</span>
            <span className="text-right">Amount</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-white/25">
                <FaHistory className="text-3xl mx-auto mb-2 opacity-30" />
                <p className="text-sm">No transactions found.</p>
              </div>
            ) : (
              filtered.map((tx) => {
                const sc = sourceColors[tx.source] || sourceColors["Plan"];
                const st = statusConfig[tx.status];
                return (
                  <div
                    key={tx.id}
                    className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3.5 items-center hover:bg-white/2 transition-colors group"
                  >
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs border shrink-0 ${sc.bg} ${sc.border} ${sc.text}`}>
                      {tx.icon}
                    </div>

                    {/* Name + meta */}
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium leading-none truncate">{tx.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-medium ${sc.text}`}>{tx.source}</span>
                        <span className="text-white/20 text-[10px]">·</span>
                        <span className="text-white/25 text-[10px]">{tx.date} at {tx.time}</span>
                      </div>
                    </div>

                    {/* Market */}
                    <span className="hidden sm:block text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/40 font-medium shrink-0">
                      {tx.market}
                    </span>

                    {/* Status */}
                    <div className={`hidden md:flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg border font-medium shrink-0 ${st.className}`}>
                      <span className="text-[9px]">{st.icon}</span>
                      {st.label}
                    </div>

                    {/* Amount */}
                    <p className={`text-sm font-bold text-right shrink-0 tabular-nums ${
                      tx.type === "profit" ? "text-emerald-400"
                      : tx.type === "loss" ? "text-red-400"
                      : "text-amber-400"
                    }`}>
                      {tx.amount}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-white/6 flex items-center justify-between">
              <p className="text-white/25 text-xs">{filtered.length} records</p>
              <p className="text-white/25 text-xs">Showing all results</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}