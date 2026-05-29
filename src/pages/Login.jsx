import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // LOGIN
      const res = await API.post("token/", form);

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      // GET USER ROLE
      const profile = await API.get("user-dashboard/");
      const role = profile.data.profile.role;

      localStorage.setItem("role", role);

      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.log(err.response?.data);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
      />

      <div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <button disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <Link to="/register">Register</Link>
    </form>
  );
};

export default Login;