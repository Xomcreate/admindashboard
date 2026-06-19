import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Login = () => {
  const navigate = useNavigate();

  // ── Login state ───────────────────────────────────────────────────────
  const [form, setForm]                   = useState({ username: "", password: "" });
  const [error, setError]                 = useState("");
  const [loading, setLoading]             = useState(false);
  const [showPassword, setShowPassword]   = useState(false);

  // ── Forgot password state ─────────────────────────────────────────────
  const [forgotMode, setForgotMode]           = useState(false);
  const [forgotStep, setForgotStep]           = useState(1); // 1=email  2=otp  3=new password
  const [email, setEmail]                     = useState("");
  const [otp, setOtp]                         = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading]     = useState(false);
  const [forgotMessage, setForgotMessage]     = useState("");
  const [forgotError, setForgotError]         = useState("");

  // ── Shared input style ────────────────────────────────────────────────
  const inputClass =
    "w-full p-3 mb-4 rounded-lg bg-[#171515] text-white border border-[#2b2524] " +
    "placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45]";

  // ════════════════════════════════════════════════════════════════
  //  LOGIN
  // ════════════════════════════════════════════════════════════════
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("token/", form);
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      const profile = await API.get("user-dashboard/");
      const role    = profile.data.profile.role;
      localStorage.setItem("role", role);

      navigate(role === "admin" ? "/dashboard" : "/user/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  //  STEP 1 — Send OTP to email
  // ════════════════════════════════════════════════════════════════
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage("");
    setForgotError("");

    try {
      await API.post("forgot-password/", { email });
      setForgotMessage("A 6-digit code was sent to your email. Check your inbox (and spam folder).");
      setForgotStep(2);
    } catch (err) {
      setForgotError(
        err.response?.data?.error || "Unable to send code. Please try again."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  //  STEP 2 — Verify OTP
  // ════════════════════════════════════════════════════════════════
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage("");
    setForgotError("");

    try {
      await API.post("verify-otp/", { email, otp });
      setForgotMessage("Code verified! Now set your new password.");
      setForgotStep(3);
    } catch (err) {
      setForgotError(
        err.response?.data?.error || "Invalid or expired code. Please try again."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  //  STEP 3 — Reset Password
  // ════════════════════════════════════════════════════════════════
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage("");
    setForgotError("");

    if (newPassword.length < 8) {
      setForgotError("Password must be at least 8 characters.");
      setForgotLoading(false);
      return;
    }

    try {
      await API.post("reset-password/confirm/", {
        email,
        otp,
        new_password: newPassword,
      });
      setForgotMessage("Password reset successfully! Taking you back to login...");
      setTimeout(() => resetForgotFlow(), 2500);
    } catch (err) {
      setForgotError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  // ── Resend OTP (reuse step 1 handler without event) ──────────────────
  const handleResendOtp = async () => {
    setForgotLoading(true);
    setForgotMessage("");
    setForgotError("");

    try {
      await API.post("forgot-password/", { email });
      setForgotMessage("A new code was sent to your email.");
    } catch (err) {
      setForgotError(
        err.response?.data?.error || "Unable to resend. Please try again."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  // ── Reset entire forgot flow ──────────────────────────────────────────
  const resetForgotFlow = () => {
    setForgotMode(false);
    setForgotStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setForgotMessage("");
    setForgotError("");
    setError("");
  };

  // ════════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════════
  return (
    <div className="h-screen flex items-center justify-center bg-[#171515]">
      <div className="bg-[#1c1919] border border-[#2b2524] p-8 rounded-xl w-96 shadow-2xl">

        {/* ── Title ────────────────────────────────────────────── */}
        <h1 className="text-white text-2xl mb-2 font-bold">
          {!forgotMode
            ? "Login"
            : forgotStep === 1
            ? "Forgot Password"
            : forgotStep === 2
            ? "Enter Code"
            : "New Password"}
        </h1>

        {/* ── Step progress bar (forgot mode only) ─────────────── */}
        {forgotMode && (
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  s <= forgotStep ? "bg-[#c45a45]" : "bg-[#2b2524]"
                }`}
              />
            ))}
          </div>
        )}

        {/* ── Feedback messages ─────────────────────────────────── */}
        {forgotMessage && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 mb-4">
            <p className="text-green-400 text-sm">{forgotMessage}</p>
          </div>
        )}
        {forgotError && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{forgotError}</p>
          </div>
        )}
        {error && !forgotMode && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            LOGIN FORM
        ════════════════════════════════════════════════════════ */}
        {!forgotMode && (
          <form onSubmit={handleLogin}>
            <input
              placeholder="Username"
              className={inputClass}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />

            <div className="relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-[#171515] text-white border border-[#2b2524] placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45]"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9593] text-sm hover:text-white transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="text-right mb-5">
              <button
                type="button"
                onClick={() => { setForgotMode(true); setError(""); }}
                className="text-[#c45a45] text-sm hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#c45a45] hover:bg-[#a64633] w-full p-3 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-[#9e9593] mt-4 text-sm text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#c45a45] hover:underline">
                Register
              </Link>
            </p>
          </form>
        )}

        {/* ════════════════════════════════════════════════════════
            STEP 1 — Enter Email
        ════════════════════════════════════════════════════════ */}
        {forgotMode && forgotStep === 1 && (
          <form onSubmit={handleSendOtp}>
            <p className="text-[#9e9593] text-sm mb-4">
              Enter the email address linked to your account and we'll send you a 6-digit reset code.
            </p>

            <input
              type="email"
              placeholder="Your registered email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={forgotLoading}
              className="bg-[#c45a45] hover:bg-[#a64633] w-full p-3 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {forgotLoading ? "Sending..." : "Send Code"}
            </button>

            <button
              type="button"
              onClick={resetForgotFlow}
              className="w-full mt-3 text-[#9e9593] hover:text-[#c45a45] text-sm transition-colors"
            >
              ← Back to Login
            </button>
          </form>
        )}

        {/* ════════════════════════════════════════════════════════
            STEP 2 — Enter OTP
        ════════════════════════════════════════════════════════ */}
        {forgotMode && forgotStep === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <p className="text-[#9e9593] text-sm mb-1">
              We sent a 6-digit code to:
            </p>
            <p className="text-white text-sm font-semibold mb-4">{email}</p>

            <input
              placeholder="Enter 6-digit code"
              className={inputClass}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              inputMode="numeric"
              required
            />

            <button
              type="submit"
              disabled={forgotLoading || otp.length !== 6}
              className="bg-[#c45a45] hover:bg-[#a64633] w-full p-3 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {forgotLoading ? "Verifying..." : "Verify Code"}
            </button>

            <div className="flex gap-3 mt-3">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={forgotLoading}
                className="flex-1 text-[#9e9593] hover:text-[#c45a45] text-sm transition-colors disabled:opacity-50"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={() => {
                  setForgotStep(1);
                  setOtp("");
                  setForgotMessage("");
                  setForgotError("");
                }}
                className="flex-1 text-[#9e9593] hover:text-[#c45a45] text-sm transition-colors"
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        {/* ════════════════════════════════════════════════════════
            STEP 3 — New Password
        ════════════════════════════════════════════════════════ */}
        {forgotMode && forgotStep === 3 && (
          <form onSubmit={handleResetPassword}>
            <p className="text-[#9e9593] text-sm mb-4">
              Almost done! Choose a new password for your account.
            </p>

            <div className="relative mb-4">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New password (min 8 characters)"
                className="w-full p-3 rounded-lg bg-[#171515] text-white border border-[#2b2524] placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9593] text-sm hover:text-white transition-colors"
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Password strength hint */}
            {newPassword.length > 0 && newPassword.length < 8 && (
              <p className="text-yellow-500 text-xs mb-3">
                Password needs at least 8 characters ({newPassword.length}/8)
              </p>
            )}

            <button
              type="submit"
              disabled={forgotLoading || newPassword.length < 8}
              className="bg-[#c45a45] hover:bg-[#a64633] w-full p-3 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {forgotLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;