import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import {
  FaHistory,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaWallet,
  FaFilter,
  FaDownload,
  FaSearch,
  FaBolt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSyncAlt,
  FaShoppingCart,
} from "react-icons/fa";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const fmt = (n) =>
  Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Map a raw Investment record from the API into the unified transaction shape
 * the UI consumes.
 */
function mapInvestment(inv) {
  const profit  = parseFloat(inv.current_profit || 0);
  const amount  = parseFloat(inv.amount || 0);
  const status  = (inv.status || "Pending").toLowerCase();

  // Derive type from status + profit
  let type;
  if (status === "declined") {
    type = "loss";
  } else if (status === "pending") {
    type = "pending";
  } else {
    type = profit >= 0 ? "profit" : "loss";
  }

  // Label: prefer plan name, fall back to category (stock label)
  const label    = inv.plan || inv.category || "Investment";
  const invType  = (inv.type || "stock").toLowerCase();
  const source   = invType === "plan" ? "Plan" : "Stock";

  // Amount display — always show principal; profit shown separately
  let displayAmt;
  let displayProfit = null;
  if (type === "loss") {
    displayAmt = `-$${fmt(amount)}`;
  } else if (type === "pending") {
    displayAmt = `$${fmt(amount)}`;
  } else {
    displayAmt = `$${fmt(amount)}`;                        // always show principal
    if (profit > 0) displayProfit = `+$${fmt(profit)}`;   // profit shown separately
  }

  return {
    id:            `inv-${inv.id}`,
    rawId:         inv.id,
    type,
    source,
    name:          label,
    amount:        displayAmt,
    profit:        displayProfit,   // ← NEW: separate profit display
    rawProfit:     profit,
    rawAmount:     amount,
    date:          inv.created_at
                     ? new Date(inv.created_at).toLocaleDateString("en-US", {
                         month: "short", day: "numeric", year: "numeric",
                       })
                     : "—",
    time:          inv.created_at
                     ? new Date(inv.created_at).toLocaleTimeString("en-US", {
                         hour: "2-digit", minute: "2-digit", hour12: false,
                       })
                     : "—",
    status:        status === "approved" ? "completed"
                   : status === "declined" ? "failed"
                   : "pending",
    market:        invType === "plan" ? "Plan" : "Stock",
    investorName:  inv.investor_name || "",
    investorEmail: inv.investor_email || "",
  };
}

/**
 * Map a raw Withdrawal record into the unified transaction shape.
 */
function mapWithdrawal(w) {
  const status = (w.status || "Pending").toLowerCase();
  return {
    id:            `wd-${w.id}`,
    rawId:         w.id,
    type:          status === "approved" ? "loss" : status === "pending" ? "pending" : "loss",
    source:        "Withdrawal",
    name:          `Withdrawal`,
    amount:        `-$${fmt(parseFloat(w.amount || 0))}`,
    profit:        null,   // withdrawals have no separate profit
    rawProfit:     0,
    rawAmount:     parseFloat(w.amount || 0),
    date:          w.created_at
                     ? new Date(w.created_at).toLocaleDateString("en-US", {
                         month: "short", day: "numeric", year: "numeric",
                       })
                     : "—",
    time:          w.created_at
                     ? new Date(w.created_at).toLocaleTimeString("en-US", {
                         hour: "2-digit", minute: "2-digit", hour12: false,
                       })
                     : "—",
    status:        status === "approved" ? "completed"
                   : status === "declined" ? "failed"
                   : "pending",
    market:        "—",
    investorName:  "",
    investorEmail: "",
  };
}

/* ─────────────────────────────────────────
   STATIC CONFIG
───────────────────────────────────────── */
const statusConfig = {
  completed: { label: "Completed", icon: <FaCheckCircle />, className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  pending:   { label: "Pending",   icon: <FaClock />,       className: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  failed:    { label: "Failed",    icon: <FaTimesCircle />, className: "text-red-400 bg-red-400/10 border-red-400/20" },
};

const sourceColors = {
  "Stock":      { bg: "bg-[#c45a45]/12", border: "border-[#c45a45]/25", text: "text-[#c45a45]" },
  "Plan":       { bg: "bg-[#4db89b]/12", border: "border-[#4db89b]/25", text: "text-[#4db89b]" },
  "Withdrawal": { bg: "bg-[#5a8fc4]/12", border: "border-[#5a8fc4]/25", text: "text-[#5a8fc4]" },
};

const sourceIcons = {
  "Stock":      <FaShoppingCart />,
  "Plan":       <FaChartLine />,
  "Withdrawal": <FaArrowDown />,
};

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
export default function ProfitHistory() {
  const role    = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const [transactions,   setTransactions]   = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [search,         setSearch]         = useState("");
  const [filterType,     setFilterType]     = useState("All");
  const [filterMonth,    setFilterMonth]    = useState("All Time");
  const [filterSource,   setFilterSource]   = useState("All");

  /* ── Fetch ──────────────────────────────────────────────────────────────── */
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [invRes, wdRes] = await Promise.all([
        API.get("investments/"),
        API.get("withdrawals/"),
      ]);

      const investments = (invRes.data || []).map(mapInvestment);
      const withdrawals = (wdRes.data  || []).map(mapWithdrawal);

      const merged = [...investments, ...withdrawals].sort((a, b) => {
        const da = new Date(`${a.date} ${a.time}`);
        const db = new Date(`${b.date} ${b.time}`);
        return db - da;
      });

      setTransactions(merged);
    } catch (err) {
      console.error("Failed to fetch history", err);
      setError("Failed to load transaction history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /* ── Derive available months from data ──────────────────────────────────── */
  const months = useMemo(() => {
    const seen = new Set();
    transactions.forEach((tx) => {
      if (tx.date && tx.date !== "—") {
        const parts = tx.date.split(" ");
        if (parts.length >= 3) seen.add(`${parts[0]} ${parts[2]}`);
      }
    });
    return ["All Time", ...Array.from(seen)];
  }, [transactions]);

  /* ── Filter ─────────────────────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        tx.name.toLowerCase().includes(search.toLowerCase()) ||
        tx.source.toLowerCase().includes(search.toLowerCase()) ||
        tx.market.toLowerCase().includes(search.toLowerCase()) ||
        (isAdmin && (
          tx.investorName.toLowerCase().includes(search.toLowerCase()) ||
          tx.investorEmail.toLowerCase().includes(search.toLowerCase())
        ));

      const matchType =
        filterType === "All" ||
        (filterType === "Profits"     && tx.type === "profit") ||
        (filterType === "Losses"      && tx.type === "loss") ||
        (filterType === "Pending"     && tx.type === "pending") ||
        (filterType === "Withdrawals" && tx.source === "Withdrawal");

      const matchSource =
        filterSource === "All" || tx.source === filterSource;

      const matchMonth = (() => {
        if (filterMonth === "All Time") return true;
        if (!tx.date || tx.date === "—") return false;
        const parts = tx.date.split(" ");
        return parts.length >= 3 && `${parts[0]} ${parts[2]}` === filterMonth;
      })();

      return matchSearch && matchType && matchSource && matchMonth;
    });
  }, [transactions, search, filterType, filterSource, filterMonth, isAdmin]);

  /* ── Summary stats ──────────────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const profits   = transactions.filter((t) => t.type === "profit");
    const losses    = transactions.filter((t) => t.type === "loss");
    const completed = transactions.filter((t) => t.status === "completed");

    const totalProfit = profits.reduce((s, t) => s + (t.rawProfit > 0 ? t.rawProfit : t.rawAmount), 0);
    const totalLoss   = losses.reduce((s, t)  => s + t.rawAmount, 0);
    const net         = totalProfit - totalLoss;
    const winRate     = completed.length > 0
      ? Math.round((profits.filter((t) => t.status === "completed").length / completed.length) * 100)
      : 0;

    return { totalProfit, totalLoss, net, winRate, profitCount: profits.length, lossCount: losses.length, completedCount: completed.length };
  }, [transactions]);

  /* ── Export CSV ─────────────────────────────────────────────────────────── */
  const handleExport = () => {
    const header = ["ID", "Type", "Source", "Name", "Principal", "Profit", "Date", "Time", "Status", "Market"];
    const rows   = filtered.map((tx) => [
      tx.rawId, tx.type, tx.source, tx.name, tx.amount, tx.profit || "—", tx.date, tx.time, tx.status, tx.market,
    ]);
    const csv  = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "profit_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const typeFilters   = ["All", "Profits", "Losses", "Pending", "Withdrawals"];
  const sourceFilters = ["All", "Stock", "Plan", "Withdrawal"];

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <DashboardLayout>
      <div className="text-white p-5 md:p-7 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-7 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center">
                <FaHistory className="text-[#c45a45] text-sm" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {isAdmin ? "All Transactions" : "Profit History"}
              </h1>
            </div>
            <p className="text-white/35 text-sm ml-12">
              {isAdmin
                ? "Full transaction history across all investors."
                : "Track all your earnings and trading activity."}
            </p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-white/40 text-xs hover:text-white/70 hover:border-white/20 transition-all shrink-0"
          >
            <FaSyncAlt className={`text-[10px] ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          {[
            {
              label:     "Total Earned",
              value:     `+$${fmt(stats.totalProfit)}`,
              sub:       `${stats.profitCount} profit records`,
              color:     "text-emerald-400",
              icon:      <FaArrowUp />,
              iconBg:    "bg-emerald-400/10 border-emerald-400/20",
              iconColor: "text-emerald-400",
            },
            {
              label:     "Total Loss",
              value:     `-$${fmt(stats.totalLoss)}`,
              sub:       `${stats.lossCount} loss records`,
              color:     "text-red-400",
              icon:      <FaArrowDown />,
              iconBg:    "bg-red-400/10 border-red-400/20",
              iconColor: "text-red-400",
            },
            {
              label:     "Net P&L",
              value:     `${stats.net >= 0 ? "+" : ""}$${fmt(Math.abs(stats.net))}`,
              sub:       "All time",
              color:     stats.net >= 0 ? "text-white" : "text-red-400",
              icon:      <FaWallet />,
              iconBg:    "bg-[#c45a45]/12 border-[#c45a45]/25",
              iconColor: "text-[#c45a45]",
            },
            {
              label:     "Win Rate",
              value:     `${stats.winRate}%`,
              sub:       `${stats.completedCount} completed trades`,
              color:     "text-white",
              icon:      <FaBolt />,
              iconBg:    "bg-[#c45a45]/12 border-[#c45a45]/25",
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
        <div className="flex flex-col sm:flex-row gap-3 mb-5 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs" />
            <input
              type="text"
              placeholder={isAdmin ? "Search investor, name, source..." : "Search by name, source..."}
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

          {/* Source filter */}
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="bg-[#0f0e0e] border border-white/10 text-white/60 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#c45a45]/40 transition-colors cursor-pointer"
          >
            {sourceFilters.map((s) => <option key={s} value={s}>{s === "All" ? "All Sources" : s}</option>)}
          </select>

          {/* Month select */}
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="bg-[#0f0e0e] border border-white/10 text-white/60 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#c45a45]/40 transition-colors cursor-pointer"
          >
            {months.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          {/* Export */}
          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-white/40 text-xs hover:text-white/70 hover:border-white/20 transition-all ml-auto shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FaDownload className="text-[10px]" /> Export
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#0f0e0e] border border-white/[0.07] rounded-2xl overflow-hidden">

          {/* Table head */}
          <div className={`grid gap-4 px-5 py-3 border-b border-white/6 text-[10px] uppercase tracking-widest text-white/25 font-medium ${
            isAdmin
              ? "grid-cols-[auto_1fr_auto_auto_auto_auto_auto]"
              : "grid-cols-[auto_1fr_auto_auto_auto_auto]"
          }`}>
            <span className="w-8" />
            <span>Transaction</span>
            {isAdmin && <span className="hidden lg:block">Investor</span>}
            <span className="hidden sm:block">Type</span>
            <span className="hidden md:block">Status</span>
            <span className="text-right">Principal</span>
            <span className="text-right text-emerald-400/50">Profit</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#c45a45]/30 border-t-[#c45a45] animate-spin" />
                <p className="text-white/25 text-sm">Loading transactions…</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <FaHistory className="text-3xl mx-auto mb-2 opacity-20 text-red-400" />
                <p className="text-red-400/70 text-sm">{error}</p>
                <button
                  onClick={fetchData}
                  className="mt-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 text-xs hover:bg-white/8 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-white/25">
                <FaHistory className="text-3xl mx-auto mb-2 opacity-30" />
                <p className="text-sm">No transactions found.</p>
              </div>
            ) : (
              filtered.map((tx) => {
                const sc   = sourceColors[tx.source] || sourceColors["Plan"];
                const st   = statusConfig[tx.status] || statusConfig["pending"];
                const icon = sourceIcons[tx.source]  || <FaChartLine />;
                return (
                  <div
                    key={tx.id}
                    className={`grid gap-4 px-5 py-3.5 items-center hover:bg-white/2 transition-colors group ${
                      isAdmin
                        ? "grid-cols-[auto_1fr_auto_auto_auto_auto_auto]"
                        : "grid-cols-[auto_1fr_auto_auto_auto_auto]"
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs border shrink-0 ${sc.bg} ${sc.border} ${sc.text}`}>
                      {icon}
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

                    {/* Investor (admin only) */}
                    {isAdmin && (
                      <div className="hidden lg:block min-w-0 max-w-35">
                        <p className="text-white/70 text-[11px] font-medium truncate">{tx.investorName || "—"}</p>
                        {tx.investorEmail && (
                          <p className="text-white/25 text-[10px] truncate">{tx.investorEmail}</p>
                        )}
                      </div>
                    )}

                    {/* Market / Type badge */}
                    <span className="hidden sm:block text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/40 font-medium shrink-0">
                      {tx.market}
                    </span>

                    {/* Status */}
                    <div className={`hidden md:flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg border font-medium shrink-0 ${st.className}`}>
                      <span className="text-[9px]">{st.icon}</span>
                      {st.label}
                    </div>

                    {/* Principal amount */}
                    <p className={`text-sm font-bold text-right shrink-0 tabular-nums ${
                      tx.type === "profit"  ? "text-white"
                      : tx.type === "loss"  ? "text-red-400"
                      : "text-amber-400"
                    }`}>
                      {tx.amount}
                    </p>

                    {/* Profit (separate column) */}
                    <div className="text-right shrink-0 tabular-nums">
                      {tx.profit ? (
                        <p className="text-sm font-bold text-emerald-400">{tx.profit}</p>
                      ) : (
                        <p className="text-sm text-white/15">—</p>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {!loading && !error && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-white/6 flex items-center justify-between">
              <p className="text-white/25 text-xs">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</p>
              <p className="text-white/25 text-xs">
                {transactions.length !== filtered.length
                  ? `Filtered from ${transactions.length} total`
                  : "Showing all results"}
              </p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}