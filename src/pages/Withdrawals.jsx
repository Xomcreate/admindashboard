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
    status: "Pending"
  })

  // FETCH DATA
  useEffect(() => {
    fetchWithdrawals()
    fetchInvestors()
  }, [])

  // FETCH WITHDRAWALS FROM BACKEND
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

  // FETCH INVESTORS
  const fetchInvestors = async () => {
    try {
      const res = await API.get("investors/")
      setInvestors(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  // CREATE WITHDRAWAL
  const createWithdrawal = async (e) => {
    e.preventDefault()
    try {
      await API.post("withdrawals/", form)
      alert("Withdrawal Created Successfully")
      setForm({
        investor: "",
        amount: "",
        status: "Pending"
      })
      fetchWithdrawals()
    } catch (error) {
      console.log(error)
      alert("Failed To Create Withdrawal")
    }
  }

  // APPROVE WITHDRAWAL
  const approveWithdrawal = async (withdrawal) => {
    try {
      await API.put(`withdrawals/${withdrawal.id}/`, {
        ...withdrawal,
        status: "Approved"
      })
      fetchWithdrawals()
    } catch (error) {
      console.log(error)
    }
  }

  // REJECT WITHDRAWAL
  const rejectWithdrawal = async (withdrawal) => {
    try {
      await API.put(`withdrawals/${withdrawal.id}/`, {
        ...withdrawal,
        status: "Rejected"
      })
      fetchWithdrawals()
    } catch (error) {
      console.log(error)
    }
  }

  // DELETE WITHDRAWAL
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

  // LOADER
  if (loading) {
    return <Loader />
  }

  return (
    <>
      <DashboardLayout>
        <div className="text-white font-sans max-w-6xl mx-auto space-y-8">
          
          {/* HEADER SECTION */}
          <div>
            <h1 className="text-3xl font-bold tracking-wide">Withdrawals</h1>
            <p className="text-[#64748b] text-sm mt-1">Review balance requests, authorize distributions, or cancel tickets.</p>
          </div>

          {/* CREATE WITHDRAWAL FORM */}
          <div className="bg-[#111c44] p-6 rounded-xl border border-[#1e295d] shadow-2xl">
            <h2 className="text-xl font-semibold mb-5 tracking-wide text-slate-100">
              Create Withdrawal Request
            </h2>

            <form
              onSubmit={createWithdrawal}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {/* SELECT INVESTOR */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Investor</label>
                <select
                  className="bg-[#0a1128] border border-[#1e295d] p-3 rounded-lg text-white focus:outline-none focus:border-[#10b981] transition-colors cursor-pointer"
                  value={form.investor}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      investor: e.target.value
                    })
                  }
                  required
                >
                  <option value="" className="bg-[#111c44]">Select Investor</option>
                  {investors.map((investor) => (
                    <option key={investor.id} value={investor.id} className="bg-[#111c44]">
                      {investor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* AMOUNT */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Withdrawal Amount ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="bg-[#0a1128] border border-[#1e295d] p-3 rounded-lg text-white placeholder-[#64748b] focus:outline-none focus:border-[#10b981] transition-colors"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: e.target.value
                    })
                  }
                  required
                />
              </div>

              {/* STATUS */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Payout Status</label>
                <select
                  className="bg-[#0a1128] border border-[#1e295d] p-3 rounded-lg text-white focus:outline-none focus:border-[#10b981] transition-colors cursor-pointer"
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value
                    })
                  }
                >
                  <option value="Pending" className="bg-[#111c44]">Pending</option>
                  <option value="Approved" className="bg-[#111c44]">Approved</option>
                  <option value="Rejected" className="bg-[#111c44]">Rejected</option>
                </select>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                className="bg-[#10b981] hover:bg-[#0d9488] text-white p-3 rounded-lg font-semibold tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all duration-200 col-span-1 md:col-span-3 mt-2 cursor-pointer"
              >
                Create Withdrawal
              </button>
            </form>
          </div>

          {/* WITHDRAWALS TABLE */}
          <div className="bg-[#111c44] p-6 rounded-xl border border-[#1e295d] shadow-2xl">
            <h2 className="text-xl font-semibold mb-5 tracking-wide text-slate-100">
              All Withdrawals
            </h2>

            <div className="overflow-x-auto rounded-lg border border-[#1e295d]">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#0f1a3e] text-[#94a3b8] uppercase text-xs font-semibold tracking-wider">
                    <th className="p-4 text-left border-b border-[#1e295d]">Investor ID</th>
                    <th className="p-4 text-left border-b border-[#1e295d]">Amount</th>
                    <th className="p-4 text-center border-b border-[#1e295d]">Status</th>
                    <th className="p-4 text-left border-b border-[#1e295d]">Date</th>
                    <th className="p-4 text-center border-b border-[#1e295d]">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {withdrawals.length > 0 ? (
                    withdrawals.map((withdrawal) => (
                      <tr
                        key={withdrawal.id}
                        className="border-b border-[#1e295d] hover:bg-[#172554] transition-colors"
                      >
                        <td className="p-4 font-mono text-[#38bdf8] font-medium">
                          #{withdrawal.investor}
                        </td>
                        <td className="p-4 font-semibold text-white">
                          ${Number(withdrawal.amount).toLocaleString()}
                        </td>
                        <td className="p-4 text-center">
                          {withdrawal.status === "Approved" ? (
                            <span className="bg-emerald-500/15 text-[#10b981] border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-medium inline-block w-24">
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
                        <td className="p-4 text-[#94a3b8]">
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
                                  className="bg-emerald-600/20 hover:bg-[#10b981] text-[#10b981] hover:text-white border border-emerald-500/30 text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer"
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
                        colSpan="5"
                        className="text-center p-8 text-[#64748b] bg-[#0f1a3e]/50 italic"
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