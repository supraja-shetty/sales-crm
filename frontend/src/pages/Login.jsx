import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("admin@crm.local");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("crm_token", data.token);
      localStorage.setItem("crm_user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand centered">
          <div className="brand-mark">S</div>
          <div>
            <strong>Sales CRM</strong>
            
          </div>
        </div>
        <h2>Welcome back</h2>
        <p className="muted">Sign in to manage your sales pipeline.</p>

        <form onSubmit={submit} className="form-stack">
          <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required /></label>
          <label>Password<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required /></label>
          {error && <div className="alert error">{error}</div>}
          <button className="primary-btn" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>

        {/*
<div className="demo-login"> 
  <strong>Demo credentials</strong> 
  <span>admin@crm.local / Admin@123</span> 
</div>
*/}
      </div>
    </div>
  );
}
