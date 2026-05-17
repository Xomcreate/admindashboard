// src/pages/Investors.jsx

import React, { useEffect, useState } from 'react'

import DashboardLayout from '../layouts/DashboardLayout'
import API from '../api/axios'
import Loader from '../MainComponets/Loader'

function Investors() {

  const [investors, setInvestors] = useState([])

  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    balance: "",
    bonus: "",
    blocked: false
  })


  // FETCH INVESTORS

  useEffect(() => {

    fetchInvestors()

  }, [])


  // GET INVESTORS

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


  // ADD INVESTOR

  const addInvestor = async (e) => {

    e.preventDefault()

    try {

      await API.post(
        "investors/",
        form
      )

      alert("Investor Added Successfully")

      setShowModal(false)

      setForm({
        name: "",
        email: "",
        phone: "",
        balance: "",
        bonus: "",
        blocked: false
      })

      fetchInvestors()

    } catch (error) {

      console.log(error)

      alert("Failed To Add Investor")

    }
  }


  // BLOCK USER

  const blockUser = async (id, investor) => {

    try {

      await API.put(
        `investors/${id}/`,
        {
          ...investor,
          blocked: true
        }
      )

      fetchInvestors()

    } catch (error) {

      console.log(error)

    }
  }


  // UNBLOCK USER

  const unblockUser = async (id, investor) => {

    try {

      await API.put(
        `investors/${id}/`,
        {
          ...investor,
          blocked: false
        }
      )

      fetchInvestors()

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

        <div className="bg-[#111c44] p-6 rounded-xl border border-[#1e295d] shadow-2xl text-white font-sans">

          {/* HEADER */}

          <div className="flex justify-between items-center mb-6">

            <div>

              <h1 className="text-3xl font-bold tracking-wide">
                Investors
              </h1>

              <p className="text-[#64748b] text-sm mt-1">
                Manage registered platform accounts.
              </p>

            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-[#10b981] hover:bg-[#0d9488] text-white px-5 py-2.5 rounded-lg font-semibold"
            >
              Add Investor
            </button>

          </div>


          {/* TABLE */}

          <div className="overflow-x-auto rounded-lg border border-[#1e295d]">

            <table className="w-full border-collapse text-sm">

              <thead>

                <tr className="bg-[#0f1a3e] text-[#94a3b8] uppercase text-xs font-semibold">

                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Email
                  </th>

                  <th className="p-4 text-left">
                    Phone
                  </th>

                  <th className="p-4 text-left">
                    Balance
                  </th>

                  <th className="p-4 text-left">
                    Bonus
                  </th>

                  <th className="p-4 text-center">
                    Status
                  </th>

                  <th className="p-4 text-center">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {

                  investors.length > 0 ?

                  investors.map((investor) => (

                    <tr
                      key={investor.id}
                      className="border-b border-[#1e295d] hover:bg-[#172554]"
                    >

                      <td className="p-4">
                        {investor.name}
                      </td>

                      <td className="p-4">
                        {investor.email}
                      </td>

                      <td className="p-4">
                        {investor.phone}
                      </td>

                      <td className="p-4 font-semibold">
                        ${investor.balance}
                      </td>

                      <td className="p-4 text-[#10b981] font-semibold">
                        ${investor.bonus}
                      </td>

                      <td className="p-4 text-center">

                        {

                          investor.blocked ?

                          <span className="bg-red-500/15 text-red-400 px-3 py-1 rounded-full text-xs">
                            Blocked
                          </span>

                          :

                          <span className="bg-emerald-500/15 text-[#10b981] px-3 py-1 rounded-full text-xs">
                            Active
                          </span>

                        }

                      </td>

                      <td className="p-4">

                        <div className="flex justify-center gap-2">

                          {

                            investor.blocked ?

                            <button
                              onClick={() =>
                                unblockUser(
                                  investor.id,
                                  investor
                                )
                              }
                              className="bg-emerald-600 px-4 py-1 rounded text-xs"
                            >
                              Unblock
                            </button>

                            :

                            <button
                              onClick={() =>
                                blockUser(
                                  investor.id,
                                  investor
                                )
                              }
                              className="bg-red-600 px-4 py-1 rounded text-xs"
                            >
                              Block
                            </button>

                          }

                        </div>

                      </td>

                    </tr>

                  ))

                  :

                  <tr>

                    <td
                      colSpan="7"
                      className="text-center p-8 text-[#64748b]"
                    >
                      No Investors Found
                    </td>

                  </tr>

                }

              </tbody>

            </table>

          </div>

        </div>


        {/* ADD INVESTOR MODAL */}

        {

          showModal && (

            <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

              <div className="bg-[#111c44] w-125 p-6 rounded-xl border border-[#1e295d]">

                <h2 className="text-2xl font-bold text-white mb-5">
                  Add Investor
                </h2>

                <form
                  onSubmit={addInvestor}
                  className="grid grid-cols-2 gap-4"
                >

                  <input
                    type="text"
                    placeholder="Full Name"
                    className="bg-[#0f1a3e] border border-[#1e295d] p-3 rounded text-white"
                    value={form.name}
                    onChange={(e)=>
                      setForm({
                        ...form,
                        name:e.target.value
                      })
                    }
                    required
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    className="bg-[#0f1a3e] border border-[#1e295d] p-3 rounded text-white"
                    value={form.email}
                    onChange={(e)=>
                      setForm({
                        ...form,
                        email:e.target.value
                      })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Phone"
                    className="bg-[#0f1a3e] border border-[#1e295d] p-3 rounded text-white"
                    value={form.phone}
                    onChange={(e)=>
                      setForm({
                        ...form,
                        phone:e.target.value
                      })
                    }
                    required
                  />

                  <input
                    type="number"
                    placeholder="Balance"
                    className="bg-[#0f1a3e] border border-[#1e295d] p-3 rounded text-white"
                    value={form.balance}
                    onChange={(e)=>
                      setForm({
                        ...form,
                        balance:e.target.value
                      })
                    }
                    required
                  />

                  <input
                    type="number"
                    placeholder="Bonus"
                    className="bg-[#0f1a3e] border border-[#1e295d] p-3 rounded text-white"
                    value={form.bonus}
                    onChange={(e)=>
                      setForm({
                        ...form,
                        bonus:e.target.value
                      })
                    }
                    required
                  />

                  <div className="col-span-2 flex gap-3 mt-3">

                    <button
                      type="submit"
                      className="bg-[#10b981] flex-1 py-3 rounded font-semibold"
                    >
                      Save Investor
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-red-600 flex-1 py-3 rounded font-semibold"
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              </div>

            </div>

          )

        }

      </DashboardLayout>

    </>
  )
}

export default Investors