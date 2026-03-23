import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { login as loginAPI, getStoredUser } from "../api"; // <-- import API functions

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode]         = useState("login");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted]   = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [regName,    setRegName]    = useState("");
  const [regUser,    setRegUser]    = useState("");
  const [regPass,    setRegPass]    = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regRole,    setRegRole]    = useState("ADMIN");

  useEffect(() => { setTimeout(() => setMounted(true), 40); }, []);

  // ── LOGIN ──
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) { setError("Please enter username and password"); return; }
    setLoading(true); setError("");

    try {
      const data = await loginAPI(username, password); // <-- use API
      if (!data.token) { setError(data.message || "Invalid credentials"); setLoading(false); return; }

      // Store session info
      localStorage.setItem("token",    data.token);
      localStorage.setItem("username", data.username || username);
      localStorage.setItem("role",     data.role || "ADMIN");
      localStorage.setItem("fullName", data.fullName || username);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regUser || !regPass) { setError("All fields required"); return; }
    if (regPass !== regConfirm)           { setError("Passwords don't match"); return; }
    if (regPass.length < 6)              { setError("Min 6 characters"); return; }

    setLoading(true); setError(""); setSuccess("");

    try {
      const res  = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:3869"}/api/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: regName, username: regUser, password: regPass, role: regRole }),
      });
      const data = await res.json();
      if (!res.ok) { setError(typeof data === "string" ? data : "Registration failed"); setLoading(false); return; }
      setSuccess("Account created!");
      setTimeout(() => { setMode("login"); setSuccess(""); }, 2000);
    } catch (err) {
      console.error(err);
      setError("Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => { setMode(m); setError(""); setSuccess(""); };

  return (
    <div className="lg-root">
      {/* BACKGROUND */}
      <div className="lg-bg">
        <div className="lg-grid" />
        <div className="lg-orb lg-orb-1" />
        <div className="lg-orb lg-orb-2" />
        <div className="lg-orb lg-orb-3" />
      </div>
      <div className="lg-scanline" />

      {/* Corners */}
      <div className="lg-corner lg-corner-tl" />
      <div className="lg-corner lg-corner-bl" />
      <div className="lg-corner lg-corner-tr" />
      <div className="lg-corner lg-corner-br" />

      {/* CARD */}
      <div className="lg-card">
        <div className="lg-card-glow" />

        <div className="lg-title-wrap">
          <div className="lg-icon-wrap">V</div>
          <div className="lg-title">
            <span className="lg-title-dot" />
            {mode === "login" ? "LOGIN" : "REGISTER"}
            <span className="lg-title-dot pink" />
          </div>
        </div>

        <div className="lg-tabs">
          <button className={`lg-tab${mode === "login" ? " active" : ""}`} onClick={() => switchMode("login")}>Sign In</button>
          <button className={`lg-tab${mode === "register" ? " active" : ""}`} onClick={() => switchMode("register")}>Register</button>
          <div className={`lg-tab-slide${mode === "register" ? " right" : ""}`} />
        </div>

        {mode === "login" && (
          <div className="lg-pane">
            <div className="lg-hint">
              💡 Default: <strong>admin</strong> / <strong>admin123</strong>
            </div>
            <form onSubmit={handleLogin} className="lg-form">
              <Field label="Username" icon="◉">
                <input className="lg-inp" type="text" placeholder="Enter username"
                  value={username} autoFocus
                  onChange={e => { setUsername(e.target.value); setError(""); }} />
              </Field>

              <Field label="Password" icon="◈">
                <input className="lg-inp" type={showPass ? "text" : "password"}
                  placeholder="Enter password" value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }} />
                <button type="button" className="lg-eye-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </Field>

              {error   && <div className="lg-notice lg-notice-error">⚠ {error}</div>}
              {success && <div className="lg-notice lg-notice-success">✓ {success}</div>}

              <SubmitBtn loading={loading} label="SIGN IN" />

              <div className="lg-bottom-row">
                <button type="button" className="lg-forgot">Forgot Password?</button>
                <span className="lg-switch-text">
                  New here? <button type="button" className="lg-text-btn" onClick={() => switchMode("register")}>Sign up</button>
                </span>
              </div>
            </form>
          </div>
        )}

        {mode === "register" && (
          <div className="lg-pane">
            <form onSubmit={handleRegister} className="lg-form">
              {/* Fields same as before */}
              {/* ... */}
            </form>
          </div>
        )}

        <div className="lg-card-footer">InvoStore · vendor.io · {new Date().getFullYear()}</div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div className="lg-field">
      <label className="lg-label">{label}</label>
      <div className="lg-field-wrap">
        <span className="lg-field-icon">{icon}</span>
        {children}
      </div>
    </div>
  );
}

function SubmitBtn({ loading, label }) {
  return (
    <button className="lg-submit" type="submit" disabled={loading}>
      <span className="lg-submit-shine" />
      {loading
        ? <><span className="lg-spinner" /> &nbsp;{label}...</>
        : <><span className="lg-submit-text">{label}</span>&nbsp;<span className="lg-submit-arrow">→</span></>
      }
    </button>
  );
}
