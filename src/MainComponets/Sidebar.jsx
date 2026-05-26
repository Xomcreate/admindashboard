// src/MainComponets/Sidebar.jsx

import { useLocation, Link } from "react-router-dom";
import {
  FaHome, FaUsers, FaMoneyBill, FaWallet,
  FaGift, FaBan, FaUserCircle, FaSignOutAlt, FaTimes,
} from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const isActive = (path) => location.pathname === path;

  // 🔐 ADMIN LINKS
  const adminLinks = [
    { path: "/dashboard",   name: "Dashboard",    icon: <FaHome /> },
    { path: "/investors",   name: "Investors",    icon: <FaUsers /> },
    { path: "/investments", name: "Investments",  icon: <FaMoneyBill /> },
    { path: "/withdrawals", name: "Withdrawals",  icon: <FaWallet /> },
    { path: "/bonuses",     name: "Bonuses",      icon: <FaGift /> },
    { path: "/blocked",     name: "Blocked Users",icon: <FaBan /> },
  ];

  // 👤 USER LINKS
  const userLinks = [
    { path: "/user/dashboard",   name: "Dashboard",     icon: <FaHome /> },
    { path: "/user/investments", name: "My Investments",icon: <FaMoneyBill /> },
    { path: "/user/withdrawals", name: "Withdrawals",   icon: <FaWallet /> },
    { path: "/profile",          name: "Profile",       icon: <FaUserCircle /> },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {/* Backdrop — mobile only, closes sidebar on tap */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#0a1128] text-white p-5
          flex flex-col justify-between z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* TOP SECTION */}
        <div>

          {/* Header row — close button visible on mobile */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold">
              {isAdmin ? "Admin Panel" : "User Panel"}
            </h1>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white p-1 rounded transition-colors"
              aria-label="Close sidebar"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`flex items-center gap-3 p-3 rounded transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-green-500 text-black font-semibold"
                    : "text-gray-300 hover:bg-[#111c44]"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

        </div>

        {/* BOTTOM SECTION (LOGOUT) */}
        <div className="border-t border-gray-700 pt-4">
          <button
            onClick={logout}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

      </div>
    </>
  );
};

export default Sidebar;