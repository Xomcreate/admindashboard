// src/MainComponents/Sidebar.jsx

import { useLocation, Link } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaMoneyBill,
  FaWallet,
  FaGift,
  FaBan,
  FaUserCircle,
  FaSignOutAlt,
  FaTimes,
  FaCog,
  FaChartLine,
  FaExchangeAlt,
  FaRobot,
  FaHistory,
  FaShoppingCart,
  FaUserFriends,
} from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const isActive = (path) => location.pathname === path;

  // ADMIN LINKS
  const adminLinks = [
    { path: "/dashboard", name: "Dashboard", icon: <FaHome /> },
    { path: "/investors", name: "Investors", icon: <FaUsers /> },
    { path: "/investments", name: "Investments", icon: <FaMoneyBill /> },
    { path: "/fund-account", name: "Fund Account", icon: <FaWallet /> },
    { path: "/investment-plans", name: "Plans", icon: <FaChartLine /> },
    { path: "/copy-trading", name: "Copy Trading", icon: <FaExchangeAlt /> },
    { path: "/ai-trading-bots", name: "AI Bots", icon: <FaRobot /> },
    { path: "/purchase-stocks", name: "Stocks", icon: <FaShoppingCart /> },
    { path: "/profit-history", name: "Profit History", icon: <FaHistory /> },
    { path: "/referrals", name: "Referrals", icon: <FaUserFriends /> },
    { path: "/bonuses", name: "Bonuses", icon: <FaGift /> },
    { path: "/blocked", name: "Blocked Users", icon: <FaBan /> },
  ];

  // USER LINKS
  const userLinks = [
    { path: "/dashboard", name: "Dashboard", icon: <FaHome /> },
    { path: "/fund-account", name: "Fund Account", icon: <FaWallet /> },
    { path: "/investment-plans", name: "Invest", icon: <FaChartLine /> },
    { path: "/copy-trading", name: "Copy Trading", icon: <FaExchangeAlt /> },
    { path: "/ai-trading-bots", name: "AI Bots", icon: <FaRobot /> },
    { path: "/profit-history", name: "History", icon: <FaHistory /> },
    { path: "/referrals", name: "Referrals", icon: <FaUserFriends /> },
    { path: "/profile", name: "Profile", icon: <FaUserCircle /> },
    { path: "/settings", name: "Settings", icon: <FaCog /> },
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
          className="lg:hidden fixed inset-0 bg-black/70 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#0e0d0d] text-white
          flex flex-col justify-between z-50
          border-r border-[#242020]
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* TOP */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-6 border-b border-[#242020] pb-4">
            <div>
              <h1 className="text-white font-bold">IPO Stock</h1>
              <p className="text-xs text-gray-400">
                {isAdmin ? "Admin Panel" : "User Panel"}
              </p>
            </div>

            <button onClick={onClose} className="lg:hidden">
              <FaTimes />
            </button>
          </div>

          {/* LINKS */}
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm border ${
                  isActive(link.path)
                    ? "bg-[#c45a45] text-white"
                    : "text-gray-400 hover:bg-[#171515] hover:text-white"
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
            className="flex items-center gap-3 text-red-400"
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