// src/pages/Settings.jsx

import React, { useEffect, useState } from 'react'

import DashboardLayout from '../layouts/DashboardLayout'

import API from '../api/axios'

import Loader from '../MainComponets/Loader'

function Settings() {

  const [loading, setLoading] = useState(true)

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

      const res = await API.get(
        "settings/"
      )

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

    try {

      // UPDATE SETTINGS

      await API.put(
        `settings/${settings.id}/`,
        settings
      )

      alert("Settings Updated Successfully")

    } catch (error) {

      console.log(error)

      alert("Failed To Update Settings")

    }
  }


  // LOADER

  if (loading) {
    return <Loader />
  }


  return (

    <>
    
      <DashboardLayout>

        {/* PAGE HEADER */}

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">
            Dashboard Settings
          </h1>

        </div>


        {/* SETTINGS FORM */}

        <div className="bg-white p-6 rounded shadow">

          <h2 className="text-2xl font-semibold mb-6">
            Configure Platform Settings
          </h2>

          <form
            onSubmit={updateSettings}
            className="grid grid-cols-2 gap-5"
          >

            {/* SITE NAME */}

            <div>

              <label className="block mb-2 font-medium">
                Site Name
              </label>

              <input
                type="text"
                className="w-full border p-3 rounded"
                value={settings.site_name || ""}
                onChange={(e)=>
                  setSettings({
                    ...settings,
                    site_name:e.target.value
                  })
                }
              />

            </div>


            {/* MINIMUM WITHDRAWAL */}

            <div>

              <label className="block mb-2 font-medium">
                Minimum Withdrawal
              </label>

              <input
                type="number"
                className="w-full border p-3 rounded"
                value={settings.minimum_withdrawal || ""}
                onChange={(e)=>
                  setSettings({
                    ...settings,
                    minimum_withdrawal:e.target.value
                  })
                }
              />

            </div>


            {/* DAILY INCREMENT */}

            <div>

              <label className="block mb-2 font-medium">
                Daily Increment (%)
              </label>

              <input
                type="number"
                className="w-full border p-3 rounded"
                value={settings.daily_increment || ""}
                onChange={(e)=>
                  setSettings({
                    ...settings,
                    daily_increment:e.target.value
                  })
                }
              />

            </div>


            {/* MONTHLY INCREMENT */}

            <div>

              <label className="block mb-2 font-medium">
                Monthly Increment (%)
              </label>

              <input
                type="number"
                className="w-full border p-3 rounded"
                value={settings.monthly_increment || ""}
                onChange={(e)=>
                  setSettings({
                    ...settings,
                    monthly_increment:e.target.value
                  })
                }
              />

            </div>


            {/* AUTOMATIC BONUS */}

            <div className="col-span-2">

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={settings.automatic_bonus || false}
                  onChange={(e)=>
                    setSettings({
                      ...settings,
                      automatic_bonus:e.target.checked
                    })
                  }
                />

                <span className="font-medium">
                  Enable Automatic Bonus
                </span>

              </label>

            </div>


            {/* SAVE BUTTON */}

            <button
              className="bg-black text-white p-3 rounded col-span-2"
            >
              Save Settings
            </button>

          </form>

        </div>

      </DashboardLayout>

    </>
  )
}

export default Settings