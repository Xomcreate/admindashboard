import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import API from '../api/axios'
import Loader from '../MainComponets/Loader'

function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState([])
  const [investors, setInvestors] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    investor: "",
    amount: "",
    wallet_address: "",
    status: "Pending"
  })

  useEffect(() => {
    fetchWithdrawals()
    fetchInvestors()
  }, [])

  const fetchWithdrawals = async () => {
    try {
      const res = await API.get("withdrawals/")
      setWithdrawals(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchInvestors = async () => {
    try {
      const res = await API.get("investors/")
      setInvestors(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const createWithdrawal = async (e) => {
    e.preventDefault()
    try {
      await API.post("withdrawals/", {
        investor:       form.investor,
        amount:         form.amount,
        wallet_address: form.wallet_address,
        status:         form.status,
      })
      alert("Withdrawal Created Successfully")
      setForm({ investor: "", amount: "", wallet_address: "", status: "Pending" })
      fetchWithdrawals()
    } catch (error) {
      console.log(error?.response?.data || error)
      alert("Failed To Create Withdrawal")
    }
  }

  const approveWithdrawal = async (withdrawal) => {
    try {
      await API.patch(`withdrawals/${withdrawal.id}/`, { status: "Approved" })
      fetchWithdrawals()
    } catch (error) {
      console.log(error)
    }
  }

  const rejectWithdrawal = async (withdrawal) => {
    try {
      await API.patch(`withdrawals/${withdrawal.id}/`, { status: "Rejected" })
      fetchWithdrawals()
    } catch (error) {
      console.log(error)
    }
  }

  const deleteWithdrawal = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this withdrawal?"
    )
    if (!confirmDelete) return

    try {
      await API.delete(`withdrawals/${id}/`)
      fetchWithdrawals()
    } catch (error) {
      console.log(error)
    }
  }

  const getInvestorName = (id) => {
    const inv = investors.find((i) => i.id === id)
    return inv ? inv.name : `#${id}`
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <DashboardLayout>
        <div className="text-white font-sans max-w-6xl mx-auto space-y-8 p-4">

          {/* HEADER SECTION */}
          <div>
            <h1 className="text-3xl font-bold tracking-wide">Withdrawals</h1>
            <p className="text-[#8f9cae] text-sm mt-1">Review balance requests, authorize distributions, or cancel tickets.</p>
          </div>

          {/* CREATE WITHDRAWAL FORM */}
          <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638] shadow-2xl">
            <h2 className="text-xl font-semibold mb-5 tracking-wide text-slate-100">
              Create Withdrawal Request
            </h2>

            <form
              onSubmit={createWithdrawal}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {/* SELECT INVESTOR */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">Investor</label>
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

              {/* AMOUNT */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">Withdrawal Amount ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg text-white placeholder-[#8f9cae] focus:outline-none focus:border-[#0b66e4] transition-colors"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>

              {/* WALLET ADDRESS */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">Wallet Address</label>
                <input
                  type="text"
                  placeholder="BTC / ETH wallet address"
                  className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg text-white placeholder-[#8f9cae] focus:outline-none focus:border-[#0b66e4] transition-colors font-mono text-sm"
                  value={form.wallet_address}
                  onChange={(e) => setForm({ ...form, wallet_address: e.target.value })}
                  required
                />
              </div>

              {/* STATUS */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">Payout Status</label>
                <select
                  className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg text-white focus:outline-none focus:border-[#0b66e4] transition-colors cursor-pointer"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Pending" className="bg-[#121824]">Pending</option>
                  <option value="Approved" className="bg-[#121824]">Approved</option>
                  <option value="Rejected" className="bg-[#121824]">Rejected</option>
                </select>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="bg-[#0b66e4] hover:bg-[#0055cc] text-white p-3 rounded-lg font-semibold tracking-wide shadow-2xl transition-all duration-200 col-span-1 md:col-span-2 mt-2 cursor-pointer"
              >
                Create Withdrawal
              </button>
            </form>
          </div>

          {/* WITHDRAWALS TABLE */}
          <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638] shadow-2xl">
            <h2 className="text-xl font-semibold mb-5 tracking-wide text-slate-100">
              All Withdrawals
            </h2>

            <div className="overflow-x-auto rounded-lg border border-[#1e2638]">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#090d16] text-[#8f9cae] uppercase text-xs font-semibold tracking-wider">
                    <th className="p-4 text-left border-b border-[#1e2638]">Investor</th>
                    <th className="p-4 text-left border-b border-[#1e2638]">Amount</th>
                    <th className="p-4 text-left border-b border-[#1e2638]">Wallet</th>
                    <th className="p-4 text-center border-b border-[#1e2638]">Status</th>
                    <th className="p-4 text-left border-b border-[#1e2638]">Date</th>
                    <th className="p-4 text-center border-b border-[#1e2638]">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {withdrawals.length > 0 ? (
                    withdrawals.map((withdrawal) => (
                      <tr
                        key={withdrawal.id}
                        className="border-b border-[#1e2638] hover:bg-[#1e2638] transition-colors"
                      >
                        <td className="p-4 font-medium text-[#0b66e4]">
                          {getInvestorName(withdrawal.investor)}
                        </td>
                        <td className="p-4 font-semibold text-white">
                          ${Number(withdrawal.amount).toLocaleString()}
                        </td>
                        <td className="p-4 text-[#8f9cae] font-mono text-xs max-w-35 truncate">
                          {withdrawal.wallet_address || '—'}
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
                        <td className="p-4 text-[#8f9cae]">
                          {new Date(withdrawal.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
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
                        className="text-center p-8 text-[#8f9cae] bg-[#090d16]/50 italic"
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
    </>
  )
}

export default Withdrawals