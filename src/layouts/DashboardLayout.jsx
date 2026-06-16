import { useState } from "react";
import Sidebar from "../MainComponets/Sidebar";
import Navbar from "../MainComponets/Navbar";
import Footer from "../MainComponets/Footer";
import LiveChat from "../MainComponets/LiveChat";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex min-h-screen bg-[#171515]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 lg:ml-64 min-w-0 w-full flex flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-5">
            {children}
          </main>

          <Footer />
        </div>
      </div>

      {/* LiveChat outside all wrappers so fixed positioning anchors to the viewport */}
      <LiveChat />
    </>
  );
};

export default DashboardLayout;