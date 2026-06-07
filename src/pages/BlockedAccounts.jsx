import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import API from '../api/axios'
import Loader from '../MainComponets/Loader'

function BlockedAccounts() {
  const [blockedUsers, setBlockedUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlockedUsers()
  }, [])

  const fetchBlockedUsers = async () => {
    try {
      const res = await API.get("investors/")
      const blocked = res.data.filter((user) => user.blocked === true)
      setBlockedUsers(blocked)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const unblockAccount = async (user) => {
    try {
      await API.patch(`investors/${user.id}/`, { blocked: false })
      alert("Account Unblocked Successfully")
      fetchBlockedUsers()
    } catch (error) {
      console.log(error)
      alert("Failed To Unblock Account")
    }
  }

  const deleteAccount = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this account?"
    )
    if (!confirmDelete) return

    try {
      await API.delete(`investors/${id}/`)
      fetchBlockedUsers()
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
            <h1 className="text-3xl font-bold tracking-wide">Blocked Accounts</h1>
            <p className="text-[#8f9cae] text-sm mt-1">Review restricted users, restore account accessibility, or remove accounts entirely.</p>
          </div>

          <div className="bg-[#121824] p-6 rounded-xl border border-[#1e2638]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold tracking-wide text-white">
                All Blocked Investors
              </h2>
              <span className="text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30 px-3 py-1 rounded-full">
                {blockedUsers.length} blocked
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#1e2638]">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#090d16] text-[#8f9cae] uppercase text-xs font-semibold tracking-wider">
                    <th className="p-4 text-left border-b border-[#1e2638]">Name</th>
                    <th className="p-4 text-left border-b border-[#1e2638]">Email</th>
                    <th className="p-4 text-left border-b border-[#1e2638]">Phone</th>
                    <th className="p-4 text-left border-b border-[#1e2638]">Balance</th>
                    <th className="p-4 text-left border-b border-[#1e2638]">Bonus</th>
                    <th className="p-4 text-center border-b border-[#1e2638]">Status</th>
                    <th className="p-4 text-center border-b border-[#1e2638]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blockedUsers.length > 0 ? (
                    blockedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-[#1e2638] hover:bg-[#1e2638]/50 transition-colors"
                      >
                        <td className="p-4 font-semibold text-white">{user.name}</td>
                        <td className="p-4 text-[#8f9cae]">{user.email}</td>
                        <td className="p-4 text-[#8f9cae]">{user.phone || '—'}</td>
                        <td className="p-4 font-bold text-white">
                          ${Number(user.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 font-bold text-[#10b981]">
                          ${Number(user.bonus).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-center">
                          <span className="bg-red-500/15 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-medium inline-block w-20">
                            Blocked
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2.5">
                            <button
                              onClick={() => unblockAccount(user)}
                              className="bg-[#0b66e4]/15 hover:bg-[#0b66e4] text-[#0b66e4] hover:text-white border border-[#0b66e4]/30 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer"
                            >
                              Unblock
                            </button>
                            <button
                              onClick={() => deleteAccount(user.id)}
                              className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center p-8 text-[#8f9cae] bg-[#090d16]/50 italic">
                        No Blocked Accounts Found
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

export default BlockedAccounts