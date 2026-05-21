import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import API from '../api/axios'
import Loader from '../MainComponets/Loader'

function Settings() {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [settings, setSettings] = useState({
    site_name: "",
    minimum_withdrawal: "",
    daily_increment: "",
    monthly_increment: "",
    automatic_bonus: false
  })

  // FETCH SETTINGS
  useEffect(() => {
    fetchSettings()
  }, [])

  // GET SETTINGS FROM BACKEND
  const fetchSettings = async () => {
    try {
      const res = await API.get("settings/")
      // IF SETTINGS EXISTS
      if (res.data.length > 0) {
        setSettings(res.data[0])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // UPDATE SETTINGS
  const updateSettings = async (e) => {
    e.preventDefault()
    setUpdating(true)
    try {
      // UPDATE SETTINGS
      await API.put(`settings/${settings.id}/`, settings)
      alert("Settings Updated Successfully")
    } catch (error) {
      console.log(error)
      alert("Failed To Update Settings")
    } finally {
      setUpdating(false)
    }
  }

  // LOADER
  if (loading) {
    return <Loader />
  }

  return (
    <>
      <DashboardLayout>
        <div className="text-white font-sans max-w-4xl mx-auto space-y-8">
          
          {/* PAGE HEADER */}
          <div>
            <h1 className="text-3xl font-bold tracking-wide">Dashboard Settings</h1>
            <p className="text-[#64748b] text-sm mt-1">
              Configure baseline metrics, threshold limits, and global system rules.
            </p>
          </div>

          {/* SETTINGS FORM */}
          <div className="bg-[#111c44] p-8 rounded-xl border border-[#1e295d] shadow-2xl">
            <h2 className="text-xl font-semibold mb-6 tracking-wide text-slate-100 border-b border-[#1e295d] pb-4">
              Configure Platform Parameters
            </h2>

            <form
              onSubmit={updateSettings}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* SITE NAME */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Site Name
                </label>
                <input
                  type="text"
                  placeholder="Platform Core Title"
                  className="bg-[#0a1128] border border-[#1e295d] p-3 rounded-lg text-white focus:outline-none focus:border-[#10b981] transition-colors"
                  value={settings.site_name || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      site_name: e.target.value
                    })
                  }
                  required
                />
              </div>

              {/* MINIMUM WITHDRAWAL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Minimum Withdrawal ($)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="bg-[#0a1128] border border-[#1e295d] p-3 rounded-lg text-white focus:outline-none focus:border-[#10b981] transition-colors"
                  value={settings.minimum_withdrawal || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      minimum_withdrawal: e.target.value
                    })
                  }
                  required
                />
              </div>

              {/* DAILY INCREMENT */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Daily Increment (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="bg-[#0a1128] border border-[#1e295d] p-3 rounded-lg text-white focus:outline-none focus:border-[#10b981] transition-colors"
                  value={settings.daily_increment || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      daily_increment: e.target.value
                    })
                  }
                  required
                />
              </div>

              {/* MONTHLY INCREMENT */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Monthly Increment (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="bg-[#0a1128] border border-[#1e295d] p-3 rounded-lg text-white focus:outline-none focus:border-[#10b981] transition-colors"
                  value={settings.monthly_increment || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      monthly_increment: e.target.value
                    })
                  }
                  required
                />
              </div>

              {/* AUTOMATIC BONUS TOGGLE SWITCH */}
              <div className="col-span-1 md:col-span-2 bg-[#0a1128] p-4 rounded-xl border border-[#1e295d] flex items-center justify-between mt-2">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Automatic Allocation Bonus</h4>
                  <p className="text-xs text-[#64748b] mt-0.5">Enable or disable instantaneous distribution automation features completely.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.automatic_bonus || false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        automatic_bonus: e.target.checked
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-slate-400 peer-checked:after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
                </label>
              </div>

              {/* SAVE BUTTON */}
              <button
                disabled={updating}
                className={`bg-[#10b981] hover:bg-[#0d9488] text-white p-3.5 rounded-lg font-semibold tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all duration-200 col-span-1 md:col-span-2 mt-4 text-sm ${
                  updating ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {updating ? "Saving Changes..." : "Save Settings"}
              </button>

            </form>
          </div>

        </div>
      </DashboardLayout>
    </>
  )
}

export default Settings