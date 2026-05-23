import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await API.post("register/", {
        username: form.username,
        email:    form.email,
        password: form.password,
      });

      alert("Account created successfully! Please log in.");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
      const msg =
        err.response?.data?.error ||
        "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1128]">
      <form onSubmit={submit} className="bg-[#111c44] p-8 rounded-lg w-96">
        <h1 className="text-white text-2xl mb-4">Register</h1>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <input
          placeholder="Username"
          className="w-full p-3 mb-3 rounded bg-[#0a1128] text-white"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <input
          placeholder="Email"
          type="email"
          className="w-full p-3 mb-3 rounded bg-[#0a1128] text-white"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-3 rounded bg-[#0a1128] text-white"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 mb-3 rounded bg-[#0a1128] text-white"
          value={form.confirm_password}
          onChange={(e) =>
            setForm({ ...form, confirm_password: e.target.value })
          }
          required
        />

        <button
          className="bg-green-500 w-full p-3 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-white mt-3 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-green-400">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;