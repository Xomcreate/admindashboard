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

  const adminLinks = [
    { path: "/dashboard",   name: "Dashboard",    icon: <FaHome /> },
    { path: "/investors",   name: "Investors",    icon: <FaUsers /> },
    { path: "/investments", name: "Investments",  icon: <FaMoneyBill /> },
    { path: "/withdrawals", name: "Withdrawals",  icon: <FaWallet /> },
    { path: "/bonuses",     name: "Bonuses",      icon: <FaGift /> },
    { path: "/blocked",     name: "Blocked Users",icon: <FaBan /> },
  ];

  const userLinks = [
    { path: "/user/dashboard",   name: "Dashboard",     icon: <FaHome /> },
    { path: "/user/investments", name: "My Investments",icon: <FaMoneyBill /> },
    { path: "/user/withdrawals", name: "Withdrawals",    icon: <FaWallet /> },
    { path: "/profile",          name: "Profile",        icon: <FaUserCircle /> },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      {/* Updated bg to matching #171515 context (#0e0d0d for a slightly darker sidebar contrast) */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#0e0d0d] text-white
          flex flex-col justify-between z-50
          border-r border-[#242020]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* TOP */}
        <div className="p-5">

          {/* Brand header */}
          <div className="flex items-center justify-between mb-7 pb-5 border-b border-[#242020]">
            <div className="flex items-center gap-3">
              {/* Changed app logo square to use the prominent #c45a45 theme color */}
              <div className="w-8 h-8 rounded-lg bg-[#c45a45] flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-[0_0_10px_rgba(196,90,69,0.3)]">
                IP
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm leading-tight">IPO Stock</span>
                <span className="text-[#9e9593] text-xs leading-tight mt-0.5">
                  {isAdmin ? "Admin Panel" : "User Panel"}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-[#9e9593] hover:text-white p-1 rounded transition-colors"
              aria-label="Close sidebar"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border ${
                  isActive(link.path)
                    ? "bg-[#c45a45] text-white border-[#c45a45] font-medium shadow-[0_0_12px_rgba(196,90,69,0.2)]"
                    : "text-[#9e9593] hover:bg-[#171515] hover:text-white border-transparent hover:border-[#242020]"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

        </div>

        {/* BOTTOM */}
        <div className="p-5 border-t border-[#242020]">
          <button
            onClick={logout}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 text-sm px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-all w-full"
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