import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import API from '../api/axios'
import Loader from '../MainComponets/Loader'

function Bonuses() {
  const [investors, setInvestors] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    investor: "",
    bonus: ""
  })

  useEffect(() => {
    fetchInvestors()
  }, [])

  const fetchInvestors = async () => {
    try {
      const res = await API.get("investors/")
      setInvestors(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const addBonus = async (e) => {
    e.preventDefault()
    try {
      const selectedInvestor = investors.find(
        (inv) => inv.id == form.investor
      )
      if (!selectedInvestor) {
        alert("Please select a valid investor.")
        return
      }

      const newBonus = parseFloat(selectedInvestor.bonus) + parseFloat(form.bonus)

      await API.patch(`investors/${form.investor}/`, {
        bonus: newBonus
      })

      alert("Bonus Added Successfully")
      setForm({ investor: "", bonus: "" })
      fetchInvestors()
    } catch (error) {
      console.log(error)
      alert("Failed To Add Bonus")
    }
  }

  const removeBonus = async (investor) => {
    try {
      await API.patch(`investors/${investor.id}/`, { bonus: 0 })
      fetchInvestors()
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <DashboardLayout>
        <div className="text-white font-sans max-w-6xl mx-auto space-y-8">

          <div>
            <h1 className="text-3xl font-bold tracking-wide">Bonuses Management</h1>
            <p className="text-[#8f9cae] text-sm mt-1">Distribute special promo rewards or revoke manual bonuses from active accounts.</p>
          </div>

          {/* BONUS FORM */}
          <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638]">
            <h2 className="text-xl font-semibold mb-5 tracking-wide text-white">
              Add Manual Bonus
            </h2>

            <form onSubmit={addBonus} className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#8f9cae] uppercase tracking-wider">Bonus Amount ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="bg-[#090d16] border border-[#1e2638] p-3 rounded-lg text-white placeholder-[#8f9cae] focus:outline-none focus:border-[#0b66e4] transition-colors"
                  value={form.bonus}
                  onChange={(e) => setForm({ ...form, bonus: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-[#0b66e4] hover:bg-[#0055cc] text-white p-3 rounded-lg font-semibold tracking-wide transition-all duration-200 col-span-1 md:col-span-2 mt-2 cursor-pointer disabled:opacity-50"
              >
                Add Bonus
              </button>
            </form>
          </div>

          {/* BONUS TABLE */}
          <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638]">
            <h2 className="text-xl font-semibold mb-5 tracking-wide text-white">
              Investor Bonuses
            </h2>

            <div className="overflow-x-auto rounded-lg border border-[#1e2638]">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#090d16] text-[#8f9cae] uppercase text-xs font-semibold tracking-wider">
                    <th className="p-4 text-left border-b border-[#1e2638]">Investor</th>
                    <th className="p-4 text-left border-b border-[#1e2638]">Email</th>
                    <th className="p-4 text-left border-b border-[#1e2638]">Current Bonus</th>
                    <th className="p-4 text-center border-b border-[#1e2638]">Status</th>
                    <th className="p-4 text-center border-b border-[#1e2638]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investors.length > 0 ? (
                    investors.map((investor) => (
                      <tr
                        key={investor.id}
                        className="border-b border-[#1e2638] hover:bg-[#1e2638]/50 transition-colors"
                      >
                        <td className="p-4 font-semibold text-white">{investor.name}</td>
                        <td className="p-4 text-[#8f9cae]">{investor.email}</td>
                        <td className="p-4 font-bold text-[#10b981]">
                          ${Number(investor.bonus).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-center">
                          {investor.blocked ? (
                            <span className="bg-red-500/15 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-medium inline-block w-20">
                              Blocked
                            </span>
                          ) : (
                            <span className="bg-[#0b66e4]/15 text-[#0b66e4] border border-[#0b66e4]/30 px-3 py-1 rounded-full text-xs font-medium inline-block w-20">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => removeBonus(investor)}
                            disabled={parseFloat(investor.bonus) === 0}
                            className={`text-xs font-semibold px-4 py-1.5 rounded-md transition-all ${
                              parseFloat(investor.bonus) === 0
                                ? "bg-[#1e2638] text-[#8f9cae] border border-[#1e2638] cursor-not-allowed"
                                : "bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 cursor-pointer"
                            }`}
                          >
                            Remove Bonus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-8 text-[#8f9cae] bg-[#090d16]/50 italic">
                        No Investors Found
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

export default Bonuses