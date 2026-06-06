import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import API from '../api/axios'
import Loader from '../MainComponets/Loader'
// Note: Install lucide-react if you haven't already: npm i lucide-react
import { ShieldCheck, Trash2, Users, Search, Ban } from 'lucide-react'

function BlockedAccounts() {
  const [blockedUsers, setBlockedUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlockedUsers()
  }, [])

  useEffect(() => {
    const filtered = blockedUsers.filter(user => 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchQuery, blockedUsers])

  const fetchBlockedUsers = async () => {
    try {
      const res = await API.get("investors/")
      const blocked = res.data.filter((user) => user.blocked === true)
      setBlockedUsers(blocked)
      setFilteredUsers(blocked)
    } catch (error) {
      console.error(error)
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
      console.error(error)
      alert("Failed To Unblock Account")
    }
  }

  const deleteAccount = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this account? This action cannot be undone."
    )
    if (!confirmDelete) return

    try {
      await API.delete(`investors/${id}/`)
      fetchBlockedUsers()
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <DashboardLayout>
      <div className="text-white font-sans max-w-6xl mx-auto space-y-6 p-4 md:p-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-wide text-slate-100">Blocked Accounts</h1>
            <p className="text-slate-400 text-sm mt-1">
              Review restricted users, restore account accessibility, or remove accounts entirely.
            </p>
          </div>
          
          {/* Quick Stat Card */}
          <div className="flex items-center gap-4 bg-[#121824] border border-[#1e2638] px-5 py-3 rounded-xl self-start md:self-auto">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Blocked</p>
              <p className="text-xl font-bold text-white">{blockedUsers.length}</p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-[#121824] rounded-xl border border-[#1e2638] overflow-hidden shadow-xl">
          
          {/* Table Control/Search Header */}
          <div className="p-5 border-b border-[#1e2638] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#161d2d]/40">
            <h2 className="text-lg font-semibold tracking-wide text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" /> All Restricted Profiles
            </h2>
            
            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#090d16] border border-[#1e2638] rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Table Wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm text-left">
              <thead>
                <tr className="bg-[#090d16] text-slate-400 uppercase text-xs font-semibold tracking-wider border-b border-[#1e2638]">
                  <th className="p-4">Name</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Balance</th>
                  <th className="p-4">Bonus</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2638]">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-[#1e2638]/30 transition-colors"
                    >
                      {/* Name */}
                      <td className="p-4 font-semibold text-slate-200 whitespace-nowrap">
                        {user.name}
                      </td>
                      
                      {/* Contact details grouped together */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="text-slate-300">{user.email}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{user.phone || 'No phone linked'}</div>
                      </td>
                      
                      {/* Balance */}
                      <td className="p-4 font-mono font-medium text-slate-200 whitespace-nowrap">
                        ${Number(user.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      
                      {/* Bonus */}
                      <td className="p-4 font-mono font-medium text-emerald-400 whitespace-nowrap">
                        ${Number(user.bonus || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      
                      {/* Status Badge */}
                      <td className="p-4 text-center whitespace-nowrap">
                        <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-md text-xs font-medium inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                          Blocked
                        </span>
                      </td>
                      
                      {/* Responsive Action Strip */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => unblockAccount(user)}
                            title="Unblock User"
                            className="bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span className="hidden sm:inline px-0.5">Unblock</span>
                          </button>
                          <button
                            onClick={() => deleteAccount(user.id)}
                            title="Delete User Permanently"
                            className="bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline px-0.5">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-12 text-slate-500 bg-[#090d16]/20 italic">
                      No matching blocked profiles found.
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