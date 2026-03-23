import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";

const NAV = [
  { to: "/dashboard",  label: "Dashboard",   icon: "◈" },
  { to: "/products",   label: "Products",    icon: "◉" },
  { to: "/billing",    label: "Billing",     icon: "⊕" },
  { to: "/add",        label: "Add Product", icon: "✦" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const fullName = localStorage.getItem("fullName") || "Admin";
  const role     = localStorage.getItem("role")     || "ADMIN";
  const initials = fullName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  // Close sidebar on route change (mobile)
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button className="sb-hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
        <span /><span /><span />
      </button>

      {/* Overlay — mobile only */}
      <div className={`sb-overlay${open ? " open" : ""}`} onClick={() => setOpen(false)} />

      {/* Sidebar */}
      <nav className={`sb-root${open ? " mobile-open" : ""}`}>
        {/* Logo */}
        <div className="sb-logo-wrap">
          <div className="sb-logo-ring">AI</div>
          <div className="sb-logo-text">STOCK<span>VENDOR</span></div>
        </div>

        {/* Nav links */}
        <div className="sb-nav">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sb-nav-item${isActive ? " active" : ""}`}
            >
              <span className="sb-nav-icon">{item.icon}</span>
              <span className="sb-nav-label">{item.label}</span>
              <span className="sb-nav-arrow">›</span>
            </NavLink>
          ))}
        </div>

        {/* User */}
        <div className="sb-user">
          <div className="sb-avatar">
            <span>{initials}</span>
            <div className="sb-avatar-ring" />
          </div>
          <div className="sb-user-info">
            <div className="sb-user-name">{fullName}</div>
            <div className="sb-user-role">{role}</div>
          </div>
          <div className="sb-status-wrap">
            <div className="sb-status-dot" />
            <div className="sb-status-ping" />
          </div>
        </div>
      </nav>
    </>
  );
}
