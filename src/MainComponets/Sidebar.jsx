import { useLocation, Link } from "react-router-dom";
import {
  FaHome, FaUsers, FaMoneyBill, FaWallet, FaGift, FaBan,
  FaUserCircle, FaSignOutAlt, FaTimes, FaCog, FaChartLine,
  FaExchangeAlt, FaRobot, FaHistory, FaShoppingCart, FaUserFriends,
  FaReceipt, FaArrowDown,
} from "react-icons/fa";

const SectionLabel = ({ label }) => (
  <p className="text-[10px] uppercase tracking-widest text-white/25 font-medium px-2 mt-4 mb-1">
    {label}
  </p>
);

const NavLink = ({ path, name, icon, isActive, onClick, badge }) => (
  <Link
    to={path}
    onClick={onClick}
    className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
      isActive
        ? "bg-[#c45a45]/15 border border-[#c45a45]/30 text-white"
        : "text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent"
    }`}
  >
    <span className={`text-base shrink-0 ${
      isActive ? "text-[#c45a45]" : "text-white/35 group-hover:text-white/60"
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
        // { path: "/investments",     name: "Investments",  icon: <FaMoneyBill /> },
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
        className={`fixed top-0 left-0 h-screen w-60 bg-[#0A0A0B] text-white flex flex-col z-50 border-r border-white/6 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#c45a45] to-[#a03929] flex items-center justify-center">
              <FaChartLine className="text-white text-sm" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">IPO Stock</p>
              <p className="text-white/30 text-[11px] mt-0.5">
                {isAdmin ? "Admin Panel" : "User Panel"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white/70">
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
        <div className="px-3 pb-4 border-t border-white/6 pt-3">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/6 border border-white/[0.07]">
            <div className="w-7 h-7 rounded-full bg-[#c45a45]/20 flex items-center justify-center">
              <FaUserCircle className="text-[#c45a45] text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">
                {isAdmin ? "Admin User" : "My Account"}
              </p>
              <p className="text-white/30 text-[11px] mt-0.5 truncate">
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