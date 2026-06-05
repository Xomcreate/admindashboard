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
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#0B0F19] text-slate-200
          flex flex-col justify-between z-50
          border-r border-slate-800/60 shadow-xl shadow-black/40
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* HEADER SECTION */}
        <div className="p-6 border-b border-slate-800/60 bg-[#0F1422]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-black text-lg shadow-lg shadow-emerald-500/20">
                I
              </div>
              <div>
                <h1 className="text-white font-bold tracking-wide text-sm uppercase">IPO Stock</h1>
                <span className={`inline-block mt-0.5 px-2 py-0.5 text-[10px] font-medium rounded-full ${
                  isAdmin ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {isAdmin ? "Admin Console" : "Investor Hub"}
                </span>
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* NAVIGATION LINKS (Scrollable container if items overflow) */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 custom-scrollbar">
          <p className="px-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-2">Navigation</p>
          {links.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 relative overflow-hidden
                  ${active 
                    ? "bg-linear-to-r from-emerald-500/10 to-transparent text-emerald-400 border-l-2 border-emerald-500 rounded-l-none pl-2.5" 
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }
                `}
              >
                <span className={`text-base transition-transform group-hover:scale-110 duration-200 ${active ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"}`}>
                  {link.icon}
                </span>
                <span className="transition-transform group-hover:translate-x-0.5 duration-200">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* FOOTER / USER ACTION SECTION */}
        <div className="p-4 border-t border-slate-800/60 bg-[#0F1422]">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all duration-200 group"
          >
            <FaSignOutAlt className="text-base group-hover:translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;