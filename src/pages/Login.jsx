import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../api/api";
import { useAuth } from "../context/AuthContext";
import './css/login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiService({
        url: "/api/auth/admin",
        method: "POST",
        data: { username, password },
      });

      localStorage.setItem("token", data.token);
      login(data.user, data.token);

      // 👇 Force redirect after login
      navigate("/", { replace: true });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
