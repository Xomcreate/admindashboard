import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const role = localStorage.getItem("role");

  return (
    <div className="flex justify-between p-4 bg-[#111c44] text-white mb-5">
      <h1>
        {role === "admin" ? "Admin Panel" : "User Panel"}
      </h1>

      <div className="flex gap-3 items-center">
        <FaUserCircle />

        <button onClick={logout} className="text-red-400 flex items-center gap-1">
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;