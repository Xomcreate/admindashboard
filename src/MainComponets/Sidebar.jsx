// src/MainComponents/Sidebar.jsx
import { useLocation, Link } from "react-router-dom";
import {
  FaHome, FaUsers, FaMoneyBill, FaWallet, FaGift, FaBan,
  FaUserCircle, FaSignOutAlt, FaTimes, FaCog, FaChartLine,
  FaExchangeAlt, FaRobot, FaHistory, FaShoppingCart, FaUserFriends,
  FaReceipt, FaArrowDown, FaUserShield, // Imported FaUserShield for KYC
} from "react-icons/fa";

const SectionLabel = ({ label }) => (
  <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-white/25 font-medium px-2 mt-4 mb-1">
    {label}
  </p>
);

const NavLink = ({ path, name, icon, isActive, onClick, badge }) => (
  <Link
    to={path}
    onClick={onClick}
    className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
      isActive
        ? "bg-[#c45a45]/15 border border-[#c45a45]/30 text-gray-900 dark:text-white"
        : "text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white/80 border border-transparent"
    }`}
  >
    <span className={`text-base shrink-0 ${
      isActive
        ? "text-[#c45a45]"
        : "text-gray-400 dark:text-white/35 group-hover:text-gray-600 dark:group-hover:text-white/60"
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
  const userDashboardPath  = "/user/dashboard";

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
        { path: "/investment-plans", name: "Plans",        icon: <FaChartLine />,   },
        { path: "/copy-trading",     name: "Copy Trading", icon: <FaExchangeAlt />, badge: "New" },
        { path: "/ai-trading-bots",  name: "AI Bots",      icon: <FaRobot />        },
        { path: "/purchase-stocks",  name: "Stocks",       icon: <FaShoppingCart /> },
        { path: "/kyc-verify",     name: "KYC Approvals", icon: <FaUserShield /> },
      ],
    },
    {
      label: "Reports",
      links: [
        // { path: "/kyc-verify",     name: "KYC Approvals", icon: <FaUserShield /> }, // Added KYC Approvals route here
        { path: "/transactions",   name: "Transactions",  icon: <FaReceipt />     },
        { path: "/profit-history", name: "Profit History",icon: <FaHistory />     },
        { path: "/referrals",      name: "Referrals",     icon: <FaUserFriends /> },
        { path: "/bonuses",        name: "Bonuses",       icon: <FaGift />        },
        { path: "/blocked",        name: "Blocked Users", icon: <FaBan />         },
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

  const userSections = [
    {
      label: "Overview",
      links: [
        { path: userDashboardPath,   name: "Dashboard",    icon: <FaHome />      },
        { path: "/fund-account",     name: "Fund Account", icon: <FaWallet />    },
        { path: "/user/withdrawals", name: "Withdrawals",  icon: <FaArrowDown /> },
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
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`
          sidebar-root
          fixed top-0 left-0 h-screen w-60 flex flex-col z-50
          border-r transition-all duration-300

          /* Dark (default) */
          bg-[#0A0A0B] text-white border-white/6

          /* Light */
          dark:bg-[#0A0A0B] dark:text-white dark:border-white/6

          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200 dark:border-white/6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#c45a45] to-[#a03929] flex items-center justify-center">
              <FaChartLine className="text-white text-sm" />
            </div>
            <div>
              <p className="text-gray-900 dark:text-white text-sm font-semibold leading-none">IPO Stock</p>
              <p className="text-gray-400 dark:text-white/30 text-[11px] mt-0.5">
                {isAdmin ? "Admin Panel" : "User Panel"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 dark:text-white/40 hover:text-[#c45a45]"
          >
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
        <div className="px-3 pb-4 border-t border-gray-200 dark:border-white/6 pt-3">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-white/6 border border-gray-200 dark:border-white/[0.07]">
            <div className="w-7 h-7 rounded-full bg-[#c45a45]/20 flex items-center justify-center">
              <FaUserCircle className="text-[#c45a45] text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 dark:text-white text-xs font-medium truncate">
                {isAdmin ? "Admin User" : "My Account"}
              </p>
              <p className="text-gray-400 dark:text-white/30 text-[11px] mt-0.5 truncate">
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