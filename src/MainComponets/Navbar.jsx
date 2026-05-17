import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

const Navbar = () => {

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="bg-[#111c44] border border-[#1e295d] shadow-2xl p-4 flex justify-between items-center mb-8 rounded-xl font-sans">

      {/* LEFT SIDE: BRAND / CONSOLE TITLE */}
      <div className="flex items-center gap-3 pl-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></div>
        <h1 className="text-xl font-bold tracking-wide text-slate-100 hidden sm:block">
          Investment Control Console
        </h1>
        <h1 className="text-xl font-bold tracking-wide text-slate-100 block sm:hidden">
          Admin
        </h1>
      </div>

      {/* RIGHT SIDE: ADMIN PROFILE & LOGOUT */}
      <div className="flex items-center gap-4">
        
        {/* AVATAR PLACEHOLDER */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a1128] border border-[#1e295d]">
          <FaUserCircle className="text-[#94a3b8] text-lg" />
          <span className="text-xs font-semibold text-[#94a3b8] tracking-wider hidden md:inline">
            SYSTEM_ADMIN
          </span>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={logout}
          className="bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide flex items-center gap-2 transition-all duration-200 shadow-sm cursor-pointer group"
        >
          <FaSignOutAlt className="text-red-400 group-hover:text-white transition-colors" />
          <span>Logout</span>
        </button>

      </div>

    </div>
  )
}

export default Navbar;