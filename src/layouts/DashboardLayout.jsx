// src/layouts/DashboardLayout.jsx

import Sidebar from "../MainComponets/Sidebar";
import Navbar from "../MainComponets/Navbar";

const DashboardLayout = ({ children }) => {

  return (
    <div className="flex">

      <Sidebar />

      <div className="ml-62.5 w-full p-5">

        <Navbar />

        {children}

      </div>

    </div>
  )
}

export default DashboardLayout;