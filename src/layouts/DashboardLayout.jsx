import { useState } from "react";
import Sidebar from "../MainComponets/Sidebar";
import Navbar from "../MainComponets/Navbar";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // MATCHED COLORS: Changed bg-[#0f172a] to the warm dark tint bg-[#171515]
    <div className="flex min-h-screen bg-[#171515]">

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content — offset by sidebar width on large screens only */}
      <div className="flex-1 lg:ml-64 min-w-0 w-full">

        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-5">
          {children}
        </div>

      </div>

    </div>
  );
};

export default DashboardLayout;