// src/MainComponets/Navbar.jsx

import { FaSignOutAlt, FaUserCircle, FaBars } from "react-icons/fa";

const Navbar = ({ onMenuClick }) => {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const role = localStorage.getItem("role");

  return (
    <div className="flex justify-between items-center px-5 py-3.5 bg-[#121824] border-b border-[#1e2638] text-white mb-5">

      {/* Left: hamburger + brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg hover:bg-[#1e2638] transition-colors text-[#8f9cae] hover:text-white border border-[#1e2638]"
          aria-label="Open menu"
        >
          <FaBars size={16} />
        </button>

        <div className="flex flex-col">
          <span className="text-white font-semibold text-sm leading-tight">
            <span className="inline-block w-2 h-2 rounded-full bg-[#0b66e4] mr-1.5 align-middle" />
            IPO Stock
          </span>
          <span className="text-[#8f9cae] text-xs leading-tight mt-0.5">
            {role === "admin" ? "Admin Panel" : "User Panel"}
          </span>
        </div>
      </div>

      {/* Right: profile + logout */}
      <div className="flex gap-3 items-center">
        <div className="flex items-center gap-2 text-[#8f9cae] text-sm">
          <div className="w-7 h-7 rounded-full bg-[#0b66e4]/10 border border-[#0b66e4]/25 flex items-center justify-center">
            <FaUserCircle className="text-[#0b66e4] text-sm" />
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 px-2.5 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-all"
        >
          <FaSignOutAlt />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

    </div>
  );
};

export default Navbar;