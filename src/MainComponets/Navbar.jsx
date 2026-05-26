// src/MainComponets/Navbar.jsx

import { FaSignOutAlt, FaUserCircle, FaBars } from "react-icons/fa";

const Navbar = ({ onMenuClick }) => {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const role = localStorage.getItem("role");

  return (
    <div className="flex justify-between items-center p-4 bg-[#111c44] text-white mb-5">

      {/* Left: hamburger (mobile) + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg hover:bg-[#1e295d] transition-colors text-gray-300 hover:text-white"
          aria-label="Open menu"
        >
          <FaBars size={18} />
        </button>

        <h1 className="font-semibold text-sm sm:text-base">
          {role === "admin" ? "Admin Panel" : "User Panel"}
        </h1>
      </div>

      {/* Right: profile + logout */}
      <div className="flex gap-3 items-center">
        <FaUserCircle className="text-lg text-gray-300" />

        <button
          onClick={logout}
          className="text-red-400 hover:text-red-300 flex items-center gap-1.5 text-sm transition-colors"
        >
          <FaSignOutAlt />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

    </div>
  );
};

export default Navbar;