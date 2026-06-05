import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

function Transactions() {
  const [investments, setInvestments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [inv, wd] = await Promise.all([
        API.get("investments/"),
        API.get("withdrawals/"),
      ]);
      setInvestments(inv.data);
      setWithdrawals(wd.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const items = [
    ...investments.map((i) => ({
      id: `i-${i.id}`, kind: "Investment", amount: i.amount,
      label: i.category || "Investment",
      status: !i.approved ? "pending" : i.active ? "active" : "expired",
      date: i.created_at,
    })),
    ...withdrawals.map((w) => ({
      id: `w-${w.id}`, kind: "Withdrawal", amount: w.amount,
      label: w.method || "Withdrawal",
      status: w.approved ? "approved" : w.rejected ? "rejected" : "pending",
      date: w.created_at,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filtered = filter === "all" ? items : items.filter((x) => x.kind.toLowerCase() === filter);

  const statusColor = (s) => ({
    active:   "bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30",
    approved: "bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30",
    pending:  "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    rejected: "bg-red-500/15 text-red-400 border-red-500/30",
    expired:  "bg-orange-500/15 text-orange-400 border-orange-500/30",
  }[s] || "bg-white/5 text-white/60 border-white/10");

  return (
    <DashboardLayout>
      <div className="text-white p-6 space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-[#9e9593] text-sm mt-1">All your investments and withdrawals in one place.</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {[
            { id: "all", label: `All (${items.length})` },
            { id: "investment", label: `Investments (${investments.length})` },
            { id: "withdrawal", label: `Withdrawals (${withdrawals.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === t.id
                  ? "bg-[#c45a45] text-white"
                  : "bg-[#211e1e] border border-[#332d2c] text-[#9e9593] hover:border-[#c45a45]/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-[#9e9593] text-center py-12">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-[#9e9593] text-center py-12 italic">No transactions found.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div key={item.id} className="bg-[#211e1e] border border-[#332d2c] p-4 rounded-xl flex items-center justify-between gap-4 hover:border-[#c45a45]/40 transition-all">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                    item.kind === "Investment" ? "bg-[#10b981]/15 text-[#10b981]" : "bg-[#0b66e4]/15 text-[#0b66e4]"
                  }`}>
                    {item.kind === "Investment" ? "↑" : "↓"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{item.kind} — {item.label}</p>
                    <p className="text-xs text-[#9e9593] mt-0.5">
                      {item.date ? new Date(item.date).toLocaleString(undefined, { year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" }) : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${statusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="font-bold text-white text-lg whitespace-nowrap">
                    ${Number(item.amount).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Transactions;
