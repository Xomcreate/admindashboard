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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await API.post("register/", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      alert("Account created successfully");
      navigate("/");
    } catch (err) {
      console.log(err.response?.data);
      setError("Registration failed");
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

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

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
        Toggle
      </button>

      <input
        type={showConfirm ? "text" : "password"}
        placeholder="Confirm Password"
        value={form.confirm_password}
        onChange={(e) =>
          setForm({
            ...form,
            confirm_password: e.target.value,
          })
        }
      />

      <button
        type="button"
        onClick={() => setShowConfirm(!showConfirm)}
      >
        Toggle
      </button>

      <button disabled={loading}>
        {loading ? "Creating..." : "Register"}
      </button>

      <Link to="/">Login</Link>
    </form>
  );
};

export default Register;