import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

const CRYPTO_OPTIONS = [
  {
    id: "BTC", name: "Bitcoin", symbol: "BTC", icon: "₿", color: "#f7931a",
    bg: "bg-[#f7931a]/10", border: "border-[#f7931a]/30", text: "text-[#f7931a]",
    address: "1FfmbHfnpaZjKFvyi1okTjJJusN455paPH", network: "Bitcoin Network",
  },
  {
    id: "TRX", name: "Tron", symbol: "TRX", icon: "◈", color: "#ef0027",
    bg: "bg-[#ef0027]/10", border: "border-[#ef0027]/30", text: "text-[#ef0027]",
    address: "TRXWalletAddressHere1234567890ABCDEF", network: "TRC-20 Network",
  },
  {
    id: "ETH", name: "Ethereum", symbol: "ETH", icon: "Ξ", color: "#627eea",
    bg: "bg-[#627eea]/10", border: "border-[#627eea]/30", text: "text-[#627eea]",
    address: "0xETHWalletAddressHere1234567890ABCDEF", network: "ERC-20 Network",
  },
  {
    id: "USDT", name: "Tether", symbol: "USDT", icon: "₮", color: "#26a17b",
    bg: "bg-[#26a17b]/10", border: "border-[#26a17b]/30", text: "text-[#26a17b]",
    address: "USDTWalletAddressHere1234567890ABCDEF", network: "TRC-20 / ERC-20",
  },
  {
    id: "LTC", name: "Litecoin", symbol: "LTC", icon: "Ł", color: "#bfbbbb",
    bg: "bg-white/5", border: "border-white/20", text: "text-white/70",
    address: "LTCWalletAddressHere1234567890ABCDEF", network: "Litecoin Network",
  },
  {
    id: "XRP", name: "Ripple", symbol: "XRP", icon: "✕", color: "#00aae4",
    bg: "bg-[#00aae4]/10", border: "border-[#00aae4]/30", text: "text-[#00aae4]",
    address: "XRPWalletAddressHere1234567890ABCDEF", network: "XRP Ledger",
  },
];

const STEPS = [
  { n: 1, label: "Select Crypto" },
  { n: 2, label: "Enter Amount" },
  { n: 3, label: "Upload Proof" },
];

// ─── Shared styles ─────────────────────────────────────────────────────────────
const S = {
  pageBg:    "bg-[#171515]",
  cardBg:    "bg-[#211e1e]",
  border:    "border-[#332d2c]",
  muted:     "text-[#9e9593]",
  inputBg:   "bg-[#171515]",
  orange:    "text-[#c45a45]",
};

// ─── Copy Button ───────────────────────────────────────────────────────────────
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold px-3 py-1.5 rounded-md transition-all text-white/60 hover:text-white"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

// ─── Deposit Flow (reused by both User and Admin "Fund My Account" tab) ────────
function DepositFlow({ isAdmin = false }) {
  const [step, setStep]           = useState(1);
  const [selected, setSelected]   = useState(null);
  const [amount, setAmount]       = useState("");
  const [proof, setProof]         = useState(null);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [amountErr, setAmountErr] = useState("");

  const coin = CRYPTO_OPTIONS.find((c) => c.id === selected);

  const validateAmount = (val) => {
    const n = parseFloat(val);
    if (!val) return "";
    if (isNaN(n) || n <= 0) return "Enter a valid amount";
    if (n < 500) return "Minimum deposit is $500";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateAmount(amount);
    if (err) { setAmountErr(err); return; }
    setLoading(true);
    try {
      const data = new FormData();
      data.append("payment_method", selected);
      data.append("amount", amount);
      if (proof) data.append("payment_proof", proof);
      // admin deposits go to same endpoint — backend auto-approves or marks is_admin=true
      await API.post("deposits/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.error || "Deposit submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSuccess(false); setStep(1); setSelected(null);
    setAmount(""); setProof(null); setAmountErr("");
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4 py-12">
        <div className="w-20 h-20 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-4xl mb-6 text-[#10b981]">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-[#10b981] mb-2">Deposit Submitted</h2>
        <p className={`${S.muted} text-sm mb-6 max-w-sm`}>
          Your deposit of{" "}
          <span className="text-white font-semibold">${parseFloat(amount).toLocaleString()}</span> via{" "}
          <span className="text-white font-semibold">{selected}</span> has been received
          {isAdmin ? " and will be credited to your admin account." : " and is pending confirmation."}
        </p>
        <button
          onClick={reset}
          className="bg-[#a64633] hover:bg-[#c45a45] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
        >
          Make Another Deposit
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Step Indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s.n} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                step > s.n
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : step === s.n
                  ? "bg-[#c45a45] border-[#c45a45] text-white"
                  : `bg-transparent ${S.border} ${S.muted}`
              }`}>
                {step > s.n ? "✓" : s.n}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step >= s.n ? "text-white" : S.muted}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-3 transition-all ${step > s.n ? "bg-emerald-500" : S.border}`} />
            )}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Select a cryptocurrency</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CRYPTO_OPTIONS.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelected(c.id); setStep(2); }}
                className={`flex flex-col gap-2 p-4 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-[0.99] ${c.bg} ${c.border}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold" style={{ color: c.color }}>{c.icon}</span>
                  <span className={`text-xs font-bold ${c.text}`}>{c.symbol}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{c.name}</p>
                  <p className={`${S.muted} text-xs`}>{c.network}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && coin && (
        <div className="space-y-5">
          <button onClick={() => setStep(1)} className={`text-xs ${S.muted} hover:text-white flex items-center gap-1 transition-colors`}>
            ← Back
          </button>

          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${coin.bg} ${coin.border}`}>
            <span className="text-2xl font-bold" style={{ color: coin.color }}>{coin.icon}</span>
            <div>
              <p className="text-white font-semibold">{coin.name}</p>
              <p className={`text-xs ${S.muted}`}>{coin.network}</p>
            </div>
          </div>

          <div className={`${S.cardBg} border ${S.border} rounded-xl p-5 space-y-3`}>
            <p className={`text-xs font-semibold ${S.muted} uppercase tracking-wider`}>
              Send {coin.symbol} to this address
            </p>
            <div className={`flex items-center gap-3 ${S.inputBg} border ${S.border} rounded-lg px-4 py-3`}>
              <p className="font-mono text-sm text-white break-all flex-1">{coin.address}</p>
              <CopyBtn text={coin.address} />
            </div>
            <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3">
              <span className="text-amber-400 text-sm mt-0.5">⚠</span>
              <p className="text-amber-400/80 text-xs leading-relaxed">
                Only send <strong className="text-amber-300">{coin.symbol}</strong> on the{" "}
                <strong className="text-amber-300">{coin.network}</strong>. Sending other coins will result in permanent loss.
              </p>
            </div>
          </div>

          <div className={`${S.cardBg} border ${S.border} rounded-xl p-5 space-y-4`}>
            <p className={`text-xs font-semibold ${S.muted} uppercase tracking-wider`}>Enter deposit amount (USD)</p>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${S.muted} font-semibold`}>$</span>
              <input
                type="number"
                placeholder="0.00"
                min="500"
                step="0.01"
                className={`w-full ${S.inputBg} border pl-8 pr-4 py-3 rounded-lg text-white placeholder-[#9e9593] focus:outline-none transition-colors ${
                  amountErr ? "border-red-500" : `${S.border} focus:border-[#c45a45]`
                }`}
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setAmountErr(validateAmount(e.target.value)); }}
              />
            </div>
            {amountErr && <p className="text-red-400 text-xs">{amountErr}</p>}
            <p className={`text-xs ${S.muted}`}>Minimum deposit: <span className="text-white font-semibold">$500</span></p>
          </div>

          <button
            onClick={() => { const err = validateAmount(amount); if (err) { setAmountErr(err); return; } setStep(3); }}
            disabled={!amount}
            className="w-full bg-[#a64633] hover:bg-[#c45a45] disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Continue →
          </button>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && coin && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <button type="button" onClick={() => setStep(2)} className={`text-xs ${S.muted} hover:text-white flex items-center gap-1 transition-colors`}>
            ← Back
          </button>

          <div className={`${S.cardBg} border ${S.border} rounded-xl p-5 space-y-3`}>
            <p className={`text-xs font-semibold ${S.muted} uppercase tracking-wider`}>Deposit Summary</p>
            <div className="flex justify-between text-sm">
              <span className={S.muted}>Method</span>
              <span className="text-white font-semibold">{coin.name} ({coin.symbol})</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={S.muted}>Amount</span>
              <span className={`${S.orange} font-bold`}>${parseFloat(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={S.muted}>Network</span>
              <span className="text-white">{coin.network}</span>
            </div>
            <div className={`h-px ${S.border}`} />
            <div className={`flex items-center gap-2 ${S.inputBg} rounded-lg px-3 py-2`}>
              <span className={`text-xs ${S.muted}`}>To:</span>
              <span className="font-mono text-xs text-white/70 flex-1 truncate">{coin.address}</span>
              <CopyBtn text={coin.address} />
            </div>
          </div>

          <div className={`${S.cardBg} border ${S.border} rounded-xl p-5 space-y-3`}>
            <p className={`text-xs font-semibold ${S.muted} uppercase tracking-wider`}>Upload Payment Proof</p>
            <p className={`text-xs ${S.muted}`}>Attach a screenshot or photo of your transaction confirmation.</p>
            <label className={`flex flex-col items-center justify-center gap-3 ${S.inputBg} border-2 border-dashed ${S.border} hover:border-[#c45a45]/50 rounded-xl p-8 cursor-pointer transition-colors`}>
              <span className="text-3xl">{proof ? "✓" : "📎"}</span>
              <span className={`text-sm ${S.muted}`}>{proof ? proof.name : "Click to upload image"}</span>
              <span className={`text-xs ${S.muted}`}>PNG, JPG, JPEG — Max 5MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setProof(e.target.files[0])} />
            </label>
          </div>

          {isAdmin ? (
            <div className="flex items-start gap-2 bg-[#c45a45]/10 border border-[#c45a45]/20 rounded-lg px-4 py-3">
              <span className="text-[#c45a45] mt-0.5">🔐</span>
              <p className="text-[#c45a45]/80 text-xs leading-relaxed">
                As an admin, your deposit will be <strong className="text-[#c45a45]">auto-approved</strong> once the transaction is confirmed on-chain.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2 bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg px-4 py-3">
              <span className="text-[#10b981] mt-0.5">ℹ</span>
              <p className="text-[#10b981]/80 text-xs leading-relaxed">
                After submitting, an admin will review your payment proof and credit your account within{" "}
                <strong className="text-[#10b981]">30 minutes</strong>.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? "Submitting…" : "Confirm Deposit"}
          </button>
        </form>
      )}
    </div>
  );
}

// ─── USER VIEW ─────────────────────────────────────────────────────────────────
function UserFundAccount() {
  return (
    <div className={`text-white max-w-3xl mx-auto space-y-8 px-4 py-4 min-h-screen ${S.pageBg}`}>
      <div>
        <h1 className="text-3xl font-bold tracking-wide">Fund Account</h1>
        <p className={`${S.muted} text-sm mt-1`}>
          Deposit crypto to fund your investment account. Funds are confirmed within 30 minutes after network confirmation.
        </p>
      </div>
      <DepositFlow isAdmin={false} />
    </div>
  );
}

// ─── ADMIN VIEW ────────────────────────────────────────────────────────────────
function AdminFundAccount() {
  // "deposits" = manage deposits tab | "fund" = fund my account tab
  const [activeTab, setActiveTab]         = useState("deposits");
  const [filter, setFilter]               = useState("all");
  const [deposits, setDeposits]           = useState([]);
  const [loadingList, setLoadingList]     = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const res = await API.get("deposits/");
        setDeposits(res.data);
      } catch (err) {
        console.error("Failed to load deposits", err);
      } finally {
        setLoadingList(false);
      }
    };
    fetchDeposits();
  }, []);

  const handleAction = async (id, status) => {
    setActionLoading(id);
    try {
      await API.patch(`deposits/${id}/`, { status });
      setDeposits((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    } catch (err) {
      alert(err.response?.data?.error || "Action failed. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const counts = {
    pending:  deposits.filter((d) => d.status === "pending").length,
    approved: deposits.filter((d) => d.status === "approved").length,
    declined: deposits.filter((d) => d.status === "declined").length,
  };

  const filtered = filter === "all" ? deposits : deposits.filter((d) => d.status === filter);

  const statusBadge = (status) => {
    if (status === "pending")
      return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400">Pending</span>;
    if (status === "approved")
      return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400">Approved</span>;
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-400">Declined</span>;
  };

  const FILTER_TABS = ["all", "pending", "approved", "declined"];

  return (
    <div className={`text-white max-w-4xl mx-auto px-4 py-4 space-y-6 min-h-screen ${S.pageBg}`}>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-wide">Fund Account</h1>
        <p className={`${S.muted} text-sm mt-1`}>Manage user deposits or fund your own admin account.</p>
      </div>

      {/* Main Tab Switch */}
      <div className={`flex gap-1 p-1 rounded-xl border ${S.border} ${S.cardBg} w-fit`}>
        <button
          onClick={() => setActiveTab("deposits")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "deposits"
              ? "bg-[#c45a45] text-white shadow"
              : `${S.muted} hover:text-white`
          }`}
        >
          🗂 Manage Deposits
        </button>
        <button
          onClick={() => setActiveTab("fund")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "fund"
              ? "bg-[#c45a45] text-white shadow"
              : `${S.muted} hover:text-white`
          }`}
        >
          💳 Fund My Account
        </button>
      </div>

      {/* ── TAB: MANAGE DEPOSITS ── */}
      {activeTab === "deposits" && (
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Pending",  value: counts.pending,  color: "text-amber-400"   },
              { label: "Approved", value: counts.approved, color: "text-emerald-400" },
              { label: "Declined", value: counts.declined, color: "text-red-400"     },
            ].map((s) => (
              <div key={s.label} className={`${S.cardBg} border ${S.border} rounded-xl p-4`}>
                <p className={`${S.muted} text-xs mb-1`}>{s.label}</p>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className={`flex border-b ${S.border}`}>
            {FILTER_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  filter === t
                    ? "text-[#c45a45] border-[#c45a45]"
                    : `${S.muted} border-transparent hover:text-white`
                }`}
              >
                {t}{t !== "all" && ` (${counts[t]})`}
              </button>
            ))}
          </div>

          {/* Deposit List */}
          {loadingList ? (
            <div className={`${S.muted} text-sm text-center py-16`}>Loading deposits…</div>
          ) : filtered.length === 0 ? (
            <div className={`${S.muted} text-sm text-center py-16`}>No deposits found.</div>
          ) : (
            <div className="space-y-4">
              {filtered.map((dep) => (
                <div
                  key={dep.id}
                  className={`${S.cardBg} border ${S.border} rounded-xl overflow-hidden ${
                    dep.status === "pending"  ? "border-l-4 border-l-amber-500"   :
                    dep.status === "approved" ? "border-l-4 border-l-emerald-500" :
                                               "border-l-4 border-l-red-500"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 pt-4 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#c45a45]/20 flex items-center justify-center text-[#c45a45] font-bold text-sm shrink-0">
                        {dep.user?.charAt(0)?.toUpperCase() ?? "U"}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{dep.user ?? dep.username ?? "User"}</p>
                        <p className={`${S.muted} text-xs`}>{dep.email ?? "—"}</p>
                      </div>
                    </div>
                    {statusBadge(dep.status)}
                  </div>

                  {/* Meta */}
                  <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 pb-4 border-b ${S.border}`}>
                    {[
                      { label: "Amount",    value: `$${parseFloat(dep.amount).toLocaleString()}`, accent: true },
                      { label: "Method",    value: dep.payment_method ?? dep.method },
                      { label: "Network",   value: dep.network ?? "—" },
                      { label: "Submitted", value: dep.created_at ? new Date(dep.created_at).toLocaleString() : dep.time ?? "—" },
                    ].map((m) => (
                      <div key={m.label}>
                        <p className={`${S.muted} text-xs mb-0.5`}>{m.label}</p>
                        <p className={`text-sm font-semibold ${m.accent ? "text-[#c45a45]" : "text-white"}`}>{m.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Proof */}
                  <div className="px-5 py-4">
                    <p className={`${S.muted} text-xs font-semibold uppercase tracking-wider mb-3`}>Payment proof</p>
                    {dep.payment_proof ? (
                      <a href={dep.payment_proof} target="_blank" rel="noreferrer">
                        <img
                          src={dep.payment_proof}
                          alt="Payment proof"
                          className="w-full max-h-52 object-cover rounded-lg border border-white/10 hover:opacity-90 transition-opacity cursor-pointer"
                        />
                      </a>
                    ) : (
                      <div className={`${S.inputBg} border ${S.border} rounded-lg px-4 py-6 text-center`}>
                        <p className={`${S.muted} text-xs`}>No proof uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {dep.status === "pending" && (
                    <div className="flex gap-3 px-5 pb-5">
                      <button
                        onClick={() => handleAction(dep.id, "approved")}
                        disabled={actionLoading === dep.id}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        {actionLoading === dep.id ? "Processing…" : "✓ Approve"}
                      </button>
                      <button
                        onClick={() => handleAction(dep.id, "declined")}
                        disabled={actionLoading === dep.id}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-red-400 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        {actionLoading === dep.id ? "Processing…" : "✕ Decline"}
                      </button>
                    </div>
                  )}

                  {dep.status !== "pending" && (
                    <div className="px-5 pb-4">
                      <p className={`text-xs text-center ${dep.status === "approved" ? "text-emerald-400" : "text-red-400"}`}>
                        {dep.status === "approved"
                          ? "✓ Deposit approved — funds credited to user account"
                          : "✕ Deposit declined — user has been notified"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: FUND MY ACCOUNT ── */}
      {activeTab === "fund" && (
        <div className="space-y-4">
          {/* Admin-specific notice */}
          <div className={`${S.cardBg} border ${S.border} rounded-xl p-4 flex items-start gap-3`}>
            <div className="w-8 h-8 rounded-lg bg-[#c45a45]/20 flex items-center justify-center shrink-0 text-[#c45a45] text-sm font-bold">
              A
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Admin self-deposit</p>
              <p className={`${S.muted} text-xs mt-0.5`}>
                Deposits made here are linked to your admin account and auto-approved once the on-chain transaction is confirmed.
              </p>
            </div>
          </div>

          <DepositFlow isAdmin={true} />
        </div>
      )}
    </div>
  );
}

// ─── ROOT COMPONENT ────────────────────────────────────────────────────────────
function FundAccount() {
  const role    = localStorage.getItem("role");
  const isAdmin = role === "admin";

  return (
    <DashboardLayout>
      {isAdmin ? <AdminFundAccount /> : <UserFundAccount />}
    </DashboardLayout>
  );
}

export default FundAccount;