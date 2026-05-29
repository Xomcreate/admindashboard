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

  // Password visibility states
  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

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
        email: form.email,
        password: form.password,
      });

      alert(
        "Account created successfully! Please log in."
      );

      navigate("/");
    } catch (err) {
      console.error(
        err.response?.data || err.message
      );

      const msg =
        err.response?.data?.error ||
        "Registration failed. Please try again.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090d16]">
      <form
        onSubmit={submit}
        className="bg-[#121824] border border-[#1e2638] p-8 rounded-xl w-96 shadow-2xl"
      >
        <h1 className="text-white text-2xl font-bold mb-6">
          Register
        </h1>

        {error && (
          <p className="text-red-400 text-sm mb-4">
            {error}
          </p>
        )}

        <input
          placeholder="Username"
          className="w-full p-3 mb-3 rounded-lg bg-[#090d16] text-white border border-[#1e2638] placeholder-[#8f9cae] focus:outline-none focus:border-[#0b66e4]"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
          required
        />

        <input
          placeholder="Email"
          type="email"
          className="w-full p-3 mb-3 rounded-lg bg-[#090d16] text-white border border-[#1e2638] placeholder-[#8f9cae] focus:outline-none focus:border-[#0b66e4]"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          required
        />

        {/* Password */}
        <div className="relative mb-3">
          <input
            type={
              showPassword ? "text" : "password"
            }
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-[#090d16] text-white border border-[#1e2638] placeholder-[#8f9cae] focus:outline-none focus:border-[#0b66e4]"
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f9cae] text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-5">
          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm Password"
            className="w-full p-3 rounded-lg bg-[#090d16] text-white border border-[#1e2638] placeholder-[#8f9cae] focus:outline-none focus:border-[#0b66e4]"
            value={form.confirm_password}
            onChange={(e) =>
              setForm({
                ...form,
                confirm_password:
                  e.target.value,
              })
            }
            required
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f9cae] text-sm"
          >
            {showConfirmPassword
              ? "Hide"
              : "Show"}
          </button>
        </div>

        <button
          className="bg-[#0b66e4] hover:bg-[#0055cc] w-full p-3 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading
            ? "Creating account..."
            : "Register"}
        </button>

        <p className="text-[#8f9cae] mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-[#0b66e4] hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;