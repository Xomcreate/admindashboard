import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

// ─── Shared styles ──────────────────────────────────────────────────────────────
const S = {
  pageBg:  "bg-[#171515]",
  cardBg:  "bg-[#211e1e]",
  border:  "border-[#332d2c]",
  muted:   "text-[#9e9593]",
};

const statusColor = (s) =>
  ({
    active:   "bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30",
    approved: "bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30",
    pending:  "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    rejected: "bg-red-500/15 text-red-400 border-red-500/30",
    declined: "bg-red-500/15 text-red-400 border-red-500/30",
    expired:  "bg-orange-500/15 text-orange-400 border-orange-500/30",
  }[s] || "bg-white/5 text-white/60 border-white/10");

const kindIcon  = (k) => ({ Investment: "↑", Withdrawal: "↓", Deposit: "+" }[k] || "•");
const kindColor = (k) => ({
  Investment: "bg-[#10b981]/15 text-[#10b981]",
  Withdrawal: "bg-[#0b66e4]/15 text-[#0b66e4]",
  Deposit:    "bg-[#c45a45]/15 text-[#c45a45]",
}[k] || "bg-white/10 text-white");

// ─── Shared transaction list ────────────────────────────────────────────────────
function TransactionList({ investments, withdrawals, deposits }) {
  const [filter, setFilter] = useState("all");

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
    ...deposits.map((d) => ({
      id: `d-${d.id}`, kind: "Deposit", amount: d.amount,
      label: d.payment_method || "Deposit",
      status: d.status,
      date: d.created_at,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filtered =
    filter === "all" ? items : items.filter((x) => x.kind.toLowerCase() === filter);

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "all",        label: `All (${items.length})`               },
          { id: "investment", label: `Investments (${investments.length})`  },
          { id: "withdrawal", label: `Withdrawals (${withdrawals.length})`  },
          { id: "deposit",    label: `Deposits (${deposits.length})`        },
        ].map((t) => (
          <button key={t.id} onClick={() => setFilter(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              filter === t.id
                ? "bg-[#c45a45] text-white"
                : `${S.cardBg} border ${S.border} ${S.muted} hover:border-[#c45a45]/50`
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className={`${S.muted} text-center py-12 italic`}>No transactions found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div key={item.id}
              className={`${S.cardBg} border ${S.border} p-4 rounded-xl flex items-center justify-between gap-4 hover:border-[#c45a45]/40 transition-all`}>
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${kindColor(item.kind)}`}>
                  {kindIcon(item.kind)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{item.kind} — {item.label}</p>
                  <p className={`text-xs ${S.muted} mt-0.5`}>
                    {item.date
                      ? new Date(item.date).toLocaleString(undefined, {
                          year: "numeric", month: "short", day: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })
                      : "—"}
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
    </>
  );
}

// ─── USER Transactions ──────────────────────────────────────────────────────────
function UserTransactions() {
  const [investments, setInvestments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [deposits, setDeposits]       = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("investments/"),
      API.get("withdrawals/"),
      API.get("deposits/"),
    ])
      .then(([inv, wd, dep]) => {
        setInvestments(inv.data);
        setWithdrawals(wd.data);
        setDeposits(dep.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`text-white p-6 space-y-6 max-w-4xl mx-auto min-h-screen ${S.pageBg}`}>
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className={`${S.muted} text-sm mt-1`}>Your investments, withdrawals, and deposits.</p>
      </div>
      {loading ? (
        <p className={`${S.muted} text-center py-12`}>Loading...</p>
      ) : (
        <TransactionList
          investments={investments}
          withdrawals={withdrawals}
          deposits={deposits}
        />
      )}
    </div>
  );
}

// ─── ADMIN Transactions ─────────────────────────────────────────────────────────
function AdminTransactions() {
  const [investments, setInvestments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [deposits, setDeposits]       = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("investments/"),
      API.get("withdrawals/"),
      API.get("deposits/"),
    ])
      .then(([inv, wd, dep]) => {
        setInvestments(inv.data);
        setWithdrawals(wd.data);
        setDeposits(dep.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Group by user for admin view
  const totalAmount = (arr) => arr.reduce((s, x) => s + Number(x.amount), 0);

  return (
    <div className={`text-white p-6 space-y-6 max-w-6xl mx-auto min-h-screen ${S.pageBg}`}>
      <div>
        <h1 className="text-3xl font-bold">All Transactions</h1>
        <p className={`${S.muted} text-sm mt-1`}>Every investment, withdrawal, and deposit across all users.</p>
      </div>

      {/* Summary stats */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Invested",  value: `$${totalAmount(investments).toLocaleString()}`, color: "text-[#10b981]" },
            { label: "Total Withdrawn", value: `$${totalAmount(withdrawals).toLocaleString()}`, color: "text-[#0b66e4]" },
            { label: "Total Deposited", value: `$${totalAmount(deposits).toLocaleString()}`,    color: "text-[#c45a45]" },
          ].map((s) => (
            <div key={s.label} className={`${S.cardBg} border ${S.border} rounded-xl p-4`}>
              <p className={`${S.muted} text-xs mb-1`}>{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <p className={`${S.muted} text-center py-12`}>Loading...</p>
      ) : (
        <TransactionList
          investments={investments}
          withdrawals={withdrawals}
          deposits={deposits}
        />
      )}
    </div>
  );
}

// ─── ROOT ───────────────────────────────────────────────────────────────────────
function Transactions() {
  const isAdmin = localStorage.getItem("role") === "admin";
  return (
    <DashboardLayout>
      {isAdmin ? <AdminTransactions /> : <UserTransactions />}
    </DashboardLayout>
  );
}

export default Transactions;