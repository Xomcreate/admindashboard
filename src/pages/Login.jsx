import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Get tokens
      const res = await API.post("token/", form);

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      // 2. Fetch profile to determine role
      const profile = await API.get("user-dashboard/");
      const role = profile.data.profile.role;

      localStorage.setItem("role", role);

      // 3. Route based on role
      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#171515]">
      <form
        onSubmit={submit}
        className="bg-[#1c1919] border border-[#2b2524] p-8 rounded-xl w-96 shadow-2xl"
      >
        <h1 className="text-white text-2xl mb-6 font-bold">
          Login
        </h1>

        {error && (
          <p className="text-red-400 text-sm mb-4">
            {error}
          </p>
        )}

        <input
          placeholder="Username"
          className="w-full p-3 mb-4 rounded-lg bg-[#171515] text-white border border-[#2b2524] placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45]"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
          required
        />

        {/* Password Input */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-[#171515] text-white border border-[#2b2524] placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45]"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            required
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9593] text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          className="bg-[#c45a45] hover:bg-[#a64633] w-full p-3 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-[#9e9593] mt-4 text-sm text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#c45a45] hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;