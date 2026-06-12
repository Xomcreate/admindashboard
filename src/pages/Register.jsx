import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref") || "";

  const [form, setForm] = useState({
    username:         "",
    email:            "",
    password:         "",
    confirm_password: "",
  });

  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        ref:      refCode,        // passed to backend — empty string is safely ignored
      });

      alert("Account created successfully! Please log in.");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
      const msg = err.response?.data?.error || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full p-3 rounded-lg bg-[#171515] text-white border border-[#2b2524] placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45]";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#171515]">
      <form
        onSubmit={submit}
        className="bg-[#1c1919] border border-[#2b2524] p-8 rounded-xl w-96 shadow-2xl"
      >
        <h1 className="text-white text-2xl font-bold mb-6">Register</h1>

        {/* Show a subtle banner if they arrived via a referral link */}
        {refCode && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-[#c45a45]/10 border border-[#c45a45]/25 text-[#c45a45] text-xs font-medium">
            You were invited via a referral link 🎉
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <input
          placeholder="Username"
          className={`${inputClass} mb-3`}
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <input
          placeholder="Email"
          type="email"
          className={`${inputClass} mb-3`}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        {/* Password */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={inputClass}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9593] text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-5">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className={inputClass}
            value={form.confirm_password}
            onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9593] text-sm"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          className="bg-[#c45a45] hover:bg-[#a64633] w-full p-3 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-[#9e9593] mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/" className="text-[#c45a45] hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;