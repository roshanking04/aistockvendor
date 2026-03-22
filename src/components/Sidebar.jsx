import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const NAV = [
  { label: "Dashboard",   path: "/dashboard", icon: "◈" },
  { label: "Products",    path: "/products",  icon: "◉" },
  { label: "Billing",     path: "/billing",   icon: "◎" },
  { label: "Add Product", path: "/add",       icon: "⊕" },
];

export default function Sidebar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const user = {
    fullName: localStorage.getItem("fullName") || "Admin",
    role:     localStorage.getItem("role")     || "ADMIN",
  };

  const initials = user.fullName
    .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <aside className={`sb-root${mounted ? " sb-mounted" : ""}`}>

      {/* Subtle background glow */}
      <div className="sb-glow-top" />
      <div className="sb-glow-bottom" />

      {/* ── LOGO ── */}
      <div className="sb-logo">
        <div className="sb-logo-mark">
          <span>AI</span>
          <div className="sb-logo-ring" />
        </div>
        <span className="sb-logo-text">STOCK<em>VENDOR</em></span>
      </div>

      {/* ── NAV ── */}
      <nav className="sb-nav">
        {NAV.map(({ label, path, icon }, i) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `sb-item${isActive ? " active" : ""}`}
            style={{ animationDelay: `${0.05 + i * 0.07}s` }}
          >
            {/* Active background shimmer */}
            <span className="sb-item-shine" />

            <span className="sb-icon">{icon}</span>
            <span className="sb-label">{label}</span>
            <span className="sb-arrow">›</span>
          </NavLink>
        ))}
      </nav>

      {/* ── FOOTER ── */}
      <div className="sb-footer">
        <div className="sb-avatar">
          <span>{initials}</span>
          <div className="sb-avatar-ring" />
        </div>
        <div className="sb-user">
          <div className="sb-user-name">{user.fullName}</div>
          <div className="sb-user-role">{user.role}</div>
        </div>
        <div className="sb-status" title="Online">
          <div className="sb-status-ping" />
        </div>
      </div>

    </aside>
  );
}
