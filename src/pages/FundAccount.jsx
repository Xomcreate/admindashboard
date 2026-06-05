import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

const CRYPTO_OPTIONS = [
  {
    id: "BTC",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    color: "#f7931a",
    bg: "bg-[#f7931a]/10",
    border: "border-[#f7931a]/30",
    text: "text-[#f7931a]",
    address: "1FfmbHfnpaZjKFvyi1okTjJJusN455paPH",
    network: "Bitcoin Network",
  },
  {
    id: "TRX",
    name: "Tron",
    symbol: "TRX",
    icon: "◈",
    color: "#ef0027",
    bg: "bg-[#ef0027]/10",
    border: "border-[#ef0027]/30",
    text: "text-[#ef0027]",
    address: "TRXWalletAddressHere1234567890ABCDEF",
    network: "TRC-20 Network",
  },
  {
    id: "ETH",
    name: "Ethereum",
    symbol: "ETH",
    icon: "Ξ",
    color: "#627eea",
    bg: "bg-[#627eea]/10",
    border: "border-[#627eea]/30",
    text: "text-[#627eea]",
    address: "0xETHWalletAddressHere1234567890ABCDEF",
    network: "ERC-20 Network",
  },
  {
    id: "USDT",
    name: "Tether",
    symbol: "USDT",
    icon: "₮",
    color: "#26a17b",
    bg: "bg-[#26a17b]/10",
    border: "border-[#26a17b]/30",
    text: "text-[#26a17b]",
    address: "USDTWalletAddressHere1234567890ABCDEF",
    network: "TRC-20 / ERC-20",
  },
  {
    id: "LTC",
    name: "Litecoin",
    symbol: "LTC",
    icon: "Ł",
    color: "#bfbbbb",
    bg: "bg-white/5",
    border: "border-white/20",
    text: "text-white/70",
    address: "LTCWalletAddressHere1234567890ABCDEF",
    network: "Litecoin Network",
  },
  {
    id: "XRP",
    name: "Ripple",
    symbol: "XRP",
    icon: "✕",
    color: "#00aae4",
    bg: "bg-[#00aae4]/10",
    border: "border-[#00aae4]/30",
    text: "text-[#00aae4]",
    address: "XRPWalletAddressHere1234567890ABCDEF",
    network: "XRP Ledger",
  },
];

const STEPS = [
  { n: 1, label: "Select Crypto" },
  { n: 2, label: "Enter Amount" },
  { n: 3, label: "Upload Proof" },
];

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

function FundAccount() {
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

  if (success) {
    return (
      <DashboardLayout>
        <div className="text-white max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-20 h-20 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-4xl mb-6">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-[#10b981] mb-2">Deposit Submitted</h2>
          <p className="text-[#8f9cae] text-sm mb-6">
            Your deposit of <span className="text-white font-semibold">${parseFloat(amount).toLocaleString()}</span> via{" "}
            <span className="text-white font-semibold">{selected}</span> has been received and is pending admin confirmation.
          </p>
          <button
            onClick={() => { setSuccess(false); setStep(1); setSelected(null); setAmount(""); setProof(null); }}
            className="bg-[#0b66e4] hover:bg-[#0055cc] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Make Another Deposit
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="text-white max-w-3xl mx-auto space-y-8 px-2">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Fund Account</h1>
          <p className="text-[#8f9cae] text-sm mt-1">
            Deposit crypto to fund your investment account. Funds are confirmed within 30 minutes after network confirmation.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                  step > s.n
                    ? "bg-[#10b981] border-[#10b981] text-white"
                    : step === s.n
                    ? "bg-[#0b66e4] border-[#0b66e4] text-white"
                    : "bg-transparent border-[#1e2638] text-[#8f9cae]"
                }`}>
                  {step > s.n ? "✓" : s.n}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step >= s.n ? "text-white" : "text-[#8f9cae]"}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 transition-all ${step > s.n ? "bg-[#10b981]" : "bg-[#1e2638]"}`} />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1: Select Crypto */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select a cryptocurrency</h2>
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
                    <p className="text-[#8f9cae] text-xs">{c.network}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Amount + Wallet Address */}
        {step === 2 && coin && (
          <div className="space-y-5">
            <button onClick={() => setStep(1)} className="text-xs text-[#8f9cae] hover:text-white flex items-center gap-1 transition-colors">
              ← Back
            </button>

            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${coin.bg} ${coin.border}`}>
              <span className="text-2xl font-bold" style={{ color: coin.color }}>{coin.icon}</span>
              <div>
                <p className="text-white font-semibold">{coin.name}</p>
                <p className="text-xs text-[#8f9cae]">{coin.network}</p>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 space-y-3">
              <p className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">
                Send {coin.symbol} to this address
              </p>
              <div className="flex items-center gap-3 bg-[#090d16] border border-[#1e2638] rounded-lg px-4 py-3">
                <p className="font-mono text-sm text-white break-all flex-1">{coin.address}</p>
                <CopyBtn text={coin.address} />
              </div>
              <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3">
                <span className="text-amber-400 text-sm mt-0.5">⚠</span>
                <p className="text-amber-400/80 text-xs leading-relaxed">
                  Only send <strong className="text-amber-300">{coin.symbol}</strong> on the <strong className="text-amber-300">{coin.network}</strong>. Sending other coins will result in permanent loss.
                </p>
              </div>
            </div>

            {/* Amount input */}
            <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 space-y-4">
              <p className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">Enter deposit amount (USD)</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8f9cae] font-semibold">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  min="500"
                  step="0.01"
                  className={`w-full bg-[#090d16] border pl-8 pr-4 py-3 rounded-lg text-white placeholder-[#8f9cae] focus:outline-none transition-colors ${
                    amountErr ? "border-red-500" : "border-[#1e2638] focus:border-[#0b66e4]"
                  }`}
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setAmountErr(validateAmount(e.target.value)); }}
                />
              </div>
              {amountErr && <p className="text-red-400 text-xs">{amountErr}</p>}
              <p className="text-xs text-[#8f9cae]">Minimum deposit: <span className="text-white font-semibold">$500</span></p>
            </div>

            <button
              onClick={() => { const err = validateAmount(amount); if (err) { setAmountErr(err); return; } setStep(3); }}
              disabled={!amount}
              className="w-full bg-[#0b66e4] hover:bg-[#0055cc] disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Continue →
            </button>
          </div>
        )}

        {/* STEP 3: Upload Proof */}
        {step === 3 && coin && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <button type="button" onClick={() => setStep(2)} className="text-xs text-[#8f9cae] hover:text-white flex items-center gap-1 transition-colors">
              ← Back
            </button>

            {/* Summary */}
            <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 space-y-3">
              <p className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">Deposit Summary</p>
              <div className="flex justify-between text-sm">
                <span className="text-[#8f9cae]">Method</span>
                <span className="text-white font-semibold">{coin.name} ({coin.symbol})</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8f9cae]">Amount</span>
                <span className="text-[#0b66e4] font-bold">${parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8f9cae]">Network</span>
                <span className="text-white">{coin.network}</span>
              </div>
              <div className="h-px bg-[#1e2638]" />
              <div className="flex items-center gap-2 bg-[#090d16] rounded-lg px-3 py-2">
                <span className="text-xs text-[#8f9cae]">To:</span>
                <span className="font-mono text-xs text-white/70 flex-1 truncate">{coin.address}</span>
                <CopyBtn text={coin.address} />
              </div>
            </div>

            {/* Proof upload */}
            <div className="bg-[#121824] border border-[#1e2638] rounded-xl p-5 space-y-3">
              <p className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">Upload Payment Proof</p>
              <p className="text-xs text-[#8f9cae]">
                Attach a screenshot or photo of your transaction confirmation.
              </p>
              <label className="flex flex-col items-center justify-center gap-3 bg-[#090d16] border-2 border-dashed border-[#1e2638] hover:border-[#0b66e4]/50 rounded-xl p-8 cursor-pointer transition-colors">
                <span className="text-3xl">{proof ? "✓" : "📎"}</span>
                <span className="text-sm text-[#8f9cae]">
                  {proof ? proof.name : "Click to upload image"}
                </span>
                <span className="text-xs text-[#8f9cae]">PNG, JPG, JPEG — Max 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setProof(e.target.files[0])}
                />
              </label>
            </div>

            <div className="flex items-start gap-2 bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg px-4 py-3">
              <span className="text-[#10b981] mt-0.5">ℹ</span>
              <p className="text-[#10b981]/80 text-xs leading-relaxed">
                After submitting, an admin will review your payment proof and credit your account within <strong className="text-[#10b981]">30 minutes</strong>.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#10b981] hover:bg-[#0d9e6f] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? "Submitting…" : "Confirm Deposit"}
            </button>
          </form>
        )}

      </div>
    </DashboardLayout>
  );
}

export default FundAccount;