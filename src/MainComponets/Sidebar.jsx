// src/MainComponets/Sidebar.jsx
import { useLocation, Link } from "react-router-dom";
import {
  FaHome, FaUsers, FaMoneyBill, FaWallet, FaGift, FaBan,
  FaUserCircle, FaSignOutAlt, FaTimes, FaCog, FaChartLine,
  FaExchangeAlt, FaRobot, FaHistory, FaShoppingCart, FaUserFriends,
  FaReceipt, FaArrowDown,
} from "react-icons/fa";

const SectionLabel = ({ label }) => (
  <p className="text-[10px] uppercase tracking-widest dark:text-white/25 light:text-gray-400 font-medium px-2 mt-4 mb-1">
    {label}
  </p>
);

const NavLink = ({ path, name, icon, isActive, onClick, badge }) => (
  <Link
    to={path}
    onClick={onClick}
    className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
      isActive
        ? "bg-[#c45a45]/15 border border-[#c45a45]/30 dark:text-white light:text-gray-900"
        : "dark:text-white/50 light:text-gray-500 hover:bg-white/5 dark:hover:text-white/80 light:hover:text-gray-900 border border-transparent dark:hover:bg-white/5 light:hover:bg-gray-100"
    }`}
  >
    <span className={`text-base shrink-0 ${
      isActive ? "text-[#c45a45]" : "dark:text-white/35 light:text-gray-400 group-hover:text-white/60"
    }`}>
      {icon}
    </span>
    <span className="flex-1 truncate">{name}</span>
    {isActive && (
      <span className="w-1.5 h-1.5 rounded-full bg-[#c45a45] shrink-0" />
    )}
    {badge && !isActive && (
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#c45a45]/20 text-[#e07060] font-medium shrink-0">
        {badge}
      </span>
    )}
  </Link>
);

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const adminDashboardPath = "/dashboard";
  const userDashboardPath = "/user/dashboard";

  const isActive = (path) => location.pathname === path;

  const adminSections = [
    {
      label: "Main",
      links: [
        { path: adminDashboardPath, name: "Dashboard",    icon: <FaHome />      },
        { path: "/investors",       name: "Investors",    icon: <FaUsers />     },
        { path: "/withdrawals",     name: "Withdrawals",  icon: <FaArrowDown /> },
        { path: "/fund-account",    name: "Fund Account", icon: <FaWallet />    },
      ],
    },
    {
      label: "Trading",
      links: [
        { path: "/investment-plans", name: "Plans",        icon: <FaChartLine />  },
        { path: "/copy-trading",     name: "Copy Trading", icon: <FaExchangeAlt />, badge: "New" },
        { path: "/ai-trading-bots",  name: "AI Bots",      icon: <FaRobot />      },
        { path: "/purchase-stocks",  name: "Stocks",       icon: <FaShoppingCart /> },
      ],
    },
    {
      label: "Reports",
      links: [
        { path: "/transactions",   name: "Transactions",  icon: <FaReceipt />     },
        { path: "/profit-history", name: "Profit History",icon: <FaHistory />     },
        { path: "/referrals",      name: "Referrals",     icon: <FaUserFriends /> },
        { path: "/bonuses",        name: "Bonuses",       icon: <FaGift />        },
        { path: "/blocked",        name: "Blocked Users", icon: <FaBan />         },
      ],
    },
  ];

  const userSections = [
    {
      label: "Overview",
      links: [
        { path: userDashboardPath,      name: "Dashboard",   icon: <FaHome />      },
        { path: "/fund-account",        name: "Fund Account",icon: <FaWallet />    },
        { path: "/user/withdrawals",    name: "Withdrawals", icon: <FaArrowDown /> },
      ],
    },
    {
      label: "Trading",
      links: [
        { path: "/investment-plans", name: "Invest",       icon: <FaChartLine />    },
        { path: "/purchase-stocks",  name: "Stocks",       icon: <FaShoppingCart /> },
        { path: "/copy-trading",     name: "Copy Trading", icon: <FaExchangeAlt />  },
        { path: "/ai-trading-bots",  name: "AI Bots",      icon: <FaRobot />        },
        { path: "/profit-history",   name: "History",      icon: <FaHistory />      },
        { path: "/transactions",     name: "Transactions", icon: <FaReceipt />      },
        { path: "/referrals",        name: "Referrals",    icon: <FaUserFriends />  },
      ],
    },
    {
      label: "Account",
      links: [
        { path: "/profile",  name: "Profile",  icon: <FaUserCircle /> },
        { path: "/settings", name: "Settings", icon: <FaCog />        },
      ],
    },
  ];

  const sections = isAdmin ? adminSections : userSections;

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen w-60 dark:bg-[#0A0A0B] light:bg-white dark:text-white light:text-gray-900 flex flex-col z-50 border-r dark:border-white/6 light:border-gray-200 transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-5 border-b dark:border-white/6 light:border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#c45a45] to-[#a03929] flex items-center justify-center">
              <FaChartLine className="text-white text-sm" />
            </div>
            <div>
              <p className="dark:text-white light:text-gray-900 text-sm font-semibold leading-none">IPO Stock</p>
              <p className="dark:text-white/30 light:text-gray-400 text-[11px] mt-0.5">
                {isAdmin ? "Admin Panel" : "User Panel"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden dark:text-white/40 light:text-gray-400 hover:text-[#c45a45]">
            <FaTimes />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-none">
          {sections.map((section) => (
            <div key={section.label}>
              <SectionLabel label={section.label} />
              {section.links.map((link) => (
                <NavLink
                  key={link.path}
                  {...link}
                  isActive={isActive(link.path)}
                  onClick={onClose}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* USER FOOTER */}
        <div className="px-3 pb-4 border-t dark:border-white/6 light:border-gray-200 pt-3">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg dark:bg-white/6 light:bg-gray-50 border dark:border-white/[0.07] light:border-gray-200">
            <div className="w-7 h-7 rounded-full bg-[#c45a45]/20 flex items-center justify-center">
              <FaUserCircle className="text-[#c45a45] text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="dark:text-white light:text-gray-900 text-xs font-medium truncate">
                {isAdmin ? "Admin User" : "My Account"}
              </p>
              <p className="dark:text-white/30 light:text-gray-400 text-[11px] mt-0.5 truncate">
                {isAdmin ? "Administrator" : "Investor"}
              </p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="text-red-400/50 hover:text-red-400 p-1"
            >
              <FaSignOutAlt className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;