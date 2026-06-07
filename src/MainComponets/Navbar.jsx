// src/MainComponets/Navbar.jsx
import { FaSignOutAlt, FaUserCircle, FaBars, FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const Navbar = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme();

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const role = localStorage.getItem("role");

  return (
    <div
      className="
        navbar-root
        flex justify-between items-center
        px-5 py-3.5 mb-5
        border-b transition-colors duration-200

        /* Dark (default) */
        bg-[#121111] border-[#242020] text-white

        /* Light override */
        dark:bg-[#121111] dark:border-[#242020] dark:text-white
      "
      style={{
        /* Fallback inline for light mode since Tailwind dark: = dark class present */
        /* The CSS in index.css handles html:not(.dark) overrides */
      }}
    >
      {/* Left: hamburger + brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="
            lg:hidden p-1.5 rounded-lg transition-colors
            text-[#9e9593]
            border border-[#242020]
            hover:bg-[#242020] hover:text-white
            dark:border-[#242020] dark:hover:bg-[#242020] dark:hover:text-white
          "
          aria-label="Open menu"
        >
          <FaBars size={16} />
        </button>

        <div className="flex flex-col">
          <span className="font-semibold text-sm leading-tight text-white dark:text-white">
            <span className="inline-block w-2 h-2 rounded-full bg-[#c45a45] mr-1.5 align-middle shadow-[0_0_8px_rgba(196,90,69,0.5)]" />
            IPO Stock
          </span>
          <span className="text-[#9e9593] text-xs leading-tight mt-0.5">
            {role === "admin" ? "Admin Panel" : "User Panel"}
          </span>
        </div>
      </div>

      {/* Right: theme toggle + profile + logout */}
      <div className="flex gap-2 items-center">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="
            relative w-14 h-7 rounded-full border
            transition-all duration-300
            flex items-center px-1
            bg-[#1e1c1c] border-[#332d2c]
            dark:bg-[#1e1c1c] dark:border-[#332d2c]
          "
        >
          {/* Track fill */}
          <span
            className={`absolute inset-0 rounded-full transition-all duration-300 ${
              isDark ? "bg-[#c45a45]/10" : "bg-amber-400/15"
            }`}
          />
          {/* Thumb */}
          <span
            className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-md transition-all duration-300 ${
              isDark
                ? "translate-x-0 bg-[#1a1818] border border-[#c45a45]/40 text-[#c45a45]"
                : "translate-x-7 bg-white border border-amber-400/50 text-amber-500"
            }`}
          >
            {isDark ? <FaMoon /> : <FaSun />}
          </span>
        </button>

        <div className="flex items-center gap-2 text-[#9e9593] text-sm">
          <div className="w-7 h-7 rounded-full bg-[#c45a45]/10 border border-[#c45a45]/25 flex items-center justify-center">
            <FaUserCircle className="text-[#c45a45] text-sm" />
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 px-2.5 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-all"
        >
          <FaSignOutAlt />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;