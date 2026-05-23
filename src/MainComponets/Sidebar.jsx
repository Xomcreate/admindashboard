import { useLocation, Link } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaMoneyBill,
  FaWallet,
  FaGift,
  FaBan,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const isActive = (path) => location.pathname === path;

  // 🔐 ADMIN LINKS
  const adminLinks = [
    { path: "/dashboard", name: "Dashboard", icon: <FaHome /> },
    { path: "/investors", name: "Investors", icon: <FaUsers /> },
    { path: "/investments", name: "Investments", icon: <FaMoneyBill /> },
    { path: "/withdrawals", name: "Withdrawals", icon: <FaWallet /> },
    { path: "/bonuses", name: "Bonuses", icon: <FaGift /> },
    { path: "/blocked", name: "Blocked Users", icon: <FaBan /> },
    // { path: "/settings", name: "Settings", icon: <FaCog /> },
  ];

  // 👤 USER LINKS
  const userLinks = [
    { path: "/user/dashboard", name: "Dashboard", icon: <FaHome /> },
    { path: "/user/investments", name: "My Investments", icon: <FaMoneyBill /> },
    { path: "/user/withdrawals", name: "Withdrawals", icon: <FaWallet /> },
    { path: "/profile", name: "Profile", icon: <FaUserCircle /> },
    // { path: "/settings", name: "Settings", icon: <FaCog /> },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="w-64 h-screen bg-[#0a1128] text-white p-5 fixed flex flex-col justify-between">

      {/* TOP SECTION */}
      <div>

        <h1 className="text-xl font-bold mb-8">
          {isAdmin ? "Admin Panel" : "User Panel"}
        </h1>

        <div className="flex flex-col gap-3">

          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
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
          className="flex items-center gap-3 text-red-400 hover:text-red-300"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </div>
  );
};

export default Sidebar;