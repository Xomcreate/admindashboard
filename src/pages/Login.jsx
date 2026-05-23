import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ username: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Get tokens
      const res = await API.post("token/", form);
      localStorage.setItem("token",         res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      // 2. Fetch profile to determine role
      const profile = await API.get("user-dashboard/");
      const role    = profile.data.profile.role;
      localStorage.setItem("role", role);

      // 3. Route based on role
      if (role === "admin") {
        navigate("/dashboard");        // admin dashboard
      } else {
        navigate("/user/dashboard");   // user dashboard
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0a1128]">
      <form onSubmit={submit} className="bg-[#111c44] p-8 rounded-lg w-96">

        <h1 className="text-white text-2xl mb-6 font-bold">Login</h1>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <input
          placeholder="Username"
          className="w-full p-3 mb-4 rounded bg-[#0a1128] text-white border border-[#1e295d]"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded bg-[#0a1128] text-white border border-[#1e295d]"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button
          className="bg-green-500 w-full p-3 text-white rounded font-semibold disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-white mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-400">Register</Link>
        </p>

      </form>
    </div>
  );
};

export default Login;