import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("token/", form);
      localStorage.setItem("token", res.data.access);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid Login");
    }
  };

  return (
    // Deep Trust Navy background to match the platform loader
    <div className="h-screen flex justify-center items-center bg-[#0a1128] font-sans">
      
      {/* Lighter navy card overlay with a subtle container border */}
      <form
        onSubmit={submit}
        className="bg-[#111c44] p-10 rounded-xl border border-[#1e295d] shadow-2xl w-full max-w-md mx-4"
      >
        {/* Title Header */}
        <h1 className="text-3xl font-bold mb-2 text-center text-white tracking-wide">
          Admin Login
        </h1>
        <p className="text-[#64748b] text-sm text-center mb-8">
          Secure gateway to the investment portal
        </p>

        {/* Username Field */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-[#0a1128] border border-[#1e295d] p-3 rounded-lg text-white placeholder-[#64748b] focus:outline-none focus:border-[#10b981] transition-colors"
            onChange={(e) =>
              setForm({
                ...form,
                username: e.target.value,
              })
            }
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-[#0a1128] border border-[#1e295d] p-3 rounded-lg text-white placeholder-[#64748b] focus:outline-none focus:border-[#10b981] transition-colors"
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />
        </div>

        {/* Emerald Green Action Button */}
        <button className="bg-[#10b981] hover:bg-[#0d9488] text-white w-full p-3 rounded-lg font-semibold tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-200 cursor-pointer">
          Sign In Safely
        </button>

      </form>
    </div>
  );
};

export default Login;