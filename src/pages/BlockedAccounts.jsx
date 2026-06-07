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
    <DashboardLayout>
      <div className="text-white font-sans max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-wide flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#c45a45] shadow-[0_0_8px_rgba(196,90,69,0.5)]" />
            Blocked Accounts
          </h1>
          <p className="text-[#9e9593] text-sm mt-1 ml-3.5">
            Review restricted users, restore account accessibility, or remove accounts entirely.
          </p>
        </div>

        {/* Table Card */}
        <div className="bg-[#121111] rounded-xl border border-[#242020]">

          {/* Card Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#242020]">
            <h2 className="text-sm font-semibold text-white">All Blocked Investors</h2>
            <span className="text-xs font-semibold bg-[#c45a45]/10 text-[#c45a45] border border-[#c45a45]/25 px-3 py-1 rounded-full">
              {blockedUsers.length} blocked
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-[#9e9593] uppercase text-xs font-semibold tracking-wider bg-[#0f0e0e]">
                  <th className="px-5 py-3 text-left border-b border-[#242020]">Name</th>
                  <th className="px-5 py-3 text-left border-b border-[#242020]">Email</th>
                  <th className="px-5 py-3 text-left border-b border-[#242020]">Phone</th>
                  <th className="px-5 py-3 text-left border-b border-[#242020]">Balance</th>
                  <th className="px-5 py-3 text-left border-b border-[#242020]">Bonus</th>
                  <th className="px-5 py-3 text-center border-b border-[#242020]">Status</th>
                  <th className="px-5 py-3 text-center border-b border-[#242020]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blockedUsers.length > 0 ? (
                  blockedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[#242020] hover:bg-[#1e1c1c] transition-colors"
                    >
                      <td className="px-5 py-3.5 font-semibold text-white">{user.name}</td>
                      <td className="px-5 py-3.5 text-[#9e9593]">{user.email}</td>
                      <td className="px-5 py-3.5 text-[#9e9593]">{user.phone || '—'}</td>
                      <td className="px-5 py-3.5 font-bold text-white">
                        ${Number(user.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-[#c45a45]">
                        ${Number(user.bonus).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="bg-[#c45a45]/10 text-[#c45a45] border border-[#c45a45]/25 px-3 py-1 rounded-full text-xs font-medium">
                          Blocked
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => unblockAccount(user)}
                            className="bg-[#1e1c1c] hover:bg-[#242020] text-[#9e9593] hover:text-white border border-[#242020] px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer"
                          >
                            Unblock
                          </button>
                          <button
                            onClick={() => deleteAccount(user.id)}
                            className="bg-[#c45a45]/10 hover:bg-[#c45a45] text-[#c45a45] hover:text-white border border-[#c45a45]/25 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-[#9e9593] italic">
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
  )
}

export default BlockedAccounts