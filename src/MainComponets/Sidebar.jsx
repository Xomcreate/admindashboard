import { useLocation, Link } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaMoneyBill,
  FaWallet,
  FaGift,
  FaBan
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  // Helper function to check if the link is active
  const isActive = (path) => location.pathname === path;

  const links = [
    { path: "/dashboard", name: "Dashboard", icon: <FaHome /> },
    { path: "/investors", name: "Investors", icon: <FaUsers /> },
    { path: "/investments", name: "Investments", icon: <FaMoneyBill /> },
    { path: "/withdrawals", name: "Withdrawals", icon: <FaWallet /> },
    { path: "/bonuses", name: "Bonuses", icon: <FaGift /> },
    { path: "/blocked", name: "Blocked Accounts", icon: <FaBan /> },
  ];

  return (
    <div className="w-64 bg-[#0a1128] border-r border-[#1e295d] text-white h-screen p-5 fixed flex flex-col justify-between font-sans shadow-xl z-20">
      <div>
        {/* SIDEBAR HEADER */}
        <div className="mb-10 px-2 py-1">
          <h1 className="text-xl font-bold tracking-wider bg-linear-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-[10px] text-[#64748b] tracking-widest uppercase font-semibold mt-1">
            Management Panel
          </p>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  active
                    ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 font-semibold"
                    : "text-[#94a3b8] hover:bg-[#111c44] hover:text-slate-100 border border-transparent"
                }`}
              >
                <span
                  className={`text-base transition-transform duration-200 group-hover:scale-110 ${
                    active ? "text-[#10b981]" : "text-[#64748b] group-hover:text-slate-300"
                  }`}
                >
                  {link.icon}
                </span>
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* OPTIONAL BOTTOM FOOTER NOTE */}
      <div className="px-4 py-2 border-t border-[#1e295d]/50 text-[11px] text-[#64748b] text-center">
        Secure Admin Session
      </div>
    </div>
  );
};

export default Sidebar;