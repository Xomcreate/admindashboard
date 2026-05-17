import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import API from '../api/axios'
import Loader from '../MainComponets/Loader'

function Investments() {
  const [investments, setInvestments] = useState([])
  const [investors, setInvestors] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    investor: "",
    amount: "",
    daily_roi: "",
    active: true
  })

  // FETCH DATA
  useEffect(() => {
    fetchInvestments()
    fetchInvestors()
  }, [])

  // GET INVESTMENTS
  const fetchInvestments = async () => {
    try {
      const res = await API.get("investments/")
      setInvestments(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // GET INVESTORS
  const fetchInvestors = async () => {
    try {
      const res = await API.get("investors/")
      setInvestors(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  // CREATE INVESTMENT
  const createInvestment = async (e) => {
    e.preventDefault()
    try {
      await API.post("investments/", form)
      alert("Investment Created Successfully")
      setForm({
        investor: "",
        amount: "",
        daily_roi: "",
        active: true
      })
      fetchInvestments()
    } catch (error) {
      console.log(error)
      alert("Failed To Create Investment")
    }
  }

  // DELETE INVESTMENT
  const deleteInvestment = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this investment?"
    )
    if (!confirmDelete) return

    try {
      await API.delete(`investments/${id}/`)
      fetchInvestments()
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
          
          {/* PAGE HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-wide">Investments</h1>
              <p className="text-[#64748b] text-sm mt-1">Issue new investments and track active market contracts.</p>
            </div>
          </div>

          {/* CREATE INVESTMENT FORM */}
          <div className="bg-[#111c44] p-6 rounded-xl border border-[#1e295d] shadow-2xl">
            <h2 className="text-xl font-semibold mb-5 tracking-wide text-slate-100">
              Create Investment
            </h2>

            <form
              onSubmit={createInvestment}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {/* INVESTOR SELECT */}
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

              {/* AMOUNT INPUT */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Investment Amount ($)</label>
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

              {/* DAILY ROI INPUT */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Daily ROI %</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 2.5"
                  className="bg-[#0a1128] border border-[#1e295d] p-3 rounded-lg text-white placeholder-[#64748b] focus:outline-none focus:border-[#10b981] transition-colors"
                  value={form.daily_roi}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      daily_roi: e.target.value
                    })
                  }
                  required
                />
              </div>

              {/* ACTIVE STATUS SELECT */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Initial Status</label>
                <select
                  className="bg-[#0a1128] border border-[#1e295d] p-3 rounded-lg text-white focus:outline-none focus:border-[#10b981] transition-colors cursor-pointer"
                  value={form.active}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      active: e.target.value === "true"
                    })
                  }
                >
                  <option value={true} className="bg-[#111c44]">Active</option>
                  <option value={false} className="bg-[#111c44]">Inactive</option>
                </select>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                className="bg-[#10b981] hover:bg-[#0d9488] text-white p-3 rounded-lg font-semibold tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all duration-200 col-span-1 md:col-span-2 mt-2 cursor-pointer"
              >
                Create New Contract
              </button>
            </form>
          </div>

          {/* INVESTMENTS TABLE */}
          <div className="bg-[#111c44] p-6 rounded-xl border border-[#1e295d] shadow-2xl">
            <h2 className="text-xl font-semibold mb-5 tracking-wide text-slate-100">
              All Investments
            </h2>

            <div className="overflow-x-auto rounded-lg border border-[#1e295d]">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#0f1a3e] text-[#94a3b8] uppercase text-xs font-semibold tracking-wider">
                    <th className="p-4 text-left border-b border-[#1e295d]">Investor ID</th>
                    <th className="p-4 text-left border-b border-[#1e295d]">Amount</th>
                    <th className="p-4 text-left border-b border-[#1e295d]">Daily ROI</th>
                    <th className="p-4 text-center border-b border-[#1e295d]">Status</th>
                    <th className="p-4 text-left border-b border-[#1e295d]">Date Issued</th>
                    <th className="p-4 text-center border-b border-[#1e295d]">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {investments.length > 0 ? (
                    investments.map((investment) => (
                      <tr
                        key={investment.id}
                        className="border-b border-[#1e295d] hover:bg-[#172554] transition-colors"
                      >
                        <td className="p-4 font-mono text-[#38bdf8] font-medium">
                          #{investment.investor}
                        </td>
                        <td className="p-4 font-semibold text-white">
                          ${investment.amount}
                        </td>
                        <td className="p-4 font-semibold text-[#10b981]">
                          {investment.daily_roi}%
                        </td>
                        <td className="p-4 text-center">
                          {investment.active ? (
                            <span className="bg-emerald-500/15 text-[#10b981] border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-medium">
                              Active
                            </span>
                          ) : (
                            <span className="bg-red-500/15 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-medium">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-[#94a3b8]">
                          {new Date(investment.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => deleteInvestment(investment.id)}
                            className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-semibold px-4 py-1.5 rounded-md transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center p-8 text-[#64748b] bg-[#0f1a3e]/50 italic"
                      >
                        No Investments Found
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

export default Investments;