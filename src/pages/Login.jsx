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

  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password States
  const [forgotMode, setForgotMode] = useState(false);
  const [email, setEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("token/", form);

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      const profile = await API.get("user-dashboard/");
      const role = profile.data.profile.role;

      localStorage.setItem("role", role);

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

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setForgotLoading(true);
    setForgotMessage("");

    try {
      // Replace this later with your backend API
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      setForgotMessage(
        "If this email exists, a password reset link will be sent."
      );
    } catch (err) {
      setForgotMessage(
        "Unable to process request. Please try again."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#171515]">
      <form
        onSubmit={forgotMode ? handleForgotPassword : submit}
        className="bg-[#1c1919] border border-[#2b2524] p-8 rounded-xl w-96 shadow-2xl"
      >
        <h1 className="text-white text-2xl mb-6 font-bold">
          {forgotMode ? "Forgot Password" : "Login"}
        </h1>

        {error && !forgotMode && (
          <p className="text-red-400 text-sm mb-4">
            {error}
          </p>
        )}

        {forgotMessage && forgotMode && (
          <p className="text-green-400 text-sm mb-4">
            {forgotMessage}
          </p>
        )}

        {!forgotMode ? (
          <>
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

            <div className="relative mb-3">
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

            <div className="text-right mb-5">
              <button
                type="button"
                onClick={() => {
                  setForgotMode(true);
                  setError("");
                }}
                className="text-[#c45a45] text-sm hover:underline"
              >
                Forgot Password?
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
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 mb-4 rounded-lg bg-[#171515] text-white border border-[#2b2524] placeholder-[#9e9593] focus:outline-none focus:border-[#c45a45]"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <button
              type="submit"
              className="bg-[#c45a45] hover:bg-[#a64633] w-full p-3 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              disabled={forgotLoading}
            >
              {forgotLoading
                ? "Sending..."
                : "Send Reset Link"}
            </button>

            <button
              type="button"
              onClick={() => {
                setForgotMode(false);
                setForgotMessage("");
                setEmail("");
              }}
              className="w-full mt-3 text-[#c45a45] hover:underline"
            >
              Back to Login
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;