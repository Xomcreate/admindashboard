import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import API from '../api/axios'
import Loader from '../MainComponets/Loader'

function Withdrawals() {
  const [withdrawals,    setWithdrawals]    = useState([])
  const [investors,      setInvestors]      = useState([])
  const [investments,    setInvestments]    = useState([])
  const [loading,        setLoading]        = useState(true)
  const [submitting,     setSubmitting]     = useState(false)
  const [formError,      setFormError]      = useState("")
  const [selectedInvestor, setSelectedInvestor] = useState(null)
  const [form, setForm] = useState({
    investor:       "",
    amount:         "",
    wallet_address: "",
    status:         "Pending",
  })

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [wdRes, invRes, investRes] = await Promise.all([
        API.get("withdrawals/"),
        API.get("investors/"),
        API.get("investments/"),
      ])
      setWithdrawals(wdRes.data)
      setInvestors(invRes.data)
      setInvestments(investRes.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // ── When investor changes, look up their profile + lock status ────────────
  const handleInvestorChange = (e) => {
    const id = e.target.value
    setForm({ ...form, investor: id, amount: "", wallet_address: "" })
    setFormError("")

    if (!id) {
      setSelectedInvestor(null)
      return
    }

    const inv = investors.find((i) => String(i.id) === String(id))
    if (!inv) { setSelectedInvestor(null); return }

    // Check if this investor has an active locked investment
    const now = new Date()
    const lockedInv = investments.find((investment) => {
      if (
        String(investment.investor) !== String(id) &&
        String(investment.investor?.id) !== String(id)
      ) return false
      if (!investment.active || investment.status !== "Approved") return false
      const daysSince = (now - new Date(investment.created_at)) / (1000 * 60 * 60 * 24)
      return daysSince < 120
    })

    let unlockDate = null
    if (lockedInv) {
      unlockDate = new Date(
        new Date(lockedInv.created_at).getTime() + 120 * 24 * 60 * 60 * 1000
      )
    }

    setSelectedInvestor({
      ...inv,
      isLocked:   Boolean(lockedInv),
      unlockDate,
      daysLeft:   lockedInv
        ? Math.ceil((unlockDate - now) / (1000 * 60 * 60 * 24))
        : 0,
    })
  }

  // ── Create withdrawal ─────────────────────────────────────────────────────
  const createWithdrawal = async (e) => {
    e.preventDefault()
    setFormError("")

    const amount  = parseFloat(form.amount)
    const balance = parseFloat(selectedInvestor?.balance || 0)

    if (!form.investor) {
      setFormError("Please select an investor.")
      return
    }
    if (!amount || amount <= 0) {
      setFormError("Please enter a valid amount.")
      return
    }
    if (amount > balance) {
      setFormError(
        `Insufficient balance. ${selectedInvestor?.name} has $${balance.toFixed(2)} in their wallet.`
      )
      return
    }

    setSubmitting(true)
    try {
      await API.post("withdrawals/", {
        investor:       form.investor,
        amount:         form.amount,
        wallet_address: form.wallet_address,
        status:         form.status,
      })
      alert("Withdrawal Created Successfully")
      setForm({ investor: "", amount: "", wallet_address: "", status: "Pending" })
      setSelectedInvestor(null)
      fetchAll()
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.non_field_errors?.[0] ||
        "Failed to create withdrawal."
      setFormError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Approve / Reject / Delete ─────────────────────────────────────────────
  const approveWithdrawal = async (withdrawal) => {
    try {
      await API.patch(`withdrawals/${withdrawal.id}/`, { status: "Approved" })
      fetchAll()
    } catch (error) {
      const msg = error?.response?.data?.error || "Failed to approve withdrawal."
      alert(msg)
    }
  }

  const rejectWithdrawal = async (withdrawal) => {
    try {
      await API.patch(`withdrawals/${withdrawal.id}/`, { status: "Rejected" })
      fetchAll()
    } catch (error) {
      console.error(error)
    }
  }

  const deleteWithdrawal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this withdrawal?")) return
    try {
      await API.delete(`withdrawals/${id}/`)
      fetchAll()
    } catch (error) {
      console.error(error)
    }
  }

  const getInvestorName = (id) => {
    const inv = investors.find((i) => i.id === id)
    return inv ? inv.name : `#${id}`
  }

  const fmt = (n) =>
    Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  if (loading) return <Loader />

  return (
    <DashboardLayout>
      <div className="text-white font-sans max-w-6xl mx-auto space-y-8 p-4 min-h-screen bg-[#171515]">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Withdrawals</h1>
          <p className="text-[#9e9593] text-sm mt-1">
            Review balance requests, authorize distributions, or cancel tickets.
          </p>
        </div>

        {/* CREATE WITHDRAWAL FORM */}
        <div className="bg-[#1f1b1b] p-6 rounded-xl border border-[#2e2726] shadow-2xl">
          <h2 className="text-xl font-semibold mb-5 tracking-wide text-neutral-200">
            Create Withdrawal Request
          </h2>

          {/* Investor info panel */}
          {selectedInvestor && (
            <div className={`mb-5 rounded-xl px-5 py-4 border flex flex-col sm:flex-row sm:items-center gap-3 ${
              selectedInvestor.isLocked
                ? "bg-amber-500/10 border-amber-500/30"
                : "bg-emerald-500/10 border-emerald-500/30"
            }`}>
              <div className="flex-1 space-y-0.5">
                <p className={`font-bold text-sm ${selectedInvestor.isLocked ? "text-amber-300" : "text-emerald-300"}`}>
                  {selectedInvestor.isLocked ? "🔒 Investment Locked" : "✅ Withdrawals Open"}
                </p>
                <p className={`text-xs ${selectedInvestor.isLocked ? "text-amber-400/80" : "text-emerald-400/80"}`}>
                  {selectedInvestor.isLocked
                    ? `${selectedInvestor.name}'s investment is within the 120-day lock period. ${selectedInvestor.daysLeft} day${selectedInvestor.daysLeft !== 1 ? "s" : ""} remaining.`
                    : `${selectedInvestor.name} has no active locked investment. Withdrawals are available.`}
                </p>
                {selectedInvestor.isLocked && selectedInvestor.unlockDate && (
                  <p className="text-amber-300 text-xs font-semibold">
                    Unlocks:{" "}
                    {selectedInvestor.unlockDate.toLocaleDateString(undefined, {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[#9e9593] text-xs uppercase tracking-wider">Wallet Balance</p>
                <p className="text-xl font-bold text-[#c45a45]">
                  ${fmt(selectedInvestor.balance || 0)}
                </p>
              </div>
            </div>
          )}

          {formError && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-lg mb-5">
              {formError}
            </p>
          )}

          <form onSubmit={createWithdrawal} className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* SELECT INVESTOR */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#9e9593] uppercase tracking-wider">
                Investor
              </label>
              <select
                className="bg-[#121010] border border-[#2e2726] p-3 rounded-lg text-white focus:outline-none focus:border-[#c45a45] transition-colors cursor-pointer"
                value={form.investor}
                onChange={handleInvestorChange}
                required
              >
                <option value="" className="bg-[#1f1b1b]">Select Investor</option>
                {investors
                  .filter((inv) => inv.role !== "admin")
                  .map((investor) => (
                    <option key={investor.id} value={investor.id} className="bg-[#1f1b1b]">
                      {investor.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* AMOUNT */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#9e9593] uppercase tracking-wider">
                Withdrawal Amount ($)
              </label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                className="bg-[#121010] border border-[#2e2726] p-3 rounded-lg text-white placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45] transition-colors"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
              {selectedInvestor && (
                <p className="text-xs text-[#9e9593]">
                  Max: ${fmt(selectedInvestor.balance || 0)}
                </p>
              )}
            </div>

            {/* WALLET ADDRESS */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#9e9593] uppercase tracking-wider">
                Wallet Address
              </label>
              <input
                type="text"
                placeholder="BTC / ETH wallet address"
                className="bg-[#121010] border border-[#2e2726] p-3 rounded-lg text-white placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45] transition-colors font-mono text-sm"
                value={form.wallet_address}
                onChange={(e) => setForm({ ...form, wallet_address: e.target.value })}
                required
              />
            </div>

            {/* STATUS */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#9e9593] uppercase tracking-wider">
                Payout Status
              </label>
              <select
                className="bg-[#121010] border border-[#2e2726] p-3 rounded-lg text-white focus:outline-none focus:border-[#c45a45] transition-colors cursor-pointer"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Pending"  className="bg-[#1f1b1b]">Pending</option>
                <option value="Approved" className="bg-[#1f1b1b]">Approved</option>
                <option value="Rejected" className="bg-[#1f1b1b]">Rejected</option>
              </select>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#c45a45] hover:bg-[#a64633] disabled:opacity-50 text-white p-3 rounded-lg font-semibold tracking-wide shadow-2xl transition-all duration-200 col-span-1 md:col-span-2 mt-2 cursor-pointer"
            >
              {submitting ? "Creating..." : "Create Withdrawal"}
            </button>
          </form>
        </div>

        {/* WITHDRAWALS TABLE */}
        <div className="bg-[#1f1b1b] p-6 rounded-xl border border-[#2e2726] shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold tracking-wide text-neutral-200">
              All Withdrawals
            </h2>
            <span className="text-xs text-[#9e9593]">
              {withdrawals.length} record{withdrawals.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#2e2726]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#121010] text-[#9e9593] uppercase text-xs font-semibold tracking-wider">
                  <th className="p-4 text-left border-b border-[#2e2726]">Investor</th>
                  <th className="p-4 text-left border-b border-[#2e2726]">Amount</th>
                  <th className="p-4 text-left border-b border-[#2e2726]">Wallet</th>
                  <th className="p-4 text-center border-b border-[#2e2726]">Status</th>
                  <th className="p-4 text-left border-b border-[#2e2726]">Date</th>
                  <th className="p-4 text-center border-b border-[#2e2726]">Actions</th>
                </tr>
              </thead>

              <tbody>
                {withdrawals.length > 0 ? (
                  withdrawals.map((withdrawal) => (
                    <tr
                      key={withdrawal.id}
                      className="border-b border-[#2e2726] hover:bg-[#2e2726]/40 transition-colors"
                    >
                      <td className="p-4 font-medium text-[#c45a45]">
                        {getInvestorName(withdrawal.investor)}
                      </td>
                      <td className="p-4 font-semibold text-white">
                        ${fmt(withdrawal.amount)}
                      </td>
                      <td className="p-4 text-[#9e9593] font-mono text-xs max-w-35 truncate">
                        {withdrawal.wallet_address || "—"}
                      </td>
                      <td className="p-4 text-center">
                        {withdrawal.status === "Approved" ? (
                          <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-medium inline-block w-24">
                            Approved
                          </span>
                        ) : withdrawal.status === "Rejected" ? (
                          <span className="bg-red-500/15 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-medium inline-block w-24">
                            Rejected
                          </span>
                        ) : (
                          <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-medium inline-block w-24">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-[#9e9593]">
                        {new Date(withdrawal.created_at).toLocaleDateString(undefined, {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          {withdrawal.status === "Pending" && (
                            <>
                              <button
                                onClick={() => approveWithdrawal(withdrawal)}
                                className="bg-emerald-600/20 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectWithdrawal(withdrawal)}
                                className="bg-amber-600/20 hover:bg-amber-500 text-amber-400 hover:text-white border border-amber-500/30 text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteWithdrawal(withdrawal.id)}
                            className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center p-8 text-[#9e9593] bg-[#121010]/50 italic"
                    >
                      No Withdrawals Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default Withdrawals